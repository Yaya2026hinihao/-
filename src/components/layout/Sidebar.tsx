import React from 'react';
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Database,
  GraduationCap,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Award,
  Tv,
  Building2,
  Cpu,
  PenTool,
  Coins
} from 'lucide-react';

export type NavSection =
  | 'products'
  | 'dashboard'
  | 'tasks'
  | 'ai-recommendations'
  | 'cross-selling'
  | 'exams'
  | 'courseware'
  | 'digital-humans'
  | 'scenario-scripts';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  productCount: number;
  combinationCount?: number;
  digitalHumanCount?: number;
  scenarioScriptCount?: number;
  onOpenTagManage?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  productCount,
  combinationCount = 4,
  digitalHumanCount = 27,
  scenarioScriptCount = 20,
  onOpenTagManage,
}) => {
  const isSparringActive =
    currentSection === 'digital-humans' || currentSection === 'scenario-scripts';
  return (
    <aside className="w-64 bg-[#1E1F24] text-[#A0A4AE] flex flex-col shrink-0 h-screen select-none border-r border-[#2A2B32]">
      {/* Brand Logo Header matching screenshot */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-[#2A2B32]/70">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E26A3B] to-[#C0491F] flex items-center justify-center text-white shadow-sm shadow-[#E26A3B]/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-semibold text-white tracking-tight text-base">SalesBoost AI</span>
          </div>
        </div>
      </div>

      {/* Customer Selector matching exact screenshot: "服务客户 Hebe Beauty" */}
      <div className="px-4 py-3 border-b border-[#2A2B32]/50">
        <div className="bg-[#292B33] rounded-lg px-3.5 py-2.5 flex items-center justify-between text-xs text-[#D1D5DB] hover:bg-[#32343E] transition-colors cursor-pointer border border-[#3A3D48]/50">
          <div className="truncate">
            <div className="text-[10px] text-[#9CA3AF]">服务客户</div>
            <div className="truncate font-bold text-white text-sm">Hebe Beauty</div>
          </div>
        </div>
      </div>

      {/* Nav List - Exact order matching screenshot */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 text-[13px] scrollbar-thin">
        {/* 1. 全国数据 */}
        <button
          onClick={() => onSelectSection('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            currentSection === 'dashboard'
              ? 'bg-[#282A32] text-white font-medium'
              : 'text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>全国数据</span>
        </button>

        {/* 2. 运行概览 */}
        <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200 transition-colors cursor-pointer">
          <Tv className="w-4 h-4" />
          <span>运行概览</span>
        </div>

        {/* 3. 区域数据 */}
        <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200 transition-colors cursor-pointer">
          <Building2 className="w-4 h-4" />
          <span>区域数据</span>
        </div>

        {/* 4. 积分管理 */}
        <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200 transition-colors cursor-pointer">
          <Coins className="w-4 h-4" />
          <span>积分管理</span>
        </div>

        {/* 5. BA 运营分析 */}
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4" />
            <span>BA 运营分析</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
        </div>

        {/* 6. 系统管理 */}
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4" />
            <span>系统管理</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
        </div>

        {/* 7. 基础设施 */}
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4" />
            <span>基础设施</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
        </div>

        {/* 8. ★ 产品管理 (With dropdown sub-items) */}
        <div className="my-1 space-y-0.5">
          <button
            onClick={() => onSelectSection('products')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all font-medium cursor-pointer ${
              currentSection === 'products'
                ? 'bg-[#9E4A2B] text-white shadow-sm font-semibold'
                : currentSection === 'ai-recommendations'
                ? 'bg-[#282A32] text-white'
                : 'text-white hover:bg-[#282A32] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className={`w-4 h-4 ${currentSection === 'products' ? 'text-white' : 'text-[#E26A3B]'}`} />
              <span>产品管理</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  currentSection === 'products' ? 'bg-white/20 text-white' : 'bg-[#2E313D] text-gray-300'
                }`}
              >
                {productCount}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </button>

          {/* Sub-items under 产品管理 */}
          <div className="pl-6 pr-1 py-0.5 space-y-0.5 text-xs">
            <button
              onClick={() => onSelectSection('products')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentSection === 'products'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#282A32]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${currentSection === 'products' ? 'bg-[#E26A3B]' : 'bg-gray-500'}`} />
                <span>产品列表</span>
              </div>
              <span className="text-[10px] text-gray-400">{productCount} 款</span>
            </button>

            <button
              onClick={() => onSelectSection('cross-selling')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentSection === 'cross-selling'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#282A32]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${currentSection === 'cross-selling' ? 'bg-[#E26A3B]' : 'bg-gray-500'}`} />
                <span>连带销售</span>
              </div>
              <span className="text-[10px] text-gray-400">{combinationCount || 4} 组</span>
            </button>

            <button
              onClick={() => onSelectSection('ai-recommendations')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentSection === 'ai-recommendations'
                  ? 'bg-[#9E4A2B] text-white font-medium shadow-xs'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#282A32]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                <span>AI 任务推荐</span>
              </div>
              <span className="text-[10px] bg-[#D97706]/20 text-[#F59E0B] px-1.5 py-0.2 rounded font-medium border border-[#D97706]/30">
                5
              </span>
            </button>
          </div>
        </div>

        {/* 9. 周期任务 */}
        <button
          onClick={() => onSelectSection('tasks')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            currentSection === 'tasks'
              ? 'bg-[#282A32] text-white font-medium'
              : 'text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4" />
            <span>周期任务</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
        </button>

        {/* 10. 在线课件 */}
        <button
          onClick={() => onSelectSection('courseware')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            currentSection === 'courseware'
              ? 'bg-[#282A32] text-white font-medium'
              : 'text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4" />
            <span>在线课件</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
        </button>

        {/* 11. 题目与考试 */}
        <button
          onClick={() => onSelectSection('exams')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            currentSection === 'exams'
              ? 'bg-[#282A32] text-white font-medium'
              : 'text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4" />
            <span>题目与考试</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
        </button>

        {/* 12. 类目管理 */}
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4" />
            <span>类目管理</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
        </div>

        {/* 13. AI资源 */}
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[#9CA3AF] hover:bg-[#282A32] hover:text-gray-200 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4" />
            <span>AI资源</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
        </div>

        {/* 14. ★ AI陪练管理 (With sub-items for 数字人顾客 & 场景剧本) */}
        <div className="my-1 space-y-0.5">
          <button
            onClick={() => onSelectSection(currentSection === 'digital-humans' ? 'scenario-scripts' : 'digital-humans')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all font-medium cursor-pointer ${
              isSparringActive
                ? 'bg-[#9E4A2B] text-white shadow-sm font-semibold'
                : 'text-[#9CA3AF] hover:bg-[#282A32] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className={`w-4 h-4 ${isSparringActive ? 'text-white' : 'text-[#E26A3B]'}`} />
              <span>AI陪练管理</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSparringActive ? 'rotate-180 text-white' : 'text-gray-400'}`} />
          </button>

          {/* Sub-items under AI陪练管理 (Matching exact screenshot) */}
          <div className="pl-6 pr-1 py-0.5 space-y-0.5 text-xs">
            <button
              onClick={() => onSelectSection('digital-humans')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentSection === 'digital-humans'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#282A32]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${currentSection === 'digital-humans' ? 'bg-[#E26A3B]' : 'bg-gray-500'}`} />
                <span>数字人顾客</span>
              </div>
              <span className="text-[10px] text-gray-400">{digitalHumanCount} 位</span>
            </button>

            <button
              onClick={() => onSelectSection('scenario-scripts')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentSection === 'scenario-scripts'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#282A32]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${currentSection === 'scenario-scripts' ? 'bg-[#E26A3B]' : 'bg-gray-500'}`} />
                <span>场景剧本</span>
              </div>
              <span className="text-[10px] text-gray-400">{scenarioScriptCount} 篇</span>
            </button>

            <div className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[#9CA3AF] hover:text-white hover:bg-[#282A32] transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                <span>金句总览</span>
              </div>
            </div>

            {onOpenTagManage && (
              <button
                onClick={onOpenTagManage}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[#D97706] hover:bg-[#282A32] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-3 h-3 text-[#D97706]" />
                  <span>标签体系配置</span>
                </div>
                <span className="text-[9px] bg-[#D97706]/20 text-[#F59E0B] px-1 py-0.2 rounded border border-[#D97706]/30">
                  可配置
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Profile Bar: "yaya" */}
      <div className="p-3 border-t border-[#2A2B32] bg-[#18191E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#9E4A2B] text-white text-xs font-semibold flex items-center justify-center">
              Y
            </div>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-white">yaya</div>
            </div>
          </div>
          <div className="text-[10px] text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
            在线
          </div>
        </div>
      </div>
    </aside>
  );
};
