import React, { useState, useMemo } from 'react';
import { ScenarioScriptItem, ScriptStep, ProductCombination, TagDimensionConfig } from '../../types/sparring';
import { Product } from '../../types/product';
import {
  Search,
  Plus,
  Trash2,
  Check,
  Save,
  MessageSquare,
  Sparkles,
  FileText,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Layers,
  Settings2,
  X,
  Send,
  Package,
  ExternalLink,
  SlidersHorizontal,
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';

const ALL_REGIONS = [
  'kantor pusat', 'Hinihao', 'ACEH', 'BALI', 'BALIKPAPAN', 'BANDUNG',
  'BANJARMASIN', 'BEKASI', 'BOGOR', 'CIREBON', 'JAKARTA', 'JAMBI',
  'KARAWANG', 'LAMPUNG', 'MAKASSAR', 'MALANG', 'DEPOK', 'MANADO',
  'MEDAN', 'PADANG', 'PALEMBANG', 'PEKANBARU', 'PONTIANAK', 'RANTAU',
  'SEMARANG', 'SURABAYA', 'TANGERANG', 'TPP', 'YOGYAKARTA'
];

interface ScenarioScriptViewProps {
  scripts: ScenarioScriptItem[];
  products: Product[];
  combinations: ProductCombination[];
  tagDimensions: TagDimensionConfig[];
  onSaveScript: (script: ScenarioScriptItem) => void;
  onDeleteScript: (id: string) => void;
  onOpenTagManage: () => void;
  onSaveCombination?: (combo: ProductCombination) => void;
  onNavigateToProduct?: (p: Product) => void;
  onOpenTaskPublish?: (product: Product, specificAsset?: any) => void;
  initialSelectedScriptId?: string;
  initialPrefillCombo?: ProductCombination | null;
  onClearInitialPrefill?: () => void;
}

export const ScenarioScriptView: React.FC<ScenarioScriptViewProps> = ({
  scripts,
  products,
  combinations,
  tagDimensions,
  onSaveScript,
  onDeleteScript,
  onOpenTagManage,
  onSaveCombination,
  onNavigateToProduct,
  onOpenTaskPublish,
  initialSelectedScriptId,
  initialPrefillCombo,
  onClearInitialPrefill,
}) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>(
    initialSelectedScriptId || scripts[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [comboFilter, setComboFilter] = useState('ALL');

  const currentScript = useMemo(() => {
    return scripts.find((s) => s.id === selectedScriptId) || scripts[0];
  }, [scripts, selectedScriptId]);

  // Working draft
  const [draftScript, setDraftScript] = useState<ScenarioScriptItem | null>(null);

  // Sync draft when selectedScriptId changes
  React.useEffect(() => {
    if (currentScript) {
      setDraftScript(JSON.parse(JSON.stringify(currentScript)));
    }
  }, [currentScript?.id]);

  // Handle initialSelectedScriptId or initialPrefillCombo
  React.useEffect(() => {
    if (initialSelectedScriptId) {
      setSelectedScriptId(initialSelectedScriptId);
    }
  }, [initialSelectedScriptId]);

  React.useEffect(() => {
    if (initialPrefillCombo) {
      const mainP = products.find((p) => p.id === initialPrefillCombo.mainProductId);
      const crossPs = products.filter((p) => initialPrefillCombo.crossSellingProductIds?.includes(p.id));
      const newId = `sc-combo-${Date.now()}`;
      const newScript: ScenarioScriptItem = {
        id: newId,
        title: `《${initialPrefillCombo.name.split(' ')[0]}》连带销售实战演练`,
        language: '印尼语',
        status: 'enabled',
        voiceTone: 'Pemimpin Dominan',
        category: mainP?.category || '护肤',
        visibleRegions: ['kantor pusat'],
        sceneDescription: `顾客咨询购买【${mainP?.name || '核心主推品'}】，BA通过专业提问挖掘潜在关联需求，顺势引入连带产品进行搭配推荐。`,
        scenePrompt: `顾客正在专柜选购${mainP?.name || '核心单品'}。BA首先肯定顾客的选择并介绍核心功效，随后在交流中自然发现搭配诉求，向顾客推荐搭配介绍产品【${crossPs.map((p) => p.name).join('与')}】，说明成套使用的倍增效果并促进客单价提升。`,
        coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
        linkedCombination: {
          combinationId: initialPrefillCombo.id,
          combinationName: initialPrefillCombo.name,
          mainProductId: initialPrefillCombo.mainProductId,
          crossSellingProductIds: [...initialPrefillCombo.crossSellingProductIds],
          pairingType: 'official',
        },
        scenarioTags: {
          scenarios: ['日常洗护', '连带搭配'],
          demands: ['综合护理', '功效互补'],
          targetGroups: ['注重品质顾客'],
          categoryDimensions: {},
          customTags: ['连带销售', '一单多件'],
        },
        steps: [
          {
            id: `step-1`,
            order: 1,
            title: '步骤一：痛点挖掘与核心单品推介',
            goal: `精准提问，介绍【${mainP?.name || '核心单品'}】核心卖点`,
            hint: '聚焦解决核心问题，建立专业信赖感',
          },
          {
            id: `step-2`,
            order: 2,
            title: '步骤二：功效叠加与搭配连带推荐',
            goal: `自然引入搭配产品【${crossPs[0]?.name || '搭配产品'}】，演示成套使用效果`,
            hint: '阐述1+1>2原理，让顾客感受连带价值',
          },
          {
            id: `step-3`,
            order: 3,
            title: '步骤三：成套优惠引导与连带促成',
            goal: '提示组合专享礼遇或会员加赠，促成两件/多件连带成交',
            hint: '打消价格顾虑，锁定连带购买意向',
          },
        ],
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      onSaveScript(newScript);
      setSelectedScriptId(newId);
      setDraftScript(newScript);
      onClearInitialPrefill?.();
    }
  }, [initialPrefillCombo]);

  // Custom free-text tag input
  const [customTagInput, setCustomTagInput] = useState('');

  // Script preview modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Product selection and search states for scenario script
  const [mainProdSearch, setMainProdSearch] = useState('');
  const [crossProdSearch, setCrossProdSearch] = useState('');
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  // Filtered list
  const filteredList = useMemo(() => {
    return scripts.filter((sc) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = sc.title.toLowerCase().includes(q);
        const matchDesc = sc.sceneDescription.toLowerCase().includes(q);
        const matchTags = Object.values(sc.scenarioTags)
          .flat()
          .some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }
      if (categoryFilter !== 'ALL' && sc.category !== categoryFilter) return false;
      if (comboFilter !== 'ALL' && sc.linkedCombination?.combinationId !== comboFilter) return false;
      return true;
    });
  }, [scripts, searchQuery, categoryFilter, comboFilter]);

  // Main product and cross products derived automatically
  const mainProduct = useMemo(() => {
    const pId = draftScript?.linkedCombination?.mainProductId;
    if (!pId) return null;
    return products.find((p) => p.id === pId) || null;
  }, [products, draftScript?.linkedCombination?.mainProductId]);

  const crossProducts = useMemo(() => {
    const ids = draftScript?.linkedCombination?.crossSellingProductIds || [];
    return products.filter((p) => ids.includes(p.id));
  }, [products, draftScript?.linkedCombination?.crossSellingProductIds]);

  // Check exact match with an existing combination in combinations
  const matchingOfficialCombo = useMemo(() => {
    const mainId = draftScript?.linkedCombination?.mainProductId;
    const crossIds = draftScript?.linkedCombination?.crossSellingProductIds || [];
    if (!mainId) return null;
    return (
      combinations.find((c) => {
        if (c.mainProductId !== mainId) return false;
        if (c.crossSellingProductIds.length !== crossIds.length) return false;
        return c.crossSellingProductIds.every((id) => crossIds.includes(id));
      }) || null
    );
  }, [combinations, draftScript?.linkedCombination?.mainProductId, draftScript?.linkedCombination?.crossSellingProductIds]);

  // Check if there are combinations where mainProductId === currentMainProductId (for quick quote recommendation)
  const recommendedOfficialCombos = useMemo(() => {
    const mainId = draftScript?.linkedCombination?.mainProductId;
    if (!mainId) return [];
    return combinations.filter((c) => c.mainProductId === mainId);
  }, [combinations, draftScript?.linkedCombination?.mainProductId]);

  // Active Linked Combination details
  const activeCombination = useMemo(() => {
    if (matchingOfficialCombo) return matchingOfficialCombo;
    if (!draftScript?.linkedCombination?.combinationId) return null;
    return combinations.find((c) => c.id === draftScript.linkedCombination?.combinationId) || null;
  }, [combinations, matchingOfficialCombo, draftScript?.linkedCombination?.combinationId]);

  // Determine applicable category for dynamic dimensions based on main product
  const applicableCategoryKey = useMemo(() => {
    if (!mainProduct) return 'ALL';
    const sub = (mainProduct.subCategory || '').toUpperCase();
    const cat = (mainProduct.category || '').toUpperCase();
    if (sub === 'HAIR' || mainProduct.name.includes('洗发') || mainProduct.name.includes('护发')) {
      return 'HAIR';
    }
    if (sub === 'BODY' || mainProduct.name.includes('身体') || mainProduct.name.includes('沐浴')) {
      return 'BODY';
    }
    if (cat === 'SKINCARE' || mainProduct.name.includes('精华') || mainProduct.name.includes('面霜')) {
      return 'SKINCARE';
    }
    return 'MAKEUP';
  }, [mainProduct]);

  // Active tag dimensions for scenario script
  const activeDimensions = useMemo(() => {
    return tagDimensions
      .filter((d) => d.isEnabled)
      .filter((d) => d.assetTarget === 'all' || d.assetTarget === 'scenario_script')
      .filter((d) => {
        if (d.applicableCategory === 'ALL') return true;
        if (d.applicableCategory === applicableCategoryKey) return true;
        if (applicableCategoryKey === 'SKINCARE' && d.applicableCategory === 'MAKEUP') return true;
        return false;
      })
      .sort((a, b) => a.order - b.order);
  }, [tagDimensions, applicableCategoryKey]);

  if (!draftScript) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        请选择或创建一个场景剧本
      </div>
    );
  }

  // Tag chip click handler
  const handleToggleDimensionTag = (dimName: string, option: string, isSingle: boolean) => {
    setDraftScript((prev) => {
      if (!prev) return prev;
      const currentTags = { ...prev.scenarioTags };

      if (dimName === '适用场景' || dimName === '消费场景') {
        const list = currentTags.scenarios || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        return { ...prev, scenarioTags: { ...currentTags, scenarios: next } };
      } else if (dimName === '核心需求' || dimName === '顾客需求') {
        const list = currentTags.demands || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        return { ...prev, scenarioTags: { ...currentTags, demands: next } };
      } else if (dimName === '适用人群' || dimName === '顾客人群') {
        const list = currentTags.targetGroups || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        return { ...prev, scenarioTags: { ...currentTags, targetGroups: next } };
      } else {
        const catMap = { ...(currentTags.categoryDimensions || {}) };
        const list = catMap[dimName] || [];
        const next = isSingle
          ? [option]
          : list.includes(option)
          ? list.filter((i) => i !== option)
          : [...list, option];
        catMap[dimName] = next;
        return { ...prev, scenarioTags: { ...currentTags, categoryDimensions: catMap } };
      }
    });
  };

  const isTagSelected = (dimName: string, option: string): boolean => {
    if (dimName === '适用场景' || dimName === '消费场景')
      return (draftScript.scenarioTags.scenarios || []).includes(option);
    if (dimName === '核心需求' || dimName === '顾客需求')
      return (draftScript.scenarioTags.demands || []).includes(option);
    if (dimName === '适用人群' || dimName === '顾客人群')
      return (draftScript.scenarioTags.targetGroups || []).includes(option);
    return (draftScript.scenarioTags.categoryDimensions?.[dimName] || []).includes(option);
  };

  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return;
    const tag = customTagInput.trim();
    const existing = draftScript.scenarioTags.customTags || [];
    if (!existing.includes(tag)) {
      setDraftScript({
        ...draftScript,
        scenarioTags: {
          ...draftScript.scenarioTags,
          customTags: [...existing, tag],
        },
      });
    }
    setCustomTagInput('');
  };

  const handleRemoveCustomTag = (tagToRemove: string) => {
    setDraftScript({
      ...draftScript,
      scenarioTags: {
        ...draftScript.scenarioTags,
        customTags: (draftScript.scenarioTags.customTags || []).filter((t) => t !== tagToRemove),
      },
    });
  };

  // 1. 选择主推品 (从全量产品选择，支持搜索，回显已有主推品)
  const handleSelectMainProduct = (productId: string) => {
    if (!draftScript) return;
    const currentCross = (draftScript.linkedCombination?.crossSellingProductIds || []).filter(
      (id) => id !== productId
    );

    // 自动检查是否与连带销售组合完全匹配
    const matched = combinations.find(
      (c) =>
        c.mainProductId === productId &&
        c.crossSellingProductIds.length === currentCross.length &&
        c.crossSellingProductIds.every((id) => currentCross.includes(id))
    );

    setDraftScript({
      ...draftScript,
      linkedCombination: {
        mainProductId: productId,
        crossSellingProductIds: currentCross,
        combinationId: matched ? matched.id : undefined,
        combinationName: matched ? matched.name : '自定义搭配',
        pairingType: matched ? 'official' : 'custom',
      },
    });
  };

  // 2. 添加/移除连带品 (多选，从全量产品选择，支持搜索)
  const handleToggleCrossProduct = (productId: string) => {
    if (!draftScript) return;
    const currentMain = draftScript.linkedCombination?.mainProductId || '';
    if (productId === currentMain) return; // 主推品不能作为连带品

    const currentCross = draftScript.linkedCombination?.crossSellingProductIds || [];
    const nextCross = currentCross.includes(productId)
      ? currentCross.filter((id) => id !== productId)
      : [...currentCross, productId];

    const matched = combinations.find(
      (c) =>
        c.mainProductId === currentMain &&
        c.crossSellingProductIds.length === nextCross.length &&
        c.crossSellingProductIds.every((id) => nextCross.includes(id))
    );

    setDraftScript({
      ...draftScript,
      linkedCombination: {
        mainProductId: currentMain,
        crossSellingProductIds: nextCross,
        combinationId: matched ? matched.id : undefined,
        combinationName: matched ? matched.name : '自定义搭配',
        pairingType: matched ? 'official' : 'custom',
      },
    });
  };

  // 3. 一键引用推荐的连带销售组合
  const handleApplyRecommendedCombo = (combo: ProductCombination) => {
    if (!draftScript) return;
    setDraftScript({
      ...draftScript,
      linkedCombination: {
        mainProductId: combo.mainProductId,
        crossSellingProductIds: [...combo.crossSellingProductIds],
        combinationId: combo.id,
        combinationName: combo.name,
        pairingType: 'official',
      },
    });
  };

  // 4. 同步创建为正式连带销售组合
  const handleSyncCreateCombination = () => {
    if (!draftScript || !onSaveCombination) return;
    const currentMain = draftScript.linkedCombination?.mainProductId;
    const currentCross = draftScript.linkedCombination?.crossSellingProductIds || [];
    const mainP = products.find((p) => p.id === currentMain);
    const crossPs = products.filter((p) => currentCross.includes(p.id));
    if (!mainP || crossPs.length === 0) return;

    const newComboId = `combo-${Date.now()}`;
    const newComboName = `【${mainP.brand || '搭配'}】${mainP.name.split(' ')[0]} + ${crossPs
      .map((p) => p.name.split(' ')[0])
      .join(' / ')} 连带销售组合`;

    const newCombo: ProductCombination = {
      id: newComboId,
      name: newComboName,
      mainProductId: mainP.id,
      crossSellingProductIds: [...currentCross],
      description: `由场景剧本《${draftScript.title}》同步创建的连带销售组合。`,
      isConfirmed: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSaveCombination(newCombo);

    setDraftScript({
      ...draftScript,
      linkedCombination: {
        mainProductId: mainP.id,
        crossSellingProductIds: [...currentCross],
        combinationId: newComboId,
        combinationName: newComboName,
        pairingType: 'official',
      },
    });

    setShowSyncSuccess(true);
    setTimeout(() => setShowSyncSuccess(false), 3500);
  };

  const handleAddStep = () => {
    const newStep: ScriptStep = {
      id: `step-${Date.now()}`,
      order: (draftScript.steps.length || 0) + 1,
      title: '新步骤：专柜互动引导',
      goal: '设定本步骤推销重点与沟通目标',
      hint: '提供给 BA 的具体应答思路或连带推荐指引',
    };
    setDraftScript({
      ...draftScript,
      steps: [...draftScript.steps, newStep],
    });
  };

  const handleRemoveStep = (stepId: string) => {
    setDraftScript({
      ...draftScript,
      steps: draftScript.steps.filter((s) => s.id !== stepId),
    });
  };

  const handleUpdateStep = (stepId: string, field: keyof ScriptStep, value: any) => {
    setDraftScript({
      ...draftScript,
      steps: draftScript.steps.map((s) => (s.id === stepId ? { ...s, [field]: value } : s)),
    });
  };

  const handleCreateNewScript = () => {
    const newId = `sc-custom-${Date.now()}`;
    const newScript: ScenarioScriptItem = {
      id: newId,
      title: '新场景剧本：连带推荐实战演练',
      language: '印尼语',
      status: 'enabled',
      voiceTone: 'Pemimpin Dominan',
      category: '护肤',
      visibleRegions: ['kantor pusat'],
      sceneDescription: '顾客进店咨询...',
      scenePrompt: '顾客进店寻找适合自己肤质的产品，BA需要通过专业提问挖掘痛点，并顺理成章进行连带销售...',
      coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
      linkedCombination: combinations[0]
        ? {
            combinationId: combinations[0].id,
            combinationName: combinations[0].name,
            mainProductId: combinations[0].mainProductId,
            crossSellingProductIds: combinations[0].crossSellingProductIds,
          }
        : undefined,
      scenarioTags: {
        scenarios: ['日常洗护'],
        demands: ['控油'],
        targetGroups: ['年轻顾客'],
        categoryDimensions: {},
        customTags: [],
      },
      steps: [
        {
          id: `step-${Date.now()}-1`,
          order: 1,
          title: '询问与探寻顾客需求',
          goal: '热情问候并发现深层肌肤/护理困扰',
          hint: '使用开放式提问，倾听为主',
        },
        {
          id: `step-${Date.now()}-2`,
          order: 2,
          title: '核心产品推荐与试用体验',
          goal: '讲解核心产品核心卖点并打消顾虑',
          hint: '在手背进行质地试用，突出即时效果',
        },
      ],
      createdAt: '2026-10-19',
      updatedAt: '2026-10-19',
      usageCount: 0,
    };
    onSaveScript(newScript);
    setSelectedScriptId(newId);
  };

  const handleSave = () => {
    if (!draftScript) return;
    const updated = {
      ...draftScript,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onSaveScript(updated);
  };

  return (
    <div className="flex h-full bg-[#FAF9F7] overflow-hidden">
      {/* ================= LEFT COLUMN: Scenario Script List (Matching Image 3) ================= */}
      <div className="w-80 md:w-88 bg-white border-r border-[#EAE7E0] flex flex-col shrink-0">
        {/* Header: Title & New Button */}
        <div className="p-4 border-b border-[#EAE7E0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#9E4A2B]" />
            <h2 className="text-sm font-bold text-[#1F2937]">
              场景剧本 ({filteredList.length})
            </h2>
          </div>
          <button
            onClick={handleCreateNewScript}
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
              placeholder="搜索场景剧本..."
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
              <option value="护肤">护肤</option>
              <option value="彩妆">彩妆</option>
              <option value="个护">个护</option>
            </select>

            <select
              value={comboFilter}
              onChange={(e) => setComboFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-white border border-[#D6D0C4] rounded-lg focus:outline-none text-[#4B5563] truncate"
            >
              <option value="ALL">全部产品组合</option>
              {combinations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scripts Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
          {filteredList.map((sc) => {
            const isSelected = sc.id === draftScript.id;
            return (
              <div
                key={sc.id}
                onClick={() => setSelectedScriptId(sc.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border text-xs relative ${
                  isSelected
                    ? 'bg-[#FFF7F2] border-[#E8734A] ring-1 ring-[#E8734A] shadow-xs'
                    : 'bg-white border-[#EAE6DD] hover:border-[#D6D0C4] hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EAE6DD] flex items-center justify-center shrink-0 text-[#9E4A2B]">
                    <FileText className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-xs text-[#1F2937] truncate leading-tight">
                      {sc.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#78716C] mt-1">
                      <MapPin className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                      <span className="truncate">
                        {sc.visibleRegions.slice(0, 2).join(', ') || 'kantor pusat'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#6B7280] line-clamp-2 mt-1 leading-relaxed">
                      {sc.sceneDescription}
                    </p>

                    {/* Linked combination badge */}
                    {sc.linkedCombination?.pairingType === 'official' || sc.linkedCombination?.combinationId ? (
                      <div className="mt-1.5">
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-300 truncate block font-medium">
                          🔗 正式组合: {sc.linkedCombination.combinationName}
                        </span>
                      </div>
                    ) : sc.linkedCombination?.mainProductId ? (
                      <div className="mt-1.5">
                        <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-300 truncate block font-medium">
                          🎨 自定义搭配 ({sc.linkedCombination.crossSellingProductIds?.length || 0}款连带)
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 mt-1 block">未关联产品</span>
                    )}

                    <div className="text-[10px] text-[#9CA3AF] mt-1">
                      创建时间: {sc.createdAt}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`确定要删除剧本《${sc.title}》吗？`)) {
                        onDeleteScript(sc.id);
                      }
                    }}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                    title="删除剧本"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= RIGHT COLUMN: Scenario Script Edit Workspace (Matching Image 3, 4, 5) ================= */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#EAE7E0] flex items-center justify-between shrink-0 bg-white">
          <div className="min-w-0 pr-4">
            <h1 className="text-base font-bold text-[#1F2937] truncate">
              编辑剧本：{draftScript.title}
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              配置剧情背景与考核指导节点
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3.5 py-1.5 border border-[#D6D0C4] hover:bg-gray-50 rounded-lg text-xs font-medium text-[#374151] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>预览效果</span>
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
                draftScript.status === 'enabled'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              {draftScript.status === 'enabled' ? '已启用' : '已停用'}
            </span>
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

          {/* CARD 1: 剧本基础信息 (Matching Image 3 & 4) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE3]">
              <Settings2 className="w-4 h-4 text-[#9E4A2B]" />
              <h3 className="font-bold text-xs text-[#1F2937]">剧本基础信息</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  * 剧本名称
                </label>
                <input
                  type="text"
                  value={draftScript.title}
                  onChange={(e) => setDraftScript({ ...draftScript, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  * 语种
                </label>
                <select
                  value={draftScript.language}
                  onChange={(e) => setDraftScript({ ...draftScript, language: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white"
                >
                  <option value="印尼语">印尼语</option>
                  <option value="中文">中文</option>
                  <option value="英语">英语</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  选择音色
                </label>
                <select
                  value={draftScript.voiceTone}
                  onChange={(e) => setDraftScript({ ...draftScript, voiceTone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white"
                >
                  <option value="Pemimpin Dominan">Pemimpin Dominan</option>
                  <option value="Ramah & Antusias">Ramah & Antusias</option>
                  <option value="Tenang">Tenang</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  内容分类
                </label>
                <select
                  value={draftScript.category}
                  onChange={(e) => setDraftScript({ ...draftScript, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white"
                >
                  <option value="护肤">护肤</option>
                  <option value="彩妆">彩妆</option>
                  <option value="个护">个护</option>
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
                      setDraftScript({
                        ...draftScript,
                        status: draftScript.status === 'enabled' ? 'disabled' : 'enabled',
                      })
                    }
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      draftScript.status === 'enabled' ? 'bg-[#9E4A2B]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        draftScript.status === 'enabled' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-semibold text-[#1F2937]">启用</span>
                </div>
              </div>
            </div>

            {/* Visible regions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#1F2937]">
                  可见地区
                </label>
                <button
                  type="button"
                  onClick={() => setDraftScript({ ...draftScript, visibleRegions: ['kantor pusat'] })}
                  className="text-[11px] text-[#9E4A2B] hover:underline"
                >
                  重置为默认
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 p-2 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD] max-h-32 overflow-y-auto">
                {ALL_REGIONS.map((reg) => {
                  const isChecked = draftScript.visibleRegions.includes(reg);
                  return (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => {
                        const next = isChecked
                          ? draftScript.visibleRegions.filter((r) => r !== reg)
                          : [...draftScript.visibleRegions, reg];
                        setDraftScript({ ...draftScript, visibleRegions: next });
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

            {/* Scene Description */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                场景介绍
              </label>
              <textarea
                rows={2}
                value={draftScript.sceneDescription}
                onChange={(e) => setDraftScript({ ...draftScript, sceneDescription: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
              />
            </div>

            {/* Scene Prompt */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                场景提示词
              </label>
              <textarea
                rows={4}
                value={draftScript.scenePrompt}
                onChange={(e) => setDraftScript({ ...draftScript, scenePrompt: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] font-sans leading-relaxed"
              />
            </div>
          </div>

          {/* CARD 2: ★ 场景产品配置 (核心介绍产品 + 搭配介绍产品) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE3]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9E4A2B]" />
                <h3 className="font-bold text-xs text-[#1F2937]">
                  场景产品配置
                </h3>
                {matchingOfficialCombo ? (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    已匹配正式组合：{matchingOfficialCombo.name.split(' ')[0]}
                  </span>
                ) : mainProduct ? (
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    自定义搭配 ({crossProducts.length}款搭配)
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                    待配置场景产品
                  </span>
                )}
              </div>
              {mainProduct && onNavigateToProduct && (
                <button
                  type="button"
                  onClick={() => onNavigateToProduct(mainProduct)}
                  className="text-xs text-[#9E4A2B] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>查看核心产品详情</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* FIELD A: 核心介绍产品 (必选，来源全量产品库，支持搜索与回显) */}
              <div className="p-4 bg-[#FFF9F5] rounded-xl border border-[#FED7AA] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#9A3412] flex items-center gap-1.5">
                    <span>⭐ 核心介绍产品 (必选)</span>
                    <span className="text-[10px] text-gray-500 font-normal">
                      来自系统全部产品，不强制限定已有组合
                    </span>
                  </label>
                </div>

                <div className="space-y-2">
                  <select
                    value={draftScript.linkedCombination?.mainProductId || ''}
                    onChange={(e) => handleSelectMainProduct(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#FDBA74] rounded-lg bg-white font-semibold text-[#1F2937] focus:outline-none focus:border-[#9E4A2B]"
                  >
                    <option value="">-- 请选择核心介绍产品 (必选) --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.brand}] {p.name} ({p.category})
                      </option>
                    ))}
                  </select>

                  {/* Selected Main Product Card */}
                  {mainProduct && (
                    <div className="p-3 bg-white rounded-lg border border-[#FDBA74] flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={mainProduct.image}
                          alt={mainProduct.name}
                          className="w-12 h-12 rounded-lg object-cover border border-[#EAE6DD] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#9E4A2B] text-white px-1.5 py-0.2 rounded font-bold">
                              ⭐ 核心产品
                            </span>
                            <span className="font-bold text-xs text-[#1F2937] truncate">
                              {mainProduct.name}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#6B7280] font-mono mt-0.5">
                            品牌: {mainProduct.brand} · SKU: {mainProduct.sku}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FIELD B: 搭配介绍产品 (选填，可多选，从全量产品选择，支持添加与移除) */}
              <div className="p-4 bg-[#F8FAF9] rounded-xl border border-[#A7F3D0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-xs font-bold text-[#065F46] flex items-center gap-1.5">
                      <span>🔗 搭配介绍产品 (选填，可多选)</span>
                    </label>
                    <span className="text-[11px] text-[#6B7280] font-normal">
                      从产品库选择，可添加多个
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                    已选 {crossProducts.length} 款
                  </span>
                </div>

                {/* Selected Cross-selling Products Chips */}
                {crossProducts.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] text-gray-500 font-medium">当前选中的搭配产品列表：</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {crossProducts.map((cp) => (
                        <div
                          key={cp.id}
                          className="p-2.5 bg-white rounded-lg border border-emerald-300 flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={cp.image}
                              alt={cp.name}
                              className="w-9 h-9 rounded object-cover border border-gray-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-bold border border-emerald-200">
                                  搭配品
                                </span>
                                <span className="font-semibold text-xs text-[#1F2937] truncate">
                                  {cp.name}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono truncate">
                                {cp.brand} · {cp.sku}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleCrossProduct(cp.id)}
                            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                            title="移除此搭配产品"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product search and addition list */}
                <div className="space-y-2 pt-2 border-t border-[#D1FAE5]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#374151]">
                      从产品库搜索添加搭配产品：
                    </span>
                    <div className="relative w-52">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
                      <input
                        type="text"
                        placeholder="搜索产品名称、品牌..."
                        value={crossProdSearch}
                        onChange={(e) => setCrossProdSearch(e.target.value)}
                        className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                    {products
                      .filter((p) => p.id !== draftScript.linkedCombination?.mainProductId)
                      .filter(
                        (p) =>
                          !crossProdSearch ||
                          p.name.toLowerCase().includes(crossProdSearch.toLowerCase()) ||
                          p.brand.toLowerCase().includes(crossProdSearch.toLowerCase()) ||
                          p.sku.toLowerCase().includes(crossProdSearch.toLowerCase())
                      )
                      .map((p) => {
                        const isSelected = (
                          draftScript.linkedCombination?.crossSellingProductIds || []
                        ).includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleToggleCrossProduct(p.id)}
                            className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-7 h-7 rounded object-cover border border-gray-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-xs truncate">{p.name}</div>
                                <div className="text-[10px] text-gray-400 truncate">
                                  [{p.brand}] {p.sku}
                                </div>
                              </div>
                            </div>
                            <div className="shrink-0 ml-2">
                              {isSelected ? (
                                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-semibold flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> 已添加
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-medium">
                                  + 添加为搭配品
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* COMBINATION MATCH STATUS & SYNC OPTION */}
              {matchingOfficialCombo ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>已匹配正式组合：{matchingOfficialCombo.name}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    当前核心产品与搭配产品组合与后台连带销售模块完全一致，在产品详情页和对练推荐中享有「组合主推剧本」最高推荐优先级。
                  </p>
                </div>
              ) : mainProduct && crossProducts.length > 0 ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>当前搭配为「自定义搭配」</span>
                    </div>
                    {showSyncSuccess && (
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                        ✅ 已成功同步为正式组合！
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    当前搭配尚未建立正式产品组合。剧本可按自定义搭配<strong>正常保存与发布对练</strong>，在核心产品与搭配产品各自的产品详情页中均可正常使用。
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    {onSaveCombination && (
                      <button
                        type="button"
                        onClick={handleSyncCreateCombination}
                        className="px-3 py-1.5 bg-[#9E4A2B] hover:bg-[#853C21] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>同步创建为新的连带销售组合</span>
                      </button>
                    )}
                    <span className="text-[11px] text-gray-500">
                      （点击将自动在后台建立对应产品组合，不创建亦可直接保存剧本）
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* CARD 3: ★ 核心升级：场景标签配置 (特别强调：全部可选！不设必填限制) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#9E4A2B]" />
                <h3 className="font-bold text-xs text-[#1F2937]">
                  场景标签配置 (多维标签)
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  全部可选 / 非必填限制
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

            {/* Special Callout Note */}
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-800 leading-relaxed">
              <strong>✨ 标签配置规则：</strong>
              场景标签全部可选，不设任何必填限制。允许只选择场景、只选择人群、或一个标签都不选。未选择标签时，剧本依然可正常保存、编辑、关联产品组合并参与任务发布！
            </div>

            {/* Dynamic Dimensions List */}
            <div className="space-y-3.5 pt-1">
              {activeDimensions.map((dim) => {
                const isSingle = dim.selectionType === 'single';
                return (
                  <div key={dim.id} className="space-y-1.5">
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

              {/* Custom / Legacy Tags Input */}
              <div className="pt-3 border-t border-[#F0ECE3] space-y-2">
                <label className="block text-xs font-semibold text-[#1F2937]">
                  自定义自由标签 (兼容历史自由标签输入)
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

                {(draftScript.scenarioTags.customTags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(draftScript.scenarioTags.customTags || []).map((t, idx) => (
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

          {/* CARD 4: 场景配图 (Matching Image 4) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE3]">
              <ImageIcon className="w-4 h-4 text-[#9E4A2B]" />
              <h3 className="font-bold text-xs text-[#1F2937]">场景配图</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-48 h-32 rounded-xl overflow-hidden border border-[#EAE6DD] bg-[#FAF8F5] shrink-0">
                <img
                  src={
                    draftScript.coverImage ||
                    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80'
                  }
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-[#1F2937]">
                  可以上传一张图，来生动展示这个场景
                </div>
                <ul className="text-[#6B7280] text-[11px] space-y-1 list-disc pl-4">
                  <li>AI 配图规格: 1024x1536 px, 适配 App 聊天背景板</li>
                  <li>支持 JPG、PNG、WebP</li>
                  <li>大小限制: 不得超过 2MB</li>
                </ul>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-white hover:bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    选择本地图片
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-white hover:bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    从图库选择
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-[#9E4A2B] text-white hover:bg-[#853C21] text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>一键 AI 配图</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 5: 剧本步骤与提示节点 (Matching Image 5) */}
          <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#9E4A2B]" />
                <h3 className="font-bold text-xs text-[#1F2937]">
                  剧本步骤与提示节点 ({draftScript.steps.length})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-xs px-2.5 py-1 bg-[#FAF8F5] border border-[#D6D0C4] rounded-lg text-[#374151] hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#EA580C]" />
                  <span>AI 一键生成剧本</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="text-xs px-3 py-1 bg-[#9E4A2B] text-white rounded-lg font-semibold hover:bg-[#853C21] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增步骤</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {draftScript.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD] space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#FFF0E6] text-[#9E4A2B] font-bold text-xs flex items-center justify-center border border-[#FDBA74]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs text-[#1F2937]">步骤标题</span>
                    </div>
                    {draftScript.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(step.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="删除该步骤"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleUpdateStep(step.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-white focus:outline-none focus:border-[#9E4A2B] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                      步骤目标
                    </label>
                    <input
                      type="text"
                      value={step.goal}
                      onChange={(e) => handleUpdateStep(step.id, 'goal', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-white focus:outline-none focus:border-[#9E4A2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                      回答提示 <span className="font-normal text-[#9CA3AF]">(选填，给 BA 的指引)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={step.hint || ''}
                      onChange={(e) => handleUpdateStep(step.id, 'hint', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-white focus:outline-none focus:border-[#9E4A2B]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: Script Step-by-Step Preview ================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-[#EAE6DD]">
            <div className="px-5 py-3.5 border-b border-[#EAE6DD] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <h3 className="font-bold text-xs text-[#1F2937]">剧本对练预览：{draftScript.title}</h3>
                <div className="text-[10px] text-[#6B7280]">
                  {mainProduct ? `核心产品: 【${mainProduct.brand}】${mainProduct.name}` : '未关联核心产品'}
                </div>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8F6F2]">
              <div className="p-3 bg-white rounded-xl border border-[#EAE6DD] space-y-1.5 text-xs">
                <span className="font-bold text-[#1F2937]">场景背景设定：</span>
                <p className="text-[#4B5563] leading-relaxed">{draftScript.scenePrompt}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs text-[#1F2937]">考核互动节点 (共 {draftScript.steps.length} 步)：</h4>
                {draftScript.steps.map((st, i) => (
                  <div key={st.id} className="p-3 bg-white rounded-xl border border-[#EAE6DD] space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#9E4A2B] text-white text-[11px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-bold text-[#1F2937]">{st.title}</span>
                    </div>
                    <div className="text-[#6B7280] text-[11px] pl-7">
                      <strong>考核目标：</strong>{st.goal}
                    </div>
                    {st.hint && (
                      <div className="text-[#9E4A2B] text-[11px] pl-7 bg-[#FFF7ED] p-2 rounded mt-1 border border-[#FED7AA]">
                        <strong>💡 BA 回答指引：</strong>{st.hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white border-t border-[#EAE6DD] flex justify-end">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-1.5 bg-[#9E4A2B] text-white rounded-lg text-xs font-semibold hover:bg-[#853C21]"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
