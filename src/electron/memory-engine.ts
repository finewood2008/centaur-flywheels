/**
 * 记忆引擎 (Memory Engine) — 半人马飞轮版
 * 
 * 五层记忆结构：
 * 1. brand.json       — 品牌基础档案
 * 2. preferences.json  — 用户创作偏好
 * 3. context.json      — 近期动态
 * 4. learnings.json    — 行为学习日志
 * 5. geo-history.json  — GEO 扫描历史
 */

import * as fs from 'fs';
import * as path from 'path';
import type { BrandProfile, UserPreferences, BusinessContext, LearningEntry, GEOReport, AppSettings } from '../types';

// ---- 默认值 ----
const DEFAULT_BRAND: BrandProfile = {
  name: '', nameEn: '', industry: '', mainBusiness: '',
  targetCustomer: '', differentiation: '', toneOfVoice: '',
  keywords: [], tabooWords: [], competitors: [], ownedDomains: [],
  initialized: false, initStep: 0,
};

const DEFAULT_PREFERENCES: UserPreferences = {
  titleStyle: '', contentLength: '', emojiDensity: '',
  hashtagStyle: '', writingTone: '',
  avoidPatterns: [], preferPatterns: [], platformNotes: {},
};

const DEFAULT_CONTEXT: BusinessContext = {
  recentProducts: [], currentCampaigns: [], upcomingEvents: [],
  hotTopics: [], competitorMoves: [], notes: '',
};

const DEFAULT_SETTINGS: AppSettings = {
  provider: 'gemini', apiKey: '', baseUrl: '', model: 'gemini-2.5-flash',
  imageProvider: 'gemini-imagen', imageApiKey: '', imageModel: 'imagen-3.0-generate-images',
  perplexityApiKey: '', serpApiKey: '', screenshotApiKey: '',
};

export class MemoryEngine {
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  // ---- 通用读写 ----
  private readJSON<T>(filename: string, defaultValue: T): T {
    try {
      const file = path.join(this.dataDir, filename);
      if (!fs.existsSync(file)) return defaultValue;
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      return defaultValue;
    }
  }

  private writeJSON(filename: string, data: any): void {
    fs.writeFileSync(
      path.join(this.dataDir, filename),
      JSON.stringify(data, null, 2)
    );
  }

  // ---- 品牌档案 ----
  readBrand(): BrandProfile {
    return this.readJSON('brand.json', DEFAULT_BRAND);
  }

  writeBrand(data: Partial<BrandProfile>): BrandProfile {
    const current = this.readBrand();
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    this.writeJSON('brand.json', updated);
    return updated;
  }

  // ---- 偏好 ----
  readPreferences(): UserPreferences {
    return this.readJSON('preferences.json', DEFAULT_PREFERENCES);
  }

  writePreferences(data: Partial<UserPreferences>): UserPreferences {
    const current = this.readPreferences();
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    this.writeJSON('preferences.json', updated);
    return updated;
  }

  // ---- 业务上下文 ----
  readContext(): BusinessContext {
    return this.readJSON('context.json', DEFAULT_CONTEXT);
  }

  writeContext(data: Partial<BusinessContext>): BusinessContext {
    const current = this.readContext();
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    this.writeJSON('context.json', updated);
    return updated;
  }

  // ---- 学习日志 ----
  readLearnings(): LearningEntry[] {
    return this.readJSON('learnings.json', []);
  }

  addLearning(entry: Omit<LearningEntry, 'id' | 'timestamp'>): LearningEntry {
    const learnings = this.readLearnings();
    const newEntry: LearningEntry = {
      ...entry,
      id: `learn_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    learnings.unshift(newEntry);
    if (learnings.length > 200) learnings.length = 200;
    this.writeJSON('learnings.json', learnings);
    return newEntry;
  }

  // ---- GEO 扫描历史 ----
  readGEOReports(): GEOReport[] {
    return this.readJSON('geo-history.json', []);
  }

  addGEOReport(report: GEOReport): void {
    const reports = this.readGEOReports();
    reports.unshift(report);
    if (reports.length > 50) reports.length = 50;
    this.writeJSON('geo-history.json', reports);
  }

  getLatestGEOReport(): GEOReport | null {
    const reports = this.readGEOReports();
    return reports[0] || null;
  }

  // ---- 设置 ----
  readSettings(): AppSettings {
    return this.readJSON('settings.json', DEFAULT_SETTINGS);
  }

  writeSettings(data: Partial<AppSettings>): AppSettings {
    const current = this.readSettings();
    const updated = { ...current, ...data };
    this.writeJSON('settings.json', updated);
    return updated;
  }

  // ---- 内容库 ----
  readContents(): any[] {
    return this.readJSON('contents.json', []);
  }

  writeContents(contents: any[]): void {
    this.writeJSON('contents.json', contents);
  }

  // ---- 排期 ----
  readSchedule(): any {
    return this.readJSON('schedule.json', { enabled: false });
  }

  writeSchedule(config: any): void {
    this.writeJSON('schedule.json', config);
  }

  // ---- 记忆摘要（给 AI 用） ----
  getSummary(): string {
    const brand = this.readBrand();
    const prefs = this.readPreferences();
    const ctx = this.readContext();
    const learnings = this.readLearnings().slice(0, 10);

    const parts: string[] = [];

    if (brand.name) {
      parts.push(`品牌：${brand.name}（${brand.industry}）`);
      parts.push(`业务：${brand.mainBusiness}`);
      parts.push(`客群：${brand.targetCustomer}`);
      parts.push(`差异化：${brand.differentiation}`);
      parts.push(`语调：${brand.toneOfVoice}`);
      if (brand.keywords.length) parts.push(`关键词：${brand.keywords.join('、')}`);
      if (brand.competitors.length) parts.push(`竞品：${brand.competitors.join('、')}`);
    }

    if (ctx.recentProducts.length) parts.push(`近期产品：${ctx.recentProducts.join('、')}`);
    if (ctx.hotTopics.length) parts.push(`行业热点：${ctx.hotTopics.join('、')}`);

    if (prefs.writingTone) parts.push(`写作风格：${prefs.writingTone}`);

    if (learnings.length) {
      parts.push('近期洞察：');
      learnings.forEach(l => parts.push(`  - ${l.insight}`));
    }

    return parts.join('\n');
  }
}
