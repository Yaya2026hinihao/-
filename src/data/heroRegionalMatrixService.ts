import {
  HeroProductFilterState,
  HeroRgmRegion,
  MatrixBrandKey,
  RgmRegionKey,
  HeatmapTier,
  MetricChangeDirection,
  RegionalMetricCellValue,
  RegionalBrandMatrixCell,
  RegionalBrandMatrixColumn,
  RegionalBrandMatrixRow,
  RegionalBrandMatrixResponse,
  MonthKey,
} from '../types/heroProduct';
import {
  HERO_RGM_REGIONS,
  HERO_MATRIX_BRANDS,
  MOCK_HERO_BA_LIST,
} from './mockHeroProducts';

/**
 * 原始区域×品牌统计聚合记录接口
 * 后续对接真实业务接口（如 /api/hero-products/regional-matrix）时，
 * 只需替换 fetchRawRegionalBrandAggregates 数据来源，其余排名、环比、分档、渲染逻辑保持不变。
 */
export interface RegionalBrandPeriodAggregate {
  rgmId: RgmRegionKey;
  brandKey: MatrixBrandKey;
  /** 区域有效 BA 总人数（不区分品牌归属，含零销量及未参与培训的有效 BA） */
  effectiveBACount: number;
  /** 统计周期内参与该品牌培训的有效 BA 人数 */
  participatedBACount: number;
  /** 统计周期内应完成任务总数（人×任务） */
  requiredTasksCount: number;
  /** 统计周期内已完成任务总数（人×任务） */
  completedTasksCount: number;
  /** 统计周期内该品牌实际 SELL OUT 销量（PCS） */
  sellOutUnits: number;
}

export interface RegionalMatrixDataAdapter {
  updatedAt: string;
  queryPeriodAggregates: (
    startDate: string,
    endDate: string
  ) => Promise<RegionalBrandPeriodAggregate[] | null>;
}

const DATA_AVAILABLE_START = '2026-06-01';
const DATA_AVAILABLE_END = '2026-11-29';
const REFERENCE_WEEK_START = '2026-11-23'; // 本周一
const REFERENCE_WEEK_END = '2026-11-29';   // 本周日
const REFERENCE_MONTH: MonthKey = '2026-11';
const DATA_UPDATED_AT = '2026-11-23 11:28';

// ================= UTC 日期工具 =================
function parseUTC(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(dateStr: string, days: number): string {
  const dt = parseUTC(dateStr);
  dt.setUTCDate(dt.getUTCDate() + days);
  return formatUTC(dt);
}

function diffDaysInclusive(startStr: string, endStr: string): number {
  const a = parseUTC(startStr).getTime();
  const b = parseUTC(endStr).getTime();
  return Math.round((b - a) / (24 * 60 * 60 * 1000)) + 1;
}

function getMonthDateRange(monthKey: MonthKey): { start: string; end: string } {
  const [y, m] = monthKey.split('-').map(Number);
  const firstDay = new Date(Date.UTC(y, m - 1, 1));
  const lastDay = new Date(Date.UTC(y, m, 0));
  return { start: formatUTC(firstDay), end: formatUTC(lastDay) };
}

function getPreviousMonthKey(monthKey: MonthKey): string {
  const [y, m] = monthKey.split('-').map(Number);
  const prevFirst = new Date(Date.UTC(y, m - 2, 1));
  const py = prevFirst.getUTCFullYear();
  const pm = String(prevFirst.getUTCMonth() + 1).padStart(2, '0');
  return `${py}-${pm}`;
}

function getMonthKeyRange(monthKeyStr: string): { start: string; end: string } {
  const [y, m] = monthKeyStr.split('-').map(Number);
  const firstDay = new Date(Date.UTC(y, m - 1, 1));
  const lastDay = new Date(Date.UTC(y, m, 0));
  return { start: formatUTC(firstDay), end: formatUTC(lastDay) };
}

/**
 * 解析当前统计周期及对应的环比上一周期
 */
export function resolveMatrixPeriodWindows(filter: HeroProductFilterState): {
  currentStartDate: string;
  currentEndDate: string;
  previousStartDate: string;
  previousEndDate: string;
} {
  if (filter.periodType === 'THIS_WEEK') {
    return {
      currentStartDate: REFERENCE_WEEK_START,
      currentEndDate: REFERENCE_WEEK_END,
      previousStartDate: addDays(REFERENCE_WEEK_START, -7),
      previousEndDate: addDays(REFERENCE_WEEK_END, -7),
    };
  }

  if (filter.periodType === 'CUSTOM') {
    const rawStart = filter.customStartDate || '2026-11-01';
    const rawEnd = filter.customEndDate || '2026-11-15';
    const start = rawStart <= rawEnd ? rawStart : rawEnd;
    const end = rawStart <= rawEnd ? rawEnd : rawStart;
    const spanDays = Math.max(1, diffDaysInclusive(start, end));
    return {
      currentStartDate: start,
      currentEndDate: end,
      previousStartDate: addDays(start, -spanDays),
      previousEndDate: addDays(start, -1),
    };
  }

  const targetMonth = filter.periodType === 'THIS_MONTH' ? REFERENCE_MONTH : filter.month;
  const curr = getMonthDateRange(targetMonth);
  const prevMonthKey = getPreviousMonthKey(targetMonth);
  const prev = getMonthKeyRange(prevMonthKey);
  return {
    currentStartDate: curr.start,
    currentEndDate: curr.end,
    previousStartDate: prev.start,
    previousEndDate: prev.end,
  };
}

// ================= 原型数据生成适配器（保留清晰接口边界） =================
// 各 RGM 不区分品牌归属的有效 BA 总人数（严格取自 MOCK_HERO_BA_LIST）
const RGM_EFFECTIVE_BA_COUNTS: Record<RgmRegionKey, number> = HERO_RGM_REGIONS.reduce(
  (acc, rgm) => {
    acc[rgm.rgmId] = MOCK_HERO_BA_LIST.filter(ba => ba.rgmId === rgm.rgmId).length;
    return acc;
  },
  {} as Record<RgmRegionKey, number>
);

// 品牌基础人均日销量基准（反映不同品牌的自然销售体量差异，如 DM/YOU彩妆高于 FML）
const BRAND_DAILY_PER_CAPITA_BASE: Record<MatrixBrandKey, number> = {
  YOU_MAKEUP: 0.72,
  YOU_SKINCARE: 0.56,
  BNB: 0.64,
  DM: 0.78,
  LVJ: 0.44,
  FML: 0.34,
};

// 各 RGM 在区域执行力、培训节奏和单店动销上的真实梯度系数
const RGM_PROFILE_FACTORS: Record<
  RgmRegionKey,
  { coverageBias: number; completionBias: number; salesFactor: number }
> = {
  'rgm-1':  { coverageBias: 0.06,  completionBias: 0.08,  salesFactor: 1.24 },
  'rgm-2':  { coverageBias: 0.05,  completionBias: 0.06,  salesFactor: 1.18 },
  'rgm-3':  { coverageBias: 0.02,  completionBias: 0.02,  salesFactor: 1.04 },
  'rgm-4':  { coverageBias: -0.04, completionBias: -0.05, salesFactor: 0.88 },
  'rgm-5':  { coverageBias: 0.04,  completionBias: 0.04,  salesFactor: 1.09 },
  'rgm-6':  { coverageBias: -0.02, completionBias: -0.03, salesFactor: 0.91 },
  'rgm-7':  { coverageBias: -0.09, completionBias: -0.14, salesFactor: 0.72 },
  'rgm-8':  { coverageBias: 0.05,  completionBias: 0.07,  salesFactor: 1.19 },
  'rgm-9':  { coverageBias: 0.01,  completionBias: -0.01, salesFactor: 0.98 },
  'rgm-10': { coverageBias: -0.05, completionBias: -0.09, salesFactor: 0.82 },
  'rgm-11': { coverageBias: 0.02,  completionBias: 0.03,  salesFactor: 1.03 },
  'rgm-12': { coverageBias: -0.06, completionBias: -0.11, salesFactor: 0.76 },
  'rgm-13': { coverageBias: 0.03,  completionBias: 0.01,  salesFactor: 1.01 },
  'rgm-14': { coverageBias: -0.01, completionBias: -0.06, salesFactor: 0.86 },
};

function deterministicNoise(seedA: number, seedB: number, seedC: number): number {
  const x = Math.sin(seedA * 12.9898 + seedB * 78.233 + seedC * 37.719) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * 原型数据适配器：按给定起止日期计算各 RGM × 各品牌的原始统计计数
 * 若时间范围与有效数据区间无交集，返回 null（不补 0）
 */
const prototypeMatrixAdapter: RegionalMatrixDataAdapter = {
  updatedAt: DATA_UPDATED_AT,
  async queryPeriodAggregates(
    startDate: string,
    endDate: string
  ): Promise<RegionalBrandPeriodAggregate[] | null> {
    // 有效数据边界校验：无有效重叠则返回 null，不得用 0 替代缺失数据
    const overlapStart = startDate > DATA_AVAILABLE_START ? startDate : DATA_AVAILABLE_START;
    const overlapEnd = endDate < DATA_AVAILABLE_END ? endDate : DATA_AVAILABLE_END;
    if (overlapStart > overlapEnd) {
      return null;
    }

    const totalOverlapDays = diffDaysInclusive(overlapStart, overlapEnd);
    const periodAnchor = parseUTC(overlapStart).getUTCMonth() * 31 + parseUTC(overlapStart).getUTCDate();
    const isShortWindow = totalOverlapDays <= 10;

    const aggregates: RegionalBrandPeriodAggregate[] = [];

    HERO_RGM_REGIONS.forEach((rgm, rIdx) => {
      const effectiveBACount = RGM_EFFECTIVE_BA_COUNTS[rgm.rgmId] || 0;
      const profile = RGM_PROFILE_FACTORS[rgm.rgmId];

      HERO_MATRIX_BRANDS.forEach((brand, bIdx) => {
        const n1 = deterministicNoise(rIdx + 1, bIdx + 1, periodAnchor);
        const n2 = deterministicNoise(rIdx + 7, bIdx + 13, periodAnchor + 5);
        const n3 = deterministicNoise(rIdx + 19, bIdx + 3, periodAnchor + 11);

        // 1. 培训覆盖率（真实存在多个 RGM 达到 100% 的自然并列情况）
        const rawCovRatio = Math.min(
          1,
          Math.max(0.68, 0.945 + profile.coverageBias + (n1 - 0.42) * 0.085 - (isShortWindow ? 0.015 : 0))
        );
        const participatedBACount = Math.min(
          effectiveBACount,
          Math.round(effectiveBACount * rawCovRatio)
        );

        // 2. 任务完成率（区分高/中/低不同区域梯度）
        const tasksPerBA = isShortWindow ? 2 : 4;
        const requiredTasksCount = effectiveBACount * tasksPerBA;
        const rawCompRatio = Math.min(
          0.98,
          Math.max(0.56, 0.835 + profile.completionBias + (n2 - 0.5) * 0.14)
        );
        const completedTasksCount = Math.min(
          requiredTasksCount,
          Math.round(requiredTasksCount * rawCompRatio)
        );

        // 3. 实际 SELL OUT 销量（分子按品牌区分，分母严格复用同一套区域有效 BA 总人数）
        const brandDailyBase = BRAND_DAILY_PER_CAPITA_BASE[brand.key];
        // 季节与月度趋势微调
        const monthSeasonality = 1 + ((parseUTC(overlapStart).getUTCMonth() - 5) * 0.035);
        const regionalBrandBias = 0.88 + n3 * 0.28;
        const sellOutUnits = Math.max(
          1,
          Math.round(
            effectiveBACount *
              brandDailyBase *
              totalOverlapDays *
              profile.salesFactor *
              monthSeasonality *
              regionalBrandBias
          )
        );

        aggregates.push({
          rgmId: rgm.rgmId,
          brandKey: brand.key,
          effectiveBACount,
          participatedBACount,
          requiredTasksCount,
          completedTasksCount,
          sellOutUnits,
        });
      });
    });

    return aggregates;
  },
};

// ================= 纯计算函数：排名、环比、独立热力分档 =================

function round1(val: number): number {
  return Number(val.toFixed(1));
}

/**
 * 标准并列排名 (1, 1, 3...)：按当前筛选周期内同品牌 14 个 RGM 真实数值从高到低排序
 */
function assignCompetitionRanks(
  items: { rgmId: RgmRegionKey; value: number | null }[]
): Record<RgmRegionKey, number | null> {
  const rankMap = {} as Record<RgmRegionKey, number | null>;
  const validItems = items
    .filter((it): it is { rgmId: RgmRegionKey; value: number } => it.value !== null)
    .sort((a, b) => b.value - a.value);

  items.forEach(it => {
    if (it.value === null) {
      rankMap[it.rgmId] = null;
    }
  });

  let currentRank = 1;
  for (let i = 0; i < validItems.length; i++) {
    if (i > 0 && validItems[i].value < validItems[i - 1].value) {
      currentRank = i + 1;
    }
    rankMap[validItems[i].rgmId] = currentRank;
  }

  return rankMap;
}

/**
 * 计算百分点 (pp) 变化：用于覆盖率、任务完成率
 */
function computePointDelta(
  curr: number | null,
  prev: number | null
): { delta: number | null; direction: MetricChangeDirection } {
  if (curr === null || prev === null) {
    return { delta: null, direction: 'NONE' };
  }
  const diff = round1(curr - prev);
  if (Math.abs(diff) < 0.05) {
    return { delta: 0, direction: 'FLAT' };
  }
  return {
    delta: diff,
    direction: diff > 0 ? 'UP' : 'DOWN',
  };
}

/**
 * 计算百分比 (%) 变化：用于人均销量
 * 若上一周期缺失或为 0，返回 null（展示为「—」）
 */
function computePercentDelta(
  curr: number | null,
  prev: number | null
): { delta: number | null; direction: MetricChangeDirection } {
  if (curr === null || prev === null || prev === 0) {
    return { delta: null, direction: 'NONE' };
  }
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (pct === 0) {
    return { delta: 0, direction: 'FLAT' };
  }
  return {
    delta: pct,
    direction: pct > 0 ? 'UP' : 'DOWN',
  };
}

/**
 * 覆盖率独立分档（优先按业务目标值分档，允许大量 100% 时呈一致浅绿而不人为制造差异）
 */
function classifyCoverageTier(value: number | null): HeatmapTier {
  if (value === null) return 'NONE';
  if (value >= 95) return 'EXCELLENT';
  if (value >= 85) return 'GOOD';
  if (value >= 75) return 'FAIR';
  return 'WEAK';
}

/**
 * 任务完成率独立分档（按业务目标值分档）
 */
function classifyCompletionTier(value: number | null): HeatmapTier {
  if (value === null) return 'NONE';
  if (value >= 90) return 'EXCELLENT';
  if (value >= 80) return 'GOOD';
  if (value >= 70) return 'FAIR';
  return 'WEAK';
}

/**
 * 区域人均销量独立分档：以当前品牌全国人均销量作为参考标尺
 */
function classifyPerCapitaTier(
  value: number | null,
  nationalPerCapita: number | null
): HeatmapTier {
  if (value === null || nationalPerCapita === null || nationalPerCapita <= 0) {
    return 'NONE';
  }
  const ratio = value / nationalPerCapita;
  if (ratio >= 1.12) return 'EXCELLENT';
  if (ratio >= 0.95) return 'GOOD';
  if (ratio >= 0.78) return 'FAIR';
  return 'WEAK';
}

interface ComputedMetricSnapshot {
  coverage: number | null;
  completion: number | null;
  perCapitaSales: number | null;
  sellOutUnits: number;
  effectiveBACount: number;
}

function buildSnapshotMap(
  aggregates: RegionalBrandPeriodAggregate[] | null
): Map<string, ComputedMetricSnapshot> {
  const map = new Map<string, ComputedMetricSnapshot>();
  if (!aggregates) return map;

  aggregates.forEach(agg => {
    const coverage =
      agg.effectiveBACount > 0
        ? round1((agg.participatedBACount / agg.effectiveBACount) * 100)
        : null;
    const completion =
      agg.requiredTasksCount > 0
        ? round1((agg.completedTasksCount / agg.requiredTasksCount) * 100)
        : null;
    // 严格校验：使用不区分品牌归属的区域有效 BA 总人数作为分母
    const perCapitaSales =
      agg.effectiveBACount > 0 ? round1(agg.sellOutUnits / agg.effectiveBACount) : null;

    map.set(`${agg.rgmId}::${agg.brandKey}`, {
      coverage,
      completion,
      perCapitaSales,
      sellOutUnits: agg.sellOutUnits,
      effectiveBACount: agg.effectiveBACount,
    });
  });

  return map;
}

/**
 * 异步获取「全国区域培训与销售表现」矩阵数据
 * 完整执行：全国人均销量汇总、14个RGM同品牌独立排名、pp/% 环比、各指标独立热力分档及筛选过滤
 */
export async function fetchRegionalBrandPerformanceMatrix(
  filter: HeroProductFilterState,
  adapter: RegionalMatrixDataAdapter = prototypeMatrixAdapter
): Promise<RegionalBrandMatrixResponse> {
  const windows = resolveMatrixPeriodWindows(filter);

  const [currAggs, prevAggs] = await Promise.all([
    adapter.queryPeriodAggregates(windows.currentStartDate, windows.currentEndDate),
    adapter.queryPeriodAggregates(windows.previousStartDate, windows.previousEndDate),
  ]);

  const currMap = buildSnapshotMap(currAggs);
  const prevMap = buildSnapshotMap(prevAggs);

  // 全国有效 BA 总人数（全品牌统一共用，不区分品牌归属）
  const nationalEffectiveBACount = HERO_RGM_REGIONS.reduce(
    (sum, rgm) => sum + (RGM_EFFECTIVE_BA_COUNTS[rgm.rgmId] || 0),
    0
  );

  // 先基于全部 14 个 RGM、按每个品牌独立计算全国人均销量与全量排名
  const brandColumnsAll: Record<MatrixBrandKey, RegionalBrandMatrixColumn> = {} as Record<
    MatrixBrandKey,
    RegionalBrandMatrixColumn
  >;
  const fullCellsByRgmAndBrand: Record<
    RgmRegionKey,
    Record<MatrixBrandKey, RegionalBrandMatrixCell>
  > = {} as Record<RgmRegionKey, Record<MatrixBrandKey, RegionalBrandMatrixCell>>;

  HERO_RGM_REGIONS.forEach(rgm => {
    fullCellsByRgmAndBrand[rgm.rgmId] = {} as Record<MatrixBrandKey, RegionalBrandMatrixCell>;
  });

  HERO_MATRIX_BRANDS.forEach(brand => {
    let brandNationalSellOut = 0;
    let hasAnyBrandData = false;
    let prevBrandNationalSellOut = 0;
    let hasPrevBrandData = false;

    const covRankInputs: { rgmId: RgmRegionKey; value: number | null }[] = [];
    const compRankInputs: { rgmId: RgmRegionKey; value: number | null }[] = [];
    const salesRankInputs: { rgmId: RgmRegionKey; value: number | null }[] = [];

    HERO_RGM_REGIONS.forEach(rgm => {
      const snap = currMap.get(`${rgm.rgmId}::${brand.key}`);
      if (snap) {
        hasAnyBrandData = true;
        brandNationalSellOut += snap.sellOutUnits;
      }
      const prevSnap = prevMap.get(`${rgm.rgmId}::${brand.key}`);
      if (prevSnap) {
        hasPrevBrandData = true;
        prevBrandNationalSellOut += prevSnap.sellOutUnits;
      }
      covRankInputs.push({ rgmId: rgm.rgmId, value: snap?.coverage ?? null });
      compRankInputs.push({ rgmId: rgm.rgmId, value: snap?.completion ?? null });
      salesRankInputs.push({ rgmId: rgm.rgmId, value: snap?.perCapitaSales ?? null });
    });

    const nationalPerCapitaSales =
      hasAnyBrandData && nationalEffectiveBACount > 0
        ? round1(brandNationalSellOut / nationalEffectiveBACount)
        : null;

    const prevNationalPerCapitaSales =
      hasPrevBrandData && nationalEffectiveBACount > 0
        ? round1(prevBrandNationalSellOut / nationalEffectiveBACount)
        : null;

    const nationalSalesDelta = computePercentDelta(
      nationalPerCapitaSales,
      prevNationalPerCapitaSales
    );

    brandColumnsAll[brand.key] = {
      brandKey: brand.key,
      brandLabel: brand.label,
      nationalPerCapitaSales,
      nationalPerCapitaSalesDelta: nationalSalesDelta.delta,
      nationalPerCapitaSalesDirection: nationalSalesDelta.direction,
      nationalSellOutUnits: hasAnyBrandData ? brandNationalSellOut : null,
      nationalEffectiveBACount,
    };

    const covRanks = assignCompetitionRanks(covRankInputs);
    const compRanks = assignCompetitionRanks(compRankInputs);
    const salesRanks = assignCompetitionRanks(salesRankInputs);

    HERO_RGM_REGIONS.forEach(rgm => {
      const curr = currMap.get(`${rgm.rgmId}::${brand.key}`);
      const prev = prevMap.get(`${rgm.rgmId}::${brand.key}`);

      const covVal = curr?.coverage ?? null;
      const compVal = curr?.completion ?? null;
      const salesVal = curr?.perCapitaSales ?? null;

      const covDelta = computePointDelta(covVal, prev?.coverage ?? null);
      const compDelta = computePointDelta(compVal, prev?.completion ?? null);
      const salesDelta = computePercentDelta(salesVal, prev?.perCapitaSales ?? null);

      fullCellsByRgmAndBrand[rgm.rgmId][brand.key] = {
        rgmId: rgm.rgmId,
        brandKey: brand.key,
        hasData: Boolean(curr),
        coverage: {
          value: covVal,
          rank: covRanks[rgm.rgmId],
          delta: covDelta.delta,
          direction: covDelta.direction,
          tier: classifyCoverageTier(covVal),
        },
        completion: {
          value: compVal,
          rank: compRanks[rgm.rgmId],
          delta: compDelta.delta,
          direction: compDelta.direction,
          tier: classifyCompletionTier(compVal),
        },
        perCapitaSales: {
          value: salesVal,
          rank: salesRanks[rgm.rgmId],
          delta: salesDelta.delta,
          direction: salesDelta.direction,
          tier: classifyPerCapitaTier(salesVal, nationalPerCapitaSales),
        },
      };
    });
  });

  // 按筛选条件过滤展示列（全部品牌 -> 6 列；单品牌 -> 1 列）
  const visibleBrands =
    filter.brand === 'ALL'
      ? HERO_MATRIX_BRANDS
      : HERO_MATRIX_BRANDS.filter(b => b.key === filter.brand);
  const columns = visibleBrands.map(b => brandColumnsAll[b.key]);

  // 按筛选条件过滤展示行（全部大区 -> 14 个 RGM；指定大区 -> 对应 RGM）
  const visibleRgms: HeroRgmRegion[] =
    filter.region === 'ALL'
      ? HERO_RGM_REGIONS
      : filter.region.startsWith('rgm-')
      ? HERO_RGM_REGIONS.filter(r => r.rgmId === filter.region)
      : HERO_RGM_REGIONS.filter(r => r.parentCity === filter.region);

  const rows: RegionalBrandMatrixRow[] = visibleRgms.map(rgm => ({
    rgm,
    effectiveBACount: RGM_EFFECTIVE_BA_COUNTS[rgm.rgmId] || 0,
    cells: fullCellsByRgmAndBrand[rgm.rgmId],
  }));

  return {
    updatedAt: adapter.updatedAt,
    currentStartDate: windows.currentStartDate,
    currentEndDate: windows.currentEndDate,
    previousStartDate: windows.previousStartDate,
    previousEndDate: windows.previousEndDate,
    columns,
    rows,
  };
}
