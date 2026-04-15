import { create } from 'zustand';
import type {
  TabId, ChatMessage, ContentItem, ScheduleConfig,
  BrandProfile, LearningEntry, FlywheelStats, GEOReport,
} from '../types';

interface AppState {
  // 导航
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // 对话
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;

  // GEO 扫描
  latestReport: GEOReport | null;
  setLatestReport: (r: GEOReport | null) => void;
  isScanning: boolean;
  setIsScanning: (v: boolean) => void;

  // 内容
  contents: ContentItem[];
  setContents: (c: ContentItem[]) => void;
  selectedContentId: string | null;
  setSelectedContentId: (id: string | null) => void;

  // 排期
  schedule: ScheduleConfig | null;
  setSchedule: (s: ScheduleConfig) => void;

  // 品牌
  brand: BrandProfile | null;
  setBrand: (b: BrandProfile) => void;
  learnings: LearningEntry[];
  setLearnings: (l: LearningEntry[]) => void;

  // 飞轮仪表盘
  stats: FlywheelStats | null;
  setStats: (s: FlywheelStats) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'flywheel',
  setActiveTab: (tab) => set({ activeTab: tab }),

  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),

  latestReport: null,
  setLatestReport: (latestReport) => set({ latestReport }),
  isScanning: false,
  setIsScanning: (v) => set({ isScanning: v }),

  contents: [],
  setContents: (contents) => set({ contents }),
  selectedContentId: null,
  setSelectedContentId: (id) => set({ selectedContentId: id }),

  schedule: null,
  setSchedule: (schedule) => set({ schedule }),

  brand: null,
  setBrand: (brand) => set({ brand }),
  learnings: [],
  setLearnings: (learnings) => set({ learnings }),

  stats: null,
  setStats: (stats) => set({ stats }),
}));
