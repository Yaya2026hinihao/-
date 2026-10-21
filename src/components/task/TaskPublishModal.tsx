import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Bot,
  MessageSquare,
  Sparkles,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  Info,
  HelpCircle,
  Plus,
  Minus,
  Check,
  SendHorizontal,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Target,
  ChevronDown,
  ChevronUp,
  Package
} from 'lucide-react';
import { Product, TrainingAssetPractice, PracticeConditionSetting } from '../../types/product';
import {
  DigitalHumanCustomer,
  ScenarioScriptItem,
  ProductCombination,
} from '../../types/sparring';
import {
  getProductCategoryDimensions,
  evaluatePracticeMatch,
  UNIVERSAL_TARGET_GROUPS,
  UNIVERSAL_SCENARIOS,
  UNIVERSAL_DEMANDS,
  UNIVERSAL_CUSTOMER_CONCERNS,
  ScenarioFilterCriteria,
} from '../../utils/scenarioTraining';

export interface SpecificAssetTarget {
  id: string;
  category: 'study' | 'practice' | 'exam';
  title: string;
}

interface TaskPublishModalProps {
  products: Product[];
  selectedProduct: Product | null;
  specificAsset?: SpecificAssetTarget | null;
  isOpen: boolean;
  onClose: () => void;
  onPublishSuccess: (taskSummary: {
    productName: string;
    targetAudience: string;
    assetCount: number;
    taskTitle: string;
    taskType: '学习任务' | '练习任务' | '考试任务';
  }) => void;
  digitalHumans?: DigitalHumanCustomer[];
  scenarioScripts?: ScenarioScriptItem[];
  combinations?: ProductCombination[];
}

// 30 visible regions extracted directly from screenshot
const ALL_REGIONS = [
  '总部', 'Hinihao', 'kantor pusat',
  'ACEH', 'BALI', 'BALIKPAPAN', 'BANDUNG', 'BANJARMASIN', 'BEKASI',
  'BOGOR', 'CIREBON', 'JAKARTA', 'JAMBI', 'KARAWANG', 'LAMPUNG',
  'MAKASSAR', 'MALANG', 'DEPOK', 'MANADO', 'MEDAN', 'PADANG',
  'PALEMBANG', 'PEKANBARU', 'PONTIANAK', 'RANTAU', 'SEMARANG',
  'SURABAYA', 'TANGERANG', 'TPP', 'YOGYAKARTA'
];

export const TaskPublishModal: React.FC<TaskPublishModalProps> = ({
  products,
  selectedProduct,
  specificAsset,
  isOpen,
  onClose,
  onPublishSuccess,
  digitalHumans,
  scenarioScripts,
  combinations,
}) => {
  // Task Type Tab: 'study' (新建周期学习任务) | 'practice' (新建周期练习任务) | 'exam' (新建考试任务)
  const [taskTypeTab, setTaskTypeTab] = useState<'study' | 'practice' | 'exam'>('study');

  // Form Fields (Common Left Panel)
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [audienceStrategy, setAudienceStrategy] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('2026-09-29 02:00');
  const [endTime, setEndTime] = useState('2026-10-15 23:59');
  const [frequency, setFrequency] = useState('一次性任务');

  // Exam specific fields (Images 4 & 5)
  const [examDuration, setExamDuration] = useState(45);
  const [passingScore, setPassingScore] = useState(60);
  const [totalScore, setTotalScore] = useState(100);

  // Right Panel Filters & Tab
  const [searchResource, setSearchResource] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [practiceSubTab, setPracticeSubTab] = useState<'all' | 'digital_human' | 'script' | 'golden_sentence'>('all');

  // Selected Resources (by ID)
  const [selectedCoursewares, setSelectedCoursewares] = useState<string[]>([]);
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Current active product (支持发布时切换产品)
  const [activeProductId, setActiveProductId] = useState<string>(selectedProduct?.id || products[0]?.id || '');
  const currentProduct = products.find((p) => p.id === activeProductId) || selectedProduct || products[0];

  // 场景化训练条件筛选器状态 (Section 13)
  const [practiceFilters, setPracticeFilters] = useState<ScenarioFilterCriteria>({
    targetGroups: [],
    scenarios: [],
    demands: [],
    customerConcerns: [],
    categoryDimensions: {},
  });
  const [isPracticeFilterExpanded, setIsPracticeFilterExpanded] = useState(true);

  // 动态获取当前产品的专属维度
  const currentCategoryDims = useMemo(() => getProductCategoryDimensions(currentProduct), [currentProduct]);

  const togglePracticeFilterChip = (dim: 'targetGroups' | 'scenarios' | 'demands' | 'customerConcerns', val: string) => {
    setPracticeFilters((prev) => ({
      ...prev,
      [dim]: prev[dim].includes(val) ? prev[dim].filter((x) => x !== val) : [...prev[dim], val],
    }));
  };

  const togglePracticeCatDimChip = (dimKey: string, val: string) => {
    setPracticeFilters((prev) => {
      const current = prev.categoryDimensions[dimKey] || [];
      const updated = current.includes(val) ? current.filter((x) => x !== val) : [...current, val];
      return {
        ...prev,
        categoryDimensions: {
          ...prev.categoryDimensions,
          [dimKey]: updated,
        },
      };
    });
  };

  const clearPracticeFilters = () => {
    setPracticeFilters({
      targetGroups: [],
      scenarios: [],
      demands: [],
      customerConcerns: [],
      categoryDimensions: {},
    });
  };

  const handleApplyCurrentProductConditions = () => {
    if (!currentProduct?.persona) return;
    const pCond = currentProduct.persona;
    setPracticeFilters({
      targetGroups: [...(pCond.targetGroups || []).slice(0, 2)],
      scenarios: [...(pCond.scenarios || []).slice(0, 2)],
      demands: [...(pCond.demands || []).slice(0, 2)],
      customerConcerns: [...(pCond.customerConcerns || []).slice(0, 1)],
      categoryDimensions: { ...(pCond.categoryDimensions || {}) },
    });
  };

  const totalPracticeActiveFilters =
    practiceFilters.targetGroups.length +
    practiceFilters.scenarios.length +
    practiceFilters.demands.length +
    practiceFilters.customerConcerns.length +
    Object.values(practiceFilters.categoryDimensions).reduce((sum, arr) => sum + arr.length, 0);

  // Initialize or reset when opened
  useEffect(() => {
    if (isOpen) {
      if (selectedProduct) {
        setActiveProductId(selectedProduct.id);
      }
      if (specificAsset) {
        // Direct click from specific task: automatically select the appropriate task type and item!
        if (specificAsset.category === 'study') {
          setTaskTypeTab('study');
          setSelectedCoursewares([specificAsset.id]);
          setSelectedPractices([]);
          setSelectedExams([]);
          setTaskName(`【${currentProduct?.brand || 'HEBE'}】${specificAsset.title}`);
        } else if (specificAsset.category === 'practice') {
          setTaskTypeTab('practice');
          setSelectedCoursewares([]);
          setSelectedPractices([specificAsset.id]);
          setSelectedExams([]);
          setTaskName(`【${currentProduct?.brand || 'HEBE'}】${specificAsset.title}`);

          // Automatically switch to the matching practice sub-tab (数字人 / 金句 / 场景剧本)
          const targetPractice = currentProduct?.practiceAssets?.find((p) => p.id === specificAsset.id);
          if (targetPractice) {
            if (targetPractice.type === '数字人') {
              setPracticeSubTab('digital_human');
            } else if (targetPractice.type === '金句') {
              setPracticeSubTab('golden_sentence');
            } else {
              setPracticeSubTab('script');
            }
          }
        } else if (specificAsset.category === 'exam') {
          setTaskTypeTab('exam');
          setSelectedCoursewares([]);
          setSelectedPractices([]);
          setSelectedExams([specificAsset.id]);
          setTaskName(`【${currentProduct?.brand || 'HEBE'}】${specificAsset.title}`);
        }
      } else {
        // General publish from product: start with none selected, default to study task
        setTaskTypeTab('study');
        setSelectedCoursewares([]);
        setSelectedPractices([]);
        setSelectedExams([]);
        setTaskName(`【${currentProduct?.brand || 'HEBE'}】${currentProduct?.name || ''} 培训任务`);
      }
      setTaskDescription('');
      setSelectedRegions(['JAKARTA', 'BANDUNG', 'SURABAYA']);
    }
  }, [isOpen, specificAsset, selectedProduct, activeProductId]);

  if (!isOpen) return null;

  // Toggle visible region chip
  const handleToggleRegion = (r: string) => {
    setSelectedRegions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  // Toggle courseware selection (single selection rule: clicks select only this one or unselects)
  const handleToggleCourseware = (id: string, title: string) => {
    if (selectedCoursewares.includes(id)) {
      setSelectedCoursewares([]);
    } else {
      setSelectedCoursewares([id]);
      setTaskName(`【${currentProduct?.brand || 'HEBE'}】${title}`);
    }
  };

  // Toggle practice selection
  const handleTogglePractice = (id: string, title: string) => {
    if (selectedPractices.includes(id)) {
      setSelectedPractices([]);
    } else {
      setSelectedPractices([id]);
      setTaskName(`【${currentProduct?.brand || 'HEBE'}】${title}`);
    }
  };

  // Toggle exam selection
  const handleToggleExam = (id: string, title: string) => {
    if (selectedExams.includes(id)) {
      setSelectedExams([]);
    } else {
      setSelectedExams([id]);
      setTaskName(`【${currentProduct?.brand || 'HEBE'}】${title}`);
    }
  };

  // Courseware items combining current product assets with client's Indonesian courseware from screenshot
  const allCoursewareItems = [
    ...(currentProduct?.studyAssets || []).map((s) => ({
      id: s.id,
      title: s.title,
      desc: `Kuasai USP, formula 3% Niacinamide, dan demonstrasi aplikasi untuk ${currentProduct?.name}. Materi interaktif cocok untuk BA di counter.`,
      duration: `预计 ${s.durationMinutes} 分钟`,
      tag: 'kantor pusat',
      isAssociated: true,
    })),
    {
      id: 'cw-sys-1',
      title: 'BNB Roll To Definer Steel Mascara',
      desc: 'Kuasai USP, kandungan, dan manfaat Roll To Definer Steel Mascara! Pelajari cara aplikasi mudah untuk definisi bulu mata tajam. Materi interaktif ini cocok untuk tata rias pemula y... · 预计 11 分钟',
      duration: '预计 11 分钟',
      tag: 'kantor pusat',
      isAssociated: false,
    },
    {
      id: 'cw-sys-2',
      title: 'Y.O.U Cloud Touch Airy Blur Setting Powder',
      desc: 'Pelajari cara memaksimalkan Y.O.U Cloud Touch Airy Blur Setting Powder dengan teknologi Airy Blur dan efek Cloud Touch. Kursus interaktif ini cocok untuk pemula, fokus pada manfaa... · 预计 17 分钟',
      duration: '预计 17 分钟',
      tag: 'kantor pusat',
      isAssociated: false,
    },
    {
      id: 'cw-sys-3',
      title: 'Y.O.U Cloud Touch Airy Cover Compact Powder',
      desc: 'Sesi pembuka pelatihan produk interaktif 15 menit untuk penasihat kecantikan dan staf penjualan counter Y.O.U. Fokus pada keunggulan produk, komposisi, informasi dasar, demo aplik... · 预计 15 分钟',
      duration: '预计 15 分钟',
      tag: 'kantor pusat',
      isAssociated: false,
    },
    {
      id: 'cw-sys-4',
      title: 'Pengantar seri lavojoy Let It Glow Body Serum Gel',
      desc: 'Pelatihan interaktif ini memperkenalkan seri lavojoy Let It Glow Body Serum Gel dengan fokus pada poin penjualan dan keterampilan menjual. Penasihat Kecantikan akan mempelajari ke... · 预计 23 分钟',
      duration: '预计 23 分钟',
      tag: 'kantor pusat',
      isAssociated: false,
    },
    {
      id: 'cw-sys-5',
      title: 'Panduan Penggunaan Aplikasi SalesBoost AI',
      desc: 'Pelajari cara menggunakan aplikasi SalesBoost AI untuk latihan roleplay harian dan ujian berkala counter BA.',
      duration: '预计 8 分钟',
      tag: 'kantor pusat',
      isAssociated: false,
    },
  ];

  // Practice items combining current product assets with client's scenarios from screenshot
  const allPracticeItems = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subType: 'digital_human' | 'script' | 'golden_sentence';
      typeLabel: '数字人' | '场景对话' | '金句';
      desc: string;
      tags: string[];
      dialogueTurns: number;
      author: string;
      targetAudience: string;
      rawPractice: TrainingAssetPractice;
    }> = [];

    // 1. Current Product's Practice Assets
    (currentProduct?.practiceAssets || []).forEach((p) => {
      list.push({
        id: p.id,
        title: p.title,
        subType: p.type === '数字人' ? 'digital_human' : p.type === '金句' ? 'golden_sentence' : 'script',
        typeLabel: p.type,
        desc: `【${currentProduct.name}】实战练习：${p.title}。针对专柜BA应对顾客各种咨询场景与异议处理。`,
        tags: [currentProduct.brand, p.type, ...(p.conditions?.targetGroups || []).slice(0, 1)],
        dialogueTurns: p.dialogueTurns || (p.type === '数字人' ? 5 : p.type === '场景对话' ? 4 : 2),
        author: p.author || '总部培训师',
        targetAudience: p.targetAudience || '全国专柜BA',
        rawPractice: p,
      });
    });

    // 2. Extra system standard practice scenarios (with rich condition metadata)
    const extraSysScenarios: Array<{
      id: string;
      title: string;
      subType: 'digital_human' | 'script' | 'golden_sentence';
      typeLabel: '数字人' | '场景对话' | '金句';
      desc: string;
      tags: string[];
      dialogueTurns: number;
      author: string;
      targetAudience: string;
      conditions: PracticeConditionSetting;
    }> = [
      {
        id: 'sc-sys-1',
        title: 'Penanganan Menjual Maskara Degan Aplikator Stell atau Besi',
        subType: 'script',
        typeLabel: '场景对话',
        desc: 'Sandra adalah Wanita den... Profil Customer Nama: Sandra, Usia 22 tahun, Mahasiswi yang aktif di kampus.',
        tags: ['kantor pusat', 'SEMARANG', 'BANDUNG'],
        dialogueTurns: 4,
        author: '总部教研组',
        targetAudience: '全国专柜BA',
        conditions: {
          targetGroups: ['年轻顾客', '学生党'],
          scenarios: ['日常', '约会'],
          demands: ['持妆', '提亮'],
          customerConcerns: ['不知道怎么选择'],
          categoryDimensions: { 肤质: ['所有肤质'] },
        },
      },
      {
        id: 'sc-sys-2',
        title: 'Penanganan Pemilihan Produk Compact Powder full coverage dan hasil matte airbrush-blur',
        subType: 'script',
        typeLabel: '场景对话',
        desc: 'Rossa adalah pekerja kant... Mencari bedak padat untuk touch-up cepat di kantor tanpa kesan dempul.',
        tags: ['kantor pusat', 'JAKARTA'],
        dialogueTurns: 6,
        author: '总部教研组',
        targetAudience: '初级及进阶BA',
        conditions: {
          targetGroups: ['年轻白领', '高消费顾客'],
          scenarios: ['通勤', '日常'],
          demands: ['控油', '持妆', '遮瑕'],
          customerConcerns: ['担心卡粉', '担心脱妆'],
          categoryDimensions: { 肤质: ['油皮', '混油皮'] },
        },
      },
      {
        id: 'sc-sys-3',
        title: 'Menangani Warna kulit tidak merata & Rekomendasi Skin Tint',
        subType: 'script',
        typeLabel: '场景对话',
        desc: 'Profil Customer Nama: Lisa... Butuh coverage natural dengan kandungan skincare Niacinamide.',
        tags: ['SEMARANG', 'BANDUNG', 'SURABAYA'],
        dialogueTurns: 5,
        author: '区域培训导师',
        targetAudience: '全国专柜BA',
        conditions: {
          targetGroups: ['新手顾客', '熟龄顾客'],
          scenarios: ['日常', '通勤'],
          demands: ['自然水光', '轻薄养肤', '抗暗沉'],
          customerConcerns: ['担心厚重假面'],
          categoryDimensions: { 肤质: ['干皮', '中性皮'] },
        },
      },
      {
        id: 'sc-sys-4',
        title: 'Digital Customer AI: 顾客嫌弃控油粉底拔干卡粉',
        subType: 'digital_human',
        typeLabel: '数字人',
        desc: '数字人顾客模拟真实柜台对话，考察BA对水感成分与定妆喷雾连带话术的临场应对。',
        tags: ['AI 对练', '全国'],
        dialogueTurns: 5,
        author: 'AI 课程研发中心',
        targetAudience: '在职BA通用',
        conditions: {
          targetGroups: ['年轻顾客', '熟龄顾客'],
          scenarios: ['日常', '约会', '重要会议'],
          demands: ['控油', '保湿', '持妆'],
          customerConcerns: ['担心卡粉', '担心脱妆'],
          categoryDimensions: { 肤质: ['混油皮', '油皮'] },
        },
      },
      {
        id: 'sc-sys-5',
        title: '产品金句跟读: 12小时不脱妆与3%烟酰胺提亮金句',
        subType: 'golden_sentence',
        typeLabel: '金句',
        desc: '语音识别评测BA专柜黄金话术朗读流利度与重音把控。',
        tags: ['金句跟读', '口才训练'],
        dialogueTurns: 3,
        author: '总部教学部',
        targetAudience: '新人BA必练',
        conditions: {
          targetGroups: ['不限'],
          scenarios: ['日常', '通勤'],
          demands: ['持妆', '提亮'],
          customerConcerns: ['担心脱妆'],
          categoryDimensions: { 肤质: ['不限'] },
        },
      },
    ];

    extraSysScenarios.forEach((sc) => {
      if (!list.some((item) => item.id === sc.id)) {
        list.push({
          ...sc,
          rawPractice: {
            id: sc.id,
            title: sc.title,
            type: sc.typeLabel,
            author: sc.author,
            authorRole: '总部培训师',
            targetAudience: sc.targetAudience,
            dialogueTurns: sc.dialogueTurns,
            conditions: sc.conditions,
            usageCount: 15,
            avgPassRate: 91,
            lastUsedDate: '2026-09-28',
          },
        });
      }
    });

    // 3. Digital humans linked from sparring module
    (digitalHumans || []).forEach((dh) => {
      const isLinked = !currentProduct || dh.productId === currentProduct.id || dh.productIds?.includes(currentProduct.id);
      if (isLinked && !list.some((item) => item.id === dh.id)) {
        list.push({
          id: dh.id,
          title: dh.name,
          subType: 'digital_human',
          typeLabel: '数字人',
          desc: `【数字人顾客】${dh.name}：${dh.description}`,
          tags: [dh.category, '数字人', ...(dh.personaTags?.targetGroups || []).slice(0, 1)],
          dialogueTurns: dh.scriptOutline?.turns || 5,
          author: 'AI数字人专柜模拟',
          targetAudience: '全国专柜BA',
          rawPractice: {
            id: dh.id,
            title: dh.name,
            type: '数字人',
            author: 'AI数字人专柜模拟',
            authorRole: '总部培训师',
            targetAudience: '全国专柜BA',
            usageCount: dh.usageCount || 20,
            avgPassRate: dh.avgScore || 90,
            lastUsedDate: dh.updatedAt || '2026-10-18',
            conditions: {
              targetGroups: dh.personaTags?.targetGroups || [],
              scenarios: dh.personaTags?.scenarios || [],
              demands: dh.personaTags?.demands || [],
              customerConcerns: dh.personaTags?.customerConcerns || [],
              categoryDimensions: dh.personaTags?.categoryDimensions || {},
            },
          },
        });
      }
    });

    // 4. Scenario scripts linked from sparring module
    (scenarioScripts || []).forEach((sc) => {
      const combo = sc.linkedCombination;
      const isLinked = !currentProduct || !combo || combo.mainProductId === currentProduct.id || combo.crossSellingProductIds?.includes(currentProduct.id);
      if (isLinked && !list.some((item) => item.id === sc.id)) {
        list.push({
          id: sc.id,
          title: sc.title,
          subType: 'script',
          typeLabel: '场景对话',
          desc: `【场景剧本】${sc.title}：${sc.sceneDescription}`,
          tags: [combo ? '组合关联' : '通用场景', '剧本', ...(sc.scenarioTags?.scenarios || []).slice(0, 1)],
          dialogueTurns: sc.steps?.length || 3,
          author: combo?.combinationName || '场景剧本教研',
          targetAudience: '全国专柜BA',
          rawPractice: {
            id: sc.id,
            title: sc.title,
            type: '场景对话',
            author: combo?.combinationName || '场景剧本教研',
            authorRole: '总部培训师',
            targetAudience: '全国专柜BA',
            usageCount: sc.usageCount || 15,
            avgPassRate: 92,
            lastUsedDate: sc.updatedAt || '2026-10-16',
            conditions: {
              targetGroups: sc.scenarioTags?.targetGroups || [],
              scenarios: sc.scenarioTags?.scenarios || [],
              demands: sc.scenarioTags?.demands || [],
              categoryDimensions: sc.scenarioTags?.categoryDimensions || {},
            },
          },
        });
      }
    });

    return list;
  }, [currentProduct, digitalHumans, scenarioScripts]);

  // Exam items from current product + general exams
  const allExamItems = [
    ...(currentProduct?.examAssets || []).map((e) => ({
      id: e.id,
      title: e.title,
      desc: `考核题目包含产品成分、色号匹配及客诉应对选择题与情境判断题。及格线 ${e.passingScore} 分。`,
      passingScore: e.passingScore,
      duration: 45,
      questionsCount: 20,
    })),
    {
      id: 'exam-sys-1',
      title: 'Paket Ujian Baru (Q4 Produk Fokus & Teknik Penjualan)',
      desc: 'Ujian komprehensif kuartal 4 mencakup pemahaman produk unggulan, skenario penanganan komplain, dan teknik bundling.',
      passingScore: 60,
      duration: 45,
      questionsCount: 25,
    },
    {
      id: 'exam-sys-2',
      title: 'UJIAN PRODUK SUNBRELLA & PERLINDUNGAN UV',
      desc: 'Pengetahuan dasar spektrum UV, SPF 50+, tekstur gel water-burst, dan rekomendasi tipe kulit.',
      passingScore: 80,
      duration: 30,
      questionsCount: 15,
    },
  ];

  // Filter and evaluate match for each practice item
  const evaluatedPracticeItems = useMemo(() => {
    return allPracticeItems.map((item) => {
      const match = evaluatePracticeMatch(item.rawPractice, practiceFilters, currentProduct);
      return {
        ...item,
        match,
      };
    });
  }, [allPracticeItems, practiceFilters, currentProduct]);

  // Filtered practice items by subTab & search query & sorted by match
  const filteredPractices = useMemo(() => {
    return evaluatedPracticeItems
      .filter((item) => {
        // Sub-tab filter: 'all' | 'digital_human' | 'script' | 'golden_sentence'
        if (practiceSubTab === 'digital_human' && item.subType !== 'digital_human') return false;
        if (practiceSubTab === 'script' && item.subType !== 'script') return false;
        if (practiceSubTab === 'golden_sentence' && item.subType !== 'golden_sentence') return false;

        // Search text
        if (searchResource.trim()) {
          const q = searchResource.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.desc.toLowerCase().includes(q);
          const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.match.matchLevel === 'exact' && b.match.matchLevel !== 'exact') return -1;
        if (b.match.matchLevel === 'exact' && a.match.matchLevel !== 'exact') return 1;
        if (a.match.matchLevel === 'partial' && b.match.matchLevel === 'none') return -1;
        if (b.match.matchLevel === 'partial' && a.match.matchLevel === 'none') return 1;
        return b.match.matchScore - a.match.matchScore;
      });
  }, [evaluatedPracticeItems, practiceSubTab, searchResource]);

  const exactMatchCount = evaluatedPracticeItems.filter((i) => i.match.matchLevel === 'exact').length;
  const partialMatchCount = evaluatedPracticeItems.filter((i) => i.match.matchLevel === 'partial').length;

  const handleConfirmPublish = () => {
    let chosenCount = 0;
    let typeName: '学习任务' | '练习任务' | '考试任务' = '学习任务';

    if (taskTypeTab === 'study') {
      chosenCount = selectedCoursewares.length;
      typeName = '学习任务';
      if (chosenCount === 0) {
        alert('请在右侧至少勾选 1 门课件！');
        return;
      }
    } else if (taskTypeTab === 'practice') {
      chosenCount = selectedPractices.length;
      typeName = '练习任务';
      if (chosenCount === 0) {
        alert('请在右侧至少勾选 1 项实战练习素材！');
        return;
      }
    } else {
      chosenCount = selectedExams.length;
      typeName = '考试任务';
      if (chosenCount === 0) {
        alert('请在右侧至少选择 1 份考试试卷！');
        return;
      }
    }

    if (!taskName.trim()) {
      alert('请填写任务名称！');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onPublishSuccess({
        productName: currentProduct?.name || '指定产品',
        targetAudience: selectedRegions.length > 0 ? `已选 ${selectedRegions.length} 个区域` : '全部区域',
        assetCount: chosenCount,
        taskTitle: taskName,
        taskType: typeName,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl border border-[#E5E1D8] overflow-hidden flex flex-col h-[94vh]">
        {/* Top Header with Task Type Tabs (matching Screenshot titles: 新建周期学习任务 / 新建周期练习任务 / 考试发布) */}
        <div className="px-6 py-3.5 border-b border-[#E8E5DD] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-base font-bold text-[#1F2937]">
              {taskTypeTab === 'study' && '新建周期学习任务'}
              {taskTypeTab === 'practice' && '新建周期练习任务'}
              {taskTypeTab === 'exam' && '新建考试任务 / 试卷配置'}
            </h2>

            {/* Task Type Switcher */}
            <div className="flex items-center bg-[#F4F1EA] p-1 rounded-lg border border-[#E5E1D8] text-xs">
              <button
                type="button"
                onClick={() => setTaskTypeTab('study')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  taskTypeTab === 'study'
                    ? 'bg-white text-[#9E4A2B] font-semibold shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>学习任务 (课件)</span>
              </button>

              <button
                type="button"
                onClick={() => setTaskTypeTab('practice')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  taskTypeTab === 'practice'
                    ? 'bg-white text-[#9E4A2B] font-semibold shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>练习任务 (素材)</span>
              </button>

              <button
                type="button"
                onClick={() => setTaskTypeTab('exam')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  taskTypeTab === 'exam'
                    ? 'bg-white text-[#9E4A2B] font-semibold shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>考试任务 (试卷)</span>
              </button>
            </div>

            {currentProduct && (
              <span className="text-xs text-[#9E4A2B] bg-[#FFF7ED] px-2.5 py-1 rounded-md border border-[#FED7AA] font-medium hidden md:inline-block">
                当前关联产品: {currentProduct.name}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-Column Layout (Exact match of Screenshot 1, 2, 3) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#FAF9F7]">
          {/* ================= LEFT COLUMN: Task Configuration Form (Scrollable) ================= */}
          <div className="w-full md:w-[380px] lg:w-[420px] bg-white border-r border-[#EAE7E0] overflow-y-auto p-5 space-y-4 text-xs shrink-0 scrollbar-thin">
            {/* 0. 关联训练产品 (选择产品 -> 选择任务类型 -> 选择训练条件) */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#9E4A2B]" />
                  <span>关联训练产品 <span className="text-red-500">*</span></span>
                </span>
                {currentProduct?.brand && (
                  <span className="text-[10px] text-[#9E4A2B] bg-[#FFF7ED] px-2 py-0.5 rounded border border-[#FED7AA] font-medium">
                    {currentProduct.brand} · {currentProduct.category}
                  </span>
                )}
              </label>
              <select
                value={activeProductId}
                onChange={(e) => {
                  const pId = e.target.value;
                  setActiveProductId(pId);
                  setSelectedCoursewares([]);
                  setSelectedPractices([]);
                  setSelectedExams([]);
                  const newProd = products.find((p) => p.id === pId);
                  if (newProd) {
                    setTaskName(`【${newProd.brand}】${newProd.name} 培训任务`);
                  }
                }}
                className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B] focus:ring-1 focus:ring-[#9E4A2B] font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    【{p.brand}】{p.name} ({p.roles.join('/') || '普通品'})
                  </option>
                ))}
              </select>
            </div>

            {/* 1. 任务名称 */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
                任务名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="例如: 2023年终大促全员冲刺课"
                className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B] focus:ring-1 focus:ring-[#9E4A2B]"
              />
            </div>

            {/* 2. 任务描述 */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">任务描述</label>
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={500}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="说明任务目的、注意事项或运营备注"
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B] focus:ring-1 focus:ring-[#9E4A2B] resize-none"
                />
                <span className="absolute right-2.5 bottom-2 text-[10px] text-[#9CA3AF]">
                  {taskDescription.length} / 500
                </span>
              </div>
            </div>

            {/* 3. 人群策略 */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">人群策略</label>
              {/* Callout box from Screenshot */}
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EAE5D9] mb-2 space-y-1">
                <div className="flex items-start gap-1.5 text-[11px] text-[#6B7280]">
                  <Info className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span>还没有人群策略? 前往「人群策略」管理页新建</span>
                </div>
                <div className="pl-5">
                  <span className="text-[#9E4A2B] font-medium hover:underline cursor-pointer text-xs">
                    前往人群策略 &gt;
                  </span>
                </div>
              </div>

              <select
                value={audienceStrategy}
                onChange={(e) => setAudienceStrategy(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B]"
              >
                <option value="">请选择启用的人群策略</option>
                <option value="strat-1">全国专柜在职BA通用策略 (全量 646 人)</option>
                <option value="strat-2">新入职 BA 快速破冰与产品进阶策略 (32 人)</option>
                <option value="strat-3">核心大单品重点专柜攻坚策略 (128 人)</option>
                <option value="strat-4">季度考核均分 80 分以下定向补差策略</option>
              </select>
            </div>

            {/* 4. 下发可见区域 (30 Chips from Screenshot) */}
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#1F2937] mb-1.5">
                <span>下发可见区域</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </div>

              {/* Tag Chips Container */}
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-[#FAF9F7] rounded-lg border border-[#EAE6DD] scrollbar-thin">
                {ALL_REGIONS.map((region) => {
                  const isSelected = selectedRegions.includes(region);
                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => handleToggleRegion(region)}
                      className={`px-2 py-1 rounded text-[11px] border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#9E4A2B] text-white border-[#9E4A2B] font-medium shadow-2xs'
                          : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#9E4A2B]'
                      }`}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-[#6B7280] mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-[#9CA3AF]" />
                <span>
                  当前约束:{' '}
                  {selectedRegions.length === 0 ? (
                    <span className="text-[#9CA3AF]">未选择区域 (默认全区域)</span>
                  ) : (
                    <strong className="text-[#9E4A2B]">已选 {selectedRegions.length} 个区域</strong>
                  )}
                </span>
              </div>
            </div>

            {/* 5. 开始时间 & 结束时间 */}
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">开始时间</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">结束时间</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA]"
                  />
                </div>
              </div>
            </div>

            {/* 6. 执行频次 */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">执行频次</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B]"
              >
                <option value="一次性任务">一次性任务</option>
                <option value="每日周期任务">每日周期任务</option>
                <option value="每周周期任务">每周周期任务</option>
                <option value="每月周期任务">每月周期任务</option>
              </select>
              <div className="text-[11px] text-[#6B7280] mt-1 flex items-start gap-1">
                <Clock className="w-3 h-3 text-[#9CA3AF] shrink-0 mt-0.5" />
                <span>任务发布后只生成一期下发实例，用户在任务期限内完成一次即可。</span>
              </div>
            </div>

            {/* Exam specific configurations from Image 5 (when in Exam Tab) */}
            {taskTypeTab === 'exam' && (
              <div className="pt-2 border-t border-[#F0ECE3] space-y-3">
                <div className="font-semibold text-xs text-[#1F2937]">考试分值与分档规则</div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#6B7280] mb-1">考试时长 (分钟)</label>
                    <div className="flex items-center border border-[#D6D0C4] rounded-lg bg-white">
                      <button
                        type="button"
                        onClick={() => setExamDuration((d) => Math.max(10, d - 5))}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center font-mono font-medium">{examDuration}</span>
                      <button
                        type="button"
                        onClick={() => setExamDuration((d) => d + 5)}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#6B7280] mb-1">及格分数</label>
                    <div className="flex items-center border border-[#D6D0C4] rounded-lg bg-white">
                      <button
                        type="button"
                        onClick={() => setPassingScore((s) => Math.max(40, s - 5))}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center font-mono font-medium">{passingScore}</span>
                      <button
                        type="button"
                        onClick={() => setPassingScore((s) => Math.min(100, s + 5))}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#9E4A2B] bg-[#FFF7ED] p-2 rounded border border-[#FED7AA]">
                  角色及格分档：角色固定为 BA / RT / RM / RGM / MT / HQ，未配置的角色使用默认及格分。
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: Resource Selection Grid ================= */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#FAF9F7]">
            {/* Top Toolbar in Right Column */}
            <div className="p-4 bg-white border-b border-[#EAE7E0] space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1F2937]">
                  {taskTypeTab === 'study' && '选择课件 (按勾选顺序组合)'}
                  {taskTypeTab === 'practice' && '配置练习素材 (可选多项组合)'}
                  {taskTypeTab === 'exam' && '选择考试试卷与题目'}
                </h3>

                <div className="text-xs text-[#6B7280]">
                  {taskTypeTab === 'study' && (
                    <span>
                      已选 <strong className="text-[#9E4A2B]">{selectedCoursewares.length}</strong> 门课件
                    </span>
                  )}
                  {taskTypeTab === 'practice' && (
                    <span>
                      已选 <strong className="text-[#9E4A2B]">{selectedPractices.length}</strong> 项对练
                    </span>
                  )}
                  {taskTypeTab === 'exam' && (
                    <span>
                      已选 <strong className="text-[#9E4A2B]">{selectedExams.length}</strong> 份试卷
                    </span>
                  )}
                </div>
              </div>

              {/* Search + Language Tag Bar from Screenshot */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchResource}
                    onChange={(e) => setSearchResource(e.target.value)}
                    placeholder="搜索资源名称、描述或标签"
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA]"
                  />
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-[#FAF9F7] hover:bg-[#EAE5D9] border border-[#D6D0C4] rounded-lg text-xs font-medium text-[#374151]"
                >
                  搜索
                </button>
              </div>

              {/* Language Pill from Screenshot */}
              {languageFilter && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF8F5] text-[#9E4A2B] border border-[#FDBA74]">
                    <MessageSquare className="w-3 h-3" />
                    <span>{languageFilter}</span>
                    <button
                      type="button"
                      onClick={() => setLanguageFilter('')}
                      className="hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}

              {/* Practice Sub-Tabs from Image 3 (全部练习 / 数字人顾客 / 场景剧本 / 产品金句跟读) */}
              {taskTypeTab === 'practice' && (
                <div className="space-y-3 pt-1 border-t border-[#F0ECE3]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setPracticeSubTab('all')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        practiceSubTab === 'all'
                          ? 'bg-[#9E4A2B] text-white shadow-2xs font-semibold'
                          : 'bg-[#FAF8F5] text-[#4B5563] hover:bg-[#EFECE5]'
                      }`}
                    >
                      <span>全部练习</span>
                      <span className="bg-black/10 px-1.5 py-0.2 rounded-full text-[10px]">
                        {allPracticeItems.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPracticeSubTab('digital_human')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        practiceSubTab === 'digital_human'
                          ? 'bg-[#9E4A2B] text-white shadow-2xs font-semibold'
                          : 'bg-[#FAF8F5] text-[#4B5563] hover:bg-[#EFECE5]'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>数字人顾客</span>
                      <span className="bg-black/10 px-1.5 py-0.2 rounded-full text-[10px]">
                        {allPracticeItems.filter((i) => i.subType === 'digital_human').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPracticeSubTab('script')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        practiceSubTab === 'script'
                          ? 'bg-[#9E4A2B] text-white shadow-2xs font-semibold'
                          : 'bg-[#FAF8F5] text-[#4B5563] hover:bg-[#EFECE5]'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>场景剧本</span>
                      <span className="bg-black/10 px-1.5 py-0.2 rounded-full text-[10px]">
                        {allPracticeItems.filter((i) => i.subType === 'script').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPracticeSubTab('golden_sentence')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        practiceSubTab === 'golden_sentence'
                          ? 'bg-[#9E4A2B] text-white shadow-2xs font-semibold'
                          : 'bg-[#FAF8F5] text-[#4B5563] hover:bg-[#EFECE5]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>产品金句跟读</span>
                      <span className="bg-black/10 px-1.5 py-0.2 rounded-full text-[10px]">
                        {allPracticeItems.filter((i) => i.subType === 'golden_sentence').length}
                      </span>
                    </button>
                  </div>

                  {/* 场景化训练条件筛选器 (Section 13) */}
                  <div className="bg-[#FAF8F5] border border-[#EAE6DD] rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#9E4A2B]" />
                        <span className="font-bold text-xs text-[#1F2937]">训练条件筛选</span>
                        <span className="text-[10px] text-[#9E4A2B] bg-[#FEF5F0] px-2 py-0.5 rounded border border-[#FDBA74]">
                          人群 / 场景 / 需求 / 专属维度
                        </span>
                        {totalPracticeActiveFilters > 0 && (
                          <span className="text-[10px] bg-[#9E4A2B] text-white px-2 py-0.2 rounded-full font-bold">
                            已选 {totalPracticeActiveFilters}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleApplyCurrentProductConditions}
                          className="text-[11px] text-[#9E4A2B] hover:text-[#7C2D12] bg-white hover:bg-[#FDECE2] px-2 py-1 rounded-md border border-[#FDBA74] flex items-center gap-1 cursor-pointer shadow-2xs font-medium"
                          title="将当前产品已配条件一键填充为筛选条件"
                        >
                          <Sparkles className="w-3 h-3 text-[#EA580C]" />
                          <span>带入本品条件</span>
                        </button>

                        {totalPracticeActiveFilters > 0 && (
                          <button
                            type="button"
                            onClick={clearPracticeFilters}
                            className="text-[11px] text-[#6B7280] hover:text-[#111827] bg-white hover:bg-gray-100 px-2 py-1 rounded-md border border-[#D6D0C4] flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>清空条件</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsPracticeFilterExpanded(!isPracticeFilterExpanded)}
                          className="text-[11px] text-[#6B7280] hover:text-[#111827] px-1.5 py-1 rounded hover:bg-white cursor-pointer"
                        >
                          {isPracticeFilterExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {isPracticeFilterExpanded && (
                      <div className="space-y-2 text-[11px] pt-1">
                        {/* 1. 人群 */}
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-[#1F2937] shrink-0 w-16 pt-0.5">🎯 适用人群:</span>
                          <div className="flex flex-wrap gap-1">
                            {UNIVERSAL_TARGET_GROUPS.slice(0, 6).map((g) => {
                              const isSel = practiceFilters.targetGroups.includes(g);
                              return (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => togglePracticeFilterChip('targetGroups', g)}
                                  className={`px-2 py-0.5 rounded text-[10px] border transition-all cursor-pointer ${
                                    isSel
                                      ? 'bg-[#9E4A2B] text-white border-[#9E4A2B] font-semibold shadow-2xs'
                                      : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#9E4A2B]'
                                  }`}
                                >
                                  {g}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. 场景 */}
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-[#1F2937] shrink-0 w-16 pt-0.5">🏙️ 适用场景:</span>
                          <div className="flex flex-wrap gap-1">
                            {UNIVERSAL_SCENARIOS.slice(0, 7).map((s) => {
                              const isSel = practiceFilters.scenarios.includes(s);
                              return (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => togglePracticeFilterChip('scenarios', s)}
                                  className={`px-2 py-0.5 rounded text-[10px] border transition-all cursor-pointer ${
                                    isSel
                                      ? 'bg-[#9E4A2B] text-white border-[#9E4A2B] font-semibold shadow-2xs'
                                      : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#9E4A2B]'
                                  }`}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. 需求 */}
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-[#1F2937] shrink-0 w-16 pt-0.5">💡 顾客需求:</span>
                          <div className="flex flex-wrap gap-1">
                            {UNIVERSAL_DEMANDS.slice(0, 8).map((d) => {
                              const isSel = practiceFilters.demands.includes(d);
                              return (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => togglePracticeFilterChip('demands', d)}
                                  className={`px-2 py-0.5 rounded text-[10px] border transition-all cursor-pointer ${
                                    isSel
                                      ? 'bg-[#9E4A2B] text-white border-[#9E4A2B] font-semibold shadow-2xs'
                                      : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#9E4A2B]'
                                  }`}
                                >
                                  {d}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 4. 品类专属维度 */}
                        {currentCategoryDims.map((catDim) => (
                          <div key={catDim.key} className="flex items-start gap-2">
                            <span className="font-semibold text-[#9E4A2B] shrink-0 w-16 pt-0.5">✨ {catDim.label}:</span>
                            <div className="flex flex-wrap gap-1">
                              {catDim.options.map((opt) => {
                                const isSel = (practiceFilters.categoryDimensions[catDim.key] || []).includes(opt);
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => togglePracticeCatDimChip(catDim.key, opt)}
                                    className={`px-2 py-0.5 rounded text-[10px] border transition-all cursor-pointer ${
                                      isSel
                                        ? 'bg-[#C2410C] text-white border-[#C2410C] font-semibold shadow-2xs'
                                        : 'bg-white text-[#4B5563] border-[#D6D0C4] hover:border-[#C2410C]'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Filter status summary */}
                    <div className="pt-2 border-t border-[#EAE6DD] flex items-center justify-between text-[11px] text-[#6B7280]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-[#1F2937]">匹配结果:</span>
                        <span>共找到 <strong className="text-[#9E4A2B] font-mono">{filteredPractices.length}</strong> 门练习</span>
                        {totalPracticeActiveFilters > 0 && (
                          <>
                            <span className="text-[#D1D5DB]">·</span>
                            <span className="text-emerald-700 font-medium">高匹配: {exactMatchCount}</span>
                            <span className="text-[#D1D5DB]">·</span>
                            <span className="text-amber-700 font-medium">部分匹配: {partialMatchCount}</span>
                          </>
                        )}
                      </div>
                      <div className="text-[10px] text-[#9CA3AF]">
                        高匹配练习优先置顶展示
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cards Grid Container (2 Columns matching Screenshot 1, 2, 3) */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
              {/* TAB 1: 课件卡片网格 (Image 1 & 2) */}
              {taskTypeTab === 'study' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {allCoursewareItems.map((cw) => {
                    const isChecked = selectedCoursewares.includes(cw.id);
                    return (
                      <div
                        key={cw.id}
                        onClick={() => handleToggleCourseware(cw.id, cw.title)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3 relative shadow-2xs ${
                          isChecked
                            ? 'bg-[#FFFBF8] border-[#9E4A2B] ring-1 ring-[#9E4A2B]'
                            : 'bg-white border-[#E8E6E1] hover:border-[#D4CEBF]'
                        }`}
                      >
                        {/* Book Icon matching screenshot */}
                        <div className="w-10 h-10 rounded-lg bg-[#FAF4F0] text-[#9E4A2B] flex items-center justify-center shrink-0 border border-[#F3E6DF]">
                          <BookOpen className="w-5 h-5" />
                        </div>

                        {/* Middle Info */}
                        <div className="flex-1 pr-6 space-y-1">
                          <h4 className="font-bold text-xs text-[#111827] leading-snug line-clamp-2">
                            {cw.title}
                          </h4>
                          <p className="text-[11px] text-[#6B7280] line-clamp-3 leading-relaxed">
                            {cw.desc}
                          </p>

                          <div className="flex items-center gap-2 pt-1 text-[10px]">
                            <span className="text-[#9CA3AF]">{cw.duration}</span>
                            <span className="bg-[#FAF8F5] text-[#78716C] px-1.5 py-0.5 rounded border border-[#EAE6DD]">
                              {cw.tag}
                            </span>
                            {cw.isAssociated && (
                              <span className="bg-[#ECFDF5] text-[#059669] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                                本品关联
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Top-Right Checkbox matching screenshot */}
                        <div className="absolute top-3.5 right-3.5">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-[#9E4A2B] border-[#9E4A2B] text-white'
                                : 'border-[#C4BDAF] bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: 实战练习卡片网格 (Image 3) */}
              {taskTypeTab === 'practice' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredPractices.map((sc) => {
                    const isChecked = selectedPractices.includes(sc.id);
                    return (
                      <div
                        key={sc.id}
                        onClick={() => handleTogglePractice(sc.id, sc.title)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3 relative shadow-2xs ${
                          isChecked
                            ? 'bg-[#FFFBF8] border-[#9E4A2B] ring-1 ring-[#9E4A2B]'
                            : 'bg-white border-[#E8E6E1] hover:border-[#D4CEBF]'
                        }`}
                      >
                        {/* Speech Bubble Icon matching screenshot */}
                        <div className="w-10 h-10 rounded-lg bg-[#FAF4F0] text-[#9E4A2B] flex items-center justify-center shrink-0 border border-[#F3E6DF]">
                          {sc.subType === 'digital_human' ? (
                            <Bot className="w-5 h-5 text-[#4F46E5]" />
                          ) : sc.subType === 'golden_sentence' ? (
                            <Sparkles className="w-5 h-5 text-[#E11D48]" />
                          ) : (
                            <MessageSquare className="w-5 h-5 text-[#D97706]" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pr-6 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-xs text-[#111827] leading-snug">
                              {sc.title}
                            </h4>
                            {totalPracticeActiveFilters > 0 && (
                              <span className={`px-1.5 py-0.2 rounded text-[10px] border ${sc.match.colorClass}`}>
                                {sc.match.label}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed">
                            {sc.desc}
                          </p>

                          {/* Matched tags or condition tags */}
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {sc.match.matchLevel === 'partial' && sc.match.matchedTags.length > 0 ? (
                              <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                                命中: {sc.match.matchedTags.slice(0, 3).join('+')}
                              </span>
                            ) : null}
                            {sc.rawPractice?.conditions?.targetGroups?.slice(0, 2).map((tg, idx) => (
                              <span key={idx} className="text-[10px] bg-[#FAF8F5] text-[#78716C] px-1.5 py-0.5 rounded border border-[#EAE6DD]">
                                {tg}
                              </span>
                            ))}
                            {sc.rawPractice?.conditions?.scenarios?.slice(0, 2).map((scen, idx) => (
                              <span key={idx} className="text-[10px] bg-[#FAF8F5] text-[#78716C] px-1.5 py-0.5 rounded border border-[#EAE6DD]">
                                {scen}
                              </span>
                            ))}
                            {sc.rawPractice?.conditions?.demands?.slice(0, 1).map((dm, idx) => (
                              <span key={idx} className="text-[10px] bg-[#FAF8F5] text-[#78716C] px-1.5 py-0.5 rounded border border-[#EAE6DD]">
                                {dm}
                              </span>
                            ))}
                            <span className="text-[10px] text-gray-400 font-mono self-center">
                              {sc.dialogueTurns}轮对话
                            </span>
                          </div>
                        </div>

                        {/* Top-Right Checkbox */}
                        <div className="absolute top-3.5 right-3.5">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-[#9E4A2B] border-[#9E4A2B] text-white'
                                : 'border-[#C4BDAF] bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: 考试试卷卡片网格 (Image 4 & 5) */}
              {taskTypeTab === 'exam' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {allExamItems.map((exam) => {
                    const isChecked = selectedExams.includes(exam.id);
                    return (
                      <div
                        key={exam.id}
                        onClick={() => handleToggleExam(exam.id, exam.title)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3 relative shadow-2xs ${
                          isChecked
                            ? 'bg-[#FFFBF8] border-[#9E4A2B] ring-1 ring-[#9E4A2B]'
                            : 'bg-white border-[#E8E6E1] hover:border-[#D4CEBF]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 border border-[#A7F3D0]">
                          <GraduationCap className="w-5 h-5" />
                        </div>

                        <div className="flex-1 pr-6 space-y-1">
                          <h4 className="font-bold text-xs text-[#111827] leading-snug">
                            {exam.title}
                          </h4>
                          <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed">
                            {exam.desc}
                          </p>

                          <div className="flex items-center gap-3 pt-1 text-[11px]">
                            <span className="font-mono text-[#059669] font-medium">
                              及格线 {exam.passingScore}分
                            </span>
                            <span className="text-[#6B7280]">时长 {exam.duration}分钟</span>
                            <span className="text-[#6B7280]">{exam.questionsCount}道题</span>
                          </div>
                        </div>

                        <div className="absolute top-3.5 right-3.5">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-[#9E4A2B] border-[#9E4A2B] text-white'
                                : 'border-[#C4BDAF] bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Hint matching Screenshots */}
            <div className="px-5 py-2.5 bg-[#FAF9F7] border-t border-[#EAE7E0] text-xs text-[#6B7280] flex items-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>
                {taskTypeTab === 'study' && '选择的课件资源将作为学习内容展示给学员。'}
                {taskTypeTab === 'practice' && '提示: 选择不同的素材模块将组合成一个多维度的陪练任务。'}
                {taskTypeTab === 'exam' && '发布考试后系统将自动生成答题卡并通知目标区域考生。'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions matching Screenshot 1, 2, 3 */}
        <div className="px-6 py-3.5 bg-white border-t border-[#EAE7E0] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#6B7280]">
            分发对象: <strong className="text-[#1F2937]">{selectedRegions.length > 0 ? `已选 ${selectedRegions.length} 个区域` : '全部区域'}</strong> · 任务类型:{' '}
            <strong className="text-[#9E4A2B]">
              {taskTypeTab === 'study' ? '周期学习任务' : taskTypeTab === 'practice' ? '周期练习任务' : '考试试卷任务'}
            </strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                alert('已保存至草稿箱');
                onClose();
              }}
              className="px-4 py-2 border border-[#D6D0C4] hover:bg-[#F9F8F6] text-[#374151] rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              保存草稿
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F4F1EA] hover:bg-[#EAE5D9] text-[#374151] rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              取消
            </button>

            <button
              type="button"
              onClick={handleConfirmPublish}
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] disabled:bg-gray-400 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              <span>{isSubmitting ? '正在发布...' : '确认发布任务'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
