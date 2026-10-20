import React, { useState, useMemo } from 'react';
import { DigitalHumanCustomer, TagDimensionConfig } from '../../types/sparring';
import { Product } from '../../types/product';
import {
  Search,
  Plus,
  Trash2,
  Check,
  Save,
  MessageSquare,
  Sparkles,
  Bot,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  Settings2,
  X,
  Send,
  User,
  Package,
  ExternalLink,
  ShieldAlert,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

const ALL_REGIONS = [
  'kantor pusat', 'Hinihao', 'ACEH', 'BALI', 'BALIKPAPAN', 'BANDUNG',
  'BANJARMASIN', 'BEKASI', 'BOGOR', 'CIREBON', 'JAKARTA', 'JAMBI',
  'KARAWANG', 'LAMPUNG', 'MAKASSAR', 'MALANG', 'DEPOK', 'MANADO',
  'MEDAN', 'PADANG', 'PALEMBANG', 'PEKANBARU', 'PONTIANAK', 'RANTAU',
  'SEMARANG', 'SURABAYA', 'TANGERANG', 'TPP', 'YOGYAKARTA'
];

interface DigitalHumanViewProps {
  digitalHumans: DigitalHumanCustomer[];
  products: Product[];
  tagDimensions: TagDimensionConfig[];
  onSaveDigitalHuman: (dh: DigitalHumanCustomer) => void;
  onDeleteDigitalHuman: (id: string) => void;
  onOpenTagManage: () => void;
  onNavigateToProduct?: (p: Product) => void;
  onOpenTaskPublish?: (product: Product, specificAsset?: any) => void;
}

export const DigitalHumanView: React.FC<DigitalHumanViewProps> = ({
  digitalHumans,
  products,
  tagDimensions,
  onSaveDigitalHuman,
  onDeleteDigitalHuman,
  onOpenTagManage,
  onNavigateToProduct,
  onOpenTaskPublish,
}) => {
  const [selectedDhId, setSelectedDhId] = useState<string>(digitalHumans[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [productFilter, setProductFilter] = useState('ALL');

  // Currently editing state
  const currentDh = useMemo(() => {
    return digitalHumans.find((dh) => dh.id === selectedDhId) || digitalHumans[0];
  }, [digitalHumans, selectedDhId]);

  // Working draft for editing
  const [draftDh, setDraftDh] = useState<DigitalHumanCustomer | null>(null);

  // Sync draft when selectedDhId changes
  React.useEffect(() => {
    if (currentDh) {
      setDraftDh(JSON.parse(JSON.stringify(currentDh)));
    }
  }, [currentDh?.id]);

  // Custom free-text tag input
  const [customTagInput, setCustomTagInput] = useState('');

  // Preview dialog modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewChatTurns, setPreviewChatTurns] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [userChatInput, setUserChatInput] = useState('');

  // Filtered list
  const filteredList = useMemo(() => {
    return digitalHumans.filter((dh) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = dh.name.toLowerCase().includes(q);
        const matchDesc = dh.description.toLowerCase().includes(q);
        const matchTags = Object.values(dh.personaTags)
          .flat()
          .some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchTags) return false;
      }
      if (categoryFilter !== 'ALL' && dh.category !== categoryFilter) return false;
      if (productFilter !== 'ALL' && dh.productId !== productFilter) return false;
      return true;
    });
  }, [digitalHumans, searchQuery, categoryFilter, productFilter]);

  // Associated product object
  const associatedProduct = useMemo(() => {
    if (!draftDh?.productId) return null;
    return products.find((p) => p.id === draftDh.productId) || null;
  }, [products, draftDh?.productId]);

  // Determine which category dimensions should be shown based on associated product
  const applicableCategoryKey = useMemo(() => {
    if (!associatedProduct) return 'MAKEUP';
    const sub = (associatedProduct.subCategory || '').toUpperCase();
    const cat = (associatedProduct.category || '').toUpperCase();
    if (sub === 'HAIR' || associatedProduct.name.includes('洗发') || associatedProduct.name.includes('护发')) {
      return 'HAIR';
    }
    if (sub === 'BODY' || associatedProduct.name.includes('身体') || associatedProduct.name.includes('沐浴')) {
      return 'BODY';
    }
    if (cat === 'SKINCARE' || associatedProduct.name.includes('精华') || associatedProduct.name.includes('面霜')) {
      return 'SKINCARE';
    }
    return 'MAKEUP';
  }, [associatedProduct]);

  // Get active tag dimensions filtered for this asset type & applicable category
  const activeDimensions = useMemo(() => {
    return tagDimensions
      .filter((d) => d.isEnabled)
      .filter((d) => d.assetTarget === 'all' || d.assetTarget === 'digital_human')
      .filter((d) => {
        if (d.applicableCategory === 'ALL') return true;
        if (d.applicableCategory === applicableCategoryKey) return true;
        // Skincare can share Makeup skin types
        if (applicableCategoryKey === 'SKINCARE' && d.applicableCategory === 'MAKEUP') return true;
        return false;
      })
      .sort((a, b) => a.order - b.order);
  }, [tagDimensions, applicableCategoryKey]);

  if (!draftDh) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        请选择或创建一个数字人顾客
      </div>
    );
  }

  // Tag chip click handler
  const handleToggleDimensionTag = (dimName: string, option: string, isSingle: boolean) => {
    setDraftDh((prev) => {
      if (!prev) return prev;
      const currentTags = { ...prev.personaTags };

      // Check which field in personaTags corresponds to dimName
      if (dimName === '顾客人群') {
        const list = currentTags.targetGroups || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        return { ...prev, personaTags: { ...currentTags, targetGroups: next } };
      } else if (dimName === '消费场景') {
        const list = currentTags.scenarios || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        return { ...prev, personaTags: { ...currentTags, scenarios: next } };
      } else if (dimName === '核心需求') {
        const list = currentTags.demands || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        return { ...prev, personaTags: { ...currentTags, demands: next } };
      } else if (dimName === '顾客问题') {
        const list = currentTags.customerConcerns || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        return { ...prev, personaTags: { ...currentTags, customerConcerns: next } };
      } else {
        // Category specific dimensions stored in categoryDimensions map
        const catMap = { ...(currentTags.categoryDimensions || {}) };
        const list = catMap[dimName] || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        catMap[dimName] = next;
        return { ...prev, personaTags: { ...currentTags, categoryDimensions: catMap } };
      }
    });
  };

  const isTagSelected = (dimName: string, option: string): boolean => {
    if (dimName === '顾客人群') return (draftDh.personaTags.targetGroups || []).includes(option);
    if (dimName === '消费场景') return (draftDh.personaTags.scenarios || []).includes(option);
    if (dimName === '核心需求') return (draftDh.personaTags.demands || []).includes(option);
    if (dimName === '顾客问题') return (draftDh.personaTags.customerConcerns || []).includes(option);
    return (draftDh.personaTags.categoryDimensions?.[dimName] || []).includes(option);
  };

  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return;
    const tag = customTagInput.trim();
    const existing = draftDh.personaTags.customTags || [];
    if (!existing.includes(tag)) {
      setDraftDh({
        ...draftDh,
        personaTags: {
          ...draftDh.personaTags,
          customTags: [...existing, tag],
        },
      });
    }
    setCustomTagInput('');
  };

  const handleRemoveCustomTag = (tagToRemove: string) => {
    setDraftDh({
      ...draftDh,
      personaTags: {
        ...draftDh.personaTags,
        customTags: (draftDh.personaTags.customTags || []).filter((t) => t !== tagToRemove),
      },
    });
  };

  const handleCreateNewDh = () => {
    const newId = `dh-custom-${Date.now()}`;
    const newDh: DigitalHumanCustomer = {
      id: newId,
      name: '新数字人顾客',
      avatar: '',
      fullImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      language: '印尼语',
      voiceTone: 'Ramah & Antusias',
      category: '未分类',
      description: '请输入角色描述与年龄、肤质特征...',
      status: 'enabled',
      visibleRegions: ['kantor pusat'],
      productId: products[0]?.id || '',
      productIds: products[0]?.id ? [products[0].id] : [],
      personaTags: {
        targetGroups: ['年轻顾客'],
        scenarios: ['日常通勤'],
        demands: ['控油'],
        customerConcerns: [],
        categoryDimensions: {},
        customTags: [],
      },
      prompt: '你扮演一名专柜顾客，性格友善但对底妆持妆度和脱妆问题有疑虑...',
      scriptOutline: {
        type: 'custom',
        turns: 5,
        outlineSummary: '询问产品功效 -> 提出不脱妆疑问 -> 了解成膜与用法 -> 决定购买',
      },
      createdAt: '2026-10-19',
      updatedAt: '2026-10-19',
      usageCount: 0,
      avgScore: 0,
    };
    onSaveDigitalHuman(newDh);
    setSelectedDhId(newId);
  };

  const handleSave = () => {
    if (!draftDh) return;
    const updated = {
      ...draftDh,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onSaveDigitalHuman(updated);
  };

  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
    setPreviewChatTurns([
      {
        sender: 'ai',
        text: `Halo! Saya ${draftDh.name}. ${draftDh.description}`,
      },
    ]);
  };

  const handleSendPreviewChat = () => {
    if (!userChatInput.trim()) return;
    const userMsg = userChatInput.trim();
    setUserChatInput('');
    setPreviewChatTurns((prev) => [
      ...prev,
      { sender: 'user', text: userMsg },
      {
        sender: 'ai',
        text: `Terima kasih! Sebagai customer, saya sangat mempertimbangkan apakah produk ${associatedProduct?.name || 'ini'} cocok untuk kebutuhan saya (${(draftDh.personaTags.demands || []).join(', ') || '持妆控油'}).`,
      },
    ]);
  };

  return (
    <div className="flex h-full bg-[#FAF9F7] overflow-hidden">
      {/* ================= LEFT COLUMN: Digital Human List (Matching Image 1) ================= */}
      <div className="w-80 md:w-88 bg-white border-r border-[#EAE7E0] flex flex-col shrink-0">
        {/* Header: Title & New Button */}
        <div className="p-4 border-b border-[#EAE7E0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#9E4A2B]" />
            <h2 className="text-sm font-bold text-[#1F2937]">
              数字人顾客 ({filteredList.length})
            </h2>
          </div>
          <button
            onClick={handleCreateNewDh}
            className="px-3 py-1.5 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 border-b border-[#F0ECE3] space-y-2 bg-[#FAF8F5]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜索数字人顾客..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-white border border-[#D6D0C4] rounded-lg focus:outline-none text-[#4B5563]"
            >
              <option value="ALL">全部内容分类</option>
              <option value="未分类">未分类</option>
              <option value="底妆大单品">底妆大单品</option>
              <option value="洗护专区">洗护专区</option>
              <option value="唇部专区">唇部专区</option>
              <option value="护肤大单品">护肤大单品</option>
            </select>

            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-white border border-[#D6D0C4] rounded-lg focus:outline-none text-[#4B5563] truncate"
            >
              <option value="ALL">全部关联产品</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} - {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Digital Human Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
          {filteredList.map((dh) => {
            const isSelected = dh.id === draftDh.id;
            const linkedProd = products.find((p) => p.id === dh.productId);
            return (
              <div
                key={dh.id}
                onClick={() => setSelectedDhId(dh.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border text-xs relative ${
                  isSelected
                    ? 'bg-[#FFF7F2] border-[#E8734A] ring-1 ring-[#E8734A] shadow-xs'
                    : 'bg-white border-[#EAE6DD] hover:border-[#D6D0C4] hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar / Initial */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[#EAE6DD] bg-[#FAF8F5] flex items-center justify-center">
                    {dh.avatar ? (
                      <img src={dh.avatar} alt={dh.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-sm text-[#78716C]">
                        {dh.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-xs text-[#1F2937] truncate leading-tight">
                      {dh.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#78716C] mt-1">
                      <MapPin className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                      <span className="truncate">
                        {dh.visibleRegions.slice(0, 2).join(', ') || 'kantor pusat'}
                      </span>
                    </div>

                    {/* Linked product pill badge */}
                    {linkedProd ? (
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[10px] text-[#9E4A2B] bg-[#FFF0E6] px-1.5 py-0.2 rounded border border-[#FDBA74] truncate max-w-[170px]">
                          📦 {linkedProd.brand} · {linkedProd.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 mt-1 block">未关联产品</span>
                    )}

                    <div className="text-[10px] text-[#9CA3AF] mt-1">
                      创建时间: {dh.createdAt}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`确定要删除数字人《${dh.name}》吗？`)) {
                        onDeleteDigitalHuman(dh.id);
                      }
                    }}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                    title="删除数字人"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= RIGHT COLUMN: Digital Human Edit Workspace (Matching Image 1 & 2) ================= */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#EAE7E0] flex items-center justify-between shrink-0 bg-white">
          <div>
            <h1 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <span>编辑数字人：{draftDh.name}</span>
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              配置角色外观、人格设定及互动流程以用于 BA 陪练
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenPreview}
              className="px-3.5 py-1.5 border border-[#D6D0C4] hover:bg-gray-50 rounded-lg text-xs font-medium text-[#374151] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>对话预览</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存</span>
            </button>

            <span
              className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                draftDh.status === 'enabled'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              {draftDh.status === 'enabled' ? '已启用' : '已停用'}
            </span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FAF9F7] scrollbar-thin">
          {/* Warning Banner from Screenshot */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-800 flex items-start gap-2 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              请尽量详细、准确填写所有提示词和使用提示，这会直接影响最终 AI 陪练和练习效果。
            </span>
          </div>

          {/* CARD 1: 基本信息与形象 (Matching Image 1) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE3]">
              <User className="w-4 h-4 text-[#9E4A2B]" />
              <h3 className="font-bold text-xs text-[#1F2937]">基本信息与形象</h3>
            </div>

            {/* Images: Avatar & Full Image */}
            <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
              {/* Static Avatar */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-2">
                  静态头像
                </label>
                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-[#D6D0C4] bg-[#FAF8F5] flex flex-col items-center justify-center p-2 relative overflow-hidden">
                  {draftDh.avatar ? (
                    <img
                      src={draftDh.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-bold text-2xl text-gray-400 shadow-2xs border border-gray-100">
                      {draftDh.name.charAt(0) || 'A'}
                    </div>
                  )}
                  <span className="absolute bottom-1 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
                    截取头像
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (draftDh.fullImage) {
                        setDraftDh({ ...draftDh, avatar: draftDh.fullImage });
                      }
                    }}
                    className="text-[10px] px-2 py-1 rounded bg-[#F4F2EE] hover:bg-[#EAE6DD] text-[#4B5563] cursor-pointer"
                  >
                    从形象图截取
                  </button>
                  <button
                    type="button"
                    className="text-[10px] px-2 py-1 rounded bg-[#F4F2EE] hover:bg-[#EAE6DD] text-[#4B5563] cursor-pointer"
                  >
                    从图库选择
                  </button>
                </div>
              </div>

              {/* Full Image */}
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-2">
                  上传大图 (用于 App 端对话背景)
                </label>
                <div className="relative rounded-xl border border-[#EAE6DD] overflow-hidden bg-[#FAF8F5] h-32 max-w-md">
                  <img
                    src={
                      draftDh.fullImage ||
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80'
                    }
                    alt="full image"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white text-xs rounded-lg cursor-pointer">
                      更换形象图
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    className="text-[10px] px-2.5 py-1 rounded border border-[#D6D0C4] bg-white hover:bg-gray-50 text-[#374151] cursor-pointer"
                  >
                    从图库选择
                  </button>
                  <button
                    type="button"
                    className="text-[10px] px-2.5 py-1 rounded bg-[#9E4A2B] text-white hover:bg-[#853C21] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>一键 AI 配图</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  * 数字人名称
                </label>
                <input
                  type="text"
                  value={draftDh.name}
                  onChange={(e) => setDraftDh({ ...draftDh, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  * 语种
                </label>
                <select
                  value={draftDh.language}
                  onChange={(e) => setDraftDh({ ...draftDh, language: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white"
                >
                  <option value="印尼语">印尼语 (Bahasa Indonesia)</option>
                  <option value="中文">中文 (普通话)</option>
                  <option value="英语">英语 (English)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  选择音色
                </label>
                <select
                  value={draftDh.voiceTone}
                  onChange={(e) => setDraftDh({ ...draftDh, voiceTone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white"
                >
                  <option value="Pemimpin Dominan">Pemimpin Dominan (成熟干练)</option>
                  <option value="Ramah & Antusias">Ramah & Antusias (亲切热情)</option>
                  <option value="Tenang">Tenang (沉稳温柔)</option>
                  <option value="Ceria">Ceria (活泼少女)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  内容分类
                </label>
                <select
                  value={draftDh.category}
                  onChange={(e) => setDraftDh({ ...draftDh, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white"
                >
                  <option value="未分类">未分类</option>
                  <option value="底妆大单品">底妆大单品</option>
                  <option value="洗护专区">洗护专区</option>
                  <option value="唇部专区">唇部专区</option>
                  <option value="护肤大单品">护肤大单品</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  状态
                </label>
                <div className="flex items-center gap-3 h-9">
                  <span className="text-xs text-[#6B7280]">停用</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraftDh({
                        ...draftDh,
                        status: draftDh.status === 'enabled' ? 'disabled' : 'enabled',
                      })
                    }
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      draftDh.status === 'enabled' ? 'bg-[#9E4A2B]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        draftDh.status === 'enabled' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-semibold text-[#1F2937]">启用</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#1F2937]">
                  角色描述 <span className="font-normal text-[#9CA3AF]">(会在 App 端展示，建议简短清晰)</span>
                </label>
                <span className="text-[10px] text-[#9CA3AF]">
                  {draftDh.description.length}/100
                </span>
              </div>
              <textarea
                rows={2}
                maxLength={100}
                value={draftDh.description}
                onChange={(e) => setDraftDh({ ...draftDh, description: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
              />
            </div>

            {/* Visible Regions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#1F2937]">
                  可见地区
                </label>
                <button
                  type="button"
                  onClick={() => setDraftDh({ ...draftDh, visibleRegions: ['kantor pusat'] })}
                  className="text-[11px] text-[#9E4A2B] hover:underline"
                >
                  重置为默认
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 p-2 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD] max-h-32 overflow-y-auto">
                {ALL_REGIONS.map((reg) => {
                  const isChecked = draftDh.visibleRegions.includes(reg);
                  return (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => {
                        const next = isChecked
                          ? draftDh.visibleRegions.filter((r) => r !== reg)
                          : [...draftDh.visibleRegions, reg];
                        setDraftDh({ ...draftDh, visibleRegions: next });
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {reg} {isChecked && '✕'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 2: ★ 核心新增：关联产品 (从现有产品库选择，建立关联) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#9E4A2B]" />
                <h3 className="font-bold text-xs text-[#1F2937]">
                  关联训练产品 (核心产品库)
                </h3>
                <span className="text-[10px] bg-[#9E4A2B]/10 text-[#9E4A2B] px-2 py-0.5 rounded font-medium">
                  用于产品管理精准匹配与发任务
                </span>
              </div>
              {associatedProduct && onNavigateToProduct && (
                <button
                  type="button"
                  onClick={() => onNavigateToProduct(associatedProduct)}
                  className="text-xs text-[#9E4A2B] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>查看产品详情</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                  选择关联产品 <span className="text-[#9CA3AF] font-normal">(按产品稳定 ID 关联已有产品库)</span>
                </label>
                <select
                  value={draftDh.productId || ''}
                  onChange={(e) => {
                    const chosenId = e.target.value;
                    setDraftDh({
                      ...draftDh,
                      productId: chosenId,
                      productIds: chosenId ? [chosenId] : [],
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FAF8F5] focus:outline-none focus:border-[#9E4A2B] font-semibold text-[#1F2937]"
                >
                  <option value="">-- 请选择关联产品 (选填) --</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      【{prod.brand}】{prod.name} ({prod.roles.join('/') || '普通品'}) · SKU: {prod.sku}
                    </option>
                  ))}
                </select>
              </div>

              {/* Associated Product Card Preview */}
              {associatedProduct ? (
                <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={associatedProduct.image}
                      alt={associatedProduct.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#D6D0C4] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-[#1F2937]">
                          {associatedProduct.name}
                        </span>
                        <span className="text-[10px] bg-[#9E4A2B] text-white px-1.5 py-0.2 rounded font-medium">
                          {associatedProduct.brand}
                        </span>
                        {associatedProduct.roles.map((r, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded border border-amber-200 font-medium"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                      <div className="text-[11px] text-[#6B7280] font-mono truncate mt-0.5">
                        SKU: {associatedProduct.sku} · 品类: {associatedProduct.category} ({associatedProduct.subCategory})
                      </div>
                      <div className="text-[11px] text-[#78716C] line-clamp-1 mt-0.5">
                        卖点：{associatedProduct.sellingPoints.slice(0, 2).join('；')}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {onOpenTaskPublish && (
                      <button
                        type="button"
                        onClick={() => onOpenTaskPublish(associatedProduct, {
                          id: draftDh.id,
                          category: 'practice',
                          title: draftDh.name,
                        })}
                        className="px-3 py-1 bg-[#9E4A2B] text-white rounded-lg text-xs font-semibold hover:bg-[#853C21] transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>用此人发任务</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setDraftDh({
                          ...draftDh,
                          productId: '',
                          productIds: [],
                        })
                      }
                      className="text-[11px] text-[#9CA3AF] hover:text-red-500 cursor-pointer"
                    >
                      解除关联
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 text-center">
                  暂未关联具体产品。关联产品后，在产品详情页能直接聚合展示并自动匹配该数字人练习。
                </div>
              )}
            </div>
          </div>

          {/* CARD 3: ★ 核心升级：多维度画像标签 (按维度选择，所有维度均非必填) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#9E4A2B]" />
                <h3 className="font-bold text-xs text-[#1F2937]">
                  顾客画像标签 (结构化多维选择)
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                  全部可选 / 非必填
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenTagManage}
                className="text-xs text-[#9E4A2B] hover:text-[#7C2D12] font-semibold flex items-center gap-1 cursor-pointer bg-[#FFF0E6] px-2.5 py-1 rounded-lg border border-[#FDBA74]"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>配置标签维度与选项</span>
              </button>
            </div>

            <p className="text-xs text-[#6B7280]">
              描述练习中模拟顾客的特征与需求，用于产品管理页多条件检索与推荐。品类专属维度已根据【
              {associatedProduct ? associatedProduct.brand + ' · ' + associatedProduct.category : '彩妆通用'}
              】自适应显示。
            </p>

            {/* Dynamic Dimensions List */}
            <div className="space-y-3.5 pt-1">
              {activeDimensions.map((dim) => {
                const isSingle = dim.selectionType === 'single';
                return (
                  <div key={dim.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F2937]">
                          {dim.name}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF]">
                          ({isSingle ? '单选' : '多选'})
                        </span>
                        {dim.applicableCategory !== 'ALL' && (
                          <span className="text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.2 rounded border border-orange-200">
                            {dim.applicableCategory}专属
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {dim.options.map((opt) => {
                        const selected = isTagSelected(dim.name, opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleToggleDimensionTag(dim.name, opt, isSingle)}
                            className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                              selected
                                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                                : 'bg-[#FAF8F5] text-[#4B5563] border border-[#EAE6DD] hover:border-[#9E4A2B]'
                            }`}
                          >
                            <span>{opt}</span>
                            {selected && <Check className="w-3 h-3 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Custom / Legacy Tags Input (Matching Image 2 Red Circle) */}
              <div className="pt-3 border-t border-[#F0ECE3] space-y-2">
                <label className="block text-xs font-semibold text-[#1F2937]">
                  自定义自由标签 (兼容旧版回车添加)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="输入标签并按回车添加..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-3 py-2 bg-[#FAF8F5] border border-[#D6D0C4] hover:bg-gray-100 rounded-lg text-xs font-medium text-[#374151] cursor-pointer"
                  >
                    添加标签
                  </button>
                </div>

                {/* Custom Tags Chips */}
                {(draftDh.personaTags.customTags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(draftDh.personaTags.customTags || []).map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#EAE6DD] text-xs text-[#374151]"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomTag(t)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CARD 4: 人格设定 Prompt (Matching Image 2) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#9E4A2B]" />
                <h3 className="font-bold text-xs text-[#1F2937]">人格设定 Prompt</h3>
              </div>
              <span className="text-[11px] text-[#9CA3AF]">
                设定性格、语气及背景，驱动大模型行为
              </span>
            </div>

            <textarea
              rows={4}
              value={draftDh.prompt}
              onChange={(e) => setDraftDh({ ...draftDh, prompt: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] font-sans leading-relaxed"
            />
          </div>

          {/* CARD 5: 对话流程与剧本大纲 (Matching Image 2) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9E4A2B]" />
                <h3 className="font-bold text-xs text-[#1F2937]">对话流程与剧本大纲</h3>
              </div>
              <span className="text-[11px] text-[#9CA3AF]">
                可以自定义剧本大纲，也可以从已有场景剧本中选择
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setDraftDh({
                    ...draftDh,
                    scriptOutline: { ...draftDh.scriptOutline, type: 'custom' },
                  })
                }
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                  draftDh.scriptOutline.type === 'custom'
                    ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]'
                    : 'bg-[#FAF8F5] text-[#4B5563] border-[#EAE6DD]'
                }`}
              >
                自定义大纲
              </button>
              <button
                type="button"
                onClick={() =>
                  setDraftDh({
                    ...draftDh,
                    scriptOutline: { ...draftDh.scriptOutline, type: 'from_script' },
                  })
                }
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                  draftDh.scriptOutline.type === 'from_script'
                    ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]'
                    : 'bg-[#FAF8F5] text-[#4B5563] border-[#EAE6DD]'
                }`}
              >
                选择场景剧本
              </button>
              <button
                type="button"
                className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D6D0C4] hover:bg-gray-100 rounded-lg text-xs font-medium text-[#374151] flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>AI生成大纲</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-[#1F2937]">
                  推荐对练轮次:
                </label>
                <input
                  type="number"
                  min={2}
                  max={15}
                  value={draftDh.scriptOutline.turns || 5}
                  onChange={(e) =>
                    setDraftDh({
                      ...draftDh,
                      scriptOutline: {
                        ...draftDh.scriptOutline,
                        turns: Number(e.target.value) || 5,
                      },
                    })
                  }
                  className="w-20 px-2 py-1 text-xs border border-[#D6D0C4] rounded-lg"
                />
                <span className="text-[11px] text-[#9CA3AF]">
                  (通常设定 4~6 轮即可完成一次专柜推销与抗拒应对)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  流程提纲摘要:
                </label>
                <textarea
                  rows={2}
                  value={draftDh.scriptOutline.outlineSummary || ''}
                  onChange={(e) =>
                    setDraftDh({
                      ...draftDh,
                      scriptOutline: {
                        ...draftDh.scriptOutline,
                        outlineSummary: e.target.value,
                      },
                    })
                  }
                  placeholder="例如：询问肤质困扰 -> 体验产品质地 -> 讲解烟酰胺与提亮成分 -> 处理抗拒感 -> 达成连带购买"
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: Dialog Preview Simulation ================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col h-[580px] overflow-hidden border border-[#EAE6DD]">
            <div className="px-5 py-3.5 border-b border-[#EAE6DD] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#9E4A2B] text-white flex items-center justify-center font-bold text-xs">
                  {draftDh.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#1F2937]">{draftDh.name}</h3>
                  <div className="text-[10px] text-[#6B7280]">
                    {associatedProduct ? `关联产品: ${associatedProduct.name}` : '未指定关联产品'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F6F2]">
              {previewChatTurns.map((turn, idx) => (
                <div
                  key={idx}
                  className={`flex ${turn.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      turn.sender === 'user'
                        ? 'bg-[#9E4A2B] text-white rounded-br-xs'
                        : 'bg-white text-[#1F2937] border border-[#EAE6DD] rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {turn.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-[#EAE6DD] flex items-center gap-2">
              <input
                type="text"
                placeholder="模拟 BA 与数字人对话..."
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendPreviewChat();
                  }
                }}
                className="flex-1 px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
              />
              <button
                onClick={handleSendPreviewChat}
                className="px-3.5 py-2 bg-[#9E4A2B] text-white rounded-lg text-xs font-semibold hover:bg-[#853C21] transition-colors"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
