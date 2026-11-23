import React, { useEffect, useState } from 'react';
import { Loader2, Clock, Grid3X3 } from 'lucide-react';
import {
  HeroProductFilterState,
  HeatmapTier,
  RegionalBrandMatrixResponse,
  RegionalMetricCellValue,
} from '../../types/heroProduct';
import { fetchRegionalBrandPerformanceMatrix } from '../../data/heroRegionalMatrixService';

interface RegionalBrandMatrixProps {
  filter: HeroProductFilterState;
  isId?: boolean;
}

// 整个单元格统一底色（低饱和度浅色系，由该区域×品牌下的任务完成率分档决定）
const HEATMAP_CELL_BG: Record<HeatmapTier, string> = {
  EXCELLENT: 'bg-[#EDF7F0]',
  GOOD: 'bg-[#EDF4FB]',
  FAIR: 'bg-[#FDF8E7]',
  WEAK: 'bg-[#FDEFEF]',
  NONE: 'bg-[#F9FAFB]',
};

function formatDeltaPair(
  delta: number | null,
  direction: 'UP' | 'DOWN' | 'FLAT' | 'NONE',
  unit: 'pp' | '%'
): string {
  if (direction === 'NONE' || delta === null) {
    return '—';
  }
  if (direction === 'FLAT' || delta === 0) {
    return '→ 0';
  }
  const absVal = Math.abs(delta);
  const formatted = Number.isInteger(absVal) ? absVal.toFixed(0) : absVal.toFixed(1);
  return direction === 'UP' ? `↑${formatted}${unit}` : `↓${formatted}${unit}`;
}

function getDeltaColorFromDirection(direction: 'UP' | 'DOWN' | 'FLAT' | 'NONE'): string {
  switch (direction) {
    case 'UP':
      return 'text-[#059669]';
    case 'DOWN':
      return 'text-[#DC2626]';
    case 'FLAT':
      return 'text-[#6B7280]';
    default:
      return 'text-[#9CA3AF]';
  }
}

function formatDeltaText(
  metric: RegionalMetricCellValue,
  unit: 'pp' | '%'
): string {
  return formatDeltaPair(metric.delta, metric.direction, unit);
}

function getDeltaColorClass(metric: RegionalMetricCellValue): string {
  return getDeltaColorFromDirection(metric.direction);
}

function formatMetricMainValue(
  value: number | null,
  kind: 'percent' | 'sales'
): string {
  if (value === null) return '暂无数据';
  if (kind === 'percent') {
    const clean = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
    return `${clean}%`;
  }
  return value.toFixed(1);
}

export const RegionalBrandMatrix: React.FC<RegionalBrandMatrixProps> = ({
  filter,
  isId = false,
}) => {
  const [matrixData, setMatrixData] = useState<RegionalBrandMatrixResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const timer = setTimeout(() => {
      fetchRegionalBrandPerformanceMatrix(filter)
        .then((res) => {
          if (!cancelled) {
            setMatrixData(res);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setIsLoading(false);
          }
        });
    }, 90);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    filter.periodType,
    filter.month,
    filter.customStartDate,
    filter.customEndDate,
    filter.brand,
    filter.region,
  ]);

  const columns = matrixData?.columns || [];
  const rows = matrixData?.rows || [];
  const isSingleBrand = columns.length === 1;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-2xs overflow-hidden">
      {/* 模块头部：标题 + 统计区间与环比区间 + 数据更新时间 */}
      <div className="px-5 py-3.5 border-b border-[#EFECE5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-7 h-7 rounded-lg bg-[#FAF3F0] border border-[#EED9D3] flex items-center justify-center shrink-0">
            <Grid3X3 className="w-4 h-4 text-[#7A2E26]" />
          </div>
          <h2 className="text-sm font-bold text-[#111827] tracking-tight">
            {isId ? 'Performa Pelatihan & Penjualan Regional Nasional' : '全国区域培训与销售表现'}
          </h2>
          {matrixData && (
            <span className="text-[11px] font-mono text-[#6B7280] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EFECE5]">
              {matrixData.currentStartDate} ~ {matrixData.currentEndDate}
              <span className="text-[#9CA3AF] mx-1">vs</span>
              {matrixData.previousStartDate} ~ {matrixData.previousEndDate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#6B7280] self-start sm:self-auto">
          {isLoading && (
            <span className="inline-flex items-center gap-1 text-[#7A2E26] font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>数据刷新中</span>
            </span>
          )}
          {matrixData && (
            <span className="inline-flex items-center gap-1 font-mono text-[#9CA3AF]">
              <Clock className="w-3 h-3" />
              <span>数据更新至 {matrixData.updatedAt}</span>
            </span>
          )}
        </div>
      </div>

      {/* 矩阵主体：左侧固定 RGM 姓名列 + 品牌列横向滚动 */}
      <div className="relative overflow-x-auto">
        {!matrixData && isLoading ? (
          <div className="p-8 space-y-2.5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-12 bg-[#FAF8F5] rounded-lg animate-pulse border border-[#F0ECE3]"
              />
            ))}
          </div>
        ) : (
          <table
            className={`w-full border-collapse text-xs transition-opacity duration-150 ${
              isLoading ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <thead>
              <tr className="bg-[#FAF3F1] border-t-2 border-t-[#7A2E26] border-b border-b-[#E4D5D0]">
                {/* 左侧固定表头：RGM */}
                <th className="sticky left-0 z-20 bg-[#FAF3F1] py-2.5 px-4 text-left font-bold text-[#7A2E26] border-r border-[#E4D5D0] min-w-[128px] w-[136px] shadow-[2px_0_6px_-3px_rgba(0,0,0,0.06)]">
                  RGM
                </th>

                {/* 品牌列头：品牌名居中 + 精简全国数值与环比 */}
                {columns.map((col) => (
                  <th
                    key={col.brandKey}
                    className={`py-2.5 px-3.5 text-center border-r last:border-r-0 border-[#EADBD6] ${
                      isSingleBrand ? 'min-w-[260px]' : 'min-w-[178px]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#7A2E26] leading-tight text-center">
                      {col.brandLabel}
                    </div>
                    <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] font-normal whitespace-nowrap font-mono tabular-nums">
                      <span className="text-[#6B7280]">全国</span>
                      {col.nationalPerCapitaSales !== null ? (
                        <>
                          <span className="font-semibold text-[#1F2937]">
                            {col.nationalPerCapitaSales.toFixed(1)}
                          </span>
                          <span
                            className={`font-medium ${getDeltaColorFromDirection(
                              col.nationalPerCapitaSalesDirection
                            )}`}
                          >
                            {formatDeltaPair(
                              col.nationalPerCapitaSalesDelta,
                              col.nationalPerCapitaSalesDirection,
                              '%'
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#9CA3AF]">暂无数据</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {rows.map((row) => (
                <tr key={row.rgm.rgmId} className="group">
                  {/* 左侧固定 RGM 姓名列（仅展示 RGM 姓名，不显示冗长大区名称） */}
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-[#FAF8F5] py-2.5 px-4 font-semibold text-[#1F2937] border-r border-[#E5E7EB] whitespace-nowrap shadow-[2px_0_6px_-3px_rgba(0,0,0,0.06)]">
                    <div className="text-xs leading-snug">{row.rgm.rgmName}</div>
                  </td>

                  {/* RGM × 品牌交叉单元格：整格统一使用一种浅色背景（按任务完成率分档） */}
                  {columns.map((col) => {
                    const cell = row.cells[col.brandKey];

                    if (!cell || !cell.hasData) {
                      return (
                        <td
                          key={col.brandKey}
                          className="px-3 py-2.5 border-r last:border-r-0 border-[#E5E7EB] text-center align-middle bg-[#F9FAFB]"
                        >
                          <span className="text-[11px] text-[#9CA3AF]">暂无数据</span>
                        </td>
                      );
                    }

                    const unifiedCellBg = HEATMAP_CELL_BG[cell.completion.tier];
                    const metricRows: {
                      key: string;
                      metric: RegionalMetricCellValue;
                      kind: 'percent' | 'sales';
                      unit: 'pp' | '%';
                      isEmphasized: boolean;
                    }[] = [
                      { key: 'coverage', metric: cell.coverage, kind: 'percent', unit: 'pp', isEmphasized: false },
                      { key: 'completion', metric: cell.completion, kind: 'percent', unit: 'pp', isEmphasized: false },
                      { key: 'perCapitaSales', metric: cell.perCapitaSales, kind: 'sales', unit: '%', isEmphasized: true },
                    ];

                    return (
                      <td
                        key={col.brandKey}
                        className={`${unifiedCellBg} px-3.5 py-2 border-r last:border-r-0 border-[#E5E7EB] align-middle transition-colors`}
                      >
                        <div className="space-y-1">
                          {metricRows.map((mRow) => (
                            <div
                              key={mRow.key}
                              className="flex items-center justify-between gap-2 whitespace-nowrap leading-tight"
                            >
                              {/* 左侧：人均销量稍大更深，覆盖率与完成率保持一致且稍小稍浅 */}
                              <span
                                className={`font-mono tabular-nums ${
                                  mRow.isEmphasized
                                    ? 'text-[14px] font-bold text-[#111827]'
                                    : 'text-[12px] font-semibold text-[#4B5563]'
                                }`}
                              >
                                {formatMetricMainValue(mRow.metric.value, mRow.kind)}
                              </span>

                              {/* 右侧：灰色小号排名 + 红/绿/灰环比（同行展示，不换行） */}
                              <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums text-[11px]">
                                <span className="text-[#6B7280] w-6 text-right">
                                  {mRow.metric.rank !== null ? `#${mRow.metric.rank}` : '—'}
                                </span>
                                <span
                                  className={`font-medium w-11 text-right ${getDeltaColorClass(
                                    mRow.metric
                                  )}`}
                                >
                                  {formatDeltaText(mRow.metric, mRow.unit)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 底部统一指标说明 & 低饱和单元格背景图例 */}
      <div className="px-5 py-2.5 bg-[#FAF8F5] border-t border-[#E8E6E1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#6B7280]">
        <div className="font-medium text-[#4B5563]">
          自上而下：覆盖率 · 完成率 · 人均销量 (PCS/BA)
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6B7280]">
          <span className="text-[#9CA3AF]">底色（完成率）：</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#EDF7F0] border border-[#B7DFC5]" />
            <span>表现较好</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#EDF4FB] border border-[#BBD6F2]" />
            <span>表现良好</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#FDF8E7] border border-[#EFE0A8]" />
            <span>表现一般</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#FDEFEF] border border-[#F2C6C6]" />
            <span>表现较差</span>
          </span>
        </div>
      </div>
    </div>
  );
};
