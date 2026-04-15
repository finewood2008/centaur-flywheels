import React from 'react';
import { useAppStore } from '../store/appStore';
import {
  Gauge, Search, FileText, Bookmark, Settings, Zap
} from 'lucide-react';
import type { TabId } from '../types';

const tabs: { id: TabId; icon: React.ReactNode; label: string }[] = [
  { id: 'flywheel', icon: <Gauge size={20} />, label: '飞轮' },
  { id: 'scanner',  icon: <Search size={20} />, label: '扫描' },
  { id: 'content',  icon: <FileText size={20} />, label: '内容' },
  { id: 'brand',    icon: <Bookmark size={20} />, label: '品牌' },
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="w-[68px] h-full bg-white border-r border-gray-200 flex flex-col items-center py-4 drag-region">
      {/* Logo */}
      <div className="mb-8 mt-2 no-drag">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
          <Zap size={22} className="text-white" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col gap-1 no-drag">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5
                transition-all duration-200 relative group
                ${isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-600 rounded-r-full" />
              )}
              {tab.icon}
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings */}
      <div className="no-drag mb-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
