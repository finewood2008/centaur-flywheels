// ================================================================
// 半人马-飞轮 类型定义
// ================================================================

// --- 导航 ---
export type TabId = 'flywheel' | 'scanner' | 'content' | 'brand' | 'settings';

// --- 通用 ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

// --- GEO 扫描 ---
export type GEOStatus = 'not_scanned' | 'scanning' | 'scanned' | 'error';

export interface GEOQuery {
  id: string;
  query: string;           // 用户搜索的问题
  platform: 'perplexity' | 'chatgpt' | 'gemini' | 'kimi';
  result?: GEOResult;
  scannedAt?: string;
}

export interface GEOResult {
  mentioned: boolean;       // 品牌是否被提及
  position?: number;        // 提及位置（第几段/第几条）
  context: string;          // 提及上下文
  competitors: string[];    // 同时被提及的竞品
  sentiment: 'positive' | 'neutral' | 'negative';
  sources: GEOSource[];     // AI 引用的来源
  screenshot?: string;      // 截图路径
  rawResponse: string;      // 原始回答
}

export interface GEOSource {
  title: string;
  url: string;
  domain: string;
  isOwned: boolean;         // 是否是自有内容
}

export interface GEOReport {
  id: string;
  brandName: string;
  queries: GEOQuery[];
  overallScore: number;     // 0-100 GEO 可见度评分
  summary: string;          // AI 生成的诊断摘要
  recommendations: string[];
  createdAt: string;
}

// --- 内容管线 ---
export type ContentStatus = 'idea' | 'draft' | 'reviewing' | 'approved' | 'published' | 'rejected';
export type ContentPlatform = 'blog' | 'xiaohongshu' | 'wechat' | 'zhihu' | 'douyin' | 'linkedin';
export type ContentType = 'geo-optimized' | 'social' | 'thought-leadership' | 'case-study';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  platform: ContentPlatform;
  status: ContentStatus;
  targetQueries: string[];   // 对标的 GEO 查询
  keywords: string[];
  coverImage?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledAt?: string;      // 排期时间
  metrics?: ContentMetrics;
  geoImpact?: GEOImpact;    // 发布后的 GEO 影响追踪
}

export interface ContentMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
}

export interface GEOImpact {
  beforeScore: number;
  afterScore: number;
  queriesImproved: string[];
  measuredAt: string;
}

// --- 品牌档案 ---
export interface BrandProfile {
  name: string;
  nameEn?: string;
  industry: string;
  mainBusiness: string;
  targetCustomer: string;
  differentiation: string;
  toneOfVoice: string;
  keywords: string[];
  tabooWords: string[];
  competitors: string[];
  ownedDomains: string[];    // 自有域名/平台账号
  initialized: boolean;
  initStep: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  titleStyle: string;
  contentLength: string;
  emojiDensity: string;
  hashtagStyle: string;
  writingTone: string;
  avoidPatterns: string[];
  preferPatterns: string[];
  platformNotes: Record<string, string>;
  updatedAt?: string;
}

export interface BusinessContext {
  recentProducts: string[];
  currentCampaigns: string[];
  upcomingEvents: string[];
  hotTopics: string[];
  competitorMoves: string[];
  notes: string;
  updatedAt?: string;
}

export interface LearningEntry {
  id: string;
  type: 'edit' | 'feedback' | 'performance' | 'preference' | 'geo';
  category: string;
  insight: string;
  evidence: string;
  confidence: number;
  timestamp: string;
}

// --- 飞轮仪表盘 ---
export interface FlywheelStats {
  geoScore: number;          // 当前 GEO 可见度评分
  geoTrend: number;          // 较上周变化
  contentCount: number;      // 内容总数
  publishedThisWeek: number;
  scheduledCount: number;    // 排期中的内容
  topQueries: { query: string; score: number; trend: number }[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'scan' | 'content' | 'publish' | 'geo_change';
  title: string;
  description: string;
  timestamp: string;
}

// --- 排期 ---
export interface ScheduleConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek: number[];
  platforms: ContentPlatform[];
  topics: string[];
  style: string;
  postsPerDay: number;
  autoScan: boolean;         // 自动 GEO 扫描
  scanFrequency: 'daily' | 'weekly' | 'biweekly';
  nextRunAt?: string;
}

// --- 设置 ---
export interface AppSettings {
  // 文本模型
  provider: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  // 图片模型
  imageProvider: string;
  imageApiKey: string;
  imageModel: string;
  // GEO 扫描 API
  perplexityApiKey: string;
  serpApiKey: string;
  screenshotApiKey: string;
}

// --- Window 类型声明 ---
declare global {
  interface Window {
    flywheel: {
      chat: {
        send: (message: string, history: any[]) => Promise<string>;
      };
      scanner: {
        scan: (queries: string[]) => Promise<GEOReport>;
        getReports: () => Promise<GEOReport[]>;
        getLatestReport: () => Promise<GEOReport | null>;
      };
      content: {
        generate: (params: any) => Promise<ContentItem>;
        list: () => Promise<ContentItem[]>;
        save: (item: any) => Promise<ContentItem>;
        update: (id: string, data: any) => Promise<ContentItem>;
        delete: (id: string) => Promise<void>;
        publish: (id: string, platform: string) => Promise<void>;
      };
      schedule: {
        get: () => Promise<ScheduleConfig>;
        set: (config: any) => Promise<void>;
        pause: () => Promise<void>;
        resume: () => Promise<void>;
        runOnce: () => Promise<void>;
      };
      memory: {
        getBrand: () => Promise<BrandProfile>;
        updateBrand: (data: any) => Promise<void>;
        getPreferences: () => Promise<UserPreferences>;
        updatePreferences: (data: any) => Promise<void>;
        getContext: () => Promise<BusinessContext>;
        updateContext: (data: any) => Promise<void>;
        getLearnings: () => Promise<LearningEntry[]>;
        getSummary: () => Promise<string>;
      };
      settings: {
        get: () => Promise<AppSettings>;
        update: (data: any) => Promise<void>;
      };
    };
  }
}

export {};
