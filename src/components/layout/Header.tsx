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
  Package,
  ShieldCheck
} from 'lucide-react';
import { NavSection } from './Sidebar';

export type UserRolePerspective =
  | 'HQ' // 可以看到全国数据的人 (全国BA总数、全国已激活BA数；全国主播总数、全国已激活主播数)
  | 'REGIONAL_RGM' // 区域RGM 可以看到区域总数据的人 (区域BA总数、区域已激活BA数；区域主播总数、区域已激活主播数)
  | 'REGIONAL_MT' // 区域MT 只管BA不管主播，默认查看所属RGM下全部MT，可下钻自己管理的RT
  | 'REGIONAL_RT' // 区域RT 只管BA不管主播，仅查看自己授权范围内的RT统计
  | 'REGIONAL_MT_RT' // 兼容旧值
  | 'REGIONAL_JAKARTA' // 兼容旧值
  | 'REGIONAL_BANDUNG'; // 兼容旧值

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
  const isHQ = rolePerspective === 'HQ';
  const isRGM = rolePerspective === 'REGIONAL_RGM' || rolePerspective === 'REGIONAL_JAKARTA';
  const isMT = rolePerspective === 'REGIONAL_MT' || rolePerspective === 'REGIONAL_MT_RT';
  const isRT = rolePerspective === 'REGIONAL_RT';

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
          {/* Demo Role Switcher: HQ / RGM / MT / RT (Production binds to logged-in account role) */}
          <div
            className="flex items-center bg-[#F4F2EE] rounded-lg p-0.5 border border-[#E5E1D8]"
            title="演示用账号角色切换（正式环境按登录账号角色自动锁定权限）"
          >
            <span className="px-2 text-[10px] text-[#9CA3AF] font-medium hidden xl:inline">
              演示账号:
            </span>
            <button
              onClick={() => onChangePerspective('HQ')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isHQ
                  ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              title="HQ总部：拥有全国14个RGM及下属MT/RT完整查看与下钻权限"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>总部 HQ</span>
            </button>

            <button
              onClick={() => onChangePerspective('REGIONAL_RGM')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isRGM
                  ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              title="区域RGM：可查看全国14个RGM，仅可点击自己负责区域下钻至MT/RT"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>区域 RGM</span>
            </button>

            <button
              onClick={() => onChangePerspective('REGIONAL_MT')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isMT
                  ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              title="区域MT：默认查看所属RGM下全部MT，仅可点击自己管理的MT下钻至RT"
            >
              <Users className="w-3.5 h-3.5" />
              <span>区域 MT</span>
            </button>

            <button
              onClick={() => onChangePerspective('REGIONAL_RT')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isRT
                  ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              title="区域RT：仅查看自己授权范围内的RT汇总指标与BA统计，不可下钻BA明细"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>区域 RT</span>
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
              {isHQ ? 'Y' : isRGM ? 'A' : isMT ? 'P' : 'S'}
            </div>
            <div className="leading-tight">
              <div className="text-xs font-medium text-[#374151]">
                {isHQ
                  ? 'yaya (HQ)'
                  : isRGM
                  ? 'Andi Wijaya (RGM)'
                  : isMT
                  ? 'Putri Kartika (MT)'
                  : 'Agus Salim (RT)'}
              </div>
            </div>
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
              currentSection === 'products' ||
              currentSection === 'ai-recommendations' ||
              currentSection === 'cross-selling'
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

          {/* Tab: 全国数据 / 区域数据 */}
          <button
            onClick={() => onSelectSection && onSelectSection('dashboard')}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentSection === 'dashboard' || currentSection === 'hero-products'
                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                : 'bg-white border border-[#EAE6DD] text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isHQ ? '全国数据' : '区域数据'}</span>
          </button>

          {/* Tab: 智能巡检 */}
          <button
            onClick={() => onSelectSection && onSelectSection('inspection')}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentSection === 'inspection'
                ? 'bg-[#9E4A2B] text-white font-semibold shadow-2xs'
                : 'bg-white border border-[#EAE6DD] text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>智能巡检</span>
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
