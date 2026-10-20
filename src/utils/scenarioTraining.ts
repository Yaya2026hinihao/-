import { Product, TrainingAssetPractice, CategoryDimensionConfig } from '../types/product';

// 基础通用维度选项（按指令规范）
export const UNIVERSAL_TARGET_GROUPS = [
  '年轻顾客',
  '熟龄顾客',
  '新手顾客',
  '学生党',
  '年轻白领',
  '精致妈妈',
  '女性顾客',
  '男性顾客',
  '高消费顾客',
];

export const UNIVERSAL_SCENARIOS = [
  '日常',
  '通勤',
  '约会',
  '婚礼',
  '聚会',
  '旅行',
  '节日',
  '户外活动',
  '重要会议',
  '专柜试妆',
];

export const UNIVERSAL_DEMANDS = [
  '控油',
  '保湿',
  '持妆',
  '遮瑕',
  '提亮',
  '修护',
  '舒缓',
  '去屑',
  '蓬松',
  '自然水光',
  '轻薄养肤',
  '抗暗沉',
];

export const UNIVERSAL_CUSTOMER_CONCERNS = [
  '不知道怎么选择',
  '担心脱妆',
  '担心卡粉',
  '头皮容易出油',
  '头发干枯毛躁',
  '身体肌肤干燥',
  '担心厚重假面',
  '担心不显色/沾杯',
  '敏感泛红容易刺激',
];

/**
 * 根据产品品类动态获取专属维度（支持彩妆、护肤、洗发/护发、身体护理与未来扩展品类）
 * 确保不显示与当前产品品类无关的维度！
 */
export function getProductCategoryDimensions(product?: Product | null): CategoryDimensionConfig[] {
  if (!product) {
    return [{ key: '肤质', label: '肤质', options: ['油皮', '混油皮', '干皮', '中性皮', '敏感肌'] }];
  }

  const category = (product.category || '').toUpperCase();
  const subCategory = (product.subCategory || '').toUpperCase();
  const name = product.name || '';
  const series = product.series || '';

  // 1. 洗发 / 护发 (Hair care)
  if (
    subCategory === 'HAIR' ||
    name.includes('洗发') ||
    name.includes('护发') ||
    name.includes('头皮') ||
    series.includes('Hair') ||
    series.includes('发')
  ) {
    return [
      {
        key: '头皮类型',
        label: '头皮类型',
        options: ['油性头皮', '干性头皮', '敏感头皮', '易头屑头皮', '中性头皮'],
      },
      {
        key: '头发状态',
        label: '头发状态',
        options: ['细软扁塌', '干枯毛躁', '受损分叉', '烫染褪色', '易出油扁塌', '粗硬发质'],
      },
    ];
  }

  // 2. 身体护理 (Body care)
  if (
    subCategory === 'BODY' ||
    name.includes('身体') ||
    name.includes('沐浴') ||
    name.includes('磨砂') ||
    name.includes('Body') ||
    series.includes('Body')
  ) {
    return [
      {
        key: '身体肌肤状态',
        label: '身体肌肤状态',
        options: ['干燥粗糙', '暗沉无光', '起屑紧绷', '鸡皮起屑', '晒后泛红', '水油平衡'],
      },
    ];
  }

  // 3. 护肤 (Skincare)
  if (category === 'SKINCARE' || name.includes('精华') || name.includes('面霜') || name.includes('洁面')) {
    return [
      {
        key: '肤质',
        label: '适用肤质',
        options: ['油皮', '混油皮', '干皮', '敏感肌', '熟龄肌', '痘痘肌', '中性皮'],
      },
    ];
  }

  // 4. 彩妆 (Makeup) 及美妆工具 - 默认彩妆专属维度为“肤质”
  return [
    {
      key: '肤质',
      label: '肤质',
      options: ['油皮', '混油皮', '干皮', '中性皮', '敏感肌'],
    },
  ];
}

export interface ScenarioFilterCriteria {
  targetGroups: string[];
  scenarios: string[];
  demands: string[];
  customerConcerns: string[];
  categoryDimensions: Record<string, string[]>;
}

export interface PracticeMatchResult {
  practice: TrainingAssetPractice;
  matchLevel: 'exact' | 'partial' | 'general' | 'none';
  matchScore: number;
  label: '高匹配' | '部分匹配' | '匹配' | '全部关联' | '未匹配';
  colorClass: string;
  matchedTags: string[];
  totalFilterCount: number;
}

/**
 * 智能训练条件匹配算法
 * 精确匹配：满足所有选定条件时优先排序，标记「高匹配」
 * 部分匹配：若未完全满足，显示部分满足内容并标记「部分匹配」，展示具体命中的条件
 * 不选择条件：显示该产品全部练习，标记「全部关联」
 */
export function evaluatePracticeMatch(
  practice: TrainingAssetPractice,
  criteria: ScenarioFilterCriteria,
  product?: Product | null
): PracticeMatchResult {
  const selectedTargetGroups = criteria.targetGroups || [];
  const selectedScenarios = criteria.scenarios || [];
  const selectedDemands = criteria.demands || [];
  const selectedConcerns = criteria.customerConcerns || [];
  const selectedCategoryDims = criteria.categoryDimensions || {};

  // 收集所选的所有筛选维度与标签
  const allSelectedFilters: { dim: string; val: string }[] = [];
  selectedTargetGroups.forEach((v) => allSelectedFilters.push({ dim: '人群', val: v }));
  selectedScenarios.forEach((v) => allSelectedFilters.push({ dim: '场景', val: v }));
  selectedDemands.forEach((v) => allSelectedFilters.push({ dim: '需求', val: v }));
  selectedConcerns.forEach((v) => allSelectedFilters.push({ dim: '问题', val: v }));
  Object.entries(selectedCategoryDims).forEach(([dimKey, vals]) => {
    vals.forEach((v) => allSelectedFilters.push({ dim: dimKey, val: v }));
  });

  const totalFilterCount = allSelectedFilters.length;

  // 没有选择任何筛选条件：展示所有内容
  if (totalFilterCount === 0) {
    return {
      practice,
      matchLevel: 'general',
      matchScore: 100,
      label: '全部关联',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      matchedTags: [],
      totalFilterCount: 0,
    };
  }

  const pCond = practice.conditions || {};
  const matchedTags: string[] = [];
  let score = 0;

  // 辅助判断是否包含或不限
  const checkDimension = (
    selectedList: string[],
    assetList: string[] | undefined,
    weight = 25
  ) => {
    if (selectedList.length === 0) return true; // 未选该维度，不扣分
    if (!assetList || assetList.length === 0 || assetList.includes('不限') || assetList.includes('未指定')) {
      // 资产标为“不限”，视为兼容但不提供专属高命中分
      score += weight * 0.7;
      return true;
    }
    const hits = selectedList.filter((s) =>
      assetList.some((a) => a.includes(s) || s.includes(a))
    );
    if (hits.length > 0) {
      hits.forEach((h) => matchedTags.push(h));
      score += weight * (hits.length / selectedList.length);
      return true;
    }
    return false;
  };

  const groupHit = checkDimension(selectedTargetGroups, pCond.targetGroups, 30);
  const scenarioHit = checkDimension(selectedScenarios, pCond.scenarios, 30);
  const demandHit = checkDimension(selectedDemands, pCond.demands, 25);
  const concernHit = checkDimension(selectedConcerns, pCond.customerConcerns, 20);

  // 品类专属维度比对
  let catDimTotal = 0;
  let catDimHitCount = 0;
  Object.entries(selectedCategoryDims).forEach(([dimKey, vals]) => {
    if (vals.length > 0) {
      catDimTotal++;
      const pDimVals = pCond.categoryDimensions?.[dimKey] || [];
      if (pDimVals.length === 0 || pDimVals.includes('不限')) {
        score += 20 * 0.7;
        catDimHitCount++;
      } else {
        const hits = vals.filter((v) =>
          pDimVals.some((pVal) => pVal.includes(v) || v.includes(pVal))
        );
        if (hits.length > 0) {
          hits.forEach((h) => matchedTags.push(h));
          score += 25;
          catDimHitCount++;
        }
      }
    }
  });

  const catHit = catDimTotal === 0 || catDimHitCount > 0;

  // 判断是否所有非空的筛选维度都满足
  const isAllDimensionsSatisfied =
    (selectedTargetGroups.length === 0 || groupHit) &&
    (selectedScenarios.length === 0 || scenarioHit) &&
    (selectedDemands.length === 0 || demandHit) &&
    (selectedConcerns.length === 0 || concernHit) &&
    catHit;

  // 高匹配 / 精确匹配
  if (isAllDimensionsSatisfied && matchedTags.length >= Math.min(2, totalFilterCount)) {
    return {
      practice,
      matchLevel: 'exact',
      matchScore: Math.max(score, 85),
      label: '高匹配',
      colorClass: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
      matchedTags: Array.from(new Set(matchedTags)),
      totalFilterCount,
    };
  }

  // 部分匹配：命中部分条件
  if (matchedTags.length > 0) {
    return {
      practice,
      matchLevel: 'partial',
      matchScore: Math.max(score, 50),
      label: '部分匹配',
      colorClass: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
      matchedTags: Array.from(new Set(matchedTags)),
      totalFilterCount,
    };
  }

  // 基础兜底匹配（如金句通用）
  return {
    practice,
    matchLevel: 'none',
    matchScore: 20,
    label: '匹配',
    colorClass: 'bg-gray-100 text-gray-600 border-gray-200',
    matchedTags: [],
    totalFilterCount,
  };
}

/**
 * 格式化展示练习适用条件，若未配置或包含“不限”则显示“不限”
 */
export function formatConditionList(values?: string[]): string {
  if (!values || values.length === 0) return '不限';
  if (values.includes('不限') || values.includes('未指定')) return '不限';
  return values.join('、');
}
