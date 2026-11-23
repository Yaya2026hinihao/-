import {
  HeroProductItem,
  HeroTask,
  HeroBAPerson,
  MonthKey,
  BrandKey,
  MatrixBrandKey,
  RegionKey,
  RgmRegionKey,
  ParentCityKey,
  HeroRgmRegion,
  HeroProductFilterState,
  HeroTrainingCycleComparison,
  HeroTrainingCycleStatus
} from '../types/heroProduct';
import youSkinTintImg from '../assets/images/you_skin_tint_1790622591492.jpg';
import bnbLipCreamImg from '../assets/images/bnb_lip_cream_1790622604523.jpg';
import dazzleSettingSprayImg from '../assets/images/dazzle_setting_spray_1790622617563.jpg';
import youCushionCompactImg from '../assets/images/you_cushion_compact_1790622627959.jpg';
import glamfixPowderPuffImg from '../assets/images/glamfix_powder_puff_1790622638055.jpg';

// 14 个 RGM 区域映射配置（汇总覆盖全国全部有效 BA 与大区销售份额）
export const HERO_RGM_REGIONS: HeroRgmRegion[] = [
  { rgmId: 'rgm-1',  rgmName: 'Andi Wijaya',     regionName: 'Jakarta Central',      parentCity: 'Jakarta',  shareInParentCity: 0.28 },
  { rgmId: 'rgm-2',  rgmName: 'Siti Rahma',      regionName: 'Jakarta South',        parentCity: 'Jakarta',  shareInParentCity: 0.26 },
  { rgmId: 'rgm-3',  rgmName: 'Kevin Pratama',   regionName: 'Jakarta West',         parentCity: 'Jakarta',  shareInParentCity: 0.25 },
  { rgmId: 'rgm-4',  rgmName: 'Rina Kusuma',     regionName: 'Jakarta North-Bekasi', parentCity: 'Jakarta',  shareInParentCity: 0.21 },
  { rgmId: 'rgm-5',  rgmName: 'Ahmad Fauzi',     regionName: 'Bandung Kota',         parentCity: 'Bandung',  shareInParentCity: 0.37 },
  { rgmId: 'rgm-6',  rgmName: 'Dewi Sartika',    regionName: 'Bogor-Depok',          parentCity: 'Bandung',  shareInParentCity: 0.33 },
  { rgmId: 'rgm-7',  rgmName: 'Reza Saputra',    regionName: 'Cirebon-Tasik',        parentCity: 'Bandung',  shareInParentCity: 0.30 },
  { rgmId: 'rgm-8',  rgmName: 'Budi Santoso',    regionName: 'Surabaya Metro',       parentCity: 'Surabaya', shareInParentCity: 0.38 },
  { rgmId: 'rgm-9',  rgmName: 'Melisa Chen',     regionName: 'Malang-Sidoarjo',      parentCity: 'Surabaya', shareInParentCity: 0.33 },
  { rgmId: 'rgm-10', rgmName: 'Hendra Gunawan',  regionName: 'Bali-Nusa Tenggara',   parentCity: 'Surabaya', shareInParentCity: 0.29 },
  { rgmId: 'rgm-11', rgmName: 'Rizal Hakim',     regionName: 'Medan-Aceh',           parentCity: 'Medan',    shareInParentCity: 0.53 },
  { rgmId: 'rgm-12', rgmName: 'Putri Nasution',  regionName: 'Riau-Batam',           parentCity: 'Medan',    shareInParentCity: 0.47 },
  { rgmId: 'rgm-13', rgmName: 'Dian Hidayah',    regionName: 'Semarang-Pantura',     parentCity: 'Semarang', shareInParentCity: 0.54 },
  { rgmId: 'rgm-14', rgmName: 'Tari Utami',      regionName: 'Yogyakarta-Solo',      parentCity: 'Semarang', shareInParentCity: 0.46 },
];

export const HERO_MATRIX_BRANDS: { key: MatrixBrandKey; label: string }[] = [
  { key: 'YOU_MAKEUP', label: 'YOU彩妆' },
  { key: 'YOU_SKINCARE', label: 'YOU护肤' },
  { key: 'BNB', label: 'BNB' },
  { key: 'DM', label: 'DM' },
  { key: 'LVJ', label: 'LVJ' },
  { key: 'FML', label: 'FML' },
];

export const HERO_MONTH_OPTIONS: { key: MonthKey; label: string; isPartial?: boolean }[] = [
  { key: '2026-11', label: '2026年11月 (本月)', isPartial: true },
  { key: '2026-10', label: '2026年10月' },
  { key: '2026-09', label: '2026年09月' },
  { key: '2026-08', label: '2026年08月' },
  { key: '2026-07', label: '2026年07月' },
  { key: '2026-06', label: '2026年06月' },
];

export const HERO_BRAND_OPTIONS: { key: BrandKey; label: string }[] = [
  { key: 'ALL', label: '全部品牌' },
  { key: 'YOU_MAKEUP', label: 'YOU彩妆' },
  { key: 'YOU_SKINCARE', label: 'YOU护肤' },
  { key: 'BNB', label: 'BNB' },
  { key: 'DM', label: 'DM' },
  { key: 'LVJ', label: 'LVJ' },
  { key: 'FML', label: 'FML' },
];

export const HERO_REGION_OPTIONS: { key: RegionKey; label: string }[] = [
  { key: 'ALL', label: '全部大区' },
  ...HERO_RGM_REGIONS.map(r => ({
    key: r.rgmId as RegionKey,
    label: `${r.regionName} (${r.rgmName})`,
  })),
];

// ================= 1. 模拟培训任务（重点业务逻辑：支持一个任务关联多个大单品） =================
export const MOCK_HERO_TASKS: HeroTask[] = [
  // 任务 1: 关联 2 个底妆大单品 (粉底液 + 气垫)
  {
    id: 'hero-task-1',
    title: 'Y.O.U Cloud Touch 养肤底妆双星核心成份与试色通关',
    type: 'study',
    linkedProductIds: ['hero-prod-1', 'hero-prod-3'],
    publishDate: '2026-09-01',
    deadline: '2026-10-31',
    author: '总部 Master Trainer (林晨)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '完成率',
    metricValue: 96.8,
    totalRequiredParticipants: 400,
    actualParticipants: 387,
    qualifiedCount: 387,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 111, rate: 97.4 },
      Bandung: { required: 114, actual: 110, rate: 96.5 },
      Surabaya: { required: 58, actual: 56, rate: 96.6 },
      Medan: { required: 58, actual: 56, rate: 96.6 },
      Semarang: { required: 56, actual: 54, rate: 96.4 }
    }
  },
  // 任务 2: 练习任务，关联 3 款底妆/定妆大单品
  {
    id: 'hero-task-2',
    title: '湿热气候防脱妆“三明治定妆法”AI数字人实战对练',
    type: 'practice',
    linkedProductIds: ['hero-prod-1', 'hero-prod-2', 'hero-prod-3'],
    publishDate: '2026-09-05',
    deadline: '2026-10-25',
    author: 'Jakarta RT (Siti Aisyah)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '达标率',
    metricValue: 91.2,
    totalRequiredParticipants: 400,
    actualParticipants: 376,
    qualifiedCount: 343,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 108, rate: 93.5 },
      Bandung: { required: 114, actual: 106, rate: 90.4 },
      Surabaya: { required: 58, actual: 55, rate: 90.9 },
      Medan: { required: 58, actual: 54, rate: 88.9 },
      Semarang: { required: 56, actual: 53, rate: 90.6 }
    }
  },
  // 任务 3: 考试任务，关联大单品 1
  {
    id: 'hero-task-3',
    title: 'Y.O.U 3%烟酰胺养肤粉底液色号推荐与卖点考核',
    type: 'exam',
    linkedProductIds: ['hero-prod-1'],
    publishDate: '2026-09-10',
    deadline: '2026-10-20',
    author: '总部培训师 (张强)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '及格率',
    metricValue: 94.5,
    avgScore: 92.4,
    totalRequiredParticipants: 400,
    actualParticipants: 382,
    qualifiedCount: 361,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 110, rate: 96.4, avgScore: 94.2 },
      Bandung: { required: 114, actual: 109, rate: 93.6, avgScore: 91.8 },
      Surabaya: { required: 58, actual: 55, rate: 94.5, avgScore: 92.0 },
      Medan: { required: 58, actual: 54, rate: 92.6, avgScore: 90.5 },
      Semarang: { required: 56, actual: 54, rate: 94.4, avgScore: 92.3 }
    }
  },
  // 任务 4: 唇泥任务，关联大单品 4
  {
    id: 'hero-task-4',
    title: 'barenbliss 蜜桃泥光唇泥 01/06 热门色号试色话术训练',
    type: 'study',
    linkedProductIds: ['hero-prod-4'],
    publishDate: '2026-09-08',
    deadline: '2026-10-31',
    author: '总部 Master Trainer (林晨)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '完成率',
    metricValue: 98.2,
    totalRequiredParticipants: 400,
    actualParticipants: 393,
    qualifiedCount: 393,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 112, rate: 98.2 },
      Bandung: { required: 114, actual: 112, rate: 98.2 },
      Surabaya: { required: 58, actual: 57, rate: 98.3 },
      Medan: { required: 58, actual: 57, rate: 98.3 },
      Semarang: { required: 56, actual: 55, rate: 98.2 }
    }
  },
  // 任务 5: 练习任务，关联唇泥 + 睫毛膏 (大单品 4, 10)
  {
    id: 'hero-task-5',
    title: '元气少女日常约会妆容速配演练 (唇部+眼妆)',
    type: 'practice',
    linkedProductIds: ['hero-prod-4', 'hero-prod-10'],
    publishDate: '2026-09-12',
    deadline: '2026-10-30',
    author: 'Bandung RT (Ahmad Fauzi)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '达标率',
    metricValue: 93.0,
    totalRequiredParticipants: 400,
    actualParticipants: 372,
    qualifiedCount: 346,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 108, rate: 94.4 },
      Bandung: { required: 114, actual: 107, rate: 93.5 },
      Surabaya: { required: 58, actual: 54, rate: 92.6 },
      Medan: { required: 58, actual: 53, rate: 90.6 },
      Semarang: { required: 56, actual: 50, rate: 92.0 }
    }
  },
  // 任务 6: 考试任务，关联大单品 4
  {
    id: 'hero-task-6',
    title: 'BNB 唇泥不沾杯持色技术与唇部护理连带测验',
    type: 'exam',
    linkedProductIds: ['hero-prod-4'],
    publishDate: '2026-09-15',
    deadline: '2026-10-28',
    author: '总部培训师 (李婷)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '及格率',
    metricValue: 96.0,
    avgScore: 94.8,
    totalRequiredParticipants: 400,
    actualParticipants: 384,
    qualifiedCount: 369,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 110, rate: 97.3, avgScore: 96.0 },
      Bandung: { required: 114, actual: 110, rate: 96.4, avgScore: 95.2 },
      Surabaya: { required: 58, actual: 56, rate: 96.4, avgScore: 94.5 },
      Medan: { required: 58, actual: 55, rate: 94.5, avgScore: 93.8 },
      Semarang: { required: 56, actual: 53, rate: 94.3, avgScore: 94.0 }
    }
  },
  // 任务 7: 定妆喷雾单品课件 (大单品 2)
  {
    id: 'hero-task-7',
    title: 'DAZZLE ME 定妆喷雾高分子成膜剂与控油机理',
    type: 'study',
    linkedProductIds: ['hero-prod-2'],
    publishDate: '2026-09-02',
    deadline: '2026-10-31',
    author: '总部培训师 (张强)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '完成率',
    metricValue: 97.5,
    totalRequiredParticipants: 400,
    actualParticipants: 390,
    qualifiedCount: 390,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 112, rate: 98.2 },
      Bandung: { required: 114, actual: 111, rate: 97.4 },
      Surabaya: { required: 58, actual: 56, rate: 96.6 },
      Medan: { required: 58, actual: 56, rate: 96.6 },
      Semarang: { required: 56, actual: 55, rate: 98.2 }
    }
  },
  // 任务 8: 定妆喷雾练习 (大单品 2)
  {
    id: 'hero-task-8',
    title: '定妆喷雾连带话术与雾化喷头现场试用演示练习',
    type: 'practice',
    linkedProductIds: ['hero-prod-2'],
    publishDate: '2026-09-09',
    deadline: '2026-10-25',
    author: 'Surabaya RT (Melisa Chen)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '达标率',
    metricValue: 92.5,
    totalRequiredParticipants: 400,
    actualParticipants: 370,
    qualifiedCount: 342,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 106, rate: 93.4 },
      Bandung: { required: 114, actual: 105, rate: 92.4 },
      Surabaya: { required: 58, actual: 54, rate: 92.6 },
      Medan: { required: 58, actual: 53, rate: 90.6 },
      Semarang: { required: 56, actual: 52, rate: 92.3 }
    }
  },
  // 任务 9: 气垫大单品课件 (大单品 3)
  {
    id: 'hero-task-9',
    title: 'Y.O.U 控油无瑕气垫霜水滴粉扑拍妆技巧与补妆指南',
    type: 'study',
    linkedProductIds: ['hero-prod-3'],
    publishDate: '2026-09-03',
    deadline: '2026-10-31',
    author: 'Jakarta RT (Siti Aisyah)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '完成率',
    metricValue: 95.8,
    totalRequiredParticipants: 400,
    actualParticipants: 383,
    qualifiedCount: 383,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 110, rate: 96.5 },
      Bandung: { required: 114, actual: 109, rate: 95.6 },
      Surabaya: { required: 58, actual: 55, rate: 94.8 },
      Medan: { required: 58, actual: 55, rate: 94.8 },
      Semarang: { required: 56, actual: 54, rate: 96.4 }
    }
  },
  // 任务 10: 洗发水大单品学习 (大单品 6)
  {
    id: 'hero-task-10',
    title: 'lavojoy 头皮微生态学与无硅油氨基酸控油配方课件',
    type: 'study',
    linkedProductIds: ['hero-prod-6'],
    publishDate: '2026-09-04',
    deadline: '2026-10-31',
    author: '总部 Master Trainer (林晨)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '完成率',
    metricValue: 97.0,
    totalRequiredParticipants: 400,
    actualParticipants: 388,
    qualifiedCount: 388,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 111, rate: 97.4 },
      Bandung: { required: 114, actual: 111, rate: 97.4 },
      Surabaya: { required: 58, actual: 56, rate: 96.6 },
      Medan: { required: 58, actual: 55, rate: 94.8 },
      Semarang: { required: 56, actual: 55, rate: 98.2 }
    }
  },
  // 任务 11: 洗发水 + 身体乳洗护连带练习 (大单品 6, 7)
  {
    id: 'hero-task-11',
    title: 'lavojoy 香氛洗护“发丝蓬松+身体丝滑”连带话术对练',
    type: 'practice',
    linkedProductIds: ['hero-prod-6', 'hero-prod-7'],
    publishDate: '2026-09-14',
    deadline: '2026-10-25',
    author: '总部培训师 (张强)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '达标率',
    metricValue: 89.6,
    totalRequiredParticipants: 400,
    actualParticipants: 366,
    qualifiedCount: 328,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 106, rate: 91.5 },
      Bandung: { required: 114, actual: 104, rate: 89.4 },
      Surabaya: { required: 58, actual: 53, rate: 88.7 },
      Medan: { required: 58, actual: 52, rate: 86.5 },
      Semarang: { required: 56, actual: 51, rate: 90.2 }
    }
  },
  // 任务 12: 净痘精华考试 (大单品 5)
  {
    id: 'hero-task-12',
    title: 'Y.O.U AcnePlus 水杨酸舒缓净痘原理与禁忌说明考试',
    type: 'exam',
    linkedProductIds: ['hero-prod-5'],
    publishDate: '2026-09-18',
    deadline: '2026-10-26',
    author: 'Medan RT (Hendra Gunawan)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '及格率',
    metricValue: 93.2,
    avgScore: 91.0,
    totalRequiredParticipants: 400,
    actualParticipants: 379,
    qualifiedCount: 353,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 109, rate: 94.5, avgScore: 92.5 },
      Bandung: { required: 114, actual: 108, rate: 92.6, avgScore: 90.8 },
      Surabaya: { required: 58, actual: 55, rate: 92.7, avgScore: 90.2 },
      Medan: { required: 58, actual: 54, rate: 94.4, avgScore: 91.8 },
      Semarang: { required: 56, actual: 53, rate: 90.6, avgScore: 89.5 }
    }
  },
  // 任务 13: 防晒大单品学习 (大单品 9)
  {
    id: 'hero-task-13',
    title: 'Y.O.U Sunbrella 全波段高倍防晒霜防汗防水技术解析',
    type: 'study',
    linkedProductIds: ['hero-prod-9'],
    publishDate: '2026-09-02',
    deadline: '2026-10-31',
    author: '总部 Master Trainer (林晨)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '完成率',
    metricValue: 98.5,
    totalRequiredParticipants: 400,
    actualParticipants: 394,
    qualifiedCount: 394,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 113, rate: 99.1 },
      Bandung: { required: 114, actual: 112, rate: 98.2 },
      Surabaya: { required: 58, actual: 57, rate: 98.3 },
      Medan: { required: 58, actual: 57, rate: 98.3 },
      Semarang: { required: 56, actual: 55, rate: 98.2 }
    }
  },
  // 任务 14: 防晒 + 粉底液晨间护肤防晒底妆多品组合对练 (大单品 1, 9)
  {
    id: 'hero-task-14',
    title: '高倍防晒不搓泥配合粉底液极简晨间护肤演示对练',
    type: 'practice',
    linkedProductIds: ['hero-prod-1', 'hero-prod-9'],
    publishDate: '2026-09-16',
    deadline: '2026-10-27',
    author: 'Jakarta RT (Siti Aisyah)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '达标率',
    metricValue: 92.0,
    totalRequiredParticipants: 400,
    actualParticipants: 375,
    qualifiedCount: 345,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 109, rate: 94.5 },
      Bandung: { required: 114, actual: 106, rate: 91.4 },
      Surabaya: { required: 58, actual: 54, rate: 90.7 },
      Medan: { required: 58, actual: 54, rate: 90.7 },
      Semarang: { required: 56, actual: 52, rate: 90.4 }
    }
  },
  // 任务 15: 粉扑工具学习与连带 (大单品 8)
  {
    id: 'hero-task-15',
    title: 'GLAMFIX 专业高弹双面气垫粉扑专柜试妆演示规范',
    type: 'study',
    linkedProductIds: ['hero-prod-8'],
    publishDate: '2026-09-06',
    deadline: '2026-10-31',
    author: '总部培训师 (李婷)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: '完成率',
    metricValue: 97.2,
    totalRequiredParticipants: 400,
    actualParticipants: 389,
    qualifiedCount: 389,
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 112, rate: 98.2 },
      Bandung: { required: 114, actual: 110, rate: 96.5 },
      Surabaya: { required: 58, actual: 56, rate: 96.6 },
      Medan: { required: 58, actual: 56, rate: 96.6 },
      Semarang: { required: 56, actual: 55, rate: 98.2 }
    }
  }
];

// 为其余任务填充真实且多品关联的任务（共 58 个全局去重任务）
for (let i = 16; i <= 58; i++) {
  const prodA = `hero-prod-${((i * 3) % 44) + 1}`;
  const prodB = `hero-prod-${((i * 5 + 2) % 44) + 1}`;
  const isMulti = i % 3 === 0;
  const taskType: 'study' | 'practice' | 'exam' = i % 3 === 1 ? 'study' : i % 3 === 2 ? 'practice' : 'exam';
  const label = taskType === 'study' ? '完成率' : taskType === 'practice' ? '达标率' : '及格率';
  const metricVal = 88 + ((i * 7) % 11) + ((i % 5) * 0.2);

  MOCK_HERO_TASKS.push({
    id: `hero-task-${i}`,
    title: `大单品专项《No.${i}》${taskType === 'study' ? '基础标准知识通关课件' : taskType === 'practice' ? '柜台场景促单演练' : '全国月度专项考核'}`,
    type: taskType,
    linkedProductIds: isMulti ? [prodA, prodB] : [prodA],
    publishDate: '2026-09-10',
    deadline: '2026-10-31',
    author: i % 2 === 0 ? '总部 Master Trainer (林晨)' : 'Jakarta RT (Siti Aisyah)',
    targetAudience: '全国专柜BA (共400人)',
    metricLabel: label,
    metricValue: Number(metricVal.toFixed(1)),
    avgScore: taskType === 'exam' ? Number((86 + ((i * 5) % 12)).toFixed(1)) : undefined,
    totalRequiredParticipants: 400,
    actualParticipants: 360 + (i % 35),
    qualifiedCount: 330 + (i % 30),
    regionalBreakdown: {
      Jakarta: { required: 114, actual: 104 + (i % 8), rate: 92.1 },
      Bandung: { required: 114, actual: 102 + (i % 9), rate: 90.5 },
      Surabaya: { required: 58, actual: 52 + (i % 5), rate: 91.2 },
      Medan: { required: 58, actual: 51 + (i % 5), rate: 89.8 },
      Semarang: { required: 56, actual: 51 + (i % 4), rate: 91.0 }
    }
  });
}

// ================= 2. 模拟 44 款大单品（完整覆盖 HEBE 旗下 6 大品牌） =================
const BASE_HERO_TEMPLATES = [
  {
    spu: 'Y.O.U Cloud Touch 3% Niacinamide Brightening Skin Tint',
    name: 'Y.O.U 云感 3% 烟酰胺养肤粉底液 (Skin Tint)',
    brand: 'YOU' as const,
    brandName: 'Y.O.U Beauty',
    category: 'MAKEUP' as const,
    series: 'Cloud Touch 养肤底妆',
    priceIdr: 129000,
    image: youSkinTintImg,
    taskIds: ['hero-task-1', 'hero-task-2', 'hero-task-3', 'hero-task-14', 'hero-task-19'],
    monthlyBase: 24800
  },
  {
    spu: 'DAZZLE ME Get a Grip! Makeup Setting Spray Matte Fix',
    name: 'DAZZLE ME 定妆喷雾 (Get a Grip! Matte Fix 60ml)',
    brand: 'DM' as const,
    brandName: 'DAZZLE ME',
    category: 'MAKEUP' as const,
    series: 'Get a Grip! 持妆系列',
    priceIdr: 45000,
    image: dazzleSettingSprayImg,
    taskIds: ['hero-task-2', 'hero-task-7', 'hero-task-8', 'hero-task-21'],
    monthlyBase: 38200
  },
  {
    spu: 'Y.O.U NoutriWear+ Flawless Cushion Foundation SPF 40 PA+++',
    name: 'Y.O.U NoutriWear+ 养肤无瑕持妆气垫霜',
    brand: 'YOU' as const,
    brandName: 'Y.O.U Beauty',
    category: 'MAKEUP' as const,
    series: 'NoutriWear+ 高定底妆',
    priceIdr: 159000,
    image: youCushionCompactImg,
    taskIds: ['hero-task-1', 'hero-task-2', 'hero-task-9', 'hero-task-24'],
    monthlyBase: 19600
  },
  {
    spu: 'barenbliss Peach Makes Perfect Lip Tint Berry Makes Comfort',
    name: 'barenbliss 蜜桃泥光不沾杯唇泥 (Lip Tint)',
    brand: 'BNB' as const,
    brandName: 'barenbliss',
    category: 'MAKEUP' as const,
    series: 'Peach Makes Perfect',
    priceIdr: 69000,
    image: bnbLipCreamImg,
    taskIds: ['hero-task-4', 'hero-task-5', 'hero-task-6', 'hero-task-27'],
    monthlyBase: 31500
  },
  {
    spu: 'Y.O.U AcnePlus Spot Care Pro BHA Serum',
    name: 'Y.O.U AcnePlus 净痘舒缓精华乳 (4D积雪草)',
    brand: 'YOU' as const,
    brandName: 'Y.O.U Beauty',
    category: 'SKINCARE' as const,
    series: 'AcnePlus 专研净痘',
    priceIdr: 58000,
    image: youSkinTintImg,
    taskIds: ['hero-task-12', 'hero-task-30', 'hero-task-33'],
    monthlyBase: 22400
  },
  {
    spu: 'lavojoy Hold Me Tight Amino Acid Scalp Care Shampoo 280ml',
    name: 'lavojoy 控油丰盈无硅油洗发水 (Hold Me Tight)',
    brand: 'LVJ' as const,
    brandName: 'lavojoy',
    category: 'PERSONAL CARE' as const,
    series: 'Hold Me Tight 洗护系列',
    priceIdr: 139000,
    image: youSkinTintImg,
    taskIds: ['hero-task-10', 'hero-task-11', 'hero-task-36'],
    monthlyBase: 18400
  },
  {
    spu: 'lavojoy Let It Glow Body Serum Gel Orange Blossom 300ml',
    name: 'lavojoy Let It Glow 烟酰胺光感身体精华乳',
    brand: 'LVJ' as const,
    brandName: 'lavojoy',
    category: 'PERSONAL CARE' as const,
    series: 'Let It Glow 身体焕亮',
    priceIdr: 119000,
    image: dazzleSettingSprayImg,
    taskIds: ['hero-task-11', 'hero-task-38', 'hero-task-41'],
    monthlyBase: 16200
  },
  {
    spu: 'GLAMFIX Professional Air Cushion Puff 2pcs/bag',
    name: 'GLAMFIX 专业高弹双面气垫粉扑 (2入装)',
    brand: 'GF' as const,
    brandName: 'GLAMFIX',
    category: 'TOOLS' as const,
    series: 'Professional Tools',
    priceIdr: 29000,
    image: glamfixPowderPuffImg,
    taskIds: ['hero-task-15', 'hero-task-43', 'hero-task-45'],
    monthlyBase: 28900
  },
  {
    spu: 'Y.O.U Sunbrella Triple UV Elixir Sunscreen SPF 50+ PA++++',
    name: 'Y.O.U Sunbrella 全波段清透水感防晒乳',
    brand: 'YOU' as const,
    brandName: 'Y.O.U Beauty',
    category: 'SKINCARE' as const,
    series: 'Sunbrella 极光防晒',
    priceIdr: 89000,
    image: youSkinTintImg,
    taskIds: ['hero-task-13', 'hero-task-14', 'hero-task-47'],
    monthlyBase: 29800
  },
  {
    spu: 'barenbliss Roll To High Mascara Waterproof Volumizing',
    name: 'barenbliss 卷翘纤长防水睫毛膏',
    brand: 'BNB' as const,
    brandName: 'barenbliss',
    category: 'MAKEUP' as const,
    series: 'Roll To High',
    priceIdr: 79000,
    image: bnbLipCreamImg,
    taskIds: ['hero-task-5', 'hero-task-50', 'hero-task-52'],
    monthlyBase: 21300
  },
  {
    spu: 'FORMULOGIC Multi-Ceramide Barrier Repair Cream 50g',
    name: 'FORMULOGIC 多重神经酰胺屏障修护霜',
    brand: 'FML' as const,
    brandName: 'FORMULOGIC',
    category: 'SKINCARE' as const,
    series: 'Barrier Pro 屏障修护',
    priceIdr: 169000,
    image: youSkinTintImg,
    taskIds: ['hero-task-20', 'hero-task-25', 'hero-task-35'],
    monthlyBase: 15400
  },
  {
    spu: 'DAZZLE ME Ink-Licious Lip Tint Long Lasting 2.5g',
    name: 'DAZZLE ME 潮玩不脱色持色水感唇釉 (Ink-Licious)',
    brand: 'DM' as const,
    brandName: 'DAZZLE ME',
    category: 'MAKEUP' as const,
    series: 'Ink-Licious 潮玩',
    priceIdr: 35000,
    image: dazzleSettingSprayImg,
    taskIds: ['hero-task-22', 'hero-task-29', 'hero-task-40'],
    monthlyBase: 34200
  }
];

// 扩展生成整整 44 款大单品（大单品编号 1 到 44）
export const MOCK_HERO_PRODUCTS: HeroProductItem[] = Array.from({ length: 44 }, (_, i) => {
  const templateIdx = i % BASE_HERO_TEMPLATES.length;
  const tmpl = BASE_HERO_TEMPLATES[templateIdx];
  const prodId = `hero-prod-${i + 1}`;
  const suffix = i >= BASE_HERO_TEMPLATES.length ? ` (PRO Edition #${i + 1})` : '';

  // 销售月度数据构建 (自然月 SELL OUT，2026-10未完全结束时做同周期对比标注)
  const baseMonthly = tmpl.monthlyBase * (1 + ((i * 13) % 40) / 100);
  
  // 各月份销量（带有自然的季节增长与波动趋势）
  const monthlySales: HeroProductItem['monthlySales'] = {
    '2026-11': {
      sellOutUnits: Math.round(baseMonthly * 0.88),
      isPartialMonth: true,
      byRegion: {
        Jakarta: Math.round(baseMonthly * 0.88 * 0.38),
        Bandung: Math.round(baseMonthly * 0.88 * 0.28),
        Surabaya: Math.round(baseMonthly * 0.88 * 0.16),
        Medan: Math.round(baseMonthly * 0.88 * 0.10),
        Semarang: Math.round(baseMonthly * 0.88 * 0.08)
      }
    },
    '2026-10': {
      sellOutUnits: Math.round(baseMonthly * 0.94),
      byRegion: {
        Jakarta: Math.round(baseMonthly * 0.94 * 0.38),
        Bandung: Math.round(baseMonthly * 0.94 * 0.28),
        Surabaya: Math.round(baseMonthly * 0.94 * 0.16),
        Medan: Math.round(baseMonthly * 0.94 * 0.10),
        Semarang: Math.round(baseMonthly * 0.94 * 0.08)
      }
    },
    '2026-09': {
      sellOutUnits: Math.round(baseMonthly * 1.05),
      byRegion: {
        Jakarta: Math.round(baseMonthly * 1.05 * 0.38),
        Bandung: Math.round(baseMonthly * 1.05 * 0.28),
        Surabaya: Math.round(baseMonthly * 1.05 * 0.16),
        Medan: Math.round(baseMonthly * 1.05 * 0.10),
        Semarang: Math.round(baseMonthly * 1.05 * 0.08)
      }
    },
    '2026-08': {
      sellOutUnits: Math.round(baseMonthly * 0.96),
      byRegion: {
        Jakarta: Math.round(baseMonthly * 0.96 * 0.38),
        Bandung: Math.round(baseMonthly * 0.96 * 0.28),
        Surabaya: Math.round(baseMonthly * 0.96 * 0.16),
        Medan: Math.round(baseMonthly * 0.96 * 0.10),
        Semarang: Math.round(baseMonthly * 0.96 * 0.08)
      }
    },
    '2026-07': {
      sellOutUnits: Math.round(baseMonthly * 0.91),
      byRegion: {
        Jakarta: Math.round(baseMonthly * 0.91 * 0.38),
        Bandung: Math.round(baseMonthly * 0.91 * 0.28),
        Surabaya: Math.round(baseMonthly * 0.91 * 0.16),
        Medan: Math.round(baseMonthly * 0.91 * 0.10),
        Semarang: Math.round(baseMonthly * 0.91 * 0.08)
      }
    },
    '2026-06': {
      sellOutUnits: Math.round(baseMonthly * 0.86),
      byRegion: {
        Jakarta: Math.round(baseMonthly * 0.86 * 0.38),
        Bandung: Math.round(baseMonthly * 0.86 * 0.28),
        Surabaya: Math.round(baseMonthly * 0.86 * 0.16),
        Medan: Math.round(baseMonthly * 0.86 * 0.10),
        Semarang: Math.round(baseMonthly * 0.86 * 0.08)
      }
    }
  };

  // 关联的任务（从 MOCK_HERO_TASKS 反查关联当前 prodId 的任务）
  const linkedTasks = MOCK_HERO_TASKS.filter(t => t.linkedProductIds.includes(prodId)).map(t => t.id);
  // 确保每款大单品至少有 2-4 个任务
  if (linkedTasks.length < 2) {
    linkedTasks.push(`hero-task-${(i % 15) + 1}`);
  }

  return {
    id: prodId,
    spu: `${tmpl.spu} - SKU-${i + 1}`,
    sku: `HEBE-SKU-${String(100 + i + 1)}`,
    name: `${tmpl.name}${suffix}`,
    brand: tmpl.brand,
    brandName: tmpl.brandName,
    category: tmpl.category,
    series: tmpl.series,
    priceIdr: tmpl.priceIdr,
    image: tmpl.image,
    taskIds: Array.from(new Set(linkedTasks)),
    monthlySales
  };
});

// ================= 3. 模拟全量 BA 人员（400人基础样本库，精准匹配首页400人总数大盘及14个RGM分区） =================
const REGIONS: ParentCityKey[] = [
  'Jakarta', 'Jakarta', 'Bandung', 'Bandung', 'Surabaya', 'Medan', 'Semarang'
];

// 各父城市下每个 BA 确定性映射到下辖 RGM（确保 14 个 RGM 都有稳定有效 BA 池且总和严格等于 400）
const CITY_RGM_POOLS: Record<ParentCityKey, RgmRegionKey[]> = {
  Jakarta: ['rgm-1', 'rgm-2', 'rgm-3', 'rgm-4'],
  Bandung: ['rgm-5', 'rgm-6', 'rgm-7'],
  Surabaya: ['rgm-8', 'rgm-9', 'rgm-10'],
  Medan: ['rgm-11', 'rgm-12'],
  Semarang: ['rgm-13', 'rgm-14'],
};

const cityOccurrenceCounters: Record<ParentCityKey, number> = {
  Jakarta: 0,
  Bandung: 0,
  Surabaya: 0,
  Medan: 0,
  Semarang: 0,
};

const INDO_FIRST_NAMES = [
  'Siti', 'Dewi', 'Ayu', 'Rina', 'Nurul', 'Putri', 'Intan', 'Melati', 'Ratna', 'Wulan',
  'Budi', 'Ahmad', 'Reza', 'Farhan', 'Kevin', 'Andi', 'Hendra', 'Dian', 'Tari', 'Maya'
];
const INDO_LAST_NAMES = [
  'Rahayu', 'Sartika', 'Wijaya', 'Hidayah', 'Lestari', 'Kusuma', 'Santoso', 'Pratama', 'Saputra', 'Gunawan',
  'Siregar', 'Harahap', 'Nasution', 'Pohan', 'Lubis', 'Kosasih', 'Ginting', 'Surbakti', 'Tanjung', 'Utami'
];

export const MOCK_HERO_BA_LIST: HeroBAPerson[] = Array.from({ length: 400 }, (_, i) => {
  const region = REGIONS[i % REGIONS.length];
  const cityPool = CITY_RGM_POOLS[region];
  const cityOccur = cityOccurrenceCounters[region]++;
  const rgmId = cityPool[cityOccur % cityPool.length];
  const firstName = INDO_FIRST_NAMES[i % INDO_FIRST_NAMES.length];
  const lastName = INDO_LAST_NAMES[(i * 3 + 7) % INDO_LAST_NAMES.length];
  const empId = `HEBE-BA-${String(1001 + i).padStart(4, '0')}`;
  const storeNames = {
    Jakarta: ['Grand Indonesia Mall', 'Central Park Counter', 'Senayan City Hub', 'Mall Kelapa Gading'],
    Bandung: ['Paris Van Java Mall', '23 Paskal Shopping Center', 'Trans Studio Mall'],
    Surabaya: ['Tunjungan Plaza 6', 'Pakuwon Mall Counter', 'Galaxy Mall Hub'],
    Medan: ['Sun Plaza Medan', 'Centre Point Mall', 'Delipark Mall'],
    Semarang: ['Mall Paragon Semarang', 'Pollux Mall Paragon', 'Ciputra Mall']
  };
  const storeList = storeNames[region];
  const storeName = storeList[i % storeList.length];

  const participatedProductIds: string[] = [];
  const completedTaskIds: string[] = [];
  const assignedTaskIdsByProduct: Record<string, string[]> = {};
  const practiceSubmitsByProduct: Record<string, number> = {};
  const taskProgressDetails: HeroBAPerson['taskProgressDetails'] = {};

  // 为每个大单品分配任务并生成BA的参与记录
  MOCK_HERO_PRODUCTS.forEach((prod, pIdx) => {
    const prodId = prod.id;
    const prodTasks = MOCK_HERO_TASKS.filter(t => prod.taskIds.includes(t.id));

    // 默认该产品的所有关联任务都分配给该BA（部分边缘情况可能少分配1个）
    const assigned = ((i + pIdx) % 20 === 0 && prodTasks.length > 2)
      ? prodTasks.slice(0, prodTasks.length - 1).map(t => t.id)
      : prodTasks.map(t => t.id);
    assignedTaskIdsByProduct[prodId] = assigned;

    // 是否参与该产品
    const threshold = pIdx < 5 ? 0.94 : pIdx < 15 ? 0.88 : pIdx < 30 ? 0.82 : 0.72;
    const participatesInProduct = ((i * 17 + (pIdx + 1) * 11) % 100) / 100 < threshold;

    let totalPracticeSubmitsForProd = 0;

    if (participatesInProduct) {
      participatedProductIds.push(prodId);

      // 决定完成度：部分参与 vs 全部参与
      // 约 75% 参与者是全部参与，25% 是部分参与
      const isFullParticipation = ((i * 7 + pIdx * 5) % 100) / 100 < 0.75;

      assigned.forEach((tId, tIdx) => {
        const taskObj = MOCK_HERO_TASKS.find(t => t.id === tId);
        if (!taskObj) return;

        // 如果是部分参与，跳过最后一个任务
        if (!isFullParticipation && tIdx === assigned.length - 1 && assigned.length > 1) {
          // 未参与该任务
          if (taskObj.type === 'study') {
            taskProgressDetails[tId] = { studyCompleted: false };
          } else if (taskObj.type === 'practice') {
            taskProgressDetails[tId] = { practiceSubmits: 0, practiceQualified: false };
          } else {
            taskProgressDetails[tId] = { examParticipated: false };
          }
          return;
        }

        completedTaskIds.push(tId);

        if (taskObj.type === 'study') {
          const studyMins = 15 + ((i * 3 + tIdx * 7) % 25);
          const day = String(((i + tIdx * 3) % 25) + 1).padStart(2, '0');
          taskProgressDetails[tId] = {
            studyCompleted: true,
            studyMinutes: studyMins,
            studyCompletedDate: `2026-09-${day} 14:${String((i * 4) % 60).padStart(2, '0')}`
          };
        } else if (taskObj.type === 'practice') {
          // 同一BA在同一练习任务提交多次（1~6次）
          const submits = 1 + ((i * 5 + tIdx * 7) % 5);
          totalPracticeSubmitsForProd += submits;
          const bestScore = 80 + ((i * 3 + tIdx * 9) % 20); // 80 - 99
          const qualified = bestScore >= 85;
          taskProgressDetails[tId] = {
            practiceSubmits: submits,
            practiceBestScore: bestScore,
            practiceQualified: qualified
          };
        } else if (taskObj.type === 'exam') {
          const examScore = 70 + ((i * 7 + tIdx * 11) % 30); // 70 - 99
          const passed = examScore >= 80;
          taskProgressDetails[tId] = {
            examParticipated: true,
            examScore,
            examPassed: passed
          };
        }
      });
    } else {
      // 未参与该产品的任何任务
      assigned.forEach(tId => {
        const taskObj = MOCK_HERO_TASKS.find(t => t.id === tId);
        if (!taskObj) return;
        if (taskObj.type === 'study') {
          taskProgressDetails[tId] = { studyCompleted: false };
        } else if (taskObj.type === 'practice') {
          taskProgressDetails[tId] = { practiceSubmits: 0, practiceQualified: false };
        } else {
          taskProgressDetails[tId] = { examParticipated: false };
        }
      });
    }

    practiceSubmitsByProduct[prodId] = totalPracticeSubmitsForProd;
  });

  return {
    id: `ba-${i + 1}`,
    name: `${firstName} ${lastName}`,
    employeeId: empId,
    region,
    rgmId,
    storeName,
    participatedProductIds,
    completedTaskIds: Array.from(new Set(completedTaskIds)),
    assignedTaskIdsByProduct,
    practiceSubmitsByProduct,
    taskProgressDetails,
    lastActiveDate: `2026-11-${String((i % 22) + 1).padStart(2, '0')}`
  };
});

// ================= 4. 重点业务计算与统计函数（全动态、严谨去重口径） =================

/**
 * 首页独立入口卡片统计数据计算：
 * 1. 大单品数量 (例如 44 个)
 * 2. 培训任务数 (关联大单品的任务总数，全局去重！)
 * 3. 累计销量 (所有大单品实际 SELL OUT 销量汇总，明确统计周期)
 */
export function getHeroBannerStatistics() {
  const totalHeroProductsCount = MOCK_HERO_PRODUCTS.length; // 44 款

  // 全局去重统计任务：收集所有大单品关联的唯一任务 ID
  const globalDeduplicatedTaskIds = new Set<string>();
  MOCK_HERO_PRODUCTS.forEach(p => {
    p.taskIds.forEach(tId => globalDeduplicatedTaskIds.add(tId));
  });
  const totalDeduplicatedTaskCount = globalDeduplicatedTaskIds.size;

  // 累计 SELL OUT 销量汇总（统计周期：2026年6月-10月累计实际销售）
  let totalSellOutSum = 0;
  MOCK_HERO_PRODUCTS.forEach(p => {
    Object.values(p.monthlySales).forEach(m => {
      totalSellOutSum += m.sellOutUnits;
    });
  });

  return {
    heroProductsCount: totalHeroProductsCount,
    deduplicatedTaskCount: totalDeduplicatedTaskCount,
    totalSellOut: totalSellOutSum,
    periodLabel: '2026年6月-10月累计 (自然月实际 SELL OUT)'
  };
}

/**
 * 获取符合筛选条件的大单品列表及其动态聚合指标
 */
export function getFilteredHeroProducts(filter: HeroProductFilterState) {
  return MOCK_HERO_PRODUCTS.filter(prod => {
    // 品牌筛选（支持 YOU彩妆 / YOU护肤 拆分及单品牌筛选）
    if (filter.brand !== 'ALL') {
      if (filter.brand === 'YOU_MAKEUP') {
        if (!(prod.brand === 'YOU' && prod.category === 'MAKEUP')) return false;
      } else if (filter.brand === 'YOU_SKINCARE') {
        if (!(prod.brand === 'YOU' && prod.category === 'SKINCARE')) return false;
      } else if (prod.brand !== filter.brand) {
        return false;
      }
    }
    // 搜索词
    if (filter.searchKeyword.trim()) {
      const q = filter.searchKeyword.toLowerCase().trim();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchSku = prod.sku.toLowerCase().includes(q);
      const matchBrand = prod.brandName.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBrand) return false;
    }
    return true;
  });
}

/**
 * 辅助：根据筛选大区（全国 / 14个RGM / 父级城市）过滤 BA 列表
 */
export function getTargetBAsByRegion(region: RegionKey): HeroBAPerson[] {
  if (region === 'ALL') return MOCK_HERO_BA_LIST;
  if (region.startsWith('rgm-')) {
    return MOCK_HERO_BA_LIST.filter(ba => ba.rgmId === region);
  }
  return MOCK_HERO_BA_LIST.filter(ba => ba.region === region);
}

/**
 * 辅助：获取大区对应的销量取值（支持 RGM 按在所属区域占比折算）
 */
export function getRegionalSellOutUnits(
  monthData: HeroProductItem['monthlySales'][MonthKey] | undefined,
  region: RegionKey
): number {
  if (!monthData) return 0;
  if (region === 'ALL') return monthData.sellOutUnits || 0;
  if (region.startsWith('rgm-')) {
    const rgm = HERO_RGM_REGIONS.find(r => r.rgmId === region);
    if (!rgm) return 0;
    const cityUnits = monthData.byRegion[rgm.parentCity] || 0;
    return Math.round(cityUnits * rgm.shareInParentCity);
  }
  return monthData.byRegion[region] || 0;
}

/**
 * 计算单个大单品在当前筛选条件下的聚合指标：
 * 1. 培训任务数：当前产品关联的任务总数（按唯一ID去重，区分学习、练习、考试数量）
 * 2. 培训参与人次：所有BA的学习完成次数 + 练习有效提交次数（多次提交分别计数） + 考试有效参与次数之和
 * 3. BA覆盖率：已参与BA人数 / 应参与BA人数（BA按工号去重）
 * 4. 实际销量：当前筛选范围内的 SELL OUT 实际销量及 MoM 环比
 * 5. 质量指标：学习完成率、练习达标率、考试及格率
 */
export function computeHeroProductRowStats(product: HeroProductItem, filter: HeroProductFilterState) {
  // 1. 获取该产品关联的任务列表
  const associatedTasks = MOCK_HERO_TASKS.filter(t => product.taskIds.includes(t.id));
  const studyTasks = associatedTasks.filter(t => t.type === 'study');
  const practiceTasks = associatedTasks.filter(t => t.type === 'practice');
  const examTasks = associatedTasks.filter(t => t.type === 'exam');

  const studyCount = studyTasks.length;
  const practiceCount = practiceTasks.length;
  const examCount = examTasks.length;
  const totalTasks = associatedTasks.length;

  const studyTaskIds = new Set(studyTasks.map(t => t.id));
  const practiceTaskIds = new Set(practiceTasks.map(t => t.id));
  const examTaskIds = new Set(examTasks.map(t => t.id));

  // 2. 筛选范围内的 BA
  const targetBAs = getTargetBAsByRegion(filter.region);

  const totalRequiredBAs = targetBAs.length; // 应参与人数

  // 已参与去重 BA 人数 (在该产品中参与过任一任务)
  const participatedBAs = targetBAs.filter(ba => ba.participatedProductIds.includes(product.id));
  const participatedCount = participatedBAs.length;
  const unparticipatedCount = Math.max(0, totalRequiredBAs - participatedCount);
  const coverageRate = totalRequiredBAs > 0
    ? Number(((participatedCount / totalRequiredBAs) * 100).toFixed(1))
    : 0;

  // 3. 培训参与人次统计口径（严格契合要求）：
  // - 学习：有效完成学习任务的次数（不重复统计）
  // - 练习：所有有效提交次数（同一个BA在同一个练习任务提交多次分别计数）
  // - 考试：有效考试参与次数
  let studyPersonTimes = 0;
  let practicePersonTimes = 0;
  let examPersonTimes = 0;

  // 质量指标统计辅助计数
  let totalAssignedStudyTasks = 0;
  let totalCompletedStudyTasks = 0;

  let totalPracticeParticipants = 0;
  let qualifiedPracticeParticipants = 0;

  let totalExamParticipants = 0;
  let passedExamParticipants = 0;

  targetBAs.forEach(ba => {
    const assignedTasksForProd = ba.assignedTaskIdsByProduct[product.id] || [];

    // 学习
    assignedTasksForProd.forEach(tId => {
      if (studyTaskIds.has(tId)) {
        totalAssignedStudyTasks += 1;
        const detail = ba.taskProgressDetails[tId];
        if (detail?.studyCompleted) {
          studyPersonTimes += 1;
          totalCompletedStudyTasks += 1;
        }
      }
    });

    // 练习
    let baPracticedThisProd = false;
    let baQualifiedThisProd = false;
    assignedTasksForProd.forEach(tId => {
      if (practiceTaskIds.has(tId)) {
        const detail = ba.taskProgressDetails[tId];
        const submits = detail?.practiceSubmits || 0;
        if (submits > 0) {
          practicePersonTimes += submits;
          baPracticedThisProd = true;
          if (detail?.practiceQualified) {
            baQualifiedThisProd = true;
          }
        }
      }
    });
    if (baPracticedThisProd) {
      totalPracticeParticipants += 1;
      if (baQualifiedThisProd) {
        qualifiedPracticeParticipants += 1;
      }
    }

    // 考试
    let baExamedThisProd = false;
    let baPassedThisProd = false;
    assignedTasksForProd.forEach(tId => {
      if (examTaskIds.has(tId)) {
        const detail = ba.taskProgressDetails[tId];
        if (detail?.examParticipated) {
          examPersonTimes += 1;
          baExamedThisProd = true;
          if (detail?.examPassed) {
            baPassedThisProd = true;
          }
        }
      }
    });
    if (baExamedThisProd) {
      totalExamParticipants += 1;
      if (baPassedThisProd) {
        passedExamParticipants += 1;
      }
    }
  });

  const totalTrainingPersonTimes = studyPersonTimes + practicePersonTimes + examPersonTimes;

  // 4. 质量指标百分比 (严格不展示考试均分，不设周度趋势)
  const studyCompletionRate = totalAssignedStudyTasks > 0
    ? Number(((totalCompletedStudyTasks / totalAssignedStudyTasks) * 100).toFixed(1))
    : 0;

  const practiceQualifiedRate = totalPracticeParticipants > 0
    ? Number(((qualifiedPracticeParticipants / totalPracticeParticipants) * 100).toFixed(1))
    : 0;

  const examPassRate = totalExamParticipants > 0
    ? Number(((passedExamParticipants / totalExamParticipants) * 100).toFixed(1))
    : 0;

  // 5. 实际销量 (SELL OUT) 与培训人次按统计周期及大区计算
  const activeMonth: MonthKey = filter.periodType === 'THIS_MONTH' ? '2026-11' : filter.month;
  const monthData = product.monthlySales[activeMonth];
  const baseMonthSellOut = getRegionalSellOutUnits(monthData, filter.region);

  // 根据统计周期（本周 / 本月 / 自定义时间范围）动态折算销量及活跃人次
  let periodScale = 1;
  if (filter.periodType === 'THIS_WEEK') {
    periodScale = 7 / 30;
  } else if (filter.periodType === 'CUSTOM' && filter.customStartDate && filter.customEndDate) {
    const startMs = parseUTCDate(filter.customStartDate).getTime();
    const endMs = parseUTCDate(filter.customEndDate).getTime();
    const spanDays = Math.max(1, Math.round((endMs - startMs) / (24 * 60 * 60 * 1000)) + 1);
    // 若选择范围超出可用数据截止日 (2026-11-29) 或早于起始日 (2026-06-01)，销量与培训参与计 0
    if (filter.customStartDate > '2026-11-29' || filter.customEndDate < '2026-06-01') {
      periodScale = 0;
    } else {
      periodScale = Math.min(2.5, spanDays / 30);
    }
  }

  const currentSellOut = Math.round(baseMonthSellOut * periodScale);
  const scaledStudyPersonTimes = Math.round(studyPersonTimes * Math.min(1, Math.max(periodScale === 0 ? 0 : 0.25, periodScale)));
  const scaledPracticePersonTimes = Math.round(practicePersonTimes * Math.min(1, Math.max(periodScale === 0 ? 0 : 0.25, periodScale)));
  const scaledExamPersonTimes = Math.round(examPersonTimes * Math.min(1, Math.max(periodScale === 0 ? 0 : 0.25, periodScale)));
  const scaledTrainingPersonTimes = scaledStudyPersonTimes + scaledPracticePersonTimes + scaledExamPersonTimes;

  // 环比上一自然月销量
  const monthsSequence: MonthKey[] = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
  const curIdx = monthsSequence.indexOf(activeMonth);
  let momGrowth: number | null = null;
  if (periodScale > 0 && curIdx > 0) {
    const prevMonth = monthsSequence[curIdx - 1];
    const prevMonthData = product.monthlySales[prevMonth];
    const prevSellOut = getRegionalSellOutUnits(prevMonthData, filter.region);

    if (prevSellOut > 0) {
      const baseComparable = monthData?.isPartialMonth ? baseMonthSellOut * 1.15 : baseMonthSellOut;
      momGrowth = Number((((baseComparable - prevSellOut) / prevSellOut) * 100).toFixed(1));
    }
  }

  return {
    studyCount,
    practiceCount,
    examCount,
    totalTasks,
    totalPracticeSubmits: scaledPracticePersonTimes,
    studyPersonTimes: scaledStudyPersonTimes,
    practicePersonTimes: scaledPracticePersonTimes,
    examPersonTimes: scaledExamPersonTimes,
    trainingPersonTimes: scaledTrainingPersonTimes,
    totalRequiredBAs,
    participatedCount,
    unparticipatedCount,
    coverageRate,
    studyCompletionRate,
    practiceQualifiedRate,
    examPassRate,
    sellOutUnits: currentSellOut,
    momGrowth,
    isPartialMonth: monthData?.isPartialMonth || false
  };
}

/**
 * 获取单个大单品在当前月份分为4个区间的趋势图数据 (堆叠柱状图 + 折线图)
 * 每月划分为 4 个区间：
 * - 第1周 (1-7日)
 * - 第2周 (8-14日)
 * - 第3周 (15-21日)
 * - 第4周 (22-31日)
 */
export function getHeroProductTrendIntervals(
  product: HeroProductItem,
  filter: HeroProductFilterState
) {
  const stats = computeHeroProductRowStats(product, filter);

  // 4 个周度区间的自然比例分布（模拟真实培训开展与销售节奏）：
  // 第1周: 课件发布，以学习为主 (占比约 45% 学习，15% 练习，5% 考试，21% 销量)
  // 第2周: 进阶实操，以对练为主 (占比约 30% 学习，35% 练习，20% 考试，25% 销量)
  // 第3周: 全员考核与实战 (占比约 15% 学习，30% 练习，45% 考试，28% 销量)
  // 第4周: 扫尾冲刺与月末促单 (占比约 10% 学习，20% 练习，30% 考试，26% 销量)
  const intervalDefs = [
    {
      id: 'week-1',
      label: '第1周',
      dateRange: '1-7日',
      studyRatio: 0.45,
      practiceRatio: 0.16,
      examRatio: 0.05,
      salesRatio: 0.21
    },
    {
      id: 'week-2',
      label: '第2周',
      dateRange: '8-14日',
      studyRatio: 0.30,
      practiceRatio: 0.36,
      examRatio: 0.20,
      salesRatio: 0.25
    },
    {
      id: 'week-3',
      label: '第3周',
      dateRange: '15-21日',
      studyRatio: 0.15,
      practiceRatio: 0.28,
      examRatio: 0.45,
      salesRatio: 0.28
    },
    {
      id: 'week-4',
      label: '第4周',
      dateRange: '22-31日',
      studyRatio: 0.10,
      practiceRatio: 0.20,
      examRatio: 0.30,
      salesRatio: 0.26
    }
  ];

  // 计算分配，并确保第4周吸收任何舍入差额，保证求和与 stats 绝对相等
  let accumulatedStudy = 0;
  let accumulatedPractice = 0;
  let accumulatedExam = 0;
  let accumulatedSales = 0;

  return intervalDefs.map((def, idx) => {
    const isLast = idx === intervalDefs.length - 1;

    const study = isLast
      ? Math.max(0, stats.studyPersonTimes - accumulatedStudy)
      : Math.round(stats.studyPersonTimes * def.studyRatio);
    accumulatedStudy += study;

    const practice = isLast
      ? Math.max(0, stats.practicePersonTimes - accumulatedPractice)
      : Math.round(stats.practicePersonTimes * def.practiceRatio);
    accumulatedPractice += practice;

    const exam = isLast
      ? Math.max(0, stats.examPersonTimes - accumulatedExam)
      : Math.round(stats.examPersonTimes * def.examRatio);
    accumulatedExam += exam;

    const sales = isLast
      ? Math.max(0, stats.sellOutUnits - accumulatedSales)
      : Math.round(stats.sellOutUnits * def.salesRatio);
    accumulatedSales += sales;

    const total = study + practice + exam;

    return {
      intervalId: def.id,
      intervalLabel: def.label,
      dateRange: def.dateRange,
      studyPersonTimes: study,
      practicePersonTimes: practice,
      examPersonTimes: exam,
      totalPersonTimes: total,
      sellOutUnits: sales
    };
  });
}

// ================= 5. 培训周期与培训前后7天销量对比引擎 =================
// 参考当前业务日（2026-11-23 周一）
const HERO_CYCLE_REFERENCE_TODAY = '2026-11-23';
const REGION_KEYS: ('Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang')[] = [
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Medan',
  'Semarang',
];
const REGION_WEIGHTS: Record<'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang', number> = {
  Jakarta: 0.38,
  Bandung: 0.28,
  Surabaya: 0.16,
  Medan: 0.10,
  Semarang: 0.08,
};

function parseUTCDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatUTCDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysUTC(dateStr: string, days: number): string {
  const dt = parseUTCDate(dateStr);
  dt.setUTCDate(dt.getUTCDate() + days);
  return formatUTCDate(dt);
}

function getMondayOfWeekUTC(dateStr: string): string {
  const dt = parseUTCDate(dateStr);
  const dayOfWeek = dt.getUTCDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  dt.setUTCDate(dt.getUTCDate() + diffToMonday);
  return formatUTCDate(dt);
}

function diffDaysUTC(startStr: string, endStr: string): number {
  const a = parseUTCDate(startStr).getTime();
  const b = parseUTCDate(endStr).getTime();
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

interface ProductTaskActivityEvent {
  taskId: string;
  type: 'study' | 'practice' | 'exam';
  activityDate: string; // YYYY-MM-DD
  /** 若标记为独立新发起的再培训波次（例如在后7天观察窗内新启动的回炉/追加培训），不与前一周期合并 */
  isNewWaveInterference?: boolean;
}

/**
 * 为每个大单品构建按自然周展开的关联培训任务活动事件
 * （同产品同一自然周内的学习、练习、考试任务自动归并至同一周内活动）
 */
function getProductTaskEvents(product: HeroProductItem): ProductTaskActivityEvent[] {
  const prodNum = parseInt(product.id.replace('hero-prod-', ''), 10) || 1;
  const tIds = product.taskIds.length > 0 ? product.taskIds : ['hero-task-1'];
  const getTaskType = (idx: number): 'study' | 'practice' | 'exam' => {
    const tId = tIds[idx % tIds.length];
    return MOCK_HERO_TASKS.find(t => t.id === tId)?.type || 'study';
  };

  if (prodNum === 1) {
    return [
      // 周期1: 进行中当前周 (11/23—11/29)
      { taskId: tIds[0], type: getTaskType(0), activityDate: '2026-11-23' },
      // 周期2: 最近完整周期 (11/9—11/15，含同一自然周内多任务合并)
      { taskId: tIds[0], type: 'study', activityDate: '2026-11-09' },
      { taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-11-11' },
      { taskId: tIds[2 % tIds.length], type: 'exam', activityDate: '2026-11-13' },
      // 周期3: 跨月连续2周合并 (9/28—10/11 = 9/28—10/4 + 10/5—10/11)
      { taskId: tIds[0], type: 'study', activityDate: '2026-09-29' },
      { taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-10-06' },
      { taskId: tIds[2 % tIds.length], type: 'exam', activityDate: '2026-10-09' },
      // 周期4: 连续3周「长期连续培训」(8/17—9/6)
      { taskId: tIds[0], type: 'study', activityDate: '2026-08-18' },
      { taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-08-26' },
      { taskId: tIds[2 % tIds.length], type: 'exam', activityDate: '2026-09-03' },
    ];
  }

  if (prodNum === 2) {
    return [
      // 刚结束但后7天未完 (11/16—11/22 -> POST_WINDOW_INCOMPLETE)
      { taskId: tIds[0], type: 'study', activityDate: '2026-11-17' },
      { taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-11-20' },
      // 跨月完整周期 (10/26—11/1)
      { taskId: tIds[0], type: 'study', activityDate: '2026-10-27' },
      { taskId: tIds[1 % tIds.length], type: 'exam', activityDate: '2026-10-30' },
      // 历史周期 (9/14—9/20)
      { taskId: tIds[0], type: 'study', activityDate: '2026-09-15' },
    ];
  }

  if (prodNum === 3) {
    return [
      // 主评估周期 (11/9—11/15) + 后7天窗内(11/20)新发起再培训活动 -> 存在再次培训干扰
      { taskId: tIds[0], type: 'study', activityDate: '2026-11-10' },
      { taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-11-12' },
      {
        taskId: tIds[2 % tIds.length],
        type: 'practice',
        activityDate: '2026-11-20',
        isNewWaveInterference: true,
      },
      // 历史周期 (10/5—10/11)
      { taskId: tIds[0], type: 'study', activityDate: '2026-10-06' },
      { taskId: tIds[1 % tIds.length], type: 'exam', activityDate: '2026-10-08' },
      // 连续3周「长期连续培训」(8/3—8/23)
      { taskId: tIds[0], type: 'study', activityDate: '2026-08-04' },
      { taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-08-12' },
      { taskId: tIds[2 % tIds.length], type: 'exam', activityDate: '2026-08-19' },
    ];
  }

  if (prodNum === 4) {
    return [
      // 11/9—11/15 存在后7天销量缺失 -> DATA_INCOMPLETE（不作为默认周期）
      { taskId: tIds[0], type: 'study', activityDate: '2026-11-10' },
      { taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-11-13' },
      // 默认最近完整周期 (10/12—10/18)
      { taskId: tIds[0], type: 'study', activityDate: '2026-10-13' },
      { taskId: tIds[1 % tIds.length], type: 'exam', activityDate: '2026-10-16' },
      // 历史周期 (9/7—9/13)
      { taskId: tIds[0], type: 'study', activityDate: '2026-09-08' },
    ];
  }

  if (prodNum === 5) {
    return [
      // 默认最近完整周期 (11/2—11/8，负增长红字)
      { taskId: tIds[0], type: 'study', activityDate: '2026-11-03' },
      { taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-11-05' },
      // 历史完整周期 (9/21—9/27，持平 0% 灰字)
      { taskId: tIds[0], type: 'study', activityDate: '2026-09-22' },
      { taskId: tIds[1 % tIds.length], type: 'exam', activityDate: '2026-09-25' },
    ];
  }

  // 其余产品按序号确定性分布各类型周期（含跨月合并、长期连续、未完与完整历史周期）
  const events: ProductTaskActivityEvent[] = [];
  if (prodNum % 4 === 0) {
    events.push({ taskId: tIds[0], type: getTaskType(0), activityDate: '2026-11-23' });
  } else if (prodNum % 4 === 1) {
    events.push({ taskId: tIds[0], type: getTaskType(0), activityDate: '2026-11-17' });
  }

  // 最近完整单周或跨月2周
  if (prodNum % 3 === 0) {
    events.push({ taskId: tIds[0], type: 'study', activityDate: '2026-10-27' });
    events.push({ taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-11-04' });
  } else {
    events.push({ taskId: tIds[0], type: 'study', activityDate: '2026-11-09' });
    events.push({ taskId: tIds[1 % tIds.length], type: 'exam', activityDate: '2026-11-12' });
    if (prodNum % 5 === 2) {
      events.push({
        taskId: tIds[2 % tIds.length],
        type: 'practice',
        activityDate: '2026-11-19',
        isNewWaveInterference: true,
      });
    }
  }

  // 早前完整周期
  if (prodNum % 2 === 0) {
    events.push({ taskId: tIds[0], type: 'study', activityDate: '2026-09-08' });
    events.push({ taskId: tIds[1 % tIds.length], type: 'practice', activityDate: '2026-09-16' });
    events.push({ taskId: tIds[2 % tIds.length], type: 'exam', activityDate: '2026-09-24' });
  } else {
    events.push({ taskId: tIds[0], type: 'study', activityDate: '2026-09-29' });
    events.push({ taskId: tIds[1 % tIds.length], type: 'exam', activityDate: '2026-10-07' });
  }

  return events;
}

/**
 * 拆分为 5 大区整件数，严格保证 5 个大区相加等于全国总件数
 */
function splitTotalAcrossRegions(
  total: number
): Record<'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang', number> {
  const j = Math.round(total * REGION_WEIGHTS.Jakarta);
  const b = Math.round(total * REGION_WEIGHTS.Bandung);
  const s = Math.round(total * REGION_WEIGHTS.Surabaya);
  const m = Math.round(total * REGION_WEIGHTS.Medan);
  const sm = Math.max(0, total - (j + b + s + m));
  return { Jakarta: j, Bandung: b, Surabaya: s, Medan: m, Semarang: sm };
}

/**
 * 精确生成 7 天窗口内的每日大区销量（用于保证核心演示样本精确呈现如 360 -> 486, +35% 且分大区加总无误差）
 */
function distributeWeeklyTotalToDays(
  startDate: string,
  weeklyTotal: number,
  seed: number
): Record<string, Record<'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang', number>> {
  const result: Record<string, Record<'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang', number>> = {};
  const base = Math.floor(weeklyTotal / 7);
  let remainder = weeklyTotal - base * 7;

  // 对每天先分配基准 + 余数，再切分到 5 个大区；大区加总必然精确等于当日总件数，7 日加总必然精确等于 weeklyTotal
  for (let d = 0; d < 7; d++) {
    const dateStr = addDaysUTC(startDate, d);
    const bump = remainder > 0 ? 1 : 0;
    if (remainder > 0) remainder -= 1;
    const dayTotal = base + bump + (((d + seed) % 3 === 0 ? 1 : 0) - ((d + seed) % 3 === 1 ? 1 : 0));
    // 保持7日总和绝对不变：仅对前6日微调，最后一日吸纳平衡
    result[dateStr] = splitTotalAcrossRegions(Math.max(1, dayTotal));
  }

  // 校正最后一日确保7日全国合计绝对等于 weeklyTotal
  const dayKeys = Object.keys(result);
  let sumFirst6 = 0;
  for (let i = 0; i < 6; i++) {
    const row = result[dayKeys[i]];
    sumFirst6 += row.Jakarta + row.Bandung + row.Surabaya + row.Medan + row.Semarang;
  }
  const lastTotal = Math.max(0, weeklyTotal - sumFirst6);
  result[dayKeys[6]] = splitTotalAcrossRegions(lastTotal);
  return result;
}

/**
 * 获取某款大单品每日大区销量账本 (2026-06-01 至 2026-11-22)
 * 若某天存在数据缺失，返回 null（不按 0 处理）
 */
function buildProductDailySalesLedger(
  product: HeroProductItem
): Record<string, Record<'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang', number> | null> {
  const prodNum = parseInt(product.id.replace('hero-prod-', ''), 10) || 1;
  const ledger: Record<string, Record<'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang', number> | null> = {};

  // 先生成 2026-06-01 .. 2026-11-22 每日基础销售（按产品月度基准平滑折算日均销量，跨月连续不断档）
  const baseDailyNational = Math.max(35, Math.round((product.monthlySales['2026-09']?.sellOutUnits || 18000) / 30 / 12));
  const totalSpanDays = diffDaysUTC('2026-06-01', '2026-11-22') + 1;

  for (let i = 0; i < totalSpanDays; i++) {
    const dateStr = addDaysUTC('2026-06-01', i);
    const wave = Math.round(Math.sin((i + prodNum * 3) * 0.45) * Math.max(2, Math.round(baseDailyNational * 0.14)));
    const dayNational = Math.max(12, baseDailyNational + wave);
    ledger[dateStr] = splitTotalAcrossRegions(dayNational);
  }

  // 按产品设定关键窗口的真实对比销量（覆盖前7天/后7天整周，严格保持日销量可加总与跨月连贯）
  const applyWindowTotal = (startDate: string, totalUnits: number, seed: number) => {
    const mapped = distributeWeeklyTotalToDays(startDate, totalUnits, seed);
    Object.entries(mapped).forEach(([d, regMap]) => {
      ledger[d] = regMap;
    });
  };

  if (prodNum === 1) {
    // 11/9—11/15: pre (11/2—11/8) = 360 PCS, post (11/16—11/22) = 486 PCS (+35%)
    applyWindowTotal('2026-11-02', 360, 1);
    applyWindowTotal('2026-11-16', 486, 2);
    // 9/28—10/11: pre (9/21—9/27) = 320 PCS, post (10/12—10/18) = 416 PCS (+30%)
    applyWindowTotal('2026-09-21', 320, 3);
    applyWindowTotal('2026-10-12', 416, 4);
    // 8/17—9/6: pre (8/10—8/16) = 280 PCS, post (9/7—9/13) = 336 PCS (+20%)
    applyWindowTotal('2026-08-10', 280, 5);
    applyWindowTotal('2026-09-07', 336, 6);
  } else if (prodNum === 2) {
    // 11/16—11/22 的前7天 (11/9—11/15)
    applyWindowTotal('2026-11-09', 510, 7);
    // 10/26—11/1 跨月: pre = 480, post = 612 (+27.5%)
    applyWindowTotal('2026-10-19', 480, 8);
    applyWindowTotal('2026-11-02', 612, 9);
    // 9/14—9/20: pre = 420, post = 495 (+17.9%)
    applyWindowTotal('2026-09-07', 420, 10);
    applyWindowTotal('2026-09-21', 495, 11);
  } else if (prodNum === 3) {
    // 11/9—11/15 (存在再次培训干扰): pre = 310, post = 403 (+30%)
    applyWindowTotal('2026-11-02', 310, 12);
    applyWindowTotal('2026-11-16', 403, 13);
    // 10/5—10/11: pre = 290, post = 348 (+20%)
    applyWindowTotal('2026-09-28', 290, 14);
    applyWindowTotal('2026-10-12', 348, 15);
    // 8/3—8/23: pre = 250, post = 295 (+18%)
    applyWindowTotal('2026-07-27', 250, 16);
    applyWindowTotal('2026-08-24', 295, 17);
  } else if (prodNum === 4) {
    // 11/9—11/15: pre 完整，但 post 中 11/19、11/20 数据缺失 -> DATA_INCOMPLETE
    applyWindowTotal('2026-11-02', 440, 18);
    ledger['2026-11-19'] = null;
    ledger['2026-11-20'] = null;
    // 10/12—10/18 (默认最近完整): pre = 410, post = 512 (+24.9%)
    applyWindowTotal('2026-10-05', 410, 19);
    applyWindowTotal('2026-10-19', 512, 20);
    // 9/7—9/13: pre = 380, post = 437 (+15%)
    applyWindowTotal('2026-08-31', 380, 21);
    applyWindowTotal('2026-09-14', 437, 22);
  } else if (prodNum === 5) {
    // 11/2—11/8: 负增长 (-8.5%)
    applyWindowTotal('2026-10-26', 400, 23);
    applyWindowTotal('2026-11-09', 366, 24);
    // 9/21—9/27: 持平 (0%)
    applyWindowTotal('2026-09-14', 350, 25);
    applyWindowTotal('2026-09-28', 350, 26);
  } else {
    // 其余产品根据 prodNum 生成稳定且带正向/负向/持平差异的窗口销量
    const basePre = 220 + ((prodNum * 37) % 280);
    const deltaPattern = prodNum % 7;
    const growthFactor =
      deltaPattern === 0 ? 0 : deltaPattern === 5 ? -0.065 : 0.12 + (deltaPattern * 0.045);

    const post1 = Math.round(basePre * (1 + growthFactor));
    if (prodNum % 3 === 0) {
      applyWindowTotal('2026-10-19', basePre, prodNum);
      applyWindowTotal('2026-11-09', post1, prodNum + 1);
    } else {
      applyWindowTotal('2026-11-02', basePre, prodNum);
      applyWindowTotal('2026-11-16', post1, prodNum + 1);
    }

    // 早前历史周期（同样跨月可查）
    const baseHistPre = Math.round(basePre * 0.9);
    const histPost = Math.round(baseHistPre * 1.16);
    if (prodNum % 2 === 0) {
      applyWindowTotal('2026-08-31', baseHistPre, prodNum + 2);
      applyWindowTotal('2026-09-28', histPost, prodNum + 3);
    } else {
      applyWindowTotal('2026-09-21', baseHistPre, prodNum + 2);
      applyWindowTotal('2026-10-12', histPost, prodNum + 3);
    }
  }

  return ledger;
}

/**
 * 在不将缺失日期当成 0 的前提下，汇总 [startDate, endDate] 7 天窗口内的实际销量
 * 返回 { sum: number; isComplete: boolean }
 */
function sumWindowSalesStrict(
  ledger: Record<string, Record<'Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang', number> | null>,
  startDate: string,
  endDate: string,
  region: RegionKey
): { sum: number | null; isComplete: boolean } {
  const days = diffDaysUTC(startDate, endDate) + 1;
  if (days <= 0) return { sum: null, isComplete: false };

  let total = 0;
  for (let i = 0; i < days; i++) {
    const dateStr = addDaysUTC(startDate, i);
    // 日期超过已知最新日（如今天及以后）或显式为 null，均视为不完整，绝不补 0
    if (dateStr >= HERO_CYCLE_REFERENCE_TODAY) {
      return { sum: null, isComplete: false };
    }
    const dayEntry = ledger[dateStr];
    if (!dayEntry) {
      return { sum: null, isComplete: false };
    }
    if (region === 'ALL') {
      total += REGION_KEYS.reduce((acc, rk) => acc + dayEntry[rk], 0);
    } else {
      const rgm = HERO_RGM_REGIONS.find(r => r.rgmId === region);
      if (rgm) {
        const val = dayEntry[rgm.parentCity];
        if (typeof val !== 'number') {
          return { sum: null, isComplete: false };
        }
        total += Math.round(val * rgm.shareInParentCity);
      } else if (REGION_KEYS.includes(region as ParentCityKey)) {
        const val = dayEntry[region as ParentCityKey];
        if (typeof val !== 'number') {
          return { sum: null, isComplete: false };
        }
        total += val;
      } else {
        return { sum: null, isComplete: false };
      }
    }
  }
  return { sum: total, isComplete: true };
}

/**
 * 核心计算函数：识别某大单品的自然周培训周期及培训前后 7 天销量对比（按时间倒序返回，最近周期在前）
 * 严格遵循规则：
 * 1. 周一至周日自然周识别，同产品同一周内的学习/练习/考试合并为 1 次培训活动
 * 2. 连续自然周自动合并为 1 次连续培训周期；存在空档周则拆分为独立周期
 * 3. 连续 3 周及以上标记「长期连续培训」
 * 4. 培训前 7 天 = 周期开始前连续 7 天；培训后 7 天 = 周期结束后连续 7 天（支持跨月，不受筛选月份截断，受筛选大区过滤）
 * 5. 若培训后 7 天窗口内存在新的培训活动，标记「存在再次培训干扰」
 * 6. 存在任一窗口缺失数据时，标记「数据不完整」，不得按 0 处理
 */
export function getHeroProductTrainingCycles(
  product: HeroProductItem,
  region: RegionKey
): HeroTrainingCycleComparison[] {
  const events = getProductTaskEvents(product);
  const ledger = buildProductDailySalesLedger(product);

  // 将正常波次事件按自然周（周一 YYYY-MM-DD）聚合；独立干扰波次单独保留用于检测「存在再次培训干扰」与未完周期
  const regularEvents = events.filter(e => !e.isNewWaveInterference);
  const interferenceEvents = events.filter(e => e.isNewWaveInterference);

  const weekMap = new Map<string, Set<string>>();
  regularEvents.forEach(ev => {
    const monday = getMondayOfWeekUTC(ev.activityDate);
    if (!weekMap.has(monday)) {
      weekMap.set(monday, new Set<string>());
    }
    weekMap.get(monday)!.add(ev.taskId);
  });

  // 按自然周升序排列后，合并连续自然周（间隔恰好 7 天）
  const sortedMondays = Array.from(weekMap.keys()).sort();
  interface MergedCycleDraft {
    startMonday: string;
    endSunday: string;
    weekCount: number;
    taskIds: Set<string>;
  }

  const mergedDrafts: MergedCycleDraft[] = [];
  sortedMondays.forEach(monday => {
    const taskSet = weekMap.get(monday)!;
    const prev = mergedDrafts[mergedDrafts.length - 1];
    if (prev) {
      const prevLastMonday = addDaysUTC(prev.endSunday, -6);
      if (diffDaysUTC(prevLastMonday, monday) === 7) {
        // 连续自然周，合并
        prev.endSunday = addDaysUTC(monday, 6);
        prev.weekCount += 1;
        taskSet.forEach(id => prev.taskIds.add(id));
        return;
      }
    }
    mergedDrafts.push({
      startMonday: monday,
      endSunday: addDaysUTC(monday, 6),
      weekCount: 1,
      taskIds: new Set(taskSet),
    });
  });

  // 生成每个周期的对比指标
  const cycles: HeroTrainingCycleComparison[] = mergedDrafts.map((draft, idx) => {
    const startDate = draft.startMonday;
    const endDate = draft.endSunday;
    const preStartDate = addDaysUTC(startDate, -7);
    const preEndDate = addDaysUTC(startDate, -1);
    const postStartDate = addDaysUTC(endDate, 1);
    const postEndDate = addDaysUTC(endDate, 7);

    // 判断周期状态
    let status: HeroTrainingCycleStatus = 'COMPLETE';
    let preSales: number | null = null;
    let postSales: number | null = null;
    let changeRate: number | null = null;

    if (HERO_CYCLE_REFERENCE_TODAY <= endDate) {
      status = 'CYCLE_ONGOING';
    } else if (HERO_CYCLE_REFERENCE_TODAY <= postEndDate) {
      status = 'POST_WINDOW_INCOMPLETE';
      const preRes = sumWindowSalesStrict(ledger, preStartDate, preEndDate, region);
      preSales = preRes.isComplete ? preRes.sum : null;
    } else {
      const preRes = sumWindowSalesStrict(ledger, preStartDate, preEndDate, region);
      const postRes = sumWindowSalesStrict(ledger, postStartDate, postEndDate, region);
      preSales = preRes.isComplete ? preRes.sum : null;
      postSales = postRes.isComplete ? postRes.sum : null;

      if (!preRes.isComplete || !postRes.isComplete || preSales === null || postSales === null) {
        status = 'DATA_INCOMPLETE';
      } else {
        status = 'COMPLETE';
        changeRate = preSales > 0
          ? Number((((postSales - preSales) / preSales) * 100).toFixed(1))
          : null;
      }
    }

    // 检查培训后 7 天窗口 [postStartDate, postEndDate] 内是否出现新的培训活动
    const hasInterferenceInPostWindow = interferenceEvents.some(
      ev => ev.activityDate >= postStartDate && ev.activityDate <= postEndDate
    );

    return {
      cycleId: `${product.id}-cycle-${idx + 1}-${startDate}`,
      startDate,
      endDate,
      weekCount: draft.weekCount,
      preStartDate,
      preEndDate,
      postStartDate,
      postEndDate,
      taskIds: Array.from(draft.taskIds),
      status,
      isLongTermContinuous: draft.weekCount >= 3,
      hasRetrainingInterference: hasInterferenceInPostWindow,
      preSales,
      postSales,
      changeRate,
    };
  });

  // 按周期时间倒序（最新周期排在最前）
  return cycles.sort((a, b) => b.startDate.localeCompare(a.startDate));
}


