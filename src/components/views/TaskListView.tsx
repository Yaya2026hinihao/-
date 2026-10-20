import React, { useState } from 'react';
import {
  Plus,
  SendHorizontal,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  MessageSquare,
  Bot,
  Sparkles,
  ChevronRight,
  Package
} from 'lucide-react';
import { Product } from '../../types/product';

interface TaskListViewProps {
  products: Product[];
  onOpenPublishModal: () => void;
  onNavigateToProduct: (product: Product) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  products,
  onOpenPublishModal,
  onNavigateToProduct,
}) => {
  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);

  const mockTasks = [
    {
      id: 'task-1',
      title: 'Tugas Cloud Touch 粉底液持妆推销',
      status: '进行中',
      associatedProduct: products[0],
      targetAudience: '全国BA (共646人)',
      deadline: '2026-08-28 ~ 2026-09-02',
      passRate: '83.9%',
      participants: '542 / 646 人',
      period: '第 1/1 期',
      scriptTitle: 'Penanganan Customer untuk mendapatkan hasil complexion yang transparan, anti minyak, blur efek',
      scriptCategory: '指定场景剧本 (1)',
      assetCount: 4,
    },
    {
      id: 'task-2',
      title: 'DAZZLE ME 定妆喷雾爆款连带实战',
      status: '进行中',
      associatedProduct: products[3],
      targetAudience: '全国BA (共646人)',
      deadline: '2026-08-25 ~ 2026-08-30',
      passRate: '95.6%',
      participants: '618 / 646 人',
      period: '第 1/1 期',
      scriptTitle: '顾客购买任意底妆时的定妆喷雾30秒极速成膜演示与促单',
      scriptCategory: '连带对练剧本 (1)',
      assetCount: 3,
    },
    {
      id: 'task-3',
      title: 'Y.O.U 水光气垫客诉应对补差训练',
      status: '已结束',
      associatedProduct: products[4],
      targetAudience: 'Jakarta 区域BA (共128人)',
      deadline: '2026-08-11 ~ 2026-08-15',
      passRate: '71.0%',
      participants: '128 / 128 人',
      period: '第 1/1 期',
      scriptTitle: '干皮混干皮水光妆效沟通与控油喷雾搭配解法',
      scriptCategory: '客诉场景 (1)',
      assetCount: 3,
    },
    {
      id: 'task-4',
      title: 'barenbliss 哑光唇泥不沾杯测试对练',
      status: '已结束',
      associatedProduct: products[1],
      targetAudience: '全国BA (共646人)',
      deadline: '2026-08-01 ~ 2026-08-05',
      passRate: '88.0%',
      participants: '568 / 646 人',
      period: '第 1/1 期',
      scriptTitle: '专柜纸巾轻压展示与韩系微醺唇色推荐',
      scriptCategory: '指定场景剧本 (1)',
      assetCount: 3,
    },
  ];

  const currentTask = mockTasks[selectedTaskIdx];

  return (
    <div className="space-y-5">
      {/* Header matching Screenshot 2 */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">练习任务列表</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            以产品为核心调动的实战练习任务（数字人 / 场景对话 / 金句）
          </p>
        </div>

        <button
          onClick={onOpenPublishModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ 新建周期任务</span>
        </button>
      </div>

      {/* Two Columns Layout matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Task List Cards */}
        <div className="lg:col-span-4 space-y-3">
          {mockTasks.map((task, idx) => (
            <div
              key={task.id}
              onClick={() => setSelectedTaskIdx(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                selectedTaskIdx === idx
                  ? 'bg-white border-[#9E4A2B] ring-1 ring-[#9E4A2B]'
                  : 'bg-white border-[#E8E6E1] hover:border-[#D4CEBF]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                    task.status === '进行中'
                      ? 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]'
                      : 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                  }`}
                >
                  {task.status}
                </span>

                {task.associatedProduct && (
                  <span className="text-[10px] bg-[#FAF8F5] text-[#9E4A2B] px-1.5 py-0.5 rounded border border-[#EFECE5] font-medium">
                    产品: {task.associatedProduct.brand}
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-[#111827] leading-snug line-clamp-1">
                {task.title}
              </h4>

              <div className="flex items-center justify-between text-[11px] text-[#6B7280] mt-2 pt-2 border-t border-[#F5F2EB]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#9CA3AF]" />
                  <span>任务期限内完成 1次</span>
                </span>
                <span className="font-mono font-bold text-[#9E4A2B]">
                  {task.passRate} 达标
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Detailed Task View matching Screenshot 2 */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-xs space-y-6">
          {/* Header of Detail */}
          <div className="flex items-start justify-between border-b border-[#F0ECE3] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium border ${
                    currentTask.status === '进行中'
                      ? 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]'
                      : 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                  }`}
                >
                  {currentTask.status}
                </span>
                {currentTask.associatedProduct && (
                  <button
                    onClick={() => onNavigateToProduct(currentTask.associatedProduct)}
                    className="text-xs text-[#9E4A2B] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Package className="w-3 h-3" />
                    <span>绑定核心产品: {currentTask.associatedProduct.name} &gt;</span>
                  </button>
                )}
              </div>
              <h2 className="text-base font-bold text-[#111827]">{currentTask.title}</h2>
            </div>

            <button className="px-4 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors">
              查看完成明细
            </button>
          </div>

          {/* Metric Stats Row from Screenshot 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#FAF9F7] p-3 rounded-xl border border-[#EAE6DD]">
              <span className="text-[#6B7280] block mb-1">分发对象</span>
              <span className="font-semibold text-[#111827]">{currentTask.targetAudience}</span>
            </div>

            <div className="bg-[#FAF9F7] p-3 rounded-xl border border-[#EAE6DD]">
              <span className="text-[#6B7280] block mb-1">任务期限</span>
              <span className="font-semibold text-[#111827]">{currentTask.deadline}</span>
            </div>

            <div className="bg-[#FAF9F7] p-3 rounded-xl border border-[#EAE6DD]">
              <span className="text-[#6B7280] block mb-1">达标率</span>
              <span className="font-bold text-[#9E4A2B] font-mono text-sm">{currentTask.passRate}</span>
              <span className="text-[10px] text-[#9CA3AF] block mt-0.5">{currentTask.participants}</span>
            </div>

            <div className="bg-[#FAF9F7] p-3 rounded-xl border border-[#EAE6DD]">
              <span className="text-[#6B7280] block mb-1">参与率</span>
              <span className="font-bold text-[#059669] font-mono text-sm">92.4%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>周期执行进度 ({currentTask.period})</span>
              <span>{currentTask.passRate} 达标</span>
            </div>
            <div className="w-full bg-[#EAE6DD] h-2 rounded-full overflow-hidden">
              <div
                style={{ width: currentTask.passRate }}
                className="bg-[#9E4A2B] h-full rounded-full transition-all"
              ></div>
            </div>
          </div>

          {/* Linked Training Assets from Screenshot 2 */}
          <div className="space-y-3 pt-3 border-t border-[#F0ECE3]">
            <h3 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#9E4A2B]" />
              <span>包含的实战训练资产 ({currentTask.assetCount})</span>
            </h3>

            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] flex items-center justify-between hover:border-[#D4CEBF] transition-all cursor-pointer">
              <div className="space-y-1">
                <span className="text-[11px] text-[#9E4A2B] font-medium flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" />
                  {currentTask.scriptCategory}
                </span>
                <div className="text-xs font-semibold text-[#111827]">
                  {currentTask.scriptTitle}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
