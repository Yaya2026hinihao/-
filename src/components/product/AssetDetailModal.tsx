import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Headphones,
  GraduationCap,
  ExternalLink,
  SendHorizontal,
  Bot,
  MessageSquare,
  Sparkles,
  Users,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Product, TrainingAssetStudy, TrainingAssetPractice, TrainingAssetExam } from '../../types/product';
import { SpecificAssetTarget } from '../task/TaskPublishModal';

export type AssetTabType = 'study' | 'practice' | 'exam';

interface AssetDetailModalProps {
  product: Product;
  initialTab: AssetTabType;
  isOpen: boolean;
  onClose: () => void;
  onOpenTaskPublish: (product: Product, specificAsset?: SpecificAssetTarget) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  product,
  initialTab,
  isOpen,
  onClose,
  onOpenTaskPublish,
}) => {
  const [activeTab, setActiveTab] = useState<AssetTabType>(initialTab);
  const [practiceTypeFilter, setPracticeTypeFilter] = useState<'全部' | '数字人' | '场景对话' | '金句'>('全部');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const filteredPractice = product.practiceAssets.filter((item) => {
    if (practiceTypeFilter === '全部') return true;
    return item.type === practiceTypeFilter;
  });

  const handleSimulateInspect = (title: string) => {
    setCopiedNotice(`已调起原有课件系统预览: 《${title}》`);
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl border border-[#E8E6E1] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EAE7E0] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-11 h-11 rounded-lg object-cover border border-[#E5E1D8] shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#1F2937] leading-tight">
                  {product.name}
                </h3>
                <span className="text-xs bg-[#F4F1EA] text-[#78716C] px-2 py-0.5 rounded border border-[#E5E1D8]">
                  {product.brand}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                SKU: <span className="font-mono text-[#374151]">{product.sku}</span> · 已关联现有培训资产与任务
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenTaskPublish(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              <span>按此产品发布任务</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Header */}
        <div className="flex items-center justify-between px-6 border-b border-[#EAE7E0] bg-white">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('study')}
              className={`flex items-center gap-2 py-3.5 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'study'
                  ? 'border-[#9E4A2B] text-[#9E4A2B] font-semibold'
                  : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>关联学习 / 课件 ({product.studyCount} 次)</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-2 py-3.5 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'practice'
                  ? 'border-[#9E4A2B] text-[#9E4A2B] font-semibold'
                  : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>关联练习任务 ({product.practiceCount} 次)</span>
            </button>

            <button
              onClick={() => setActiveTab('exam')}
              className={`flex items-center gap-2 py-3.5 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'exam'
                  ? 'border-[#9E4A2B] text-[#9E4A2B] font-semibold'
                  : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>
                关联考试任务 ({product.examAvgScore !== null ? `${product.examAvgScore}分均分` : '暂无数据'})
              </span>
            </button>
          </div>

          <div className="text-xs text-[#9CA3AF]">
            *数据来自已有关联课件、练习与考核系统
          </div>
        </div>

        {copiedNotice && (
          <div className="bg-[#FEF3C7] text-[#92400E] px-4 py-2 text-xs flex items-center gap-2 border-b border-[#FDE68A]">
            <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
            <span>{copiedNotice}</span>
          </div>
        )}

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#FAF9F7]">
          {/* TAB 1: 学习 / 课件 (去掉了内容形态一列) */}
          {activeTab === 'study' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>
                  共关联 <strong className="text-[#1F2937] font-semibold">{product.studyAssets.length}</strong> 个已有课件，用于发布任务累计{' '}
                  <strong className="text-[#9E4A2B]">{product.studyCount}</strong> 次。
                </span>
                <span className="text-[#78716C]">点击行右侧「发布任务」可直接带入该课件</span>
              </div>

              {product.studyAssets.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-dashed border-[#DDD7CD]">
                  <BookOpen className="w-10 h-10 text-[#C4BDAF] mx-auto mb-2" />
                  <p className="text-sm text-[#4B5563] font-medium">该产品暂未关联学习/课件任务</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">可在发布任务时直接选择并建立关联</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#E8E5DD] overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F7F3] border-b border-[#EAE7E0] text-[#6B7280] font-medium">
                      <tr>
                        <th className="py-3 px-4">课件内容</th>
                        <th className="py-3 px-4">发布人</th>
                        <th className="py-3 px-4">发布对象</th>
                        <th className="py-3 px-4 text-center">使用次数</th>
                        <th className="py-3 px-4 text-center">平均完成率</th>
                        <th className="py-3 px-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6] text-[#374151]">
                      {product.studyAssets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-3.5 px-4 font-medium text-[#111827]">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-[#9E4A2B] shrink-0" />
                              <span className="text-xs font-semibold">{asset.title}</span>
                            </div>
                            <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                              课件时长: {asset.durationMinutes} 分钟 · 上次使用: {asset.lastUsedDate}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs text-[#1F2937] font-medium">{asset.author}</span>
                            <div className="text-[11px] text-[#6B7280]">{asset.authorRole}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[#4B5563]">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              <span>{asset.targetAudience}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-[#9E4A2B] font-mono tabular-nums">
                            {asset.usageCount} 次
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono tabular-nums text-[#059669]">
                            {asset.passRate}%
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSimulateInspect(asset.title)}
                                className="px-2 py-1 text-xs text-[#6B7280] hover:text-[#111827] bg-[#F4F1EA] hover:bg-[#EAE5D9] rounded transition-colors cursor-pointer"
                              >
                                查看课件
                              </button>
                              <button
                                onClick={() =>
                                  onOpenTaskPublish(product, {
                                    id: asset.id,
                                    category: 'study',
                                    title: asset.title,
                                  })
                                }
                                className="px-2.5 py-1 text-xs text-white bg-[#9E4A2B] hover:bg-[#8C3E20] rounded transition-colors font-medium cursor-pointer shadow-2xs"
                                title="直接勾选该课件并进入发布页面"
                              >
                                发布任务
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 练习任务 (支持全部 / 数字人 / 场景对话 / 金句 筛选) */}
          {activeTab === 'practice' && (
            <div className="space-y-4">
              {/* Type Filter Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-[#EAE6DD] p-1 rounded-lg">
                  {(['全部', '数字人', '场景对话', '金句'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPracticeTypeFilter(type)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        practiceTypeFilter === type
                          ? 'bg-white text-[#9E4A2B] shadow-xs font-semibold'
                          : 'text-[#57534E] hover:text-[#1C1917]'
                      }`}
                    >
                      {type}
                      {type === '全部' && ` (${product.practiceAssets.length})`}
                      {type === '数字人' &&
                        ` (${product.practiceAssets.filter((a) => a.type === '数字人').length})`}
                      {type === '场景对话' &&
                        ` (${product.practiceAssets.filter((a) => a.type === '场景对话').length})`}
                      {type === '金句' &&
                        ` (${product.practiceAssets.filter((a) => a.type === '金句').length})`}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-[#6B7280]">
                  累计已组织练习 <strong className="text-[#9E4A2B] font-mono">{product.practiceCount}</strong> 次
                </div>
              </div>

              {filteredPractice.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-dashed border-[#DDD7CD]">
                  <Headphones className="w-10 h-10 text-[#C4BDAF] mx-auto mb-2" />
                  <p className="text-sm text-[#4B5563] font-medium">当前分类下暂无关联练习内容</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#E8E5DD] overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F7F3] border-b border-[#EAE7E0] text-[#6B7280] font-medium">
                      <tr>
                        <th className="py-3 px-4">练习内容</th>
                        <th className="py-3 px-4">练习形态</th>
                        <th className="py-3 px-4">发布人</th>
                        <th className="py-3 px-4">发布对象</th>
                        <th className="py-3 px-4 text-center">使用次数</th>
                        <th className="py-3 px-4 text-center">BA通关率</th>
                        <th className="py-3 px-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6] text-[#374151]">
                      {filteredPractice.map((asset) => (
                        <tr key={asset.id} className="hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-3.5 px-4 font-medium text-[#111827]">
                            <div className="flex items-center gap-2">
                              {asset.type === '数字人' && <Bot className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />}
                              {asset.type === '场景对话' && <MessageSquare className="w-3.5 h-3.5 text-[#D97706] shrink-0" />}
                              {asset.type === '金句' && <Sparkles className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />}
                              <span className="text-xs font-semibold">{asset.title}</span>
                            </div>
                            <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                              对话轮次: {asset.dialogueTurns} 轮 · 上次任务: {asset.lastUsedDate}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {asset.type === '数字人' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EEF2FF] text-[#4F46E5] rounded text-[11px] border border-[#C7D2FE] font-medium">
                                <Bot className="w-3 h-3" />
                                数字人
                              </span>
                            )}
                            {asset.type === '场景对话' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEF3C7] text-[#B45309] rounded text-[11px] border border-[#FDE68A] font-medium">
                                <MessageSquare className="w-3 h-3" />
                                场景对话
                              </span>
                            )}
                            {asset.type === '金句' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFE4E6] text-[#E11D48] rounded text-[11px] border border-[#FECDD3] font-medium">
                                <Sparkles className="w-3 h-3" />
                                金句朗读
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs text-[#1F2937] font-medium">{asset.author}</span>
                            <div className="text-[11px] text-[#6B7280]">{asset.authorRole}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[#4B5563]">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              <span>{asset.targetAudience}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-[#9E4A2B] font-mono tabular-nums">
                            {asset.usageCount} 次
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono tabular-nums text-[#059669]">
                            {asset.avgPassRate}%
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSimulateInspect(asset.title)}
                                className="px-2 py-1 text-xs text-[#6B7280] hover:text-[#111827] bg-[#F4F1EA] hover:bg-[#EAE5D9] rounded transition-colors cursor-pointer"
                              >
                                试练体验
                              </button>
                              <button
                                onClick={() =>
                                  onOpenTaskPublish(product, {
                                    id: asset.id,
                                    category: 'practice',
                                    title: asset.title,
                                  })
                                }
                                className="px-2.5 py-1 text-xs text-white bg-[#9E4A2B] hover:bg-[#8C3E20] rounded transition-colors font-medium cursor-pointer shadow-2xs"
                                title="直接勾选该练习并进入发布页面"
                              >
                                发任务
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 考试任务 */}
          {activeTab === 'exam' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>
                  该产品相关考试平均分:{' '}
                  <strong className="text-base text-[#9E4A2B] font-mono font-bold">
                    {product.examAvgScore !== null ? `${product.examAvgScore} 分` : '—'}
                  </strong>
                </span>
                <span className="text-[#78716C]">
                  {product.examAssets.length > 0
                    ? `共查询到 ${product.examAssets.length} 份关联试卷与通考记录`
                    : '暂无关联考试记录'}
                </span>
              </div>

              {product.examAssets.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-dashed border-[#DDD7CD]">
                  <GraduationCap className="w-10 h-10 text-[#C4BDAF] mx-auto mb-2" />
                  <p className="text-sm text-[#4B5563] font-medium">该产品暂无考试任务数据</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">列表中显示为“—” (不显示无意义的 0)</p>
                  <button
                    onClick={() => onOpenTaskPublish(product)}
                    className="mt-4 px-3 py-1.5 bg-[#9E4A2B] text-white text-xs font-medium rounded-lg hover:bg-[#8C3E20] transition-colors cursor-pointer"
                  >
                    + 去组卷发布新考试
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#E8E5DD] overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F7F3] border-b border-[#EAE7E0] text-[#6B7280] font-medium">
                      <tr>
                        <th className="py-3 px-4">考试内容</th>
                        <th className="py-3 px-4">发布人</th>
                        <th className="py-3 px-4">发布对象</th>
                        <th className="py-3 px-4 text-center">使用次数</th>
                        <th className="py-3 px-4 text-center">及格线</th>
                        <th className="py-3 px-4 text-center">平均分</th>
                        <th className="py-3 px-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6] text-[#374151]">
                      {product.examAssets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-3.5 px-4 font-medium text-[#111827]">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-3.5 h-3.5 text-[#9E4A2B] shrink-0" />
                              <span className="text-xs font-semibold">{asset.title}</span>
                            </div>
                            <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                              共 {asset.totalParticipants} 人参考 · 上次考试: {asset.lastUsedDate}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs text-[#1F2937] font-medium">{asset.author}</span>
                            <div className="text-[11px] text-[#6B7280]">{asset.authorRole}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[#4B5563]">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              <span>{asset.targetAudience}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-[#9E4A2B] font-mono tabular-nums">
                            {asset.usageCount} 次
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono tabular-nums text-[#6B7280]">
                            {asset.passingScore} 分
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="font-mono tabular-nums font-bold text-sm text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                              {asset.averageScore} 分
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSimulateInspect(asset.title)}
                                className="px-2 py-1 text-xs text-[#6B7280] hover:text-[#111827] bg-[#F4F1EA] hover:bg-[#EAE5D9] rounded transition-colors cursor-pointer"
                              >
                                查看试卷
                              </button>
                              <button
                                onClick={() =>
                                  onOpenTaskPublish(product, {
                                    id: asset.id,
                                    category: 'exam',
                                    title: asset.title,
                                  })
                                }
                                className="px-2.5 py-1 text-xs text-white bg-[#9E4A2B] hover:bg-[#8C3E20] rounded transition-colors font-medium cursor-pointer shadow-2xs"
                                title="直接勾选该考试并进入发布页面"
                              >
                                再次发布
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-[#EAE7E0] flex items-center justify-between text-xs text-[#6B7280]">
          <div>
            核心原则：<span className="text-[#1F2937]">列表页负责快速看数据，弹窗负责查看具体关联内容。</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#F4F1EA] hover:bg-[#E9E4D8] text-[#374151] rounded-lg transition-colors font-medium cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
