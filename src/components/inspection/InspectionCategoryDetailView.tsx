import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  Filter,
  Search,
  Download,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  Layers,
  FileText,
  ListOrdered,
  HelpCircle,
  RefreshCw,
  BellRing,
  Plus,
  X,
  SlidersHorizontal
} from 'lucide-react';
import {
  InspectionCategory,
  InspectionQueryItem,
  InspectionFilterState,
  CustomFilterField
} from '../../types/inspection';
import { generateInspectionReport } from '../../data/mockInspectionData';

interface InspectionCategoryDetailViewProps {
  category: InspectionCategory;
  onBack: () => void;
  onShowToast: (msg: string) => void;
  initialHasQueried?: boolean;
}

export const InspectionCategoryDetailView: React.FC<InspectionCategoryDetailViewProps> = ({
  category,
  onBack,
  onShowToast,
  initialHasQueried = false
}) => {
  // 当前选中的具体查询项目（默认选中第一个）
  const [selectedItemId, setSelectedItemId] = useState<string>(category.queryItems[0]?.id || '');

  // 是否已点击执行查询生成数据（默认不预载数据，选完配置点击查询后才生成）
  const [hasQueried, setHasQueried] = useState<boolean>(initialHasQueried);
  // 条件变更标记
  const [isConditionsChanged, setIsConditionsChanged] = useState<boolean>(false);

  // 动态筛选条件状态
  const [filters, setFilters] = useState<InspectionFilterState>({
    timeRange: 'WEEK',
    taskType: 'ALL',
    hq: 'ALL',
    region: 'ALL',
    brand: 'ALL',
    product: 'ALL',
    status: 'ALL',
    manager: 'ALL',
    searchKeyword: ''
  });

  // 时间周期显示文案
  const getTimeRangeLabel = (key: string) => {
    switch (key) {
      case 'WEEK': return '本周';
      case 'LAST_WEEK': return '上周';
      case 'MONTH': return '本月';
      case 'LAST_30_DAYS': return '近30天';
      case 'CUSTOM':
        return filters.customStartDate && filters.customEndDate
          ? `${filters.customStartDate} 至 ${filters.customEndDate}`
          : '自定义日期';
      default: return key;
    }
  };

  // 是否打开添加字段下拉菜单
  const [isAddFieldDropdownOpen, setIsAddFieldDropdownOpen] = useState(false);
  // 是否打开自定义输入字段弹窗
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customFieldNameInput, setCustomFieldNameInput] = useState('');

  // 可选择添加的业务筛选字段模板
  const AVAILABLE_CUSTOM_FIELDS = [
    {
      fieldKey: 'storeType',
      fieldName: '门店/专柜类型',
      options: [
        { label: '全部专柜', value: 'ALL' },
        { label: 'A类百货核心', value: 'A_MALL' },
        { label: '购物中心专柜', value: 'SHOPPING_CENTER' },
        { label: '品牌旗舰店', value: 'FLAGSHIP' },
        { label: '线上直播间', value: 'ONLINE_LIVE' }
      ]
    },
    {
      fieldKey: 'passThreshold',
      fieldName: '考核达标要求',
      options: [
        { label: '全部标准', value: 'ALL' },
        { label: '优秀 (≥90分)', value: 'EXCELLENT' },
        { label: '标准达标 (≥80分)', value: 'STANDARD' },
        { label: '及格通过 (≥75分)', value: 'PASS' },
        { label: '重点警戒 (<70分)', value: 'WARNING' }
      ]
    },
    {
      fieldKey: 'baSeniority',
      fieldName: 'BA工龄/段位',
      options: [
        { label: '全部BA', value: 'ALL' },
        { label: '初阶新BA (<3个月)', value: 'JUNIOR' },
        { label: '成长中坚 (3-12个月)', value: 'MID' },
        { label: '资深核心 (1年以上)', value: 'SENIOR' }
      ]
    },
    {
      fieldKey: 'trainingMode',
      fieldName: '培训开展形式',
      options: [
        { label: '全部模式', value: 'ALL' },
        { label: '线上自主微课', value: 'ONLINE_COURSE' },
        { label: 'AI数字人场景实操', value: 'AI_SPARRING' },
        { label: '线下MT驻店带教', value: 'MT_COACHING' },
        { label: '集中统一模拟考', value: 'FORMAL_EXAM' }
      ]
    },
    {
      fieldKey: 'riskLevel',
      fieldName: '数据预警级别',
      options: [
        { label: '全部关注度', value: 'ALL' },
        { label: '高危预警 (连续未达标)', value: 'HIGH' },
        { label: '逾期滞后 (未完课)', value: 'OVERDUE' },
        { label: '正常推进', value: 'NORMAL' }
      ]
    }
  ];

  // 添加自定义筛选字段
  const handleAddCustomField = (template: typeof AVAILABLE_CUSTOM_FIELDS[0]) => {
    const newField: CustomFilterField = {
      id: `cf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fieldKey: template.fieldKey,
      fieldName: template.fieldName,
      selectedValue: 'ALL',
      options: template.options
    };
    handleUpdateFilter(f => ({
      ...f,
      customFields: [...(f.customFields || []), newField]
    }));
    setIsAddFieldDropdownOpen(false);
    onShowToast(`已添加筛选字段【${template.fieldName}】`);
  };

  // 添加用户自定义命名的字段
  const handleAddCustomInputField = () => {
    if (!customFieldNameInput.trim()) return;
    const name = customFieldNameInput.trim();
    const newField: CustomFilterField = {
      id: `cf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fieldKey: `custom-${Date.now()}`,
      fieldName: name,
      selectedValue: '',
      options: [],
      isCustomInput: true
    };
    handleUpdateFilter(f => ({
      ...f,
      customFields: [...(f.customFields || []), newField]
    }));
    setCustomFieldNameInput('');
    setIsCustomModalOpen(false);
    onShowToast(`已添加自定义字段【${name}】`);
  };

  // 移除自定义筛选字段
  const handleRemoveCustomField = (fieldId: string) => {
    handleUpdateFilter(f => ({
      ...f,
      customFields: (f.customFields || []).filter(c => c.id !== fieldId)
    }));
    onShowToast('已移除该筛选字段');
  };

  // 更新筛选条件并标记条件已变动
  const handleUpdateFilter = (updater: (prev: InspectionFilterState) => InspectionFilterState) => {
    setFilters(updater);
    if (hasQueried) {
      setIsConditionsChanged(true);
    }
  };

  // 表格内部搜索
  const [tableSearch, setTableSearch] = useState('');

  // 模拟正在执行 AI 查询的状态
  const [isLoading, setIsLoading] = useState(false);

  // 追问 AI 对话记录
  const [followUpQuestions, setFollowUpQuestions] = useState<Array<{ q: string; a: string }>>([]);
  const [currentInputQuestion, setCurrentInputQuestion] = useState('');

  // 当前选中的查询项对象
  const activeQueryItem = useMemo(() => {
    return category.queryItems.find(i => i.id === selectedItemId) || category.queryItems[0];
  }, [category, selectedItemId]);

  // 根据当前项及筛选动态生成专业巡检分析报告
  const report = useMemo(() => {
    return generateInspectionReport(category, activeQueryItem, filters);
  }, [category, activeQueryItem, filters]);

  // 表格搜索过滤后的行数据
  const filteredTableRows = useMemo(() => {
    if (!tableSearch.trim()) return report.tableData.rows;
    const q = tableSearch.toLowerCase().trim();
    return report.tableData.rows.filter(row => {
      return Object.values(row).some(val =>
        String(val).toLowerCase().includes(q)
      );
    });
  }, [report, tableSearch]);

  const handleExecuteQuery = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasQueried(true);
      setIsConditionsChanged(false);
      onShowToast(`已完成【${activeQueryItem.title}】的最新数据扫描与交叉核验！`);
    }, 450);
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInputQuestion.trim()) return;
    const q = currentInputQuestion.trim();
    setCurrentInputQuestion('');

    let aiAnswer = `已针对您的追问【${q}】进行专项穿透核验：结合当前${activeQueryItem.title}指标，发现其主要影响因素集中在两点：1）各门店早晚排班作息差异；2）部分新上架底妆产品知识点密集。系统已自动生成 1 份针对性督导话术，可直接下发至对应 MT 企微。`;
    if (q.includes('Surabaya') || q.includes('苏水')) {
      aiAnswer = 'Surabaya 大区本次共扫描 88 位 BA。其中 12 位主要因 Galaxy Mall 与 Tunjungan Plaza 专柜周末大促销排班紧凑，未及时完成练习。已通知 MT Budi 发起补测，预计周五前及格率可回升至 92% 以上。';
    } else if (q.includes('导出') || q.includes('Excel') || q.includes('名单')) {
      aiAnswer = '已自动为您打包生成《' + activeQueryItem.title + '_明细名单.xlsx》，包含人员工号、手机号、专柜名称、失分项与对应主管。点击下方操作栏即可直接下载。';
    }

    setFollowUpQuestions(prev => [...prev, { q, a: aiAnswer }]);
  };

  // 图标选择
  const getQueryItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'ListOrdered':
        return <ListOrdered className="w-4 h-4" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4" />;
      case 'Layers':
        return <Layers className="w-4 h-4" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'FileText':
        return <FileText className="w-4 h-4" />;
      case 'UserX':
        return <UserX className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 顶部面包屑与导航返回 */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#9E4A2B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回功能中心</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9CA3AF]">基础功能菜单</span>
          <span className="text-xs bg-[#FAF3F0] text-[#9E4A2B] px-2.5 py-0.5 rounded-full font-semibold border border-[#F3D5CA]">
            {category.title}
          </span>
        </div>
      </div>

      {/* 主标题区 */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
          {category.title}
        </h2>
        <p className="text-xs text-[#6B7280] mt-1">
          {category.subtitle}
        </p>
      </div>

      {/* 卡片 1: 选择查询内容 (严格匹配原型截图五设计) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E6E1] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9E4A2B]" />
            <span>选择查询内容</span>
          </h3>
          <span className="text-xs text-[#9CA3AF]">
            点击选择具体查询项，并在下方配置条件后执行查询
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {category.queryItems.map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (selectedItemId !== item.id) {
                    setSelectedItemId(item.id);
                    setHasQueried(false);
                    setIsConditionsChanged(true);
                  }
                }}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF3F0] border-[#9E4A2B] ring-1 ring-[#9E4A2B] text-[#9E4A2B] shadow-xs'
                    : 'bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] border-[#E8E6E1] text-[#374151]'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  isSelected ? 'bg-white text-[#9E4A2B] shadow-xs' : 'bg-white text-[#6B7280] border border-[#E5E1D8]'
                }`}>
                  {getQueryItemIcon(item.iconName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold truncate ${
                    isSelected ? 'text-[#9E4A2B]' : 'text-[#111827]'
                  }`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#6B7280] line-clamp-1 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 卡片 2: 查询条件 (动态条件面板，严格匹配原型截图五设计) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E6E1] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#9E4A2B]" />
            <span>查询条件配置</span>
          </h3>

          <div className="flex items-center gap-2">
            {/* 添加筛选字段下拉菜单 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAddFieldDropdownOpen(v => !v)}
                className="text-xs bg-[#FAF3F0] hover:bg-[#F5EBE6] text-[#9E4A2B] px-2.5 py-1 rounded-lg border border-[#F3D5CA] font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加筛选字段</span>
              </button>

              {isAddFieldDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-[#E8E6E1] p-2 z-30 space-y-1">
                  <div className="text-[11px] font-semibold text-[#9CA3AF] px-2 py-1 flex items-center justify-between">
                    <span>选择可添加的筛选维度</span>
                    <button
                      type="button"
                      onClick={() => setIsAddFieldDropdownOpen(false)}
                      className="text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {AVAILABLE_CUSTOM_FIELDS.map(field => {
                    const isAlreadyAdded = filters.customFields?.some(cf => cf.fieldKey === field.fieldKey);
                    return (
                      <button
                        key={field.fieldKey}
                        type="button"
                        disabled={isAlreadyAdded}
                        onClick={() => handleAddCustomField(field)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isAlreadyAdded
                            ? 'text-[#9CA3AF] bg-[#F9FAFB] cursor-not-allowed'
                            : 'text-[#374151] hover:bg-[#FAF8F5] hover:text-[#9E4A2B] cursor-pointer'
                        }`}
                      >
                        <span>{field.fieldName}</span>
                        {isAlreadyAdded ? (
                          <span className="text-[10px] text-[#9CA3AF]">已添加</span>
                        ) : (
                          <Plus className="w-3 h-3 text-[#9E4A2B]" />
                        )}
                      </button>
                    );
                  })}
                  <div className="border-t border-[#F0ECE3] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomModalOpen(true);
                        setIsAddFieldDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#9E4A2B] hover:bg-[#FAF3F0] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>自定义其他业务字段...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setFilters({
                  timeRange: 'WEEK',
                  taskType: 'ALL',
                  hq: 'ALL',
                  region: 'ALL',
                  brand: 'ALL',
                  product: 'ALL',
                  status: 'ALL',
                  manager: 'ALL',
                  searchKeyword: '',
                  customFields: []
                });
                if (hasQueried) setIsConditionsChanged(true);
                onShowToast('已重置全部查询条件');
              }}
              className="text-xs text-[#6B7280] hover:text-[#9E4A2B] flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg hover:bg-[#FAF8F5]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>重置条件</span>
            </button>
          </div>
        </div>

        {/* 动态条件矩阵 */}
        <div className="space-y-3.5 text-xs">
          {/* 1. 时间范围 */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="w-20 text-[#6B7280] shrink-0 font-medium">时间范围:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'WEEK', label: '本周' },
                  { key: 'LAST_WEEK', label: '上周' },
                  { key: 'MONTH', label: '本月' },
                  { key: 'LAST_30_DAYS', label: '近30天' },
                  { key: 'CUSTOM', label: '自定义日期' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      if (opt.key === 'CUSTOM') {
                        handleUpdateFilter(f => ({
                          ...f,
                          timeRange: 'CUSTOM',
                          customStartDate: f.customStartDate || '2026-10-01',
                          customEndDate: f.customEndDate || '2026-10-31'
                        }));
                      } else {
                        handleUpdateFilter(f => ({ ...f, timeRange: opt.key as any }));
                      }
                    }}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filters.timeRange === opt.key
                        ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#4B5563] hover:text-[#111827] border border-[#E5E1D8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义日期选择器 (点击自定义日期后展开) */}
            {filters.timeRange === 'CUSTOM' && (
              <div className="flex flex-wrap items-center gap-2.5 ml-0 sm:ml-24 p-2 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8] text-xs">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9E4A2B]" />
                  <span className="text-[#6B7280] text-[11px] font-medium">开始日期:</span>
                  <input
                    type="date"
                    value={filters.customStartDate || '2026-10-01'}
                    onChange={(e) => handleUpdateFilter(f => ({ ...f, customStartDate: e.target.value }))}
                    className="bg-white border border-[#D6D0C4] rounded-md px-2 py-0.5 text-xs text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B]"
                  />
                </div>
                <span className="text-[#9CA3AF] text-xs">至</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#6B7280] text-[11px] font-medium">结束日期:</span>
                  <input
                    type="date"
                    value={filters.customEndDate || '2026-10-31'}
                    onChange={(e) => handleUpdateFilter(f => ({ ...f, customEndDate: e.target.value }))}
                    className="bg-white border border-[#D6D0C4] rounded-md px-2 py-0.5 text-xs text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B]"
                  />
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    type="button"
                    onClick={() => handleUpdateFilter(f => ({ ...f, customStartDate: '2026-10-25', customEndDate: '2026-10-31' }))}
                    className="px-2 py-0.5 text-[11px] bg-white hover:bg-[#F3EFEA] text-[#4B5563] hover:text-[#9E4A2B] rounded border border-[#E5E1D8] transition-colors cursor-pointer"
                  >
                    近7天
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateFilter(f => ({ ...f, customStartDate: '2026-10-01', customEndDate: '2026-10-31' }))}
                    className="px-2 py-0.5 text-[11px] bg-white hover:bg-[#F3EFEA] text-[#4B5563] hover:text-[#9E4A2B] rounded border border-[#E5E1D8] transition-colors cursor-pointer"
                  >
                    本月累计
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. 任务类型 (如适用) */}
          {activeQueryItem.applicableFilters.includes('taskType') && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <span className="w-20 text-[#6B7280] shrink-0 font-medium">任务类型:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'ALL', label: '全部' },
                  { key: 'STUDY', label: '学习任务' },
                  { key: 'PRACTICE', label: '练习任务' },
                  { key: 'EXAM', label: '考试任务' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleUpdateFilter(f => ({ ...f, taskType: opt.key as any }))}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filters.taskType === opt.key
                        ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#4B5563] hover:text-[#111827] border border-[#E5E1D8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. 发布人 / HQ (如适用) */}
          {activeQueryItem.applicableFilters.includes('hq') && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <span className="w-20 text-[#6B7280] shrink-0 font-medium">发布人 / HQ:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'ALL', label: '全部 HQ' },
                  { key: 'HQ_MAKEUP', label: '彩妆HQ (YOU & DM)' },
                  { key: 'HQ_SKINCARE', label: '护肤HQ (BNB)' },
                  { key: 'HQ_REGIONAL_SUPPORT', label: '区域支持HQ' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleUpdateFilter(f => ({ ...f, hq: opt.key as any }))}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filters.hq === opt.key
                        ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#4B5563] hover:text-[#111827] border border-[#E5E1D8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. 所属大区 (如适用) */}
          {activeQueryItem.applicableFilters.includes('region') && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <span className="w-20 text-[#6B7280] shrink-0 font-medium">所属大区:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'ALL', label: '全部大区' },
                  { key: 'Jakarta', label: 'Jakarta (雅加达)' },
                  { key: 'Surabaya', label: 'Surabaya (泗水)' },
                  { key: 'Bandung', label: 'Bandung (万隆)' },
                  { key: 'Medan', label: 'Medan (棉兰)' },
                  { key: 'Bali & Nusra', label: 'Bali & Nusra (巴厘)' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleUpdateFilter(f => ({ ...f, region: opt.key as any }))}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filters.region === opt.key
                        ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#4B5563] hover:text-[#111827] border border-[#E5E1D8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. 重点产品 / 品牌 (如适用) */}
          {activeQueryItem.applicableFilters.includes('brand') && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <span className="w-20 text-[#6B7280] shrink-0 font-medium">所属品牌:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'ALL', label: '全品牌' },
                  { key: 'YOU', label: 'Y.O.U Beauty' },
                  { key: 'DM', label: 'DAZZLE ME' },
                  { key: 'BNB', label: 'barenbliss' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleUpdateFilter(f => ({ ...f, brand: opt.key as any }))}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filters.brand === opt.key
                        ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#4B5563] hover:text-[#111827] border border-[#E5E1D8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. 重点产品 (如适用) */}
          {activeQueryItem.applicableFilters.includes('product') && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <span className="w-20 text-[#6B7280] shrink-0 font-medium">重点产品:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'ALL', label: '全部产品' },
                  { key: 'SKIN_TINT', label: '裸感水润修颜精粹粉底' },
                  { key: 'SETTING_SPRAY', label: '持久柔焦定妆喷雾' },
                  { key: 'CUSHION', label: '奢养无瑕气垫霜' },
                  { key: 'LIP_TINT', label: '水光持色唇釉' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleUpdateFilter(f => ({ ...f, product: opt.key as any }))}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filters.product === opt.key
                        ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#4B5563] hover:text-[#111827] border border-[#E5E1D8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 7. 考核状态/预警 (如适用) */}
          {activeQueryItem.applicableFilters.includes('status') && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <span className="w-20 text-[#6B7280] shrink-0 font-medium">状态/预警:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'ALL', label: '全部状态' },
                  { key: 'COMPLETED', label: '已完成/已达标' },
                  { key: 'UNCOMPLETED', label: '未完成/未达标' },
                  { key: 'OVERDUE', label: '逾期滞后' },
                  { key: 'FAILED', label: '考试不及格/需补测' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleUpdateFilter(f => ({ ...f, status: opt.key as any }))}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filters.status === opt.key
                        ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#4B5563] hover:text-[#111827] border border-[#E5E1D8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 8. 管理人/MT (如适用) */}
          {activeQueryItem.applicableFilters.includes('manager') && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <span className="w-20 text-[#6B7280] shrink-0 font-medium">负责管理:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'ALL', label: '全部人员' },
                  { key: 'SITI_MT', label: 'Siti Rahayu (雅加达MT)' },
                  { key: 'BUDI_MT', label: 'Budi Santoso (泗水MT)' },
                  { key: 'L_LEADER', label: 'Rina Wijaya (培训主管)' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleUpdateFilter(f => ({ ...f, manager: opt.key as any }))}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filters.manager === opt.key
                        ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#4B5563] hover:text-[#111827] border border-[#E5E1D8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 9. 自定义扩展筛选字段 */}
          {filters.customFields && filters.customFields.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#F0ECE3]">
              <div className="text-[11px] font-semibold text-[#6B7280] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#9E4A2B]" />
                <span>自定义扩展筛选维度 ({filters.customFields.length})：</span>
              </div>
              {filters.customFields.map((cf) => (
                <div key={cf.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-[#FAF9F7] p-2.5 rounded-xl border border-[#EFECE5]">
                  <span className="w-20 text-[#6B7280] shrink-0 font-medium truncate">
                    {cf.fieldName}:
                  </span>

                  {cf.isCustomInput ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        placeholder="请输入自定义匹配值（如班次早/晚、指定批次号等）"
                        value={cf.selectedValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateFilter(f => ({
                            ...f,
                            customFields: f.customFields?.map(c => c.id === cf.id ? { ...c, selectedValue: val } : c)
                          }));
                        }}
                        className="px-3 py-1 text-xs bg-white border border-[#D6D0C4] rounded-lg text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B] max-w-sm flex-1"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-wrap flex-1">
                      {cf.options.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            handleUpdateFilter(f => ({
                              ...f,
                              customFields: f.customFields?.map(c => c.id === cf.id ? { ...c, selectedValue: opt.value } : c)
                            }));
                          }}
                          className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                            cf.selectedValue === opt.value
                              ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                              : 'bg-white text-[#4B5563] hover:text-[#111827] border border-[#E5E1D8]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(cf.id)}
                    className="p-1 text-[#9CA3AF] hover:text-[#DC2626] rounded transition-colors cursor-pointer shrink-0 ml-auto hover:bg-[#FEE2E2]"
                    title="移除该自定义筛选字段"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 提交执行按钮 (全局保留唯一定位操作按钮) */}
        <div className="pt-3 border-t border-[#F0ECE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280]">
              已选定【<strong className="text-[#9E4A2B]">{activeQueryItem.title}</strong>】，确认上方条件后点击执行
            </span>
            {hasQueried && isConditionsChanged && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#FDE68A] animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                <span>条件已变动，请点击重新查询</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleExecuteQuery}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#9E4A2B] hover:bg-[#833D23] disabled:opacity-60 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'AI 正在调取并核算数据...' : '立即执行智能巡检查询'}</span>
          </button>
        </div>
      </div>

      {/* 结果呈现区域：加载中 / 就绪待查询简单单行说明 / 正式核算报表 */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 border border-[#E8E6E1] shadow-xs text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#F3D5CA] border-t-[#9E4A2B] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#111827]">
            AI 巡检引擎正在多维检索与交叉比对中...
          </p>
          <p className="text-xs text-[#6B7280]">
            正在调取【{activeQueryItem.title}】在 {filters.region === 'ALL' ? '全国各区域' : filters.region} 的明细，聚合生成核心指标与诊断建议
          </p>
        </div>
      ) : !hasQueried ? (
        <div className="bg-white rounded-2xl py-12 px-6 border border-[#E8E6E1] text-center shadow-xs">
          <p className="text-sm text-[#6B7280]">
            请在上方确认查询内容与筛选条件，点击「立即执行智能巡检查询」生成数据报表。
          </p>
        </div>
      ) : (
        /* 卡片 3: 查询结果：AI 自动生成统计、明细及分析 (严格匹配图五需求) */
        <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0ECE3] gap-2">
          <div>
            <div className="text-xs text-[#9E4A2B] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>查询结果 · AI 自动生成统计、明细及分析</span>
            </div>
            <h3 className="text-base font-bold text-[#111827] mt-0.5">
              {activeQueryItem.title} 巡检核算报表
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9CA3AF] font-mono">
              {report.generatedAt}
            </span>
            <button
              onClick={() => onShowToast(`已成功导出《${activeQueryItem.title}_巡检报表.xlsx》！`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-[#FAF8F5] hover:bg-white text-xs font-medium text-[#374151] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>导出 Excel</span>
            </button>
          </div>
        </div>

        {/* 4 个核心 KPI 数据卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {report.kpiCards.map((card, idx) => (
            <div key={idx} className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>{card.label}</span>
                {card.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    card.badge === '预警' || card.badge === '重点催办' || card.badge === '需面谈'
                      ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                      : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                  }`}>
                    {card.badge}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold font-mono text-[#111827] tabular-nums">
                  {card.value}
                </span>
                {card.unit && <span className="text-xs text-[#6B7280]">{card.unit}</span>}
              </div>
              {card.trend && (
                <div className={`text-[11px] font-medium mt-1 ${
                  card.isPositive ? 'text-[#059669]' : 'text-[#EA580C]'
                }`}>
                  {card.trend}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI 智能洞察与管理诊断 Callout */}
        <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E8E6E1] space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9E4A2B] animate-pulse" />
            <h4 className="text-xs font-bold text-[#111827]">
              AI 智能深度洞察与治理建议
            </h4>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            {report.summaryText}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-white p-3 rounded-lg border border-[#EFECE5] space-y-1.5">
              <div className="font-bold text-[#111827] flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                <span>关键业务发现 (Key Insights)</span>
              </div>
              <ul className="space-y-1 text-[#4B5563] list-disc list-inside text-[11px] leading-relaxed">
                {report.keyInsights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#EFECE5] space-y-1.5">
              <div className="font-bold text-[#059669] flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>建议行动举措 (Recommendations)</span>
              </div>
              <ul className="space-y-1 text-[#4B5563] list-disc list-inside text-[11px] leading-relaxed">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 数据明细综合表格 */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#9E4A2B]" />
              <span>穿透式明细清单</span>
              <span className="text-xs font-normal text-[#6B7280]">
                (共 {filteredTableRows.length} 条有效记录)
              </span>
            </h4>

            {/* 表格即时搜索 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索任意关键词或名称..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="pl-8 pr-3 py-1 bg-[#FAF8F5] border border-[#D6D0C4] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B] w-56"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E8E6E1]">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-[#FAF8F5] text-[#6B7280] border-b border-[#E8E6E1]">
                <tr>
                  {report.tableData.columns.map((col, idx) => (
                    <th
                      key={col.key}
                      className={`py-3 px-3.5 font-semibold ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="py-3 px-3.5 text-right font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
                {filteredTableRows.length === 0 ? (
                  <tr>
                    <td colSpan={report.tableData.columns.length + 1} className="py-8 text-center text-xs text-[#9CA3AF]">
                      未检索到匹配的记录
                    </td>
                  </tr>
                ) : (
                  filteredTableRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#FAF9F6] transition-colors">
                      {report.tableData.columns.map((col) => {
                        const cellVal = row[col.key];
                        const isStatus = col.key === 'status';

                        return (
                          <td
                            key={col.key}
                            className={`py-2.5 px-3.5 ${
                              col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                            }`}
                          >
                            {isStatus ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                String(cellVal).includes('催办') || String(cellVal).includes('不及格') || String(cellVal).includes('逾期')
                                  ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                                  : String(cellVal).includes('领跑') || String(cellVal).includes('完成') || String(cellVal).includes('优秀')
                                  ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                                  : 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                              }`}>
                                {cellVal}
                              </span>
                            ) : (
                              <span className="font-medium text-[#111827]">
                                {cellVal}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-3.5 text-right">
                        <button
                          onClick={() => onShowToast(`已对《${row.name || row.taskName || row.region || '该项'}》发送智能督办提醒通知！`)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9E4A2B] hover:underline cursor-pointer"
                        >
                          <BellRing className="w-3 h-3" />
                          <span>一键催办</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 自由追问 AI 助手互动区 */}
        <div className="pt-4 border-t border-[#F0ECE3] space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span className="text-xs font-bold text-[#111827]">
              对本次巡检结果有疑问？继续向 AI 追问
            </span>
          </div>

          {/* 历史追问对话 */}
          {followUpQuestions.length > 0 && (
            <div className="space-y-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E6E1]">
              {followUpQuestions.map((qa, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="font-semibold text-[#9E4A2B] flex items-center gap-1.5">
                    <span>你：</span>
                    <span>{qa.q}</span>
                  </div>
                  <div className="text-[#374151] bg-white p-2.5 rounded-lg border border-[#EFECE5] leading-relaxed">
                    <span className="font-bold text-[#059669]">AI 巡检助手：</span>
                    <span>{qa.a}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleFollowUpSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="例如：为什么 Surabaya 大区对练达标率偏低？帮我拟定一份下发给专柜 MT 的督办通知..."
              value={currentInputQuestion}
              onChange={(e) => setCurrentInputQuestion(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-[#FAF8F5] border border-[#D6D0C4] rounded-xl text-xs text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B] focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#9E4A2B] hover:bg-[#833D23] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>发送</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    )}

    {/* 自定义字段输入弹窗 */}
    {isCustomModalOpen && (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-[#E8E6E1] shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
            <h4 className="text-sm font-bold text-[#111827]">添加自定义业务筛选字段</h4>
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(false)}
              className="text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5 text-xs">
            <label className="text-[#374151] font-medium">字段名称：</label>
            <input
              type="text"
              placeholder="例如：专柜排班、督办期次、活动主题"
              value={customFieldNameInput}
              onChange={(e) => setCustomFieldNameInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D6D0C4] rounded-xl text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B] focus:bg-white"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-[#D6D0C4] text-xs text-[#4B5563] hover:bg-[#FAF8F5] cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleAddCustomInputField}
              disabled={!customFieldNameInput.trim()}
              className="px-4 py-1.5 rounded-lg bg-[#9E4A2B] hover:bg-[#833D23] disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
            >
              确认添加
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};
