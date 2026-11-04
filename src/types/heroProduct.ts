export type BrandKey = 'ALL' | 'YOU' | 'BNB' | 'DM' | 'LVJ' | 'GF' | 'FML';

export type RegionKey = 'ALL' | 'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang';

export type MonthKey = '2026-10' | '2026-09' | '2026-08' | '2026-07' | '2026-06';

export type TaskType = 'study' | 'practice' | 'exam';

export interface HeroTask {
  id: string;
  title: string;
  type: TaskType;
  linkedProductIds: string[]; // 重点业务逻辑：支持一个任务关联多个大单品
  publishDate: string;
  deadline: string;
  author: string;
  targetAudience: string;
  // 指标
  metricValue: number; // 学习:完成率(%), 练习:达标率(%), 考试:及格率(%)
  metricLabel: '完成率' | '达标率' | '及格率';
  avgScore?: number; // 针对考试任务的平均分
  totalRequiredParticipants: number;
  actualParticipants: number;
  qualifiedCount: number;
  // 分大区分项指标
  regionalBreakdown: Record<string, {
    required: number;
    actual: number;
    rate: number;
    avgScore?: number;
  }>;
}

export interface HeroBAPerson {
  id: string;
  name: string;
  employeeId: string;
  region: 'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang';
  storeName: string;
  // 参与的产品ID列表
  participatedProductIds: string[];
  // 参与的任务ID列表
  completedTaskIds: string[];
  // 实际分配的任务（分产品映射）
  assignedTaskIdsByProduct: Record<string, string[]>;
  // 实际提交练习次数: Record<productId, count>
  practiceSubmitsByProduct: Record<string, number>;
  // 任务维度的明细表现
  taskProgressDetails: Record<string, {
    // 学习任务
    studyCompleted?: boolean;
    studyMinutes?: number;
    studyCompletedDate?: string;
    // 练习任务
    practiceSubmits?: number;
    practiceBestScore?: number;
    practiceQualified?: boolean;
    // 考试任务
    examParticipated?: boolean;
    examScore?: number;
    examPassed?: boolean;
  }>;
  lastActiveDate: string;
}

export interface HeroProductItem {
  id: string;
  spu: string;
  sku: string;
  name: string;
  brand: 'YOU' | 'BNB' | 'DM' | 'LVJ' | 'GF' | 'FML';
  brandName: string;
  category: 'MAKEUP' | 'SKINCARE' | 'PERSONAL CARE' | 'TOOLS';
  image: string;
  series: string;
  priceIdr: number;
  // 关联的任务ID列表
  taskIds: string[];
  // 各月份实际 SELL OUT 销售量 (自然月)
  monthlySales: Record<MonthKey, {
    sellOutUnits: number;
    // 分大区销量
    byRegion: Record<string, number>;
    isPartialMonth?: boolean; // 是否当期未完全结束月份
  }>;
}

export interface HeroProductFilterState {
  month: MonthKey;
  brand: BrandKey;
  region: RegionKey;
  searchKeyword: string;
}

// 趋势图区间数据类型 (堆叠柱状图 + 折线图)
export interface HeroTrendIntervalData {
  intervalId: string;
  intervalLabel: string;
  dateRange: string;
  studyPersonTimes: number;
  practicePersonTimes: number;
  examPersonTimes: number;
  totalPersonTimes: number;
  sellOutUnits: number;
}
