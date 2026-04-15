import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, MessageSquare, Search, Image as ImageIcon } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    provider: 'gemini', apiKey: '', baseUrl: '', model: 'gemini-2.5-flash',
    imageProvider: 'gemini-imagen', imageApiKey: '', imageModel: 'imagen-3.0-generate-images',
    perplexityApiKey: '', serpApiKey: '', screenshotApiKey: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.flywheel?.settings.get().then(data => {
      if (data) setSettings(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await window.flywheel?.settings.update(settings);
    setTimeout(() => setSaving(false), 500);
  };

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-5">
        {icon}
        <h2 className="text-sm font-bold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Field = ({ label, value, onChange, type = 'text', placeholder = '' }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white drag-region shadow-sm">
        <div className="no-drag flex items-center gap-2">
          <SettingsIcon size={18} className="text-blue-600" />
          <span className="text-[15px] font-bold text-gray-800">系统设置</span>
        </div>
        <div className="no-drag">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1 px-4 h-8 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Save size={14} /> {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Section title="文本引擎" icon={<MessageSquare size={16} className="text-blue-600" />}>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">服务商</label>
              <select value={settings.provider} onChange={e => setSettings({ ...settings, provider: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none bg-gray-50">
                <option value="gemini">Google Gemini</option>
                <option value="vveai">vveai 中转</option>
                <option value="custom">自定义 (OpenAI 兼容)</option>
              </select>
            </div>
            <Field label="API Key" value={settings.apiKey} onChange={v => setSettings({ ...settings, apiKey: v })} type="password" />
            <Field label="Base URL" value={settings.baseUrl} onChange={v => setSettings({ ...settings, baseUrl: v })} placeholder="留空使用默认" />
            <Field label="模型" value={settings.model} onChange={v => setSettings({ ...settings, model: v })} />
          </Section>

          <Section title="GEO 扫描 API" icon={<Search size={16} className="text-blue-600" />}>
            <Field label="Perplexity API Key" value={settings.perplexityApiKey} onChange={v => setSettings({ ...settings, perplexityApiKey: v })} type="password" />
            <Field label="SerpAPI Key" value={settings.serpApiKey} onChange={v => setSettings({ ...settings, serpApiKey: v })} type="password" />
            <Field label="Screenshot API Key" value={settings.screenshotApiKey} onChange={v => setSettings({ ...settings, screenshotApiKey: v })} type="password" />
          </Section>

          <Section title="图片引擎" icon={<ImageIcon size={16} className="text-blue-600" />}>
            <Field label="图片 API Key" value={settings.imageApiKey} onChange={v => setSettings({ ...settings, imageApiKey: v })} type="password" />
            <Field label="图片模型" value={settings.imageModel} onChange={v => setSettings({ ...settings, imageModel: v })} />
          </Section>
        </div>
      </div>
    </div>
  );
}
