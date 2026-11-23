import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Building2,
  Sparkles,
  Search,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Dumbbell,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Info,
  HelpCircle
} from 'lucide-react';
import {
  HeroProductItem,
  HeroProductFilterState,
  HeroDrillLevel,
  MonthKey,
  BrandKey,
  RegionKey
} from '../../types/heroProduct';
import {
  HERO_RGM_REGIONS,
  HERO_MONTH_OPTIONS,
  HERO_BRAND_OPTIONS,
  HERO_REGION_OPTIONS,
  getFilteredHeroProducts,
  computeHeroProductRowStats
} from '../../data/mockHeroProducts';
import { RegionalBrandMatrix } from './RegionalBrandMatrix';
import { UserRolePerspective } from '../layout/Header';

interface HeroProductListViewProps {
  filter: HeroProductFilterState;
  onChangeFilter: (newFilter: HeroProductFilterState) => void;
  onSelectProduct: (product: HeroProductItem) => void;
  rolePerspective?: UserRolePerspective;
  isId?: boolean;
}

const PAGE_SIZE = 10;

export const HeroProductListView: React.FC<HeroProductListViewProps> = ({
  filter,
  onChangeFilter,
  onSelectProduct,
  rolePerspective = 'HQ',
  isId = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [matrixDrillLevel, setMatrixDrillLevel] = useState<HeroDrillLevel>(() => {
    if (rolePerspective === 'REGIONAL_MT' || rolePerspective === 'REGIONAL_MT_RT') return 'RGM';
    if (rolePerspective === 'REGIONAL_RT') return 'RT';
    return 'NATIONAL';
  });

  const showProductOverview = matrixDrillLevel === 'NATIONAL';

  // 筛选后的大单品列表
  const filteredProducts = useMemo(() => {
    return getFilteredHeroProducts(filter);
  }, [filter]);

  // 分页数据
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  // 全局汇总统计（根据当前筛选条件动态计算，去重并精准汇总）
  const dynamicOverview = useMemo(() => {
    let totalSellOut = 0;
    const uniqueTaskIds = new Set<string>();

    filteredProducts.forEach((p) => {
      p.taskIds.forEach((t) => uniqueTaskIds.add(t));
      const stats = computeHeroProductRowStats(p, filter);
      totalSellOut += stats.sellOutUnits;
    });

    return {
      productCount: filteredProducts.length,
      taskCount: uniqueTaskIds.size,
      totalSellOut
    };
  }, [filteredProducts, filter]);

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[#9CA3AF] tracking-wider uppercase mb-0.5">
            DASHBOARD
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              {isId ? 'Papan Produk Utama' : '大单品看板'}
            </h1>
            {showProductOverview && (
              <span className="text-xs bg-[#9E4A2B]/10 text-[#9E4A2B] font-semibold px-2.5 py-0.5 rounded-full border border-[#9E4A2B]/20">
                {filteredProducts.length} 款大单品
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            {isId
              ? 'Mencakup data pelatihan, jumlah orang-kali partisipasi, rasio cakupan BA, dan penjualan SELL OUT aktual bulanan'
              : '统揽全品类大单品培训任务（学习/练习/考试）、培训参与人次、BA覆盖率及当月实际 SELL OUT 销量'}
          </p>
        </div>

        {/* Global Summary Badge (仅在最初的大单品看板总览页展示) */}
        {showProductOverview && (
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E8E6E1] shadow-2xs self-start md:self-auto">
            <div className="text-right">
              <div className="text-[10px] text-[#6B7280] font-medium">当前范围去重任务总数</div>
              <div className="text-sm font-bold font-mono text-[#9E4A2B]">
                {dynamicOverview.taskCount} <span className="text-[11px] font-normal text-[#6B7280]">个</span>
              </div>
            </div>
            <div className="h-7 w-px bg-[#E5E1D8]" />
            <div className="text-right">
              <div className="text-[10px] text-[#6B7280] font-medium">当前周期实际 SELL OUT</div>
              <div className="text-sm font-bold font-mono text-[#059669]">
                {dynamicOverview.totalSellOut.toLocaleString()} <span className="text-[11px] font-normal text-[#6B7280]">件</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Top Filter Bar (复用唯一筛选区：统计周期[本周/本月/自定义]、品牌、大区 + 关键字搜索) */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* 筛选条件 1: 月份 / 统计周期 */}
            <div className="flex flex-wrap items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EFECE5]">
              <Calendar className="w-4 h-4 text-[#9E4A2B]" />
              <span className="text-xs font-semibold text-[#6B7280]">周期:</span>
              <select
                value={
                  filter.periodType === 'MONTH'
                    ? `MONTH:${filter.month}`
                    : filter.periodType
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'THIS_MONTH') {
                    onChangeFilter({ ...filter, periodType: 'THIS_MONTH', month: '2026-11' });
                  } else if (val === 'THIS_WEEK') {
                    onChangeFilter({ ...filter, periodType: 'THIS_WEEK', month: '2026-11' });
                  } else if (val === 'CUSTOM') {
                    onChangeFilter({ ...filter, periodType: 'CUSTOM' });
                  } else if (val.startsWith('MONTH:')) {
                    const mKey = val.replace('MONTH:', '') as MonthKey;
                    onChangeFilter({ ...filter, periodType: 'MONTH', month: mKey });
                  }
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-xs font-bold text-[#111827] focus:outline-hidden cursor-pointer"
              >
                <option value="THIS_MONTH">本月 (2026年11月)</option>
                <option value="THIS_WEEK">本周 (周一至周日)</option>
                <option value="CUSTOM">自定义时间范围</option>
                {HERO_MONTH_OPTIONS.filter(m => m.key !== '2026-11').map((m) => (
                  <option key={m.key} value={`MONTH:${m.key}`}>
                    {m.label}
                  </option>
                ))}
              </select>

              {filter.periodType === 'CUSTOM' && (
                <div className="flex items-center gap-1.5 pl-2 border-l border-[#E5E1D8]">
                  <input
                    type="date"
                    value={filter.customStartDate}
                    max={filter.customEndDate || undefined}
                    onChange={(e) => {
                      const nextStart = e.target.value;
                      if (!nextStart) return;
                      onChangeFilter({
                        ...filter,
                        customStartDate: nextStart,
                        customEndDate:
                          filter.customEndDate && nextStart > filter.customEndDate
                            ? nextStart
                            : filter.customEndDate,
                      });
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-[#D6D0C4] rounded-lg px-2 py-0.5 text-[11px] font-mono text-[#111827] focus:outline-hidden focus:border-[#9E4A2B]"
                  />
                  <span className="text-[11px] text-[#9CA3AF]">至</span>
                  <input
                    type="date"
                    value={filter.customEndDate}
                    min={filter.customStartDate || undefined}
                    onChange={(e) => {
                      const nextEnd = e.target.value;
                      if (!nextEnd) return;
                      onChangeFilter({
                        ...filter,
                        customEndDate: nextEnd,
                        customStartDate:
                          filter.customStartDate && nextEnd < filter.customStartDate
                            ? nextEnd
                            : filter.customStartDate,
                      });
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-[#D6D0C4] rounded-lg px-2 py-0.5 text-[11px] font-mono text-[#111827] focus:outline-hidden focus:border-[#9E4A2B]"
                  />
                </div>
              )}
            </div>

            {/* 筛选条件 2: 品牌 */}
            <div className="flex items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EFECE5]">
              <Layers className="w-4 h-4 text-[#9E4A2B]" />
              <span className="text-xs font-semibold text-[#6B7280]">品牌:</span>
              <select
                value={filter.brand}
                onChange={(e) => {
                  onChangeFilter({ ...filter, brand: e.target.value as BrandKey });
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-xs font-bold text-[#111827] focus:outline-hidden cursor-pointer"
              >
                {HERO_BRAND_OPTIONS.map((b) => (
                  <option key={b.key} value={b.key}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 筛选条件 3: 大区 (不选择展示全部14个RGM，选择指定大区仅展示对应RGM) */}
            <div className="flex items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EFECE5]">
              <Building2 className="w-4 h-4 text-[#9E4A2B]" />
              <span className="text-xs font-semibold text-[#6B7280]">大区:</span>
              <select
                value={filter.region}
                onChange={(e) => {
                  onChangeFilter({ ...filter, region: e.target.value as RegionKey });
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-xs font-bold text-[#111827] focus:outline-hidden cursor-pointer"
              >
                {HERO_REGION_OPTIONS.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 搜索框（仅在展示大单品列表时显示） */}
          {showProductOverview && (
            <div className="relative w-full lg:w-64">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索大单品名称或SKU..."
                value={filter.searchKeyword}
                onChange={(e) => {
                  onChangeFilter({ ...filter, searchKeyword: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E5E1D8] rounded-xl text-xs text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B]"
              />
            </div>
          )}
        </div>

        {/* 统计提示条 */}
        <div className="mt-3 pt-3 border-t border-[#F0ECE3] flex items-center justify-between text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#9E4A2B]" />
            <span>
              筛选条件对全国区域表现矩阵联动生效
              {showProductOverview ? '，并与下方大单品列表同步更新。' : '。'}
            </span>
          </div>
          {showProductOverview && (
            <span className="font-mono text-[#9CA3AF]">
              共找到 {filteredProducts.length} 款符合条件产品
            </span>
          )}
        </div>
      </div>

      {/* 3. 新增模块：全国区域培训与销售表现（支持 HQ -> RGM -> MT -> RT 组织下钻与权限控制） */}
      <RegionalBrandMatrix
        filter={filter}
        rolePerspective={rolePerspective}
        onDrillLevelChange={setMatrixDrillLevel}
        isId={isId}
      />

      {/* 4. Main Hero Products Table (仅在最初的大单品看板总览页展示；点击 RGM/MT/RT 逐级下钻后隐藏) */}
      {showProductOverview && (
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-[#FAF8F5] text-[#6B7280] border-b border-[#E8E6E1]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">产品名称</th>
                <th className="py-3.5 px-3 font-semibold text-center">培训任务数</th>
                <th className="py-3.5 px-3 font-semibold text-center">
                  <div className="inline-flex items-center gap-1 justify-center group/tip relative">
                    <span>{isId ? 'Partisipasi Pelatihan' : '培训参与人次'}</span>
                    <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#9E4A2B] cursor-help" />
                    <div className="hidden group-hover/tip:block absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 w-72 p-2.5 bg-[#1E1F24] text-white text-[11px] rounded-lg shadow-lg font-normal text-left pointer-events-none leading-relaxed">
                      {isId
                        ? 'Jumlah penyelesaian belajar, frekuensi submit latihan valid, dan partisipasi ujian dari semua BA. Submit latihan berulang kali dihitung terpisah.'
                        : '当前筛选范围内，所有BA的学习完成次数、练习有效提交次数及考试有效参与次数之和。同一练习任务多次有效提交分别计数。'}
                    </div>
                  </div>
                </th>
                <th className="py-3.5 px-3 font-semibold text-center">
                  <div className="inline-flex items-center gap-1 justify-center group/tip relative">
                    <span>{isId ? 'Cakupan BA' : 'BA 覆盖率'}</span>
                    <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#9E4A2B] cursor-help" />
                    <div className="hidden group-hover/tip:block absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 w-56 p-2 bg-[#1E1F24] text-white text-[11px] rounded-lg shadow-lg font-normal text-left pointer-events-none leading-relaxed">
                      {isId
                        ? 'Jumlah BA yang berpartisipasi / Total BA yang wajib berpartisipasi (BA dihitung unik berdasarkan ID)'
                        : '已参与BA人数 / 应参与BA人数，BA按工号去重。'}
                    </div>
                  </div>
                </th>
                <th className="py-3.5 px-3 font-semibold text-right">实际销量 (SELL OUT)</th>
                <th className="py-3.5 px-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#9CA3AF]">
                    暂无符合筛选条件的大单品记录
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => {
                  const stats = computeHeroProductRowStats(prod, filter);
                  return (
                    <tr
                      key={prod.id}
                      onClick={() => onSelectProduct(prod)}
                      className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                    >
                      {/* 字段 1: 产品名称 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E5E1D8] shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                                {prod.brandName}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-[#4B5563]">
                                {prod.series}
                              </span>
                            </div>
                            <div className="font-semibold text-[#111827] group-hover:text-[#9E4A2B] transition-colors text-xs line-clamp-1">
                              {prod.name}
                            </div>
                            <div className="text-[10px] text-[#9CA3AF] font-mono">
                              {prod.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 字段 1: 培训任务数（区分学习、练习、考试数量） */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-baseline gap-1 font-mono font-bold text-sm text-[#111827]">
                          <span>{stats.totalTasks}</span>
                          <span className="text-[10px] font-normal text-[#6B7280]">个</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-[#6B7280]">
                          <span className="text-[#1D4ED8]" title="学习任务">
                            {stats.studyCount} 学习
                          </span>
                          <span>·</span>
                          <span className="text-[#C2410C]" title="练习任务">
                            {stats.practiceCount} 练习
                          </span>
                          <span>·</span>
                          <span className="text-[#7C3AED]" title="考试任务">
                            {stats.examCount} 考试
                          </span>
                        </div>
                      </td>

                      {/* 字段 2: 培训参与人次（所有BA学习完成 + 练习有效提交[多次分别计数] + 考试有效参与之和） */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="text-sm font-bold font-mono text-[#9E4A2B]">
                          {stats.trainingPersonTimes.toLocaleString()}
                          <span className="text-[10px] font-normal text-[#6B7280] ml-1">人次</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-[#6B7280]">
                          <span className="text-[#1D4ED8]" title="学习完成人次">
                            {stats.studyPersonTimes} 学习
                          </span>
                          <span>·</span>
                          <span className="text-[#C2410C]" title="练习提交人次 (同一任务多次提交分别计数)">
                            {stats.practicePersonTimes} 练习
                          </span>
                          <span>·</span>
                          <span className="text-[#7C3AED]" title="考试参与人次">
                            {stats.examPersonTimes} 考试
                          </span>
                        </div>
                      </td>

                      {/* 字段 3: BA 覆盖率 */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sm text-[#059669]">
                            {stats.coverageRate}%
                          </span>
                          <span className="text-[10px] text-[#9CA3AF]">
                            ({stats.participatedCount}/{stats.totalRequiredBAs}人)
                          </span>
                        </div>
                        <div className="w-24 bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden mx-auto mt-1">
                          <div
                            style={{ width: `${stats.coverageRate}%` }}
                            className="bg-[#059669] h-full rounded-full transition-all"
                          />
                        </div>
                      </td>

                      {/* 字段 5: 实际销量 (SELL OUT) */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="text-sm font-bold font-mono text-[#111827]">
                          {stats.sellOutUnits.toLocaleString()}
                          <span className="text-[10px] font-normal text-[#6B7280] ml-1">件</span>
                        </div>
                        <div className="text-[10px] mt-0.5 flex items-center justify-end gap-1">
                          {stats.momGrowth !== null ? (
                            <span className={`font-mono font-medium flex items-center ${
                              stats.momGrowth >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'
                            }`}>
                              {stats.momGrowth >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                              MoM {stats.momGrowth >= 0 ? `+${stats.momGrowth}%` : `${stats.momGrowth}%`}
                            </span>
                          ) : (
                            <span className="text-[#9CA3AF]">--</span>
                          )}
                        </div>
                      </td>

                      {/* 操作 */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(prod);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-[#9E4A2B] bg-[#FAF8F5] hover:bg-[#9E4A2B] hover:text-white rounded-lg border border-[#E5E1D8] transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>查看详情</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Pagination */}
        <div className="p-4 border-t border-[#F0ECE3] flex items-center justify-between text-xs text-[#6B7280]">
          <div>
            显示第 {(currentPage - 1) * PAGE_SIZE + 1} 至 {Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} 款，共 {filteredProducts.length} 款大单品
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 inline" />
            </button>
            <span className="px-3 py-1.5 font-mono font-bold text-[#111827]">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
