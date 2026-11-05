export type InspectionCategoryId =
  | 'tasks'            // 1. 任务查询
  | 'hq'               // 2. HQ工作情况查询
  | 'region'           // 3. 区域培训情况查询
  | 'mgmt'             // 4. 区域培训师及MT管理查询
  | 'ba'               // 5. BA人员查询
  | 'product'          // 6. 产品培训查询
  | 'alerts'           // 7. 异常预警查询
  | 'sales-analysis';  // 8. 培训与销售分析

export interface InspectionQueryItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  defaultTimeRange?: 'WEEK' | 'LAST_WEEK' | 'MONTH' | 'CUSTOM';
  applicableFilters: ('taskType' | 'hq' | 'region' | 'brand' | 'product' | 'manager' | 'status' | 'searchKeyword')[];
}

export interface InspectionCategory {
  id: InspectionCategoryId;
  title: string;
  subtitle: string;
  iconName: string;
  badgeText: string;
  queryItems: InspectionQueryItem[];
}

export interface CustomFilterField {
  id: string;
  fieldKey: string;
  fieldName: string;
  selectedValue: string;
  options: { label: string; value: string }[];
  isCustomInput?: boolean;
}

export interface InspectionFilterState {
  timeRange: 'WEEK' | 'LAST_WEEK' | 'MONTH' | 'LAST_30_DAYS' | 'CUSTOM';
  customStartDate?: string;
  customEndDate?: string;
  taskType: 'ALL' | 'STUDY' | 'PRACTICE' | 'EXAM';
  hq: 'ALL' | 'HQ_MAKEUP' | 'HQ_SKINCARE' | 'HQ_REGIONAL_SUPPORT';
  region: 'ALL' | 'Jakarta' | 'Surabaya' | 'Bandung' | 'Medan' | 'Bali & Nusra';
  brand: 'ALL' | 'YOU' | 'DM' | 'BNB';
  product: 'ALL' | 'SKIN_TINT' | 'SETTING_SPRAY' | 'CUSHION' | 'LIP_TINT';
  status: 'ALL' | 'COMPLETED' | 'UNCOMPLETED' | 'OVERDUE' | 'FAILED';
  manager: 'ALL' | 'Z_DIRECTOR' | 'L_LEADER' | 'SITI_MT' | 'BUDI_MT';
  searchKeyword?: string;
  customFields?: CustomFilterField[];
}

export interface InspectionTaskRecord {
  id: string;
  title: string;
  category: string;
  type: string;
  scope: string;
  status: 'RUNNING' | 'FINISHED';
  createdAt: string;
  creator: string;
  summary: string;
  resultMetrics?: {
    totalScanned: number;
    completionRate: number;
    abnormalCount: number;
  };
}

export interface InspectionReportResult {
  queryTitle: string;
  categoryTitle: string;
  generatedAt: string;
  summaryText: string;
  keyInsights: string[];
  recommendations: string[];
  kpiCards: {
    label: string;
    value: string;
    unit?: string;
    trend?: string;
    isPositive?: boolean;
    badge?: string;
  }[];
  tableData: {
    columns: { key: string; label: string; align?: 'left' | 'center' | 'right' }[];
    rows: Record<string, any>[];
  };
}
