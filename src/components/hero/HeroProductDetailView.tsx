import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  Search,
  BookOpen,
  Dumbbell,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  Layers,
  X
} from 'lucide-react';
import {
  HeroProductItem,
  HeroProductFilterState,
  HeroTask,
  HeroBAPerson,
  MonthKey,
  BrandKey,
  RegionKey,
  HeroTrainingCycleComparison
} from '../../types/heroProduct';
import {
  MOCK_HERO_TASKS,
  MOCK_HERO_BA_LIST,
  computeHeroProductRowStats,
  getHeroProductTrendIntervals,
  getHeroProductTrainingCycles,
  HERO_MONTH_OPTIONS,
  HERO_BRAND_OPTIONS,
  HERO_REGION_OPTIONS
} from '../../data/mockHeroProducts';

interface HeroProductDetailViewProps {
  product: HeroProductItem;
  filter: HeroProductFilterState;
  onChangeFilter: (newFilter: HeroProductFilterState) => void;
  onBack: () => void;
  isId?: boolean;
}

type DetailTab = 'training' | 'ba' | 'sales';

export const HeroProductDetailView: React.FC<HeroProductDetailViewProps> = ({
  product,
  filter,
  onChangeFilter,
  onBack,
  isId = false,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('training');

  // BA 列表筛选与分页状态
  const [baStatusFilter, setBaStatusFilter] = useState<'ALL' | 'PARTICIPATED' | 'UNPARTICIPATED'>('ALL');
  const [baSearchText, setBaSearchText] = useState('');
  const [baCurrentPage, setBaCurrentPage] = useState(1);
  const BA_PAGE_SIZE = 10;
  // BA 列表折叠与展开状态（默认仅展示前 5 位预览，点击查看全部）
  const [isBaListExpanded, setIsBaListExpanded] = useState(false);

  // 任务详情钻取 Modal 状态
  const [selectedTaskForDrilldown, setSelectedTaskForDrilldown] = useState<HeroTask | null>(null);

  // BA 个人培训详情 Modal 状态
  const [selectedBAForModal, setSelectedBAForModal] = useState<HeroBAPerson | null>(null);

  // 图表交互 Hover 区间状态
  const [hoveredIntervalId, setHoveredIntervalId] = useState<string | null>(null);

  // 销售明细查看展开状态
  const [showSalesBreakdown, setShowSalesBreakdown] = useState(false);

  // 培训前后7天销量对比：自然周培训周期列表与选中周期状态
  const trainingCycles = useMemo(() => {
    return getHeroProductTrainingCycles(product, filter.region);
  }, [product, filter.region]);

  const defaultCycleId = useMemo(() => {
    const firstComplete = trainingCycles.find(c => c.status === 'COMPLETE');
    return firstComplete?.cycleId ?? trainingCycles[0]?.cycleId ?? '';
  }, [trainingCycles]);

  const [selectedCycleId, setSelectedCycleId] = useState<string>('');

  useEffect(() => {
    setSelectedCycleId(defaultCycleId);
  }, [defaultCycleId]);

  const activeCycle: HeroTrainingCycleComparison | undefined = useMemo(() => {
    return (
      trainingCycles.find(c => c.cycleId === selectedCycleId) ||
      trainingCycles.find(c => c.cycleId === defaultCycleId) ||
      trainingCycles[0]
    );
  }, [trainingCycles, selectedCycleId, defaultCycleId]);

  // 计算当前产品在当前筛选范围下的综合指标
  const rowStats = useMemo(() => {
    return computeHeroProductRowStats(product, filter);
  }, [product, filter]);

  // 计算趋势图 4 个区间的堆叠柱状图 + 折线图数据
  const trendIntervals = useMemo(() => {
    return getHeroProductTrendIntervals(product, filter);
  }, [product, filter]);

  // 该产品关联的任务列表
  const associatedTasks = useMemo(() => {
    return MOCK_HERO_TASKS.filter(t => product.taskIds.includes(t.id));
  }, [product]);

  // 当前大区筛选下的全量 BA 列表
  const targetBAsInScope = useMemo(() => {
    return filter.region === 'ALL'
      ? MOCK_HERO_BA_LIST
      : MOCK_HERO_BA_LIST.filter(ba => ba.region === filter.region);
  }, [filter.region]);

  // BA 人员明细及统计（按搜索与状态筛选）
  const filteredBAList = useMemo(() => {
    return targetBAsInScope.filter(ba => {
      const isParticipated = ba.participatedProductIds.includes(product.id);
      if (baStatusFilter === 'PARTICIPATED' && !isParticipated) return false;
      if (baStatusFilter === 'UNPARTICIPATED' && isParticipated) return false;

      if (baSearchText.trim()) {
        const q = baSearchText.toLowerCase().trim();
        const matchName = ba.name.toLowerCase().includes(q);
        const matchEmpId = ba.employeeId.toLowerCase().includes(q);
        const matchStore = ba.storeName.toLowerCase().includes(q);
        if (!matchName && !matchEmpId && !matchStore) return false;
      }
      return true;
    });
  }, [targetBAsInScope, product.id, baStatusFilter, baSearchText]);

  // BA 分页与展示数据（未展开时仅展示前 5 位预览，展开后支持分页与全量搜索）
  const BA_PREVIEW_COUNT = 5;
  const totalBAPages = Math.ceil(filteredBAList.length / BA_PAGE_SIZE) || 1;
  const displayedBAList = useMemo(() => {
    if (!isBaListExpanded) {
      return filteredBAList.slice(0, BA_PREVIEW_COUNT);
    }
    const start = (baCurrentPage - 1) * BA_PAGE_SIZE;
    return filteredBAList.slice(start, start + BA_PAGE_SIZE);
  }, [filteredBAList, isBaListExpanded, baCurrentPage]);

  // 销售趋势月度数据 (近5个月)
  const salesTrendList = useMemo(() => {
    const months: MonthKey[] = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
    return months.map(m => {
      const data = product.monthlySales[m];
      const units = filter.region === 'ALL'
        ? (data?.sellOutUnits || 0)
        : (data?.byRegion[filter.region] || 0);

      return {
        month: m,
        label: m === '2026-10' ? '10月 (当月)' : `${parseInt(m.split('-')[1])}月`,
        units,
        isCurrentSelected: m === filter.month,
        isPartial: data?.isPartialMonth || false,
      };
    });
  }, [product, filter.region, filter.month]);

  // 计算最大柱高用于图表缩放
  const maxTrendUnits = Math.max(...salesTrendList.map(s => s.units), 100);

  // 区域销售分布 (当选择全国时展示各区贡献)
  const currentMonthData = product.monthlySales[filter.month];
  const regionBreakdownList = useMemo(() => {
    if (!currentMonthData) return [];
    return Object.entries(currentMonthData.byRegion).map(([reg, units]) => ({
      region: reg,
      units,
      percentage: currentMonthData.sellOutUnits > 0
        ? ((units / currentMonthData.sellOutUnits) * 100).toFixed(1)
        : '0.0'
    }));
  }, [currentMonthData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Top Header: Navigation Back + Product Hero Summary + Persistent Filters */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs space-y-4">
        {/* Back Button & Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE3]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#9E4A2B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isId ? 'Kembali ke Papan Produk' : '返回大单品看板'}</span>
          </button>

          <div className="text-xs text-[#9CA3AF] flex items-center gap-1.5 font-mono">
            <span>SKU: {product.sku}</span>
            <span>·</span>
            <span className="text-[#9E4A2B] font-semibold">{product.brandName}</span>
          </div>
        </div>

        {/* Product Identity Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover border border-[#E5E1D8] shadow-2xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                  {product.brandName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-[#4B5563]">
                  {product.series}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#4F46E5]">
                  {product.category}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-[#111827] mt-1 tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                SPU: {product.spu}
              </p>
            </div>
          </div>

          {/* Persistent Filter Bar (月份, 品牌, 大区在详情页保持一致) */}
          <div className="flex flex-wrap items-center gap-2 bg-[#FAF8F5] p-2 rounded-xl border border-[#EFECE5] self-start md:self-auto">
            {/* 月份 */}
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Calendar className="w-3.5 h-3.5 text-[#9E4A2B]" />
              <select
                value={filter.month}
                onChange={(e) => onChangeFilter({ ...filter, month: e.target.value as MonthKey })}
                className="bg-white border border-[#D6D0C4] rounded-lg px-2.5 py-1 text-xs font-medium text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B]"
              >
                {HERO_MONTH_OPTIONS.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 大区 */}
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Building2 className="w-3.5 h-3.5 text-[#9E4A2B]" />
              <select
                value={filter.region}
                onChange={(e) => onChangeFilter({ ...filter, region: e.target.value as RegionKey })}
                className="bg-white border border-[#D6D0C4] rounded-lg px-2.5 py-1 text-xs font-medium text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B]"
              >
                {HERO_REGION_OPTIONS.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three Parallel Tabs (严格遵循用户需求：培训开展、BA参与、销售表现) */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs space-y-5">
        {/* Tab Switcher */}
        <div className="flex items-center border-b border-[#F0ECE3] gap-2">
          <button
            onClick={() => setActiveTab('training')}
            className={`pb-3 px-4 text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'training'
                ? 'text-[#9E4A2B]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isId ? '1. Pelaksanaan Pelatihan' : '1. 培训开展'}</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-[#FAF8F5] border border-[#E5E1D8] text-[#9E4A2B]">
              {associatedTasks.length} 个任务
            </span>
            {activeTab === 'training' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4A2B] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('ba')}
            className={`pb-3 px-4 text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'ba'
                ? 'text-[#9E4A2B]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isId ? '2. Partisipasi BA' : '2. BA参与'}</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-[#FAF8F5] border border-[#E5E1D8] text-[#059669]">
              覆盖率 {rowStats.coverageRate}%
            </span>
            {activeTab === 'ba' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4A2B] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`pb-3 px-4 text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'sales'
                ? 'text-[#9E4A2B]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isId ? '3. Pelatihan & Penjualan' : '3. 培训与销售表现'}</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-[#FAF8F5] border border-[#E5E1D8] text-[#2563EB]">
              {rowStats.sellOutUnits.toLocaleString()} 件
            </span>
            {activeTab === 'sales' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4A2B] rounded-full" />
            )}
          </button>
        </div>

        {/* ================= TAB 1: 培训开展 (默认显示) ================= */}
        {activeTab === 'training' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#6B7280] bg-[#FAF8F5] p-3 rounded-xl border border-[#EFECE5]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9E4A2B]" />
                <span>
                  {isId
                    ? 'Daftar semua modul pelatihan, latihan AI, dan ujian yang terkait dengan produk unggulan ini. Klik baris tugas untuk rincian.'
                    : '展示该大单品当前已发布的所有培训任务。点击任务可进一步查看具体参与人数、完成情况及考核成绩。'}
                </span>
              </div>
              <div className="text-[11px] text-[#9CA3AF]">
                支持多产品跨品关联任务展示
              </div>
            </div>

            {/* Task List Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E8E6E1]">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[#FAF8F5] text-[#6B7280] border-b border-[#E8E6E1]">
                  <tr>
                    <th className="py-3 px-4">任务名称</th>
                    <th className="py-3 px-3">任务类型</th>
                    <th className="py-3 px-3 text-center">完成情况</th>
                    <th className="py-3 px-3 text-center">覆盖情况</th>
                    <th className="py-3 px-3">发布时间 · 截止时间</th>
                    <th className="py-3 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
                  {associatedTasks.map((task) => {
                    const isMultiProduct = task.linkedProductIds.length > 1;
                    const coveragePercent = task.totalRequiredParticipants > 0
                      ? ((task.actualParticipants / task.totalRequiredParticipants) * 100).toFixed(1)
                      : '0.0';

                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTaskForDrilldown(task)}
                        className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#111827] group-hover:text-[#9E4A2B] transition-colors flex items-center gap-2">
                            <span>{task.title}</span>
                            {isMultiProduct && (
                              <span className="text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-1.5 py-0.2 rounded font-normal border border-[#C7D2FE]">
                                跨{task.linkedProductIds.length}品联合任务
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                            发布人: {task.author} · 受众: {task.targetAudience}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {task.type === 'study' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                              <BookOpen className="w-3 h-3" />
                              学习任务
                            </span>
                          )}
                          {task.type === 'practice' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">
                              <Dumbbell className="w-3 h-3" />
                              练习任务
                            </span>
                          )}
                          {task.type === 'exam' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
                              <GraduationCap className="w-3 h-3" />
                              考试任务
                            </span>
                          )}
                        </td>
                        {/* 任务类型后面的核心指标改成叫完成情况：学习=完成率，练习=达标率，考试=及格率 */}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-baseline gap-1">
                            <span className="text-[10px] text-[#6B7280]">
                              {task.type === 'study' ? '完成率' : task.type === 'practice' ? '达标率' : '及格率'}:
                            </span>
                            <span className="font-mono font-bold text-sm text-[#059669]">
                              {task.metricValue}%
                            </span>
                          </div>
                          {task.avgScore !== undefined && (
                            <div className="text-[10px] text-[#7C3AED] font-mono">
                              均分 {task.avgScore} 分
                            </div>
                          )}
                        </td>
                        {/* 覆盖情况：学习=参与人数和总人数数字(如 376 / 400)，练习=参与率，考试=交卷率 */}
                        <td className="py-3 px-3 text-center">
                          {task.type === 'study' && (
                            <div className="font-mono text-xs font-bold text-[#111827]">
                              {task.actualParticipants} / {task.totalRequiredParticipants}
                            </div>
                          )}
                          {task.type === 'practice' && (
                            <div className="inline-flex items-baseline gap-1">
                              <span className="text-[10px] text-[#6B7280]">参与率:</span>
                              <span className="font-mono font-bold text-xs text-[#C2410C]">
                                {coveragePercent}%
                              </span>
                            </div>
                          )}
                          {task.type === 'exam' && (
                            <div className="inline-flex items-baseline gap-1">
                              <span className="text-[10px] text-[#6B7280]">交卷率:</span>
                              <span className="font-mono font-bold text-xs text-[#7C3AED]">
                                {coveragePercent}%
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-[#6B7280]">
                          <div className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-[#9CA3AF]" />
                            <span>{task.publishDate} 至 {task.deadline}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-xs font-semibold text-[#9E4A2B] group-hover:underline">
                            查看明细 &gt;
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 2: BA参与 (纯人员列表形式，4项大卡片均衡分布+明细折叠展开) ================= */}
        {activeTab === 'ba' && (
          <div className="space-y-4">
            {/* 上方 4 项核心数据大卡片：均衡分布在一整行，放大尺寸与培训表现卡片风格完全统一 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: 应参与BA人数 */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5] flex flex-col justify-between min-h-[96px]">
                <div className="text-xs text-[#6B7280] font-medium">
                  应参与BA人数
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold font-mono text-[#111827] tabular-nums">
                    {rowStats.totalRequiredBAs.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6B7280]">人</span>
                </div>
              </div>

              {/* Card 2: 已参与BA人数 */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5] flex flex-col justify-between min-h-[96px]">
                <div className="text-xs text-[#6B7280] font-medium">
                  已参与BA人数
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold font-mono text-[#059669] tabular-nums">
                    {rowStats.participatedCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6B7280]">人</span>
                </div>
                <div className="text-[11px] text-[#6B7280] mt-1.5">
                  至少参与该产品1项任务
                </div>
              </div>

              {/* Card 3: 未参与BA人数 */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5] flex flex-col justify-between min-h-[96px]">
                <div className="text-xs text-[#6B7280] font-medium">
                  未参与BA人数
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold font-mono text-[#EA580C] tabular-nums">
                    {rowStats.unparticipatedCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6B7280]">人</span>
                </div>
                <div className="text-[11px] text-[#6B7280] mt-1.5">
                  尚未开始任何关联任务
                </div>
              </div>

              {/* Card 4: BA覆盖率 (带说明问号及进度条) */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5] flex flex-col justify-between min-h-[96px]">
                <div className="text-xs text-[#6B7280] font-medium flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span>BA 覆盖率</span>
                    <div className="group/tip relative inline-flex">
                      <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#9E4A2B] cursor-help" />
                      <div className="hidden group-hover/tip:block absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-1.5 z-30 w-56 p-2 bg-[#1E1F24] text-white text-[11px] rounded-lg shadow-lg font-normal text-left pointer-events-none leading-relaxed">
                        已参与BA人数 / 应参与BA人数，BA按工号去重。
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white text-[#9E4A2B] px-1.5 py-0.5 rounded border border-[#E5E1D8] font-mono">
                    {rowStats.participatedCount}/{rowStats.totalRequiredBAs}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold font-mono text-[#9E4A2B] tabular-nums">
                    {rowStats.coverageRate}%
                  </span>
                </div>
                <div className="mt-2.5 bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${rowStats.coverageRate}%` }}
                    className="bg-[#9E4A2B] h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* BA 人员明细列表区域（默认折叠仅展示前 5 位，支持展开查看全部并筛选） */}
            <div className="bg-white rounded-xl border border-[#E8E6E1] p-4 space-y-3.5">
              {/* 明细区域 Header 控制栏 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE3]">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#111827]">
                    BA 参与明细列表
                  </h4>
                  <span className="text-xs text-[#6B7280]">
                    {!isBaListExpanded
                      ? `(当前展示前 ${Math.min(BA_PREVIEW_COUNT, filteredBAList.length)} 位预览 · 共 ${targetBAsInScope.length} 人)`
                      : `(已展开全量名单 · 共 ${filteredBAList.length} 条记录)`
                    }
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!isBaListExpanded ? (
                    <button
                      onClick={() => setIsBaListExpanded(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#9E4A2B] bg-[#FDF8F6] hover:bg-[#FBEAE4] border border-[#F3D5CA] rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <span>展开查看全部 BA 明细</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsBaListExpanded(false);
                        setBaCurrentPage(1);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B7280] bg-[#FAF8F5] hover:bg-[#EBE7DF] border border-[#D6D0C4] rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>收起明细 (折叠为前 5 位)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 展开状态下的搜索与状态筛选栏 */}
              {isBaListExpanded && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-1">
                  <div className="flex items-center bg-[#FAF8F5] rounded-lg border border-[#D6D0C4] p-0.5 text-xs">
                    <button
                      onClick={() => { setBaStatusFilter('ALL'); setBaCurrentPage(1); }}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        baStatusFilter === 'ALL'
                          ? 'bg-[#9E4A2B] text-white shadow-xs'
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                    >
                      全部 ({targetBAsInScope.length})
                    </button>
                    <button
                      onClick={() => { setBaStatusFilter('PARTICIPATED'); setBaCurrentPage(1); }}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        baStatusFilter === 'PARTICIPATED'
                          ? 'bg-[#059669] text-white shadow-xs'
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                    >
                      已参与 ({rowStats.participatedCount})
                    </button>
                    <button
                      onClick={() => { setBaStatusFilter('UNPARTICIPATED'); setBaCurrentPage(1); }}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        baStatusFilter === 'UNPARTICIPATED'
                          ? 'bg-[#EA580C] text-white shadow-xs'
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                    >
                      未参与 ({rowStats.unparticipatedCount})
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜索姓名、工号或门店..."
                      value={baSearchText}
                      onChange={(e) => { setBaSearchText(e.target.value); setBaCurrentPage(1); }}
                      className="pl-8 pr-3 py-1 bg-white border border-[#D6D0C4] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B] w-52 sm:w-64"
                    />
                  </div>
                </div>
              )}

              {/* BA 人员明细表格 */}
              <div className="overflow-x-auto rounded-lg border border-[#E8E6E1]">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead className="bg-[#FAF8F5] text-[#6B7280] border-b border-[#E8E6E1]">
                    <tr>
                      <th className="py-3 px-4">BA 姓名</th>
                      <th className="py-3 px-3">员工工号</th>
                      <th className="py-3 px-3">所属大区 / 专柜门店</th>
                      <th className="py-3 px-3 text-center">参与任务数 (已参与/分配)</th>
                      <th className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1 justify-center group/tip relative">
                          <span>练习次数</span>
                          <HelpCircle className="w-3 h-3 text-[#9CA3AF] hover:text-[#9E4A2B] cursor-help" />
                          <div className="hidden group-hover/tip:block absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 w-52 p-2 bg-[#1E1F24] text-white text-[11px] rounded-lg shadow-lg font-normal text-left pointer-events-none leading-relaxed">
                            当前筛选范围内，所有有效练习提交次数之和，同一BA多次提交分别计数。
                          </div>
                        </div>
                      </th>
                      <th className="py-3 px-3 text-center">参与状态</th>
                      <th className="py-3 px-3 text-right">培训明细</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
                    {displayedBAList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-xs text-[#9CA3AF]">
                          没有找到匹配的 BA 人员记录
                        </td>
                      </tr>
                    ) : (
                      displayedBAList.map((ba) => {
                        const assignedTasks = ba.assignedTaskIdsByProduct[product.id] || [];
                        const assignedCount = assignedTasks.length;
                        const completedCount = ba.completedTaskIds.filter(tId => assignedTasks.includes(tId)).length;
                        const practiceSubmits = ba.practiceSubmitsByProduct[product.id] || 0;

                        // 参与状态判定：未参与: 0/N, 部分参与: 0<x<N, 全部参与: x=N
                        const isNone = completedCount === 0;
                        const isFull = completedCount === assignedCount && assignedCount > 0;
                        const isPartial = !isNone && !isFull;

                        return (
                          <tr
                            key={ba.id}
                            onClick={() => setSelectedBAForModal(ba)}
                            className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                          >
                            <td className="py-3 px-4 font-semibold text-[#111827] group-hover:text-[#9E4A2B] transition-colors">
                              {ba.name}
                            </td>
                            <td className="py-3 px-3 font-mono text-[#6B7280]">
                              {ba.employeeId}
                            </td>
                            <td className="py-3 px-3 text-[#6B7280]">
                              <span className="font-medium text-[#111827]">{ba.region}</span>
                              <span className="text-[#9CA3AF]"> · {ba.storeName}</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="font-mono font-bold text-sm text-[#111827]">
                                {completedCount}
                              </span>
                              <span className="text-[11px] font-mono text-[#9CA3AF]">
                                {' '}/ {assignedCount}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-[#9E4A2B]">
                              {practiceSubmits} <span className="text-[10px] font-normal text-[#9CA3AF]">次</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              {isFull && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                                  <CheckCircle2 className="w-3 h-3" />
                                  全部参与
                                </span>
                              )}
                              {isPartial && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                                  <span>部分参与</span>
                                </span>
                              )}
                              {isNone && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                                  <XCircle className="w-3 h-3" />
                                  未参与
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span className="text-xs font-semibold text-[#9E4A2B] group-hover:underline">
                                个人详情 &gt;
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* 折叠模式下的展开引导区域 */}
              {!isBaListExpanded ? (
                <div className="bg-[#FAF8F5] border border-[#EFECE5] rounded-xl p-3 text-center">
                  <button
                    onClick={() => setIsBaListExpanded(true)}
                    className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#9E4A2B] hover:text-[#7C351D] cursor-pointer transition-colors"
                  >
                    <span>展开查看全部 BA 明细与搜索筛选 (还有 {Math.max(0, targetBAsInScope.length - BA_PREVIEW_COUNT)} 位 BA 未展示)</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* 展开模式下的分页控制栏与底部收起按钮 */
                <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] pt-2 gap-3">
                  <div>
                    显示第 {(baCurrentPage - 1) * BA_PAGE_SIZE + 1} 至 {Math.min(baCurrentPage * BA_PAGE_SIZE, filteredBAList.length)} 条，共 {filteredBAList.length} 条记录
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setIsBaListExpanded(false);
                        setBaCurrentPage(1);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-[#9E4A2B] hover:underline cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>收起列表</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={baCurrentPage <= 1}
                        onClick={() => setBaCurrentPage(p => Math.max(1, p - 1))}
                        className="px-2.5 py-1 rounded-lg border border-[#D6D0C4] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 font-mono font-bold text-[#111827]">
                        {baCurrentPage} / {totalBAPages}
                      </span>
                      <button
                        disabled={baCurrentPage >= totalBAPages}
                        onClick={() => setBaCurrentPage(p => Math.min(totalBAPages, p + 1))}
                        className="px-2.5 py-1 rounded-lg border border-[#D6D0C4] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: 培训与销售表现 ================= */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* 顶部两行指标整合展示（不设额外分区标题） */}
            <div className="space-y-4">
              {/* 第一行：原有 3 项核心指标 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric 1: 实际销量 (SELL OUT) */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5]">
                  <div className="text-xs text-[#6B7280] font-medium flex items-center justify-between">
                    <span>实际销量 (SELL OUT)</span>
                    <span className="text-[10px] bg-white text-[#9E4A2B] px-1.5 py-0.2 rounded border border-[#E5E1D8]">
                      {filter.month}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold font-mono text-[#111827] tabular-nums">
                      {rowStats.sellOutUnits.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#6B7280]">件</span>
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-1 flex items-center justify-between">
                    <span>范围: {filter.region === 'ALL' ? '全国实际销售' : `${filter.region} 大区`}</span>
                    {rowStats.momGrowth !== null && (
                      <span className={`font-mono font-semibold flex items-center ${
                        rowStats.momGrowth >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'
                      }`}>
                        {rowStats.momGrowth >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                        MoM {rowStats.momGrowth >= 0 ? `+${rowStats.momGrowth}%` : `${rowStats.momGrowth}%`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Metric 2: 培训参与人次 (带问号提示) */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5]">
                  <div className="text-xs text-[#6B7280] font-medium flex items-center gap-1">
                    <span>培训参与人次</span>
                    <div className="group/tip relative inline-flex">
                      <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#9E4A2B] cursor-help" />
                      <div className="hidden group-hover/tip:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 w-72 p-2.5 bg-[#1E1F24] text-white text-[11px] rounded-lg shadow-lg font-normal text-left pointer-events-none leading-relaxed">
                        当前筛选范围内，所有BA的学习完成次数、练习有效提交次数及考试有效参与次数之和。同一练习任务多次有效提交分别计数。
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold font-mono text-[#9E4A2B] tabular-nums">
                      {rowStats.trainingPersonTimes.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#6B7280]">人次</span>
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-1 flex items-center gap-2">
                    <span className="text-[#1D4ED8]">{rowStats.studyPersonTimes} 学习</span>
                    <span>·</span>
                    <span className="text-[#C2410C]">{rowStats.practicePersonTimes} 练习</span>
                    <span>·</span>
                    <span className="text-[#7C3AED]">{rowStats.examPersonTimes} 考试</span>
                  </div>
                </div>

                {/* Metric 3: BA覆盖人数 */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5]">
                  <div className="text-xs text-[#6B7280] font-medium">
                    BA 覆盖人数
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold font-mono text-[#059669] tabular-nums">
                      {rowStats.participatedCount}
                    </span>
                    <span className="text-xs text-[#6B7280]">/ {rowStats.totalRequiredBAs} 人</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${rowStats.coverageRate}%` }}
                        className="bg-[#059669] h-full rounded-full"
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#059669]">
                      {rowStats.coverageRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 第二行：原有 3 项培训质量指标 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 指标 1: 学习完成率 */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5]">
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#111827]">学习完成率</span>
                    <div className="group/tip relative inline-flex">
                      <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#9E4A2B] cursor-help" />
                      <div className="hidden group-hover/tip:block absolute bottom-full right-0 mb-1.5 z-30 w-64 p-2 bg-[#1E1F24] text-white text-[11px] rounded-lg shadow-lg font-normal text-left pointer-events-none leading-relaxed">
                        当前产品关联学习任务的实际有效完成次数 / 应完成任务总人次。
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold font-mono text-[#2563EB] tabular-nums">
                      {rowStats.studyCompletionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      style={{ width: `${rowStats.studyCompletionRate}%` }}
                      className="bg-[#2563EB] h-full rounded-full transition-all"
                    />
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-1.5">
                    课件阅读及知识点通关比率
                  </div>
                </div>

                {/* 指标 2: 练习达标率 */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5]">
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#111827]">练习达标率</span>
                    <div className="group/tip relative inline-flex">
                      <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#9E4A2B] cursor-help" />
                      <div className="hidden group-hover/tip:block absolute bottom-full right-0 mb-1.5 z-30 w-64 p-2 bg-[#1E1F24] text-white text-[11px] rounded-lg shadow-lg font-normal text-left pointer-events-none leading-relaxed">
                        当前产品关联练习任务中达到合格标准的人数 / 实际参与练习总人数（以每位BA最高成绩判定）。
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold font-mono text-[#C2410C] tabular-nums">
                      {rowStats.practiceQualifiedRate}%
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      style={{ width: `${rowStats.practiceQualifiedRate}%` }}
                      className="bg-[#C2410C] h-full rounded-full transition-all"
                    />
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-1.5">
                    AI数字人对练最高成绩达标比率
                  </div>
                </div>

                {/* 指标 3: 考试及格率 */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE5]">
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#111827]">考试及格率</span>
                    <div className="group/tip relative inline-flex">
                      <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#9E4A2B] cursor-help" />
                      <div className="hidden group-hover/tip:block absolute bottom-full right-0 mb-1.5 z-30 w-64 p-2 bg-[#1E1F24] text-white text-[11px] rounded-lg shadow-lg font-normal text-left pointer-events-none leading-relaxed">
                        当前产品关联考试任务中达到及格线的人数 / 实际参加考试总人数。
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold font-mono text-[#7C3AED] tabular-nums">
                      {rowStats.examPassRate}%
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      style={{ width: `${rowStats.examPassRate}%` }}
                      className="bg-[#7C3AED] h-full rounded-full transition-all"
                    />
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-1.5">
                    专项理论考核及格达标比率
                  </div>
                </div>
              </div>
            </div>

            {/* Core Trend Chart: 堆叠柱状图 + 折线图组合 (每月划分为 4 个区间，双纵轴设计) */}
            <div className="bg-white p-5 rounded-xl border border-[#E8E6E1] space-y-5">
              {/* Header with Title and Legend */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0ECE3] gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#FAF3F0] rounded-lg border border-[#F3D5CA]">
                    <BarChart3 className="w-4 h-4 text-[#9E4A2B]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">
                      月内 4 区间培训开展与实际销量趋势
                    </h4>
                    <p className="text-[11px] text-[#6B7280]">
                      左轴对应培训参与总人次（堆叠柱），右轴对应实际销量 SELL OUT（绿色折线）
                    </p>
                  </div>
                </div>

                {/* Legends */}
                <div className="flex flex-wrap items-center gap-3.5 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#3B82F6]" />
                    <span>学习人次</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#F97316]" />
                    <span>练习提交人次</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#8B5CF6]" />
                    <span>考试人次</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                    <span className="w-3.5 h-1 rounded-full bg-[#059669]" />
                    <span className="w-2 h-2 rounded-full border-2 border-[#059669] bg-white -ml-2" />
                    <span className="font-semibold text-[#047857]">SELL OUT 实际销量</span>
                  </div>
                </div>
              </div>

              {/* Dual-Axis Enterprise Chart Visualization */}
              {(() => {
                // 1. 独立计算左纵轴 (培训人次) 刻度体系 (5 个水平刻度: 100%, 75%, 50%, 25%, 0%)
                const rawMaxTraining = Math.max(...trendIntervals.map(i => i.totalPersonTimes), 20);
                const trainingStep = Math.max(10, Math.ceil((rawMaxTraining * 1.2) / 4 / 10) * 10);
                const trainingMax = trainingStep * 4;
                const trainingTicks = [trainingMax, trainingStep * 3, trainingStep * 2, trainingStep, 0];

                // 2. 独立计算右纵轴 (实际销量) 刻度体系 (5 个水平刻度: 100%, 75%, 50%, 25%, 0%)
                const rawMaxSales = Math.max(...trendIntervals.map(i => i.sellOutUnits), 50);
                const salesStep = Math.max(25, Math.ceil((rawMaxSales * 1.25) / 4 / 25) * 25);
                const salesMax = salesStep * 4;
                const salesTicks = [salesMax, salesStep * 3, salesStep * 2, salesStep, 0];

                // 3. 计算折线图百分比坐标 (x 居中于各区间: 12.5%, 37.5%, 62.5%, 87.5%; y 依据右轴准确映射)
                const linePoints = trendIntervals.map((interval, idx) => {
                  const x = 12.5 + idx * 25;
                  const y = Math.max(4, Math.min(96, 100 - (interval.sellOutUnits / salesMax) * 100));
                  return { x, y, interval };
                });

                // 生成平滑三阶贝塞尔曲线 SVG 路径
                let curvePath = `M ${linePoints[0].x} ${linePoints[0].y}`;
                for (let i = 0; i < linePoints.length - 1; i++) {
                  const p0 = linePoints[i];
                  const p1 = linePoints[i + 1];
                  const dx = (p1.x - p0.x) / 2;
                  curvePath += ` C ${p0.x + dx} ${p0.y}, ${p1.x - dx} ${p1.y}, ${p1.x} ${p1.y}`;
                }
                const areaPath = `${curvePath} L ${linePoints[linePoints.length - 1].x} 100 L ${linePoints[0].x} 100 Z`;

                return (
                  <div className="space-y-2">
                    {/* 整体图表容器：包含左纵轴、中央主画布、右纵轴 */}
                    <div className="flex items-stretch gap-2 select-none">
                      {/* Left Y-Axis: 培训参与人次刻度 */}
                      <div className="w-14 sm:w-16 flex flex-col justify-between py-1 text-right border-r border-[#E5E1D8] pr-2">
                        <div className="text-[11px] font-bold text-[#1E293B] leading-tight mb-2">
                          <div>培训人次</div>
                          <div className="text-[10px] font-normal text-[#94A3B8] font-mono">(人次)</div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between font-mono text-[11px] font-semibold text-[#64748B] pt-1">
                          {trainingTicks.map((val, idx) => (
                            <span key={idx} className="tabular-nums">
                              {val.toLocaleString()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Center Canvas: 网格线 + 堆叠柱状图 + 独立上层平滑折线 + 独立数据徽章 */}
                      <div className="flex-1 relative h-80">
                        {/* 5 条等距水平参考网格线 (对齐左右两侧的刻度点) */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                          <div className="border-b border-dashed border-[#E2E8F0] w-full" />
                          <div className="border-b border-dashed border-[#E2E8F0] w-full" />
                          <div className="border-b border-dashed border-[#E2E8F0] w-full" />
                          <div className="border-b border-dashed border-[#E2E8F0] w-full" />
                          <div className="border-b-2 border-[#CBD5E1] w-full" />
                        </div>

                        {/* 1. 堆叠柱状图容器 (Layer: z-10) */}
                        <div className="absolute inset-0 flex justify-between items-end z-10 px-2 sm:px-4">
                          {trendIntervals.map((item) => {
                            const totalHeightPct = Math.min(95, Math.max(6, (item.totalPersonTimes / trainingMax) * 100));
                            const studyPct = item.totalPersonTimes > 0 ? (item.studyPersonTimes / item.totalPersonTimes) * 100 : 0;
                            const practicePct = item.totalPersonTimes > 0 ? (item.practicePersonTimes / item.totalPersonTimes) * 100 : 0;
                            const examPct = item.totalPersonTimes > 0 ? (item.examPersonTimes / item.totalPersonTimes) * 100 : 0;
                            const isHovered = hoveredIntervalId === item.intervalId;

                            return (
                              <div
                                key={item.intervalId}
                                onMouseEnter={() => setHoveredIntervalId(item.intervalId)}
                                onMouseLeave={() => setHoveredIntervalId(null)}
                                className={`flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer transition-colors duration-150 rounded-xl py-1 ${
                                  isHovered ? 'bg-[#F8FAFC]' : ''
                                }`}
                              >
                                {/* 柱顶培训人次总数标签 */}
                                <div className="text-[11px] font-mono font-bold text-[#475569] mb-1.5 whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded-md border border-[#E2E8F0] shadow-2xs">
                                  {item.totalPersonTimes.toLocaleString()}
                                  <span className="text-[9px] font-normal text-[#94A3B8] ml-0.5">人次</span>
                                </div>

                                {/* 堆叠柱体 */}
                                <div
                                  style={{ height: `${totalHeightPct}%` }}
                                  className={`w-12 sm:w-16 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all duration-200 shadow-xs ${
                                    isHovered ? 'ring-2 ring-[#3B82F6] shadow-md scale-102' : ''
                                  }`}
                                >
                                  {/* 顶部: 考试人次 (紫色) */}
                                  <div
                                    style={{ height: `${examPct}%` }}
                                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] w-full transition-colors border-b border-white/30"
                                    title={`考试人次: ${item.examPersonTimes}`}
                                  />
                                  {/* 中间: 练习提交人次 (橙色) */}
                                  <div
                                    style={{ height: `${practicePct}%` }}
                                    className="bg-[#F97316] hover:bg-[#EA580C] w-full transition-colors border-b border-white/30"
                                    title={`练习提交人次: ${item.practicePersonTimes}`}
                                  />
                                  {/* 底部: 学习人次 (蓝色) */}
                                  <div
                                    style={{ height: `${studyPct}%` }}
                                    className="bg-[#3B82F6] hover:bg-[#2563EB] w-full transition-colors"
                                    title={`学习人次: ${item.studyPersonTimes}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* 2. 独立上层 SVG 销量平滑折线 (Layer: z-20，绝不被柱体遮挡) */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id="salesEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
                              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                            </linearGradient>
                            <filter id="salesLineShadow" x="-20%" y="-20%" width="140%" height="140%">
                              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#047857" floodOpacity="0.32" />
                            </filter>
                          </defs>

                          {/* 柔和半透明翡翠绿渐变面积底色 */}
                          <path
                            d={areaPath}
                            fill="url(#salesEmeraldGradient)"
                            className="transition-all duration-300"
                          />

                          {/* 加粗、高对比度平滑主折线 */}
                          <path
                            d={curvePath}
                            fill="none"
                            stroke="#059669"
                            strokeWidth="3.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#salesLineShadow)"
                            vectorEffect="non-scaling-stroke"
                            className="transition-all duration-300"
                          />
                        </svg>

                        {/* 3. 独立 HTML 销量数据节点与不压缩胶囊标签 (Layer: z-30，原生字体不拉伸变形) */}
                        <div className="absolute inset-0 pointer-events-none z-30">
                          {linePoints.map((pt) => {
                            const isHovered = hoveredIntervalId === pt.interval.intervalId;
                            return (
                              <div
                                key={pt.interval.intervalId}
                                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                                className="absolute pointer-events-auto"
                              >
                                {/* 折线节点双层圆环 */}
                                <div
                                  className={`w-4 h-4 rounded-full bg-white border-[3px] border-[#059669] shadow-md flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
                                    isHovered ? 'scale-130 ring-4 ring-[#10B981]/40' : ''
                                  }`}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                                </div>

                                {/* 销量高对比度胶囊标签 (浮动在节点上方，加阴影与微标，千分符，清晰防遮挡) */}
                                <div
                                  className={`absolute -translate-x-1/2 -translate-y-[155%] transition-all duration-200 ${
                                    isHovered ? 'scale-110 -translate-y-[165%]' : ''
                                  }`}
                                >
                                  <div className="bg-[#047857] hover:bg-[#065F46] text-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 font-mono font-bold text-xs whitespace-nowrap border border-[#065F46]">
                                    <TrendingUp className="w-3 h-3 text-[#A7F3D0]" />
                                    <span>{pt.interval.sellOutUnits.toLocaleString()}</span>
                                    <span className="text-[10px] font-normal text-[#D1FAE5]">件</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Y-Axis: 实际销量件数刻度 */}
                      <div className="w-14 sm:w-16 flex flex-col justify-between py-1 text-left border-l border-[#E5E1D8] pl-2">
                        <div className="text-[11px] font-bold text-[#047857] leading-tight mb-2">
                          <div>实际销量</div>
                          <div className="text-[10px] font-normal text-[#059669]/70 font-mono">(件)</div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between font-mono text-[11px] font-semibold text-[#059669] pt-1">
                          {salesTicks.map((val, idx) => (
                            <span key={idx} className="tabular-nums">
                              {val.toLocaleString()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom X-Axis: 4 个时间区间标识 (左右留出与纵轴等宽的空间，实现精准对齐) */}
                    <div className="flex items-center gap-2 pt-1 border-t border-[#E5E1D8]">
                      {/* 左侧空位对齐 */}
                      <div className="w-14 sm:w-16 shrink-0" />

                      {/* 4 个区间的日期标签 */}
                      <div className="flex-1 flex justify-between px-2 sm:px-4">
                        {trendIntervals.map((item) => (
                          <div
                            key={item.intervalId}
                            className="flex-1 text-center cursor-pointer py-1 rounded-lg transition-colors"
                            onMouseEnter={() => setHoveredIntervalId(item.intervalId)}
                            onMouseLeave={() => setHoveredIntervalId(null)}
                          >
                            <div className={`text-xs font-bold transition-colors ${
                              hoveredIntervalId === item.intervalId ? 'text-[#9E4A2B]' : 'text-[#1E293B]'
                            }`}>
                              {item.intervalLabel}
                            </div>
                            <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                              {item.dateRange}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 右侧空位对齐 */}
                      <div className="w-14 sm:w-16 shrink-0" />
                    </div>

                    {/* 交互提示与悬浮当周明细面板 */}
                    {hoveredIntervalId ? (() => {
                      const hoveredItem = trendIntervals.find(i => i.intervalId === hoveredIntervalId);
                      if (!hoveredItem) return null;

                      return (
                        <div className="mt-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E6E1] shadow-xs animate-in fade-in zoom-in-98 duration-100">
                          <div className="flex items-center justify-between pb-2 border-b border-[#EFECE5] mb-2.5 text-xs">
                            <div className="flex items-center gap-2 font-bold text-[#111827]">
                              <Calendar className="w-3.5 h-3.5 text-[#9E4A2B]" />
                              <span>{hoveredItem.intervalLabel} ({hoveredItem.dateRange}) 表现明细</span>
                            </div>
                            <div className="font-mono text-xs font-bold text-[#047857] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                              <span>实际销量: {hoveredItem.sellOutUnits.toLocaleString()} 件</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="bg-white px-3 py-2 rounded-lg border border-[#EFECE5] flex items-center justify-between shadow-2xs">
                              <span className="text-[11px] text-[#2563EB] font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-xs bg-[#3B82F6]" />
                                学习完成
                              </span>
                              <span className="font-mono font-bold text-xs text-[#111827]">
                                {hoveredItem.studyPersonTimes} <span className="text-[10px] text-[#94A3B8] font-normal">人次</span>
                              </span>
                            </div>

                            <div className="bg-white px-3 py-2 rounded-lg border border-[#EFECE5] flex items-center justify-between shadow-2xs">
                              <span className="text-[11px] text-[#EA580C] font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-xs bg-[#F97316]" />
                                练习有效提交
                              </span>
                              <span className="font-mono font-bold text-xs text-[#111827]">
                                {hoveredItem.practicePersonTimes} <span className="text-[10px] text-[#94A3B8] font-normal">人次</span>
                              </span>
                            </div>

                            <div className="bg-white px-3 py-2 rounded-lg border border-[#EFECE5] flex items-center justify-between shadow-2xs">
                              <span className="text-[11px] text-[#9333EA] font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-xs bg-[#8B5CF6]" />
                                考试参与
                              </span>
                              <span className="font-mono font-bold text-xs text-[#111827]">
                                {hoveredItem.examPersonTimes} <span className="text-[10px] text-[#94A3B8] font-normal">人次</span>
                              </span>
                            </div>

                            <div className="bg-[#FAF3F0] px-3 py-2 rounded-lg border border-[#F3D5CA] flex items-center justify-between shadow-2xs">
                              <span className="text-[11px] text-[#9E4A2B] font-semibold">
                                当周培训总人次
                              </span>
                              <span className="font-mono font-bold text-xs text-[#9E4A2B]">
                                {hoveredItem.totalPersonTimes} <span className="text-[10px] text-[#9E4A2B]/70 font-normal">人次</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="py-1 text-center text-[11px] text-[#94A3B8]">
                        提示：鼠标悬停在各周柱体或折线节点上，可查看当周学习、练习、考试及销量的详细构成
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 新增：培训前后7天销量对比模块（三列横向布局 + 两行展示 + 历史周期切换） */}
            {activeCycle && (() => {
              const formatMD = (dateStr: string) => {
                const parts = dateStr.split('-');
                return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
              };

              const formatRate = (rate: number) => {
                const absFormatted = Number.isInteger(rate) ? rate.toFixed(0) : rate.toFixed(1);
                return rate > 0 ? `+${absFormatted}%` : `${absFormatted}%`;
              };

              const isIncompleteWindow =
                activeCycle.status === 'CYCLE_ONGOING' ||
                activeCycle.status === 'POST_WINDOW_INCOMPLETE' ||
                activeCycle.status === 'DATA_INCOMPLETE';

              const changeColorClass =
                activeCycle.status !== 'COMPLETE' || activeCycle.changeRate === null
                  ? 'text-[#9CA3AF]'
                  : activeCycle.changeRate > 0
                  ? 'text-[#059669]'
                  : activeCycle.changeRate < 0
                  ? 'text-[#DC2626]'
                  : 'text-[#6B7280]';

              const incompleteHintText =
                activeCycle.status === 'CYCLE_ONGOING'
                  ? '当前周期尚未结束，数据暂未完整'
                  : activeCycle.status === 'POST_WINDOW_INCOMPLETE'
                  ? '培训后7天尚未完成，数据暂未完整'
                  : activeCycle.status === 'DATA_INCOMPLETE'
                  ? '部分日期销量缺失，数据不完整'
                  : '';

              return (
                <div className="bg-white p-5 rounded-xl border border-[#E8E6E1] space-y-4">
                  {/* 顶部极简行：条件状态标注 + 历史周期切换 */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {activeCycle.isLongTermContinuous && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                          长期连续培训 · 结果仅供参考
                        </span>
                      )}
                      {activeCycle.hasRetrainingInterference && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]">
                          存在再次培训干扰
                        </span>
                      )}
                      {isIncompleteWindow && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                          {activeCycle.status === 'DATA_INCOMPLETE' ? '数据不完整' : '数据暂未完整'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs text-[#6B7280]">培训周期</span>
                      <select
                        value={activeCycle.cycleId}
                        onChange={(e) => setSelectedCycleId(e.target.value)}
                        aria-label="切换历史培训周期"
                        className="text-xs font-mono font-medium text-[#111827] bg-[#FAF8F5] border border-[#D6D0C4] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#9E4A2B] cursor-pointer"
                      >
                        {trainingCycles.map(cycle => {
                          const rangeText = `${formatMD(cycle.startDate)}—${formatMD(cycle.endDate)}`;
                          const statusSuffix =
                            cycle.status === 'CYCLE_ONGOING'
                              ? ' (进行中)'
                              : cycle.status === 'POST_WINDOW_INCOMPLETE'
                              ? ' (后7天未完)'
                              : cycle.status === 'DATA_INCOMPLETE'
                              ? ' (数据不完整)'
                              : '';
                          return (
                            <option key={cycle.cycleId} value={cycle.cycleId}>
                              {rangeText}{statusSuffix}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* 主体：三列等宽横向布局，两行展示 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#FAF8F5] px-4 py-3.5 rounded-xl border border-[#EFECE5]">
                      <div className="text-xs text-[#6B7280] font-medium">培训前7天</div>
                      <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-[#111827] tabular-nums">
                        {activeCycle.preSales !== null
                          ? `${activeCycle.preSales.toLocaleString()} PCS`
                          : '--'}
                      </div>
                    </div>

                    <div className="bg-[#FAF8F5] px-4 py-3.5 rounded-xl border border-[#EFECE5]">
                      <div className="text-xs text-[#6B7280] font-medium">培训后7天</div>
                      <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-[#111827] tabular-nums">
                        {activeCycle.postSales !== null
                          ? `${activeCycle.postSales.toLocaleString()} PCS`
                          : '--'}
                      </div>
                    </div>

                    <div className="bg-[#FAF8F5] px-4 py-3.5 rounded-xl border border-[#EFECE5]">
                      <div className="text-xs text-[#6B7280] font-medium">销量变化</div>
                      <div className={`mt-2 text-2xl sm:text-3xl font-bold font-mono tabular-nums ${changeColorClass}`}>
                        {activeCycle.status === 'COMPLETE' && activeCycle.changeRate !== null
                          ? formatRate(activeCycle.changeRate)
                          : '--'}
                      </div>
                    </div>
                  </div>

                  {/* 底部一行小字展示日期范围及培训周期 */}
                  <div className="text-xs text-[#6B7280] font-mono">
                    培训周期 {formatMD(activeCycle.startDate)}—{formatMD(activeCycle.endDate)}，培训前 {formatMD(activeCycle.preStartDate)}—{formatMD(activeCycle.preEndDate)}，培训后 {formatMD(activeCycle.postStartDate)}—{formatMD(activeCycle.postEndDate)}
                    {incompleteHintText ? `（${incompleteHintText}）` : ''}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ================= 4. TASK DRILLDOWN MODAL ================= */}
      {selectedTaskForDrilldown && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-[#E5E1D8] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#F0ECE3]">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedTaskForDrilldown.type === 'study'
                      ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                      : selectedTaskForDrilldown.type === 'practice'
                      ? 'bg-[#FFF7ED] text-[#C2410C]'
                      : 'bg-[#F5F3FF] text-[#7C3AED]'
                  }`}>
                    {selectedTaskForDrilldown.type === 'study' ? '学习任务' : selectedTaskForDrilldown.type === 'practice' ? '练习任务' : '考试任务'}
                  </span>
                  <span className="text-xs text-[#9CA3AF] font-mono">ID: {selectedTaskForDrilldown.id}</span>
                </div>
                <h3 className="text-base font-bold text-[#111827] mt-1">
                  {selectedTaskForDrilldown.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTaskForDrilldown(null)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-3 gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EFECE5]">
              <div>
                <div className="text-[11px] text-[#6B7280]">完成情况</div>
                <div className="text-xl font-bold font-mono text-[#059669]">
                  {selectedTaskForDrilldown.metricValue}%
                </div>
                <div className="text-[10px] text-[#9CA3AF]">
                  {selectedTaskForDrilldown.type === 'study' ? '完成率' : selectedTaskForDrilldown.type === 'practice' ? '达标率' : '及格率'}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#6B7280]">覆盖情况</div>
                <div className="text-xl font-bold font-mono text-[#111827]">
                  {selectedTaskForDrilldown.type === 'study'
                    ? `${selectedTaskForDrilldown.actualParticipants} / ${selectedTaskForDrilldown.totalRequiredParticipants}`
                    : `${((selectedTaskForDrilldown.actualParticipants / selectedTaskForDrilldown.totalRequiredParticipants) * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-[#9CA3AF]">
                  {selectedTaskForDrilldown.type === 'study'
                    ? '参训人数 / 应参人数'
                    : selectedTaskForDrilldown.type === 'practice'
                    ? `参与率 (${selectedTaskForDrilldown.actualParticipants}/${selectedTaskForDrilldown.totalRequiredParticipants}人)`
                    : `交卷率 (${selectedTaskForDrilldown.actualParticipants}/${selectedTaskForDrilldown.totalRequiredParticipants}人)`}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#6B7280]">达标 / 及格人数</div>
                <div className="text-xl font-bold font-mono text-[#9E4A2B]">
                  {selectedTaskForDrilldown.qualifiedCount} 人
                </div>
                {selectedTaskForDrilldown.avgScore !== undefined && (
                  <div className="text-[10px] text-[#7C3AED]">平均分 {selectedTaskForDrilldown.avgScore} 分</div>
                )}
              </div>
            </div>

            {/* Regional Performance Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#111827]">
                各大区完成情况细项明细
              </h4>
              <div className="overflow-x-auto rounded-xl border border-[#E8E6E1]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#6B7280] border-b border-[#E8E6E1]">
                    <tr>
                      <th className="py-2.5 px-3">大区名称</th>
                      <th className="py-2.5 px-3 text-right">应参与人数</th>
                      <th className="py-2.5 px-3 text-right">实参与人数</th>
                      <th className="py-2.5 px-3 text-center">{selectedTaskForDrilldown.metricLabel}</th>
                      {selectedTaskForDrilldown.type === 'exam' && (
                        <th className="py-2.5 px-3 text-center">平均分</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F2EB]">
                    {Object.entries(selectedTaskForDrilldown.regionalBreakdown).map(([regName, stat]) => (
                      <tr key={regName} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-semibold text-[#111827]">{regName}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{stat.required}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#111827]">{stat.actual}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-[#059669]">
                          {stat.rate}%
                        </td>
                        {selectedTaskForDrilldown.type === 'exam' && (
                          <td className="py-2.5 px-3 text-center font-mono text-[#7C3AED]">
                            {stat.avgScore ? `${stat.avgScore} 分` : '--'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-[#F0ECE3]">
              <button
                onClick={() => setSelectedTaskForDrilldown(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E1F24] text-white hover:bg-[#32343E] transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. BA PERSONAL TRAINING DETAIL MODAL ================= */}
      {selectedBAForModal && (() => {
        const ba = selectedBAForModal;
        const assignedTasks = ba.assignedTaskIdsByProduct[product.id] || [];
        const assignedCount = assignedTasks.length;
        const completedCount = ba.completedTaskIds.filter(tId => assignedTasks.includes(tId)).length;
        const practiceSubmits = ba.practiceSubmitsByProduct[product.id] || 0;

        const isNone = completedCount === 0;
        const isFull = completedCount === assignedCount && assignedCount > 0;
        const isPartial = !isNone && !isFull;

        // 该大单品关联的任务列表
        const productTasks = MOCK_HERO_TASKS.filter(t => product.taskIds.includes(t.id));
        const studyTasks = productTasks.filter(t => t.type === 'study');
        const practiceTasks = productTasks.filter(t => t.type === 'practice');
        const examTasks = productTasks.filter(t => t.type === 'exam');

        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-[#E5E1D8] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#F0ECE3]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9E4A2B]/10 text-[#9E4A2B] border border-[#9E4A2B]/20">
                      BA 个人培训详情
                    </span>
                    <span className="text-xs text-[#9CA3AF] font-mono">{ba.employeeId}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mt-1 flex items-center gap-2">
                    <span>{ba.name}</span>
                    <span className="text-xs font-normal text-[#6B7280]">
                      ({ba.region}大区 · {ba.storeName})
                    </span>
                  </h3>
                  <div className="text-xs text-[#6B7280] mt-0.5">
                    当前产品: <span className="font-semibold text-[#111827]">{product.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBAForModal(null)}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EFECE5]">
                <div>
                  <div className="text-[11px] text-[#6B7280]">参与状态</div>
                  <div className="mt-1">
                    {isFull && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        全部参与
                      </span>
                    )}
                    {isPartial && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                        部分参与
                      </span>
                    )}
                    {isNone && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                        <XCircle className="w-3.5 h-3.5" />
                        未参与
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-[#6B7280]">参与任务数</div>
                  <div className="text-xl font-bold font-mono text-[#111827]">
                    {completedCount} <span className="text-xs font-normal text-[#6B7280]">/ {assignedCount} 个</span>
                  </div>
                  <div className="text-[10px] text-[#9CA3AF]">已参与 / 实际分配</div>
                </div>

                <div>
                  <div className="text-[11px] text-[#6B7280]">练习提交次数</div>
                  <div className="text-xl font-bold font-mono text-[#9E4A2B]">
                    {practiceSubmits} <span className="text-xs font-normal text-[#6B7280]">次</span>
                  </div>
                  <div className="text-[10px] text-[#9CA3AF]">所有练习有效提交累计</div>
                </div>
              </div>

              {/* 仅展示当前产品关联任务的明细 */}
              <div className="space-y-4">
                {/* 1. 学习任务完成情况 */}
                {studyTasks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#1D4ED8]" />
                      <span>学习任务完成情况 ({studyTasks.length}个)</span>
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-[#E8E6E1]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF8F5] text-[#6B7280] border-b border-[#E8E6E1]">
                          <tr>
                            <th className="py-2.5 px-3">课件名称</th>
                            <th className="py-2.5 px-3 text-center">完成状态</th>
                            <th className="py-2.5 px-3 text-center">学习时长</th>
                            <th className="py-2.5 px-3 text-right">完成时间</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F2EB]">
                          {studyTasks.map(t => {
                            const detail = ba.taskProgressDetails[t.id];
                            const isDone = detail?.studyCompleted || false;
                            return (
                              <tr key={t.id} className="hover:bg-gray-50">
                                <td className="py-2.5 px-3 font-semibold text-[#111827]">{t.title}</td>
                                <td className="py-2.5 px-3 text-center">
                                  {isDone ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#059669]">
                                      <CheckCircle2 className="w-3 h-3" />
                                      已完成
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                                      未完成
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono">
                                  {isDone ? `${detail?.studyMinutes || 20} 分钟` : '--'}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-[11px] text-[#6B7280]">
                                  {isDone ? (detail?.studyCompletedDate || '2026-09-18') : '--'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. 练习任务提交及达标情况 */}
                {practiceTasks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>练习提交次数及达标情况 ({practiceTasks.length}个)</span>
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-[#E8E6E1]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF8F5] text-[#6B7280] border-b border-[#E8E6E1]">
                          <tr>
                            <th className="py-2.5 px-3">对练任务名称</th>
                            <th className="py-2.5 px-3 text-center">有效提交次数</th>
                            <th className="py-2.5 px-3 text-center">最高得分 / 评级</th>
                            <th className="py-2.5 px-3 text-right">是否达标</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F2EB]">
                          {practiceTasks.map(t => {
                            const detail = ba.taskProgressDetails[t.id];
                            const submits = detail?.practiceSubmits || 0;
                            const isQualified = detail?.practiceQualified || false;
                            const bestScore = detail?.practiceBestScore || (submits > 0 ? 88 : null);

                            return (
                              <tr key={t.id} className="hover:bg-gray-50">
                                <td className="py-2.5 px-3 font-semibold text-[#111827]">{t.title}</td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-[#9E4A2B]">
                                  {submits > 0 ? `${submits} 次` : '0 次'}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono">
                                  {bestScore ? (
                                    <span className="font-bold text-[#111827]">{bestScore} 分</span>
                                  ) : (
                                    <span className="text-[#9CA3AF]">--</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  {submits === 0 ? (
                                    <span className="text-[10px] text-gray-400">未参与</span>
                                  ) : isQualified ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#059669]">
                                      <CheckCircle2 className="w-3 h-3" />
                                      已达标
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF7ED] text-[#C2410C]">
                                      未达标
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. 考试任务考核及成绩情况 */}
                {examTasks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>考试考核及成绩情况 ({examTasks.length}个)</span>
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-[#E8E6E1]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF8F5] text-[#6B7280] border-b border-[#E8E6E1]">
                          <tr>
                            <th className="py-2.5 px-3">考核任务名称</th>
                            <th className="py-2.5 px-3 text-center">参与状态</th>
                            <th className="py-2.5 px-3 text-center">考试得分</th>
                            <th className="py-2.5 px-3 text-right">考核结果</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F2EB]">
                          {examTasks.map(t => {
                            const detail = ba.taskProgressDetails[t.id];
                            const participated = detail?.examParticipated || false;
                            const score = detail?.examScore;
                            const passed = detail?.examPassed;

                            return (
                              <tr key={t.id} className="hover:bg-gray-50">
                                <td className="py-2.5 px-3 font-semibold text-[#111827]">{t.title}</td>
                                <td className="py-2.5 px-3 text-center">
                                  {participated ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5F3FF] text-[#7C3AED]">
                                      已交卷
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                                      未参加
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-sm">
                                  {score !== undefined ? (
                                    <span className={passed ? 'text-[#059669]' : 'text-[#DC2626]'}>
                                      {score} 分
                                    </span>
                                  ) : (
                                    <span className="text-[#9CA3AF] font-normal">--</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  {!participated ? (
                                    <span className="text-[10px] text-gray-400">未参加</span>
                                  ) : passed ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#059669]">
                                      <CheckCircle2 className="w-3 h-3" />
                                      及格通关
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF2F2] text-[#DC2626]">
                                      不及格
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end pt-3 border-t border-[#F0ECE3]">
                <button
                  onClick={() => setSelectedBAForModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E1F24] text-white hover:bg-[#32343E] transition-colors cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
