import {
  HeroProductFilterState,
  HeroRgmRegion,
  HeroMtNode,
  HeroRtNode,
  HeroOrgRole,
  HeroDrillLevel,
  MatrixBrandKey,
  RgmRegionKey,
  HeatmapTier,
  MetricChangeDirection,
  RegionalMetricCellValue,
  RegionalBrandMatrixCell,
  RegionalBrandMatrixColumn,
  RegionalBrandMatrixRow,
  RegionalBrandMatrixResponse,
  RegionalMatrixBASummary,
  RegionalMatrixBreadcrumbItem,
  RegionalMatrixQueryContext,
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
 * 只需替换数据适配器来源，其余排名、环比、分档、下钻权限逻辑保持不变。
 */
export interface RegionalBrandPeriodAggregate {
  nodeId: string;
  brandKey: MatrixBrandKey;
  /** 组织单元有效 BA 总人数（不区分品牌归属，含零销量及未参与培训的有效 BA） */
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
const REFERENCE_WEEK_END = '2026-11-29'; // 本周日
const REFERENCE_MONTH: MonthKey = '2026-11';
const DATA_UPDATED_AT = '2026-11-23 11:28';

// ================= 1. 组织层级树配置：RGM → MT → RT =================

const MT_PERSON_NAMES: Record<RgmRegionKey, { name: string; rtCount: number }[]> = {
  'rgm-1': [
    { name: 'Putri Kartika', rtCount: 3 },
    { name: 'Bayu Pratama', rtCount: 2 },
    { name: 'Nadia Lestari', rtCount: 2 },
  ],
  'rgm-2': [
    { name: 'Raka Mahendra', rtCount: 3 },
    { name: 'Sinta Dewi', rtCount: 2 },
    { name: 'Fajar Nugroho', rtCount: 2 },
  ],
  'rgm-3': [
    { name: 'Laras Wibowo', rtCount: 2 },
    { name: 'Bagas Aditya', rtCount: 2 },
  ],
  'rgm-4': [
    { name: 'Wulan Permata', rtCount: 2 },
    { name: 'Eko Prasetyo', rtCount: 0 }, // 无下属 RT，用于展示真实空状态
  ],
  'rgm-5': [
    { name: 'Dina Anggraini', rtCount: 3 },
    { name: 'Yusuf Maulana', rtCount: 2 },
    { name: 'Citra Kirana', rtCount: 2 },
  ],
  'rgm-6': [
    { name: 'Hana Kusuma', rtCount: 2 },
    { name: 'Rizky Ramadhan', rtCount: 2 },
  ],
  'rgm-7': [
    { name: 'Tania Salsabila', rtCount: 2 },
    { name: 'Galih Prakoso', rtCount: 2 },
  ],
  'rgm-8': [
    { name: 'Maya Puspita', rtCount: 2 },
    { name: 'Aditya Saputra', rtCount: 2 },
  ],
  'rgm-9': [
    { name: 'Anisa Fitri', rtCount: 2 },
    { name: 'Dimas Kurniawan', rtCount: 2 },
  ],
  'rgm-10': [
    { name: 'Kadek Ayu', rtCount: 2 },
    { name: 'Made Wirawan', rtCount: 2 },
  ],
  'rgm-11': [
    { name: 'Sari Siregar', rtCount: 2 },
    { name: 'Rafi Harahap', rtCount: 2 },
  ],
  'rgm-12': [
    { name: 'Novi Tanjung', rtCount: 2 },
    { name: 'Andre Lubis', rtCount: 2 },
  ],
  'rgm-13': [
    { name: 'Intan Cahyani', rtCount: 2 },
    { name: 'Wahyu Setiawan', rtCount: 2 },
  ],
  'rgm-14': [], // 无下属 MT，用于展示真实空状态
};

const RT_FIRST_NAMES = [
  'Agus', 'Nina', 'Rama', 'Tia', 'Yoga', 'Ilham', 'Vina', 'Dedi',
  'Lia', 'Hadi', 'Rini', 'Bima', 'Mega', 'Fikri', 'Siska', 'Arif',
  'Yuni', 'Nanda', 'Gilang', 'Oktavia',
];
const RT_LAST_NAMES = [
  'Salim', 'Safitri', 'Aditya', 'Permata', 'Saputra', 'Maulana', 'Octavia', 'Wijaya',
  'Utami', 'Pratama', 'Kusuma', 'Santoso', 'Hidayat', 'Nugraha', 'Lestari', 'Rahman',
];

export const HERO_MT_NODES: HeroMtNode[] = [];
export const HERO_RT_NODES: HeroRtNode[] = [];

(() => {
  let rtGlobalCounter = 0;
  HERO_RGM_REGIONS.forEach((rgm, rIdx) => {
    const mtSpecs = MT_PERSON_NAMES[rgm.rgmId] || [];
    mtSpecs.forEach((spec, mIdx) => {
      const mtNum = mIdx + 1;
      const mtId = `mt-${rIdx + 1}-${mtNum}`;
      const mtNode: HeroMtNode = {
        mtId,
        mtName: spec.name,
        titleLabel: `MT ${mtNum} · ${spec.name}`,
        rgmId: rgm.rgmId,
        hasRtChildren: spec.rtCount > 0,
      };
      HERO_MT_NODES.push(mtNode);

      for (let k = 0; k < spec.rtCount; k++) {
        const rtNum = k + 1;
        const rtId = `rt-${rIdx + 1}-${mtNum}-${rtNum}`;
        const fName = RT_FIRST_NAMES[(rtGlobalCounter * 3 + rIdx + mIdx) % RT_FIRST_NAMES.length];
        const lName = RT_LAST_NAMES[(rtGlobalCounter * 5 + mIdx + k) % RT_LAST_NAMES.length];
        rtGlobalCounter++;
        HERO_RT_NODES.push({
          rtId,
          rtName: `${fName} ${lName}`,
          titleLabel: `RT ${rtNum} · ${fName} ${lName}`,
          mtId,
          rgmId: rgm.rgmId,
        });
      }
    });
  });
})();

export function getMtsByRgmId(rgmId: RgmRegionKey): HeroMtNode[] {
  return HERO_MT_NODES.filter(m => m.rgmId === rgmId);
}

export function getRtsByMtId(mtId: string): HeroRtNode[] {
  return HERO_RT_NODES.filter(r => r.mtId === mtId);
}

export function getDefaultOwnedOrgIds(): {
  ownedRgmId: RgmRegionKey;
  ownedMtId: string;
  ownedRtId: string;
} {
  return {
    ownedRgmId: 'rgm-1',
    ownedMtId: 'mt-1-1',
    ownedRtId: 'rt-1-1-1',
  };
}

// ================= 2. UTC 日期工具 =================

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

// ================= 3. BA 人数分配与原型数据生成适配器 =================

// 各 RGM 不区分品牌归属的有效 BA 总人数（严格取自 MOCK_HERO_BA_LIST）
const RGM_EFFECTIVE_BA_COUNTS: Record<RgmRegionKey, number> = HERO_RGM_REGIONS.reduce(
  (acc, rgm) => {
    acc[rgm.rgmId] = MOCK_HERO_BA_LIST.filter(ba => ba.rgmId === rgm.rgmId).length;
    return acc;
  },
  {} as Record<RgmRegionKey, number>
);

function splitCountEvenly(total: number, parts: number): number[] {
  if (parts <= 0) return [];
  const base = Math.floor(total / parts);
  const rem = total % parts;
  return Array.from({ length: parts }, (_, i) => base + (i < rem ? 1 : 0));
}

const MT_EFFECTIVE_BA_COUNTS: Record<string, number> = {};
const RT_EFFECTIVE_BA_COUNTS: Record<string, number> = {};

HERO_RGM_REGIONS.forEach(rgm => {
  const rgmBAs = RGM_EFFECTIVE_BA_COUNTS[rgm.rgmId] || 0;
  const mts = getMtsByRgmId(rgm.rgmId);
  const mtCounts = splitCountEvenly(rgmBAs, mts.length);
  mts.forEach((mt, idx) => {
    const mtBAs = mtCounts[idx] || 0;
    MT_EFFECTIVE_BA_COUNTS[mt.mtId] = mtBAs;
    const rts = getRtsByMtId(mt.mtId);
    const rtCounts = splitCountEvenly(mtBAs, rts.length);
    rts.forEach((rt, rIdx) => {
      RT_EFFECTIVE_BA_COUNTS[rt.rtId] = rtCounts[rIdx] || 0;
    });
  });
});

// 品牌基础人均日销量基准
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

function generateNodeBrandAggregate(params: {
  nodeId: string;
  seedNode: number;
  seedBrand: number;
  periodAnchor: number;
  totalOverlapDays: number;
  overlapMonth: number;
  isShortWindow: boolean;
  effectiveBACount: number;
  coverageBias: number;
  completionBias: number;
  salesFactor: number;
  brandKey: MatrixBrandKey;
}): RegionalBrandPeriodAggregate {
  const {
    nodeId,
    seedNode,
    seedBrand,
    periodAnchor,
    totalOverlapDays,
    overlapMonth,
    isShortWindow,
    effectiveBACount,
    coverageBias,
    completionBias,
    salesFactor,
    brandKey,
  } = params;

  const n1 = deterministicNoise(seedNode + 1, seedBrand + 1, periodAnchor);
  const n2 = deterministicNoise(seedNode + 7, seedBrand + 13, periodAnchor + 5);
  const n3 = deterministicNoise(seedNode + 19, seedBrand + 3, periodAnchor + 11);

  const rawCovRatio = Math.min(
    1,
    Math.max(0.65, 0.945 + coverageBias + (n1 - 0.42) * 0.085 - (isShortWindow ? 0.015 : 0))
  );
  const participatedBACount = Math.min(
    effectiveBACount,
    Math.round(effectiveBACount * rawCovRatio)
  );

  const tasksPerBA = isShortWindow ? 2 : 4;
  const requiredTasksCount = effectiveBACount * tasksPerBA;
  const rawCompRatio = Math.min(
    0.98,
    Math.max(0.54, 0.835 + completionBias + (n2 - 0.5) * 0.14)
  );
  const completedTasksCount = Math.min(
    requiredTasksCount,
    Math.round(requiredTasksCount * rawCompRatio)
  );

  const brandDailyBase = BRAND_DAILY_PER_CAPITA_BASE[brandKey];
  const monthSeasonality = 1 + (overlapMonth - 5) * 0.035;
  const regionalBrandBias = 0.88 + n3 * 0.28;
  const sellOutUnits = Math.max(
    1,
    Math.round(
      effectiveBACount *
        brandDailyBase *
        totalOverlapDays *
        salesFactor *
        monthSeasonality *
        regionalBrandBias
    )
  );

  return {
    nodeId,
    brandKey,
    effectiveBACount,
    participatedBACount,
    requiredTasksCount,
    completedTasksCount,
    sellOutUnits,
  };
}

/**
 * 原型数据适配器：按给定起止日期计算 RGM / MT / RT × 各品牌的原始统计计数
 * 若时间范围与有效数据区间无交集，返回 null（不补 0）
 */
const prototypeMatrixAdapter: RegionalMatrixDataAdapter = {
  updatedAt: DATA_UPDATED_AT,
  async queryPeriodAggregates(
    startDate: string,
    endDate: string
  ): Promise<RegionalBrandPeriodAggregate[] | null> {
    const overlapStart = startDate > DATA_AVAILABLE_START ? startDate : DATA_AVAILABLE_START;
    const overlapEnd = endDate < DATA_AVAILABLE_END ? endDate : DATA_AVAILABLE_END;
    if (overlapStart > overlapEnd) {
      return null;
    }

    const totalOverlapDays = diffDaysInclusive(overlapStart, overlapEnd);
    const overlapDate = parseUTC(overlapStart);
    const periodAnchor = overlapDate.getUTCMonth() * 31 + overlapDate.getUTCDate();
    const overlapMonth = overlapDate.getUTCMonth();
    const isShortWindow = totalOverlapDays <= 10;

    const aggregates: RegionalBrandPeriodAggregate[] = [];

    // 1. 14 个 RGM 层级统计（保持原有数字完全稳定）
    HERO_RGM_REGIONS.forEach((rgm, rIdx) => {
      const effectiveBACount = RGM_EFFECTIVE_BA_COUNTS[rgm.rgmId] || 0;
      const profile = RGM_PROFILE_FACTORS[rgm.rgmId];

      HERO_MATRIX_BRANDS.forEach((brand, bIdx) => {
        aggregates.push(
          generateNodeBrandAggregate({
            nodeId: rgm.rgmId,
            seedNode: rIdx,
            seedBrand: bIdx,
            periodAnchor,
            totalOverlapDays,
            overlapMonth,
            isShortWindow,
            effectiveBACount,
            coverageBias: profile.coverageBias,
            completionBias: profile.completionBias,
            salesFactor: profile.salesFactor,
            brandKey: brand.key,
          })
        );
      });
    });

    // 2. MT 层级统计
    HERO_MT_NODES.forEach((mt, mIdx) => {
      const effectiveBACount = MT_EFFECTIVE_BA_COUNTS[mt.mtId] || 0;
      const rgmProfile = RGM_PROFILE_FACTORS[mt.rgmId];
      // MT 间自然差异梯度
      const mtBiasOffset = ((mIdx % 3) - 1) * -0.045;
      const mtSalesScale = 1 + ((1 - (mIdx % 3)) * 0.08);

      HERO_MATRIX_BRANDS.forEach((brand, bIdx) => {
        aggregates.push(
          generateNodeBrandAggregate({
            nodeId: mt.mtId,
            seedNode: 100 + mIdx,
            seedBrand: bIdx,
            periodAnchor,
            totalOverlapDays,
            overlapMonth,
            isShortWindow,
            effectiveBACount,
            coverageBias: rgmProfile.coverageBias + mtBiasOffset * 0.6,
            completionBias: rgmProfile.completionBias + mtBiasOffset * 1.4,
            salesFactor: rgmProfile.salesFactor * mtSalesScale,
            brandKey: brand.key,
          })
        );
      });
    });

    // 3. RT 层级统计
    HERO_RT_NODES.forEach((rt, rtIdx) => {
      const effectiveBACount = RT_EFFECTIVE_BA_COUNTS[rt.rtId] || 0;
      const rgmProfile = RGM_PROFILE_FACTORS[rt.rgmId];
      const rtBiasOffset = ((rtIdx % 4) - 1.5) * -0.04;
      const rtSalesScale = 1 + ((1.5 - (rtIdx % 4)) * 0.07);

      HERO_MATRIX_BRANDS.forEach((brand, bIdx) => {
        aggregates.push(
          generateNodeBrandAggregate({
            nodeId: rt.rtId,
            seedNode: 400 + rtIdx,
            seedBrand: bIdx,
            periodAnchor,
            totalOverlapDays,
            overlapMonth,
            isShortWindow,
            effectiveBACount,
            coverageBias: rgmProfile.coverageBias + rtBiasOffset * 0.65,
            completionBias: rgmProfile.completionBias + rtBiasOffset * 1.5,
            salesFactor: rgmProfile.salesFactor * rtSalesScale,
            brandKey: brand.key,
          })
        );
      });
    });

    return aggregates;
  },
};

// ================= 4. 纯计算函数：排名、环比、独立热力分档 =================

function round1(val: number): number {
  return Number(val.toFixed(1));
}

function assignCompetitionRanks(
  items: { nodeId: string; value: number | null }[]
): Record<string, number | null> {
  const rankMap: Record<string, number | null> = {};
  const validItems = items
    .filter((it): it is { nodeId: string; value: number } => it.value !== null)
    .sort((a, b) => b.value - a.value);

  items.forEach(it => {
    if (it.value === null) {
      rankMap[it.nodeId] = null;
    }
  });

  let currentRank = 1;
  for (let i = 0; i < validItems.length; i++) {
    if (i > 0 && validItems[i].value < validItems[i - 1].value) {
      currentRank = i + 1;
    }
    rankMap[validItems[i].nodeId] = currentRank;
  }

  return rankMap;
}

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

function classifyCoverageTier(value: number | null): HeatmapTier {
  if (value === null) return 'NONE';
  if (value >= 95) return 'EXCELLENT';
  if (value >= 85) return 'GOOD';
  if (value >= 75) return 'FAIR';
  return 'WEAK';
}

function classifyCompletionTier(value: number | null): HeatmapTier {
  if (value === null) return 'NONE';
  if (value >= 90) return 'EXCELLENT';
  if (value >= 80) return 'GOOD';
  if (value >= 70) return 'FAIR';
  return 'WEAK';
}

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
  participatedBACount: number;
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
    const perCapitaSales =
      agg.effectiveBACount > 0 ? round1(agg.sellOutUnits / agg.effectiveBACount) : null;

    map.set(`${agg.nodeId}::${agg.brandKey}`, {
      coverage,
      completion,
      perCapitaSales,
      sellOutUnits: agg.sellOutUnits,
      effectiveBACount: agg.effectiveBACount,
      participatedBACount: agg.participatedBACount,
    });
  });

  return map;
}

/**
 * 计算同一组织节点集合在当前筛选品牌下的指标、并列排名及环比变化
 */
function buildCellsForSiblingNodes(
  siblingNodeIds: string[],
  currMap: Map<string, ComputedMetricSnapshot>,
  prevMap: Map<string, ComputedMetricSnapshot>,
  nationalPerCapitaByBrand: Record<MatrixBrandKey, number | null>
): Record<string, Record<MatrixBrandKey, RegionalBrandMatrixCell>> {
  const result: Record<string, Record<MatrixBrandKey, RegionalBrandMatrixCell>> = {};
  siblingNodeIds.forEach(id => {
    result[id] = {} as Record<MatrixBrandKey, RegionalBrandMatrixCell>;
  });

  HERO_MATRIX_BRANDS.forEach(brand => {
    const covInputs = siblingNodeIds.map(id => ({
      nodeId: id,
      value: currMap.get(`${id}::${brand.key}`)?.coverage ?? null,
    }));
    const compInputs = siblingNodeIds.map(id => ({
      nodeId: id,
      value: currMap.get(`${id}::${brand.key}`)?.completion ?? null,
    }));
    const salesInputs = siblingNodeIds.map(id => ({
      nodeId: id,
      value: currMap.get(`${id}::${brand.key}`)?.perCapitaSales ?? null,
    }));

    const covRanks = assignCompetitionRanks(covInputs);
    const compRanks = assignCompetitionRanks(compInputs);
    const salesRanks = assignCompetitionRanks(salesInputs);

    siblingNodeIds.forEach(nodeId => {
      const curr = currMap.get(`${nodeId}::${brand.key}`);
      const prev = prevMap.get(`${nodeId}::${brand.key}`);

      const covVal = curr?.coverage ?? null;
      const compVal = curr?.completion ?? null;
      const salesVal = curr?.perCapitaSales ?? null;

      const covDelta = computePointDelta(covVal, prev?.coverage ?? null);
      const compDelta = computePointDelta(compVal, prev?.completion ?? null);
      const salesDelta = computePercentDelta(salesVal, prev?.perCapitaSales ?? null);

      result[nodeId][brand.key] = {
        rgmId: nodeId as RgmRegionKey,
        brandKey: brand.key,
        hasData: Boolean(curr),
        coverage: {
          value: covVal,
          rank: covRanks[nodeId],
          delta: covDelta.delta,
          direction: covDelta.direction,
          tier: classifyCoverageTier(covVal),
        },
        completion: {
          value: compVal,
          rank: compRanks[nodeId],
          delta: compDelta.delta,
          direction: compDelta.direction,
          tier: classifyCompletionTier(compVal),
        },
        perCapitaSales: {
          value: salesVal,
          rank: salesRanks[nodeId],
          delta: salesDelta.delta,
          direction: salesDelta.direction,
          tier: classifyPerCapitaTier(salesVal, nationalPerCapitaByBrand[brand.key]),
        },
      };
    });
  });

  return result;
}

/**
 * 计算 RT 节点的汇总 BA 统计（应参与 BA 人数、已参与 BA 人数、未参与 BA 人数）
 * 严格只返回聚合人数，不暴露任何 BA 个人名单
 */
function computeRtBASummary(
  rtId: string,
  effectiveBACount: number,
  visibleBrandKeys: MatrixBrandKey[],
  currMap: Map<string, ComputedMetricSnapshot>,
  hasCurrData: boolean
): RegionalMatrixBASummary {
  if (!hasCurrData) {
    return {
      totalBAs: effectiveBACount,
      participatedBAs: null,
      unparticipatedBAs: null,
    };
  }
  const counts = visibleBrandKeys
    .map(bKey => currMap.get(`${rtId}::${bKey}`)?.participatedBACount)
    .filter((v): v is number => typeof v === 'number');

  if (counts.length === 0) {
    return {
      totalBAs: effectiveBACount,
      participatedBAs: null,
      unparticipatedBAs: null,
    };
  }

  // 若选单品牌，取该品牌已参与人数；若全品牌，取至少参与任一品牌培训的去重估算人数（取各品牌最大并受总人数约束）
  const participatedBAs = Math.min(effectiveBACount, Math.max(...counts));
  const unparticipatedBAs = Math.max(0, effectiveBACount - participatedBAs);

  return {
    totalBAs: effectiveBACount,
    participatedBAs,
    unparticipatedBAs,
  };
}

/**
 * 按登录角色权限校验并规范化当前查询层级与节点
 */
function resolveAuthorizedContext(ctx: RegionalMatrixQueryContext): {
  role: HeroOrgRole;
  level: HeroDrillLevel;
  rgmId?: RgmRegionKey;
  mtId?: string;
  rtId?: string;
} {
  const { role, level, selectedRgmId, selectedMtId, ownedRgmId, ownedMtId, ownedRtId } = ctx;

  if (role === 'RT') {
    const rtObj = HERO_RT_NODES.find(r => r.rtId === ownedRtId) || HERO_RT_NODES[0];
    return {
      role: 'RT',
      level: 'RT',
      rgmId: rtObj.rgmId,
      mtId: rtObj.mtId,
      rtId: rtObj.rtId,
    };
  }

  if (role === 'MT') {
    const ownedMt = HERO_MT_NODES.find(m => m.mtId === ownedMtId) || HERO_MT_NODES[0];
    if (level === 'MT') {
      return {
        role: 'MT',
        level: 'MT',
        rgmId: ownedMt.rgmId,
        mtId: ownedMt.mtId,
      };
    }
    return {
      role: 'MT',
      level: 'RGM',
      rgmId: ownedMt.rgmId,
    };
  }

  if (role === 'RGM') {
    if (level === 'MT' && selectedMtId) {
      const targetMt = HERO_MT_NODES.find(m => m.mtId === selectedMtId);
      if (targetMt && targetMt.rgmId === ownedRgmId) {
        return {
          role: 'RGM',
          level: 'MT',
          rgmId: ownedRgmId,
          mtId: targetMt.mtId,
        };
      }
    }
    if (level === 'RGM' && selectedRgmId === ownedRgmId) {
      return {
        role: 'RGM',
        level: 'RGM',
        rgmId: ownedRgmId,
      };
    }
    return {
      role: 'RGM',
      level: 'NATIONAL',
    };
  }

  // HQ 拥有全国查看和完整下钻权限
  if (level === 'MT' && selectedMtId) {
    const targetMt = HERO_MT_NODES.find(m => m.mtId === selectedMtId);
    if (targetMt) {
      return {
        role: 'HQ',
        level: 'MT',
        rgmId: targetMt.rgmId,
        mtId: targetMt.mtId,
      };
    }
  }
  if (level === 'RGM' && selectedRgmId) {
    const targetRgm = HERO_RGM_REGIONS.find(r => r.rgmId === selectedRgmId);
    if (targetRgm) {
      return {
        role: 'HQ',
        level: 'RGM',
        rgmId: targetRgm.rgmId,
      };
    }
  }
  return {
    role: 'HQ',
    level: 'NATIONAL',
  };
}

const DEFAULT_QUERY_CONTEXT: RegionalMatrixQueryContext = {
  role: 'HQ',
  level: 'NATIONAL',
  ...getDefaultOwnedOrgIds(),
};

/**
 * 异步获取「全国区域培训与销售表现」矩阵数据（支持 HQ -> RGM -> MT -> RT 多层级下钻与角色权限控制）
 */
export async function fetchRegionalBrandPerformanceMatrix(
  filter: HeroProductFilterState,
  queryContext: RegionalMatrixQueryContext = DEFAULT_QUERY_CONTEXT,
  adapter: RegionalMatrixDataAdapter = prototypeMatrixAdapter
): Promise<RegionalBrandMatrixResponse> {
  const windows = resolveMatrixPeriodWindows(filter);
  const auth = resolveAuthorizedContext(queryContext);

  const [currAggs, prevAggs] = await Promise.all([
    adapter.queryPeriodAggregates(windows.currentStartDate, windows.currentEndDate),
    adapter.queryPeriodAggregates(windows.previousStartDate, windows.previousEndDate),
  ]);

  const currMap = buildSnapshotMap(currAggs);
  const prevMap = buildSnapshotMap(prevAggs);
  const hasCurrData = Boolean(currAggs);

  // 全国有效 BA 总人数（全品牌统一共用，不区分品牌归属）
  const nationalEffectiveBACount = HERO_RGM_REGIONS.reduce(
    (sum, rgm) => sum + (RGM_EFFECTIVE_BA_COUNTS[rgm.rgmId] || 0),
    0
  );

  // 1. 计算品牌列头（全品牌全国人均销量及环比）
  const brandColumnsAll: Record<MatrixBrandKey, RegionalBrandMatrixColumn> = {} as Record<
    MatrixBrandKey,
    RegionalBrandMatrixColumn
  >;
  const nationalPerCapitaByBrand: Record<MatrixBrandKey, number | null> = {} as Record<
    MatrixBrandKey,
    number | null
  >;

  HERO_MATRIX_BRANDS.forEach(brand => {
    let brandNationalSellOut = 0;
    let hasAnyBrandData = false;
    let prevBrandNationalSellOut = 0;
    let hasPrevBrandData = false;

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

    nationalPerCapitaByBrand[brand.key] = nationalPerCapitaSales;
    brandColumnsAll[brand.key] = {
      brandKey: brand.key,
      brandLabel: brand.label,
      nationalPerCapitaSales,
      nationalPerCapitaSalesDelta: nationalSalesDelta.delta,
      nationalPerCapitaSalesDirection: nationalSalesDelta.direction,
      nationalSellOutUnits: hasAnyBrandData ? brandNationalSellOut : null,
      nationalEffectiveBACount,
    };
  });

  const visibleBrands =
    filter.brand === 'ALL'
      ? HERO_MATRIX_BRANDS
      : HERO_MATRIX_BRANDS.filter(b => b.key === filter.brand);
  const columns = visibleBrands.map(b => brandColumnsAll[b.key]);
  const visibleBrandKeys = visibleBrands.map(b => b.key);

  // 2. 根据当前权限与下钻层级构建纵轴行、面包屑及空状态
  let rows: RegionalBrandMatrixRow[] = [];
  let breadcrumbs: RegionalMatrixBreadcrumbItem[] = [];
  let currentOrgName = '全国区域';
  let childCount = 0;
  let childUnitLabel = 'RGM';
  let isEmptyState = false;
  let emptyMessage: string | undefined;
  let baSummary: RegionalMatrixBASummary | undefined;

  if (auth.level === 'NATIONAL') {
    // 全国视图：纵轴为 14 个 RGM（受大区筛选联动控制）
    const allRgmIds = HERO_RGM_REGIONS.map(r => r.rgmId);
    const rgmCells = buildCellsForSiblingNodes(
      allRgmIds,
      currMap,
      prevMap,
      nationalPerCapitaByBrand
    );

    const visibleRgms: HeroRgmRegion[] =
      filter.region === 'ALL'
        ? HERO_RGM_REGIONS
        : filter.region.startsWith('rgm-')
        ? HERO_RGM_REGIONS.filter(r => r.rgmId === filter.region)
        : HERO_RGM_REGIONS.filter(r => r.parentCity === filter.region);

    rows = visibleRgms.map(rgm => {
      const isOwn = auth.role === 'RGM' && rgm.rgmId === queryContext.ownedRgmId;
      const canDrill = auth.role === 'HQ' || isOwn;
      return {
        nodeId: rgm.rgmId,
        nodeName: rgm.rgmName,
        nodeSubLabel: rgm.regionName,
        nodeLevel: 'RGM',
        canDrillDown: canDrill,
        isOwnOrg: isOwn,
        rgm,
        effectiveBACount: RGM_EFFECTIVE_BA_COUNTS[rgm.rgmId] || 0,
        cells: rgmCells[rgm.rgmId],
      };
    });

    currentOrgName = '全国区域';
    childCount = rows.length;
    childUnitLabel = '个 RGM';
    breadcrumbs = [{ level: 'NATIONAL', id: 'ALL', label: '全国区域', clickable: false }];
  } else if (auth.level === 'RGM' && auth.rgmId) {
    // RGM 视图：纵轴为该 RGM 下属全部 MT
    const targetRgm = HERO_RGM_REGIONS.find(r => r.rgmId === auth.rgmId)!;
    const mts = getMtsByRgmId(auth.rgmId);
    const mtIds = mts.map(m => m.mtId);
    const mtCells = buildCellsForSiblingNodes(
      mtIds,
      currMap,
      prevMap,
      nationalPerCapitaByBrand
    );

    rows = mts.map(mt => {
      const isOwn = auth.role === 'MT' && mt.mtId === queryContext.ownedMtId;
      const canDrill = auth.role === 'HQ' || auth.role === 'RGM' || isOwn;
      return {
        nodeId: mt.mtId,
        nodeName: mt.titleLabel,
        nodeSubLabel: targetRgm.regionName,
        nodeLevel: 'MT',
        canDrillDown: canDrill,
        isOwnOrg: isOwn,
        mt,
        effectiveBACount: MT_EFFECTIVE_BA_COUNTS[mt.mtId] || 0,
        cells: mtCells[mt.mtId],
      };
    });

    currentOrgName = targetRgm.rgmName;
    childCount = rows.length;
    childUnitLabel = '个 MT';

    if (rows.length === 0) {
      isEmptyState = true;
      emptyMessage = `当前 RGM「${targetRgm.rgmName}」暂无下属 MT 组织架构，暂不展示虚构下级数据。`;
    }

    if (auth.role === 'MT') {
      // MT 角色不能回到全国区域视图，面包屑根级为所属 RGM
      breadcrumbs = [
        { level: 'RGM', id: targetRgm.rgmId, label: `${targetRgm.rgmName}`, clickable: false },
      ];
    } else {
      breadcrumbs = [
        { level: 'NATIONAL', id: 'ALL', label: '全国区域', clickable: true },
        { level: 'RGM', id: targetRgm.rgmId, label: targetRgm.rgmName, clickable: false },
      ];
    }
  } else if (auth.level === 'MT' && auth.rgmId && auth.mtId) {
    // MT 视图：纵轴为该 MT 下属全部 RT
    const targetRgm = HERO_RGM_REGIONS.find(r => r.rgmId === auth.rgmId)!;
    const targetMt = HERO_MT_NODES.find(m => m.mtId === auth.mtId)!;
    const rts = getRtsByMtId(auth.mtId);
    const rtIds = rts.map(r => r.rtId);
    const rtCells = buildCellsForSiblingNodes(
      rtIds,
      currMap,
      prevMap,
      nationalPerCapitaByBrand
    );

    rows = rts.map(rt => {
      const effectiveBACount = RT_EFFECTIVE_BA_COUNTS[rt.rtId] || 0;
      const rowBASummary = computeRtBASummary(
        rt.rtId,
        effectiveBACount,
        visibleBrandKeys,
        currMap,
        hasCurrData
      );
      return {
        nodeId: rt.rtId,
        nodeName: rt.titleLabel,
        nodeSubLabel: targetMt.mtName,
        nodeLevel: 'RT',
        canDrillDown: false, // RT 为最末级展示层级，不再下钻到 BA
        rt,
        effectiveBACount,
        baSummary: rowBASummary,
        cells: rtCells[rt.rtId],
      };
    });

    currentOrgName = targetMt.titleLabel;
    childCount = rows.length;
    childUnitLabel = '个 RT';

    if (rows.length === 0) {
      isEmptyState = true;
      emptyMessage = `当前 MT「${targetMt.titleLabel}」暂无下属 RT 组织架构，暂不展示虚构下级数据。`;
    } else {
      const totalBAs = rows.reduce((s, r) => s + (r.baSummary?.totalBAs ?? 0), 0);
      const allHaveParticipated = rows.every(r => r.baSummary?.participatedBAs !== null);
      baSummary = {
        totalBAs,
        participatedBAs: allHaveParticipated
          ? rows.reduce((s, r) => s + (r.baSummary?.participatedBAs ?? 0), 0)
          : null,
        unparticipatedBAs: allHaveParticipated
          ? rows.reduce((s, r) => s + (r.baSummary?.unparticipatedBAs ?? 0), 0)
          : null,
      };
    }

    if (auth.role === 'MT') {
      breadcrumbs = [
        { level: 'RGM', id: targetRgm.rgmId, label: targetRgm.rgmName, clickable: true },
        { level: 'MT', id: targetMt.mtId, label: targetMt.titleLabel, clickable: false },
      ];
    } else {
      breadcrumbs = [
        { level: 'NATIONAL', id: 'ALL', label: '全国区域', clickable: true },
        { level: 'RGM', id: targetRgm.rgmId, label: targetRgm.rgmName, clickable: true },
        { level: 'MT', id: targetMt.mtId, label: targetMt.titleLabel, clickable: false },
      ];
    }
  } else if (auth.level === 'RT' && auth.rgmId && auth.mtId && auth.rtId) {
    // RT 权限视图：只展示自己授权范围内的 RT 数据，排名按同 MT 下兄弟 RT 计算
    const targetRgm = HERO_RGM_REGIONS.find(r => r.rgmId === auth.rgmId)!;
    const targetMt = HERO_MT_NODES.find(m => m.mtId === auth.mtId)!;
    const targetRt = HERO_RT_NODES.find(r => r.rtId === auth.rtId)!;
    const siblingRts = getRtsByMtId(auth.mtId);
    const siblingRtIds = siblingRts.map(r => r.rtId);
    const rtCells = buildCellsForSiblingNodes(
      siblingRtIds,
      currMap,
      prevMap,
      nationalPerCapitaByBrand
    );

    const effectiveBACount = RT_EFFECTIVE_BA_COUNTS[targetRt.rtId] || 0;
    const rowBASummary = computeRtBASummary(
      targetRt.rtId,
      effectiveBACount,
      visibleBrandKeys,
      currMap,
      hasCurrData
    );

    rows = [
      {
        nodeId: targetRt.rtId,
        nodeName: targetRt.titleLabel,
        nodeSubLabel: targetMt.titleLabel,
        nodeLevel: 'RT',
        canDrillDown: false,
        isOwnOrg: true,
        rt: targetRt,
        effectiveBACount,
        baSummary: rowBASummary,
        cells: rtCells[targetRt.rtId],
      },
    ];

    currentOrgName = targetRt.titleLabel;
    childCount = 1;
    childUnitLabel = '个授权 RT';
    baSummary = rowBASummary;

    breadcrumbs = [
      { level: 'RGM', id: targetRgm.rgmId, label: targetRgm.rgmName, clickable: false },
      { level: 'MT', id: targetMt.mtId, label: targetMt.titleLabel, clickable: false },
      { level: 'RT', id: targetRt.rtId, label: targetRt.titleLabel, clickable: false },
    ];
  }

  return {
    updatedAt: adapter.updatedAt,
    currentStartDate: windows.currentStartDate,
    currentEndDate: windows.currentEndDate,
    previousStartDate: windows.previousStartDate,
    previousEndDate: windows.previousEndDate,
    role: auth.role,
    level: auth.level,
    currentOrgName,
    childCount,
    childUnitLabel,
    isEmptyState,
    emptyMessage,
    breadcrumbs,
    baSummary,
    columns,
    rows,
  };
}
