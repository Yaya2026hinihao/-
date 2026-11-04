import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { getHeroBannerStatistics } from '../../data/mockHeroProducts';

interface HeroProductBannerCardProps {
  onNavigateToHeroList: () => void;
  isId?: boolean;
}

export const HeroProductBannerCard: React.FC<HeroProductBannerCardProps> = ({
  onNavigateToHeroList,
  isId = false,
}) => {
  const stats = getHeroBannerStatistics();

  return (
    <div
      onClick={onNavigateToHeroList}
      className="group relative overflow-hidden bg-gradient-to-br from-white via-[#FAF7F2] to-[#F5EFE6] rounded-2xl border-2 border-[#E7DFD5] hover:border-[#9E4A2B] p-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#9E4A2B]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#9E4A2B]/10 transition-colors" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EADFCF]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9E4A2B] to-[#7C361E] text-white flex items-center justify-center shadow-sm shadow-[#9E4A2B]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111827] group-hover:text-[#9E4A2B] transition-colors">
              {isId ? 'Papan Produk Utama' : '大单品看板'}
            </h3>
          </div>
        </div>

        {/* Enter Action Button */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#9E4A2B] bg-white px-3.5 py-1.5 rounded-xl border border-[#D9CEBF] shadow-2xs group-hover:bg-[#9E4A2B] group-hover:text-white transition-all self-start sm:self-auto">
          <span>{isId ? 'Masuk ke Papan Produk >' : '进入大单品看板'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Three Core Metrics Cards Grid (严格契合用户要求) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* Metric 1: 大单品数量 */}
        <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-[#E8E2D8] flex items-center justify-between group-hover:border-[#E0D3C3] transition-colors">
          <div className="space-y-1">
            <div className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#9E4A2B]" />
              <span>{isId ? 'Jumlah Produk Unggulan' : '大单品数量'}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#111827] tabular-nums">
                {stats.heroProductsCount}
              </span>
              <span className="text-xs text-[#6B7280] font-medium">
                {isId ? 'produk' : '款'}
              </span>
            </div>
            <div className="text-[11px] text-[#059669] flex items-center gap-1 pt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isId ? 'Mencakup 6 Brand Utama' : '覆盖 HEBE 旗下 6 大核心品牌'}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center font-bold text-sm">
            TOP
          </div>
        </div>

        {/* Metric 2: 培训任务数 (全局去重已计入数据，UI去除去重标签) */}
        <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-[#E8E2D8] flex items-center justify-between group-hover:border-[#E0D3C3] transition-colors">
          <div className="space-y-1">
            <div className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{isId ? 'Total Tugas Pelatihan' : '培训任务数'}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#111827] tabular-nums">
                {stats.deduplicatedTaskCount}
              </span>
              <span className="text-xs text-[#6B7280] font-medium">
                {isId ? 'tugas' : '个'}
              </span>
            </div>
            <div className="text-[11px] text-[#6B7280] pt-0.5">
              {isId ? 'Tugas pembelajaran, latihan dan ujian' : '含学习、练习与考试任务'}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center font-bold text-xs">
            TASKS
          </div>
        </div>

        {/* Metric 3: 累计销量 (所有大单品实际 SELL OUT 销量汇总，明确统计周期) */}
        <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-[#E8E2D8] flex items-center justify-between group-hover:border-[#E0D3C3] transition-colors">
          <div className="space-y-1">
            <div className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
              <span>{isId ? 'Total Penjualan SELL OUT' : '累计销量 (SELL OUT)'}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#059669] tabular-nums">
                {stats.totalSellOut.toLocaleString()}
              </span>
              <span className="text-xs text-[#6B7280] font-medium">
                {isId ? 'unit' : '件'}
              </span>
            </div>
            <div className="text-[11px] text-[#6B7280] pt-0.5 truncate max-w-[220px]" title={stats.periodLabel}>
              {isId ? 'Periode: Juni - Okt 2026 (Aktual)' : `统计周期: ${stats.periodLabel}`}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#D1FAE5] text-[#059669] flex items-center justify-center font-bold text-xs">
            OUT
          </div>
        </div>
      </div>
    </div>
  );
};
