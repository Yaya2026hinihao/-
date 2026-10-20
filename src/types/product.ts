export type RoleType = 
  | '大单品'
  | '主推品'
  | '重点品'
  | '激励品'
  | '连带品'
  | string;

export interface RoleConfig {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  isCustom?: boolean;
}

// 品类专属维度配置项
export interface CategoryDimensionConfig {
  key: string;        // 字段标识，如 skinTypes, scalpTypes, hairStatus, bodyStatus
  label: string;      // 显示名称，如 '肤质', '头皮类型', '头发状态', '身体肌肤状态'
  options: string[];  // 推荐选项列表
}

// 场景化训练条件（适用人群与场景）
export interface TrainingConditions {
  targetGroups: string[];                  // 1. 人群（年轻顾客、熟龄顾客、新手顾客、男性/女性顾客等）
  scenarios: string[];                     // 2. 使用/销售场景（日常、通勤、约会、婚礼、聚会等）
  demands: string[];                       // 3. 顾客需求（控油、保湿、持妆、遮瑕、提亮、修护等）
  customerConcerns?: string[];             // 4. 顾客问题（不知道怎么选、担心脱妆、担心卡粉、头皮易出油等）
  categoryDimensions?: Record<string, string[]>; // 5. 品类专属维度值（如 { '肤质': ['油皮', '混油皮'] }）
  
  // 保持历史兼容字段
  skinTypes?: string[];
}

// 别名保留 UserPersona，向下兼容系统原引用
export type UserPersona = TrainingConditions;

export interface CrossSellingItem {
  productId: string;
  productName: string;
  brand: string;
  sku: string;
  image: string;
  role: '连带品' | '主推品' | string;
  recommendReason: string;
  recommendedPitch: string;
  associatedPracticeScene?: string;
}

export interface TrainingAssetStudy {
  id: string;
  title: string;
  type: '课件' | '产品图文' | '视频课程';
  author: string;
  authorRole: '总部培训师' | 'Jakarta培训师' | 'Bandung培训师' | 'Surabaya培训师';
  targetAudience: string;
  usageCount: number;
  durationMinutes: number;
  lastUsedDate: string;
  passRate: number;
}

// 练习内容适用条件（支持“不限/未指定”）
export interface PracticeConditionSetting {
  targetGroups?: string[];                  // 适用人群（空或含'不限'为不限）
  scenarios?: string[];                     // 适用场景
  demands?: string[];                       // 适用需求
  customerConcerns?: string[];              // 适用顾客问题
  categoryDimensions?: Record<string, string[]>; // 品类专属维度值（如 { '肤质': ['油皮'] }）
}

export interface TrainingAssetPractice {
  id: string;
  title: string;
  type: '数字人' | '场景对话' | '金句';
  author: string;
  authorRole: '总部培训师' | 'Jakarta培训师' | 'Bandung培训师' | 'Surabaya培训师';
  targetAudience: string;
  usageCount: number;
  dialogueTurns?: number;
  avgPassRate: number;
  lastUsedDate: string;
  
  // 核心：练习内容关联的场景化训练条件（可选、支持不限）
  conditions?: PracticeConditionSetting;
  priorityLevel?: 1 | 2 | 3;
  sourceNote?: string;
}

export interface TrainingAssetExam {
  id: string;
  title: string;
  author: string;
  authorRole: '总部培训师' | 'Jakarta培训师' | 'Bandung培训师' | 'Surabaya培训师';
  targetAudience: string;
  usageCount: number;
  averageScore: number;
  passingScore: number;
  totalParticipants: number;
  lastUsedDate: string;
}

export interface Product {
  id: string;
  spu: string;
  sku: string;
  name: string;
  brand: 'YOU' | 'BNB' | 'DM' | 'LVJ' | 'GF' | 'FML';
  series: string;
  category: 'MAKEUP' | 'SKINCARE' | 'TOOLS' | 'PERSONAL CARE';
  subCategory: 'FACE' | 'LIPS' | 'EYES' | 'HAIR' | 'BODY';
  image: string;
  status: '在售' | '新品预热' | '当期主推' | '下架停售';
  stock: number;
  roles: RoleType[];
  isFocus: boolean; // ⭐ 重点产品快捷标记
  
  // 核心内容
  sellingPoints: string[];
  description: string;
  goldenSentences: string[];
  
  // 用户画像
  persona: UserPersona;
  
  // 连带销售
  crossSelling: CrossSellingItem[];
  
  // 培训数据概览
  studyCount: number;      // 0 if none
  practiceCount: number;   // 0 if none
  examAvgScore: number | null; // null if none
  
  // 关联任务资产
  studyAssets: TrainingAssetStudy[];
  practiceAssets: TrainingAssetPractice[];
  examAssets: TrainingAssetExam[];
  
  // 区域培训表现（用于AI推荐）
  regionalStats?: {
    region: string;
    avgExamScore: number;
    completionRate: number;
    salesVolume: number;
    salesGrowth: string;
  }[];
}

export interface AIRecommendation {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  brand: string;
  scenarioType: '新品培训' | '当期大单品' | '区域薄弱产品' | '销售转化提升' | '连带组合销售';
  title: string;
  reason: string;
  targetRegion: string;
  urgency: '高' | '中' | '一般';
  suggestedAssets: {
    studyIds: string[];
    practiceIds: string[];
    examIds: string[];
  };
  highlightMessage: string;
}
