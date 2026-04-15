import React, { useState, useEffect } from 'react';
import { Bookmark, Save, Edit3, X, Plus, Tag } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import type { BrandProfile } from '../../types';

const EMPTY_BRAND: BrandProfile = {
  name: '', nameEn: '', industry: '', mainBusiness: '',
  targetCustomer: '', differentiation: '', toneOfVoice: '',
  keywords: [], tabooWords: [], competitors: [], ownedDomains: [],
  initialized: false, initStep: 0,
};

const FIELDS: { key: keyof BrandProfile; label: string; placeholder: string }[] = [
  { key: 'name', label: '品牌名称', placeholder: '你的品牌叫什么？' },
  { key: 'nameEn', label: '英文名', placeholder: 'English brand name' },
  { key: 'industry', label: '所在行业', placeholder: '比如：科技、餐饮、教育...' },
  { key: 'mainBusiness', label: '主营业务', placeholder: '你的核心业务是什么？' },
  { key: 'targetCustomer', label: '目标客群', placeholder: '你的理想客户是谁？' },
  { key: 'differentiation', label: '差异化', placeholder: '客户为什么选你而不选竞品？' },
  { key: 'toneOfVoice', label: '语调风格', placeholder: '专业严谨 / 轻松活泼 / 温暖亲切...' },
];

function TagInput({ label, tags, onChange, placeholder }: {
  label: string; tags: string[]; onChange: (t: string[]) => void; placeholder: string;
}) {
  const [input, setInput] = useState('');
  const add = () => {
    if (!input.trim()) return;
    onChange([...tags, input.trim()]);
    setInput('');
  };
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
            {t}
            <button onClick={() => onChange(tags.filter((_, idx) => idx !== i))} className="hover:text-red-500">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <button onClick={add} className="h-9 px-3 bg-gray-100 rounded-lg text-xs text-gray-600 hover:bg-gray-200">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export default function BrandPage() {
  const { brand, setBrand } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<BrandProfile>(brand || EMPTY_BRAND);

  useEffect(() => {
    window.flywheel?.memory.getBrand().then(b => {
      setBrand(b);
      setForm(b);
    }).catch(() => {});
  }, []);

  useEffect(() => { if (brand) setForm(brand); }, [brand]);

  const handleSave = async () => {
    const updated = { ...form, initialized: true, updatedAt: new Date().toISOString() };
    await window.flywheel?.memory.updateBrand(updated);
    setBrand(updated);
    setEditing(false);
  };

  const updateField = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white drag-region shadow-sm">
        <div className="no-drag flex items-center gap-2">
          <Bookmark size={18} className="text-blue-600" />
          <span className="text-[15px] font-bold text-gray-800">品牌档案</span>
        </div>
        <div className="no-drag">
          {editing ? (
            <div className="flex gap-2">
              <button onClick={() => { setForm(brand || EMPTY_BRAND); setEditing(false); }}
                className="px-3 h-8 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={handleSave}
                className="flex items-center gap-1 px-4 h-8 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                <Save size={14} /> 保存
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1 px-3 h-8 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Edit3 size={14} /> 编辑
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Basic Fields */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">基本信息</h3>
            {FIELDS.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                {editing ? (
                  <input value={(form[f.key] as string) || ''} onChange={e => updateField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                ) : (
                  <div className="text-sm text-gray-800 py-1">{(form[f.key] as string) || <span className="text-gray-300">未填写</span>}</div>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">关键词与标签</h3>
            {editing ? (
              <>
                <TagInput label="品牌关键词" tags={form.keywords} onChange={t => updateField('keywords', t)} placeholder="添加关键词" />
                <TagInput label="禁用词" tags={form.tabooWords} onChange={t => updateField('tabooWords', t)} placeholder="添加禁用词" />
                <TagInput label="竞品" tags={form.competitors} onChange={t => updateField('competitors', t)} placeholder="添加竞品名称" />
                <TagInput label="自有域名/账号" tags={form.ownedDomains} onChange={t => updateField('ownedDomains', t)} placeholder="example.com" />
              </>
            ) : (
              <div className="space-y-3">
                {[
                  { label: '关键词', items: form.keywords },
                  { label: '禁用词', items: form.tabooWords },
                  { label: '竞品', items: form.competitors },
                  { label: '自有域名', items: form.ownedDomains },
                ].map(g => (
                  <div key={g.label}>
                    <div className="text-xs text-gray-500 mb-1">{g.label}</div>
                    <div className="flex flex-wrap gap-1">
                      {g.items?.length ? g.items.map((t, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                      )) : <span className="text-xs text-gray-300">未设置</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
