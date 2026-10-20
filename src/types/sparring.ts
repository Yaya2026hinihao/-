export type SparringAssetType = 'digital_human' | 'scenario_script';

export interface TagDimensionConfig {
  id: string;
  name: string; // 维度名称，如 '顾客人群', '消费场景', '核心需求', '顾客问题', '适用肤质', '头皮类型', '头发状态', '身体肌肤状态'
  assetTarget: 'all' | 'digital_human' | 'scenario_script'; // 适用资产类型
  applicableCategory: 'ALL' | 'MAKEUP' | 'SKINCARE' | 'HAIR' | 'BODY'; // 适用品类
  options: string[]; // 选项列表
  selectionType: 'single' | 'multiple'; // 单选/多选
  isEnabled: boolean; // 启用/停用状态
  order: number; // 显示顺序
  description?: string;
}

export interface DigitalHumanCustomer {
  id: string;
  name: string; // 数字人名称, e.g. "Amitha Bachan Radiance Cream"
  avatar: string;
  fullImage: string;
  language: string; // 语种, e.g. '印尼语', '中文', '英语'
  voiceTone: string; // 音色, e.g. 'Pemimpin Dominan', 'Ramah & Antusias'
  category: string; // 内容分类, e.g. '未分类', '底妆大单品', '洗护个护', '唇部专区'
  description: string; // 角色描述 (会在 App 端展示)
  status: 'enabled' | 'disabled'; // 状态: 启用 / 停用
  visibleRegions: string[]; // 可见地区: ['kantor pusat', 'SEMARANG', 'BANDUNG', ...]
  
  // 核心新增：关联产品 (关联现有产品库)
  productId?: string; // 关联单个产品的 ID (e.g. 'prod-1')
  productIds?: string[]; // 兼容未来多产品扩展
  
  // 核心升级：多维度画像标签 (按维度选择)
  personaTags: {
    targetGroups?: string[];       // 1. 顾客人群 (年轻顾客、熟龄顾客等)
    scenarios?: string[];          // 2. 消费场景 (日常通勤、约会聚会等)
    demands?: string[];            // 3. 核心需求 (控油、保湿、持妆等)
    customerConcerns?: string[];   // 4. 顾客问题/顾虑 (容易脱妆、头皮出油等)
    categoryDimensions?: Record<string, string[]>; // 5. 品类专属维度 (如 肤质, 头皮类型, 头发状态)
    customTags?: string[];         // 兼容历史自由文本标签
  };
  
  prompt: string; // 人格设定 Prompt
  scriptOutline: {
    type: 'custom' | 'from_script';
    scriptId?: string;
    turns: number;
    outlineSummary?: string;
  };
  
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
  avgScore?: number;
}

export interface ProductCombination {
  id: string;
  name: string;
  mainProductId: string;
  crossSellingProductIds: string[];
  description?: string;
  isConfirmed?: boolean;
}

export interface ScriptStep {
  id: string;
  order: number;
  title: string; // 步骤标题, e.g. "Sapa dan gali keluhan kulit"
  goal: string;  // 步骤目标, e.g. "Membangun hubungan baik..."
  hint?: string; // 回答提示 (选填，给 BA 的指引)
}

export interface ScenarioScriptItem {
  id: string;
  title: string; // 剧本名称, e.g. "SUNBRELLA SAKURA NIACINAMDE SUNSCREEN GELSPF 50+ PA++++"
  language: string; // 语种, e.g. '印尼语'
  status: 'enabled' | 'disabled'; // 状态: 启用 / 停用
  voiceTone: string; // 音色
  category: string; // 内容分类, e.g. '护肤', '彩妆', '个护'
  visibleRegions: string[]; // 可见地区
  sceneDescription: string; // 场景介绍
  scenePrompt: string; // 场景提示词
  coverImage?: string; // 场景配图
  
  // 核心新增：关联产品组合 (优先关联产品管理中已经建立的连带销售组合)
  linkedCombination?: {
    combinationId: string;
    combinationName: string;
    mainProductId: string;
    crossSellingProductIds: string[];
  };
  
  // 核心升级：场景标签配置 (全部可选，不设必填限制)
  scenarioTags: {
    scenarios?: string[];        // 1. 适用场景 (日常洗护、促销推荐、日常通勤等)
    demands?: string[];          // 2. 顾客需求 (控油、保湿、修护等)
    targetGroups?: string[];     // 3. 适用人群 (年轻顾客、熟龄顾客等)
    categoryDimensions?: Record<string, string[]>; // 4. 品类相关属性 (肤质、头皮类型等)
    customTags?: string[];       // 兼容历史标签输入
  };
  
  steps: ScriptStep[]; // 剧本步骤与提示节点
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
}
