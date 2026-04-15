import React, { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, Filter, Loader2, Sparkles, Clock, CheckCircle2, Send } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import type { ContentItem, ContentStatus, ContentPlatform } from '../../types';

const STATUS_MAP: Record<ContentStatus, { label: string; color: string }> = {
  idea: { label: '灵感', color: 'bg-purple-100 text-purple-600' },
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-600' },
  reviewing: { label: '审核中', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: '已通过', color: 'bg-green-100 text-green-600' },
  published: { label: '已发布', color: 'bg-blue-100 text-blue-600' },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-600' },
};

const PLATFORM_MAP: Record<ContentPlatform, string> = {
  blog: '博客', xiaohongshu: '小红书', wechat: '公众号',
  zhihu: '知乎', douyin: '抖音', linkedin: 'LinkedIn',
};

export default function ContentPage() {
  const { contents, setContents, selectedContentId, setSelectedContentId } = useAppStore();
  const [filter, setFilter] = useState<ContentStatus | 'all'>('all');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    window.flywheel?.content.list().then(setContents).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? contents : contents.filter(c => c.status === filter);
  const selected = contents.find(c => c.id === selectedContentId);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const item = await window.flywheel?.content.generate({ type: 'geo-optimized' });
      if (item) setContents([item, ...contents]);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white drag-region shadow-sm">
        <div className="no-drag flex items-center gap-2">
          <FileText size={18} className="text-blue-600" />
          <span className="text-[15px] font-bold text-gray-800">内容管理</span>
        </div>
        <div className="no-drag flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 px-4 h-8 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            AI 生成
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          {/* Filter */}
          <div className="p-3 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
            {(['all', 'idea', 'draft', 'reviewing', 'approved', 'published'] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                  filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? '全部' : STATUS_MAP[s].label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">暂无内容</div>
            ) : (
              filtered.map(item => (
                <div key={item.id}
                  onClick={() => setSelectedContentId(item.id)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                    selectedContentId === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${STATUS_MAP[item.status].color}`}>
                      {STATUS_MAP[item.status].label}
                    </span>
                    <span className="text-[10px] text-gray-400">{PLATFORM_MAP[item.platform]}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || '无标题'}</div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">{item.content}</div>
                  <div className="text-[10px] text-gray-300 mt-2">
                    {new Date(item.updatedAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 overflow-y-auto p-6">
          {selected ? (
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_MAP[selected.status].color}`}>
                  {STATUS_MAP[selected.status].label}
                </span>
                <span className="text-xs text-gray-400">{PLATFORM_MAP[selected.platform]}</span>
                {selected.scheduledAt && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} /> {new Date(selected.scheduledAt).toLocaleDateString('zh-CN')}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{selected.title}</h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.content}</div>
              {selected.keywords?.length ? (
                <div className="flex flex-wrap gap-1">
                  {selected.keywords.map(k => (
                    <span key={k} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{k}</span>
                  ))}
                </div>
              ) : null}
              {selected.targetQueries?.length ? (
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-2">对标 GEO 查询</div>
                  {selected.targetQueries.map((q, i) => (
                    <div key={i} className="text-xs text-gray-600 py-1">• {q}</div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              选择一篇内容查看详情，或点击「AI 生成」创建新内容
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
