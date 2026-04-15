import React from 'react';
import { Gauge, TrendingUp, TrendingDown, FileText, Search, Zap, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

function StatCard({ label, value, trend, icon }: {
  label: string; value: string; trend?: number; icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function FlywheelPage() {
  const { stats, setActiveTab } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="h-14 flex items-center px-6 border-b border-gray-200 bg-white drag-region shadow-sm">
        <div className="no-drag flex items-center gap-2">
          <Zap size={18} className="text-blue-600" />
          <span className="text-[15px] font-bold text-gray-800">飞轮仪表盘</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={<Gauge size={16} />} label="GEO 可见度" value={stats?.geoScore?.toString() || '--'} trend={stats?.geoTrend} />
          <StatCard icon={<FileText size={16} />} label="内容总数" value={stats?.contentCount?.toString() || '0'} />
          <StatCard icon={<Zap size={16} />} label="本周发布" value={stats?.publishedThisWeek?.toString() || '0'} />
          <StatCard icon={<Search size={16} />} label="排期中" value={stats?.scheduledCount?.toString() || '0'} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">快速操作</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setActiveTab('scanner')}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <Search size={20} className="text-blue-600" />
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-gray-800">GEO 扫描</div>
                <div className="text-xs text-gray-500">检测品牌 AI 可见度</div>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <FileText size={20} className="text-blue-600" />
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-gray-800">创建内容</div>
                <div className="text-xs text-gray-500">AI 生成 GEO 优化内容</div>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
            </button>
            <button
              onClick={() => setActiveTab('brand')}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <Gauge size={20} className="text-blue-600" />
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-gray-800">品牌档案</div>
                <div className="text-xs text-gray-500">管理品牌信息与记忆</div>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Top Queries */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">关键查询追踪</h3>
          {stats?.topQueries?.length ? (
            <div className="space-y-2">
              {stats.topQueries.map((q, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-700">{q.query}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{q.score}</span>
                    <span className={`text-xs ${q.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {q.trend >= 0 ? '+' : ''}{q.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              还没有扫描数据，去「扫描」页面开始第一次 GEO 诊断
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">最近动态</h3>
          {stats?.recentActivity?.length ? (
            <div className="space-y-3">
              {stats.recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="text-sm text-gray-800">{a.title}</div>
                    <div className="text-xs text-gray-400">{a.description}</div>
                  </div>
                  <div className="ml-auto text-xs text-gray-400 shrink-0">
                    {new Date(a.timestamp).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              暂无动态
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
