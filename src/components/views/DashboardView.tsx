import React from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Product } from '../../types/product';

interface DashboardViewProps {
  products: Product[];
  onNavigateToProducts: () => void;
  onNavigateToAI: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  onNavigateToProducts,
  onNavigateToAI,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <div className="text-[11px] font-semibold text-[#9CA3AF] tracking-wider uppercase mb-1">
          DASHBOARD
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">全国培训概览</h1>
          <div className="text-xs text-[#6B7280]">数据更新至 2026-08-28 23:59:59 (实时同步)</div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards from Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280] text-xs mb-3">
            <span>全国当前已激活 BA 数</span>
            <Users className="w-4 h-4 text-[#9CA3AF]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#111827] tabular-nums">771 人</div>
          <div className="text-[11px] text-[#059669] mt-2 flex items-center gap-1 font-medium">
            <span>较上月 +14.2%</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280] text-xs mb-3">
            <span>本月课件学习总次数</span>
            <BookOpen className="w-4 h-4 text-[#9CA3AF]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#111827] tabular-nums">1,248 次</div>
          <div className="text-[11px] text-[#9E4A2B] mt-2 flex items-center gap-1 font-medium">
            <span>产品关联课件占比 82%</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280] text-xs mb-3">
            <span>本月平均任务完成率</span>
            <Calendar className="w-4 h-4 text-[#9CA3AF]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#111827] tabular-nums">91.4%</div>
          <div className="text-[11px] text-[#059669] mt-2 flex items-center gap-1 font-medium">
            <span>环比 ↑ 6.8%</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280] text-xs mb-3">
            <span>本月全国练习总次数</span>
            <Clock className="w-4 h-4 text-[#9CA3AF]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#111827] tabular-nums">2,845 次</div>
          <div className="text-[11px] text-[#6B7280] mt-2 font-mono">累计约 243 小时</div>
        </div>
      </div>

      {/* Middle Row: Digital Assets + Task Monitor + AI Auto Insights from Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Digital Assets Hub (Section 4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9E4A2B]"></span>
              <span>数字资产大盘 (全局通览)</span>
            </h3>
            <button
              onClick={onNavigateToProducts}
              className="text-xs text-[#9E4A2B] hover:underline cursor-pointer"
            >
              按产品归类查看 →
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-[#FAF8F5] rounded-xl flex items-center justify-between border border-[#EFECE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937]">在线课件</div>
                  <div className="text-[11px] text-[#6B7280]">共计 25 份</div>
                </div>
              </div>
              <span className="text-[#9E4A2B] font-medium cursor-pointer" onClick={onNavigateToProducts}>查看</span>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl flex items-center justify-between border border-[#EFECE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937]">数字人顾客</div>
                  <div className="text-[11px] text-[#6B7280]">共计 13 位</div>
                </div>
              </div>
              <span className="text-[#9E4A2B] font-medium cursor-pointer" onClick={onNavigateToProducts}>查看</span>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl flex items-center justify-between border border-[#EFECE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937]">场景剧本</div>
                  <div className="text-[11px] text-[#6B7280]">共计 8 个</div>
                </div>
              </div>
              <span className="text-[#9E4A2B] font-medium cursor-pointer" onClick={onNavigateToProducts}>查看</span>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl flex items-center justify-between border border-[#EFECE5]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937]">产品金句</div>
                  <div className="text-[11px] text-[#6B7280]">共计 22 句</div>
                </div>
              </div>
              <span className="text-[#9E4A2B] font-medium cursor-pointer" onClick={onNavigateToProducts}>查看</span>
            </div>
          </div>
        </div>

        {/* Center Column: Live Task Monitor (Section 4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE3]">
            <h3 className="text-sm font-bold text-[#111827]">全国任务监控 (进行中)</h3>
            <span className="text-xs text-[#9E4A2B] cursor-pointer">查看全部任务 &gt;</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#111827]">Tugas Cloud Touch 粉底液实战</span>
                <span className="text-[10px] bg-[#FFF7ED] text-[#EA580C] px-1.5 py-0.5 rounded border border-[#FED7AA]">
                  练习任务
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280]">当前周期 542/646 人已达标 (83.9%)</div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#9E4A2B] h-full rounded-full w-[83.9%]"></div>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">截止时间: 剩余 3 天</div>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#111827]">DAZZLE ME 定妆喷雾爆款通关</span>
                <span className="text-[10px] bg-[#ECFDF5] text-[#059669] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                  学习任务
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280]">当前周期 618/646 人已完成 (95.6%)</div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#059669] h-full rounded-full w-[95.6%]"></div>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">截止时间: 剩余 1 天</div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Auto Insights Card from Image 1 */}
        <div className="lg:col-span-4 bg-[#1E1F24] text-white p-5 rounded-2xl shadow-sm border border-[#2F323D] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-sm font-bold tracking-tight text-white">
                  AI 自动洞察: 全国核心薄弱点
                </h3>
              </div>
              <span className="text-[10px] bg-[#F59E0B]/20 text-[#FBBF24] px-1.5 py-0.5 rounded border border-[#F59E0B]/30">
                每周刷新
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mb-3">
              该洞察基于近期646名BA的练习对话与考核实绩自动分析得出
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#282A33] rounded-xl border border-[#393C47] space-y-1">
                <div className="text-[#FBBF24] font-semibold text-xs flex items-center justify-between">
                  <span>TOP 1: Y.O.U 水光气垫客诉化解</span>
                  <span className="text-[#EF4444] text-[10px]">及格率仅 55%</span>
                </div>
                <div className="text-[11px] text-[#D1D5DB] leading-relaxed">
                  💡 AI 结论：Jakarta 区域BA面对“顾客抱怨容易泛油”时，仅 14% 能正确连带定妆喷雾，建议立即发起专项对话训练。
                </div>
              </div>

              <div className="p-3 bg-[#282A33] rounded-xl border border-[#393C47] space-y-1">
                <div className="text-[#FBBF24] font-semibold text-xs flex items-center justify-between">
                  <span>TOP 2: barenbliss 唇泥柜台试色转化</span>
                  <span className="text-[#E26A3B] text-[10px]">转化偏低</span>
                </div>
                <div className="text-[11px] text-[#D1D5DB] leading-relaxed">
                  💡 AI 结论：课件完成率高但专柜试色转化率仅 16%，建议加强“纸巾按压不沾杯”真实演示。
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToAI}
            className="w-full py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>进入 AI 智能推荐中心一键发任务</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Table: National Staff Leaderboard from Image 1 */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F0ECE3] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#9E4A2B]" />
            <h3 className="text-sm font-bold text-[#111827]">全国员工学习力排名</h3>
          </div>
          <span className="text-xs text-[#6B7280]">点击员工可下钻个人学习历史</span>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="text-[#6B7280] border-b border-[#F0ECE3]">
              <tr>
                <th className="py-2.5 px-3">排名</th>
                <th className="py-2.5 px-3">员工姓名</th>
                <th className="py-2.5 px-3">所属区域</th>
                <th className="py-2.5 px-3 text-right">总积分</th>
                <th className="py-2.5 px-3 text-right">任务积分</th>
                <th className="py-2.5 px-3 text-right">学习积分</th>
                <th className="py-2.5 px-3 text-center">任务完成率</th>
                <th className="py-2.5 px-3 text-center">月度考试平均分</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB] text-[#374151]">
              <tr className="hover:bg-[#FAF9F6]">
                <td className="py-3 px-3 font-bold text-[#9E4A2B]">1</td>
                <td className="py-3 px-3 font-semibold text-[#111827]">Siti Rahayu (Jakarta Central)</td>
                <td className="py-3 px-3 text-[#6B7280]">Jakarta</td>
                <td className="py-3 px-3 text-right font-mono font-bold">610</td>
                <td className="py-3 px-3 text-right font-mono">420</td>
                <td className="py-3 px-3 text-right font-mono">190</td>
                <td className="py-3 px-3 text-center font-mono text-[#059669]">97.7%</td>
                <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">96 分</td>
              </tr>
              <tr className="hover:bg-[#FAF9F6]">
                <td className="py-3 px-3 font-bold text-[#9E4A2B]">2</td>
                <td className="py-3 px-3 font-semibold text-[#111827]">Dewi Sartika (Bandung Mall)</td>
                <td className="py-3 px-3 text-[#6B7280]">Bandung</td>
                <td className="py-3 px-3 text-right font-mono font-bold">585</td>
                <td className="py-3 px-3 text-right font-mono">400</td>
                <td className="py-3 px-3 text-right font-mono">185</td>
                <td className="py-3 px-3 text-center font-mono text-[#059669]">94.2%</td>
                <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">92 分</td>
              </tr>
              <tr className="hover:bg-[#FAF9F6]">
                <td className="py-3 px-3 font-bold text-[#9E4A2B]">3</td>
                <td className="py-3 px-3 font-semibold text-[#111827]">Budi Santoso (Surabaya Plaza)</td>
                <td className="py-3 px-3 text-[#6B7280]">Surabaya</td>
                <td className="py-3 px-3 text-right font-mono font-bold">540</td>
                <td className="py-3 px-3 text-right font-mono">380</td>
                <td className="py-3 px-3 text-right font-mono">160</td>
                <td className="py-3 px-3 text-center font-mono text-[#059669]">89.0%</td>
                <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">88 分</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
