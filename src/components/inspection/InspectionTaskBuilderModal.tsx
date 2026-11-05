import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  Filter,
  Calendar,
  AlertTriangle,
  Play,
  FileCheck,
  UserCheck,
  Layers,
  ArrowRight
} from 'lucide-react';

interface InspectionTaskBuilderModalProps {
  onBack: () => void;
  onSaveTask: (taskSummary: string) => void;
}

export const InspectionTaskBuilderModal: React.FC<InspectionTaskBuilderModalProps> = ({
  onBack,
  onSaveTask
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: '你好！我是你的智能巡检助手。请告诉我你想查询什么，或者有什么需要持续跟进监督的事项？比如：“帮我监督全国专柜BA在双十一前对粉底液的学习达标率”，我来帮你明确目标对象与执行计划。',
      time: '刚刚'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [hasPlanGenerated, setHasPlanGenerated] = useState(false);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput.trim();
    setUserInput('');

    const newMsgs = [...messages, { sender: 'user' as const, text: userText, time: '刚刚' }];
    setMessages(newMsgs);

    setTimeout(() => {
      setMessages([
        ...newMsgs,
        {
          sender: 'assistant' as const,
          text: `收到你的需求！已识别出核心对象【全国专柜BA】与关注重点【大单品对练达标率与考试完成度】。右侧已为你自动生成了结构化执行计划，包含数据范围、触发标准和异常提醒规则。请确认是否需要调整？`,
          time: '刚刚'
        }
      ]);
      setHasPlanGenerated(true);
    }, 400);
  };

  const handleApplyPreset = (presetText: string) => {
    setUserInput(presetText);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 顶部 Header (匹配原型截图二) */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-white hover:bg-gray-50 text-xs font-semibold text-[#4B5563] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>丢弃并返回</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF3F0] text-[#9E4A2B] border border-[#F3D5CA]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>巡检助手 · 为你明确目标与执行条件</span>
          </div>
        </div>
      </div>

      {/* 左右分栏两栏布局 (严格匹配截图二) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* 左栏: 巡检助手 对话区 */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-xs flex flex-col justify-between h-[620px]">
          {/* 对话列表 */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#FAF3F0] text-[#9E4A2B] border border-[#F3D5CA] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#9E4A2B] text-white rounded-tr-xs'
                      : 'bg-[#FAF8F5] text-[#1F2937] border border-[#EFECE5] rounded-tl-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* 预设推荐需求 */}
          <div className="pt-3 border-t border-[#F0ECE3] space-y-2">
            <div className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
              <span>不知道如何描述？点击快捷填入：</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                '帮我持续监控各区域大单品练习达标率，低于75%自动预警',
                '排查连续7天未登录的在岗专柜BA名单并导出',
                '对比各HQ近期发布的任务在全国专柜的完成效果'
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-[11px] bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#4B5563] px-2.5 py-1 rounded-lg border border-[#E5E1D8] transition-colors cursor-pointer text-left"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 输入框与发送需求按钮 (匹配截图二) */}
            <form onSubmit={handleSendMessage} className="space-y-2 pt-2">
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="告诉我我想查询什么，或需要持续关注什么..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#D6D0C4] rounded-xl text-xs text-[#111827] focus:outline-hidden focus:ring-1 focus:ring-[#9E4A2B] focus:bg-white resize-none"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                <span>Enter 发送 · Shift + Enter 换行</span>
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#9E4A2B] hover:bg-[#833D23] disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>发送需求</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 右栏: 任务计划 (严格匹配截图二) */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-xs flex flex-col justify-between h-[620px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE3]">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#9E4A2B]" />
                <span>任务计划</span>
              </h3>
              {hasPlanGenerated && (
                <span className="text-[10px] bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded-full border border-[#A7F3D0] font-semibold">
                  计划就绪
                </span>
              )}
            </div>

            {!hasPlanGenerated ? (
              /* 初始空状态匹配截图二文案 */
              <div className="h-[460px] flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#EFECE5] flex items-center justify-center text-[#9E4A2B]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h4 className="text-xl font-bold text-[#111827]">
                    先明确需求，<br />再一起确认计划。
                  </h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    在对话中告诉我需要关注的人和事。对象、范围、时间和处理方式明确后，详细计划将在这里逐步呈现。
                  </p>
                </div>
              </div>
            ) : (
              /* 生成后的结构化计划 */
              <div className="py-4 space-y-3.5 text-xs overflow-y-auto max-h-[460px] pr-1">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] space-y-1">
                  <div className="text-[11px] text-[#9CA3AF]">计划名称</div>
                  <div className="font-bold text-sm text-[#111827]">
                    大单品全员对练达标率持续监督计划
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] space-y-1">
                    <div className="text-[11px] text-[#9CA3AF]">目标对象</div>
                    <div className="font-semibold text-xs text-[#111827]">
                      全国各专柜在册 BA (共 374 人)
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] space-y-1">
                    <div className="text-[11px] text-[#9CA3AF]">覆盖范围</div>
                    <div className="font-semibold text-xs text-[#111827]">
                      5 大区域 · 3 大品牌
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] space-y-1.5">
                  <div className="text-[11px] text-[#9CA3AF]">监控预警标准 (处理阈值)</div>
                  <div className="space-y-1 text-[#374151]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                      <span>对练达标率低于 75% 时标记为异常专柜</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                      <span>单人连续超 7 天未提交练习，自动推送提醒</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE5] space-y-1">
                  <div className="text-[11px] text-[#9CA3AF]">执行与汇报周期</div>
                  <div className="font-semibold text-xs text-[#111827]">
                    每日 09:00 自动巡检核算 · 异常数据自动抄送区域 MT
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部按钮栏 (匹配截图二) */}
          <div className="pt-3 border-t border-[#F0ECE3] flex items-center justify-between">
            <span className="text-[11px] text-[#9CA3AF]">
              {!hasPlanGenerated ? '请先提出需求' : '点击执行计划后立即提交执行'}
            </span>
            <button
              type="button"
              disabled={!hasPlanGenerated}
              onClick={() => onSaveTask('大单品全员对练达标率持续监督计划')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#9E4A2B] hover:bg-[#833D23] disabled:opacity-40 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <Play className="w-3.5 h-3.5" />
              <span>执行计划</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
