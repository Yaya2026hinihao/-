import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowDown,
  BookOpen,
  Bot,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  GraduationCap,
  Headphones,
  Layers,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  SendHorizontal,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Edit3,
  X,
  Check,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  Settings2,
  Tag,
  Target,
  Sparkles as SparklesIcon
} from 'lucide-react';
import {
  Product,
  RoleConfig,
  TrainingAssetStudy,
  TrainingAssetPractice,
  TrainingAssetExam,
  CrossSellingItem,
  UserPersona,
  PracticeConditionSetting
} from '../../types/product';
import { AssetTabType } from './AssetDetailModal';
import { SpecificAssetTarget } from '../task/TaskPublishModal';
import {
  DigitalHumanCustomer,
  ScenarioScriptItem,
  ProductCombination,
  TagDimensionConfig,
} from '../../types/sparring';
import {
  getProductCategoryDimensions,
  evaluatePracticeMatch,
  formatConditionList,
  UNIVERSAL_TARGET_GROUPS,
  UNIVERSAL_SCENARIOS,
  UNIVERSAL_DEMANDS,
  UNIVERSAL_CUSTOMER_CONCERNS,
  ScenarioFilterCriteria,
} from '../../utils/scenarioTraining';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  roleConfigs: RoleConfig[];
  onBack: () => void;
  onOpenAssetModal: (tab: AssetTabType) => void;
  onOpenTaskPublish: (product: Product, specificAsset?: SpecificAssetTarget) => void;
  onEditProduct: (product: Product) => void;
  onSaveProduct?: (product: Product) => void;
  onOpenRoleManage: () => void;
  onAddCrossSelling: (productId: string, item: CrossSellingItem) => void;
  digitalHumans?: DigitalHumanCustomer[];
  scenarioScripts?: ScenarioScriptItem[];
  combinations?: ProductCombination[];
  tagDimensions?: TagDimensionConfig[];
  onSaveDigitalHuman?: (dh: DigitalHumanCustomer) => void;
  onSaveScript?: (script: ScenarioScriptItem) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  allProducts,
  roleConfigs,
  onBack,
  onOpenAssetModal,
  onOpenTaskPublish,
  onEditProduct,
  onSaveProduct,
  onOpenRoleManage,
  onAddCrossSelling,
  digitalHumans,
  scenarioScripts,
  combinations,
  tagDimensions,
  onSaveDigitalHuman,
  onSaveScript,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'cross-selling' | 'assets' | 'analytics'>('info');
  const [practiceTypeFilter, setPracticeTypeFilter] = useState<'全部' | '数字人' | '场景对话' | '金句'>('全部');
  const [showAddCrossModal, setShowAddCrossModal] = useState(false);

  // Dynamic sums that strictly match asset table usage counts
  // 1. 关联该产品的数字人顾客 (按产品 ID 关联)
  const linkedDigitalHumans = useMemo(() => {
    if (!digitalHumans) return [];
    return digitalHumans.filter(
      (dh) => dh.productId === product.id || dh.productIds?.includes(product.id)
    );
  }, [digitalHumans, product.id]);

  // 2. 关联该产品的场景剧本 (按组合读取主推品与连带品，区分优先级 1 与 2)
  const linkedScenarioScripts = useMemo(() => {
    if (!scenarioScripts) return [];
    const results: Array<{
      script: ScenarioScriptItem;
      priority: 1 | 2;
      badgeText: string;
      comboName: string;
    }> = [];

    scenarioScripts.forEach((sc) => {
      const combo = sc.linkedCombination;
      if (!combo) return;
      if (combo.mainProductId === product.id) {
        results.push({
          script: sc,
          priority: 1,
          badgeText: '⭐ 组合主推',
          comboName: combo.combinationName,
        });
      } else if (combo.crossSellingProductIds?.includes(product.id)) {
        results.push({
          script: sc,
          priority: 2,
          badgeText: '🔗 连带补充',
          comboName: combo.combinationName,
        });
      }
    });

    return results.sort((a, b) => a.priority - b.priority);
  }, [scenarioScripts, product.id]);

  // 3. 动态聚合全部练习资产 (产品关联数字人 + 组合关联剧本 + 基础金句/练习)
  const combinedPracticeAssets = useMemo(() => {
    const list: TrainingAssetPractice[] = [];
    const addedIds = new Set<string>();

    // A. 关联数字人顾客
    linkedDigitalHumans.forEach((dh) => {
      if (!addedIds.has(dh.id)) {
        addedIds.add(dh.id);
        list.push({
          id: dh.id,
          title: dh.name,
          type: '数字人',
          author: 'AI数字人顾客模拟',
          authorRole: '总部培训师',
          targetAudience: '全国专柜BA',
          usageCount: dh.usageCount || 36,
          dialogueTurns: dh.scriptOutline?.turns || 5,
          avgPassRate: dh.avgScore || 90,
          lastUsedDate: dh.updatedAt || '2026-10-18',
          conditions: {
            targetGroups: dh.personaTags?.targetGroups || [],
            scenarios: dh.personaTags?.scenarios || [],
            demands: dh.personaTags?.demands || [],
            customerConcerns: dh.personaTags?.customerConcerns || [],
            categoryDimensions: dh.personaTags?.categoryDimensions || {},
          },
          priorityLevel: 1,
          sourceNote: '产品专属数字人',
        });
      }
    });

    // B. 关联场景剧本（优先级 1: 组合主推，优先级 2: 连带补充）
    linkedScenarioScripts.forEach(({ script: sc, priority, badgeText, comboName }) => {
      if (!addedIds.has(sc.id)) {
        addedIds.add(sc.id);
        list.push({
          id: sc.id,
          title: sc.title,
          type: '场景对话',
          author: `${badgeText} · ${comboName}`,
          authorRole: '总部培训师',
          targetAudience: '全国专柜BA',
          usageCount: sc.usageCount || 28,
          dialogueTurns: sc.steps?.length || 3,
          avgPassRate: 94,
          lastUsedDate: sc.updatedAt || '2026-10-16',
          conditions: {
            targetGroups: sc.scenarioTags?.targetGroups || [],
            scenarios: sc.scenarioTags?.scenarios || [],
            demands: sc.scenarioTags?.demands || [],
            categoryDimensions: sc.scenarioTags?.categoryDimensions || {},
          },
          priorityLevel: priority,
          sourceNote: badgeText,
        });
      }
    });

    // C. 原有基础练习资产（如金句朗读等）
    (product.practiceAssets || []).forEach((p) => {
      if (!addedIds.has(p.id)) {
        addedIds.add(p.id);
        list.push(p);
      }
    });

    return list;
  }, [product.practiceAssets, linkedDigitalHumans, linkedScenarioScripts]);

  // Dynamic sums that strictly match asset table usage counts
  const totalStudyUsage = product.studyAssets.reduce((sum, a) => sum + (a.usageCount || 0), 0);
  const totalPracticeUsage = combinedPracticeAssets.reduce((sum, a) => sum + (a.usageCount || 0), 0);
  const totalExamUsage = product.examAssets.reduce((sum, a) => sum + (a.usageCount || 0), 0);
  const calculatedAvgExamScore = product.examAssets.length > 0
    ? Math.round(product.examAssets.reduce((sum, e) => sum + (e.averageScore || 0), 0) / product.examAssets.length)
    : product.examAvgScore;

  const handleJumpToAssets = (subType?: 'study' | 'practice' | 'exam') => {
    setActiveTab('assets');
    setTimeout(() => {
      if (subType) {
        const el = document.getElementById(`asset-section-${subType}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      const container = document.getElementById('assets-tab-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // New Cross-sell state
  const [selectedCrossProdId, setSelectedCrossProdId] = useState(
    allProducts.find((p) => p.id !== product.id)?.id || ''
  );
  const [newReason, setNewReason] = useState('');
  const [newPitch, setNewPitch] = useState('');

  // 场景化训练条件筛选器状态 (多维度、可选、自由组合)
  const [scenarioFilters, setScenarioFilters] = useState<ScenarioFilterCriteria>({
    targetGroups: [],
    scenarios: [],
    demands: [],
    customerConcerns: [],
    categoryDimensions: {},
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // 品类专属维度配置列表 (随产品品类动态自适应)
  const categoryDimensions = useMemo(() => getProductCategoryDimensions(product), [product]);

  // 练习适用条件编辑与详情弹窗状态
  const [editingPractice, setEditingPractice] = useState<TrainingAssetPractice | null>(null);
  const [viewingPractice, setViewingPractice] = useState<TrainingAssetPractice | null>(null);

  const matchedDh = useMemo(() => {
    if (!viewingPractice || viewingPractice.type !== '数字人') return null;
    return digitalHumans?.find((dh) => dh.id === viewingPractice.id) || null;
  }, [viewingPractice, digitalHumans]);

  const matchedScript = useMemo(() => {
    if (!viewingPractice || viewingPractice.type !== '场景对话') return null;
    return scenarioScripts?.find((sc) => sc.id === viewingPractice.id) || null;
  }, [viewingPractice, scenarioScripts]);

  // 计算练习匹配结果与排序 (高匹配优先，部分匹配其次；同级按组合主推优先)
  const matchedPractices = useMemo(() => {
    return combinedPracticeAssets
      .filter((p) => practiceTypeFilter === '全部' || p.type === practiceTypeFilter)
      .map((p) => {
        const evalRes = evaluatePracticeMatch(p, scenarioFilters, product);
        if (evalRes.totalFilterCount === 0 && p.sourceNote) {
          return {
            ...evalRes,
            label: (p.priorityLevel === 1 ? '组合主推' : p.priorityLevel === 2 ? '连带补充' : evalRes.label) as any,
            colorClass:
              p.priorityLevel === 1
                ? 'bg-orange-50 text-orange-700 border-orange-200 font-semibold'
                : p.priorityLevel === 2
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium'
                : evalRes.colorClass,
          };
        }
        return evalRes;
      })
      .sort((a, b) => {
        if (a.matchLevel === 'exact' && b.matchLevel !== 'exact') return -1;
        if (b.matchLevel === 'exact' && a.matchLevel !== 'exact') return 1;
        if (a.matchLevel === 'partial' && b.matchLevel === 'none') return -1;
        if (b.matchLevel === 'partial' && a.matchLevel === 'none') return 1;
        const pA = a.practice.priorityLevel || 2;
        const pB = b.practice.priorityLevel || 2;
        if (pA !== pB) return pA - pB;
        return b.matchScore - a.matchScore;
      });
  }, [combinedPracticeAssets, practiceTypeFilter, scenarioFilters, product]);

  // 统计已激活的筛选条件总数
  const totalActiveFilterCount =
    scenarioFilters.targetGroups.length +
    scenarioFilters.scenarios.length +
    scenarioFilters.demands.length +
    (scenarioFilters.customerConcerns || []).length +
    Object.values(scenarioFilters.categoryDimensions || {}).reduce((sum, arr) => sum + arr.length, 0);

  const toggleFilterChip = (dim: 'targetGroups' | 'scenarios' | 'demands' | 'customerConcerns', val: string) => {
    setScenarioFilters((prev) => ({
      ...prev,
      [dim]: prev[dim].includes(val) ? prev[dim].filter((x) => x !== val) : [...prev[dim], val],
    }));
  };

  const toggleCatDimChip = (dimKey: string, val: string) => {
    setScenarioFilters((prev) => {
      const current = prev.categoryDimensions[dimKey] || [];
      const updated = current.includes(val) ? current.filter((x) => x !== val) : [...current, val];
      return {
        ...prev,
        categoryDimensions: {
          ...prev.categoryDimensions,
          [dimKey]: updated,
        },
      };
    });
  };

  const clearAllScenarioFilters = () => {
    setScenarioFilters({
      targetGroups: [],
      scenarios: [],
      demands: [],
      customerConcerns: [],
      categoryDimensions: {},
    });
  };

  // 一键按当前产品的训练条件筛选练习
  const handleApplyProductConditionsToFilter = () => {
    const pCond = product.persona;
    setScenarioFilters({
      targetGroups: [...(pCond.targetGroups || []).slice(0, 2)],
      scenarios: [...(pCond.scenarios || []).slice(0, 2)],
      demands: [...(pCond.demands || []).slice(0, 2)],
      customerConcerns: [...(pCond.customerConcerns || []).slice(0, 1)],
      categoryDimensions: { ...(pCond.categoryDimensions || {}) },
    });
    handleJumpToAssets('practice');
  };

  const handleSaveCrossSell = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProd = allProducts.find((p) => p.id === selectedCrossProdId);
    if (!targetProd) return;

    const newItem: CrossSellingItem = {
      productId: targetProd.id,
      productName: targetProd.name,
      brand: targetProd.brand,
      sku: targetProd.sku,
      image: targetProd.image,
      role: '连带品',
      recommendReason: newReason.trim() || '配套使用，提升妆容质感与持妆表现。',
      recommendedPitch: newPitch.trim() || '“美女，搭配这款连带产品一起使用，效果更出圈！”',
      associatedPracticeScene: `${product.name} + ${targetProd.name} 连带销售场景演练`,
    };

    onAddCrossSelling(product.id, newItem);
    setShowAddCrossModal(false);
    setNewReason('');
    setNewPitch('');
  };

  // User Persona / Training Conditions Editing state
  const [isEditingPersona, setIsEditingPersona] = useState(false);
  const [personaForm, setPersonaForm] = useState<UserPersona>(() => ({
    targetGroups: [...(product.persona.targetGroups || [])],
    scenarios: [...(product.persona.scenarios || [])],
    demands: [...(product.persona.demands || [])],
    customerConcerns: [...(product.persona.customerConcerns || [])],
    categoryDimensions: { ...(product.persona.categoryDimensions || {}) },
    skinTypes: [...(product.persona.skinTypes || [])],
  }));

  const [tagInputs, setTagInputs] = useState<{ [key: string]: string }>({
    targetGroups: '',
    scenarios: '',
    demands: '',
    customerConcerns: '',
  });

  const [catDimInputs, setCatDimInputs] = useState<{ [dimKey: string]: string }>({});

  const handleAddTag = (field: 'targetGroups' | 'scenarios' | 'demands' | 'customerConcerns') => {
    const val = (tagInputs[field] || '').trim();
    if (!val) return;
    setPersonaForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), val],
    }));
    setTagInputs((prev) => ({ ...prev, [field]: '' }));
  };

  const handleRemoveTag = (field: 'targetGroups' | 'scenarios' | 'demands' | 'customerConcerns', index: number) => {
    setPersonaForm((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddCatDimTag = (dimKey: string) => {
    const val = (catDimInputs[dimKey] || '').trim();
    if (!val) return;
    setPersonaForm((prev) => {
      const current = prev.categoryDimensions?.[dimKey] || [];
      return {
        ...prev,
        categoryDimensions: {
          ...(prev.categoryDimensions || {}),
          [dimKey]: [...current, val],
        },
      };
    });
    setCatDimInputs((prev) => ({ ...prev, [dimKey]: '' }));
  };

  const handleRemoveCatDimTag = (dimKey: string, index: number) => {
    setPersonaForm((prev) => {
      const current = prev.categoryDimensions?.[dimKey] || [];
      return {
        ...prev,
        categoryDimensions: {
          ...(prev.categoryDimensions || {}),
          [dimKey]: current.filter((_, idx) => idx !== index),
        },
      };
    });
  };

  const handleSavePersona = () => {
    const updated = {
      ...product,
      persona: {
        ...personaForm,
        skinTypes: personaForm.categoryDimensions?.['肤质'] || personaForm.skinTypes || [],
      },
    };
    if (onSaveProduct) {
      onSaveProduct(updated);
    } else {
      onEditProduct(updated);
    }
    setIsEditingPersona(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#111827] bg-white px-3 py-1.5 rounded-lg border border-[#E5E1D8] shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#9E4A2B]" />
          <span>返回产品列表</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditProduct(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#374151] hover:text-[#111827] bg-white hover:bg-[#F9F8F6] border border-[#D6D0C4] rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>编辑产品档案</span>
          </button>

          <button
            onClick={() => onOpenTaskPublish(product)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-white bg-[#9E4A2B] hover:bg-[#8C3E20] font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>按此产品发布配套任务</span>
          </button>
        </div>
      </div>

      {/* Product Main Hero Header Card */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-44 h-44 rounded-xl overflow-hidden border border-[#EAE6DD] shrink-0 bg-[#F8F7F3] shadow-xs">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          {/* Roles */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.roles.map((r, idx) => {
              const cfg = roleConfigs.find((c) => c.name === r);
              return (
                <span
                  key={idx}
                  style={{
                    backgroundColor: cfg?.bgColor || '#FEF3C7',
                    color: cfg?.color || '#B45309',
                    borderColor: cfg?.borderColor || '#FDE68A',
                  }}
                  className="px-2.5 py-0.5 rounded-lg text-xs font-semibold border shadow-2xs flex items-center gap-1"
                >
                  <span>⭐ {r}</span>
                </span>
              );
            })}

            <button
              onClick={onOpenRoleManage}
              className="text-xs text-[#9E4A2B] hover:underline px-1.5 py-0.5 rounded hover:bg-[#FAF3F0] transition-colors flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              <span>调整角色</span>
            </button>
          </div>

          {/* Title & Key Attributes */}
          <div className="space-y-2.5">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              {product.name}
            </h1>

            {/* Structured Brand, Series, Category & SKU Grid (Brand is compact, Series shows fully, SKU has its own line) */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                {/* 品牌 (紧凑宽度) */}
                <div className="bg-[#FAF8F5] px-3 py-2 rounded-lg border border-[#EAE6DD] sm:w-32 shrink-0">
                  <div className="text-[10px] text-[#78716C] font-medium">品牌</div>
                  <div className="text-xs font-bold text-[#1F2937] mt-0.5">{product.brand}</div>
                </div>

                {/* 所属系列 (占据充分宽度，完整展示系列名称) */}
                <div className="bg-[#FAF8F5] px-3.5 py-2 rounded-lg border border-[#EAE6DD] flex-1 min-w-[200px]">
                  <div className="text-[10px] text-[#78716C] font-medium">所属系列</div>
                  <div className="text-xs font-semibold text-[#1F2937] mt-0.5">{product.series}</div>
                </div>

                {/* 产品品类 */}
                <div className="bg-[#FAF8F5] px-3.5 py-2 rounded-lg border border-[#EAE6DD] sm:w-48 shrink-0">
                  <div className="text-[10px] text-[#78716C] font-medium">产品品类</div>
                  <div className="text-xs font-semibold text-[#1F2937] mt-0.5">
                    {product.category} · {product.subCategory}
                  </div>
                </div>
              </div>

              {/* 物料 SKU (独占一行，长编码完整展示，无截断) */}
              <div className="bg-[#FAF8F5] px-3.5 py-2 rounded-lg border border-[#EAE6DD] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] text-[#78716C] font-medium shrink-0">物料 SKU</span>
                  <span className="text-xs font-mono font-semibold text-[#1F2937] select-all break-all" title={product.sku}>
                    {product.sku}
                  </span>
                </div>
                <span className="text-[10px] text-[#A8A29E] font-mono shrink-0 hidden sm:inline">
                  SPU: {product.spu}
                </span>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="bg-[#FBFBFA] px-4 py-3 rounded-xl border border-[#EFECE6] text-xs text-[#4B5563] leading-relaxed shadow-2xs">
            <span className="font-semibold text-[#1F2937] mr-1.5 inline-flex items-center gap-1">
              <span>📋</span> 产品介绍:
            </span>
            {product.description}
          </div>
        </div>
      </div>

      {/* Section 18: Three Core Training Metric Cards (Balanced, elegant font size, with direct jump button) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: 学习任务 */}
        <div
          onClick={() => handleJumpToAssets('study')}
          className="bg-white rounded-xl p-4 border border-[#E8E6E1] hover:border-[#9E4A2B] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#9E4A2B]" />
              <span>学习任务</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleJumpToAssets('study');
              }}
              className="flex items-center gap-1 text-[11px] font-medium text-[#9E4A2B] hover:text-[#8C3E20] bg-[#FAF3F0] hover:bg-[#F5E6E0] px-2 py-0.5 rounded-md border border-[#FDBA74]/50 transition-colors cursor-pointer"
            >
              <span>查看清单</span>
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-bold font-mono text-[#111827] tabular-nums">
              {product.studyAssets.length}
            </span>
            <span className="text-xs text-[#6B7280]">门课件</span>
            <span className="text-xs text-[#D1D5DB]">·</span>
            <span className="text-xs text-[#6B7280]">
              已发布 <strong className="font-mono text-[#9E4A2B] font-semibold">{totalStudyUsage}</strong> 次
            </span>
          </div>
        </div>

        {/* Metric 2: 练习任务 */}
        <div
          onClick={() => handleJumpToAssets('practice')}
          className="bg-white rounded-xl p-4 border border-[#E8E6E1] hover:border-[#4F46E5] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-[#4F46E5]" />
              <span>练习任务</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleJumpToAssets('practice');
              }}
              className="flex items-center gap-1 text-[11px] font-medium text-[#4F46E5] hover:text-[#3730A3] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-2 py-0.5 rounded-md border border-[#C7D2FE] transition-colors cursor-pointer"
            >
              <span>查看清单</span>
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-bold font-mono text-[#111827] tabular-nums">
              {combinedPracticeAssets.length}
            </span>
            <span className="text-xs text-[#6B7280]">个任务</span>
            <span className="text-xs text-[#D1D5DB]">·</span>
            <span className="text-xs text-[#6B7280]">
              已发布 <strong className="font-mono text-[#4F46E5] font-semibold">{totalPracticeUsage}</strong> 次
            </span>
          </div>
        </div>

        {/* Metric 3: 考试任务 */}
        <div
          onClick={() => handleJumpToAssets('exam')}
          className="bg-white rounded-xl p-4 border border-[#E8E6E1] hover:border-[#059669] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#059669]" />
              <span>考试任务</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleJumpToAssets('exam');
              }}
              className="flex items-center gap-1 text-[11px] font-medium text-[#059669] hover:text-[#047857] bg-[#ECFDF5] hover:bg-[#D1FAE5] px-2 py-0.5 rounded-md border border-[#A7F3D0] transition-colors cursor-pointer"
            >
              <span>查看清单</span>
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-bold font-mono text-[#059669] tabular-nums">
              {calculatedAvgExamScore !== null ? calculatedAvgExamScore : '—'}
            </span>
            {calculatedAvgExamScore !== null && <span className="text-xs font-semibold text-[#059669]">分</span>}
            <span className="text-xs text-[#6B7280] ml-1">
              关联 {product.examAssets.length} 份试卷
            </span>
            <span className="text-xs text-[#D1D5DB]">·</span>
            <span className="text-xs text-[#6B7280]">
              已发布 <strong className="font-mono text-[#059669] font-semibold">{totalExamUsage}</strong> 次
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Reordered: 资产移到搭配销售前面) */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-2xs overflow-hidden">
        <div className="flex items-center border-b border-[#EAE7E0] px-6 bg-[#FAF9F6]">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'border-[#9E4A2B] text-[#9E4A2B]'
                : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            产品定位与画像 (画像/卖点/金句)
          </button>

          {/* 关联培训资产: Moved before 搭配销售 as requested */}
          <button
            onClick={() => setActiveTab('assets')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'assets'
                ? 'border-[#9E4A2B] text-[#9E4A2B]'
                : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            关联培训资产 ({product.studyAssets.length + combinedPracticeAssets.length + product.examAssets.length})
          </button>

          <button
            onClick={() => setActiveTab('cross-selling')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'cross-selling'
                ? 'border-[#9E4A2B] text-[#9E4A2B]'
                : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            搭配销售 / 连带关系 ({product.crossSelling.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-[#9E4A2B] text-[#9E4A2B]'
                : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            区域表现与 AI 诊断
          </button>
        </div>

        {/* Tab 1: Info & Persona */}
        {activeTab === 'info' && (
          <div className="p-6 space-y-6 text-xs">
            {/* 适用人群与场景 / 场景化训练条件 (Section 3-7) */}
            <div className="bg-white rounded-xl border border-[#EAE6DD] p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#F0ECE3] pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#9E4A2B]" />
                    <h3 className="text-sm font-bold text-[#1F2937]">适用人群与场景 / 场景化训练条件</h3>
                    <span className="text-[10px] bg-[#FEF5F0] text-[#9E4A2B] px-2 py-0.5 rounded-full font-medium border border-[#FDBA74]/50">
                      动态场景训练匹配
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    基础通用维度与品类专属维度自由组合，为数字人、场景对话与金句提供精准训练条件支撑
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyProductConditionsToFilter}
                    className="flex items-center gap-1.5 text-xs text-[#9E4A2B] hover:text-[#7C2D12] font-semibold bg-[#FEF5F0] hover:bg-[#FDECE2] px-3 py-1.5 rounded-lg border border-[#FDBA74]/70 transition-all cursor-pointer shadow-2xs"
                    title="将本产品已配置的条件带入练习筛选"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>按此条件筛选匹配练习 →</span>
                  </button>

                  {!isEditingPersona ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPersona(true);
                        setPersonaForm({
                          targetGroups: [...(product.persona.targetGroups || [])],
                          scenarios: [...(product.persona.scenarios || [])],
                          demands: [...(product.persona.demands || [])],
                          customerConcerns: [...(product.persona.customerConcerns || [])],
                          categoryDimensions: { ...(product.persona.categoryDimensions || {}) },
                          skinTypes: [...(product.persona.skinTypes || [])],
                        });
                      }}
                      className="flex items-center gap-1.5 text-xs text-[#374151] hover:text-[#111827] font-semibold bg-white hover:bg-[#FAF9F7] px-3 py-1.5 rounded-lg border border-[#D6D0C4] transition-colors cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#9E4A2B]" />
                      <span>配置训练条件</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingPersona(false)}
                        className="px-2.5 py-1 text-xs text-[#6B7280] hover:text-[#111827] bg-[#F4F1EA] hover:bg-[#EAE5D9] rounded-md transition-colors cursor-pointer"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePersona}
                        className="px-3.5 py-1 text-xs text-white bg-[#9E4A2B] hover:bg-[#8C3E20] rounded-md font-medium transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>保存条件</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 训练条件维度网格（基础通用维度 + 品类专属维度） */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 维度 1: 适用人群 */}
                <div className="bg-[#FAF9F7] p-3.5 rounded-xl border border-[#EAE6DD] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                      <span>🎯 适用人群</span>
                      <span className="text-[10px] text-[#6B7280]">
                        ({(isEditingPersona ? personaForm.targetGroups : product.persona.targetGroups)?.length || 0})
                      </span>
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">通用维度</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                    {(isEditingPersona ? personaForm.targetGroups : product.persona.targetGroups)?.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white text-[#374151] rounded-md text-[11px] font-medium border border-[#E0DBD0] flex items-center gap-1 shadow-2xs"
                      >
                        <span>{t}</span>
                        {isEditingPersona && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTag('targetGroups', idx)}
                            className="text-gray-400 hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {(!isEditingPersona && (!product.persona.targetGroups || product.persona.targetGroups.length === 0)) && (
                      <span className="text-[11px] text-gray-400 italic">未指定</span>
                    )}
                  </div>

                  {isEditingPersona && (
                    <div className="space-y-1.5 pt-1.5 border-t border-[#EAE6DD]">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={tagInputs.targetGroups || ''}
                          onChange={(e) => setTagInputs({ ...tagInputs, targetGroups: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag('targetGroups');
                            }
                          }}
                          placeholder="+ 添加人群"
                          className="flex-1 px-2 py-1 text-xs border border-[#D6D0C4] rounded bg-white focus:outline-none focus:border-[#9E4A2B]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag('targetGroups')}
                          className="px-2.5 py-1 bg-[#9E4A2B] text-white rounded text-xs hover:bg-[#8C3E20] cursor-pointer"
                        >
                          添加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {UNIVERSAL_TARGET_GROUPS.filter((g) => !(personaForm.targetGroups || []).includes(g))
                          .slice(0, 3)
                          .map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                setPersonaForm((prev) => ({
                                  ...prev,
                                  targetGroups: [...(prev.targetGroups || []), g],
                                }));
                              }}
                              className="text-[10px] px-1.5 py-0.5 bg-white border border-[#E0DBD0] text-[#6B7280] rounded hover:border-[#9E4A2B] hover:text-[#9E4A2B]"
                            >
                              + {g}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 维度 2: 使用与销售场景 */}
                <div className="bg-[#FAF9F7] p-3.5 rounded-xl border border-[#EAE6DD] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                      <span>🏙️ 使用/销售场景</span>
                      <span className="text-[10px] text-[#6B7280]">
                        ({(isEditingPersona ? personaForm.scenarios : product.persona.scenarios)?.length || 0})
                      </span>
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">通用维度</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                    {(isEditingPersona ? personaForm.scenarios : product.persona.scenarios)?.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white text-[#374151] rounded-md text-[11px] font-medium border border-[#E0DBD0] flex items-center gap-1 shadow-2xs"
                      >
                        <span>{t}</span>
                        {isEditingPersona && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTag('scenarios', idx)}
                            className="text-gray-400 hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {(!isEditingPersona && (!product.persona.scenarios || product.persona.scenarios.length === 0)) && (
                      <span className="text-[11px] text-gray-400 italic">未指定</span>
                    )}
                  </div>

                  {isEditingPersona && (
                    <div className="space-y-1.5 pt-1.5 border-t border-[#EAE6DD]">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={tagInputs.scenarios || ''}
                          onChange={(e) => setTagInputs({ ...tagInputs, scenarios: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag('scenarios');
                            }
                          }}
                          placeholder="+ 添加场景"
                          className="flex-1 px-2 py-1 text-xs border border-[#D6D0C4] rounded bg-white focus:outline-none focus:border-[#9E4A2B]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag('scenarios')}
                          className="px-2.5 py-1 bg-[#9E4A2B] text-white rounded text-xs hover:bg-[#8C3E20] cursor-pointer"
                        >
                          添加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {UNIVERSAL_SCENARIOS.filter((s) => !(personaForm.scenarios || []).includes(s))
                          .slice(0, 3)
                          .map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setPersonaForm((prev) => ({
                                  ...prev,
                                  scenarios: [...(prev.scenarios || []), s],
                                }));
                              }}
                              className="text-[10px] px-1.5 py-0.5 bg-white border border-[#E0DBD0] text-[#6B7280] rounded hover:border-[#9E4A2B] hover:text-[#9E4A2B]"
                            >
                              + {s}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 维度 3: 顾客需求 */}
                <div className="bg-[#FAF9F7] p-3.5 rounded-xl border border-[#EAE6DD] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                      <span>💡 顾客核心需求</span>
                      <span className="text-[10px] text-[#6B7280]">
                        ({(isEditingPersona ? personaForm.demands : product.persona.demands)?.length || 0})
                      </span>
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">通用维度</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                    {(isEditingPersona ? personaForm.demands : product.persona.demands)?.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white text-[#374151] rounded-md text-[11px] font-medium border border-[#E0DBD0] flex items-center gap-1 shadow-2xs"
                      >
                        <span>{t}</span>
                        {isEditingPersona && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTag('demands', idx)}
                            className="text-gray-400 hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {(!isEditingPersona && (!product.persona.demands || product.persona.demands.length === 0)) && (
                      <span className="text-[11px] text-gray-400 italic">未指定</span>
                    )}
                  </div>

                  {isEditingPersona && (
                    <div className="space-y-1.5 pt-1.5 border-t border-[#EAE6DD]">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={tagInputs.demands || ''}
                          onChange={(e) => setTagInputs({ ...tagInputs, demands: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag('demands');
                            }
                          }}
                          placeholder="+ 添加需求"
                          className="flex-1 px-2 py-1 text-xs border border-[#D6D0C4] rounded bg-white focus:outline-none focus:border-[#9E4A2B]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag('demands')}
                          className="px-2.5 py-1 bg-[#9E4A2B] text-white rounded text-xs hover:bg-[#8C3E20] cursor-pointer"
                        >
                          添加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {UNIVERSAL_DEMANDS.filter((d) => !(personaForm.demands || []).includes(d))
                          .slice(0, 3)
                          .map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setPersonaForm((prev) => ({
                                  ...prev,
                                  demands: [...(prev.demands || []), d],
                                }));
                              }}
                              className="text-[10px] px-1.5 py-0.5 bg-white border border-[#E0DBD0] text-[#6B7280] rounded hover:border-[#9E4A2B] hover:text-[#9E4A2B]"
                            >
                              + {d}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 维度 4: 顾客问题 / 顾虑 */}
                <div className="bg-[#FAF9F7] p-3.5 rounded-xl border border-[#EAE6DD] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                      <span>❓ 顾客痛点/问题</span>
                      <span className="text-[10px] text-[#6B7280]">
                        ({(isEditingPersona ? personaForm.customerConcerns : product.persona.customerConcerns)?.length || 0})
                      </span>
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">通用维度</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                    {(isEditingPersona ? personaForm.customerConcerns : product.persona.customerConcerns)?.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white text-[#374151] rounded-md text-[11px] font-medium border border-[#E0DBD0] flex items-center gap-1 shadow-2xs"
                      >
                        <span>{t}</span>
                        {isEditingPersona && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTag('customerConcerns', idx)}
                            className="text-gray-400 hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {(!isEditingPersona && (!product.persona.customerConcerns || product.persona.customerConcerns.length === 0)) && (
                      <span className="text-[11px] text-gray-400 italic">未指定</span>
                    )}
                  </div>

                  {isEditingPersona && (
                    <div className="space-y-1.5 pt-1.5 border-t border-[#EAE6DD]">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={tagInputs.customerConcerns || ''}
                          onChange={(e) => setTagInputs({ ...tagInputs, customerConcerns: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag('customerConcerns');
                            }
                          }}
                          placeholder="+ 添加顾虑"
                          className="flex-1 px-2 py-1 text-xs border border-[#D6D0C4] rounded bg-white focus:outline-none focus:border-[#9E4A2B]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag('customerConcerns')}
                          className="px-2.5 py-1 bg-[#9E4A2B] text-white rounded text-xs hover:bg-[#8C3E20] cursor-pointer"
                        >
                          添加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {UNIVERSAL_CUSTOMER_CONCERNS.filter((c) => !(personaForm.customerConcerns || []).includes(c))
                          .slice(0, 3)
                          .map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setPersonaForm((prev) => ({
                                  ...prev,
                                  customerConcerns: [...(prev.customerConcerns || []), c],
                                }));
                              }}
                              className="text-[10px] px-1.5 py-0.5 bg-white border border-[#E0DBD0] text-[#6B7280] rounded hover:border-[#9E4A2B] hover:text-[#9E4A2B]"
                            >
                              + {c}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 维度 5: 品类专属维度 (随当前品类动态渲染，不显示无关维度) */}
              <div className="pt-2 border-t border-[#F0ECE3]">
                <div className="text-xs font-semibold text-[#1F2937] mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#9E4A2B]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>品类专属维度（当前品类：{product.category || '通用'} / {product.subCategory || '综合'}，仅呈现专属维度）</span>
                  </span>
                  <span className="text-[10px] text-[#6B7280] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EAE6DD]">
                    自动适配品类 · 无关维度已过滤
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {categoryDimensions.map((catDim) => {
                    const currentVals = isEditingPersona
                      ? personaForm.categoryDimensions?.[catDim.key] || (catDim.key === '肤质' ? personaForm.skinTypes || [] : [])
                      : product.persona.categoryDimensions?.[catDim.key] || (catDim.key === '肤质' ? product.persona.skinTypes || [] : []);

                    return (
                      <div key={catDim.key} className="bg-[#FAF9F7] p-3.5 rounded-xl border border-[#EAE6DD] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#1F2937] flex items-center gap-1">
                            <span>✨ {catDim.label}</span>
                            <span className="text-[10px] text-[#6B7280]">({currentVals.length})</span>
                          </span>
                          <span className="text-[10px] text-[#9E4A2B] bg-[#FFF7ED] px-1.5 py-0.2 rounded border border-[#FFEDD5]">
                            品类专属
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                          {currentVals.map((val, vIdx) => (
                            <span
                              key={vIdx}
                              className="px-2 py-0.5 bg-white text-[#374151] rounded-md text-[11px] font-medium border border-[#E0DBD0] flex items-center gap-1 shadow-2xs"
                            >
                              <span>{val}</span>
                              {isEditingPersona && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCatDimTag(catDim.key, vIdx)}
                                  className="text-gray-400 hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))}
                          {(!isEditingPersona && currentVals.length === 0) && (
                            <span className="text-[11px] text-gray-400 italic">未指定</span>
                          )}
                        </div>

                        {isEditingPersona && (
                          <div className="space-y-1.5 pt-1.5 border-t border-[#EAE6DD]">
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={catDimInputs[catDim.key] || ''}
                                onChange={(e) => setCatDimInputs({ ...catDimInputs, [catDim.key]: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCatDimTag(catDim.key);
                                  }
                                }}
                                placeholder={`+ 添加${catDim.label}`}
                                className="flex-1 px-2 py-1 text-xs border border-[#D6D0C4] rounded bg-white focus:outline-none focus:border-[#9E4A2B]"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddCatDimTag(catDim.key)}
                                className="px-2.5 py-1 bg-[#9E4A2B] text-white rounded text-xs hover:bg-[#8C3E20] cursor-pointer"
                              >
                                添加
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {catDim.options
                                .filter((opt) => !currentVals.includes(opt))
                                .slice(0, 4)
                                .map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      setPersonaForm((prev) => {
                                        const oldArr = prev.categoryDimensions?.[catDim.key] || [];
                                        return {
                                          ...prev,
                                          categoryDimensions: {
                                            ...(prev.categoryDimensions || {}),
                                            [catDim.key]: [...oldArr, opt],
                                          },
                                        };
                                      });
                                    }}
                                    className="text-[10px] px-1.5 py-0.5 bg-white border border-[#E0DBD0] text-[#6B7280] rounded hover:border-[#9E4A2B] hover:text-[#9E4A2B]"
                                  >
                                    + {opt}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selling Points & Golden Sentences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Selling Points */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#1F2937] flex items-center gap-2 border-b border-[#F0ECE3] pb-1.5">
                  <Flame className="w-4 h-4 text-[#C2410C]" />
                  <span>核心卖点体系 (FABE)</span>
                </h4>
                <div className="space-y-2">
                  {product.sellingPoints.map((sp, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EAE5D9] flex items-start gap-2.5 text-[#374151]"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#9E4A2B] text-white text-[10px] flex items-center justify-center shrink-0 font-bold">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{sp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Golden Sentences */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#1F2937] flex items-center gap-2 border-b border-[#F0ECE3] pb-1.5">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <span>BA 专柜销售金句 (Golden Sentences)</span>
                </h4>
                <div className="space-y-2">
                  {product.goldenSentences.map((gs, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FFFBF7] rounded-lg border border-[#FDE3D3] text-[#9E4A2B] font-medium leading-relaxed italic"
                    >
                      {gs}
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-[#78716C] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE5D9]">
                  📌 说明：金句已同步至「练习任务 - 金句朗读」题库中，BA可在手机端进行智能发音与流利度对练。
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Linked Training Assets (Moved before Cross-selling) */}
        {activeTab === 'assets' && (
          <div id="assets-tab-container" className="p-6 space-y-6 text-xs">
            {/* Header with trigger button to publish */}
            <div className="flex items-center justify-between border-b border-[#F0ECE3] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1F2937]">该产品绑定的配套培训资产库</h3>
                <p className="text-[#6B7280] text-xs">
                  直接调用系统已有课件与任务，无需重复建设，方便培训师围绕产品一键发任务
                </p>
              </div>

              <button
                onClick={() => onOpenTaskPublish(product)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-medium rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                <SendHorizontal className="w-3.5 h-3.5" />
                <span>去新建发布任务</span>
              </button>
            </div>

            {/* 1. Study Assets - 学习任务 */}
            <div id="asset-section-study" className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-[#1F2937] flex items-center gap-2 whitespace-nowrap">
                  <BookOpen className="w-4 h-4 text-[#9E4A2B]" />
                  <span>学习任务 ({product.studyAssets.length} 门)</span>
                </h4>
                <span className="text-xs text-[#6B7280] whitespace-nowrap">已发布 {totalStudyUsage} 次</span>
              </div>

              <div className="bg-[#FAF9F7] rounded-xl border border-[#EAE6DD] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F1EA] text-[#6B7280]">
                    <tr className="whitespace-nowrap">
                      <th className="py-2.5 px-4 whitespace-nowrap">课件名称</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">发布人</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">发布对象</th>
                      <th className="py-2.5 px-4 text-center whitespace-nowrap">使用次数</th>
                      <th className="py-2.5 px-4 text-center whitespace-nowrap">完成率</th>
                      <th className="py-2.5 px-4 text-right whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6]">
                    {product.studyAssets.map((s) => (
                      <tr key={s.id} className="hover:bg-white">
                        <td className="py-2.5 px-4 font-medium text-[#111827]">{s.title}</td>
                        <td className="py-2.5 px-4 whitespace-nowrap">{s.author}</td>
                        <td className="py-2.5 px-4 text-[#6B7280] whitespace-nowrap">{s.targetAudience}</td>
                        <td className="py-2.5 px-4 text-center font-bold text-[#9E4A2B] whitespace-nowrap">
                          {s.usageCount} 次
                        </td>
                        <td className="py-2.5 px-4 text-center text-[#059669] font-mono whitespace-nowrap">
                          {s.passRate}%
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() =>
                              onOpenTaskPublish(product, {
                                id: s.id,
                                category: 'study',
                                title: s.title,
                              })
                            }
                            className="whitespace-nowrap inline-flex items-center px-3 py-1 text-xs text-[#9E4A2B] hover:text-white bg-white hover:bg-[#9E4A2B] border border-[#FDBA74] rounded-md transition-colors font-medium cursor-pointer shadow-2xs"
                          >
                            发任务
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Practice Assets - 练习任务与场景化训练匹配 (Section 7-12) */}
            <div id="asset-section-practice" className="space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-[#4F46E5]" />
                  <h4 className="font-bold text-xs text-[#1F2937] whitespace-nowrap">
                    练习任务与场景化匹配 ({combinedPracticeAssets.length} 门)
                  </h4>
                  <span className="text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded-full font-medium border border-[#C7D2FE]">
                    产品 → 训练条件 → 练习内容
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#6B7280] whitespace-nowrap">已发布 {totalPracticeUsage} 次</span>
                  
                  {/* 类型快速筛选 */}
                  <div className="flex items-center gap-1 bg-[#EAE6DD] p-0.5 rounded-lg">
                    {(['全部', '数字人', '场景对话', '金句'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setPracticeTypeFilter(t)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          practiceTypeFilter === t ? 'bg-white text-[#9E4A2B] font-semibold shadow-2xs' : 'text-gray-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* 展开/收起训练条件筛选器按钮 */}
                  <button
                    type="button"
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      totalActiveFilterCount > 0
                        ? 'bg-[#FEF5F0] border-[#FDBA74] text-[#9E4A2B]'
                        : 'bg-white border-[#D6D0C4] text-[#4B5563] hover:bg-[#FAF9F7]'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5 text-[#9E4A2B]" />
                    <span>条件筛选 {totalActiveFilterCount > 0 && `(${totalActiveFilterCount})`}</span>
                    {isFilterExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* 场景化训练条件筛选器（多维度、可选、自由组合、可单选/多选） */}
              {isFilterExpanded && (
                <div className="bg-[#FAF9F7] rounded-xl border border-[#EAE6DD] p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#9E4A2B]" />
                      <span className="font-semibold text-[#1F2937]">场景化训练条件筛选器</span>
                      <span className="text-[11px] text-[#6B7280]">
                        （所有维度均可选，支持人群、场景、需求、问题与品类专属维度自由组合）
                      </span>
                    </div>

                    {totalActiveFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={clearAllScenarioFilters}
                        className="flex items-center gap-1 text-[11px] text-[#9E4A2B] hover:text-[#7C2D12] font-semibold cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>清空筛选条件 ({totalActiveFilterCount})</span>
                      </button>
                    )}
                  </div>

                  {/* 维度 1: 适用人群 */}
                  <div className="flex items-start gap-3 text-xs">
                    <span className="w-20 shrink-0 font-medium text-[#4B5563] pt-0.5">🎯 适用人群:</span>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {UNIVERSAL_TARGET_GROUPS.map((g) => {
                        const isSelected = scenarioFilters.targetGroups.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleFilterChip('targetGroups', g)}
                            className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#9E4A2B] text-white border-[#9E4A2B] font-semibold shadow-2xs'
                                : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#9E4A2B] hover:text-[#9E4A2B]'
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 维度 2: 使用与销售场景 */}
                  <div className="flex items-start gap-3 text-xs">
                    <span className="w-20 shrink-0 font-medium text-[#4B5563] pt-0.5">🏙️ 场景:</span>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {UNIVERSAL_SCENARIOS.map((s) => {
                        const isSelected = scenarioFilters.scenarios.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleFilterChip('scenarios', s)}
                            className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#9E4A2B] text-white border-[#9E4A2B] font-semibold shadow-2xs'
                                : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#9E4A2B] hover:text-[#9E4A2B]'
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 维度 3: 顾客核心需求 */}
                  <div className="flex items-start gap-3 text-xs">
                    <span className="w-20 shrink-0 font-medium text-[#4B5563] pt-0.5">💡 需求:</span>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {UNIVERSAL_DEMANDS.map((d) => {
                        const isSelected = scenarioFilters.demands.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => toggleFilterChip('demands', d)}
                            className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#9E4A2B] text-white border-[#9E4A2B] font-semibold shadow-2xs'
                                : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#9E4A2B] hover:text-[#9E4A2B]'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 维度 4: 顾客问题 / 顾虑 */}
                  <div className="flex items-start gap-3 text-xs">
                    <span className="w-20 shrink-0 font-medium text-[#4B5563] pt-0.5">❓ 顾客问题:</span>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {UNIVERSAL_CUSTOMER_CONCERNS.map((c) => {
                        const isSelected = (scenarioFilters.customerConcerns || []).includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleFilterChip('customerConcerns', c)}
                            className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#9E4A2B] text-white border-[#9E4A2B] font-semibold shadow-2xs'
                                : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#9E4A2B] hover:text-[#9E4A2B]'
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 维度 5: 品类专属维度 (根据产品品类动态呈现，例如彩妆显示肤质，洗发水显示头皮/发质) */}
                  {categoryDimensions.map((catDim) => {
                    const selectedVals = scenarioFilters.categoryDimensions?.[catDim.key] || [];
                    return (
                      <div key={catDim.key} className="flex items-start gap-3 text-xs pt-1 border-t border-[#EFECE6]">
                        <span className="w-20 shrink-0 font-medium text-[#9E4A2B] pt-0.5 flex items-center gap-1">
                          <span>✨ {catDim.label}:</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {catDim.options.map((opt) => {
                            const isSelected = selectedVals.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => toggleCatDimChip(catDim.key, opt)}
                                className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer border ${
                                  isSelected
                                    ? 'bg-[#C2410C] text-white border-[#C2410C] font-semibold shadow-2xs'
                                    : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#C2410C] hover:text-[#C2410C]'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* 筛选结果汇总状态栏 */}
                  <div className="pt-2 border-t border-[#EAE6DD] flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-[#1F2937]">匹配结果：</span>
                      <span className="text-[#6B7280]">
                        当前共找到 <strong className="text-[#9E4A2B] font-mono">{matchedPractices.length}</strong> 门练习内容
                      </span>
                      {totalActiveFilterCount > 0 && (
                        <>
                          <span className="text-[#D1D5DB]">·</span>
                          <span className="text-emerald-700 font-medium">
                            高匹配: {matchedPractices.filter((m) => m.matchLevel === 'exact').length} 门
                          </span>
                          <span className="text-[#D1D5DB]">·</span>
                          <span className="text-amber-700 font-medium">
                            部分匹配: {matchedPractices.filter((m) => m.matchLevel === 'partial').length} 门
                          </span>
                        </>
                      )}
                    </div>

                    {totalActiveFilterCount > 0 && (
                      <div className="text-[11px] text-[#6B7280]">
                        未完全满足全部条件时已自动呈现部分匹配内容，避免空数据
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 练习内容展示表格（严格落实指令建议的列结构：内容名称 | 类型 | 人群 | 场景 | 需求 | 品类专属维度 | 匹配度 | 操作） */}
              <div className="bg-[#FAF9F7] rounded-xl border border-[#EAE6DD] overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F1EA] text-[#6B7280]">
                    <tr className="whitespace-nowrap">
                      <th className="py-2.5 px-4 whitespace-nowrap">内容名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">类型</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">适用人群</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">场景</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">需求</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">
                        {categoryDimensions.map((d) => d.label).join('/') || '专属维度'}
                      </th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">匹配度</th>
                      <th className="py-2.5 px-4 text-right whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6]">
                    {matchedPractices.map(({ practice: p, matchLevel, label, colorClass, matchedTags }) => {
                      const pCond = p.conditions || {};
                      
                      // 专属维度展示文本
                      const catDimTexts = categoryDimensions.map((dim) => {
                        const vals = pCond.categoryDimensions?.[dim.key];
                        return formatConditionList(vals);
                      }).filter(Boolean);
                      const catDimDisplayText = catDimTexts.length > 0 ? catDimTexts.join(' / ') : '不限';

                      return (
                        <tr key={p.id} className="hover:bg-white transition-colors">
                          {/* 1. 内容名称 */}
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                onClick={() => setViewingPractice(p)}
                                className="font-semibold text-[#111827] hover:text-[#9E4A2B] cursor-pointer"
                                title="点击查看练习详情与演练内容"
                              >
                                {p.title}
                              </span>
                              {p.type === '场景对话' && p.priorityLevel === 1 && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-orange-100 text-orange-800 font-bold border border-orange-200">
                                  ⭐ 组合主推
                                </span>
                              )}
                              {p.type === '场景对话' && p.priorityLevel === 2 && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-800 font-medium border border-blue-200">
                                  🔗 连带补充
                                </span>
                              )}
                              {p.type === '数字人' && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
                                  🤖 专属数字人
                                </span>
                              )}
                              {p.dialogueTurns && (
                                <span className="text-[10px] text-gray-400 font-mono">
                                  ({p.dialogueTurns}轮对话)
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#9CA3AF] flex items-center gap-1.5 pt-0.5">
                              <span>{p.author}</span>
                              <span>·</span>
                              <span>{p.targetAudience}</span>
                            </div>
                          </td>

                          {/* 2. 类型 */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium inline-flex items-center gap-1 ${
                                p.type === '数字人'
                                  ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]'
                                  : p.type === '场景对话'
                                  ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                                  : 'bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3]'
                              }`}
                            >
                              {p.type === '数字人' && <Bot className="w-3 h-3" />}
                              {p.type === '场景对话' && <MessageSquare className="w-3 h-3" />}
                              {p.type === '金句' && <Sparkles className="w-3 h-3" />}
                              <span>{p.type}</span>
                            </span>
                          </td>

                          {/* 3. 人群 */}
                          <td className="py-2.5 px-3 text-[#374151]">
                            <span className={formatConditionList(pCond.targetGroups) === '不限' ? 'text-gray-400 italic' : 'font-medium'}>
                              {formatConditionList(pCond.targetGroups)}
                            </span>
                          </td>

                          {/* 4. 场景 */}
                          <td className="py-2.5 px-3 text-[#374151]">
                            <span className={formatConditionList(pCond.scenarios) === '不限' ? 'text-gray-400 italic' : 'font-medium'}>
                              {formatConditionList(pCond.scenarios)}
                            </span>
                          </td>

                          {/* 5. 需求 */}
                          <td className="py-2.5 px-3 text-[#374151]">
                            <span className={formatConditionList(pCond.demands) === '不限' ? 'text-gray-400 italic' : 'font-medium'}>
                              {formatConditionList(pCond.demands)}
                            </span>
                          </td>

                          {/* 6. 品类专属维度 */}
                          <td className="py-2.5 px-3 text-[#374151]">
                            <span className={catDimDisplayText === '不限' ? 'text-gray-400 italic' : 'font-medium text-[#9E4A2B]'}>
                              {catDimDisplayText}
                            </span>
                          </td>

                          {/* 7. 匹配度 (高匹配 / 部分匹配 / 通用) */}
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <div className="inline-flex flex-col items-center">
                              <span className={`px-2 py-0.5 rounded text-[11px] border ${colorClass}`}>
                                {label}
                              </span>
                              {matchLevel === 'partial' && matchedTags.length > 0 && (
                                <span className="text-[9px] text-[#B45309] font-medium pt-0.5">
                                  命中: {matchedTags.slice(0, 2).join('+')}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 8. 操作 */}
                          <td className="py-2.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewingPractice(p)}
                                className="px-2 py-1 text-xs text-[#4B5563] hover:text-[#111827] hover:bg-[#FAF9F7] rounded border border-[#D6D0C4] transition-colors cursor-pointer"
                                title="查看练习内容与演练详情"
                              >
                                查看
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPractice(p)}
                                className="px-2 py-1 text-xs text-[#9E4A2B] hover:text-[#7C2D12] hover:bg-[#FEF5F0] rounded border border-[#FDBA74]/70 transition-colors cursor-pointer"
                                title="配置适用人群、场景、需求与品类专属维度"
                              >
                                条件
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenTaskPublish(product, {
                                    id: p.id,
                                    category: 'practice',
                                    title: p.title,
                                  })
                                }
                                className="whitespace-nowrap inline-flex items-center px-2.5 py-1 text-xs text-white bg-[#9E4A2B] hover:bg-[#8C3E20] rounded-md transition-colors font-medium cursor-pointer shadow-2xs"
                              >
                                发任务
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Exam Assets - 考试任务 */}
            <div id="asset-section-exam" className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-bold text-xs text-[#1F2937] flex items-center gap-2 whitespace-nowrap">
                  <GraduationCap className="w-4 h-4 text-[#059669]" />
                  <span>考试任务 ({product.examAssets.length} 份)</span>
                </h4>
                <div className="flex items-center gap-3 text-xs whitespace-nowrap">
                  <span className="text-[#059669] font-mono font-bold">
                    考试平均分: {calculatedAvgExamScore !== null ? `${calculatedAvgExamScore} 分` : '—'}
                  </span>
                  <span className="text-[#6B7280]">已发布 {totalExamUsage} 次</span>
                </div>
              </div>

              {product.examAssets.length === 0 ? (
                <div className="text-center py-4 text-gray-400 bg-[#FAF9F7] rounded-xl border border-[#EAE6DD]">
                  暂无关联考试
                </div>
              ) : (
                <div className="bg-[#FAF9F7] rounded-xl border border-[#EAE6DD] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F4F1EA] text-[#6B7280]">
                      <tr className="whitespace-nowrap">
                        <th className="py-2.5 px-4 whitespace-nowrap">试卷名称</th>
                        <th className="py-2.5 px-4 whitespace-nowrap">发布人</th>
                        <th className="py-2.5 px-4 whitespace-nowrap">发布对象</th>
                        <th className="py-2.5 px-4 text-center whitespace-nowrap">及格线</th>
                        <th className="py-2.5 px-4 text-center whitespace-nowrap">使用次数</th>
                        <th className="py-2.5 px-4 text-center whitespace-nowrap">平均分</th>
                        <th className="py-2.5 px-4 text-center whitespace-nowrap">达标率</th>
                        <th className="py-2.5 px-4 text-right whitespace-nowrap">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6]">
                      {product.examAssets.map((e) => (
                        <tr key={e.id} className="hover:bg-white">
                          <td className="py-2.5 px-4 font-medium text-[#111827]">{e.title}</td>
                          <td className="py-2.5 px-4 whitespace-nowrap">{e.author}</td>
                          <td className="py-2.5 px-4 text-[#6B7280] whitespace-nowrap">{e.targetAudience}</td>
                          <td className="py-2.5 px-4 text-center font-mono text-[#6B7280] whitespace-nowrap">
                            {e.passingScore}分
                          </td>
                          <td className="py-2.5 px-4 text-center font-bold text-[#9E4A2B] whitespace-nowrap">
                            {e.usageCount} 次
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono font-bold text-[#059669] whitespace-nowrap">
                            {e.averageScore}分
                          </td>
                          <td className="py-2.5 px-4 text-center text-[#059669] font-mono whitespace-nowrap">
                            94.2%
                          </td>
                          <td className="py-2.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() =>
                                onOpenTaskPublish(product, {
                                  id: e.id,
                                  category: 'exam',
                                  title: e.title,
                                })
                              }
                              className="whitespace-nowrap inline-flex items-center px-3 py-1 text-xs text-[#9E4A2B] hover:text-white bg-white hover:bg-[#9E4A2B] border border-[#FDBA74] rounded-md transition-colors font-medium cursor-pointer shadow-2xs"
                            >
                              发任务
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Cross-selling & Bundles (Sections 15, 16, 17) */}
        {activeTab === 'cross-selling' && (
          <div className="p-6 space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1F2937]">
                  主推品 → 连带销售矩阵 (Cross-Selling Strategy)
                </h3>
                <p className="text-[#6B7280] text-xs mt-0.5">
                  美妆销售不是单品销售：围绕核心主推品，建立连带推荐搭配、连带话术与配套练习场景
                </p>
              </div>

              <button
                onClick={() => setShowAddCrossModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white rounded-lg transition-colors font-medium shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ 建立连带关系</span>
              </button>
            </div>

            {/* AI Smart Cross-Selling & Combination Training Recommendation */}
            <div className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] p-4 rounded-xl border border-[#FDE68A] shadow-2xs space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#F59E0B] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#92400E]">
                      AI 智能连带销售搭配与对练推荐
                    </h4>
                    <p className="text-[11px] text-[#B45309]">
                      根据专柜连带率 (UPT) 与客单价 (ATV) 分析：围绕核心单品搭配连带品发布单项实战练习，赋能柜台BA
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] px-2 py-0.5 rounded font-medium">
                  组合策略
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-white/90 p-3 rounded-lg border border-[#FDE68A]/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F2937]">🎯 爆品连带搭档：{product.crossSelling[0]?.productName || '搭配品'}</span>
                    <span className="text-[10px] text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded font-medium">连带率预估 +38%</span>
                  </div>
                  <p className="text-[#6B7280] text-[11px] leading-relaxed">
                    {product.crossSelling[0]?.recommendReason || '以主推品锁住柜台客流，顺势推介连带搭配品，形成闭环体验。'}
                  </p>
                </div>

                <div className="bg-white/90 p-3 rounded-lg border border-[#FDE68A]/70 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#9E4A2B] text-xs">配套练习：连带销售场景实战</div>
                    <div className="text-[11px] text-[#6B7280]">
                      推荐发布 1 次专项练习：《{product.crossSelling[0]?.associatedPracticeScene || '连带促单话术演练'}》
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const firstCross = product.crossSelling[0];
                      onOpenTaskPublish(product, {
                        id: firstCross ? `cross-${firstCross.productId}` : 'cross-default',
                        category: 'practice',
                        title: `【连带促单演练】${product.name.split(' ')[0]} + ${firstCross?.productName || '连带品'} 搭配销售`
                      });
                    }}
                    className="px-3 py-1.5 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white rounded-lg text-xs font-semibold shrink-0 shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>发布连带练习</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Cross-sell Tree Architecture */}
            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#EAE5D9] mb-4">
              <div className="font-semibold text-[#1F2937] mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9E4A2B]" />
                <span>连带逻辑拓扑关系：</span>
              </div>
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className="px-3 py-1 bg-[#FFEDD5] text-[#C2410C] rounded-lg font-bold border border-[#FDBA74]">
                  ⭐ 主推品: {product.name}
                </span>
                <span className="text-gray-400">➔ 连带搭配：</span>
                {product.crossSelling.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white text-[#374151] rounded-lg border border-[#D6D0C4] font-medium flex items-center gap-1 shadow-2xs"
                  >
                    <span>{c.productName}</span>
                    <span className="text-[10px] bg-[#ECFDF5] text-[#047857] px-1 rounded">连带品</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Cross-selling Detailed Cards */}
            <div className="space-y-4">
              {product.crossSelling.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  暂未配置连带搭配产品，点击上方“+ 建立连带关系”添加。
                </div>
              ) : (
                product.crossSelling.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-[#E8E6E1] p-4 shadow-xs space-y-3 hover:border-[#D4CEBF] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover border border-[#E0DBD0]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1F2937]">{item.productName}</h4>
                            <span className="text-[11px] bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] px-1.5 py-0.2 rounded font-medium">
                              {item.role}
                            </span>
                            <span className="text-[11px] text-[#6B7280]">[{item.brand}]</span>
                          </div>
                          <div className="text-[11px] text-[#9CA3AF] font-mono mt-0.5">
                            SKU: {item.sku}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          onOpenTaskPublish(product, {
                            id: `cross-practice-${item.productId}`,
                            category: 'practice',
                            title: `【连带促单演练】${product.name.split(' ')[0]} + ${item.productName} 搭配销售话术`,
                          })
                        }
                        className="px-3 py-1.5 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#9E4A2B] border border-[#FED7AA] font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>发布连带实战练习</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#F0EDE6] text-xs">
                      <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE6DD]">
                        <span className="font-semibold text-[#1F2937] block mb-1">
                          💡 推荐搭配理由 (Cross-sell Rationale):
                        </span>
                        <p className="text-[#4B5563] leading-relaxed">{item.recommendReason}</p>
                      </div>

                      <div className="bg-[#FFFBF7] p-2.5 rounded-lg border border-[#FDE3D3]">
                        <span className="font-semibold text-[#9E4A2B] block mb-1">
                          🗣️ 推荐连带推介金句话术 (BA Pitch):
                        </span>
                        <p className="text-[#9E4A2B] font-medium leading-relaxed italic">
                          {item.recommendedPitch}
                        </p>
                      </div>
                    </div>

                    {item.associatedPracticeScene && (
                      <div className="flex items-center justify-between text-[11px] bg-[#F3F4F6] px-3 py-1.5 rounded-lg text-[#4B5563]">
                        <span className="flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-[#4F46E5]" />
                          <span>已关联对练场景: <strong>{item.associatedPracticeScene}</strong></span>
                        </span>
                        <span className="text-[#059669] font-medium">支持BA场景模拟考核</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add Cross Sell Modal */}
            {showAddCrossModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-5 border border-[#E5E1D8] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAE7E0] pb-3">
                    <h3 className="font-bold text-sm text-[#1F2937]">添加连带销售产品关系</h3>
                    <button
                      onClick={() => setShowAddCrossModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCrossSell} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563] mb-1">
                        选择连带搭配品
                      </label>
                      <select
                        value={selectedCrossProdId}
                        onChange={(e) => setSelectedCrossProdId(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D6D0C4] rounded-lg bg-white"
                      >
                        {allProducts
                          .filter((p) => p.id !== product.id)
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.brand}] {p.name} ({p.roles.join('/')})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#4B5563] mb-1">
                        推荐理由 (例如: 提升底妆服帖度、延长持妆时间)
                      </label>
                      <input
                        type="text"
                        required
                        value={newReason}
                        onChange={(e) => setNewReason(e.target.value)}
                        placeholder="例如: 配合粉底液锁妆，水光感加倍不脱妆"
                        className="w-full px-3 py-2 border border-[#D6D0C4] rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#4B5563] mb-1">
                        连带推荐黄金推介话术 (BA专柜直接使用)
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={newPitch}
                        onChange={(e) => setNewPitch(e.target.value)}
                        placeholder="例如: “美女，化好底妆搭配这款定妆喷雾，底妆牢牢焊在脸上，带妆一整天都不掉！”"
                        className="w-full px-3 py-2 border border-[#D6D0C4] rounded-lg bg-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCrossModal(false)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#9E4A2B] text-white rounded-lg text-xs font-medium"
                      >
                        保存连带关系
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Regional Stats & AI Insights (Sections 25, 26, 28) */}
        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6 text-xs">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937] mb-1">
                区域培训考核与销售转化联动分析
              </h3>
              <p className="text-xs text-[#6B7280]">
                通过各区域 BA 的考核成绩、练习完成率与柜台销量对照，发现薄弱短板并形成 AI 靶向推荐
              </p>
            </div>

            {/* Regional breakdown table */}
            <div className="bg-[#FAF9F7] rounded-xl border border-[#EAE6DD] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F1EA] text-[#6B7280]">
                  <tr>
                    <th className="py-3 px-4">区域 / 维度</th>
                    <th className="py-3 px-4 text-center">考试平均分</th>
                    <th className="py-3 px-4 text-center">练习通关率</th>
                    <th className="py-3 px-4 text-center">本月销量 (件)</th>
                    <th className="py-3 px-4 text-center">销售增速</th>
                    <th className="py-3 px-4">AI 诊断与建议</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] text-[#374151]">
                  {(product.regionalStats || [
                    { region: '全国', avgExamScore: product.examAvgScore || 85, completionRate: 92, salesVolume: 42000, salesGrowth: '+20.5%' },
                    { region: 'Jakarta', avgExamScore: (product.examAvgScore || 85) - 3, completionRate: 88, salesVolume: 21000, salesGrowth: '+15.2%' },
                    { region: 'Bandung', avgExamScore: (product.examAvgScore || 85) - 6, completionRate: 82, salesVolume: 11000, salesGrowth: '+8.4%' }
                  ]).map((stat, idx) => (
                    <tr key={idx} className="hover:bg-white">
                      <td className="py-3 px-4 font-semibold text-[#111827]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#9E4A2B]" />
                          <span>{stat.region}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        <span
                          className={
                            stat.avgExamScore >= 85
                              ? 'text-[#059669]'
                              : stat.avgExamScore >= 75
                              ? 'text-[#D97706]'
                              : 'text-[#DC2626]'
                          }
                        >
                          {stat.avgExamScore > 0 ? `${stat.avgExamScore} 分` : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[#4B5563]">
                        {stat.completionRate}%
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums font-medium">
                        {stat.salesVolume.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[#059669] font-semibold">
                        {stat.salesGrowth}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#4B5563]">
                        {stat.avgExamScore < 80 ? (
                          <span className="text-[#DC2626] font-medium">
                            ⚠️ 考核均分偏低，建议定向发布针对性补差训练
                          </span>
                        ) : (
                          <span className="text-[#059669]">
                            ✅ 知识掌握优异，可加强连带销售转化练习
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Recommendation Summary Box */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5D9] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]">
                <BrainCircuit className="w-4 h-4 text-[#9E4A2B]" />
                <span>AI 智能推荐任务总纲：</span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                当前产品角色定位为：
                <span className="font-semibold text-[#9E4A2B]">{product.roles.join(' + ')}</span>。
                系统建议优先在全国分发「{product.sellingPoints[0]}」实战推销对练，并针对客诉率高频的痛点场景开展数字人对练。
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenTaskPublish(product)}
                  className="px-4 py-2 bg-[#9E4A2B] text-white rounded-lg text-xs font-semibold hover:bg-[#8C3E20] transition-colors"
                >
                  采纳建议并进入任务发布流程
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal 1: 编辑练习内容场景化适用条件 (Section 8-9) */}
      {editingPractice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-[#EAE6DD] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-[#9E4A2B]" />
                  <h3 className="font-bold text-sm text-[#1F2937]">配置练习适用训练条件</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      editingPractice.type === '数字人'
                        ? 'bg-[#EEF2FF] text-[#4F46E5]'
                        : editingPractice.type === '场景对话'
                        ? 'bg-[#FEF3C7] text-[#B45309]'
                        : 'bg-[#FFE4E6] text-[#E11D48]'
                    }`}
                  >
                    {editingPractice.type}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] font-medium">{editingPractice.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPractice(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-[#6B7280] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE5D9]">
              💡 <strong>适用条件说明：</strong>
              可自由组合人群、场景、需求与品类专属维度。无需全部填写，支持将任一维度设为“不限/未指定”（例如金句通常不限人群场景）。
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formElem = e.currentTarget;
                const formData = new FormData(formElem);

                // Collect selected values
                const targetGroups = formData.getAll('targetGroups') as string[];
                const scenarios = formData.getAll('scenarios') as string[];
                const demands = formData.getAll('demands') as string[];
                const customerConcerns = formData.getAll('customerConcerns') as string[];

                const catDims: Record<string, string[]> = {};
                categoryDimensions.forEach((dim) => {
                  const vals = formData.getAll(`catDim_${dim.key}`) as string[];
                  catDims[dim.key] = vals;
                });

                const updatedPractice: TrainingAssetPractice = {
                  ...editingPractice,
                  conditions: {
                    targetGroups: targetGroups.length > 0 ? targetGroups : ['不限'],
                    scenarios: scenarios.length > 0 ? scenarios : ['不限'],
                    demands: demands.length > 0 ? demands : ['不限'],
                    customerConcerns: customerConcerns.length > 0 ? customerConcerns : ['不限'],
                    categoryDimensions: catDims,
                  },
                };

                if (editingPractice.type === '数字人' && onSaveDigitalHuman) {
                  const dh = digitalHumans?.find((d) => d.id === editingPractice.id);
                  if (dh) {
                    onSaveDigitalHuman({
                      ...dh,
                      personaTags: {
                        ...dh.personaTags,
                        targetGroups: targetGroups.length > 0 ? targetGroups : [],
                        scenarios: scenarios.length > 0 ? scenarios : [],
                        demands: demands.length > 0 ? demands : [],
                        customerConcerns: customerConcerns.length > 0 ? customerConcerns : [],
                        categoryDimensions: catDims,
                      },
                      updatedAt: new Date().toISOString().split('T')[0],
                    });
                  }
                } else if (editingPractice.type === '场景对话' && onSaveScript) {
                  const sc = scenarioScripts?.find((s) => s.id === editingPractice.id);
                  if (sc) {
                    onSaveScript({
                      ...sc,
                      scenarioTags: {
                        ...sc.scenarioTags,
                        targetGroups: targetGroups.length > 0 ? targetGroups : [],
                        scenarios: scenarios.length > 0 ? scenarios : [],
                        demands: demands.length > 0 ? demands : [],
                        categoryDimensions: catDims,
                      },
                      updatedAt: new Date().toISOString().split('T')[0],
                    });
                  }
                }

                const updatedPracticeList = product.practiceAssets.map((item) =>
                  item.id === updatedPractice.id ? updatedPractice : item
                );

                const updatedProduct: Product = {
                  ...product,
                  practiceAssets: updatedPracticeList,
                };

                if (onSaveProduct) {
                  onSaveProduct(updatedProduct);
                } else {
                  onEditProduct(updatedProduct);
                }

                setEditingPractice(null);
              }}
              className="space-y-4 text-xs"
            >
              {/* 1. 适用人群 */}
              <div className="space-y-1.5 bg-[#FAF9F7] p-3 rounded-xl border border-[#EAE6DD]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F2937]">🎯 适用人群</span>
                  <span className="text-[11px] text-[#6B7280]">可多选，未选自动视为“不限”</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {UNIVERSAL_TARGET_GROUPS.map((g) => {
                    const defaultChecked = editingPractice.conditions?.targetGroups?.includes(g);
                    return (
                      <label
                        key={g}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-[#D6D0C4] cursor-pointer hover:border-[#9E4A2B]"
                      >
                        <input
                          type="checkbox"
                          name="targetGroups"
                          value={g}
                          defaultChecked={defaultChecked}
                          className="accent-[#9E4A2B] rounded"
                        />
                        <span className="text-[11px] text-[#374151]">{g}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. 销售与使用场景 */}
              <div className="space-y-1.5 bg-[#FAF9F7] p-3 rounded-xl border border-[#EAE6DD]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F2937]">🏙️ 适用场景</span>
                  <span className="text-[11px] text-[#6B7280]">可多选，未选自动视为“不限”</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {UNIVERSAL_SCENARIOS.map((s) => {
                    const defaultChecked = editingPractice.conditions?.scenarios?.includes(s);
                    return (
                      <label
                        key={s}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-[#D6D0C4] cursor-pointer hover:border-[#9E4A2B]"
                      >
                        <input
                          type="checkbox"
                          name="scenarios"
                          value={s}
                          defaultChecked={defaultChecked}
                          className="accent-[#9E4A2B] rounded"
                        />
                        <span className="text-[11px] text-[#374151]">{s}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. 顾客核心需求 */}
              <div className="space-y-1.5 bg-[#FAF9F7] p-3 rounded-xl border border-[#EAE6DD]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F2937]">💡 顾客需求</span>
                  <span className="text-[11px] text-[#6B7280]">可多选，未选自动视为“不限”</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {UNIVERSAL_DEMANDS.map((d) => {
                    const defaultChecked = editingPractice.conditions?.demands?.includes(d);
                    return (
                      <label
                        key={d}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-[#D6D0C4] cursor-pointer hover:border-[#9E4A2B]"
                      >
                        <input
                          type="checkbox"
                          name="demands"
                          value={d}
                          defaultChecked={defaultChecked}
                          className="accent-[#9E4A2B] rounded"
                        />
                        <span className="text-[11px] text-[#374151]">{d}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. 顾客问题 */}
              <div className="space-y-1.5 bg-[#FAF9F7] p-3 rounded-xl border border-[#EAE6DD]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F2937]">❓ 顾客问题/顾虑</span>
                  <span className="text-[11px] text-[#6B7280]">可多选，未选自动视为“不限”</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {UNIVERSAL_CUSTOMER_CONCERNS.map((c) => {
                    const defaultChecked = editingPractice.conditions?.customerConcerns?.includes(c);
                    return (
                      <label
                        key={c}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-[#D6D0C4] cursor-pointer hover:border-[#9E4A2B]"
                      >
                        <input
                          type="checkbox"
                          name="customerConcerns"
                          value={c}
                          defaultChecked={defaultChecked}
                          className="accent-[#9E4A2B] rounded"
                        />
                        <span className="text-[11px] text-[#374151]">{c}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5. 品类专属维度 */}
              {categoryDimensions.map((catDim) => {
                const currentVals = editingPractice.conditions?.categoryDimensions?.[catDim.key] || [];
                return (
                  <div key={catDim.key} className="space-y-1.5 bg-[#FAF9F7] p-3 rounded-xl border border-[#EAE6DD]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#9E4A2B] flex items-center gap-1">
                        <span>✨ 品类专属维度 · {catDim.label}</span>
                      </span>
                      <span className="text-[11px] text-[#6B7280]">针对当前产品品类专属配置</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {catDim.options.map((opt) => {
                        const defaultChecked = currentVals.includes(opt);
                        return (
                          <label
                            key={opt}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-[#D6D0C4] cursor-pointer hover:border-[#9E4A2B]"
                          >
                            <input
                              type="checkbox"
                              name={`catDim_${catDim.key}`}
                              value={opt}
                              defaultChecked={defaultChecked}
                              className="accent-[#C2410C] rounded"
                            />
                            <span className="text-[11px] text-[#374151]">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 border-t border-[#F0ECE3] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingPractice(null)}
                  className="px-3 py-1.5 text-xs text-[#6B7280] hover:text-[#111827] bg-[#F4F1EA] hover:bg-[#EAE5D9] rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-[#9E4A2B] hover:bg-[#8C3E20] rounded-lg font-medium transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>保存适用条件</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: 查看练习内容详情与条件 (Section 12) */}
      {viewingPractice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-[#EAE6DD] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#1F2937]">{viewingPractice.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      viewingPractice.type === '数字人'
                        ? 'bg-[#EEF2FF] text-[#4F46E5]'
                        : viewingPractice.type === '场景对话'
                        ? 'bg-[#FEF3C7] text-[#B45309]'
                        : 'bg-[#FFE4E6] text-[#E11D48]'
                    }`}
                  >
                    {viewingPractice.type}
                  </span>
                </div>
                <div className="text-[11px] text-[#6B7280] flex items-center gap-2">
                  <span>发布人: {viewingPractice.author}</span>
                  <span>·</span>
                  <span>目标BA: {viewingPractice.targetAudience}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingPractice(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 场景化训练条件卡片 */}
            <div className="bg-[#FAF9F7] p-3.5 rounded-xl border border-[#EAE6DD] space-y-2 text-xs">
              <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#9E4A2B]" />
                <span>绑定的场景化训练适用条件：</span>
              </span>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="bg-white p-2 rounded border border-[#EAE6DD]">
                  <span className="text-[#6B7280] block text-[10px]">🎯 适用人群</span>
                  <span className="font-medium text-[#111827]">
                    {formatConditionList(viewingPractice.conditions?.targetGroups)}
                  </span>
                </div>

                <div className="bg-white p-2 rounded border border-[#EAE6DD]">
                  <span className="text-[#6B7280] block text-[10px]">🏙️ 适用场景</span>
                  <span className="font-medium text-[#111827]">
                    {formatConditionList(viewingPractice.conditions?.scenarios)}
                  </span>
                </div>

                <div className="bg-white p-2 rounded border border-[#EAE6DD]">
                  <span className="text-[#6B7280] block text-[10px]">💡 适用需求</span>
                  <span className="font-medium text-[#111827]">
                    {formatConditionList(viewingPractice.conditions?.demands)}
                  </span>
                </div>

                <div className="bg-white p-2 rounded border border-[#EAE6DD]">
                  <span className="text-[#6B7280] block text-[10px]">❓ 顾客顾虑/问题</span>
                  <span className="font-medium text-[#111827]">
                    {formatConditionList(viewingPractice.conditions?.customerConcerns)}
                  </span>
                </div>
              </div>

              {/* 专属维度 */}
              {categoryDimensions.map((catDim) => {
                const vals = viewingPractice.conditions?.categoryDimensions?.[catDim.key];
                return (
                  <div key={catDim.key} className="bg-white p-2 rounded border border-[#EAE6DD] text-[11px]">
                    <span className="text-[#9E4A2B] font-medium block text-[10px]">✨ 品类专属 · {catDim.label}</span>
                    <span className="font-medium text-[#111827]">
                      {formatConditionList(vals)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 演练内容 / 剧本概要 / 数字人详情 */}
            {matchedDh ? (
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE5D9] space-y-2.5 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#EAE6DD] bg-white shrink-0 flex items-center justify-center">
                    {matchedDh.avatar ? (
                      <img src={matchedDh.avatar} alt={matchedDh.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-sm text-[#78716C]">{matchedDh.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#1F2937] block">🤖 数字人角色档案：{matchedDh.name}</span>
                    <p className="text-[11px] text-[#6B7280] mt-0.5 line-clamp-2">{matchedDh.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF] mt-1">
                      <span>语种: {matchedDh.language}</span>
                      <span>·</span>
                      <span>音色: {matchedDh.voiceTone}</span>
                      <span>·</span>
                      <span>对话轮数: {matchedDh.scriptOutline?.turns || 5}轮</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0ECE3] space-y-1">
                  <span className="font-semibold text-[#1F2937] text-[11px]">人格设定 Prompt:</span>
                  <p className="text-[11px] text-[#4B5563] bg-white p-2 rounded border border-[#EAE6DD] font-mono leading-relaxed max-h-24 overflow-y-auto">
                    {matchedDh.prompt}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1 text-[10px] text-[#6B7280]">
                  <span>演练满意度: <strong className="font-mono text-[#059669]">{matchedDh.avgScore || 90}%</strong></span>
                  <span>·</span>
                  <span>已陪练次数: <strong className="font-mono text-[#9E4A2B]">{matchedDh.usageCount || 36} 次</strong></span>
                </div>
              </div>
            ) : matchedScript ? (
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE5D9] space-y-2.5 text-xs">
                <div>
                  <span className="font-bold text-xs text-[#1F2937] block">🎭 场景剧本实战：{matchedScript.title}</span>
                  {matchedScript.linkedCombination && (
                    <div className="text-[11px] text-[#9E4A2B] bg-[#FFF0E6] px-2 py-0.5 rounded border border-[#FDBA74] mt-1 inline-block">
                      📦 关联组合：{matchedScript.linkedCombination.combinationName}
                    </div>
                  )}
                  <p className="text-[11px] text-[#4B5563] mt-1 leading-relaxed">
                    <strong>场景介绍：</strong>{matchedScript.sceneDescription}
                  </p>
                </div>

                <div className="space-y-1 pt-1 border-t border-[#F0ECE3]">
                  <span className="font-semibold text-[#1F2937] text-[11px]">剧本实战流程与提示节点 ({matchedScript.steps.length} 步)：</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {matchedScript.steps.map((st, i) => (
                      <div key={st.id || i} className="p-2 bg-white rounded border border-[#EAE6DD] text-[11px] space-y-0.5">
                        <div className="font-semibold text-[#1F2937] flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-[#9E4A2B] text-white text-[9px] flex items-center justify-center font-bold">
                            {st.order || i + 1}
                          </span>
                          <span>{st.title}</span>
                        </div>
                        <div className="text-[#4B5563] pl-5">{st.goal}</div>
                        {st.hint && <div className="text-[#D97706] pl-5 italic text-[10px]">💡 BA提示：{st.hint}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1 text-[10px] text-[#6B7280]">
                  <span>演练达标率: <strong className="font-mono text-[#059669]">93%</strong></span>
                  <span>·</span>
                  <span>已发布演练: <strong className="font-mono text-[#9E4A2B]">{matchedScript.usageCount || 28} 次</strong></span>
                </div>
              </div>
            ) : (
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE5D9] space-y-1.5 text-xs">
                <span className="font-semibold text-[#1F2937] block">
                  {viewingPractice.type === '金句' ? '💬 核心金句考核标准' : '🎭 专柜对话剧本演练目标'}
                </span>
                <p className="text-[11px] text-[#4B5563] leading-relaxed">
                  {viewingPractice.type === '金句'
                    ? `BA需通过语音录入精准朗读或背诵本产品专属推荐金句，系统AI测评语速、关键词覆盖度（烟酰胺、抗暗沉、控油持妆）与语气亲和力，考核达标率需达到90%以上。`
                    : `柜台实战情景模拟：针对特定场景开展深度互动对练，演练包含成膜实验演示或搭配连带推荐，提升专柜一次成交率与连带销售表现。`}
                </p>
                <div className="flex items-center gap-3 pt-2 text-[10px] text-[#6B7280]">
                  <span>历史完成率: <strong className="font-mono text-[#059669]">{viewingPractice.avgPassRate}%</strong></span>
                  <span>·</span>
                  <span>已发布次数: <strong className="font-mono text-[#9E4A2B]">{viewingPractice.usageCount} 次</strong></span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#F0ECE3] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setViewingPractice(null)}
                className="px-3 py-1.5 text-xs text-[#6B7280] hover:text-[#111827] bg-[#F4F1EA] hover:bg-[#EAE5D9] rounded-lg transition-colors cursor-pointer"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewingPractice;
                  setViewingPractice(null);
                  setEditingPractice(target);
                }}
                className="px-3 py-1.5 text-xs text-[#9E4A2B] hover:text-[#7C2D12] bg-[#FEF5F0] hover:bg-[#FDECE2] border border-[#FDBA74] rounded-lg font-medium transition-colors cursor-pointer"
              >
                修改适用条件
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewingPractice;
                  setViewingPractice(null);
                  onOpenTaskPublish(product, {
                    id: target.id,
                    category: 'practice',
                    title: target.title,
                  });
                }}
                className="px-3.5 py-1.5 text-xs text-white bg-[#9E4A2B] hover:bg-[#8C3E20] rounded-lg font-medium transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <SendHorizontal className="w-3.5 h-3.5" />
                <span>以此练习发任务</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
