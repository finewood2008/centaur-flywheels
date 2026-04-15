import React, { useState } from 'react';
import { Search, Play, Loader2, CheckCircle2, XCircle, ExternalLink, Plus, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import type { GEOReport } from '../../types';

export default function ScannerPage() {
  const { isScanning, setIsScanning, latestReport, setLatestReport } = useAppStore();
  const [queries, setQueries] = useState<string[]>(['']);
  const [reports, setReports] = useState<GEOReport[]>([]);

  const addQuery = () => setQueries([...queries, '']);
  const removeQuery = (i: number) => setQueries(queries.filter((_, idx) => idx !== i));
  const updateQuery = (i: number, v: string) => {
    const next = [...queries];
    next[i] = v;
    setQueries(next);
  };

  const runScan = async () => {
    const validQueries = queries.filter(q => q.trim());
    if (!validQueries.length) return;
    setIsScanning(true);
    try {
      const report = await window.flywheel?.scanner.scan(validQueries);
      if (report) {
        setLatestReport(report);
        setReports(prev => [report, ...prev]);
      }
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="h-14 flex items-center px-6 border-b border-gray-200 bg-white drag-region shadow-sm">
        <div className="no-drag flex items-center gap-2">
          <Search size={18} className="text-blue-600" />
          <span className="text-[15px] font-bold text-gray-800">GEO 扫描</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Query Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">输入搜索查询</h3>
          <p className="text-xs text-gray-500 mb-4">输入你的目标客户可能会问 AI 的问题，我们会检测你的品牌是否被提及</p>
          
          <div className="space-y-2">
            {queries.map((q, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => updateQuery(i, e.target.value)}
                  placeholder={`例：${i === 0 ? '哪家公司做AI企业服务比较好' : '推荐一个品牌设计工具'}`}
                  className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                {queries.length > 1 && (
                  <button onClick={() => removeQuery(i)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button onClick={addQuery} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <Plus size={14} /> 添加查询
            </button>
            <div className="flex-1" />
            <button
              onClick={runScan}
              disabled={isScanning || !queries.some(q => q.trim())}
              className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isScanning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              {isScanning ? '扫描中...' : '开始扫描'}
            </button>
          </div>
        </div>

        {/* Latest Report */}
        {latestReport && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">最新报告</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">{latestReport.overallScore}</span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
            </div>
            
            {latestReport.summary && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{latestReport.summary}</p>
            )}

            <div className="space-y-3">
              {latestReport.queries.map((q) => (
                <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  {q.result?.mentioned
                    ? <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                    : <XCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{q.query}</div>
                    {q.result && (
                      <div className="text-xs text-gray-500 mt-1">
                        {q.result.mentioned
                          ? `被提及 · 位置 #${q.result.position || '?'} · ${q.result.sentiment}`
                          : '未被提及'
                        }
                      </div>
                    )}
                    {q.result?.sources?.length ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {q.result.sources.slice(0, 3).map((s, si) => (
                          <a key={si} href={s.url} target="_blank" rel="noreferrer"
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                              s.isOwned ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {s.domain} <ExternalLink size={10} />
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {latestReport.recommendations?.length ? (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-600 mb-2">优化建议</h4>
                <ul className="space-y-1">
                  {latestReport.recommendations.map((r, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}

        {/* History */}
        {reports.length > 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">历史报告</h3>
            <div className="space-y-2">
              {reports.slice(1).map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setLatestReport(r)}
                >
                  <span className="text-sm text-gray-700">{new Date(r.createdAt).toLocaleDateString('zh-CN')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{r.overallScore}/100</span>
                    <span className="text-xs text-gray-400">{r.queries.length} 条查询</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
