import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Bot,
  MessageSquare,
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Globe,
  Building2,
  MapPin,
  HelpCircle,
  Radio,
  Tv,
  LayoutGrid,
  Columns,
  UserCheck,
  GraduationCap,
  Video,
  Store
} from 'lucide-react';
import { Product } from '../../types/product';
import { UserRolePerspective } from '../layout/Header';
import { HeroProductBannerCard } from '../hero/HeroProductBannerCard';

interface DashboardViewProps {
  products: Product[];
  onNavigateToProducts: () => void;
  onNavigateToAI: () => void;
  onNavigateToHeroProducts?: () => void;
  rolePerspective?: UserRolePerspective;
  onChangePerspective?: (role: UserRolePerspective) => void;
}

// 模拟业务数据口径（完全匹配用户截图：374 已激活，26 未激活 => 总数 400）
interface PersonnelStats {
  baTotal: number;
  baActivated: number;
  hostTotal: number;
  hostActivated: number;
}

const NATIONAL_DATA: PersonnelStats = {
  baTotal: 400,
  baActivated: 374,
  hostTotal: 50,
  hostActivated: 46,
};

const REGIONAL_DATA_MAP: Record<string, PersonnelStats> = {
  Jakarta: {
    baTotal: 248,
    baActivated: 218,
    hostTotal: 45,
    hostActivated: 39,
  },
  Bandung: {
    baTotal: 195,
    baActivated: 172,
    hostTotal: 32,
    hostActivated: 28,
  },
};

// 渠道与排行榜分类定义
type ChannelType = 'offline' | 'online';

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  onNavigateToProducts,
  onNavigateToAI,
  onNavigateToHeroProducts,
  rolePerspective = 'HQ',
  onChangePerspective,
}) => {
  // 语言切换：中文 (zh) 与 印尼语 (id)
  const [currentLang, setCurrentLang] = useState<'zh' | 'id'>('zh');

  // 卡片布局模式：5卡独立展示 (five_cards, 默认) 或 首卡合并展示 (combined)
  const [cardLayoutMode, setCardLayoutMode] = useState<'five_cards' | 'combined'>('five_cards');

  // 当前区域（默认 Jakarta）
  const [selectedRegion, setSelectedRegion] = useState<'Jakarta' | 'Bandung'>('Jakarta');

  // 底部排行榜：渠道切换（线下渠道 vs 线上渠道）与对应3个动态榜单索引 (0: 员工/主播, 1: 培训师/PIC LIVE, 2: 区域培训)
  const [rankingChannel, setRankingChannel] = useState<ChannelType>('offline');
  const [rankingTabIndex, setRankingTabIndex] = useState<number>(0);

  // 视角判定
  const isNational = rolePerspective === 'HQ';
  const isRGM = rolePerspective === 'REGIONAL_RGM' || rolePerspective === 'REGIONAL_JAKARTA';
  const isMT_RT = rolePerspective === 'REGIONAL_MT_RT';

  // 是否展示主播数据（全国管理者和区域RGM展示，区域MT/RT不展示主播）
  const showHostMetrics = isNational || isRGM;

  // 当前人员统计数据
  const personnel: PersonnelStats = isNational
    ? NATIONAL_DATA
    : REGIONAL_DATA_MAP[selectedRegion] || REGIONAL_DATA_MAP.Jakarta;

  const baUnactivated = personnel.baTotal - personnel.baActivated;
  const hostUnactivated = personnel.hostTotal - personnel.hostActivated;

  const isId = currentLang === 'id';

  return (
    <div className="space-y-6">
      {/* ================= PAGE TOP BAR: TITLE + TOOLS ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold text-[#9CA3AF] tracking-wider uppercase mb-0.5">
            DASHBOARD
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              {isId
                ? isNational
                  ? 'Ringkasan Pelatihan Nasional'
                  : `Data Regional (${selectedRegion})`
                : isNational
                ? '全国培训概览'
                : `区域数据 (${selectedRegion})`}
            </h1>

            {/* 区域视角下的切换城市 */}
            {!isNational && (
              <div className="flex items-center bg-white px-2 py-1 rounded-lg border border-[#E8E6E1] text-xs shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#9E4A2B] mr-1" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as any)}
                  className="bg-transparent text-[#374151] font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Jakarta">Jakarta 区域</option>
                  <option value="Bandung">Bandung 区域</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* 顶部控制栏：布局切换 + 语言切换（中/印尼语） + 角色视角切换 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 卡片排版模式切换（展示 5 张独立卡片 还是 第一张卡片合并展示） */}
          {showHostMetrics && (
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-[#E5E1D8] text-xs shadow-2xs">
              <button
                onClick={() => setCardLayoutMode('five_cards')}
                className={`px-2 py-1 rounded-md transition-all font-medium flex items-center gap-1 cursor-pointer ${
                  cardLayoutMode === 'five_cards'
                    ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
                title="5张独立卡片：BA与主播各一张，并列5卡"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>{isId ? '5 Kartu' : '分5张卡片'}</span>
              </button>
              <button
                onClick={() => setCardLayoutMode('combined')}
                className={`px-2 py-1 rounded-md transition-all font-medium flex items-center gap-1 cursor-pointer ${
                  cardLayoutMode === 'combined'
                    ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
                title="合并首卡展示：首张卡片合并BA与主播"
              >
                <Columns className="w-3 h-3" />
                <span>{isId ? 'Gabung Kartu 1' : '卡片1合并'}</span>
              </button>
            </div>
          )}

          {/* 中/印尼语语言切换器 */}
          <div className="flex items-center bg-white p-0.5 rounded-lg border border-[#E5E1D8] text-xs shadow-2xs">
            <button
              onClick={() => setCurrentLang('zh')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                currentLang === 'zh'
                  ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => setCurrentLang('id')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                currentLang === 'id'
                  ? 'bg-[#9E4A2B] text-white font-semibold shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Bahasa Indonesia
            </button>
          </div>

          {/* 角色与口径快速切换器 */}
          {onChangePerspective && (
            <div className="flex items-center bg-[#F4F2EE] p-0.5 rounded-lg border border-[#E5E1D8] text-xs">
              <button
                onClick={() => onChangePerspective('HQ')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  isNational
                    ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
                title="全国数据：展示全国BA及主播数据"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isId ? 'Nasional (HQ)' : '全国 (HQ)'}</span>
              </button>

              <button
                onClick={() => onChangePerspective('REGIONAL_RGM')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  isRGM
                    ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
                title="区域RGM：展示区域BA及主播数据"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{isId ? 'Regional RGM' : '区域 RGM'}</span>
              </button>

              <button
                onClick={() => onChangePerspective('REGIONAL_MT_RT')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  isMT_RT
                    ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
                title="区域MT/RT：只管BA不管主播，仅展示BA数据"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isId ? 'Regional MT/RT' : '区域 MT/RT'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= TOP KPI METRIC CARDS ROW ================= */}
      {cardLayoutMode === 'five_cards' || !showHostMetrics ? (
        /* ================= 方案 A：分独立卡片展示 (全国与RGM为 5 张卡片，MT/RT为 4 张卡片) ================= */
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
            showHostMetrics ? 'xl:grid-cols-5' : 'xl:grid-cols-4'
          } gap-4 items-stretch`}
        >
          {/* 卡片 1: 专柜 BA 激活卡片（左侧红色色条） */}
          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs border-l-[5px] border-[#E11D48] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-[#6B7280] leading-tight pr-1">
                {isId
                  ? isNational
                    ? 'JUMLAH BA AKTIF NASIONAL'
                    : 'JUMLAH BA AKTIF REGIONAL'
                  : isNational
                  ? '全国当前已激活BA数'
                  : '区域当前已激活BA数'}
              </span>
              <Users className="w-4 h-4 text-[#9CA3AF] shrink-0" />
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-[#111827] tabular-nums">
                  {personnel.baActivated}
                </span>
                <span className="text-xs sm:text-sm font-normal text-gray-500 font-mono">
                  ({isId ? 'Total' : '总数'} {personnel.baTotal})
                </span>
              </div>

              <div className="pt-2">
                <span className="text-xs bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded font-medium inline-block whitespace-nowrap">
                  {isId ? `(${baUnactivated} orang belum aktif)` : `(${baUnactivated} 人未激活)`}
                </span>
              </div>
            </div>
          </div>

          {/* 卡片 2: 直播主播 激活卡片 (仅在全国与区域RGM时展示，左侧橙色色条) */}
          {showHostMetrics && (
            <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs border-l-[5px] border-[#EA580C] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
                <span className="font-semibold text-xs tracking-wider uppercase text-[#6B7280] leading-tight pr-1">
                  {isId
                    ? isNational
                      ? 'JUMLAH HOST AKTIF NASIONAL'
                      : 'JUMLAH HOST AKTIF REGIONAL'
                    : isNational
                    ? '全国当前已激活主播数'
                    : '区域当前已激活主播数'}
                </span>
                <Tv className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-bold font-mono text-[#111827] tabular-nums">
                    {personnel.hostActivated}
                  </span>
                  <span className="text-xs sm:text-sm font-normal text-gray-500 font-mono">
                    ({isId ? 'Total' : '总数'} {personnel.hostTotal})
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-xs bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded font-medium inline-block whitespace-nowrap">
                    {isId ? `(${hostUnactivated} orang belum aktif)` : `(${hostUnactivated} 人未激活)`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 卡片 3: 本月参训覆盖率（左侧绿色色条） */}
          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs border-l-[5px] border-[#059669] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-[#6B7280] flex items-center gap-1 leading-tight pr-1">
                <span>{isId ? 'RASIO CAKUPAN PARTISIPASI BULAN INI' : '本月参训覆盖率'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </span>
              <BookOpen className="w-4 h-4 text-[#9CA3AF]" />
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#111827] tabular-nums">
                1.6%
              </div>
              <div className="pt-2">
                <span className="text-xs bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded font-medium inline-block whitespace-nowrap">
                  {isId ? 'MoM ↑ 0%' : '环比 ↑ 0%'}
                </span>
              </div>
            </div>
          </div>

          {/* 卡片 4: 本月总任务完成率（左侧蓝色色条） */}
          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs border-l-[5px] border-[#2563EB] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-[#6B7280] flex items-center gap-1 leading-tight pr-1">
                <span>{isId ? 'PENYELESAIAN TUGAS KESELURUHAN BULAN INI' : '本月总任务完成率'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </span>
              <Calendar className="w-4 h-4 text-[#9CA3AF]" />
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#111827] tabular-nums">
                5.08%
              </div>
              <div className="pt-2">
                <span className="text-xs bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded font-medium inline-block whitespace-nowrap">
                  {isId ? 'MoM ↑ -0.67%' : '环比 ↑ -0.67%'}
                </span>
              </div>
            </div>
          </div>

          {/* 卡片 5: 本月考试及格率（左侧紫色色条） */}
          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs border-l-[5px] border-[#7C3AED] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-[#6B7280] flex items-center gap-1 leading-tight pr-1">
                <span>{isId ? 'TINGKAT KELULUSAN UJIAN BULAN INI' : '本月考试及格率'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </span>
              <Clock className="w-4 h-4 text-[#9CA3AF]" />
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#111827] tabular-nums">
                100%
              </div>
              <div className="pt-2">
                <span className="text-xs bg-[#F5F3FF] text-[#7C3AED] px-2 py-0.5 rounded font-medium inline-block whitespace-nowrap">
                  {isId ? 'MoM ↑ 100%' : '环比 ↑ 100%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= 方案 B：首卡合并展示 (卡片1并排展示 BA 与 主播，共4张卡片) ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-stretch">
          {/* 卡片 1: 首卡并列展示 BA 与 主播 */}
          <div className="xl:col-span-5 bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs border-l-[5px] border-[#E11D48] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-3">
              <span className="font-semibold text-xs tracking-wider uppercase text-[#6B7280]">
                {isId ? 'JUMLAH BA & HOST AKTIF' : '当前已激活人员 (BA & 主播)'}
              </span>
              <Users className="w-4 h-4 text-[#9CA3AF]" />
            </div>

            <div className="grid grid-cols-2 gap-4 divide-x divide-[#F0ECE3] pt-1">
              {/* 专柜 BA */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">
                  {isId ? (isNational ? 'BA NASIONAL' : 'BA REGIONAL') : (isNational ? '专柜 BA (全国)' : '专柜 BA (区域)')}
                </div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#111827] tabular-nums">
                    {personnel.baActivated}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    ({isId ? 'Total' : '总数'} {personnel.baTotal})
                  </span>
                </div>
                <div className="pt-1.5">
                  <span className="text-xs bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded font-medium inline-block whitespace-nowrap">
                    {isId ? `(${baUnactivated} belum aktif)` : `(${baUnactivated} 人未激活)`}
                  </span>
                </div>
              </div>

              {/* 直播主播 */}
              <div className="pl-4 space-y-1">
                <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">
                  {isId ? (isNational ? 'HOST NASIONAL' : 'HOST REGIONAL') : (isNational ? '直播主播 (全国)' : '直播主播 (区域)')}
                </div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#111827] tabular-nums">
                    {personnel.hostActivated}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    ({isId ? 'Total' : '总数'} {personnel.hostTotal})
                  </span>
                </div>
                <div className="pt-1.5">
                  <span className="text-xs bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded font-medium inline-block whitespace-nowrap">
                    {isId ? `(${hostUnactivated} belum aktif)` : `(${hostUnactivated} 人未激活)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 卡片 2: 本月参训覆盖率 */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs border-l-[5px] border-[#059669] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-[#6B7280] flex items-center gap-1 leading-tight pr-1">
                <span>{isId ? 'RASIO CAKUPAN BULAN INI' : '本月参训覆盖率'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </span>
              <BookOpen className="w-4 h-4 text-[#9CA3AF]" />
            </div>
            <div className="space-y-1 pt-1">
              <div className="text-3xl font-bold font-mono text-[#111827] tabular-nums">1.6%</div>
              <div className="pt-2">
                <span className="text-xs bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded font-medium inline-block">
                  {isId ? 'MoM ↑ 0%' : '环比 ↑ 0%'}
                </span>
              </div>
            </div>
          </div>

          {/* 卡片 3: 本月总任务完成率 */}
          <div className="xl:col-span-2.5 bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs border-l-[5px] border-[#2563EB] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-[#6B7280] flex items-center gap-1 leading-tight pr-1">
                <span>{isId ? 'PENYELESAIAN TUGAS BULAN INI' : '本月总任务完成率'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </span>
              <Calendar className="w-4 h-4 text-[#9CA3AF]" />
            </div>
            <div className="space-y-1 pt-1">
              <div className="text-3xl font-bold font-mono text-[#111827] tabular-nums">5.08%</div>
              <div className="pt-2">
                <span className="text-xs bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded font-medium inline-block">
                  {isId ? 'MoM ↑ -0.67%' : '环比 ↑ -0.67%'}
                </span>
              </div>
            </div>
          </div>

          {/* 卡片 4: 本月考试及格率 */}
          <div className="xl:col-span-2.5 bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs border-l-[5px] border-[#7C3AED] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-[#6B7280] flex items-center gap-1 leading-tight pr-1">
                <span>{isId ? 'TINGKAT KELULUSAN UJIAN' : '本月考试及格率'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </span>
              <Clock className="w-4 h-4 text-[#9CA3AF]" />
            </div>
            <div className="space-y-1 pt-1">
              <div className="text-3xl font-bold font-mono text-[#111827] tabular-nums">100%</div>
              <div className="pt-2">
                <span className="text-xs bg-[#F5F3FF] text-[#7C3AED] px-2 py-0.5 rounded font-medium inline-block">
                  {isId ? 'MoM ↑ 100%' : '环比 ↑ 100%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECOND ROW: DIGITAL ASSETS + TASK MONITOR + INSIGHTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Digital Assets Hub */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9E4A2B]"></span>
              <span>
                {isId
                  ? isNational
                    ? 'Aset Digital (Ikhtisar Global)'
                    : 'Aset Digital (Ikhtisar Regional)'
                  : isNational
                  ? '数字资产大盘 (全局通览)'
                  : '数字资产大盘 (区域通览)'}
              </span>
            </h3>
            <button
              onClick={onNavigateToProducts}
              className="text-xs text-[#9E4A2B] hover:underline cursor-pointer"
            >
              {isId ? 'Lihat Produk >' : '按产品查看 >'}
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-[#FAF8F5] rounded-xl flex items-center justify-between border border-[#EFECE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937]">
                    {isId ? 'Modul Kursus Online' : '在线课件'}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {isId ? 'Total 25 modul' : '共计 25 份'}
                  </div>
                </div>
              </div>
              <span className="text-[#9E4A2B] font-medium cursor-pointer" onClick={onNavigateToProducts}>
                {isId ? 'Lihat' : '查看'}
              </span>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl flex items-center justify-between border border-[#EFECE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937]">
                    {isId ? 'Pelanggan AI Digital' : '数字人顾客'}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {isId ? 'Total 13 avatar' : '共计 13 位'}
                  </div>
                </div>
              </div>
              <span className="text-[#9E4A2B] font-medium cursor-pointer" onClick={onNavigateToProducts}>
                {isId ? 'Lihat' : '查看'}
              </span>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl flex items-center justify-between border border-[#EFECE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937]">
                    {isId ? 'Naskah Skenario' : '场景剧本'}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {isId ? 'Total 8 skenario' : '共计 8 个'}
                  </div>
                </div>
              </div>
              <span className="text-[#9E4A2B] font-medium cursor-pointer" onClick={onNavigateToProducts}>
                {isId ? 'Lihat' : '查看'}
              </span>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl flex items-center justify-between border border-[#EFECE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937]">
                    {isId ? 'Kalimat Emas Produk' : '产品金句'}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {isId ? 'Total 22 kalimat' : '共计 22 句'}
                  </div>
                </div>
              </div>
              <span className="text-[#9E4A2B] font-medium cursor-pointer" onClick={onNavigateToProducts}>
                {isId ? 'Lihat' : '查看'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Column: Live Task Monitor */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
            <h3 className="text-sm font-bold text-[#111827]">
              {isId
                ? isNational
                  ? 'Pemantauan Tugas Nasional (Berlangsung)'
                  : 'Pemantauan Tugas Regional (Berlangsung)'
                : isNational
                ? '全国任务监控 (进行中)'
                : '区域任务监控 (进行中)'}
            </h3>
            <span className="text-xs text-[#9E4A2B] cursor-pointer">
              {isId ? 'Semua Tugas >' : '查看全部任务 >'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#111827]">
                  Pengenalan Video Study Kategori Skincare
                </span>
                <span className="text-[10px] bg-[#FFF7ED] text-[#EA580C] px-1.5 py-0.5 rounded border border-[#FED7AA]">
                  {isId ? 'Regional · Tugas Video' : '区域 · 采集任务'}
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {isId ? 'Kemajuan: 186/218 orang selesai (85.3%)' : '当前周期 186/218 人已达标 (85.3%)'}
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#9E4A2B] h-full rounded-full w-[85.3%]"></div>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">
                {isId ? 'Batas waktu: Sabtu (sisa 2 hari)' : '截止日期: 周六 (剩余 2 天)'}
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#111827]">
                  Makeup Video Study Kasus Kategori
                </span>
                <span className="text-[10px] bg-[#ECFDF5] text-[#059669] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                  {isId ? 'Regional · Latihan' : '区域 · 练习任务'}
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {isId ? 'Kemajuan: 202/218 orang selesai (92.7%)' : '当前周期 202/218 人已完成 (92.7%)'}
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#059669] h-full rounded-full w-[92.7%]"></div>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">
                {isId ? 'Batas waktu: Besok' : '截止日期: 明天'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Auto Insights */}
        <div className="lg:col-span-4 bg-[#1E1F24] text-white p-5 rounded-2xl shadow-sm border border-[#2F323D] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-sm font-bold tracking-tight text-white">
                  {isId ? 'Wawasan Otomatis AI: Kelemahan Utama' : 'AI 自动洞察: 核心薄弱点'}
                </h3>
              </div>
              <span className="text-[10px] bg-[#F59E0B]/20 text-[#FBBF24] px-1.5 py-0.5 rounded border border-[#F59E0B]/30">
                {isId ? 'Mingguan' : '每周刷新'}
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mb-3">
              {isId
                ? 'Analisis otomatis berdasarkan dialog latihan & hasil ujian personel aktif terbaru'
                : '该洞察基于近期已激活人员的实战对话与考核实绩自动分析得出'}
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#282A33] rounded-xl border border-[#393C47] space-y-1">
                <div className="text-[#FBBF24] font-semibold text-xs flex items-center justify-between">
                  <span>TOP 1: Y.O.U Cushion Keluhan Kulit Berminyak</span>
                  <span className="text-[#EF4444] text-[10px]">Tingkat Kesalahan 26.3%</span>
                </div>
                <div className="text-[11px] text-[#D1D5DB] leading-relaxed">
                  💡 {isId ? 'Kesimpulan AI: Hanya 14% BA yang merekomendasikan setting spray saat menghadapi komplain berminyak.' : 'AI 结论：面对“顾客抱怨容易泛油”时，仅 14% 能正确连带定妆喷雾，建议立即发起专项对话训练。'}
                </div>
              </div>

              <div className="p-3 bg-[#282A33] rounded-xl border border-[#393C47] space-y-1">
                <div className="text-[#FBBF24] font-semibold text-xs flex items-center justify-between">
                  <span>TOP 2: barenbliss Lip Velvet Konversi Tester</span>
                  <span className="text-[#E26A3B] text-[10px]">Konversi Rendah</span>
                </div>
                <div className="text-[11px] text-[#D1D5DB] leading-relaxed">
                  💡 {isId ? 'Kesimpulan AI: Tingkat penyelesaian modul tinggi namun konversi tester hanya 16%. Disarankan memperkuat demonstrasi anti-transfer.' : 'AI 结论：课件完成率高但专柜试色转化率仅 16%，建议加强“纸巾按压不沾杯”真实演示。'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToAI}
            className="w-full py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isId ? 'Pusat Rekomendasi Pintar AI' : '进入 AI 智能推荐中心一键发任务'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= HERO PRODUCT BOARD BANNER ENTRY (大单品专项看板独立入口) ================= */}
      <HeroProductBannerCard
        onNavigateToHeroList={() => onNavigateToHeroProducts?.()}
        isId={isId}
      />

      {/* ================= BOTTOM SECTION: RANKINGS MODULE (线下渠道 vs 线上渠道双轨切换) ================= */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs space-y-4">
        {/* Top Header: Channel Selection (线下渠道 vs 线上渠道) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0ECE3] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#9E4A2B] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>

            {/* 核心双渠道切换器 */}
            <div className="flex items-center bg-[#F4F2EE] p-1 rounded-xl border border-[#E5E1D8]">
              <button
                onClick={() => setRankingChannel('offline')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rankingChannel === 'offline'
                    ? 'bg-[#9E4A2B] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-white/60'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>{isId ? 'Saluran Offline' : '线下渠道'}</span>
              </button>

              <button
                onClick={() => setRankingChannel('online')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rankingChannel === 'online'
                    ? 'bg-[#EA580C] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-white/60'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>{isId ? 'Saluran Online' : '线上渠道'}</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-[#6B7280] flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#EFECE5] self-start sm:self-auto">
            <Award className="w-3.5 h-3.5 text-[#D97706]" />
            <span>
              {rankingChannel === 'offline'
                ? isId
                  ? 'Menampilkan Kinerja BA & Tim Offline'
                  : '专柜BA与线下培训师大盘'
                : isId
                ? 'Menampilkan Kinerja Host & Tim Live'
                : '直播间主播与PIC LIVE大盘'}
            </span>
          </div>
        </div>

        {/* Dynamic 3 Sub-tabs based on channel */}
        <div className="flex flex-wrap items-center gap-2">
          {rankingChannel === 'offline' ? (
            <>
              {/* Tab 0: 全国BA排行 */}
              <button
                onClick={() => setRankingTabIndex(0)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rankingTabIndex === 0
                    ? 'bg-[#FAF8F5] text-[#9E4A2B] border border-[#D6D0C4] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 border border-transparent'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isId ? 'Peringkat BA Nasional' : '全国BA排行'}</span>
                {rankingTabIndex === 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E4A2B]"></span>
                )}
              </button>

              {/* Tab 1: 全国培训师排行 */}
              <button
                onClick={() => setRankingTabIndex(1)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rankingTabIndex === 1
                    ? 'bg-[#FAF8F5] text-[#9E4A2B] border border-[#D6D0C4] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 border border-transparent'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{isId ? 'Peringkat Trainer Nasional' : '全国培训师排行'}</span>
                {rankingTabIndex === 1 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E4A2B]"></span>
                )}
              </button>

              {/* Tab 2: 全国区域培训排行(BA) */}
              <button
                onClick={() => setRankingTabIndex(2)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rankingTabIndex === 2
                    ? 'bg-[#FAF8F5] text-[#9E4A2B] border border-[#D6D0C4] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 border border-transparent'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{isId ? 'Peringkat Pelatihan Regional (BA)' : '全国区域培训排行(BA)'}</span>
                {rankingTabIndex === 2 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E4A2B]"></span>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Tab 0: 全国主播排行 */}
              <button
                onClick={() => setRankingTabIndex(0)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rankingTabIndex === 0
                    ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 border border-transparent'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>{isId ? 'Peringkat Host Nasional' : '全国主播排行'}</span>
                {rankingTabIndex === 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]"></span>
                )}
              </button>

              {/* Tab 1: 全国PIC LIVE排行 */}
              <button
                onClick={() => setRankingTabIndex(1)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rankingTabIndex === 1
                    ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 border border-transparent'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{isId ? 'Peringkat PIC LIVE Nasional' : '全国PIC LIVE排行'}</span>
                {rankingTabIndex === 1 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]"></span>
                )}
              </button>

              {/* Tab 2: 全国区域培训排行(HOST LIVE) */}
              <button
                onClick={() => setRankingTabIndex(2)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  rankingTabIndex === 2
                    ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 border border-transparent'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{isId ? 'Peringkat Pelatihan Regional (HOST LIVE)' : '全国区域培训排行(HOST LIVE)'}</span>
                {rankingTabIndex === 2 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]"></span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Table Content Container */}
        <div className="overflow-x-auto">
          {/* ================= TABLE 1-A: 全国BA排行 ================= */}
          {rankingChannel === 'offline' && rankingTabIndex === 0 && (
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="text-[#6B7280] border-b border-[#F0ECE3] bg-[#FAF8F5]">
                <tr>
                  <th className="py-2.5 px-3">{isId ? 'Peringkat' : '排名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Nama BA' : 'BA姓名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Wilayah / Counter' : '所属区域 / 专柜门店'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Total Poin' : '总积分'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Poin Tugas' : '任务积分'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Poin Belajar' : '学习积分'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Tingkat Selesai' : '任务完成率'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Rata-rata Ujian' : '月度对练平均分'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#9E4A2B]">1</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Siti Rahayu</td>
                  <td className="py-3 px-3 text-[#6B7280]">Jakarta · Grand Indonesia Flagship</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">610</td>
                  <td className="py-3 px-3 text-right font-mono">420</td>
                  <td className="py-3 px-3 text-right font-mono">190</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">97.7%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">96 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#9E4A2B]">2</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Dewi Sartika</td>
                  <td className="py-3 px-3 text-[#6B7280]">Bandung · Paris Van Java Mall</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">585</td>
                  <td className="py-3 px-3 text-right font-mono">400</td>
                  <td className="py-3 px-3 text-right font-mono">185</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">94.2%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">92 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#9E4A2B]">3</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Budi Santoso</td>
                  <td className="py-3 px-3 text-[#6B7280]">Surabaya · Tunjungan Plaza</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">540</td>
                  <td className="py-3 px-3 text-right font-mono">380</td>
                  <td className="py-3 px-3 text-right font-mono">160</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">89.0%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">88 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-gray-500">4</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Nurul Hidayah</td>
                  <td className="py-3 px-3 text-[#6B7280]">Medan · Sun Plaza Mall</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">525</td>
                  <td className="py-3 px-3 text-right font-mono">365</td>
                  <td className="py-3 px-3 text-right font-mono">160</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">87.5%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">89 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-gray-500">5</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Rina Wijaya</td>
                  <td className="py-3 px-3 text-[#6B7280]">Semarang · Mall Paragon</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">510</td>
                  <td className="py-3 px-3 text-right font-mono">350</td>
                  <td className="py-3 px-3 text-right font-mono">160</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">86.0%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">87 分</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* ================= TABLE 1-B: 全国主播排行 ================= */}
          {rankingChannel === 'online' && rankingTabIndex === 0 && (
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="text-[#6B7280] border-b border-[#F0ECE3] bg-[#FAF8F5]">
                <tr>
                  <th className="py-2.5 px-3">{isId ? 'Peringkat' : '排名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Nama Host / Streamer' : '主播姓名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Studio Live / Platform' : '所属直播间 / 平台'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Total Poin' : '总积分'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Sesi Latihan' : '演练场次'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Kelulusan Script' : '话术通关率'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Tingkat Konversi' : '连带转化率'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Rata-rata Skor' : '对练平均得分'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#EA580C]">1</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Alina Putri</td>
                  <td className="py-3 px-3 text-[#6B7280]">TikTok Live · Y.O.U Official Studio</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">640</td>
                  <td className="py-3 px-3 text-right font-mono">42 场</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">98.5%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">28.4%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">97 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#EA580C]">2</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Jessica Tan</td>
                  <td className="py-3 px-3 text-[#6B7280]">Shopee Live · barenbliss Official Hub</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">615</td>
                  <td className="py-3 px-3 text-right font-mono">38 场</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">96.0%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">25.8%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">95 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#EA580C]">3</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Farhan Malik</td>
                  <td className="py-3 px-3 text-[#6B7280]">TikTok Live · DAZZLE ME Flagship</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">570</td>
                  <td className="py-3 px-3 text-right font-mono">35 场</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">91.5%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">22.1%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">90 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-gray-500">4</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Amanda Lee</td>
                  <td className="py-3 px-3 text-[#6B7280]">Lazada Live · lavojoy Studio Bandung</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">555</td>
                  <td className="py-3 px-3 text-right font-mono">33 场</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">90.0%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">20.5%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">89 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-gray-500">5</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Reza Pratama</td>
                  <td className="py-3 px-3 text-[#6B7280]">Tokopedia Live · Multi-Brand Surabaya</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">530</td>
                  <td className="py-3 px-3 text-right font-mono">30 场</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">88.5%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">19.2%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">87 分</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* ================= TABLE 2-A: 全国培训师排行 ================= */}
          {rankingChannel === 'offline' && rankingTabIndex === 1 && (
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="text-[#6B7280] border-b border-[#F0ECE3] bg-[#FAF8F5]">
                <tr>
                  <th className="py-2.5 px-3">{isId ? 'Peringkat' : '排名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Nama Trainer' : '培训师姓名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Jabatan / Level' : '职级职称'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Wilayah Binaan' : '负责区域'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Cakupan BA' : '辖区BA数'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Tugas Rilis' : '任务发布数'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Kelulusan Wilayah' : '辖区及格率'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Skor Pelatihan' : '综合辅导分'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#9E4A2B]">1</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">林晨 (HQ Master Trainer)</td>
                  <td className="py-3 px-3 text-[#9E4A2B] font-medium">总培训师</td>
                  <td className="py-3 px-3 text-[#6B7280]">Kantor Pusat (全国统筹)</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">2,450 人</td>
                  <td className="py-3 px-3 text-right font-mono">38 项</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">92.4%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">98 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#9E4A2B]">2</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Siti Aisyah</td>
                  <td className="py-3 px-3 text-[#6B7280]">Senior Regional Trainer (RT)</td>
                  <td className="py-3 px-3 text-[#6B7280]">Jakarta 区域</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">248 人</td>
                  <td className="py-3 px-3 text-right font-mono">26 项</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">91.8%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">95 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#9E4A2B]">3</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Ahmad Fauzi</td>
                  <td className="py-3 px-3 text-[#6B7280]">Regional Trainer (MT)</td>
                  <td className="py-3 px-3 text-[#6B7280]">Bandung 区域</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">195 人</td>
                  <td className="py-3 px-3 text-right font-mono">22 项</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">89.5%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">92 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-gray-500">4</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Melisa Chen</td>
                  <td className="py-3 px-3 text-[#6B7280]">Regional Trainer (RT)</td>
                  <td className="py-3 px-3 text-[#6B7280]">Surabaya 区域</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">180 人</td>
                  <td className="py-3 px-3 text-right font-mono">20 项</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">88.0%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">90 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-gray-500">5</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Hendra Gunawan</td>
                  <td className="py-3 px-3 text-[#6B7280]">Field Trainer (RT)</td>
                  <td className="py-3 px-3 text-[#6B7280]">Medan 区域</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">165 人</td>
                  <td className="py-3 px-3 text-right font-mono">18 项</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">86.5%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">88 分</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* ================= TABLE 2-B: 全国PIC LIVE排行 ================= */}
          {rankingChannel === 'online' && rankingTabIndex === 1 && (
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="text-[#6B7280] border-b border-[#F0ECE3] bg-[#FAF8F5]">
                <tr>
                  <th className="py-2.5 px-3">{isId ? 'Peringkat' : '排名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Nama PIC LIVE' : 'PIC LIVE 姓名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Studio / Brand Dikelola' : '负责直播间 / 矩阵'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Host Dikelola' : '管辖主播数'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Kelulusan Script' : '脚本通关率'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Aktivitas Host' : '主播月均活跃度'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Skor Operasional' : '综合运营分'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#EA580C]">1</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Kevin Tan</td>
                  <td className="py-3 px-3 text-[#6B7280]">TikTok 官方美妆直播矩阵 (Jakarta)</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">22 人</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">97.2%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">96.5%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">98 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#EA580C]">2</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Putri Lestari</td>
                  <td className="py-3 px-3 text-[#6B7280]">Shopee 官方旗舰店直播间 (Jakarta)</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">16 人</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">95.0%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">93.8%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">94 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#EA580C]">3</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Rendy Saputra</td>
                  <td className="py-3 px-3 text-[#6B7280]">综合电商直播中心 (Bandung Hub)</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">12 人</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">91.5%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">89.0%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">91 分</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* ================= TABLE 3-A: 全国区域培训排行(BA) ================= */}
          {rankingChannel === 'offline' && rankingTabIndex === 2 && (
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="text-[#6B7280] border-b border-[#F0ECE3] bg-[#FAF8F5]">
                <tr>
                  <th className="py-2.5 px-3">{isId ? 'Peringkat' : '排名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Wilayah Regional' : '区域名称'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Total BA / Aktif' : 'BA总数 / 已激活数'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Studi Modul' : '课件学习总次数'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Penyelesaian Tugas' : '平均任务完成率'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Kelulusan Ujian' : '考试及格率'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Skor Wilayah' : '区域综合分'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#9E4A2B]">1</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Jakarta 区域</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">248 / 218 <span className="text-[10px] text-emerald-600 font-normal">(87.9%)</span></td>
                  <td className="py-3 px-3 text-right font-mono">318 次</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">88.6%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">91.8%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">95 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#9E4A2B]">2</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Bandung 区域</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">195 / 172 <span className="text-[10px] text-emerald-600 font-normal">(88.2%)</span></td>
                  <td className="py-3 px-3 text-right font-mono">245 次</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">86.4%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">89.5%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">92 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#9E4A2B]">3</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Surabaya 区域</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">180 / 156 <span className="text-[10px] text-emerald-600 font-normal">(86.7%)</span></td>
                  <td className="py-3 px-3 text-right font-mono">210 次</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">84.2%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">88.0%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">89 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-gray-500">4</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Medan 区域</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">165 / 142 <span className="text-[10px] text-emerald-600 font-normal">(86.1%)</span></td>
                  <td className="py-3 px-3 text-right font-mono">190 次</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">82.5%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">86.5%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">87 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-gray-500">5</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Semarang 区域</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">140 / 120 <span className="text-[10px] text-emerald-600 font-normal">(85.7%)</span></td>
                  <td className="py-3 px-3 text-right font-mono">165 次</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">81.0%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">85.0%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">85 分</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* ================= TABLE 3-B: 全国区域培训排行(HOST LIVE) ================= */}
          {rankingChannel === 'online' && rankingTabIndex === 2 && (
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="text-[#6B7280] border-b border-[#F0ECE3] bg-[#FAF8F5]">
                <tr>
                  <th className="py-2.5 px-3">{isId ? 'Peringkat' : '排名'}</th>
                  <th className="py-2.5 px-3">{isId ? 'Wilayah Studio Live' : '直播区域'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Total Host / Aktif' : '主播总数 / 已激活数'}</th>
                  <th className="py-2.5 px-3 text-right">{isId ? 'Sesi Latihan Script' : '脚本演练总次数'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Kelulusan Script' : '话术通关率'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Pelaksanaan Tugas' : '场均任务履约率'}</th>
                  <th className="py-2.5 px-3 text-center">{isId ? 'Skor Siaran Live' : '直播业务综合分'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#EA580C]">1</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Jakarta 直播区 (Studio Matrix)</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">45 / 39 <span className="text-[10px] text-emerald-600 font-normal">(86.7%)</span></td>
                  <td className="py-3 px-3 text-right font-mono">182 次</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">96.5%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">94.0%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">97 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#EA580C]">2</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Bandung 直播区 (Creator Center)</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">32 / 28 <span className="text-[10px] text-emerald-600 font-normal">(87.5%)</span></td>
                  <td className="py-3 px-3 text-right font-mono">120 次</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">92.0%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">90.5%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">92 分</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3 px-3 font-bold text-[#EA580C]">3</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">Surabaya 直播区 (Regional Hub)</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">20 / 17 <span className="text-[10px] text-emerald-600 font-normal">(85.0%)</span></td>
                  <td className="py-3 px-3 text-right font-mono">85 次</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">89.5%</td>
                  <td className="py-3 px-3 text-center font-mono text-[#059669]">88.0%</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">89 分</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
