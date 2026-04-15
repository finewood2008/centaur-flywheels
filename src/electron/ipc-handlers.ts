import { ipcMain, BrowserWindow } from 'electron';
import { MemoryEngine } from './memory-engine';
import { GeminiClient } from './gemini-client';

interface HandlerDeps {
  memory: MemoryEngine;
  geminiClient: GeminiClient | null;
  mainWindow: BrowserWindow | null;
}

export function registerIpcHandlers({ memory, geminiClient, mainWindow }: HandlerDeps) {

  // ================================================================
  // Chat
  // ================================================================
  ipcMain.handle('chat:send', async (_e, message: string, history: any[]) => {
    if (!geminiClient) throw new Error('未配置 API，请先在设置中配置');
    const summary = memory.getSummary();
    const systemPrompt = `你是半人马飞轮的 AI 助手，帮助用户优化品牌在 AI 搜索引擎中的可见度（GEO）。\n\n品牌记忆：\n${summary}`;
    const result = await geminiClient.invokeWithSystem(systemPrompt, message, history);
    return result.text;
  });

  // ================================================================
  // Scanner (GEO)
  // ================================================================
  ipcMain.handle('scanner:scan', async (_e, queries: string[]) => {
    // TODO: 接入 Perplexity/SerpAPI 实际扫描
    // 目前返回 mock 结构
    const brand = memory.readBrand();
    const report = {
      id: `report_${Date.now()}`,
      brandName: brand.name || '未命名品牌',
      queries: queries.map((q, i) => ({
        id: `q_${Date.now()}_${i}`,
        query: q,
        platform: 'perplexity' as const,
        result: {
          mentioned: Math.random() > 0.5,
          position: Math.floor(Math.random() * 5) + 1,
          context: `AI 回答中${Math.random() > 0.5 ? '提及' : '未提及'}了 ${brand.name || '你的品牌'}`,
          competitors: [],
          sentiment: 'neutral' as const,
          sources: [],
          rawResponse: '(mock response)',
        },
        scannedAt: new Date().toISOString(),
      })),
      overallScore: Math.floor(Math.random() * 60) + 20,
      summary: '这是一份模拟报告。接入 Perplexity API 后将提供真实数据。',
      recommendations: [
        '在权威平台发布更多包含品牌关键词的内容',
        '优化官网的结构化数据标记',
        '增加行业媒体的品牌曝光',
      ],
      createdAt: new Date().toISOString(),
    };
    memory.addGEOReport(report);
    return report;
  });

  ipcMain.handle('scanner:getReports', async () => {
    return memory.readGEOReports();
  });

  ipcMain.handle('scanner:getLatestReport', async () => {
    return memory.getLatestGEOReport();
  });

  // ================================================================
  // Content
  // ================================================================
  ipcMain.handle('content:generate', async (_e, params: any) => {
    if (!geminiClient) throw new Error('未配置 API');
    const summary = memory.getSummary();
    const prompt = `基于以下品牌信息，生成一篇 GEO 优化的内容。要求：标题吸引人，内容包含品牌关键词，适合被 AI 搜索引擎引用。\n\n${summary}\n\n类型：${params.type || 'geo-optimized'}\n\n请返回 JSON 格式：{"title":"...","content":"...","keywords":["..."],"platform":"blog"}`;
    const result = await geminiClient.invoke(prompt);
    let parsed: any;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: '生成内容', content: result.text };
    } catch {
      parsed = { title: '生成内容', content: result.text };
    }
    const item = {
      id: `content_${Date.now()}`,
      title: parsed.title || '',
      content: parsed.content || '',
      type: params.type || 'geo-optimized',
      platform: parsed.platform || 'blog',
      status: 'draft',
      targetQueries: [],
      keywords: parsed.keywords || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const contents = memory.readContents();
    contents.unshift(item);
    memory.writeContents(contents);
    return item;
  });

  ipcMain.handle('content:list', async () => {
    return memory.readContents();
  });

  ipcMain.handle('content:save', async (_e, item: any) => {
    const contents = memory.readContents();
    contents.unshift({ ...item, id: item.id || `content_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    memory.writeContents(contents);
    return contents[0];
  });

  ipcMain.handle('content:update', async (_e, id: string, data: any) => {
    const contents = memory.readContents();
    const idx = contents.findIndex((c: any) => c.id === id);
    if (idx === -1) throw new Error('Content not found');
    contents[idx] = { ...contents[idx], ...data, updatedAt: new Date().toISOString() };
    memory.writeContents(contents);
    return contents[idx];
  });

  ipcMain.handle('content:delete', async (_e, id: string) => {
    const contents = memory.readContents().filter((c: any) => c.id !== id);
    memory.writeContents(contents);
  });

  ipcMain.handle('content:publish', async (_e, id: string, platform: string) => {
    // TODO: 接入实际发布 API
    const contents = memory.readContents();
    const idx = contents.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      contents[idx].status = 'published';
      contents[idx].publishedAt = new Date().toISOString();
      memory.writeContents(contents);
    }
  });

  // ================================================================
  // Schedule
  // ================================================================
  ipcMain.handle('schedule:get', async () => memory.readSchedule());
  ipcMain.handle('schedule:set', async (_e, config: any) => memory.writeSchedule(config));
  ipcMain.handle('schedule:pause', async () => memory.writeSchedule({ ...memory.readSchedule(), enabled: false }));
  ipcMain.handle('schedule:resume', async () => memory.writeSchedule({ ...memory.readSchedule(), enabled: true }));
  ipcMain.handle('schedule:runOnce', async () => { /* TODO */ });

  // ================================================================
  // Memory
  // ================================================================
  ipcMain.handle('memory:getBrand', async () => memory.readBrand());
  ipcMain.handle('memory:updateBrand', async (_e, data: any) => memory.writeBrand(data));
  ipcMain.handle('memory:getPreferences', async () => memory.readPreferences());
  ipcMain.handle('memory:updatePreferences', async (_e, data: any) => memory.writePreferences(data));
  ipcMain.handle('memory:getContext', async () => memory.readContext());
  ipcMain.handle('memory:updateContext', async (_e, data: any) => memory.writeContext(data));
  ipcMain.handle('memory:getLearnings', async () => memory.readLearnings());
  ipcMain.handle('memory:getSummary', async () => memory.getSummary());

  // ================================================================
  // Settings
  // ================================================================
  ipcMain.handle('settings:get', async () => memory.readSettings());
  ipcMain.handle('settings:update', async (_e, data: any) => {
    const updated = memory.writeSettings(data);
    // 重新初始化 geminiClient 如果 key 变了
    return updated;
  });
}
