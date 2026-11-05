import React, { useState } from 'react';
import { InspectionCategory, InspectionTaskRecord } from '../../types/inspection';
import { INSPECTION_CATEGORIES } from '../../data/mockInspectionData';
import { InspectionHubView } from './InspectionHubView';
import { InspectionCategoryDetailView } from './InspectionCategoryDetailView';
import { InspectionTaskBuilderModal } from './InspectionTaskBuilderModal';

interface InspectionMainViewProps {
  onShowToast: (msg: string) => void;
}

type InspectionViewMode = 'HUB' | 'DETAIL' | 'BUILDER';

export const InspectionMainView: React.FC<InspectionMainViewProps> = ({ onShowToast }) => {
  const [viewMode, setViewMode] = useState<InspectionViewMode>('HUB');
  const [selectedCategory, setSelectedCategory] = useState<InspectionCategory>(INSPECTION_CATEGORIES[0]);
  const [hasQueriedDirectly, setHasQueriedDirectly] = useState<boolean>(false);

  // 进入二级功能分类页面（默认不预载数据，由用户选择查询内容与配置后点击查询）
  const handleSelectCategory = (category: InspectionCategory) => {
    setSelectedCategory(category);
    setHasQueriedDirectly(false);
    setViewMode('DETAIL');
  };

  // 快捷从 AI 提问框直达报表（自动执行查询并展示分析）
  const handleOpenQuickQuery = (question: string) => {
    // 智能路由到对应模块
    if (question.includes('HQ') || question.includes('总部')) {
      setSelectedCategory(INSPECTION_CATEGORIES.find(c => c.id === 'hq') || INSPECTION_CATEGORIES[0]);
    } else if (question.includes('BA') || question.includes('人员') || question.includes('名单')) {
      setSelectedCategory(INSPECTION_CATEGORIES.find(c => c.id === 'ba') || INSPECTION_CATEGORIES[0]);
    } else if (question.includes('区域') || question.includes('及格率') || question.includes('Surabaya')) {
      setSelectedCategory(INSPECTION_CATEGORIES.find(c => c.id === 'region') || INSPECTION_CATEGORIES[0]);
    } else if (question.includes('销量') || question.includes('销售') || question.includes('对比')) {
      setSelectedCategory(INSPECTION_CATEGORIES.find(c => c.id === 'sales-analysis') || INSPECTION_CATEGORIES[0]);
    } else {
      setSelectedCategory(INSPECTION_CATEGORIES[0]);
    }
    setHasQueriedDirectly(true);
    setViewMode('DETAIL');
    onShowToast(`已为你智能解析需求并定位至【${question.slice(0, 16)}...】巡检核算！`);
  };

  // 点击历史巡检任务直接查看报告
  const handleSelectTaskRecord = (task: InspectionTaskRecord) => {
    // 匹配最相关的分类并展示详情
    const matched = INSPECTION_CATEGORIES.find(c => task.category.includes(c.title)) || INSPECTION_CATEGORIES[0];
    setSelectedCategory(matched);
    setHasQueriedDirectly(true);
    setViewMode('DETAIL');
    onShowToast(`已加载历史巡检任务《${task.title}》的核验结果与处置档案`);
  };

  // 保存新建计划
  const handleSavePlan = (planTitle: string) => {
    setViewMode('HUB');
    onShowToast(`🎉 巡检任务《${planTitle}》已成功建立并加入每日持续监督！`);
  };

  return (
    <div>
      {viewMode === 'HUB' && (
        <InspectionHubView
          onSelectCategory={handleSelectCategory}
          onOpenNewTaskBuilder={() => setViewMode('BUILDER')}
          onOpenQuickQuery={handleOpenQuickQuery}
          onSelectTaskRecord={handleSelectTaskRecord}
        />
      )}

      {viewMode === 'DETAIL' && (
        <InspectionCategoryDetailView
          category={selectedCategory}
          initialHasQueried={hasQueriedDirectly}
          onBack={() => setViewMode('HUB')}
          onShowToast={onShowToast}
        />
      )}

      {viewMode === 'BUILDER' && (
        <InspectionTaskBuilderModal
          onBack={() => setViewMode('HUB')}
          onSaveTask={handleSavePlan}
        />
      )}
    </div>
  );
};
