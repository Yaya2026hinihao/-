export type MatrixBrandKey = 'YOU_MAKEUP' | 'YOU_SKINCARE' | 'BNB' | 'DM' | 'LVJ' | 'FML';

export type BrandKey = 'ALL' | MatrixBrandKey | 'YOU' | 'GF';

export type ParentCityKey = 'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang';

export type RgmRegionKey =
  | 'rgm-1'
  | 'rgm-2'
  | 'rgm-3'
  | 'rgm-4'
  | 'rgm-5'
  | 'rgm-6'
  | 'rgm-7'
  | 'rgm-8'
  | 'rgm-9'
  | 'rgm-10'
  | 'rgm-11'
  | 'rgm-12'
  | 'rgm-13'
  | 'rgm-14';

export type RegionKey = 'ALL' | RgmRegionKey | ParentCityKey;

export type MonthKey = '2026-11' | '2026-10' | '2026-09' | '2026-08' | '2026-07' | '2026-06';

export type HeroPeriodType = 'THIS_MONTH' | 'THIS_WEEK' | 'CUSTOM' | 'MONTH';

export type TaskType = 'study' | 'practice' | 'exam';

export interface HeroRgmRegion {
  rgmId: RgmRegionKey;
  rgmName: string;
  regionName: string;
  parentCity: ParentCityKey;
  shareInParentCity: number;
}

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
  region: ParentCityKey;
  rgmId: RgmRegionKey;
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
  periodType: HeroPeriodType;
  month: MonthKey;
  customStartDate: string;
  customEndDate: string;
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

// 培训周期及前后7天销量对比状态
export type HeroTrainingCycleStatus =
  | 'COMPLETE'               // 周期已结束，且前后7天销量数据完整
  | 'CYCLE_ONGOING'          // 当前培训周期尚未结束
  | 'POST_WINDOW_INCOMPLETE' // 培训已结束，但培训后7天尚未完成
  | 'DATA_INCOMPLETE';       // 前后任一周期销量数据存在缺失

// 单次合并后的自然周培训周期及前后7天销量对比结果
export interface HeroTrainingCycleComparison {
  cycleId: string;
  startDate: string;           // YYYY-MM-DD (自然周周一)
  endDate: string;             // YYYY-MM-DD (自然周周日)
  weekCount: number;           // 连续自然周数量
  preStartDate: string;        // 培训前7天开始日
  preEndDate: string;          // 培训前7天结束日
  postStartDate: string;       // 培训后7天开始日
  postEndDate: string;         // 培训后7天结束日
  taskIds: string[];           // 合并进该周期的关联任务ID
  status: HeroTrainingCycleStatus;
  isLongTermContinuous: boolean;     // 连续3周及以上标记「长期连续培训」
  hasRetrainingInterference: boolean; // 培训后7天内出现新培训活动标记「存在再次培训干扰」
  preSales: number | null;     // 前7天完整销量 (不完整则为 null，不作 0)
  postSales: number | null;    // 后7天完整销量 (不完整则为 null，不作 0)
  changeRate: number | null;   // 销量变化率 (%)
}

// ================= 全国区域培训与销售表现矩阵类型 =================

export type HeatmapTier = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'WEAK' | 'NONE';

export type MetricChangeDirection = 'UP' | 'DOWN' | 'FLAT' | 'NONE';

export interface RegionalMetricCellValue {
  value: number | null;      // 数值（缺失则为 null，不作 0）
  rank: number | null;       // 同品牌下在14个RGM中的独立排名 (#1, #2...)
  delta: number | null;      // 覆盖率/完成率为百分点(pp)，人均销量为相对百分比(%)
  direction: MetricChangeDirection;
  tier: HeatmapTier;
}

export interface RegionalBrandMatrixCell {
  rgmId: RgmRegionKey;
  brandKey: MatrixBrandKey;
  hasData: boolean;
  coverage: RegionalMetricCellValue;
  completion: RegionalMetricCellValue;
  perCapitaSales: RegionalMetricCellValue;
}

export type HeroOrgRole = 'HQ' | 'RGM' | 'MT' | 'RT';

export type HeroDrillLevel = 'NATIONAL' | 'RGM' | 'MT' | 'RT';

export interface HeroMtNode {
  mtId: string;
  mtName: string;
  titleLabel: string;
  rgmId: RgmRegionKey;
  hasRtChildren: boolean;
}

export interface HeroRtNode {
  rtId: string;
  rtName: string;
  titleLabel: string;
  mtId: string;
  rgmId: RgmRegionKey;
}

export interface RegionalMatrixBASummary {
  totalBAs: number | null;
  participatedBAs: number | null;
  unparticipatedBAs: number | null;
}

export interface RegionalMatrixBreadcrumbItem {
  level: HeroDrillLevel;
  id: string;
  label: string;
  clickable: boolean;
}

export interface RegionalMatrixQueryContext {
  role: HeroOrgRole;
  level: HeroDrillLevel;
  selectedRgmId?: RgmRegionKey;
  selectedMtId?: string;
  ownedRgmId: RgmRegionKey;
  ownedMtId: string;
  ownedRtId: string;
}

export interface RegionalBrandMatrixColumn {
  brandKey: MatrixBrandKey;
  brandLabel: string;
  nationalPerCapitaSales: number | null;
  nationalPerCapitaSalesDelta: number | null;
  nationalPerCapitaSalesDirection: MetricChangeDirection;
  nationalSellOutUnits: number | null;
  nationalEffectiveBACount: number;
}

export interface RegionalBrandMatrixRow {
  nodeId: string;
  nodeName: string;
  nodeSubLabel?: string;
  nodeLevel: 'RGM' | 'MT' | 'RT';
  canDrillDown: boolean;
  isOwnOrg?: boolean;
  rgm?: HeroRgmRegion;
  mt?: HeroMtNode;
  rt?: HeroRtNode;
  effectiveBACount: number;
  baSummary?: RegionalMatrixBASummary;
  cells: Record<MatrixBrandKey, RegionalBrandMatrixCell>;
}

export interface RegionalBrandMatrixResponse {
  updatedAt: string;
  currentStartDate: string;
  currentEndDate: string;
  previousStartDate: string;
  previousEndDate: string;
  role: HeroOrgRole;
  level: HeroDrillLevel;
  currentOrgName: string;
  childCount: number;
  childUnitLabel: string;
  isEmptyState: boolean;
  emptyMessage?: string;
  breadcrumbs: RegionalMatrixBreadcrumbItem[];
  baSummary?: RegionalMatrixBASummary;
  columns: RegionalBrandMatrixColumn[];
  rows: RegionalBrandMatrixRow[];
}


