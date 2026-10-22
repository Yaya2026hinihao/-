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
  RefreshCw,
  Video,
  Smile,
  Flame,
  Award,
  Filter,
  ArrowUpDown,
  Radio,
  Eye,
  CheckCircle,
  Edit3
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

// 三大分类定义
type CategoryType = 'ALL' | '彩妆' | '护肤' | '直播间';

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
  // 分类 Tab 状态：全部 / 彩妆 / 护肤 / 直播间
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'enabled' | 'disabled'>('ALL');
  const [productFilter, setProductFilter] = useState('ALL');
  const [creatorFilter, setCreatorFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'updated' | 'usage' | 'score'>('updated');

  // 新增 / 编辑弹窗状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draftDh, setDraftDh] = useState<DigitalHumanCustomer | null>(null);
  const [customTagInput, setCustomTagInput] = useState('');

  // 对话模拟预览弹窗状态
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewingDh, setPreviewingDh] = useState<DigitalHumanCustomer | null>(null);
  const [previewChatTurns, setPreviewChatTurns] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [userChatInput, setUserChatInput] = useState('');

  // 可选创建人列表提取
  const availableCreators = useMemo(() => {
    const set = new Set<string>();
    digitalHumans.forEach((dh) => {
      if (dh.creator) set.add(dh.creator);
    });
    if (set.size === 0) {
      set.add('林晨 (总培训师)');
      set.add('王芳 (培训主管)');
      set.add('陈思雨 (彩妆导师)');
      set.add('张强 (直播运营)');
      set.add('李娜 (护肤顾问)');
    }
    return Array.from(set);
  }, [digitalHumans]);

  // 分类统计
  const counts = useMemo(() => {
    let makeup = 0;
    let skincare = 0;
    let livestream = 0;
    digitalHumans.forEach((dh) => {
      if (dh.category === '彩妆' || dh.category === '底妆大单品' || dh.category === '唇部专区') {
        makeup++;
      } else if (dh.category === '护肤' || dh.category === '洗护专区') {
        skincare++;
      } else if (dh.category === '直播间') {
        livestream++;
      } else {
        makeup++; // fallback default to makeup
      }
    });
    return {
      all: digitalHumans.length,
      makeup,
      skincare,
      livestream,
    };
  }, [digitalHumans]);

  // 列表过滤与排序
  const filteredList = useMemo(() => {
    return digitalHumans
      .filter((dh) => {
        // 1. 三类分类过滤
        if (selectedCategory !== 'ALL') {
          if (selectedCategory === '彩妆') {
            if (dh.category !== '彩妆' && dh.category !== '底妆大单品' && dh.category !== '唇部专区' && dh.category !== '未分类') {
              return false;
            }
          } else if (selectedCategory === '护肤') {
            if (dh.category !== '护肤' && dh.category !== '洗护专区') return false;
          } else if (selectedCategory === '直播间') {
            if (dh.category !== '直播间') return false;
          }
        }

        // 2. 状态过滤
        if (statusFilter !== 'ALL' && dh.status !== statusFilter) return false;

        // 3. 关联产品过滤
        if (productFilter !== 'ALL' && dh.productId !== productFilter) return false;

        // 4. 创建人过滤
        if (creatorFilter !== 'ALL') {
          const itemCreator = dh.creator || '林晨 (总培训师)';
          if (itemCreator !== creatorFilter) return false;
        }

        // 5. 搜索框
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = dh.name.toLowerCase().includes(q);
          const matchDesc = dh.description.toLowerCase().includes(q);
          const matchCreator = (dh.creator || '林晨 (总培训师)').toLowerCase().includes(q);
          const matchProd = products.find((p) => p.id === dh.productId);
          const matchProdName = matchProd ? matchProd.name.toLowerCase().includes(q) : false;
          const matchTags = Object.values(dh.personaTags || {})
            .flat()
            .some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchCreator && !matchProdName && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'usage') {
          return (b.usageCount || 0) - (a.usageCount || 0);
        }
        if (sortBy === 'score') {
          return (b.avgScore || 0) - (a.avgScore || 0);
        }
        return (b.updatedAt || '').localeCompare(a.updatedAt || '');
      });
  }, [digitalHumans, selectedCategory, statusFilter, productFilter, creatorFilter, searchQuery, sortBy, products]);

  // Associated product for current draft
  const associatedProduct = useMemo(() => {
    if (!draftDh?.productId) return null;
    return products.find((p) => p.id === draftDh.productId) || null;
  }, [products, draftDh?.productId]);

  // Determine category key for tag dimensions
  const applicableCategoryKey = useMemo(() => {
    if (draftDh?.category === '护肤') return 'SKINCARE';
    if (draftDh?.category === '直播间') return 'MAKEUP';
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
  }, [associatedProduct, draftDh?.category]);

  // Get active tag dimensions for digital human
  const activeDimensions = useMemo(() => {
    return tagDimensions
      .filter((d) => d.isEnabled)
      .filter((d) => d.assetTarget === 'all' || d.assetTarget === 'digital_human')
      .filter((d) => {
        if (d.applicableCategory === 'ALL') return true;
        if (d.applicableCategory === applicableCategoryKey) return true;
        if (applicableCategoryKey === 'SKINCARE' && d.applicableCategory === 'MAKEUP') return true;
        return false;
      })
      .sort((a, b) => a.order - b.order);
  }, [tagDimensions, applicableCategoryKey]);

  // Tag chip helper
  const handleToggleDimensionTag = (dimName: string, option: string, isSingle: boolean) => {
    setDraftDh((prev) => {
      if (!prev) return prev;
      const currentTags = { ...prev.personaTags };

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
      } else if (dimName === '顾客问题' || dimName === '顾客顾虑') {
        const list = currentTags.customerConcerns || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        return { ...prev, personaTags: { ...currentTags, customerConcerns: next } };
      } else {
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
    if (!draftDh) return false;
    if (dimName === '顾客人群') return (draftDh.personaTags.targetGroups || []).includes(option);
    if (dimName === '消费场景') return (draftDh.personaTags.scenarios || []).includes(option);
    if (dimName === '核心需求') return (draftDh.personaTags.demands || []).includes(option);
    if (dimName === '顾客问题' || dimName === '顾客顾虑')
      return (draftDh.personaTags.customerConcerns || []).includes(option);
    return (draftDh.personaTags.categoryDimensions?.[dimName] || []).includes(option);
  };

  const handleAddCustomTag = () => {
    if (!draftDh || !customTagInput.trim()) return;
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

  const handleRemoveCustomTag = (tag: string) => {
    if (!draftDh) return;
    setDraftDh({
      ...draftDh,
      personaTags: {
        ...draftDh.personaTags,
        customTags: (draftDh.personaTags.customTags || []).filter((t) => t !== tag),
      },
    });
  };

  // 新建数字人
  const handleCreateNewDh = () => {
    const newId = `dh-custom-${Date.now()}`;
    const defaultCat =
      selectedCategory === '彩妆' || selectedCategory === '护肤' || selectedCategory === '直播间'
        ? selectedCategory
        : '彩妆';

    const defaultProd = products[0];

    const newDh: DigitalHumanCustomer = {
      id: newId,
      name: '新数字人顾客',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      fullImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      language: '印尼语',
      voiceTone: 'Ramah & Antusias',
      category: defaultCat,
      description: '进店咨询顾客，寻找适合自己肤质的产品与搭配建议...',
      status: 'enabled',
      visibleRegions: ['kantor pusat'],
      productId: defaultProd?.id || '',
      productIds: defaultProd?.id ? [defaultProd.id] : [],
      personaTags: {
        targetGroups: ['年轻顾客', '年轻白领'],
        scenarios: ['日常通勤', '专柜试妆'],
        demands: ['持妆', '控油', '自然水光'],
        customerConcerns: ['容易脱妆', '不知道怎么选择'],
        categoryDimensions: {},
        customTags: ['新顾客', '实战模拟'],
      },
      prompt: `你是一个进店咨询的印尼顾客，对【${defaultProd?.name || '主推产品'}】感兴趣。请模拟专柜顾客，提出真实日常痛点，测试 BA 的提问、倾听、产品介绍及连带推介能力。`,
      scriptOutline: {
        type: 'custom',
        turns: 5,
        outlineSummary: '礼貌问候与痛点倾听 -> 体验产品质地与卖点介绍 -> 处理疑虑与价格异议 -> 促成连带搭配购买',
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
      avgScore: 90,
    };

    setDraftDh(newDh);
    setIsEditModalOpen(true);
  };

  // 编辑数字人
  const handleEditDh = (dh: DigitalHumanCustomer) => {
    setDraftDh(JSON.parse(JSON.stringify(dh)));
    setIsEditModalOpen(true);
  };

  // 保存数字人
  const handleSave = () => {
    if (!draftDh) return;
    if (!draftDh.name.trim()) {
      alert('请输入数字人名称');
      return;
    }

    const updated: DigitalHumanCustomer = {
      ...draftDh,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSaveDigitalHuman(updated);
    setIsEditModalOpen(false);
  };

  // 开启对话预览
  const handleOpenPreview = (dh: DigitalHumanCustomer) => {
    setPreviewingDh(dh);
    const prod = products.find((p) => p.id === dh.productId);
    const initialGreeting =
      dh.category === '直播间'
        ? `Kak, vouchernya masih ada gak? Aku mau tanya produk ${prod?.name || 'ini'} cocok buat kulit berminyak gak ya?`
        : `Halo Mbak! Saya lagi cari produk untuk keluhan kulit saya, ${dh.description.slice(0, 45)}... Ada rekomendasi?`;

    setPreviewChatTurns([
      {
        sender: 'ai',
        text: initialGreeting,
      },
    ]);
    setUserChatInput('');
    setIsPreviewOpen(true);
  };

  const handleSendPreviewChat = () => {
    if (!userChatInput.trim() || !previewingDh) return;
    const userMsg = userChatInput.trim();
    const prod = products.find((p) => p.id === previewingDh.productId);
    setUserChatInput('');
    setPreviewChatTurns((prev) => [
      ...prev,
      { sender: 'user', text: userMsg },
      {
        sender: 'ai',
        text: `Terima kasih atas penjelasannya! Sebagai customer, saya sangat mempertimbangkan apakah produk ${
          prod?.name || 'ini'
        } cocok untuk kebutuhan saya (${(previewingDh.personaTags.demands || []).join(', ') || '持妆控油'}).`,
      },
    ]);
  };

  // 分类 Badge 样式
  const getCategoryBadgeStyle = (category: string) => {
    if (category === '彩妆' || category === '底妆大单品' || category === '唇部专区') {
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        text: '💄 彩妆',
      };
    }
    if (category === '护肤' || category === '洗护专区') {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        text: '🧴 护肤',
      };
    }
    if (category === '直播间') {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
        text: '📱 直播间',
      };
    }
    return {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      text: category || '彩妆',
    };
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF9F7] overflow-hidden">
      {/* ================= TOP HEADER ================= */}
      <div className="px-6 py-4 bg-white border-b border-[#EAE7E0] shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#9E4A2B] text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-[#1F2937]">
                数字人顾客
              </h1>
              <span className="text-xs bg-orange-50 text-[#9E4A2B] font-semibold px-2.5 py-0.5 rounded-full border border-orange-200">
                共 {digitalHumans.length} 位
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenTagManage}
              className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#4B5563] border border-[#D6D0C4] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Settings2 className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>配置标签维度</span>
            </button>

            <button
              type="button"
              onClick={handleCreateNewDh}
              className="px-4 py-2 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新增</span>
            </button>
          </div>
        </div>

        {/* ================= CATEGORY TABS (分三类显示: 彩妆 / 护肤 / 直播间) ================= */}
        <div className="flex items-center gap-2 mt-4 pt-1 border-t border-[#F0ECE3] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#9E4A2B] text-white shadow-xs'
                : 'bg-white text-[#4B5563] hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>全部资产</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'ALL' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {counts.all}
            </span>
          </button>

          {/* 1. 彩妆 */}
          <button
            type="button"
            onClick={() => setSelectedCategory('彩妆')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === '彩妆'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-[#4B5563] hover:bg-rose-50/60 border border-gray-200'
            }`}
          >
            <span>💄 彩妆</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === '彩妆' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {counts.makeup}
            </span>
          </button>

          {/* 2. 护肤 */}
          <button
            type="button"
            onClick={() => setSelectedCategory('护肤')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === '护肤'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-[#4B5563] hover:bg-emerald-50/60 border border-gray-200'
            }`}
          >
            <span>🧴 护肤</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === '护肤' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {counts.skincare}
            </span>
          </button>

          {/* 3. 直播间 */}
          <button
            type="button"
            onClick={() => setSelectedCategory('直播间')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === '直播间'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-[#4B5563] hover:bg-amber-50/60 border border-gray-200'
            }`}
          >
            <span>📱 直播间</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === '直播间' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {counts.livestream}
            </span>
          </button>
        </div>
      </div>

      {/* ================= SECONDARY FILTER BAR ================= */}
      <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#EAE6DD] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜索数字人名称、描述、创建人、标签或关联产品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-[#D6D0C4] rounded-lg text-xs text-[#374151] focus:outline-none focus:border-[#9E4A2B]"
          >
            <option value="ALL">全部状态</option>
            <option value="enabled">已启用</option>
            <option value="disabled">已停用</option>
          </select>

          {/* Product filter */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-[#D6D0C4] rounded-lg text-xs text-[#374151] focus:outline-none focus:border-[#9E4A2B] max-w-[180px] truncate"
          >
            <option value="ALL">全部关联产品</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brand} - {p.name}
              </option>
            ))}
          </select>

          {/* Creator filter */}
          <select
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-[#D6D0C4] rounded-lg text-xs text-[#374151] focus:outline-none focus:border-[#9E4A2B]"
          >
            <option value="ALL">全部创建人</option>
            {availableCreators.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 text-gray-500">
          <span className="text-[11px]">
            当前展示 <strong>{filteredList.length}</strong> 位
          </span>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#D6D0C4]">
            <ArrowUpDown className="w-3 h-3 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-transparent text-[#374151] focus:outline-none cursor-pointer"
            >
              <option value="updated">最近修改</option>
              <option value="usage">演练次数最多</option>
              <option value="score">平均得分最高</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= MAIN ASSET GRID ================= */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EAE6DD] p-12 text-center max-w-lg mx-auto my-12 shadow-2xs space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] border border-[#EAE6DD] flex items-center justify-center text-[#9E4A2B]">
              <Bot className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-bold text-sm text-[#1F2937]">暂无符合条件的数字人顾客</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              没有找到符合当前分类或搜索条件的数字人。您可以清空筛选条件，或直接点击下方按钮新建。
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setProductFilter('ALL');
                }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
              >
                重置全部筛选
              </button>
              <button
                type="button"
                onClick={handleCreateNewDh}
                className="px-4 py-1.5 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建数字人</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
            {filteredList.map((dh) => {
              const linkedProd = products.find((p) => p.id === dh.productId);
              const catBadge = getCategoryBadgeStyle(dh.category);
              const isEnabled = dh.status === 'enabled';

              return (
                <div
                  key={dh.id}
                  className="bg-white rounded-xl border border-[#EAE6DD] hover:border-[#D6D0C4] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Top Row: Avatar, Name, Category Badge & Status */}
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div className="w-13 h-13 rounded-xl overflow-hidden border border-[#EAE6DD] bg-[#FAF8F5] flex items-center justify-center">
                          {dh.avatar ? (
                            <img
                              src={dh.avatar}
                              alt={dh.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="font-bold text-base text-[#78716C]">
                              {dh.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        {/* Status indicator badge */}
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            isEnabled ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                          title={isEnabled ? '已启用' : '已停用'}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${catBadge.bg}`}
                          >
                            {catBadge.text}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {dh.updatedAt || dh.createdAt}
                          </span>
                        </div>

                        <h3
                          onClick={() => handleEditDh(dh)}
                          className="font-bold text-xs text-[#1F2937] hover:text-[#9E4A2B] truncate mt-1 cursor-pointer"
                          title={dh.name}
                        >
                          {dh.name}
                        </h3>

                        {/* 创建人放在原来名字下面/原地区位置 */}
                        <div className="text-[11px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">创建人：{dh.creator || '林晨 (总培训师)'}</span>
                        </div>
                      </div>
                    </div>

                    {/* 语种显示 (保留，不显示音色和具体描述) */}
                    <div className="pt-1 border-t border-[#F0ECE3] flex items-center justify-between text-[11px] text-[#78716C]">
                      <span>语种</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-mono">
                        {dh.language || '印尼语'}
                      </span>
                    </div>

                    {/* Linked Product Preview (保留) */}
                    <div className="pt-0.5">
                      {linkedProd ? (
                        <div
                          onClick={() => onNavigateToProduct && onNavigateToProduct(linkedProd)}
                          className="p-2 bg-[#FFF9F5] border border-[#FED7AA] hover:border-[#FDBA74] rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                          title="点击查看该产品详情"
                        >
                          <img
                            src={linkedProd.image}
                            alt={linkedProd.name}
                            className="w-7 h-7 rounded object-cover border border-orange-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1 text-[11px]">
                            <div className="text-[#9A3412] font-semibold truncate">
                              📦 {linkedProd.name}
                            </div>
                            <div className="text-[10px] text-[#7C2D12]/70 font-mono truncate">
                              [{linkedProd.brand}] SKU: {linkedProd.sku}
                            </div>
                          </div>
                          <ExternalLink className="w-3 h-3 text-orange-400 shrink-0" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-[10px] text-gray-400 text-center">
                          未关联具体产品
                        </div>
                      )}
                    </div>

                    {/* Persona Tags Preview */}
                    <div className="flex flex-wrap gap-1">
                      {(dh.personaTags?.demands || []).slice(0, 2).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200"
                        >
                          #{tag}
                        </span>
                      ))}
                      {(dh.personaTags?.targetGroups || []).slice(0, 1).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200"
                        >
                          @{tag}
                        </span>
                      ))}
                      {(dh.personaTags?.customTags || []).slice(0, 1).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Performance metrics bar: 练习次数与均分 */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1.5 border-t border-[#F0ECE3]">
                      <span>练习次数: <strong className="text-[#9E4A2B] font-semibold">{dh.usageCount || 0}次</strong></span>
                      <span>均分: <strong className="text-emerald-700 font-semibold">{dh.avgScore || 90}分</strong></span>
                    </div>
                  </div>

                  {/* Card Footer Actions: 最下面就显示对话预览和编辑就行，添加上产品之后不用显示发任务 */}
                  <div className="px-3 py-2 bg-[#FAF8F5] border-t border-[#EAE6DD] flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(dh)}
                      className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#374151] border border-gray-300 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="在线对话预览"
                    >
                      <MessageSquare className="w-3 h-3 text-[#6B7280]" />
                      <span>对话预览</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditDh(dh)}
                        className="px-2.5 py-1 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>编辑</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`确定要删除数字人顾客《${dh.name}》吗？`)) {
                            onDeleteDigitalHuman(dh.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                        title="删除该数字人"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= MODAL: 新建 / 编辑数字人顾客 (原右侧工作台弹出展示) ================= */}
      {isEditModalOpen && draftDh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[92vh] max-h-[900px] shadow-2xl flex flex-col border border-[#EAE6DD] overflow-hidden">
            {/* Modal Top Header Bar */}
            <div className="px-6 py-4 border-b border-[#EAE7E0] flex items-center justify-between shrink-0 bg-white">
              <div>
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <span>{draftDh.name ? `编辑数字人：${draftDh.name}` : '新建数字人顾客'}</span>
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  配置角色外观、人格设定及互动流程以用于 BA 陪练
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenPreview(draftDh)}
                  className="px-3.5 py-1.5 border border-[#D6D0C4] hover:bg-gray-50 rounded-lg text-xs font-medium text-[#374151] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>对话预览</span>
                </button>

                <div className="flex items-center gap-2 px-2.5 py-1 bg-[#FAF8F5] rounded-lg border border-[#EAE6DD]">
                  <span className="text-xs text-[#6B7280]">状态</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraftDh({
                        ...draftDh,
                        status: draftDh.status === 'enabled' ? 'disabled' : 'enabled',
                      })
                    }
                    className={`relative inline-flex h-4.5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      draftDh.status === 'enabled' ? 'bg-[#9E4A2B]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        draftDh.status === 'enabled' ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    className={`text-[11px] font-semibold ${
                      draftDh.status === 'enabled' ? 'text-emerald-700' : 'text-gray-400'
                    }`}
                  >
                    {draftDh.status === 'enabled' ? '已启用' : '已停用'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>保存</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="关闭"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FAF9F7] scrollbar-thin">
              {/* Warning Banner */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-800 flex items-start gap-2 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  请尽量详细、准确填写所有提示词和使用提示，这会直接影响最终 AI 陪练和练习效果。
                </span>
              </div>

              {/* CARD 1: 基本信息与形象 */}
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
                        onClick={() => {
                          const url = prompt('请输入新头像图片 URL:', draftDh.avatar);
                          if (url) setDraftDh({ ...draftDh, avatar: url });
                        }}
                        className="text-[10px] px-2 py-1 rounded bg-[#F4F2EE] hover:bg-[#EAE6DD] text-[#4B5563] cursor-pointer"
                      >
                        输入图库链接
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
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('请输入形象大图 URL:', draftDh.fullImage);
                            if (url) setDraftDh({ ...draftDh, fullImage: url });
                          }}
                          className="px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white text-xs rounded-lg cursor-pointer"
                        >
                          更换形象图
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('请输入形象大图 URL:', draftDh.fullImage);
                          if (url) setDraftDh({ ...draftDh, fullImage: url });
                        }}
                        className="text-[10px] px-2.5 py-1 rounded border border-[#D6D0C4] bg-white hover:bg-gray-50 text-[#374151] cursor-pointer"
                      >
                        从图库选择
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const avatars = [
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
                          ];
                          const randomImg = avatars[Math.floor(Math.random() * avatars.length)];
                          setDraftDh({ ...draftDh, fullImage: randomImg, avatar: randomImg });
                        }}
                        className="text-[10px] px-2.5 py-1 rounded bg-[#9E4A2B] text-white hover:bg-[#853C21] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>一键 AI 配图</span>
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

                {/* 内容分类：统一调整为三大分类（彩妆 / 护肤 / 直播间） */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                      * 内容分类 (核心分类)
                    </label>
                    <select
                      value={draftDh.category}
                      onChange={(e) => setDraftDh({ ...draftDh, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white font-semibold text-[#1F2937]"
                    >
                      <option value="彩妆">💄 彩妆 (底妆 / 唇颊 / 眼妆 / 修容等专柜试妆)</option>
                      <option value="护肤">🧴 护肤 (敏感肌 / 晒后修护 / 控油洗护 / 抗老面霜等)</option>
                      <option value="直播间">📱 直播间 (直播互动 / 催券逼单 / 成分比价 / 新手选色等)</option>
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
                      className="text-[11px] text-[#9E4A2B] hover:underline cursor-pointer"
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

              {/* CARD 2: 关联训练产品 */}
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

              {/* CARD 3: 多维度画像标签 */}
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
                  描述练习中模拟顾客的特征与需求，用于产品管理页多条件检索与推荐。
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
                          </div>
                        </div>

                        {/* Chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {dim.options.map((opt: string) => {
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

                  {/* Custom Tags Input */}
                  <div className="pt-3 border-t border-[#F0ECE3] space-y-2">
                    <label className="block text-xs font-semibold text-[#1F2937]">
                      自定义自由标签 (回车添加)
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

              {/* CARD 4: 人格设定 Prompt */}
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

              {/* CARD 5: 对话流程与剧本大纲 */}
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

            {/* Modal Bottom Footer Bar */}
            <div className="px-6 py-3.5 border-t border-[#EAE7E0] bg-white flex items-center justify-between shrink-0">
              <span className="text-xs text-[#6B7280]">
                数字人 ID: <strong className="font-mono text-gray-700">{draftDh.id}</strong>
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#D6D0C4] hover:bg-gray-50 rounded-lg text-xs font-medium text-[#4B5563] cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存数字人</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Dialog Preview Simulation ================= */}
      {isPreviewOpen && previewingDh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col h-[580px] overflow-hidden border border-[#EAE6DD]">
            <div className="px-5 py-3.5 border-b border-[#EAE6DD] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#EAE6DD] bg-white shrink-0">
                  <img
                    src={previewingDh.avatar}
                    alt={previewingDh.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-[#1F2937]">{previewingDh.name}</h3>
                    <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-semibold border border-rose-200">
                      {previewingDh.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#6B7280]">
                    音色: {previewingDh.voiceTone} · {previewingDh.language}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 cursor-pointer"
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
                type="button"
                onClick={handleSendPreviewChat}
                className="px-3.5 py-2 bg-[#9E4A2B] text-white rounded-lg text-xs font-semibold hover:bg-[#853C21] transition-colors cursor-pointer"
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
