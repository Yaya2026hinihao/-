import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ClipboardList,
  GraduationCap,
  Building2,
  Briefcase,
  Users,
  Package,
  LineChart,
  ChevronRight,
  Filter,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  INSPECTION_CATEGORIES,
  MOCK_HISTORICAL_INSPECTION_TASKS
} from '../../data/mockInspectionData';
import { InspectionCategory, InspectionTaskRecord } from '../../types/inspection';

interface InspectionHubViewProps {
  onSelectCategory: (category: InspectionCategory) => void;
  onOpenNewTaskBuilder: () => void;
  onOpenQuickQuery: (question: string) => void;
  onSelectTaskRecord: (task: InspectionTaskRecord) => void;
}

export const InspectionHubView: React.FC<InspectionHubViewProps> = ({
  onSelectCategory,
  onOpenNewTaskBuilder,
  onOpenQuickQuery,
  onSelectTaskRecord
}) => {
  const [searchQuestion, setSearchQuestion] = useState('');
  const [taskStatusTab, setTaskStatusTab] = useState<'ALL' | 'RUNNING' | 'FINISHED'>('FINISHED');

  const filteredTasks = MOCK_HISTORICAL_INSPECTION_TASKS.filter(task => {
    if (taskStatusTab === 'ALL') return true;
    return task.status === taskStatusTab;
  });

  const runningCount = MOCK_HISTORICAL_INSPECTION_TASKS.filter(t => t.status === 'RUNNING').length;
  const finishedCount = MOCK_HISTORICAL_INSPECTION_TASKS.filter(t => t.status === 'FINISHED').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuestion.trim()) return;
    onOpenQuickQuery(searchQuestion.trim());
  };

  const quickPrompts = [
    '本周各HQ发布了多少任务？完成情况如何？',
    '哪些区域的考核及格率低于 75%？',
    '连续2周未参与任何任务的BA名单有哪些？',
    '重点大单品粉底液各区域覆盖率与销量对比？'
  ];

  // 图标映射
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ClipboardList':
        return <ClipboardList className="w-5 h-5 text-[#2563EB]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-[#9333EA]" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-[#059669]" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-[#D97706]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#0284C7]" />;
      case 'Package':
        return <Package className="w-5 h-5 text-[#9E4A2B]" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-[#EA580C]" />;
      case 'LineChart':
        return <LineChart className="w-5 h-5 text-[#10B981]" />;
      default:
        return <BarChart3 className="w-5 h-5 text-[#9E4A2B]" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. 顶部 Hero Banner (匹配原型截图一真实系统设计) */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E8E6E1] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF3F0] text-[#9E4A2B] border border-[#F3D5CA]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>智能巡检工作区</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
              把培训的每一步，都跟进到位。
            </h1>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              从课件时长到人员达标，查询当前情况或持续采集变化。明确范围和标准后执行，结果与分析保留在这里。
            </p>
          </div>

          {/* 右侧三步工作法与新建任务按钮 */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-6 lg:gap-4 shrink-0">
            <div className="space-y-2 text-xs text-[#6B7280]">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF3F0] text-[#9E4A2B] font-bold font-mono text-[11px] flex items-center justify-center shrink-0 border border-[#F3D5CA]">
                  01
                </span>
                <div>
                  <div className="font-semibold text-[#111827]">提出你的需求</div>
                  <div className="text-[11px] text-[#9CA3AF]">查询现状，或交办需要持续关注的事。</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF3F0] text-[#9E4A2B] font-bold font-mono text-[11px] flex items-center justify-center shrink-0 border border-[#F3D5CA]">
                  02
                </span>
                <div>
                  <div className="font-semibold text-[#111827]">明确条件与处理方式</div>
                  <div className="text-[11px] text-[#9CA3AF]">确认范围和标准，再选择合适的处理步骤。</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF3F0] text-[#9E4A2B] font-bold font-mono text-[11px] flex items-center justify-center shrink-0 border border-[#F3D5CA]">
                  03
                </span>
                <div>
                  <div className="font-semibold text-[#111827]">查看结果与跟进记录</div>
                  <div className="text-[11px] text-[#9CA3AF]">查询完成后保留结果，监督任务持续更新。</div>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenNewTaskBuilder}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#9E4A2B] hover:bg-[#833D23] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
            >
              <span>新建持续监督任务</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. AI 智能查询卡片 (严格匹配图四页面设计建议) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E26A3B] to-[#C0491F] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <span>AI 智能查询</span>
                <span className="text-[10px] bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded-full border border-[#A7F3D0] font-medium">
                  实时数据洞察
                </span>
              </h3>
              <p className="text-xs text-[#6B7280]">
                输入你想了解的问题，AI 帮你快速统计、穿透明细并生成专业巡检分析
              </p>
            </div>
          </div>
        </div>

        {/* 提问输入框 */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="例如：本周各HQ发布了多少任务？完成情况如何？"
            value={searchQuestion}
            onChange={(e) => setSearchQuestion(e.target.value)}
            className="w-full pl-10 pr-28 py-3 bg-[#FAF8F5] border border-[#D6D0C4] rounded-xl text-xs md:text-sm text-[#111827] focus:outline-hidden focus:ring-2 focus:ring-[#9E4A2B] focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-[#9E4A2B] hover:bg-[#833D23] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
          >
            AI 查询
          </button>
        </form>

        {/* 快捷推荐问题 Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-[#9CA3AF] font-medium">快速推荐：</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuestion(prompt);
                onOpenQuickQuery(prompt);
              }}
              className="text-xs bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#4B5563] hover:text-[#9E4A2B] px-2.5 py-1 rounded-lg border border-[#E5E1D8] transition-colors cursor-pointer text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 常用功能中心 (8 大功能矩阵分类，匹配图四 & 业务需求文档) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#111827]">
              常用功能中心
            </h3>
            <span className="text-xs text-[#6B7280]">
              按业务职责梳理的基础查询能力，点击可进入二级精细化配置
            </span>
          </div>
          <span className="text-xs text-[#9CA3AF]">
            共 8 大核心领域 · 42 项数据查询能力
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INSPECTION_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="bg-white rounded-xl p-4 border border-[#E8E6E1] hover:border-[#9E4A2B] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2 bg-[#FAF8F5] group-hover:bg-[#FAF3F0] rounded-lg border border-[#EFECE5] group-hover:border-[#F3D5CA] transition-colors">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-[10px] font-mono font-medium text-[#6B7280] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#EFECE5]">
                    {cat.badgeText}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#9E4A2B] transition-colors flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#9E4A2B] group-hover:translate-x-0.5 transition-all" />
                </h4>
                <p className="text-xs text-[#6B7280] mt-1 line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>

              {/* 细分子项预览 Tag */}
              <div className="pt-2 border-t border-[#F5F2EB] flex flex-wrap gap-1">
                {cat.queryItems.slice(0, 3).map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#FAF8F5] text-[#4B5563] px-1.5 py-0.5 rounded border border-[#EFECE5] truncate max-w-[130px]"
                  >
                    {item.title}
                  </span>
                ))}
                {cat.queryItems.length > 3 && (
                  <span className="text-[10px] text-[#9CA3AF] font-mono px-1 py-0.5">
                    +{cat.queryItems.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 历史巡检与监督任务记录 (严格匹配原型截图一与截图三) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE3]">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#111827]">
              巡检任务
            </h3>
            <span className="text-xs text-[#6B7280]">
              共 {MOCK_HISTORICAL_INSPECTION_TASKS.length} 项
            </span>
          </div>

          {/* 状态切换 Tab: 全部 / 运行中 / 已结束 */}
          <div className="flex items-center bg-[#FAF8F5] rounded-lg p-0.5 border border-[#D6D0C4] text-xs">
            <button
              onClick={() => setTaskStatusTab('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                taskStatusTab === 'ALL'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              全部 ({MOCK_HISTORICAL_INSPECTION_TASKS.length})
            </button>
            <button
              onClick={() => setTaskStatusTab('RUNNING')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                taskStatusTab === 'RUNNING'
                  ? 'bg-[#9E4A2B] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              运行中 {runningCount}
            </button>
            <button
              onClick={() => setTaskStatusTab('FINISHED')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                taskStatusTab === 'FINISHED'
                  ? 'bg-white text-[#9E4A2B] font-semibold shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              已结束 {finishedCount}
            </button>
          </div>
        </div>

        {/* 任务列表 */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#9CA3AF]">
              暂无运行中的任务。提出需求后，助手会与你确认处理方式。
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTaskRecord(task)}
                className="p-4 rounded-xl border border-[#E8E6E1] hover:border-[#9E4A2B] bg-[#FAF8F5]/50 hover:bg-white transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#111827] group-hover:text-[#9E4A2B] transition-colors">
                      {task.title}
                    </span>
                    {task.status === 'RUNNING' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                        运行中持续监督
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        已归档处理
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                    <span className="text-[#9E4A2B] font-medium">{task.category}</span>
                    <span>·</span>
                    <span>{task.scope}</span>
                    <span>·</span>
                    <span className="font-mono text-[#9CA3AF] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.createdAt}
                    </span>
                    <span>·</span>
                    <span className="text-gray-500">{task.creator}</span>
                  </div>

                  <p className="text-xs text-[#4B5563] line-clamp-1">
                    {task.summary}
                  </p>
                </div>

                {/* 右侧量化数据与查看结果按钮 */}
                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#EFECE5]">
                  {task.resultMetrics && (
                    <div className="text-right text-xs">
                      <div className="text-[#6B7280]">
                        扫描 <b className="font-mono text-[#111827]">{task.resultMetrics.totalScanned}</b> 人
                      </div>
                      <div className="font-mono font-bold text-[#059669]">
                        完成率 {task.resultMetrics.completionRate}%
                      </div>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E4A2B] group-hover:translate-x-0.5 transition-transform">
                    <span>查看巡检报告</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
