import React, { useState, useMemo, useEffect } from 'react';
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
  Info,
  User,
  ArrowUpDown,
  Edit3,
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

// 三大分类定义：全部 / 彩妆 / 护肤 / 直播间
type CategoryType = 'ALL' | '彩妆' | '护肤' | '直播间';

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
  // 分类 Tab 状态：全部 / 彩妆 / 护肤 / 直播间
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'enabled' | 'disabled'>('ALL');
  const [productFilter, setProductFilter] = useState('ALL');
  const [creatorFilter, setCreatorFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'updated' | 'usage' | 'score'>('updated');

  // 新增 / 编辑弹窗状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draftScript, setDraftScript] = useState<ScenarioScriptItem | null>(null);
  const [customTagInput, setCustomTagInput] = useState('');

  // 剧本 AI 对练模拟预览状态
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewingScript, setPreviewingScript] = useState<ScenarioScriptItem | null>(null);
  const [previewChatTurns, setPreviewChatTurns] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [userChatInput, setUserChatInput] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // 搜索搭配介绍品状态
  const [crossProdSearch, setCrossProdSearch] = useState('');
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  // 可选创建人列表提取
  const availableCreators = useMemo(() => {
    const set = new Set<string>();
    scripts.forEach((s) => {
      if (s.creator) set.add(s.creator);
    });
    if (set.size === 0) {
      set.add('李娜 (护肤顾问)');
      set.add('林晨 (总培训师)');
      set.add('王芳 (培训主管)');
      set.add('陈思雨 (彩妆导师)');
      set.add('张强 (直播运营)');
    }
    return Array.from(set);
  }, [scripts]);

  // 分类统计
  const counts = useMemo(() => {
    let makeup = 0;
    let skincare = 0;
    let livestream = 0;
    scripts.forEach((sc) => {
      if (sc.category === '彩妆') {
        makeup++;
      } else if (sc.category === '护肤' || sc.category === '个护' || sc.category === '洗护专区') {
        skincare++;
      } else if (sc.category === '直播间') {
        livestream++;
      } else {
        makeup++;
      }
    });
    return {
      all: scripts.length,
      makeup,
      skincare,
      livestream,
    };
  }, [scripts]);

  // 处理来自其他页面的初始选中或连带组合预填请求
  useEffect(() => {
    if (initialSelectedScriptId) {
      const found = scripts.find((s) => s.id === initialSelectedScriptId);
      if (found) {
        setDraftScript(JSON.parse(JSON.stringify(found)));
        setIsEditModalOpen(true);
      }
    }
  }, [initialSelectedScriptId, scripts]);

  useEffect(() => {
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
        category: mainP?.category === 'MAKEUP' ? '彩妆' : '护肤',
        creator: '林晨 (总培训师)',
        avgScore: 92,
        visibleRegions: ['kantor pusat'],
        sceneDescription: `顾客咨询购买【${mainP?.name || '核心单品'}】，BA通过专业提问挖掘潜在关联需求，顺势引入连带产品进行搭配推荐。`,
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
      setDraftScript(newScript);
      setIsEditModalOpen(true);
      onClearInitialPrefill?.();
    }
  }, [initialPrefillCombo, products, onSaveScript, onClearInitialPrefill]);

  // 列表过滤与排序
  const filteredList = useMemo(() => {
    return scripts
      .filter((sc) => {
        // 1. 三类分类过滤
        if (selectedCategory !== 'ALL') {
          if (selectedCategory === '彩妆') {
            if (sc.category !== '彩妆') return false;
          } else if (selectedCategory === '护肤') {
            if (sc.category !== '护肤' && sc.category !== '个护' && sc.category !== '洗护专区') {
              return false;
            }
          } else if (selectedCategory === '直播间') {
            if (sc.category !== '直播间') return false;
          }
        }

        // 2. 状态过滤
        if (statusFilter !== 'ALL' && sc.status !== statusFilter) return false;

        // 3. 关联产品过滤
        if (productFilter !== 'ALL') {
          const isMain = sc.linkedCombination?.mainProductId === productFilter;
          const isCross = (sc.linkedCombination?.crossSellingProductIds || []).includes(productFilter);
          if (!isMain && !isCross) return false;
        }

        // 4. 创建人过滤
        if (creatorFilter !== 'ALL') {
          const itemCreator = sc.creator || '林晨 (总培训师)';
          if (itemCreator !== creatorFilter) return false;
        }

        // 5. 搜索词
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = sc.title.toLowerCase().includes(q);
          const matchDesc = sc.sceneDescription.toLowerCase().includes(q);
          const matchCreator = (sc.creator || '林晨 (总培训师)').toLowerCase().includes(q);
          const mainP = products.find((p) => p.id === sc.linkedCombination?.mainProductId);
          const matchMainP = mainP ? mainP.name.toLowerCase().includes(q) : false;
          const matchTags = Object.values(sc.scenarioTags || {})
            .flat()
            .some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCreator && !matchMainP && !matchTags) {
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
  }, [scripts, selectedCategory, statusFilter, productFilter, creatorFilter, searchQuery, sortBy, products]);

  // 当前编辑 draft 中的核心产品与搭配产品
  const mainProduct = useMemo(() => {
    const pId = draftScript?.linkedCombination?.mainProductId;
    if (!pId) return null;
    return products.find((p) => p.id === pId) || null;
  }, [products, draftScript?.linkedCombination?.mainProductId]);

  const crossProducts = useMemo(() => {
    const ids = draftScript?.linkedCombination?.crossSellingProductIds || [];
    return products.filter((p) => ids.includes(p.id));
  }, [products, draftScript?.linkedCombination?.crossSellingProductIds]);

  // 匹配后台正式连带销售组合
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

  // 标签品类专属维度计算
  const applicableCategoryKey = useMemo(() => {
    if (draftScript?.category === '护肤') return 'SKINCARE';
    if (draftScript?.category === '彩妆') return 'MAKEUP';
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
  }, [mainProduct, draftScript?.category]);

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

  // 标签勾选
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
    if (!draftScript) return false;
    if (dimName === '适用场景' || dimName === '消费场景')
      return (draftScript.scenarioTags.scenarios || []).includes(option);
    if (dimName === '核心需求' || dimName === '顾客需求')
      return (draftScript.scenarioTags.demands || []).includes(option);
    if (dimName === '适用人群' || dimName === '顾客人群')
      return (draftScript.scenarioTags.targetGroups || []).includes(option);
    return (draftScript.scenarioTags.categoryDimensions?.[dimName] || []).includes(option);
  };

  const handleAddCustomTag = () => {
    if (!draftScript || !customTagInput.trim()) return;
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

  const handleRemoveCustomTag = (tag: string) => {
    if (!draftScript) return;
    setDraftScript({
      ...draftScript,
      scenarioTags: {
        ...draftScript.scenarioTags,
        customTags: (draftScript.scenarioTags.customTags || []).filter((t) => t !== tag),
      },
    });
  };

  // 核心介绍产品切换
  const handleSelectMainProduct = (productId: string) => {
    if (!draftScript) return;
    const currentCross = draftScript.linkedCombination?.crossSellingProductIds || [];
    const nextCross = currentCross.filter((id) => id !== productId);

    setDraftScript({
      ...draftScript,
      linkedCombination: {
        combinationId: '',
        combinationName: '自定义搭配',
        mainProductId: productId,
        crossSellingProductIds: nextCross,
        pairingType: 'custom',
      },
    });
  };

  // 搭配介绍产品增删
  const handleToggleCrossProduct = (productId: string) => {
    if (!draftScript) return;
    const currentCross = draftScript.linkedCombination?.crossSellingProductIds || [];
    const exists = currentCross.includes(productId);
    const nextCross = exists
      ? currentCross.filter((id) => id !== productId)
      : [...currentCross, productId];

    const mainId = draftScript.linkedCombination?.mainProductId || '';
    const matched = combinations.find(
      (c) =>
        c.mainProductId === mainId &&
        c.crossSellingProductIds.length === nextCross.length &&
        c.crossSellingProductIds.every((id) => nextCross.includes(id))
    );

    setDraftScript({
      ...draftScript,
      linkedCombination: {
        combinationId: matched ? matched.id : '',
        combinationName: matched ? matched.name : '自定义搭配',
        mainProductId: mainId,
        crossSellingProductIds: nextCross,
        pairingType: matched ? 'official' : 'custom',
      },
    });
  };

  // 同步创建为正式组合
  const handleSyncCreateCombination = () => {
    if (!draftScript || !onSaveCombination || !mainProduct) return;
    const mainId = draftScript.linkedCombination?.mainProductId;
    const crossIds = draftScript.linkedCombination?.crossSellingProductIds || [];
    if (!mainId || crossIds.length === 0) return;

    const newCombo: ProductCombination = {
      id: `combo-synced-${Date.now()}`,
      name: `【${mainProduct.brand}】${mainProduct.name} + ${crossProducts.map((p) => p.name).join(' + ')} 连带组合`,
      mainProductId: mainId,
      crossSellingProductIds: crossIds,
      description: `基于场景剧本《${draftScript.title}》自动同步生成的连带销售组合`,
      recommendReason: draftScript.sceneDescription || '专柜BA实战对练推荐组合',
      recommendedPitch: draftScript.scenePrompt ? draftScript.scenePrompt.slice(0, 100) : '成套购买享受更多优惠',
      isConfirmed: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSaveCombination(newCombo);
    setDraftScript({
      ...draftScript,
      linkedCombination: {
        ...draftScript.linkedCombination,
        combinationId: newCombo.id,
        combinationName: newCombo.name,
        pairingType: 'official',
        mainProductId: mainId,
        crossSellingProductIds: crossIds,
      },
    });
    setShowSyncSuccess(true);
    setTimeout(() => setShowSyncSuccess(false), 3000);
  };

  // 步骤编辑
  const handleAddStep = () => {
    if (!draftScript) return;
    const newStep: ScriptStep = {
      id: `step-${Date.now()}`,
      order: draftScript.steps.length + 1,
      title: `步骤 ${draftScript.steps.length + 1}`,
      goal: '设定该步骤的考核目标',
      hint: '',
    };
    setDraftScript({
      ...draftScript,
      steps: [...draftScript.steps, newStep],
    });
  };

  const handleUpdateStep = (id: string, field: 'title' | 'goal' | 'hint', value: string) => {
    if (!draftScript) return;
    setDraftScript({
      ...draftScript,
      steps: draftScript.steps.map((st) => (st.id === id ? { ...st, [field]: value } : st)),
    });
  };

  const handleRemoveStep = (id: string) => {
    if (!draftScript) return;
    setDraftScript({
      ...draftScript,
      steps: draftScript.steps.filter((st) => st.id !== id),
    });
  };

  // 新建剧本入口
  const handleCreateNewScript = () => {
    const newId = `sc-custom-${Date.now()}`;
    const defaultCat =
      selectedCategory === '彩妆' || selectedCategory === '护肤' || selectedCategory === '直播间'
        ? selectedCategory
        : '护肤';

    const defaultProd = products[0];

    const newScript: ScenarioScriptItem = {
      id: newId,
      title: '新场景实战剧本',
      language: '印尼语',
      status: 'enabled',
      voiceTone: 'Ramah & Antusias',
      category: defaultCat,
      creator: '林晨 (总培训师)',
      avgScore: 92,
      visibleRegions: ['kantor pusat'],
      sceneDescription: '顾客专柜咨询核心功效，BA通过深入倾听引导搭配产品连带销售...',
      scenePrompt: '顾客进店寻找适合自己日常使用的产品。BA需要以热情专业的态度提问、倾听、演示核心卖点，并顺应顾客痛点推荐搭配产品。',
      coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
      linkedCombination: {
        mainProductId: defaultProd?.id || '',
        crossSellingProductIds: [],
        pairingType: 'custom',
      },
      scenarioTags: {
        scenarios: ['日常通勤'],
        demands: ['保湿', '持妆'],
        targetGroups: ['年轻顾客'],
        categoryDimensions: {},
        customTags: ['实战对练'],
      },
      steps: [
        {
          id: 'step-1',
          order: 1,
          title: '步骤一：礼貌问候与顾客痛点探询',
          goal: '快速破冰，探寻顾客在日常护肤/妆容中的核心困扰',
          hint: '采用开放式提问，倾听顾客真实使用场景与抗拒点',
        },
        {
          id: 'step-2',
          order: 2,
          title: '步骤二：核心产品卖点推介与质地体验',
          goal: '引导顾客感受产品质地与功效，建立专业信任',
          hint: '在手背或试妆区现场示范，讲解成分科技与使用手法',
        },
        {
          id: 'step-3',
          order: 3,
          title: '步骤三：顺势连带搭配介绍与成套促成',
          goal: '自然引出搭配介绍产品，阐述1+1>2成套效果',
          hint: '演示成套使用的叠加收益，提示满减或买赠政策完成连带促单',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
    };

    setDraftScript(newScript);
    setIsEditModalOpen(true);
  };

  // 编辑已有剧本
  const handleEditScript = (script: ScenarioScriptItem) => {
    setDraftScript(JSON.parse(JSON.stringify(script)));
    setIsEditModalOpen(true);
  };

  // 保存剧本
  const handleSave = () => {
    if (!draftScript) return;
    if (!draftScript.title.trim()) {
      alert('请输入剧本名称');
      return;
    }
    if (!draftScript.linkedCombination?.mainProductId) {
      alert('请选择核心介绍产品 (必选)');
      return;
    }

    const updated: ScenarioScriptItem = {
      ...draftScript,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSaveScript(updated);
    setIsEditModalOpen(false);
  };

  // 开启剧本 AI 对练模拟预览
  const handleOpenPreview = (script: ScenarioScriptItem) => {
    setPreviewingScript(script);
    setCurrentStepIndex(0);
    const mainP = products.find((p) => p.id === script.linkedCombination?.mainProductId);

    // 根据剧本情境生成拟真顾客开场白
    let initialGreeting = '';
    if (script.language === '印尼语') {
      initialGreeting = script.scenePrompt
        ? `${script.scenePrompt.split('\n')[0]}`
        : `Halo Mbak/Mas! Saya tertarik dengan ${mainP?.name || 'produk ini'}, tapi kulit saya lagi sensitif dan gampang kusam. Ada saran?`;
    } else {
      initialGreeting = script.scenePrompt
        ? `${script.scenePrompt.split('\n')[0]}`
        : `您好！我在柜台看到这款【${mainP?.name || '核心单品'}】，但我平时容易脱妆暗沉，想先了解一下具体功效和使用方法。`;
    }

    setPreviewChatTurns([
      {
        sender: 'ai',
        text: initialGreeting,
      },
    ]);
    setUserChatInput('');
    setIsPreviewOpen(true);
  };

  // 发送消息并推动步骤进度与 AI 回复
  const handleSendScriptPreviewChat = () => {
    if (!userChatInput.trim() || !previewingScript) return;
    const userMsg = userChatInput.trim();
    setUserChatInput('');

    const steps = previewingScript.steps || [];
    const isCompletedAll = currentStepIndex >= steps.length - 1;
    const nextIdx = currentStepIndex + 1 < steps.length ? currentStepIndex + 1 : currentStepIndex;

    const mainP = products.find((p) => p.id === previewingScript.linkedCombination?.mainProductId);
    const crossProds = products.filter((p) =>
      (previewingScript.linkedCombination?.crossSellingProductIds || []).includes(p.id)
    );

    let aiReply = '';
    if (previewingScript.language === '印尼语') {
      if (currentStepIndex === 0) {
        aiReply = `Wah penjelasan awal yang sangat ramah dan solutif! Saya jadi paham kondisi kulit saya. Nah, apakah tekstur ${mainP?.name || 'produk ini'} nyaman dipakai seharian?`;
      } else if (currentStepIndex === 1) {
        aiReply = crossProds.length > 0
          ? `Teksturnya sepertinya cocok sekali! Kalau saya kombinasikan dengan ${crossProds[0].name}, apakah hasilnya jauh lebih optimal? Boleh jelaskan kelebihannya?`
          : `Penjelasannya sangat meyakinkan! Bagaimana tips pemakaian terbaik agar hasilnya tahan lama?`;
      } else {
        aiReply = `Luar biasa, rekomendasi Anda sangat pas dengan kebutuhan saya! Saya ambil kombinasi ini sekalian ya, terima kasih banyak atas pelayanannya yang profesional!`;
      }
    } else {
      if (currentStepIndex === 0) {
        aiReply = `听您这么一讲确实很专业，一下就切中了我平时的痛点！那这款【${mainP?.name || '核心单品'}】质地和吸收速度怎么样？白天用会搓泥或暗沉吗？`;
      } else if (currentStepIndex === 1) {
        aiReply = crossProds.length > 0
          ? `原来成套搭配使用效果更好！那如果加上您刚才推荐的【${crossProds[0].name}】，这两款一起用有什么具体的优惠或手法讲究吗？`
          : `原来这样用效果最好！今天专柜有什么组合活动或赠品吗？`;
      } else {
        aiReply = `太棒了！你的推荐非常全面，解决了我全部的顾虑。把这套搭配产品直接帮我装一套吧，谢谢你！`;
      }
    }

    setPreviewChatTurns((prev) => [
      ...prev,
      { sender: 'user', text: userMsg },
      { sender: 'ai', text: aiReply },
    ]);

    if (!isCompletedAll) {
      setCurrentStepIndex(nextIdx);
    }
  };

  // 分类 Badge 样式
  const getCategoryBadgeStyle = (category: string) => {
    if (category === '彩妆') {
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        text: '💄 彩妆',
      };
    }
    if (category === '护肤' || category === '个护' || category === '洗护专区') {
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
      text: category || '护肤',
    };
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF9F7] overflow-hidden">
      {/* ================= TOP HEADER (简洁标题与操作区) ================= */}
      <div className="px-6 py-4 bg-white border-b border-[#EAE7E0] shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#9E4A2B] text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-base font-bold text-[#1F2937]">
              场景剧本
            </h1>
            <span className="text-xs bg-orange-50 text-[#9E4A2B] font-semibold px-2.5 py-0.5 rounded-full border border-orange-200">
              共 {scripts.length} 个剧本
            </span>
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
              onClick={handleCreateNewScript}
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
            <span>全部剧本</span>
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

      {/* ================= SECONDARY FILTER BAR (支持搜索、状态、关联产品、创建人、排序) ================= */}
      <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#EAE6DD] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜索场景剧本标题、描述、创建人、产品或标签..."
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

          {/* Creator filter (创建人筛选) */}
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
            当前展示 <strong>{filteredList.length}</strong> 个剧本
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

      {/* ================= MAIN ASSET GRID (分三类列表全景卡片展示) ================= */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EAE6DD] p-12 text-center max-w-lg mx-auto my-12 shadow-2xs space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] border border-[#EAE6DD] flex items-center justify-center text-[#9E4A2B]">
              <FileText className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-bold text-sm text-[#1F2937]">暂无符合条件的场景剧本</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              没有找到符合当前分类或搜索条件的剧本。您可以重置筛选条件，或直接点击下方按钮新建。
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setProductFilter('ALL');
                  setCreatorFilter('ALL');
                }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
              >
                重置全部筛选
              </button>
              <button
                type="button"
                onClick={handleCreateNewScript}
                className="px-4 py-1.5 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建剧本</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
            {filteredList.map((sc) => {
              const mainProd = products.find((p) => p.id === sc.linkedCombination?.mainProductId);
              const crossProds = products.filter((p) =>
                (sc.linkedCombination?.crossSellingProductIds || []).includes(p.id)
              );
              const catBadge = getCategoryBadgeStyle(sc.category);
              const isEnabled = sc.status === 'enabled';

              return (
                <div
                  key={sc.id}
                  className="bg-white rounded-xl border border-[#EAE6DD] hover:border-[#D6D0C4] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Top Row: Category Badge, Status & Updated Time */}
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${catBadge.bg}`}>
                        {catBadge.text}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isEnabled ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                          title={isEnabled ? '已启用' : '已停用'}
                        />
                        <span className="text-[10px] text-gray-400 font-mono">
                          {sc.updatedAt || sc.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Title & Creator */}
                    <div>
                      <h3
                        onClick={() => handleEditScript(sc)}
                        className="font-bold text-xs text-[#1F2937] hover:text-[#9E4A2B] line-clamp-2 mt-0.5 cursor-pointer leading-snug"
                        title={sc.title}
                      >
                        {sc.title}
                      </h3>

                      {/* 创建人放在原来名字下面/原地区位置 */}
                      <div className="text-[11px] text-[#6B7280] flex items-center gap-1 mt-1">
                        <User className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">创建人：{sc.creator || '林晨 (总培训师)'}</span>
                      </div>
                    </div>

                    {/* 语种显示 (保留，不显示音色和具体描述) */}
                    <div className="pt-1 border-t border-[#F0ECE3] flex items-center justify-between text-[11px] text-[#78716C]">
                      <span>语种</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-mono">
                        {sc.language || '印尼语'}
                      </span>
                    </div>

                    {/* Product Configuration Block (核心介绍产品 + 搭配介绍产品) */}
                    <div className="p-2.5 bg-[#FAF9F7] rounded-lg border border-[#F0EDE6] space-y-2">
                      {/* Main Product */}
                      {mainProd ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={mainProd.image}
                            alt={mainProd.name}
                            className="w-8 h-8 rounded object-cover border border-orange-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1 text-[11px]">
                            <div className="text-[#9A3412] font-semibold truncate flex items-center gap-1">
                              <span>⭐ 核心: {mainProd.name}</span>
                            </div>
                            <div className="text-[10px] text-[#7C2D12]/70 font-mono truncate">
                              [{mainProd.brand}] {mainProd.sku}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-400 italic">未配置核心介绍产品</div>
                      )}

                      {/* Cross-selling products preview */}
                      <div className="pt-1 border-t border-[#EFECE5] flex items-center justify-between text-[10px]">
                        <span className="text-[#4B5563]">
                          搭配产品：
                          <strong className="text-emerald-700 font-semibold ml-0.5">
                            {crossProds.length > 0 ? `${crossProds.length} 款` : '暂未搭配'}
                          </strong>
                        </span>
                        {sc.linkedCombination?.combinationName && sc.linkedCombination?.pairingType === 'official' ? (
                          <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded font-medium border border-emerald-200 truncate max-w-[130px]">
                            正式组合
                          </span>
                        ) : crossProds.length > 0 ? (
                          <span className="bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded font-medium border border-amber-200">
                            自定义搭配
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Persona Tags Preview */}
                    <div className="flex flex-wrap gap-1">
                      {(sc.scenarioTags?.demands || []).slice(0, 2).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200"
                        >
                          #{tag}
                        </span>
                      ))}
                      {(sc.scenarioTags?.scenarios || []).slice(0, 1).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200"
                        >
                          @{tag}
                        </span>
                      ))}
                      {(sc.scenarioTags?.customTags || []).slice(0, 1).map((tag, tIdx) => (
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
                      <span>练习次数: <strong className="text-[#9E4A2B] font-semibold">{sc.usageCount || 0}次</strong></span>
                      <span>均分: <strong className="text-emerald-700 font-semibold">{sc.avgScore || 92}分</strong></span>
                    </div>
                  </div>

                  {/* Card Footer Actions: 最下面就显示预览效果和编辑就行，添加上产品之后不用显示发任务 */}
                  <div className="px-3 py-2 bg-[#FAF8F5] border-t border-[#EAE6DD] flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(sc)}
                      className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#374151] border border-gray-300 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="在线步骤与提示对练预览"
                    >
                      <Eye className="w-3 h-3 text-[#6B7280]" />
                      <span>预览效果</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditScript(sc)}
                        className="px-2.5 py-1 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>编辑</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`确定要删除场景剧本《${sc.title}》吗？`)) {
                            onDeleteScript(sc.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                        title="删除该剧本"
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

      {/* ================= EDIT MODAL: 场景剧本配置全屏浮层 (点击新增或编辑时弹出) ================= */}
      {isEditModalOpen && draftScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#EAE6DD]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EAE7E0] flex items-center justify-between bg-white shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#1F2937] truncate">
                    {draftScript.id.startsWith('sc-custom-') ? '新增场景剧本' : `编辑剧本：${draftScript.title}`}
                  </h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium border ${
                      draftScript.status === 'enabled'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {draftScript.status === 'enabled' ? '已启用' : '已停用'}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  配置剧情背景、场景产品搭配与考核指导节点
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenPreview(draftScript)}
                  className="px-3 py-1.5 border border-[#D6D0C4] hover:bg-gray-50 rounded-lg text-xs font-medium text-[#374151] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>预览效果</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>保存剧本</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="关闭"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FAF9F7] scrollbar-thin">
              {/* Warning Banner */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-800 flex items-start gap-2 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  请尽量详细、准确填写所有提示词和使用提示，这会直接影响最终 AI 陪练和练习效果。
                </span>
              </div>

              {/* CARD 1: 剧本基础信息 */}
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
                      placeholder="输入剧本名称..."
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <option value="彩妆">彩妆</option>
                      <option value="护肤">护肤</option>
                      <option value="直播间">直播间</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                      创建人
                    </label>
                    <input
                      type="text"
                      value={draftScript.creator || '林晨 (总培训师)'}
                      onChange={(e) => setDraftScript({ ...draftScript, creator: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white"
                    />
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

                  <div className="flex flex-wrap gap-1.5 p-2 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD] max-h-28 overflow-y-auto">
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
                  {/* FIELD A: 核心介绍产品 (必选，来源全量产品库) */}
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

                  {/* FIELD B: 搭配介绍产品 (选填，可多选，在标题右侧以普通灰色小字提示) */}
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

              {/* CARD 3: ★ 核心升级：场景标签配置 (全部可选！非必填) */}
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

              {/* CARD 4: 场景配图 */}
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
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 5: 剧本步骤与提示节点 */}
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

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-[#EAE6DD] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#6B7280]">
                {mainProduct ? `已选择核心介绍产品：【${mainProduct.brand}】${mainProduct.name}` : '⚠️ 请选择核心介绍产品'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>保存剧本</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: 剧本 AI 对练模拟预览 (可与 AI 进行对话，根据剧本步骤引导完成) ================= */}
      {isPreviewOpen && previewingScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[88vh] max-h-[820px] overflow-hidden border border-[#EAE6DD]">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-[#EAE6DD] flex items-center justify-between bg-[#FAF8F5] shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] bg-[#9E4A2B] text-white px-2 py-0.5 rounded font-bold">
                    剧本实战对练
                  </span>
                  <h3 className="font-bold text-xs text-[#1F2937] truncate max-w-sm md:max-w-md">
                    {previewingScript.title}
                  </h3>
                  <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-semibold border border-orange-200">
                    当前步骤：第 {currentStepIndex + 1} 步 / 共 {previewingScript.steps.length || 1} 步
                  </span>
                </div>
                <div className="text-[11px] text-[#6B7280] flex items-center gap-2 mt-0.5">
                  <span>语种：{previewingScript.language}</span>
                  <span>·</span>
                  <span>
                    核心产品：
                    {products.find((p) => p.id === previewingScript.linkedCombination?.mainProductId)?.name || '未关联核心产品'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenPreview(previewingScript)}
                  className="px-2.5 py-1 text-xs border border-[#D6D0C4] bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  重新开始
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Left Steps Guidance (提示要做什么，引导完成步骤) + Right Live AI Dialogue */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#FAF9F7]">
              {/* Left Column: 考核指导步骤与指引 (引导面板) */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#EAE6DD] bg-white p-4 flex flex-col overflow-y-auto shrink-0 scrollbar-thin">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3] mb-3">
                  <span className="font-bold text-xs text-[#1F2937] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#9E4A2B]" />
                    <span>考核步骤指引</span>
                  </span>
                  <span className="text-[10px] text-gray-400">
                    共 {previewingScript.steps.length} 个考核点
                  </span>
                </div>

                {/* Steps List */}
                <div className="space-y-3 flex-1">
                  {previewingScript.steps.map((st, i) => {
                    const isCurrent = i === currentStepIndex;
                    const isPassed = i < currentStepIndex;

                    return (
                      <div
                        key={st.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-[#FFF9F5] border-[#FDBA74] shadow-xs'
                            : isPassed
                            ? 'bg-emerald-50/50 border-emerald-200 opacity-90'
                            : 'bg-[#FAF8F5] border-[#EAE6DD]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                isPassed
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-[#9E4A2B] text-white ring-2 ring-orange-200'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {isPassed ? <Check className="w-3 h-3" /> : i + 1}
                            </span>
                            <span
                              className={`font-bold text-xs truncate max-w-[170px] ${
                                isCurrent ? 'text-[#9A3412]' : isPassed ? 'text-emerald-900' : 'text-[#374151]'
                              }`}
                            >
                              {st.title}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                              isPassed
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCurrent
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {isPassed ? '已达成' : isCurrent ? '进行中' : '待考核'}
                          </span>
                        </div>

                        {/* 考核目标 */}
                        <div className="text-[11px] text-[#4B5563] pl-7 space-y-1">
                          <div className="leading-snug">
                            <span className="text-[#6B7280] font-medium">目标：</span>
                            {st.goal}
                          </div>

                          {/* 提示要做什么 (Hint) */}
                          {st.hint && (
                            <div className="mt-1.5 p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-[10px] text-amber-900 leading-relaxed">
                              <div className="font-semibold text-amber-800 mb-0.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                <span>💡 提示要做什么：</span>
                              </div>
                              <p>{st.hint}</p>
                              {isCurrent && (
                                <button
                                  type="button"
                                  onClick={() => setUserChatInput(st.hint || '')}
                                  className="mt-1.5 text-[10px] text-[#9E4A2B] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span>一键填入参考话术 ↵</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: AI 对练交互聊天区 */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Active Step Guidance Banner */}
                {previewingScript.steps[currentStepIndex] && (
                  <div className="px-4 py-2 bg-amber-50/90 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 shrink-0">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="font-bold text-[#9E4A2B] shrink-0">
                        【当前第 {currentStepIndex + 1} 步指引】
                      </span>
                      <span className="truncate">
                        {previewingScript.steps[currentStepIndex].hint || previewingScript.steps[currentStepIndex].goal}
                      </span>
                    </div>
                    <span className="text-[10px] bg-white text-amber-800 px-2 py-0.5 rounded border border-amber-300 font-medium shrink-0">
                      请模拟专柜BA回复
                    </span>
                  </div>
                )}

                {/* Conversation Turns Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin bg-[#FAF8F5]">
                  {/* Scenario Setup Card */}
                  <div className="p-3 bg-white rounded-xl border border-[#EAE6DD] text-xs text-[#6B7280] space-y-1 shadow-2xs">
                    <div className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#9E4A2B]" />
                      <span>模拟场景背景</span>
                    </div>
                    <p className="leading-relaxed">
                      {previewingScript.scenePrompt || previewingScript.sceneDescription}
                    </p>
                  </div>

                  {previewChatTurns.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2.5 items-start ${
                        msg.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                          msg.sender === 'user' ? 'bg-[#9E4A2B]' : 'bg-amber-600'
                        }`}
                      >
                        {msg.sender === 'user' ? 'BA' : '客'}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          msg.sender === 'user'
                            ? 'bg-[#9E4A2B] text-white rounded-tr-xs'
                            : 'bg-white border border-[#EAE6DD] text-[#1F2937] rounded-tl-xs'
                        }`}
                      >
                        <div className="font-semibold text-[10px] mb-0.5 opacity-75">
                          {msg.sender === 'user' ? '我 (专柜BA)' : 'AI 模拟顾客'}
                        </div>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Completion Banner */}
                  {currentStepIndex >= (previewingScript.steps.length || 1) - 1 &&
                    previewChatTurns.filter((m) => m.sender === 'user').length >=
                      (previewingScript.steps.length || 1) && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-1 animate-in fade-in">
                        <div className="font-bold text-xs text-emerald-800 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>🎉 恭喜！您已成功完成剧本全部 {previewingScript.steps.length} 个考核步骤</span>
                        </div>
                        <p className="text-[11px] text-emerald-700">
                          连带推荐顺畅，话术要点达成度 100%！可点击上方“重新开始”再次演练。
                        </p>
                      </div>
                    )}
                </div>

                {/* Bottom Input Box */}
                <div className="p-3 bg-white border-t border-[#EAE6DD] space-y-2 shrink-0">
                  {/* Step Hint Chip for quick insertion */}
                  {previewingScript.steps[currentStepIndex]?.hint && (
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <button
                        type="button"
                        onClick={() => setUserChatInput(previewingScript.steps[currentStepIndex].hint || '')}
                        className="text-[#9E4A2B] hover:underline flex items-center gap-1 text-[11px] font-medium truncate max-w-[85%] cursor-pointer"
                        title="点击一键将此提示填入输入框"
                      >
                        <span>💡 推荐话术：{previewingScript.steps[currentStepIndex].hint}</span>
                      </button>
                      <span className="text-[10px] text-gray-400">回车发送</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`请根据第 ${currentStepIndex + 1} 步提示，输入您的专柜沟通话术...`}
                      value={userChatInput}
                      onChange={(e) => setUserChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendScriptPreviewChat();
                        }
                      }}
                      className="flex-1 px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-[#FAF8F5]"
                    />
                    <button
                      type="button"
                      onClick={handleSendScriptPreviewChat}
                      disabled={!userChatInput.trim()}
                      className="px-4 py-2 bg-[#9E4A2B] hover:bg-[#853C21] disabled:bg-gray-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>发送</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
