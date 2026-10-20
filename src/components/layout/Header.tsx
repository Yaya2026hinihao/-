import React from 'react';
import {
  Bell,
  Globe,
  Maximize2,
  Building2,
  MapPin,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  BookOpen,
  UserCheck,
  Bot,
  FileText,
  BarChart3,
  MessageSquare,
  Users,
  Package
} from 'lucide-react';
import { NavSection } from './Sidebar';

export type UserRolePerspective = 'HQ' | 'REGIONAL_JAKARTA' | 'REGIONAL_BANDUNG';

interface HeaderProps {
  breadcrumbs: string[];
  rolePerspective: UserRolePerspective;
  onChangePerspective: (role: UserRolePerspective) => void;
  currentSection?: NavSection;
  onSelectSection?: (section: NavSection) => void;
  onSearchQuery?: (q: string) => void;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumbs,
  rolePerspective,
  onChangePerspective,
  currentSection = 'products',
  onSelectSection,
  onRefresh,
}) => {
  return (
    <header className="bg-white border-b border-[#E8E6E1] shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] z-10 flex flex-col">
      {/* Top Bar: Breadcrumb + Utility Actions */}
      <div className="h-12 px-6 flex items-center justify-between">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[#4B5563]">
          <div className="flex items-center gap-1.5 font-medium text-[#1F2937]">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />}
                <span
                  className={
                    idx === breadcrumbs.length - 1
                      ? 'text-[#9E4A2B] font-semibold'
                      : 'text-[#4B5563] hover:text-[#111827] cursor-pointer'
                  }
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right: Actions, Role Switcher, Utilities, Profile */}
        <div className="flex items-center gap-3">
          {/* Role Perspective Selector (HQ vs Regional) */}
          <div className="flex items-center bg-[#F4F2EE] rounded-lg p-0.5 border border-[#E5E1D8]">
            <button
              onClick={() => onChangePerspective('HQ')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                rolePerspective === 'HQ'
                  ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              title="总部视角：制定产品策略、维护画像卖点、建立连带矩阵、管理角色"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>总部视角</span>
            </button>

            <button
              onClick={() => onChangePerspective('REGIONAL_JAKARTA')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                rolePerspective === 'REGIONAL_JAKARTA'
                  ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              title="区域视角：针对薄弱产品发布任务、参考AI建议定向分发"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Jakarta 区域</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#E5E7EB]"></div>

          <button
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer"
            title="全屏"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer"
            title="多语言"
          >
            <Globe className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] rounded-md transition-colors relative cursor-pointer"
              title="通知中心"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]"></span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2">
            <div className="w-7 h-7 rounded-full bg-[#9E4A2B] text-white text-xs font-semibold flex items-center justify-center">
              Y
            </div>
            <span className="text-xs font-medium text-[#374151]">yaya</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Bar: Exact visual match to Image 1 & Image 3 */}
      <div className="h-9 px-4 border-t border-[#F0ECE3] bg-[#FAF9F7] flex items-center justify-between text-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5">
          <button className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Tab: 产品管理 */}
          <button
            onClick={() => onSelectSection && onSelectSection('products')}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentSection === 'products' || currentSection === 'ai-recommendations'
                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                : 'bg-white border border-[#EAE6DD] text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>产品管理</span>
          </button>

          {/* Tab: 数字人顾客 */}
          <button
            onClick={() => onSelectSection && onSelectSection('digital-humans')}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentSection === 'digital-humans'
                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                : 'bg-white border border-[#EAE6DD] text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>数字人顾客</span>
          </button>

          {/* Tab: 场景剧本 */}
          <button
            onClick={() => onSelectSection && onSelectSection('scenario-scripts')}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentSection === 'scenario-scripts'
                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                : 'bg-white border border-[#EAE6DD] text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>场景剧本</span>
          </button>

          {/* Tab: 学习任务 / 在线课件 */}
          <button
            onClick={() => onSelectSection && onSelectSection('courseware')}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentSection === 'courseware'
                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                : 'bg-white border border-[#EAE6DD] text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>在线课件</span>
          </button>

          {/* Tab: 全国数据 */}
          <button
            onClick={() => onSelectSection && onSelectSection('dashboard')}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentSection === 'dashboard'
                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                : 'bg-white border border-[#EAE6DD] text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>全国数据</span>
          </button>

          {/* Tab: 练习任务 */}
          <button
            onClick={() => onSelectSection && onSelectSection('tasks')}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentSection === 'tasks'
                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                : 'bg-white border border-[#EAE6DD] text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>练习任务</span>
          </button>

          {/* Tab: 题目与考试 */}
          <button
            onClick={() => onSelectSection && onSelectSection('exams')}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentSection === 'exams'
                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                : 'bg-white border border-[#EAE6DD] text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>考试任务</span>
          </button>

          <button className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onRefresh}
          className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors cursor-pointer"
          title="刷新数据"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
