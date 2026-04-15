/**
 * Gemini 直连客户端
 * 通过 CF Worker 代理或直连 Google API 调用 Gemini
 * 兼容 OpenAI 格式
 */

interface GeminiClientConfig {
  apiKey: string;
  baseUrl: string;  // CF Worker 代理地址或自定义 API 地址
  model: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  text: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GeminiClient {
  private config: GeminiClientConfig;

  constructor(config: GeminiClientConfig) {
    this.config = config;
  }

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    const url = `${this.config.baseUrl}/v1/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API 调用失败 (${response.status}): ${errText}`);
    }

    const data = await response.json() as any;
    const choice = data.choices?.[0];

    return {
      text: choice?.message?.content || '',
      usage: data.usage,
    };
  }

  async invoke(prompt: string): Promise<ChatResponse> {
    return this.chat([{ role: 'user', content: prompt }]);
  }

  async invokeWithSystem(systemPrompt: string, userMessage: string, history: ChatMessage[] = []): Promise<ChatResponse> {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage },
    ];
    return this.chat(messages);
  }
}
