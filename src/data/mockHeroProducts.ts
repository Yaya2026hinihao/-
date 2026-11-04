import {
  HeroProductItem,
  HeroTask,
  HeroBAPerson,
  MonthKey,
  BrandKey,
  RegionKey,
  HeroProductFilterState
} from '../types/heroProduct';
import youSkinTintImg from '../assets/images/you_skin_tint_1790622591492.jpg';
import bnbLipCreamImg from '../assets/images/bnb_lip_cream_1790622604523.jpg';
import dazzleSettingSprayImg from '../assets/images/dazzle_setting_spray_1790622617563.jpg';
import youCushionCompactImg from '../assets/images/you_cushion_compact_1790622627959.jpg';
import glamfixPowderPuffImg from '../assets/images/glamfix_powder_puff_1790622638055.jpg';

export const HERO_MONTH_OPTIONS: { key: MonthKey; label: string; isPartial?: boolean }[] = [
  { key: '2026-10', label: '2026年10月 (当月)', isPartial: true },
  { key: '2026-09', label: '2026年09月' },
  { key: '2026-08', label: '2026年08月' },
  { key: '2026-07', label: '2026年07月' },
  { key: '2026-06', label: '2026年06月' },
];

export const HERO_BRAND_OPTIONS: { key: BrandKey; label: string }[] = [
  { key: 'ALL', label: '全部品牌 (Semua Brand)' },
  { key: 'YOU', label: 'Y.O.U Beauty' },
  { key: 'BNB', label: 'barenbliss (BNB)' },
  { key: 'DM', label: 'DAZZLE ME' },
  { key: 'LVJ', label: 'lavojoy' },
  { key: 'GF', label: 'GLAMFIX' },
  { key: 'FML', label: 'FORMULOGIC' },
];

export const HERO_REGION_OPTIONS: { key: RegionKey; label: string }[] = [
  { key: 'ALL', label: '全国大区 (Nasional - HQ)' },
  { key: 'Jakarta', label: 'Jakarta 大区' },
  { key: 'Bandung', label: 'Bandung 大区' },
  { key: 'Surabaya', label: 'Surabaya 大区' },
  { key: 'Medan', label: 'Medan 大区' },
  { key: 'Semarang', label: 'Semarang 大区' },
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
    '2026-10': {
      sellOutUnits: Math.round(baseMonthly * 0.94),
      isPartialMonth: true,
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

// ================= 3. 模拟全量 BA 人员（400人基础样本库，精准匹配首页400人总数大盘） =================
const REGIONS: ('Jakarta' | 'Bandung' | 'Surabaya' | 'Medan' | 'Semarang')[] = [
  'Jakarta', 'Jakarta', 'Bandung', 'Bandung', 'Surabaya', 'Medan', 'Semarang'
];

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
    storeName,
    participatedProductIds,
    completedTaskIds: Array.from(new Set(completedTaskIds)),
    assignedTaskIdsByProduct,
    practiceSubmitsByProduct,
    taskProgressDetails,
    lastActiveDate: `2026-10-${String((i % 28) + 1).padStart(2, '0')}`
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
    // 品牌筛选
    if (filter.brand !== 'ALL' && prod.brand !== filter.brand) {
      return false;
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
  const targetBAs = filter.region === 'ALL'
    ? MOCK_HERO_BA_LIST
    : MOCK_HERO_BA_LIST.filter(ba => ba.region === filter.region);

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

  // 5. 实际销量 (SELL OUT) 按选择月份及大区计算
  const monthData = product.monthlySales[filter.month];
  let currentSellOut = 0;
  if (filter.region === 'ALL') {
    currentSellOut = monthData?.sellOutUnits || 0;
  } else {
    currentSellOut = monthData?.byRegion[filter.region] || 0;
  }

  // 环比上一自然月销量
  const monthsSequence: MonthKey[] = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
  const curIdx = monthsSequence.indexOf(filter.month);
  let momGrowth: number | null = null;
  if (curIdx > 0) {
    const prevMonth = monthsSequence[curIdx - 1];
    const prevMonthData = product.monthlySales[prevMonth];
    const prevSellOut = filter.region === 'ALL'
      ? (prevMonthData?.sellOutUnits || 0)
      : (prevMonthData?.byRegion[filter.region] || 0);

    if (prevSellOut > 0) {
      const baseComparable = monthData?.isPartialMonth ? currentSellOut * 1.15 : currentSellOut;
      momGrowth = Number((((baseComparable - prevSellOut) / prevSellOut) * 100).toFixed(1));
    }
  }

  return {
    studyCount,
    practiceCount,
    examCount,
    totalTasks,
    totalPracticeSubmits: practicePersonTimes,
    studyPersonTimes,
    practicePersonTimes,
    examPersonTimes,
    trainingPersonTimes: totalTrainingPersonTimes,
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

