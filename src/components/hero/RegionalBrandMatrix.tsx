import React, { useEffect, useState, useRef } from 'react';
import {
  Loader2,
  Clock,
  Grid3X3,
  ChevronRight,
  ArrowLeft,
  FolderOpen,
  Users,
} from 'lucide-react';
import {
  HeroProductFilterState,
  HeatmapTier,
  HeroOrgRole,
  HeroDrillLevel,
  RgmRegionKey,
  RegionalBrandMatrixResponse,
  RegionalMetricCellValue,
  RegionalMatrixBreadcrumbItem,
} from '../../types/heroProduct';
import {
  HERO_MT_NODES,
  HERO_RT_NODES,
  getDefaultOwnedOrgIds,
  fetchRegionalBrandPerformanceMatrix,
} from '../../data/heroRegionalMatrixService';
import { UserRolePerspective } from '../layout/Header';

interface RegionalBrandMatrixProps {
  filter: HeroProductFilterState;
  rolePerspective?: UserRolePerspective;
  onDrillLevelChange?: (level: HeroDrillLevel) => void;
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

function mapPerspectiveToHeroRole(perspective?: UserRolePerspective): HeroOrgRole {
  if (
    perspective === 'REGIONAL_RGM' ||
    perspective === 'REGIONAL_JAKARTA' ||
    perspective === 'REGIONAL_BANDUNG'
  ) {
    return 'RGM';
  }
  if (perspective === 'REGIONAL_MT' || perspective === 'REGIONAL_MT_RT') {
    return 'MT';
  }
  if (perspective === 'REGIONAL_RT') {
    return 'RT';
  }
  return 'HQ';
}

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
  rolePerspective = 'HQ',
  onDrillLevelChange,
  isId = false,
}) => {
  const activeRole = mapPerspectiveToHeroRole(rolePerspective);
  const defaults = getDefaultOwnedOrgIds();
  const ownedRgmId = defaults.ownedRgmId;
  const ownedMtId = defaults.ownedMtId;
  const ownedRtId = defaults.ownedRtId;

  // 当前下钻层级与选中节点
  const [drillLevel, setDrillLevel] = useState<HeroDrillLevel>(() => {
    if (activeRole === 'MT') return 'RGM';
    if (activeRole === 'RT') return 'RT';
    return 'NATIONAL';
  });
  const [selectedRgmId, setSelectedRgmId] = useState<RgmRegionKey | undefined>(() => {
    if (activeRole === 'MT') {
      return (HERO_MT_NODES.find(m => m.mtId === ownedMtId) || HERO_MT_NODES[0]).rgmId;
    }
    if (activeRole === 'RT') {
      return (HERO_RT_NODES.find(r => r.rtId === ownedRtId) || HERO_RT_NODES[0]).rgmId;
    }
    return undefined;
  });
  const [selectedMtId, setSelectedMtId] = useState<string | undefined>(() => {
    if (activeRole === 'RT') {
      return (HERO_RT_NODES.find(r => r.rtId === ownedRtId) || HERO_RT_NODES[0]).mtId;
    }
    return undefined;
  });

  const [matrixData, setMatrixData] = useState<RegionalBrandMatrixResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const prevRoleRef = useRef<HeroOrgRole>(activeRole);

  // 当系统顶层角色切换时，自动进入该角色的默认初始视图
  useEffect(() => {
    if (prevRoleRef.current !== activeRole) {
      prevRoleRef.current = activeRole;
      if (activeRole === 'HQ' || activeRole === 'RGM') {
        setDrillLevel('NATIONAL');
        setSelectedRgmId(undefined);
        setSelectedMtId(undefined);
      } else if (activeRole === 'MT') {
        const mtObj = HERO_MT_NODES.find(m => m.mtId === ownedMtId) || HERO_MT_NODES[0];
        setDrillLevel('RGM');
        setSelectedRgmId(mtObj.rgmId);
        setSelectedMtId(undefined);
      } else if (activeRole === 'RT') {
        const rtObj = HERO_RT_NODES.find(r => r.rtId === ownedRtId) || HERO_RT_NODES[0];
        setDrillLevel('RT');
        setSelectedRgmId(rtObj.rgmId);
        setSelectedMtId(rtObj.mtId);
      }
    }
  }, [activeRole, ownedMtId, ownedRtId]);

  // 顶部大区筛选变更且当前处于下钻状态时，若指定大区与当前选中RGM不一致，则回到初始层级
  const prevRegionFilterRef = useRef(filter.region);
  useEffect(() => {
    if (prevRegionFilterRef.current !== filter.region) {
      prevRegionFilterRef.current = filter.region;
      if (
        (activeRole === 'HQ' || activeRole === 'RGM') &&
        drillLevel !== 'NATIONAL' &&
        filter.region !== 'ALL' &&
        filter.region !== selectedRgmId
      ) {
        setDrillLevel('NATIONAL');
        setSelectedRgmId(undefined);
        setSelectedMtId(undefined);
      }
    }
  }, [filter.region, activeRole, drillLevel, selectedRgmId]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const timer = setTimeout(() => {
      fetchRegionalBrandPerformanceMatrix(filter, {
        role: activeRole,
        level: drillLevel,
        selectedRgmId,
        selectedMtId,
        ownedRgmId,
        ownedMtId,
        ownedRtId,
      })
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
    activeRole,
    drillLevel,
    selectedRgmId,
    selectedMtId,
    ownedRgmId,
    ownedMtId,
    ownedRtId,
  ]);

  // 同步当前下钻层级到父级（用于控制仅在总览页展示大单品列表）
  useEffect(() => {
    onDrillLevelChange?.(drillLevel);
  }, [drillLevel, onDrillLevelChange]);

  const handleRowClick = (rowId: string, nodeLevel: 'RGM' | 'MT' | 'RT', canDrill: boolean) => {
    if (!canDrill) return;
    if (nodeLevel === 'RGM') {
      setDrillLevel('RGM');
      setSelectedRgmId(rowId as RgmRegionKey);
      setSelectedMtId(undefined);
    } else if (nodeLevel === 'MT') {
      setDrillLevel('MT');
      setSelectedMtId(rowId);
    }
  };

  const handleBreadcrumbClick = (crumb: RegionalMatrixBreadcrumbItem) => {
    if (!crumb.clickable) return;
    if (crumb.level === 'NATIONAL') {
      setDrillLevel('NATIONAL');
      setSelectedRgmId(undefined);
      setSelectedMtId(undefined);
    } else if (crumb.level === 'RGM') {
      setDrillLevel('RGM');
      setSelectedRgmId(crumb.id as RgmRegionKey);
      setSelectedMtId(undefined);
    }
  };

  const handleGoBackOneLevel = () => {
    const clickableCrumbs = (matrixData?.breadcrumbs || []).filter(c => c.clickable);
    if (clickableCrumbs.length > 0) {
      handleBreadcrumbClick(clickableCrumbs[clickableCrumbs.length - 1]);
    }
  };

  const columns = matrixData?.columns || [];
  const rows = matrixData?.rows || [];
  const isSingleBrand = columns.length === 1;
  const breadcrumbs = matrixData?.breadcrumbs || [];
  const hasClickableParent = breadcrumbs.some(c => c.clickable);

  const rowHeaderTitle =
    matrixData?.level === 'RGM'
      ? 'MT'
      : matrixData?.level === 'MT' || matrixData?.level === 'RT'
      ? 'RT'
      : 'RGM';

  const isRtView = matrixData?.level === 'MT' || matrixData?.level === 'RT';

  return (
    <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-2xs overflow-hidden">
      {/* 1. 模块头部：标题 + 统计区间与环比区间 + 数据更新时间 */}
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

      {/* 2. 极简面包屑导航栏（仅保留层级路径，点击上级名称即可返回） */}
      <div className="px-5 py-2.5 bg-[#FAF8F5] border-b border-[#EFECE5]">
        <nav className="flex items-center gap-1.5 text-xs flex-wrap" aria-label="组织层级面包屑">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={`${crumb.level}-${crumb.id}`}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />}
                {crumb.clickable ? (
                  <button
                    type="button"
                    onClick={() => handleBreadcrumbClick(crumb)}
                    className="font-medium text-[#6B7280] hover:text-[#7A2E26] hover:underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className={
                      isLast
                        ? 'font-bold text-[#7A2E26]'
                        : 'font-medium text-[#6B7280]'
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* 3. RT 层级汇总 BA 统计条（不展示 BA 个人名单，仅保留汇总人数统计） */}
      {isRtView && matrixData && !matrixData.isEmptyState && matrixData.baSummary && (
        <div className="px-5 py-2 bg-[#FCFAF7] border-b border-[#EFECE5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="inline-flex items-center gap-1.5 text-[#374151] font-medium">
              <Users className="w-3.5 h-3.5 text-[#7A2E26]" />
              <span>RT 管理范围 BA 汇总：</span>
            </div>
            <div className="flex items-center gap-3 font-mono tabular-nums text-[11px]">
              <span className="text-[#4B5563]">
                应参与 BA：
                <strong className="text-[#111827] ml-0.5">
                  {matrixData.baSummary.totalBAs !== null ? `${matrixData.baSummary.totalBAs} 人` : '暂无数据'}
                </strong>
              </span>
              <span className="text-[#E5E7EB]">|</span>
              <span className="text-[#4B5563]">
                已参与 BA：
                <strong className="text-[#059669] ml-0.5">
                  {matrixData.baSummary.participatedBAs !== null
                    ? `${matrixData.baSummary.participatedBAs} 人`
                    : '暂无数据'}
                </strong>
              </span>
              <span className="text-[#E5E7EB]">|</span>
              <span className="text-[#4B5563]">
                未参与 BA：
                <strong className="text-[#DC2626] ml-0.5">
                  {matrixData.baSummary.unparticipatedBAs !== null
                    ? `${matrixData.baSummary.unparticipatedBAs} 人`
                    : '暂无数据'}
                </strong>
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[#9CA3AF]">
            最高下钻至 RT 层级，不展示 BA 个人明细
          </span>
        </div>
      )}

      {/* 4. 矩阵主体：左侧固定组织列 + 品牌列横向滚动（或空状态） */}
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
        ) : matrixData?.isEmptyState ? (
          <div className="py-12 px-6 text-center bg-[#FCFAF7]">
            <div className="w-10 h-10 rounded-full bg-[#FAF3F0] border border-[#EED9D3] flex items-center justify-center mx-auto mb-3">
              <FolderOpen className="w-5 h-5 text-[#7A2E26]" />
            </div>
            <div className="text-xs font-semibold text-[#1F2937]">
              {matrixData.emptyMessage || '当前组织暂无下级数据'}
            </div>
            {hasClickableParent && (
              <button
                type="button"
                onClick={handleGoBackOneLevel}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#7A2E26] hover:bg-[#64241D] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回上一级</span>
              </button>
            )}
          </div>
        ) : (
          <table
            className={`w-full border-collapse text-xs transition-opacity duration-150 ${
              isLoading ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <thead>
              <tr className="bg-[#FAF3F1] border-t-2 border-t-[#7A2E26] border-b border-b-[#E4D5D0]">
                {/* 左侧固定表头：随层级动态展示 RGM / MT / RT */}
                <th className="sticky left-0 z-20 bg-[#FAF3F1] py-2.5 px-4 text-left font-bold text-[#7A2E26] border-r border-[#E4D5D0] min-w-[152px] w-[168px] shadow-[2px_0_6px_-3px_rgba(0,0,0,0.06)]">
                  {rowHeaderTitle}
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
                <tr
                  key={row.nodeId}
                  onClick={() => handleRowClick(row.nodeId, row.nodeLevel, row.canDrillDown)}
                  className={`group ${row.canDrillDown ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {/* 左侧固定组织名称列（有权限行显示悬停及右箭头，无权限行及RT保持静态无箭头） */}
                  <td
                    className={`sticky left-0 z-10 py-2.5 px-4 font-semibold border-r border-[#E5E7EB] whitespace-nowrap shadow-[2px_0_6px_-3px_rgba(0,0,0,0.06)] transition-colors ${
                      row.isOwnOrg
                        ? 'bg-[#FDF9F7] text-[#1F2937]'
                        : 'bg-white text-[#1F2937]'
                    } ${row.canDrillDown ? 'group-hover:bg-[#FAF3F1]' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs leading-snug ${
                              row.canDrillDown ? 'group-hover:text-[#7A2E26]' : ''
                            }`}
                          >
                            {row.nodeName}
                          </span>
                          {row.isOwnOrg && (
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#FAF3F0] text-[#7A2E26] border border-[#EED9D3]">
                              本人
                            </span>
                          )}
                        </div>
                        {row.nodeLevel === 'RT' && row.baSummary && (
                          <div className="text-[10px] font-normal font-mono text-[#6B7280] mt-0.5 tabular-nums">
                            BA {row.baSummary.totalBAs ?? '—'} · 已参{' '}
                            {row.baSummary.participatedBAs ?? '—'} · 未参{' '}
                            {row.baSummary.unparticipatedBAs ?? '—'}
                          </div>
                        )}
                      </div>

                      {row.canDrillDown && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#7A2E26] group-hover:translate-x-0.5 transition-all shrink-0" />
                      )}
                    </div>
                  </td>

                  {/* 组织 × 品牌交叉单元格：整格统一使用一种浅色背景（按任务完成率分档） */}
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
                      {
                        key: 'coverage',
                        metric: cell.coverage,
                        kind: 'percent',
                        unit: 'pp',
                        isEmphasized: false,
                      },
                      {
                        key: 'completion',
                        metric: cell.completion,
                        kind: 'percent',
                        unit: 'pp',
                        isEmphasized: false,
                      },
                      {
                        key: 'perCapitaSales',
                        metric: cell.perCapitaSales,
                        kind: 'sales',
                        unit: '%',
                        isEmphasized: true,
                      },
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

      {/* 5. 底部统一指标说明 & 低饱和单元格背景图例 */}
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
