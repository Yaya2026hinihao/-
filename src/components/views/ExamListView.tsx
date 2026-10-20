import React, { useState } from 'react';
import { GraduationCap, Calendar, Users, Plus, CheckCircle2, ChevronRight, Package } from 'lucide-react';
import { Product } from '../../types/product';

interface ExamListViewProps {
  products: Product[];
  onOpenPublishModal: () => void;
  onNavigateToProduct: (product: Product) => void;
}

export const ExamListView: React.FC<ExamListViewProps> = ({
  products,
  onOpenPublishModal,
  onNavigateToProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'全部' | '待开始' | '考试中' | '待复核' | '已结束'>('全部');

  const mockExams = [
    {
      id: 'exam-1',
      title: 'Cloud Touch 底妆系列产品知识与色号掌握全国通考',
      status: '已结束',
      publishDate: '2026-08-20',
      period: '2026-08-21 ~ 2026-08-24',
      participants: 646,
      averageScore: 86,
      passingScore: 80,
      associatedProduct: products[0],
    },
    {
      id: 'exam-2',
      title: 'DAZZLE ME 定妆喷雾爆款销售通关全国统一考',
      status: '已结束',
      publishDate: '2026-08-25',
      period: '2026-08-26 ~ 2026-08-27',
      participants: 646,
      averageScore: 91,
      passingScore: 85,
      associatedProduct: products[3],
    },
    {
      id: 'exam-3',
      title: 'Q4 重点底妆新品能力与客诉应对考试 (Jakarta专项)',
      status: '已结束',
      publishDate: '2026-08-15',
      period: '2026-08-16 ~ 2026-08-17',
      participants: 128,
      averageScore: 89,
      passingScore: 85,
      associatedProduct: products[0],
    },
    {
      id: 'exam-4',
      title: 'SUNBRELLA 樱花防晒新品全波段防护理论摸底考',
      status: '待开始',
      publishDate: '2026-09-01',
      period: '2026-09-02 ~ 2026-09-05',
      participants: 646,
      averageScore: null,
      passingScore: 80,
      associatedProduct: products[5],
    },
  ];

  const filteredExams = mockExams.filter((exam) => {
    if (activeTab === '全部') return true;
    return exam.status === activeTab;
  });

  return (
    <div className="space-y-5">
      {/* Header matching Screenshot 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">考试任务管理</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            查看和追踪所有已发布的产品考核任务状态与平均分
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Tabs matching Screenshot 3 */}
          <div className="flex items-center gap-1 bg-[#F4F1EA] p-1 rounded-lg border border-[#E5E1D8]">
            {(['全部', '待开始', '考试中', '待复核', '已结束'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-[#9E4A2B] shadow-2xs font-semibold'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenPublishModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ 去组卷发布</span>
          </button>
        </div>
      </div>

      {/* Exam Cards matching Screenshot 3 */}
      <div className="space-y-4">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-2xs hover:border-[#D4CEBF] transition-all space-y-3"
          >
            {/* Top row: Status, dates, product link */}
            <div className="flex items-center justify-between text-xs text-[#6B7280] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                    exam.status === '已结束'
                      ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                      : 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]'
                  }`}
                >
                  {exam.status}
                </span>

                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span>{exam.publishDate} 发布</span>
                </span>

                <span>·</span>

                <span>期限: {exam.period}</span>
              </div>

              {exam.associatedProduct && (
                <button
                  onClick={() => onNavigateToProduct(exam.associatedProduct)}
                  className="text-xs text-[#9E4A2B] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>关联产品: {exam.associatedProduct.name} &gt;</span>
                </button>
              )}
            </div>

            {/* Exam card inner content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#FAF9F7] rounded-xl border border-[#EAE6DD]">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#111827]">{exam.title}</h3>
                <div className="text-xs text-[#6B7280]">
                  合格线: {exam.passingScore} 分 · 包含单选、多选与专柜情境判断题
                </div>
              </div>

              <div className="flex items-center gap-8 self-end md:self-auto">
                <div className="text-center">
                  <div className="text-[11px] text-[#6B7280]">参考人数</div>
                  <div className="text-sm font-bold text-[#111827] font-mono mt-0.5">
                    {exam.participants} 人
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[11px] text-[#6B7280]">平均分</div>
                  <div className="text-base font-bold font-mono mt-0.5 text-[#059669]">
                    {exam.averageScore !== null ? `${exam.averageScore} 分` : '—'}
                  </div>
                </div>

                <button className="px-3.5 py-1.5 bg-white hover:bg-[#F9F8F6] border border-[#D6D0C4] rounded-lg text-xs text-[#374151] font-medium shadow-2xs transition-colors">
                  成绩单 &gt;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
