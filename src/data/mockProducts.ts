import { Product, RoleConfig, AIRecommendation } from '../types/product';
import youSkinTintImg from '../assets/images/you_skin_tint_1790622591492.jpg';
import bnbLipCreamImg from '../assets/images/bnb_lip_cream_1790622604523.jpg';
import dazzleSettingSprayImg from '../assets/images/dazzle_setting_spray_1790622617563.jpg';
import youCushionCompactImg from '../assets/images/you_cushion_compact_1790622627959.jpg';
import glamfixPowderPuffImg from '../assets/images/glamfix_powder_puff_1790622638055.jpg';

export const INITIAL_ROLE_CONFIGS: RoleConfig[] = [
  { id: 'role-1', name: '大单品', color: '#B45309', bgColor: '#FEF3C7', borderColor: '#FDE68A' },
  { id: 'role-2', name: '主推品', color: '#C2410C', bgColor: '#FFEDD5', borderColor: '#FDBA74' },
  { id: 'role-3', name: '重点品', color: '#B91C1C', bgColor: '#FEE2E2', borderColor: '#FECACA' },
  { id: 'role-4', name: '激励品', color: '#7E22CE', bgColor: '#F3E8FF', borderColor: '#E9D5FF' },
  { id: 'role-5', name: '连带品', color: '#047857', bgColor: '#ECFDF5', borderColor: '#A7F3D0' },
  { id: 'role-6', name: '新品', color: '#0369A1', bgColor: '#E0F2FE', borderColor: '#BAE6FD', isCustom: true },
  { id: 'role-7', name: '季节主推', color: '#A16207', bgColor: '#FEF9C3', borderColor: '#FEF08A', isCustom: true },
  { id: 'role-8', name: '区域重点', color: '#4338CA', bgColor: '#EEF2FF', borderColor: '#C7D2FE', isCustom: true },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-lvj-shampoo',
    spu: 'lavojoy Hold Me Tight Amino Acid Scalp Care Shampoo',
    sku: 'LAVOJOY HOLD ME TIGHT SCALP CARE SHAMPOO SPRING WONDER 280ML',
    name: 'lavojoy 控油丰盈无硅油洗发水 (Hold Me Tight)',
    brand: 'LVJ',
    series: 'Hold Me Tight 洗护系列',
    category: 'PERSONAL CARE',
    subCategory: 'HAIR',
    image: youSkinTintImg,
    status: '当期主推',
    stock: 28400,
    roles: ['主推品', '重点品'],
    isFocus: true,
    description: '专为湿热气候油头扁塌设计的无硅油控油蓬松洗发水，富含0.5%水杨酸与姜根提取物，72小时高颅顶蓬松清爽。',
    sellingPoints: [
      '微米级无硅油氨基酸配方，深层净化毛囊多余油脂与皮屑',
      '专研蓬松因子，洗后发根挺立，告别油头扁塌与尴尬贴头皮',
      '高端沙龙调香，柑橘木质调，长效留香48小时'
    ],
    goldenSentences: [
      '“洗一次管三天！高颅顶蓬松神器，细软油塌发质救星。”',
      '“温和去油不伤头皮，发丝轻盈会跳舞。”'
    ],
    persona: {
      targetGroups: ['熟龄顾客', '年轻顾客', '年轻白领', '高消费顾客'],
      scenarios: ['日常', '通勤', '重要会议', '聚会'],
      demands: ['控油', '蓬松', '去屑', '舒缓'],
      customerConcerns: ['头皮容易出油', '头发干枯毛躁'],
      categoryDimensions: {
        '头皮类型': ['油性头皮', '易头屑头皮', '敏感头皮'],
        '头发状态': ['细软扁塌', '易出油扁塌', '干枯毛躁']
      }
    },
    crossSelling: [],
    studyCount: 2,
    practiceCount: 3,
    examAvgScore: 88,
    studyAssets: [
      {
        id: 'study-lvj-1',
        title: 'lavojoy 头皮微生态学与水杨酸控油技术课件',
        type: '课件',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        durationMinutes: 15,
        lastUsedDate: '2026-08-15',
        passRate: 97.0
      },
      {
        id: 'study-lvj-2',
        title: '洗发水沙龙级起泡与专柜洗护搭配实操',
        type: '视频课程',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 1,
        durationMinutes: 18,
        lastUsedDate: '2026-08-18',
        passRate: 94.0
      }
    ],
    practiceAssets: [
      {
        id: 'pract-lvj-1',
        title: '熟龄顾客日常控油蓬松洗发水咨询演练',
        type: '数字人',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        dialogueTurns: 5,
        avgPassRate: 89.0,
        lastUsedDate: '2026-08-20',
        conditions: {
          targetGroups: ['熟龄顾客'],
          scenarios: ['日常'],
          demands: ['控油', '蓬松'],
          customerConcerns: ['头皮容易出油'],
          categoryDimensions: {
            '头皮类型': ['油性头皮'],
            '头发状态': ['细软扁塌']
          }
        }
      },
      {
        id: 'pract-lvj-2',
        title: '油性头皮日常去屑洗发水推荐场景对话',
        type: '场景对话',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 1,
        dialogueTurns: 6,
        avgPassRate: 85.0,
        lastUsedDate: '2026-08-22',
        conditions: {
          targetGroups: ['年轻顾客', '男性顾客'],
          scenarios: ['日常', '通勤'],
          demands: ['去屑', '控油'],
          customerConcerns: ['头皮容易出油'],
          categoryDimensions: {
            '头皮类型': ['油性头皮', '易头屑头皮'],
            '头发状态': ['易出油扁塌']
          }
        }
      },
      {
        id: 'pract-lvj-3',
        title: '控油蓬松丰盈高颅顶核心口播金句',
        type: '金句',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        dialogueTurns: 2,
        avgPassRate: 96.0,
        lastUsedDate: '2026-08-25',
        conditions: {
          targetGroups: ['不限'],
          scenarios: ['日常'],
          demands: ['蓬松', '控油'],
          customerConcerns: ['不限'],
          categoryDimensions: {
            '头皮类型': ['油性头皮'],
            '头发状态': ['细软扁塌']
          }
        }
      }
    ],
    examAssets: [
      {
        id: 'exam-lvj-1',
        title: 'lavojoy 洗发水核心头皮配方与顾客推荐专柜考试',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        averageScore: 88,
        passingScore: 80,
        totalParticipants: 646,
        lastUsedDate: '2026-08-26'
      }
    ]
  },
  {
    id: 'prod-lvj-body',
    spu: 'lavojoy Let It Glow Body Serum Gel Orange Blossom',
    sku: 'LAVOJOY LET IT GLOW BODY SERUM GEL 300ML',
    name: 'lavojoy Let It Glow 烟酰胺光感身体精华乳',
    brand: 'LVJ',
    series: 'Let It Glow 身体美白系列',
    category: 'PERSONAL CARE',
    subCategory: 'BODY',
    image: dazzleSettingSprayImg,
    status: '在售',
    stock: 19800,
    roles: ['连带品', '重点品'],
    isFocus: false,
    description: '烟酰胺与神经酰胺双重复配身体精华乳，清爽啫喱质地，3秒吸收不粘睡衣，深层修护换季干燥起屑。',
    sellingPoints: [
      '3%高纯烟酰胺复配玻尿酸，7天焕亮身体暗沉肌肤',
      '水感爆水凝露，沐浴后一抹即化，润而不腻',
      '法国知名调香师定制橙花与柑橘香氛，沐浴后持久清新'
    ],
    goldenSentences: [
      '“身体也需要用精华乳！沐浴后抹一抹，滑嫩透亮到发光。”',
      '“3秒吸收不沾睡衣，告别身体起皮粗糙。”'
    ],
    persona: {
      targetGroups: ['干燥肌肤人群', '年轻顾客', '精致妈妈'],
      scenarios: ['沐浴后', '日常', '旅行', '约会'],
      demands: ['保湿', '提亮', '舒缓', '修护'],
      customerConcerns: ['身体肌肤干燥', '暗沉无光'],
      categoryDimensions: {
        '身体肌肤状态': ['干燥粗糙', '起屑紧绷', '暗沉无光', '晒后泛红']
      }
    },
    crossSelling: [],
    studyCount: 1,
    practiceCount: 2,
    examAvgScore: null,
    studyAssets: [
      {
        id: 'study-lvj-body-1',
        title: 'lavojoy 身体系列成份解析与沐浴后连带技巧',
        type: '课件',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        durationMinutes: 10,
        lastUsedDate: '2026-08-16',
        passRate: 98.0
      }
    ],
    practiceAssets: [
      {
        id: 'pract-lvj-body-1',
        title: '干燥肌肤沐浴后身体乳保湿推荐场景对话',
        type: '场景对话',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 1,
        dialogueTurns: 5,
        avgPassRate: 87.0,
        lastUsedDate: '2026-08-21',
        conditions: {
          targetGroups: ['干燥肌肤人群', '女性顾客'],
          scenarios: ['沐浴后', '日常'],
          demands: ['保湿', '舒缓'],
          customerConcerns: ['身体肌肤干燥'],
          categoryDimensions: {
            '身体肌肤状态': ['干燥粗糙', '起屑紧绷']
          }
        }
      },
      {
        id: 'pract-lvj-body-2',
        title: '烟酰胺身体精华乳提亮发光核心推荐金句',
        type: '金句',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        dialogueTurns: 2,
        avgPassRate: 95.0,
        lastUsedDate: '2026-08-25',
        conditions: {
          targetGroups: ['不限'],
          scenarios: ['不限'],
          demands: ['提亮', '保湿'],
          customerConcerns: ['不限'],
          categoryDimensions: {
            '身体肌肤状态': ['暗沉无光', '干燥粗糙']
          }
        }
      }
    ],
    examAssets: []
  },

  {
    id: 'prod-you-tint',
    spu: 'Y.O.U Cloud Touch 3% Niacinamide Brightening Skin Tint',
    sku: 'Y.O.U CLOUD TOUCH 3% NIACINAMIDE BRIGHTENING SKIN TINT C203 PINK SAND 20ML',
    name: 'Y.O.U 云感 3% 烟酰胺养肤粉底液 (Skin Tint)',
    brand: 'YOU',
    series: 'Cloud Touch 养肤底妆系列',
    category: 'MAKEUP',
    subCategory: 'FACE',
    image: youSkinTintImg,
    status: '当期主推',
    stock: 14579,
    roles: ['大单品', '主推品'],
    isFocus: true,
    description: '革新性轻薄水感养肤粉底液，专为东南亚混油皮及易脱妆气候设计。蕴含3%高纯烟酰胺与神经酰胺精粹，兼顾清透遮瑕与12小时超长待机不暗沉。',
    sellingPoints: [
      '3% 高纯度烟酰胺复配，上妆即养肤，卸妆不暗沉',
      '水感轻透爆水质地，10秒迅速成膜，不粘腻不起皮',
      '专为东南亚湿热气候调配，12H持久控油抗汗，妆感通透自然',
      '亚洲专研5大色号，精准校正暗黄与泛红，打造伪素颜妈生好皮'
    ],
    goldenSentences: [
      '“底妆不是面具，是会呼吸的第二层原生皮肤。”',
      '“3%高纯烟酰胺边化妆边提亮，带妆一整天卸完妆依然通透发光！”',
      '“夏天出油出汗也不斑驳，一抹即融，告别假面厚重感。”'
    ],
    persona: {
      targetGroups: ['年轻顾客', '熟龄顾客', '新手顾客', '年轻白领'],
      scenarios: ['日常', '通勤', '约会', '婚礼'],
      demands: ['控油', '持妆', '提亮', '遮瑕'],
      customerConcerns: ['担心脱妆', '担心卡粉', '不知道怎么选择'],
      categoryDimensions: {
        '肤质': ['油皮', '混油皮', '干皮', '敏感肌'],
      },
      skinTypes: ['油皮', '混油皮', '干皮', '敏感肌'],
    },
    crossSelling: [
      {
        productId: 'prod-dm-spray',
        productName: 'DAZZLE ME 定妆喷雾 (Get a Grip! Dewy/Matte Fix)',
        brand: 'DM',
        sku: 'DAZZLE ME GET A GRIP! MAKEUP SETTING SPRAY MATTE FIX 60ML',
        image: dazzleSettingSprayImg,
        role: '连带品',
        recommendReason: '配合粉底液使用“三明治定妆法”，锁死底妆，控油持妆延长至16小时。',
        recommendedPitch: '“美女，如果夏天容易出油脱妆，推荐搭配这支定妆喷雾，底妆前后各喷一次，就像给底妆穿上隐形雨衣！”',
        associatedPracticeScene: '底妆持妆连带话术推荐与成膜演示'
      },
      {
        productId: 'prod-gf-puff',
        productName: 'GLAMFIX 专业高弹双面气垫粉扑 (2入装)',
        brand: 'GF',
        sku: 'GLAMFIX PROFESSIONAL AIRCUSHION PUFF 2PCS/BAG',
        image: glamfixPowderPuffImg,
        role: '连带品',
        recommendReason: '红宝石切面气垫粉扑，微孔吃粉少，上妆服帖度提升40%，鼻翼眼角无死角。',
        recommendedPitch: '“用这款高密植绒粉扑轻拍上妆，不仅省粉，遮瑕力和服帖感立刻翻倍，连鼻翼都不会卡粉哦！”',
        associatedPracticeScene: '粉扑工具连带技巧与试妆演示'
      },
      {
        productId: 'prod-you-serum',
        productName: 'Y.O.U AcnePlus 净痘修护精华乳',
        brand: 'YOU',
        sku: 'Y.O.U ACNEPLUS SPOT CARE PRO SERUM 15G',
        image: youSkinTintImg,
        role: '连带品',
        recommendReason: '妆前点涂痘痘与泛红区域，快速舒缓平复，防止底妆拔干卡粉。',
        recommendedPitch: '“局部泛红痘印可以在粉底前先点涂这支AcnePlus，既能舒缓红肿，底妆遮盖也更自然服帖。”',
        associatedPracticeScene: '痘肌顾客底妆前置护理推荐'
      }
    ],
    studyCount: 3,
    practiceCount: 5,
    examAvgScore: 86,
    studyAssets: [
      {
        id: 'study-1',
        title: 'Y.O.U Cloud Touch 粉底液核心产品知识与成份解析',
        type: '课件',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 2,
        durationMinutes: 15,
        lastUsedDate: '2026-08-20',
        passRate: 98.4
      },
      {
        id: 'study-2',
        title: 'Cloud Touch 3% 烟酰胺养肤卖点与竞品对比培训',
        type: '课件',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 1,
        durationMinutes: 20,
        lastUsedDate: '2026-08-15',
        passRate: 95.1
      },
      {
        id: 'study-3',
        title: 'Q4 重点粉底液新品进阶专柜陈列与实操演示',
        type: '视频课程',
        author: 'Bandung 区域培训经理 (Dewi)',
        authorRole: 'Bandung培训师',
        targetAudience: 'Bandung BA (共86人)',
        usageCount: 0,
        durationMinutes: 25,
        lastUsedDate: '2026-08-10',
        passRate: 92.0
      }
    ],
    practiceAssets: [
      {
        id: 'pract-1',
        title: '油皮顾客控油持妆咨询与异议处理',
        type: '数字人',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 2,
        dialogueTurns: 5,
        avgPassRate: 88.5,
        lastUsedDate: '2026-08-22',
        conditions: {
          targetGroups: ['年轻顾客', '年轻白领'],
          scenarios: ['日常', '通勤'],
          demands: ['控油', '持妆'],
          customerConcerns: ['担心脱妆', '担心卡粉'],
          categoryDimensions: { '肤质': ['油皮', '混油皮'] }
        }
      },
      {
        id: 'pract-2',
        title: '熟龄顾客婚礼妆容咨询与持妆方案',
        type: '场景对话',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 1,
        dialogueTurns: 6,
        avgPassRate: 82.0,
        lastUsedDate: '2026-08-18',
        conditions: {
          targetGroups: ['熟龄顾客'],
          scenarios: ['婚礼', '聚会'],
          demands: ['持妆', '自然水光'],
          customerConcerns: ['担心卡粉'],
          categoryDimensions: { '肤质': ['干皮', '混油皮'] }
        }
      },
      {
        id: 'pract-3',
        title: '持妆产品推荐核心销售金句',
        type: '金句',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        dialogueTurns: 3,
        avgPassRate: 96.0,
        lastUsedDate: '2026-08-25',
        conditions: {
          targetGroups: ['不限'],
          scenarios: ['不限'],
          demands: ['持妆'],
          customerConcerns: ['不限'],
          categoryDimensions: { '肤质': ['不限'] }
        }
      },
      {
        id: 'pract-4',
        title: '新手顾客日常通勤底妆挑选与推荐',
        type: '数字人',
        author: 'Bandung 区域培训经理 (Dewi)',
        authorRole: 'Bandung培训师',
        targetAudience: 'Bandung BA (共86人)',
        usageCount: 0,
        dialogueTurns: 4,
        avgPassRate: 75.4,
        lastUsedDate: '2026-08-12',
        conditions: {
          targetGroups: ['新手顾客', '年轻顾客'],
          scenarios: ['日常', '通勤'],
          demands: ['提亮', '轻薄养肤'],
          customerConcerns: ['不知道怎么选择'],
          categoryDimensions: { '肤质': ['混油皮', '油皮'] }
        }
      },
      {
        id: 'pract-5',
        title: '熟龄顾客婚礼干皮高保湿持妆实战演练',
        type: '场景对话',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 1,
        dialogueTurns: 7,
        avgPassRate: 80.6,
        lastUsedDate: '2026-08-19',
        conditions: {
          targetGroups: ['熟龄顾客', '女性顾客'],
          scenarios: ['婚礼', '约会'],
          demands: ['持妆', '保湿'],
          customerConcerns: ['担心卡粉', '担心脱妆'],
          categoryDimensions: { '肤质': ['干皮'] }
        }
      }
    ],
    examAssets: [
      {
        id: 'exam-1',
        title: 'Cloud Touch 底妆系列产品知识与色号掌握全国通考',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 2,
        averageScore: 86,
        passingScore: 80,
        totalParticipants: 646,
        lastUsedDate: '2026-08-24'
      }
    ],
    regionalStats: [
      { region: '全国', avgExamScore: 86, completionRate: 94.2, salesVolume: 51800, salesGrowth: '+28.4%' },
      { region: 'Jakarta', avgExamScore: 89, completionRate: 96.0, salesVolume: 24300, salesGrowth: '+35.1%' },
      { region: 'Bandung', avgExamScore: 81, completionRate: 88.5, salesVolume: 12100, salesGrowth: '+18.2%' },
      { region: 'Surabaya', avgExamScore: 78, completionRate: 82.0, salesVolume: 9800, salesGrowth: '+12.0%' }
    ]
  },
  {
    id: 'prod-bnb-lip',
    spu: 'barenbliss Aura Mood Transferproof Matte Lip Cream',
    sku: 'BARENBLISS AURA MOOD TRANSFERPROOF MATTE LIP CREAM 007 TWILIGHT TALE 2.5ML',
    name: 'barenbliss 气场哑光不沾杯唇泥 (Aura Mood)',
    brand: 'BNB',
    series: 'Aura Mood 氛围唇妆系列',
    category: 'MAKEUP',
    subCategory: 'LIPS',
    image: bnbLipCreamImg,
    status: '在售',
    stock: 8642,
    roles: ['重点品'],
    isFocus: true,
    description: '韩系丝绒柔焦哑光质地，成膜后真正锁色不沾杯、不拔干，高显色度同时兼顾清爽唇部触感。',
    sellingPoints: [
      '独特转移防护技术，喝水不沾杯、戴口罩不掉色',
      '蕴含白池花籽油与维生素E，柔焦哑光但不起皮不显唇纹',
      '调配经典韩系微醺色系，黄皮显白提气色神器'
    ],
    goldenSentences: [
      '“喝咖啡、戴口罩都不掉色的高定丝绒唇泥，一整天都在最佳气色状态。”',
      '“哑而不干，像羊绒般滑过唇间。”'
    ],
    persona: {
      targetGroups: ['年轻顾客', '学生党', '年轻白领'],
      scenarios: ['日常', '约会', '聚会'],
      demands: ['持妆', '提亮', '保湿'],
      customerConcerns: ['担心不显色/沾杯', '不知道怎么选择'],
      categoryDimensions: {
        '肤质': ['所有肤质', '唇部易干燥']
      },
      skinTypes: ['所有肤质', '唇部易干燥人群']
    },
    crossSelling: [
      {
        productId: 'prod-gf-curler',
        productName: 'GLAMFIX 广角持久卷翘睫毛夹',
        brand: 'GF',
        sku: 'GLAMFIX EYELASH CURLER 1PC/BOX',
        image: glamfixPowderPuffImg,
        role: '连带品',
        recommendReason: '眼唇搭配推荐：立体的卷翘太阳花睫毛配上哑光红唇，打造完整出圈韩系妆容。',
        recommendedPitch: '“化了这么好看的唇妆，搭配这款广角睫毛夹把睫毛一夹立挺，整个人神采奕奕！”',
        associatedPracticeScene: '眼唇组合销售推荐与神情加分法'
      }
    ],
    studyCount: 3,
    practiceCount: 3,
    examAvgScore: null, // Displays as "—"
    studyAssets: [
      {
        id: 'study-bnb-1',
        title: 'barenbliss 唇妆色彩学与不沾杯技术拆解',
        type: '课件',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 2,
        durationMinutes: 12,
        lastUsedDate: '2026-08-11',
        passRate: 96.5
      },
      {
        id: 'study-bnb-2',
        title: 'Aura Mood 全色号BA专柜快速试色技巧',
        type: '产品图文',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 1,
        durationMinutes: 10,
        lastUsedDate: '2026-08-04',
        passRate: 98.0
      }
    ],
    practiceAssets: [
      {
        id: 'pract-bnb-1',
        title: '唇泥不沾杯真实纸巾按压展示演练',
        type: '数字人',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        dialogueTurns: 4,
        avgPassRate: 85.0,
        lastUsedDate: '2026-08-14'
      },
      {
        id: 'pract-bnb-2',
        title: '顾客嫌弃哑光唇膏拔干时的化解话术',
        type: '场景对话',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 1,
        dialogueTurns: 5,
        avgPassRate: 79.5,
        lastUsedDate: '2026-08-09'
      },
      {
        id: 'pract-bnb-3',
        title: 'Aura Mood 氛围感锁色金句通关',
        type: '金句',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        dialogueTurns: 2,
        avgPassRate: 94.0,
        lastUsedDate: '2026-08-18'
      }
    ],
    examAssets: [],
    regionalStats: [
      { region: '全国', avgExamScore: 0, completionRate: 88.0, salesVolume: 32000, salesGrowth: '+15.2%' },
      { region: 'Jakarta', avgExamScore: 0, completionRate: 92.0, salesVolume: 15400, salesGrowth: '+21.0%' },
      { region: 'Bandung', avgExamScore: 0, completionRate: 81.0, salesVolume: 8200, salesGrowth: '+9.4%' }
    ]
  },
  {
    id: 'prod-you-serum',
    spu: 'Y.O.U Radiance Up! Spotless Brightening Serum',
    sku: 'Y.O.U RADIANCE UP! SPOTLESS BRIGHTENING SERUM 20ML',
    name: 'Y.O.U 光感亮白淡斑精华 (Radiance Up!)',
    brand: 'YOU',
    series: 'Radiance 亮肤焕采系列',
    category: 'SKINCARE',
    subCategory: 'FACE',
    image: youSkinTintImg,
    status: '在售',
    stock: 28396,
    roles: ['连带品'],
    isFocus: false,
    description: '含有熊果苷+烟酰胺+VC衍生物的多通路美白淡斑精华，质地清爽易吸收，针对晒后暗沉斑点快速提亮。',
    sellingPoints: [
      '三维立体美白矩阵，阻断黑色素沉积',
      '微分子水凝质地，快速渗透肌底，温和不刺激',
      '14天实测淡化痘印与晒斑，均匀面部肤色'
    ],
    goldenSentences: [
      '“白天防晒抗光老，晚上淡斑白一个度，肌肤自然透光。”',
      '“滴滴浓缩的美白力量，让暗沉痘印悄悄隐形。”'
    ],
    persona: {
      targetGroups: ['熬夜暗沉肌', '晒后修复人群', '有斑点痘印困扰者'],
      skinTypes: ['暗沉肌', '油皮', '混干皮'],
      demands: ['淡斑美白', '改善暗黄', '均匀提亮'],
      scenarios: ['夜间护肤', '晒后修护', '妆前打底']
    },
    crossSelling: [],
    studyCount: 0, // Displays as "—"
    practiceCount: 1, // Displays as "1次"
    examAvgScore: null, // Displays as "—"
    studyAssets: [],
    practiceAssets: [
      {
        id: 'pract-serum-1',
        title: '护肤区顾客暗黄痘印连带销售对话演练',
        type: '场景对话',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 1,
        dialogueTurns: 4,
        avgPassRate: 86.4,
        lastUsedDate: '2026-08-01'
      }
    ],
    examAssets: []
  },
  {
    id: 'prod-dm-spray',
    spu: 'DAZZLE ME Get a Grip! Makeup Setting Spray',
    sku: 'DAZZLE ME GET A GRIP! MAKEUP SETTING SPRAY MATTE FIX 60ML',
    name: 'DAZZLE ME 锁妆持妆定妆喷雾 (Matte Fix / Dewy Fix)',
    brand: 'DM',
    series: 'Get a Grip! 控油定妆系列',
    category: 'MAKEUP',
    subCategory: 'FACE',
    image: dazzleSettingSprayImg,
    status: '当期主推',
    stock: 574148,
    roles: ['大单品', '连带品'],
    isFocus: true,
    description: '东南亚全网销量超500万支的国民定妆神器！微米级细密喷雾，30秒速干成膜，兼顾控油与补水抗脱妆。',
    sellingPoints: [
      '高透析微米级喷头，细腻如雾不毁底妆、不滋水珠',
      '双重成膜专利配方，防水、防汗、防蹭，超长待机16小时',
      '添加积雪草与积雪草苷精华，定妆同时舒缓平衡水油'
    ],
    goldenSentences: [
      '“30秒一喷成膜，从早到晚狂欢流汗，妆容依然牢牢焊在脸上！”',
      '“底妆神仙CP，买底妆不配它等于白化！”'
    ],
    persona: {
      targetGroups: ['年轻顾客', '熟龄顾客', '年轻白领'],
      scenarios: ['通勤', '户外活动', '婚礼', '聚会'],
      demands: ['控油', '持妆', '保湿'],
      customerConcerns: ['担心脱妆', '担心卡粉'],
      categoryDimensions: {
        '肤质': ['油皮', '混油皮', '干皮']
      },
      skinTypes: ['油皮', '混油皮', '大汗脱妆体质']
    },
    crossSelling: [
      {
        productId: 'prod-you-tint',
        productName: 'Y.O.U 云感 3% 烟酰胺养肤粉底液',
        brand: 'YOU',
        sku: 'Y.O.U CLOUD TOUCH 3% NIACINAMIDE BRIGHTENING SKIN TINT C203',
        image: youSkinTintImg,
        role: '主推品',
        recommendReason: '定妆喷雾搭配水感粉底液，打造“水光氧气肌”或“高级哑光雾面肌”，成单率极高。',
        recommendedPitch: '“喷雾配这款养肤粉底液，轻薄水润又完全不脱妆，是我们柜台本月最火的底妆搭档！”',
        associatedPracticeScene: '喷雾 + 粉底液连带销售全流程'
      },
      {
        productId: 'prod-gf-puff',
        productName: 'GLAMFIX 双面气垫粉扑',
        brand: 'GF',
        sku: 'GLAMFIX PROFESSIONAL AIRCUSHION PUFF 2PCS/BAG',
        image: glamfixPowderPuffImg,
        role: '连带品',
        recommendReason: '喷雾喷在粉扑上再按压定妆（烘焙定妆手法），持妆效果再加倍。',
        recommendedPitch: '“用喷雾打湿粉扑后轻拍，底妆服帖得像焊在皮肤上一样。”',
        associatedPracticeScene: '烘焙定妆技巧与工具连带'
      }
    ],
    studyCount: 4,
    practiceCount: 6,
    examAvgScore: 91,
    studyAssets: [
      {
        id: 'study-dm-1',
        title: 'DAZZLE ME 定妆喷雾双配方卖点与成膜实验演示',
        type: '课件',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 4,
        durationMinutes: 15,
        lastUsedDate: '2026-08-25',
        passRate: 99.1
      },
      {
        id: 'study-dm-2',
        title: '摩托车防风防汗场景针对性推销手册',
        type: '产品图文',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 2,
        durationMinutes: 10,
        lastUsedDate: '2026-08-16',
        passRate: 97.4
      }
    ],
    practiceAssets: [
      {
        id: 'pract-dm-1',
        title: '柜台微米喷雾喷洒手法与防水测试演示',
        type: '数字人',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 3,
        dialogueTurns: 4,
        avgPassRate: 91.0,
        lastUsedDate: '2026-08-26'
      },
      {
        id: 'pract-dm-2',
        title: '连带推销：任何买底妆顾客的定妆连带话术',
        type: '场景对话',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 3,
        dialogueTurns: 5,
        avgPassRate: 88.0,
        lastUsedDate: '2026-08-21'
      },
      {
        id: 'pract-dm-3',
        title: 'DAZZLE ME 锁妆金句通关练习',
        type: '金句',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 4,
        dialogueTurns: 3,
        avgPassRate: 98.2,
        lastUsedDate: '2026-08-24'
      }
    ],
    examAssets: [
      {
        id: 'exam-dm-1',
        title: 'DAZZLE ME 定妆喷雾爆款销售通关全国统一考',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 3,
        averageScore: 91,
        passingScore: 85,
        totalParticipants: 646,
        lastUsedDate: '2026-08-27'
      }
    ],
    regionalStats: [
      { region: '全国', avgExamScore: 91, completionRate: 97.5, salesVolume: 128000, salesGrowth: '+42.5%' },
      { region: 'Jakarta', avgExamScore: 94, completionRate: 99.0, salesVolume: 61000, salesGrowth: '+51.0%' },
      { region: 'Bandung', avgExamScore: 89, completionRate: 95.0, salesVolume: 29000, salesGrowth: '+33.4%' }
    ]
  },
  {
    id: 'prod-you-cushion',
    spu: 'Y.O.U Cloud Touch Glasting Glow Serum Cushion',
    sku: 'Y.O.U CLOUD TOUCH GLASTING GLOW SERUM CUSHION N402 SHELL IVORY 10G',
    name: 'Y.O.U 云感水光高遮瑕精华气垫 (Glasting Glow Cushion)',
    brand: 'YOU',
    series: 'Cloud Touch 养肤底妆系列',
    category: 'MAKEUP',
    subCategory: 'FACE',
    image: youCushionCompactImg,
    status: '在售',
    stock: 5776,
    roles: ['主推品', '激励品'],
    isFocus: true,
    description: '注入多重透明质酸与山茶花精萃的高光养肤气垫，轻轻一拍拍出韩系通透水光肌，兼顾70%高遮瑕力。',
    sellingPoints: [
      '独特镜面光泽水光妆效，告别假面厚重感',
      '水滴状定制粉扑，鼻翼眼角细腻无死角贴合',
      '添加养肤精华，空调房长效水润不拔干'
    ],
    goldenSentences: [
      '“30秒出门的补妆神仙，一拍自带补光灯般的韩系透光好皮！”',
      '“干皮混干皮天菜气垫，水光不泛油光。”'
    ],
    persona: {
      targetGroups: ['追求快速上妆的白领', '韩系水光妆爱好者', '干皮/混干皮女生'],
      skinTypes: ['干皮', '混干皮', '中性皮'],
      demands: ['快速上妆', '补水保湿', '通透水光', '高遮瑕'],
      scenarios: ['出差补妆', '约会出门', '日常通勤']
    },
    crossSelling: [
      {
        productId: 'prod-dm-spray',
        productName: 'DAZZLE ME 定妆喷雾 (Dewy Fix 水光版)',
        brand: 'DM',
        sku: 'DAZZLE ME GET A GRIP! MAKEUP SETTING SPRAY DEWY FIX 60ML',
        image: dazzleSettingSprayImg,
        role: '连带品',
        recommendReason: '水光气垫 + Dewy Fix喷雾，加固水光成膜，光泽感全天在线。',
        recommendedPitch: '“搭配这款Dewy喷雾，能牢牢锁住水光感，不仅不粘腻，反光感像刚做完水光针！”',
        associatedPracticeScene: '水光气垫连带定妆演示'
      }
    ],
    studyCount: 3,
    practiceCount: 4,
    examAvgScore: 74, // Note: Lower score (74) in Jakarta region! Ideal for AI Scenario 3 recommendation!
    studyAssets: [
      {
        id: 'study-cushion-1',
        title: 'Cloud Touch 精华气垫产品成份与干皮顾客沟通指南',
        type: '课件',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 2,
        durationMinutes: 18,
        lastUsedDate: '2026-08-15',
        passRate: 91.2
      }
    ],
    practiceAssets: [
      {
        id: 'pract-cushion-1',
        title: '气垫轻拍手法与色号试妆模拟',
        type: '数字人',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 2,
        dialogueTurns: 4,
        avgPassRate: 76.5,
        lastUsedDate: '2026-08-17'
      },
      {
        id: 'pract-cushion-2',
        title: '顾客抱怨气垫脱妆时的控油连带场景对话',
        type: '场景对话',
        author: 'Jakarta 区域培训经理 (Siti)',
        authorRole: 'Jakarta培训师',
        targetAudience: 'Jakarta BA (共128人)',
        usageCount: 2,
        dialogueTurns: 5,
        avgPassRate: 71.0,
        lastUsedDate: '2026-08-14'
      }
    ],
    examAssets: [
      {
        id: 'exam-cushion-1',
        title: '水光气垫产品知识与客诉应对技能考试',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 2,
        averageScore: 74,
        passingScore: 80,
        totalParticipants: 646,
        lastUsedDate: '2026-08-20'
      }
    ],
    regionalStats: [
      { region: '全国', avgExamScore: 74, completionRate: 78.0, salesVolume: 18200, salesGrowth: '+8.1%' },
      { region: 'Jakarta', avgExamScore: 62, completionRate: 55.0, salesVolume: 6100, salesGrowth: '-3.2%' },
      { region: 'Bandung', avgExamScore: 80, completionRate: 85.0, salesVolume: 4900, salesGrowth: '+12.4%' }
    ]
  },
  {
    id: 'prod-gf-puff',
    spu: 'GLAMFIX Professional Aircushion & Powder Puff',
    sku: 'GLAMFIX PROFESSIONAL AIRCUSHION PUFF 2PCS/BAG',
    name: 'GLAMFIX 专业高弹双面气垫粉扑 / 蜜粉扑',
    brand: 'GF',
    series: 'Pro Tools 美妆工具系列',
    category: 'TOOLS',
    subCategory: 'FACE',
    image: glamfixPowderPuffImg,
    status: '在售',
    stock: 121911,
    roles: ['连带品', '激励品'],
    isFocus: false,
    description: '采用进口Rubycell环保亲肤材质，回弹细腻不吃粉，干湿两用，打造零粉痕清透服帖底妆。',
    sellingPoints: [
      '进口亲水性材料，比普通粉扑省粉35%',
      '水滴状尖头设计，眼周与鼻翼细节死角轻松搞定',
      '两入装独立便携收纳盒，干净卫生易携带'
    ],
    goldenSentences: [
      '“好底妆三分靠粉底，七分靠粉扑，软糯服帖零粉感！”',
      '“专柜BA人手一个的上妆神器，带一个走让底妆质感翻倍。”'
    ],
    persona: {
      targetGroups: ['注重妆容精致度的女生', '频繁化妆上班族', '敏感肌需常换粉扑者'],
      skinTypes: ['所有肤质', '易卡粉斑驳肌肤'],
      demands: ['减少吃粉', '无痕服帖', '清洁卫生'],
      scenarios: ['日常上妆', '补妆急救']
    },
    crossSelling: [],
    studyCount: 1,
    practiceCount: 2,
    examAvgScore: null,
    studyAssets: [
      {
        id: 'study-gf-1',
        title: 'GLAMFIX 美妆工具专柜连带陈列与5秒破冰连带法',
        type: '课件',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        durationMinutes: 10,
        lastUsedDate: '2026-08-08',
        passRate: 98.9
      }
    ],
    practiceAssets: [
      {
        id: 'pract-gf-1',
        title: '买粉底/气垫连带粉扑的收银台10秒推介金句',
        type: '金句',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 2,
        dialogueTurns: 2,
        avgPassRate: 97.2,
        lastUsedDate: '2026-08-11'
      }
    ],
    examAssets: []
  },
  {
    id: 'prod-you-sunbrella',
    spu: 'Y.O.U SUNBRELLA Sakura-Niacinamide Sunscreen Gel SPF 50+ PA++++',
    sku: 'Y.O.U SUNBRELLA SAKURA-NIACINAMIDE SUNSCREEN GEL SPF 50+ PA++++ 40ML',
    name: 'Y.O.U 樱花烟酰胺高倍清爽防晒啫喱 (SUNBRELLA Sakura)',
    brand: 'YOU',
    series: 'SUNBRELLA 防晒光护系列',
    category: 'SKINCARE',
    subCategory: 'FACE',
    image: youSkinTintImg,
    status: '新品预热',
    stock: 87259,
    roles: ['新品', '主推品'],
    isFocus: true,
    description: 'Q4重磅防晒新品！添加日本樱花精粹与高纯烟酰胺，SPF 50+ PA++++ 高倍物化结合防护，一抹爆水不搓泥，自然粉嫩提亮。',
    sellingPoints: [
      'SPF 50+ PA++++ 全波段防护，抵御紫外线与蓝光伤害',
      '日本樱花提取物复配，一抹自然修色提亮暗黄，气色粉嫩红润',
      '无油啫喱质地，3秒化水极速吸收，不黏腻不闷闭口'
    ],
    goldenSentences: [
      '“防晒+隔离+提亮三合一，早上抹它省时10分钟，粉嫩好气色一整天！”',
      '“像涂补水精华一样的无感防晒，出汗也不会流白汤。”'
    ],
    persona: {
      targetGroups: ['户外活动者', '早八学生党', '通勤白领', '讨厌油腻防晒人群'],
      skinTypes: ['油皮', '混油皮', '敏感肌', '暗黄肌'],
      demands: ['高倍防晒', '清爽不闷痘', '自然提亮不假白', '成膜快'],
      scenarios: ['晨间护肤防晒', '户外骑行运动', '伪素颜通勤']
    },
    crossSelling: [
      {
        productId: 'prod-you-tint',
        productName: 'Y.O.U 云感 3% 烟酰胺养肤粉底液',
        brand: 'YOU',
        sku: 'Y.O.U CLOUD TOUCH 3% NIACINAMIDE BRIGHTENING SKIN TINT C203',
        image: youSkinTintImg,
        role: '主推品',
        recommendReason: '防晒打底 + 养肤粉底液，不搓泥不卡粉，双重烟酰胺提亮。',
        recommendedPitch: '“用这款樱花防晒打底，再上我们的云感粉底液，不仅完全不搓泥，粉嫩光泽度直接拉满！”',
        associatedPracticeScene: '防晒+底妆清爽组合销售'
      }
    ],
    studyCount: 1,
    practiceCount: 2,
    examAvgScore: null,
    studyAssets: [
      {
        id: 'study-sun-1',
        title: 'SUNBRELLA 樱花防晒新品技术配方与防晒全波段科普',
        type: '课件',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        durationMinutes: 20,
        lastUsedDate: '2026-08-27',
        passRate: 97.0
      }
    ],
    practiceAssets: [
      {
        id: 'pract-sun-1',
        title: '樱花防晒不粘腻吸油纸对比演示',
        type: '数字人',
        author: '总部培训师 A (林静)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        dialogueTurns: 4,
        avgPassRate: 88.0,
        lastUsedDate: '2026-08-28'
      },
      {
        id: 'pract-sun-2',
        title: '新品防晒核心3秒爆水销售金句背诵',
        type: '金句',
        author: '总部培训师 B (张强)',
        authorRole: '总部培训师',
        targetAudience: '全国BA (共646人)',
        usageCount: 1,
        dialogueTurns: 2,
        avgPassRate: 95.0,
        lastUsedDate: '2026-08-28'
      }
    ],
    examAssets: []
  },
  {
    id: 'prod-bnb-mascara',
    spu: 'barenbliss Roll To High Mascara',
    sku: 'BARENBLISS ROLL TO HIGH MASCARA 8G',
    name: 'barenbliss 卷翘定型太阳花睫毛膏 (Roll To High)',
    brand: 'BNB',
    series: 'Roll To 睫毛系列',
    category: 'MAKEUP',
    subCategory: 'EYES',
    image: bnbLipCreamImg,
    status: '在售',
    stock: 97883,
    roles: ['重点品'],
    isFocus: false,
    description: '特制微弧弹性刷头，专为亚洲人细软下垂睫毛设计，一刷卷翘不结块，强力抗晕染防苍蝇腿。',
    sellingPoints: [
      '记忆卷翘配方，一刷立挺，长达24小时不塌陷',
      '快干轻盈防油防汗配方，温水可卸不伤真睫毛',
      '极细弧形刷头，下睫毛与眼头眼尾细软毛发全捕捉'
    ],
    goldenSentences: [
      '“太阳花睫毛的秘密武器，塌睫毛星人也能秒变电眼芭比！”',
      '“一整天不晕不塌，告别熊猫眼尴尬。”'
    ],
    persona: {
      targetGroups: ['细软塌睫毛人群', '眼部易出油脱妆者', '大眼妆爱好者'],
      skinTypes: ['所有肤质', '眼皮易出油人群'],
      demands: ['长效卷翘', '根根分明', '不晕染'],
      scenarios: ['约会妆容', '日常放大双眼', '夏日出游']
    },
    crossSelling: [],
    studyCount: 2,
    practiceCount: 3,
    examAvgScore: 82,
    studyAssets: [],
    practiceAssets: [],
    examAssets: []
  }
];

export const MOCK_AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-1',
    productId: 'prod-you-tint',
    productName: 'Y.O.U 云感 3% 烟酰胺养肤粉底液 (Skin Tint)',
    productImage: youSkinTintImg,
    brand: 'YOU',
    scenarioType: '当期大单品',
    title: 'Q4 战略级大单品全员实战强化',
    reason: '本产品为本季度核心大单品与主推品，承载全品牌35%底妆销售目标。建议针对全国BA强化“3%烟酰胺养肤”核心卖点、抗暗沉客诉化解及配套定妆喷雾的连带销售演练。',
    targetRegion: '全国BA (646人)',
    urgency: '高',
    suggestedAssets: {
      studyIds: ['study-1', 'study-2'],
      practiceIds: ['pract-1', 'pract-3', 'pract-5'],
      examIds: ['exam-1']
    },
    highlightMessage: '大单品冲刺建议：建议组合「卖点课件 + 金句考核 + 连带喷雾对话」，预计可提升专柜客单价22%。'
  },
  {
    id: 'rec-2',
    productId: 'prod-you-sunbrella',
    productName: 'Y.O.U 樱花烟酰胺高倍清爽防晒啫喱 (SUNBRELLA Sakura)',
    productImage: youSkinTintImg,
    brand: 'YOU',
    scenarioType: '新品培训',
    title: 'Q4 重点防晒新品上市快速赋能',
    reason: '该产品为本月新上市品项，专柜库存充足。系统监测到仅发布过1次课件，区域BA产品卖点掌握度不足40%。建议优先完成产品认知、成份解析与3秒爆水实操对比练习。',
    targetRegion: '全国BA (646人)',
    urgency: '高',
    suggestedAssets: {
      studyIds: ['study-sun-1'],
      practiceIds: ['pract-sun-1', 'pract-sun-2'],
      examIds: []
    },
    highlightMessage: '新品加速建议：新品上市前2周是BA建立推荐信心的黄金窗口，优先完成数字人推销对话通关。'
  },
  {
    id: 'rec-3',
    productId: 'prod-you-cushion',
    productName: 'Y.O.U 云感水光高遮瑕精华气垫',
    productImage: youCushionCompactImg,
    brand: 'YOU',
    scenarioType: '区域薄弱产品',
    title: 'Jakarta 区域专项补差培训建议',
    reason: 'Jakarta 区域历史数据显示：该气垫产品上月考试平均分仅 62 分（远低于全国均分 74 分），练习完成率仅 55%，且专柜退货客诉中有42%反映“顾客嫌气垫出油脱妆”。AI识别存在明显培训薄弱环节。',
    targetRegion: 'Jakarta BA (128人)',
    urgency: '高',
    suggestedAssets: {
      studyIds: ['study-cushion-1'],
      practiceIds: ['pract-cushion-1', 'pract-cushion-2'],
      examIds: ['exam-cushion-1']
    },
    highlightMessage: '针对Jakarta湿热气候特点，建议重点培训「控油连带场景对话」与「正确轻拍手法」，帮助BA解决客诉。'
  },
  {
    id: 'rec-4',
    productId: 'prod-bnb-lip',
    productName: 'barenbliss 气场哑光不沾杯唇泥 (Aura Mood)',
    productImage: bnbLipCreamImg,
    brand: 'BNB',
    scenarioType: '销售转化提升',
    title: '强化现场试妆与转化类实战练习',
    reason: '系统监测显示：该产品基础课件学习完成率高达 92%，但专柜试色后的转化率低于预期（仅 16%）。AI识别不需要继续重复产品基础知识课件，而应强化「纸巾按压不沾杯演示」与「顾客嫌哑光拔干」的高难度场景对话。',
    targetRegion: '全国BA (646人)',
    urgency: '中',
    suggestedAssets: {
      studyIds: [],
      practiceIds: ['pract-bnb-1', 'pract-bnb-2', 'pract-bnb-3'],
      examIds: []
    },
    highlightMessage: '转化提升建议：减少理论记忆，聚焦真实柜台顾客异议化解，练习得分达到85分以上的BA专柜成单率高出3倍。'
  },
  {
    id: 'rec-5',
    productId: 'prod-dm-spray',
    productName: 'DAZZLE ME 锁妆持妆定妆喷雾 + Y.O.U 粉底液',
    productImage: dazzleSettingSprayImg,
    brand: 'DM',
    scenarioType: '连带组合销售',
    title: '「底妆 + 喷雾」爆款连带销售组合赋能',
    reason: '以 Y.O.U 粉底液为主推品，搭配 DAZZLE ME 定妆喷雾 + GLAMFIX 气垫粉扑建立连带推荐组合。历史数据显示完成连带销售练习的专柜，连带件数比（UPT）提升达 0.42 件。',
    targetRegion: '全国BA (646人)',
    urgency: '中',
    suggestedAssets: {
      studyIds: ['study-dm-1'],
      practiceIds: ['pract-5', 'pract-dm-2'],
      examIds: ['exam-dm-1']
    },
    highlightMessage: '连带闭环建议：培训师可一键发布「主推粉底 + 连带喷雾」双品组合练习，打造高客单销售。'
  }
];
