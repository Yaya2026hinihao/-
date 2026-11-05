import {
  InspectionCategory,
  InspectionTaskRecord,
  InspectionFilterState,
  InspectionReportResult
} from '../types/inspection';

export const INSPECTION_CATEGORIES: InspectionCategory[] = [
  {
    id: 'tasks',
    title: '任务查询',
    subtitle: '任务数量、类型、发布人、完成情况与周期对比',
    iconName: 'ClipboardList',
    badgeText: '7项查询能力',
    queryItems: [
      {
        id: 'task-total',
        title: '任务发布总量',
        description: '统计指定周期内发布的全部学习、练习、考试任务总数',
        iconName: 'ListOrdered',
        applicableFilters: ['taskType', 'hq', 'brand', 'product']
      },
      {
        id: 'task-by-creator',
        title: '按发布人统计任务数量',
        description: '统计各HQ培训师、管理员的任务发布体量与分工',
        iconName: 'UserCheck',
        applicableFilters: ['hq', 'taskType']
      },
      {
        id: 'task-by-type',
        title: '按任务类型及产品分类',
        description: '区分学习、练习、考试三大任务类型的分布及大单品关联',
        iconName: 'Layers',
        applicableFilters: ['taskType', 'product', 'brand']
      },
      {
        id: 'task-completion',
        title: '任务完成情况与核心指标',
        description: '各任务参与率、完成率、练习达标率、考试及格率与均分',
        iconName: 'CheckCircle2',
        applicableFilters: ['taskType', 'region', 'hq', 'brand']
      },
      {
        id: 'task-detail-list',
        title: '任务明细综合查询',
        description: '逐项展开任务参与人数、截止时间、完成进度与考核表现',
        iconName: 'FileText',
        applicableFilters: ['taskType', 'hq', 'brand', 'region', 'status']
      },
      {
        id: 'task-uncompleted-list',
        title: '未完成人员名单追溯',
        description: '精准筛选尚未完成或未达标的BA人员工号及门店归属',
        iconName: 'UserX',
        applicableFilters: ['taskType', 'region', 'product']
      },
      {
        id: 'task-trend-compare',
        title: '任务发布趋势及周期对比',
        description: '周度/月度任务发布节奏与完成率同比环比变动趋势',
        iconName: 'TrendingUp',
        applicableFilters: ['taskType', 'hq']
      }
    ]
  },
  {
    id: 'hq',
    title: 'HQ工作分析',
    subtitle: '各HQ任务发布、负责任务完成度、培训效果与工作对比',
    iconName: 'GraduationCap',
    badgeText: '5项查询能力',
    queryItems: [
      {
        id: 'hq-task-volume',
        title: '各HQ任务发布数量',
        description: '彩妆HQ、护肤HQ与综合支持HQ的任务发布量统计',
        iconName: 'BarChart2',
        applicableFilters: ['hq', 'taskType', 'brand']
      },
      {
        id: 'hq-completion-rate',
        title: '各HQ负责任务完成情况',
        description: '分析不同HQ发布的任务在全国及各区域的落地完成度',
        iconName: 'PieChart',
        applicableFilters: ['hq', 'region']
      },
      {
        id: 'hq-training-impact',
        title: '各HQ负责任务的培训效果',
        description: '考核考试及格率、实操达标率、平均答题用时与知识留存',
        iconName: 'Sparkles',
        applicableFilters: ['hq', 'product']
      },
      {
        id: 'hq-product-dist',
        title: '各HQ任务明细及产品分布',
        description: '追踪各HQ任务对主推大单品、新品及重点系列的覆盖情况',
        iconName: 'Package',
        applicableFilters: ['hq', 'brand', 'product']
      },
      {
        id: 'hq-benchmark',
        title: '不同HQ之间的工作表现对比',
        description: 'HQ横向对比发布效率、催办推进成效、及格达标横向矩阵',
        iconName: 'Scale',
        applicableFilters: ['hq', 'taskType']
      }
    ]
  },
  {
    id: 'region',
    title: '区域分析',
    subtitle: '区域任务完成率、BA参与率、考核排名、薄弱项与销售对比',
    iconName: 'Building2',
    badgeText: '6项查询能力',
    queryItems: [
      {
        id: 'region-task-completion',
        title: '各区域任务完成情况',
        description: 'Jakarta、Surabaya、Bandung 等各大区任务跟进进度',
        iconName: 'CheckSquare',
        applicableFilters: ['region', 'taskType', 'brand']
      },
      {
        id: 'region-ba-coverage',
        title: '各区域BA参与率、完成率、达标率',
        description: '按大区统计去重BA总人数、已参训率及练习有效达标率',
        iconName: 'Users',
        applicableFilters: ['region', 'product']
      },
      {
        id: 'region-exam-scores',
        title: '各区域考试及格率与平均分',
        description: '区域理论与专业技能考核通过率及平均分横向对比',
        iconName: 'Award',
        applicableFilters: ['region', 'product']
      },
      {
        id: 'region-ranking-matrix',
        title: '区域培训效果排名及对比',
        description: '全国大区综合培训效能 TOP / BOTTOM 综合排行与象限分布',
        iconName: 'Trophy',
        applicableFilters: ['region', 'brand']
      },
      {
        id: 'region-weak-points',
        title: '区域培训薄弱项深度分析',
        description: '诊断各区域错误率最高的课件、场景对练卡点与易错题型',
        iconName: 'AlertCircle',
        applicableFilters: ['region', 'product']
      },
      {
        id: 'region-sales-correlation',
        title: '区域培训与销售数据对比',
        description: '区域培训参与人次与 SELL OUT 实际销量联动对比分析',
        iconName: 'TrendingUp',
        applicableFilters: ['region', 'product', 'brand']
      }
    ]
  },
  {
    id: 'product',
    title: '产品培训查询',
    subtitle: '重点大单品、新品培训任务量、覆盖率、达标表现深度追踪',
    iconName: 'Package',
    badgeText: '4项查询能力',
    queryItems: [
      {
        id: 'prod-task-count',
        title: '各产品培训任务数量',
        description: '各主推大单品及新品关联的学习、练习、考试任务数统计',
        iconName: 'Layers',
        applicableFilters: ['brand', 'product', 'taskType']
      },
      {
        id: 'prod-learning-practice-exam',
        title: '各产品学习、练习、考试情况',
        description: '单品维度展开学习完成人次、对练提交量与考核通过率',
        iconName: 'BarChart3',
        applicableFilters: ['product', 'region']
      },
      {
        id: 'prod-coverage-focus',
        title: '新品及重点大单品培训覆盖情况',
        description: '去重BA覆盖率是否达标，专柜BA与重点门店覆盖饱和度',
        iconName: 'Target',
        applicableFilters: ['brand', 'region']
      },
      {
        id: 'prod-completion-exam-score',
        title: '各产品培训完成率及考试表现',
        description: '对比不同系列产品的掌握难易度、考核均分与达标效率',
        iconName: 'Award',
        applicableFilters: ['brand', 'product']
      }
    ]
  },
  {
    id: 'mgmt',
    title: '区域培训师及MT管理',
    subtitle: '各MT与区域培训师管辖BA完成度、管理效果与人员未达标名单',
    iconName: 'Briefcase',
    badgeText: '5项查询能力',
    queryItems: [
      {
        id: 'mgmt-mt-completion',
        title: '各MT负责BA的任务完成情况',
        description: '管理培训生/专柜组长所带专柜团队的完成度与催办进度',
        iconName: 'UserCheck',
        applicableFilters: ['region', 'manager', 'taskType']
      },
      {
        id: 'mgmt-trainer-performance',
        title: '各区域培训师负责BA的任务完成情况',
        description: '各线下区域培训师辖区内专柜与门店 BA 的跟进效能',
        iconName: 'GraduationCap',
        applicableFilters: ['region', 'manager']
      },
      {
        id: 'mgmt-effect-scope',
        title: '各管理人员负责范围内的培训效果',
        description: '各MT与培训师所管辖专柜的练习合格率、考试及格率',
        iconName: 'CheckCircle',
        applicableFilters: ['manager', 'product']
      },
      {
        id: 'mgmt-cross-compare',
        title: '不同MT、区域培训师之间的表现对比',
        description: '横向对比各基层管理干部带教执行力与所辖人员达成率',
        iconName: 'Sliders',
        applicableFilters: ['region', 'manager']
      },
      {
        id: 'mgmt-unpassed-names',
        title: '所管理BA的未完成、未达标名单',
        description: '导出特定MT或区域培训师名下未达标BA名单，方便一对一约谈',
        iconName: 'UserMinus',
        applicableFilters: ['manager', 'region', 'status']
      }
    ]
  },
  {
    id: 'ba',
    title: 'BA人员查询',
    subtitle: '未参与人员名单、未完成人员名单、练习未达标、考试不及格名单',
    iconName: 'Users',
    badgeText: '6项查询能力',
    queryItems: [
      {
        id: 'ba-not-started',
        title: '未参与学习人员名单',
        description: '筛选已激活但尚未打开指定课件或培训任务的BA人员',
        iconName: 'UserX',
        applicableFilters: ['region', 'brand', 'product']
      },
      {
        id: 'ba-uncompleted-task',
        title: '未完成任务人员名单',
        description: '已开始但未全部学完或未提交有效作业的人员清单',
        iconName: 'Clock',
        applicableFilters: ['region', 'taskType', 'product']
      },
      {
        id: 'ba-practice-failed',
        title: '练习未达标人员名单',
        description: 'AI场景对练提交但未达到合格分数线（如低于80分）的BA',
        iconName: 'Dumbbell',
        applicableFilters: ['region', 'product']
      },
      {
        id: 'ba-exam-absent',
        title: '未参加考试人员名单',
        description: '临近考试截止期尚未交卷或缺考的专柜BA人员名单',
        iconName: 'AlertTriangle',
        applicableFilters: ['region', 'product']
      },
      {
        id: 'ba-exam-failed',
        title: '考试不及格人员名单',
        description: '正式考核成绩未达及格线（<75分）且急需补考的BA清单',
        iconName: 'XCircle',
        applicableFilters: ['region', 'product']
      },
      {
        id: 'ba-individual-record',
        title: 'BA个人培训档案与履历',
        description: '输入工号或姓名，查询该BA全周期的学习时长、练习与考试成绩',
        iconName: 'FileBadge',
        applicableFilters: ['region', 'searchKeyword']
      }
    ]
  },
  {
    id: 'sales-analysis',
    title: '培训与销售分析',
    subtitle: '区域培训执行与销售对比、产品培训与销量联动、培训前后变化',
    iconName: 'LineChart',
    badgeText: '3项分析模型',
    queryItems: [
      {
        id: 'sales-region-correlation',
        title: '各区域培训执行情况与销售表现对比',
        description: '分析培训完成率高的大区是否在实际销量增速上显著领先',
        iconName: 'GitCompare',
        applicableFilters: ['region', 'brand']
      },
      {
        id: 'sales-product-correlation',
        title: '各产品培训情况与销售表现对比',
        description: '大单品练习提交人次、考核分值与 SELL OUT 件数关联系数',
        iconName: 'ScatterPlot',
        applicableFilters: ['product', 'region']
      },
      {
        id: 'sales-pre-post-lift',
        title: '培训前后销售变化分析 (Training Lift)',
        description: '对比关键培训发布前14天与发布后14天同店销售提升幅度',
        iconName: 'ArrowUpRight',
        applicableFilters: ['product', 'brand']
      }
    ]
  },
  {
    id: 'alerts',
    title: '异常预警查询',
    subtitle: '低完成率任务、长期未参与人员、逾期任务、薄弱区域与数据异动',
    iconName: 'AlertTriangle',
    badgeText: '6项预警机制',
    queryItems: [
      {
        id: 'alert-low-completion',
        title: '低完成率任务预警',
        description: '上线超3天但全员完成率低于40%的异常滞后任务监控',
        iconName: 'TrendingDown',
        applicableFilters: ['taskType', 'hq', 'region']
      },
      {
        id: 'alert-inactive-users',
        title: '长期未参与人员预警',
        description: '连续超过14天无任何培训活跃或打卡记录的在岗BA名单',
        iconName: 'UserMinus',
        applicableFilters: ['region', 'manager']
      },
      {
        id: 'alert-overdue-tasks',
        title: '逾期未完成任务清单',
        description: '已过截止日期但仍存在大量未交卷或未学完人员的任务归档',
        iconName: 'AlertOctagon',
        applicableFilters: ['taskType', 'region']
      },
      {
        id: 'alert-exam-failure',
        title: '考试多次不及格人员',
        description: '连续2次以上补考仍未及格的重点关注名单，提示专员辅导',
        iconName: 'XOctagon',
        applicableFilters: ['region', 'product']
      },
      {
        id: 'alert-weak-regions',
        title: '培训薄弱区域预警',
        description: '多项综合达标率持续处于全国后20%的大区或特定城市',
        iconName: 'Flag',
        applicableFilters: ['region']
      },
      {
        id: 'alert-data-fluctuation',
        title: '培训数据异常波动监控',
        description: '突发性参与人次骤降、平均分异常偏低或集中作弊作答预警',
        iconName: 'Activity',
        applicableFilters: ['region', 'taskType']
      }
    ]
  }
];

export const MOCK_HISTORICAL_INSPECTION_TASKS: InspectionTaskRecord[] = [
  {
    id: 'insp-1',
    title: '26-29号任务发布与完成进度统计',
    category: '学习 · 查询分析',
    type: '学习任务查询',
    scope: '全部授权范围 · 我创建的',
    status: 'FINISHED',
    createdAt: '10/29 11:12',
    creator: '张总监 (全国培训总负责)',
    summary: '本次任务已完成，查询结果与处理依据已保留。全网共扫描 8 项进行中任务，整体完成率 74.8%，已自动向 42 名滞后BA发送企微提醒。',
    resultMetrics: {
      totalScanned: 374,
      completionRate: 74.8,
      abnormalCount: 42
    }
  },
  {
    id: 'insp-2',
    title: '全区域培训完课与成绩达标持续监督',
    category: '培训 · 持续监督',
    type: '区域达标监督',
    scope: '全部授权范围 · 所有进行中培训任务 · 只读',
    status: 'FINISHED',
    createdAt: '10/29 10:17',
    creator: '李主管 (彩妆HQ负责人)',
    summary: '任务已结束，不再监督，已有结果和处理记录保留。Jakarta与Surabaya大区练习达标率超过85%，Bandung大区部分专柜完成率较低。',
    resultMetrics: {
      totalScanned: 400,
      completionRate: 81.2,
      abnormalCount: 28
    }
  },
  {
    id: 'insp-3',
    title: '全部授权人员每日原业务学习时长达标持续监督',
    category: '学习 · 持续监督',
    type: '日常学习时长',
    scope: '全部授权范围 · 只读',
    status: 'FINISHED',
    createdAt: '10/31 09:24',
    creator: '王培训师 (护肤HQ)',
    summary: '本次任务已完成，查询结果与处理依据已保留。日均学习时长达标率 91.5%，有效沉淀学员学习行为基线。',
    resultMetrics: {
      totalScanned: 388,
      completionRate: 91.5,
      abnormalCount: 14
    }
  },
  {
    id: 'insp-4',
    title: '数字人陪练与场景陪练完成情况持续监督',
    category: '学习 · 持续监督',
    type: '对练任务巡检',
    scope: '全部授权范围 · 只读',
    status: 'FINISHED',
    createdAt: '10/31 09:24',
    creator: '张总监 (全国培训总负责)',
    summary: '本次任务已完成，查询结果与处理依据已保留。重点考核《蜜桃唇泥快速锁色》剧本，全国练习提交总数达 724 次。',
    resultMetrics: {
      totalScanned: 360,
      completionRate: 86.4,
      abnormalCount: 19
    }
  },
  {
    id: 'insp-5',
    title: '重点大单品养肤粉底液考核及格率专项巡检',
    category: '考试 · 专项分析',
    type: '大单品专项',
    scope: '全国专柜BA · YOU品牌',
    status: 'RUNNING',
    createdAt: '11/02 14:30',
    creator: '系统自动定时任务',
    summary: '任务运行中，正在对全国 374 名已激活BA的《养肤粉底液色号推荐与防暗沉技巧》考核试卷进行实时汇总核算。',
    resultMetrics: {
      totalScanned: 374,
      completionRate: 68.2,
      abnormalCount: 35
    }
  },
  {
    id: 'insp-6',
    title: 'Surabaya大区连续2周未参与练习人员排查',
    category: '异常预警 · 人员名单',
    type: '异常名单排查',
    scope: 'Surabaya 大区',
    status: 'RUNNING',
    createdAt: '11/03 16:45',
    creator: 'Siti (Surabaya MT)',
    summary: '任务运行中，已锁定 12 位连续14天无对练提交记录的BA人员，计划于今日下发催办工单至专柜督导。',
    resultMetrics: {
      totalScanned: 88,
      completionRate: 86.3,
      abnormalCount: 12
    }
  }
];

export function generateInspectionReport(
  category: InspectionCategory,
  queryItem: any,
  filters: InspectionFilterState
): InspectionReportResult {
  const timeDesc = filters.timeRange === 'WEEK' ? '本周' : filters.timeRange === 'LAST_WEEK' ? '上周' : filters.timeRange === 'MONTH' ? '本月' : '近30天';
  const regionDesc = filters.region === 'ALL' ? '全国各区域' : `${filters.region} 大区`;
  const taskTypeDesc = filters.taskType === 'ALL' ? '全部类型任务' : filters.taskType === 'STUDY' ? '在线学习任务' : filters.taskType === 'PRACTICE' ? '对练练习任务' : '考核考试任务';
  const hqDesc = filters.hq === 'ALL' ? '全量HQ团队' : filters.hq === 'HQ_MAKEUP' ? '彩妆HQ' : filters.hq === 'HQ_SKINCARE' ? '护肤HQ' : '综合支持HQ';

  // 根据不同功能模块生成专属针对性的真实业务数据
  if (category.id === 'ba' || queryItem.id.includes('uncompleted') || queryItem.id.includes('failed') || queryItem.id.includes('not-started')) {
    return {
      queryTitle: queryItem.title,
      categoryTitle: category.title,
      generatedAt: '刚刚生成 · AI 实时核算数据',
      summaryText: `针对【${regionDesc} · ${timeDesc}】范围，AI 已完成对 374 名在册 BA 人员的穿透式巡检。当前排查到共有 38 位 BA 存在任务未完成或练习未达标情况，主要集中在 Surabaya 与 Bandung 大区的非核心商圈专柜。`,
      keyInsights: [
        '未参与率最高的模块为【AI 场景对练】：平均耗时较长，部分专柜网速较慢导致提交中断；',
        '在 38 位待跟进人员中，有 22 位仅差 1 项任务即可全部达标，属于轻度滞后，建议一键企微催办；',
        '其余 16 位超过 10 天无任何登录活跃，需所属 MT（如 Budi, Siti）线下进店面谈督办。'
      ],
      recommendations: [
        '对只差最后一项练习的 22 名 BA 发送站内【临期极速达标包】推送；',
        '针对及格率偏低的《抗暗沉养肤话术》组织当区小复训，降低答题难度阈值；',
        '将未达标名单自动抄送对应区域培训主管与门店店长。'
      ],
      kpiCards: [
        { label: '扫描排查总人数', value: '374', unit: '人', trend: '100% 覆盖', isPositive: true },
        { label: '待跟进未达标人数', value: '38', unit: '人', trend: '占比 10.1%', isPositive: false, badge: '重点催办' },
        { label: '轻度滞后 (差1项)', value: '22', unit: '人', trend: '占比 57.9%', isPositive: true },
        { label: '长期沉默人员', value: '16', unit: '人', trend: '占比 42.1%', isPositive: false, badge: '需面谈' }
      ],
      tableData: {
        columns: [
          { key: 'name', label: 'BA 姓名', align: 'left' },
          { key: 'empId', label: '工号', align: 'left' },
          { key: 'region', label: '大区', align: 'left' },
          { key: 'store', label: '专柜门店', align: 'left' },
          { key: 'mt', label: '管辖 MT', align: 'left' },
          { key: 'uncompletedTask', label: '未完成/未达标项目', align: 'left' },
          { key: 'score', label: '当前最好得分/提交', align: 'center' },
          { key: 'status', label: '巡检状态', align: 'center' }
        ],
        rows: [
          { name: 'Dewi Lestari', empId: 'BA-2026-089', region: 'Surabaya', store: 'Tunjungan Plaza 4F', mt: 'Budi Santoso', uncompletedTask: '定妆喷雾持妆对练 (未达标)', score: '68分 (不及格)', status: '需重点催办' },
          { name: 'Rini Anggraini', empId: 'BA-2026-104', region: 'Surabaya', store: 'Galaxy Mall 2F', mt: 'Budi Santoso', uncompletedTask: '养肤粉底液色号推荐 (未参与)', score: '0 次提交', status: '待开始' },
          { name: 'Ayu Kartika', empId: 'BA-2026-042', region: 'Jakarta', store: 'Central Park YOU专柜', mt: 'Siti Rahma', uncompletedTask: '唇泥薄涂厚涂考试 (差及格线)', score: '72分 (差3分及格)', status: '轻度滞后' },
          { name: 'Bambang Pratama', empId: 'BA-2026-155', region: 'Bandung', store: 'Paris Van Java 1F', mt: 'Ahmad Fauzi', uncompletedTask: '抗暗沉手法学习 (课件仅学30%)', score: '进度 30%', status: '需重点催办' },
          { name: 'Siti Nurhaliza', empId: 'BA-2026-077', region: 'Medan', store: 'Sun Plaza 2F', mt: 'Rizal Hakim', uncompletedTask: '连带销售脚本对练 (未提交)', score: '0 次提交', status: '待开始' },
          { name: 'Agus Wijaya', empId: 'BA-2026-118', region: 'Jakarta', store: 'Grand Indonesia 3F', mt: 'Siti Rahma', uncompletedTask: '气垫遮瑕实操对练 (未达标)', score: '74分 (未达标)', status: '轻度滞后' },
          { name: 'Maya Indah', empId: 'BA-2026-211', region: 'Bali & Nusra', store: 'Beachwalk Kuta 1F', mt: 'Made Surya', uncompletedTask: '防晒定妆全流程考核 (缺考)', score: '缺考', status: '需重点催办' },
          { name: 'Eka Putri', empId: 'BA-2026-063', region: 'Surabaya', store: 'Pakuwon Mall 2F', mt: 'Budi Santoso', uncompletedTask: '蜜桃唇泥锁色对练 (未提交)', score: '0 次提交', status: '待开始' }
        ]
      }
    };
  }

  if (category.id === 'hq') {
    return {
      queryTitle: queryItem.title,
      categoryTitle: category.title,
      generatedAt: '刚刚生成 · AI 实时核算数据',
      summaryText: `在【${timeDesc}】期间，3 大 HQ 培训团队共发布培训任务 18 项，覆盖大单品 6 款。彩妆HQ在任务落地效率上表现最优（完成率 86.4%）；护肤HQ在新课件发布量上领先，但 Surabaya 大区的练习提交转化偏低。`,
      keyInsights: [
        '彩妆HQ：累计发布 8 项任务，BA完成率达 86.4%，及格率 92.1%，实操对练活跃度最高；',
        '护肤HQ：累计发布 7 项任务，完成率 78.5%，主要瓶颈在于成份机理考核篇幅过长；',
        '综合支持HQ：累计发布 3 项任务，主打通识素养与服务礼仪，完成率达 94.2%。'
      ],
      recommendations: [
        '建议护肤HQ借鉴彩妆HQ的“微场景对练”模式，将长课件拆解为 3 分钟通关小练习；',
        '推广彩妆HQ制作的高频金句卡，降低各区域BA学习记忆负担。'
      ],
      kpiCards: [
        { label: 'HQ发布任务总量', value: '18', unit: '项', trend: '环比 +3项', isPositive: true },
        { label: '全HQ平均完成率', value: '84.6%', trend: '高于基线 4.6%', isPositive: true },
        { label: '全HQ考核及格率', value: '88.3%', trend: '表现优秀', isPositive: true },
        { label: '最高完成度团队', value: '彩妆HQ', trend: '86.4% 领跑', isPositive: true, badge: '表现优异' }
      ],
      tableData: {
        columns: [
          { key: 'hqName', label: 'HQ 团队名称', align: 'left' },
          { key: 'leader', label: '负责人', align: 'left' },
          { key: 'taskCount', label: '发布任务数', align: 'center' },
          { key: 'personTimes', label: '累计参与人次', align: 'center' },
          { key: 'completionRate', label: '平均完成率', align: 'center' },
          { key: 'passRate', label: '考试及格率', align: 'center' },
          { key: 'status', label: '巡检评价', align: 'center' }
        ],
        rows: [
          { hqName: '彩妆HQ (Y.O.U & DAZZLE ME)', leader: '李主管', taskCount: '8 项', personTimes: '1,420 人次', completionRate: '86.4%', passRate: '92.1%', status: '高效领跑' },
          { hqName: '护肤HQ (barenbliss & Y.O.U护肤)', leader: '王培训师', taskCount: '7 项', personTimes: '1,180 人次', completionRate: '78.5%', passRate: '84.3%', status: '需优化课件' },
          { hqName: '综合支持HQ (服务与新员工训)', leader: '陈主管', taskCount: '3 项', personTimes: '680 人次', completionRate: '94.2%', passRate: '96.5%', status: '表现稳定' }
        ]
      }
    };
  }

  if (category.id === 'region' || category.id === 'sales-analysis') {
    return {
      queryTitle: queryItem.title,
      categoryTitle: category.title,
      generatedAt: '刚刚生成 · AI 实时核算数据',
      summaryText: `在【${timeDesc}】期间，全国各区域培训参与度与实际销量 SELL OUT 呈现高度正相关（关联系数 r = 0.84）。培训完成率前两名的 Jakarta (89.2%) 与 Surabaya (84.6%)，其大单品销量环比增速分别达到 +18.4% 与 +14.2%。`,
      keyInsights: [
        'Jakarta 大区：专柜BA培训覆盖率 94.1%，练习提交人次全国第一，对底妆新品贡献明显；',
        'Surabaya 大区：考核及格率 91.0%，对练积极性高，连带销售转化率比全国均值高 2.3%；',
        'Bandung 大区：完成率 72.4% 相对滞后，分析显示晚班排班紧凑导致学习时间不足；',
        'Medan 大区：参考人数较少但成绩优异，人均对练次数达到 3.8 次。'
      ],
      recommendations: [
        '针对 Bandung 大区推行早会 5 分钟速学机制，避开晚间高峰期；',
        '向全国推广 Jakarta 的“师傅带徒弟对练结对”机制，提高弱势专柜达标率。'
      ],
      kpiCards: [
        { label: '全国大区平均完成率', value: '82.7%', trend: '月内持续走高', isPositive: true },
        { label: '培训与销量关联系数', value: '0.84', trend: '高度正相关', isPositive: true, badge: '强相关' },
        { label: '优秀领跑大区', value: 'Jakarta', trend: '完成率 89.2%', isPositive: true },
        { label: '需督导落后大区', value: 'Bandung', trend: '完成率 72.4%', isPositive: false, badge: '预警' }
      ],
      tableData: {
        columns: [
          { key: 'region', label: '所属大区', align: 'left' },
          { key: 'baCount', label: '在册BA数', align: 'center' },
          { key: 'completionRate', label: '任务完成率', align: 'center' },
          { key: 'practiceTimes', label: '人均对练次数', align: 'center' },
          { key: 'examPassRate', label: '考试及格率', align: 'center' },
          { key: 'sellOutUnits', label: '大单品销量 (SELL OUT)', align: 'center' },
          { key: 'salesGrowth', label: '销量环比增速', align: 'center' }
        ],
        rows: [
          { region: 'Jakarta', baCount: '142 人', completionRate: '89.2%', practiceTimes: '3.6 次', examPassRate: '93.5%', sellOutUnits: '1,420 件', salesGrowth: '+18.4%' },
          { region: 'Surabaya', baCount: '88 人', completionRate: '84.6%', practiceTimes: '3.2 次', examPassRate: '91.0%', sellOutUnits: '860 件', salesGrowth: '+14.2%' },
          { region: 'Bandung', baCount: '64 人', completionRate: '72.4%', practiceTimes: '2.1 次', examPassRate: '82.1%', sellOutUnits: '520 件', salesGrowth: '+5.1%' },
          { region: 'Medan', baCount: '48 人', completionRate: '81.0%', practiceTimes: '3.8 次', examPassRate: '89.4%', sellOutUnits: '440 件', salesGrowth: '+11.8%' },
          { region: 'Bali & Nusra', baCount: '32 人', completionRate: '78.0%', practiceTimes: '2.5 次', examPassRate: '85.0%', sellOutUnits: '310 件', salesGrowth: '+8.6%' }
        ]
      }
    };
  }

  // 默认通用高质量报告 (涵盖任务查询、产品培训、异常预警等)
  return {
    queryTitle: queryItem.title,
    categoryTitle: category.title,
    generatedAt: '刚刚生成 · AI 实时核算数据',
    summaryText: `在【${timeDesc} · ${regionDesc} · ${taskTypeDesc}】条件下，AI 已汇总全量指标并完成交叉校验。系统共统计到有效记录 3,280 人次，总体达标率 83.5%，未发现系统性系统崩溃，发现 3 处需人工介入的推进卡点。`,
    keyInsights: [
      '核心大单品《云感烟酰胺养肤粉底液》与《定妆喷雾》的培训覆盖率已分别达到 88.5% 和 92.1%；',
      '练习提交量在发布后第 8 至 14 天达到峰值，证明周期中段是对练冲刺的最佳窗口期；',
      '存在 4 项已过截止期但完成率低于 70% 的子任务，需统一延期或发起集中补训。'
    ],
    recommendations: [
      '对逾期未完成任务开启 48 小时补学通道，并触发系统强提醒；',
      '在即将上线的新品培训中增加 1 组前置小测，筛选免试人员以提高培训效率。'
    ],
    kpiCards: [
      { label: '涉及任务总数', value: '14', unit: '项', trend: '有效执行中', isPositive: true },
      { label: '培训参与总人次', value: '3,280', unit: '人次', trend: '同比 +15.2%', isPositive: true },
      { label: '综合任务完成率', value: '83.5%', trend: '较上期提升 3.1%', isPositive: true },
      { label: '异常预警项', value: '3', unit: '处', trend: '需要主管督办', isPositive: false, badge: '预警' }
    ],
    tableData: {
      columns: [
        { key: 'taskName', label: '培训任务名称', align: 'left' },
        { key: 'type', label: '类型', align: 'center' },
        { key: 'product', label: '关联产品', align: 'left' },
        { key: 'creator', label: '发布人/HQ', align: 'left' },
        { key: 'coverage', label: 'BA覆盖率', align: 'center' },
        { key: 'completionRate', label: '完成率 / 及格率', align: 'center' },
        { key: 'deadline', label: '截止日期', align: 'center' },
        { key: 'status', label: '状态', align: 'center' }
      ],
      rows: [
        { taskName: 'Y.O.U 养肤粉底液色号精准匹配技巧', type: '学习', product: 'Skin Tint 养肤粉底液', creator: '李主管 (彩妆HQ)', coverage: '94.2%', completionRate: '91.5%', deadline: '2026-10-31', status: '已完成' },
        { taskName: 'DAZZLE ME 定妆喷雾控油持妆场景对练', type: '练习', product: '定妆喷雾', creator: '李主管 (彩妆HQ)', coverage: '92.1%', completionRate: '86.4%', deadline: '2026-11-05', status: '进行中' },
        { taskName: '秋季换季底妆抗暗沉综合理论考核', type: '考试', product: 'Skin Tint 养肤粉底液', creator: '张总监 (全国HQ)', coverage: '88.5%', completionRate: '79.2% (及格率)', deadline: '2026-11-06', status: '进行中' },
        { taskName: '蜜桃泥光唇泥秋冬流行叠涂法实操', type: '练习', product: '蜜桃泥光唇泥', creator: '王培训师 (护肤HQ)', coverage: '85.0%', completionRate: '74.1%', deadline: '2026-10-28', status: '已逾期' },
        { taskName: 'NoutriWear+ 无瑕持妆气垫霜专柜快销话术', type: '学习', product: '无瑕持妆气垫霜', creator: '李主管 (彩妆HQ)', coverage: '82.0%', completionRate: '88.0%', deadline: '2026-11-10', status: '进行中' }
      ]
    }
  };
}
