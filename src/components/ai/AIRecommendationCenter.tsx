import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  TrendingUp,
  AlertCircle,
  Package,
  Layers,
  CheckCircle2,
  SendHorizontal,
  ArrowRight,
  Filter,
  BrainCircuit,
  MapPin,
  Flame,
  Zap
} from 'lucide-react';
import { AIRecommendation, Product } from '../../types/product';

interface AIRecommendationCenterProps {
  recommendations: AIRecommendation[];
  products: Product[];
  onApplyRecommendation: (product: Product, rec: AIRecommendation) => void;
  selectedRegion?: string;
}

export const AIRecommendationCenter: React.FC<AIRecommendationCenterProps> = ({
  recommendations,
  products,
  onApplyRecommendation,
  selectedRegion = '全部区域',
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('全部');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const scenarioTypes = [
    '全部',
    '当期大单品',
    '新品培训',
    '区域薄弱产品',
    '销售转化提升',
    '连带组合销售',
  ];

  const filtered = recommendations.filter((rec) => {
    if (selectedScenario !== '全部' && rec.scenarioType !== selectedScenario) return false;
    return true;
  });

  const handleQuickApply = (rec: AIRecommendation) => {
    const product = products.find((p) => p.id === rec.productId);
    if (product) {
      onApplyRecommendation(product, rec);
    } else {
      setAppliedNotice(`已采纳推荐方案: ${rec.title}`);
      setTimeout(() => setAppliedNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header - Clean, straightforward, no high-flown slogans */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">AI 任务推荐</h1>
            <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded font-medium border border-[#FCD34D]">
              智能建议
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            根据当期重点产品与专柜考核掌握情况，智能建议可发布的培训或练习任务。
          </p>
        </div>
      </div>

      {appliedNotice && (
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>{appliedNotice}</span>
          </div>
        </div>
      )}

      {/* Scenario Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E8E6E1] shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[#6B7280] mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            推荐场景:
          </span>
          {scenarioTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedScenario(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                selectedScenario === type
                  ? 'bg-[#9E4A2B] text-white shadow-xs font-semibold'
                  : 'bg-[#F4F1EA] text-[#57534E] hover:bg-[#EAE5D9]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#6B7280] hidden sm:block">
          共生成 <span className="font-semibold text-[#9E4A2B]">{filtered.length}</span> 条智能任务建议
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filtered.map((rec) => {
          const product = products.find((p) => p.id === rec.productId);

          return (
            <div
              key={rec.id}
              className="bg-white rounded-xl border border-[#E8E6E1] p-5 shadow-xs hover:border-[#D4CEBF] transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={rec.productImage}
                    alt={rec.productName}
                    className="w-14 h-14 rounded-lg object-cover border border-[#E5E1D8] shadow-2xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-semibold border ${
                          rec.scenarioType === '当期大单品'
                            ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                            : rec.scenarioType === '新品培训'
                            ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                            : rec.scenarioType === '区域薄弱产品'
                            ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]'
                            : rec.scenarioType === '销售转化提升'
                            ? 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]'
                            : 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                        }`}
                      >
                        {rec.scenarioType}
                      </span>
                      <span className="text-xs bg-[#F4F1EA] text-[#6B7280] px-2 py-0.5 rounded border border-[#E5E1D8]">
                        {rec.brand}
                      </span>
                      <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {rec.targetRegion}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1F2937] leading-snug">
                      {rec.title} · <span className="text-[#4B5563] font-normal">{rec.productName}</span>
                    </h3>
                  </div>
                </div>

                {/* Right Action */}
                <div className="shrink-0 flex sm:flex-col items-end gap-1.5">
                  <button
                    onClick={() => handleQuickApply(rec)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <SendHorizontal className="w-3.5 h-3.5" />
                    <span>去发布此任务</span>
                  </button>
                  <span className="text-[11px] text-[#9CA3AF]">带入该产品与关联内容</span>
                </div>
              </div>

              {/* AI Diagnostic Rationale */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#EFEBE1] text-xs leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-[#78350F]">
                  <BrainCircuit className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>AI 决策归因与数据洞察：</span>
                </div>
                <p className="text-[#4B5563]">{rec.reason}</p>
                <div className="text-[11px] text-[#9E4A2B] font-medium pt-1">
                  💡 {rec.highlightMessage}
                </div>
              </div>

              {/* Recommended Contents Checklist */}
              {product && (
                <div className="pt-1 border-t border-[#F0EDE6]">
                  <div className="text-xs font-semibold text-[#374151] mb-2 flex items-center justify-between">
                    <span>AI 推荐配套内容包（包含已有课件、数字人对练与考核）：</span>
                    <span className="text-[11px] text-[#6B7280]">
                      共 {rec.suggestedAssets.studyIds.length + rec.suggestedAssets.practiceIds.length + rec.suggestedAssets.examIds.length} 门配套内容
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    {/* Courseware */}
                    <div className="bg-[#FDFCFA] p-2.5 rounded-lg border border-[#EAE6DD]">
                      <div className="font-medium text-[#1F2937] mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9E4A2B]"></span>
                        <span>推荐学习课件</span>
                      </div>
                      <div className="space-y-1 text-[#4B5563]">
                        {product.studyAssets.slice(0, 2).map((s) => (
                          <div key={s.id} className="flex items-center gap-1.5 truncate text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-[#059669] shrink-0" />
                            <span className="truncate">{s.title}</span>
                          </div>
                        ))}
                        {product.studyAssets.length === 0 && (
                          <div className="text-[11px] text-[#9CA3AF]">无需学习课件（聚焦实操）</div>
                        )}
                      </div>
                    </div>

                    {/* Practice */}
                    <div className="bg-[#FDFCFA] p-2.5 rounded-lg border border-[#EAE6DD]">
                      <div className="font-medium text-[#1F2937] mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></span>
                        <span>推荐练习对练</span>
                      </div>
                      <div className="space-y-1 text-[#4B5563]">
                        {product.practiceAssets.slice(0, 2).map((p) => (
                          <div key={p.id} className="flex items-center gap-1.5 truncate text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-[#059669] shrink-0" />
                            <span className="truncate">[{p.type}] {p.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exam */}
                    <div className="bg-[#FDFCFA] p-2.5 rounded-lg border border-[#EAE6DD]">
                      <div className="font-medium text-[#1F2937] mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                        <span>推荐考核验证</span>
                      </div>
                      <div className="space-y-1 text-[#4B5563]">
                        {product.examAssets.slice(0, 1).map((e) => (
                          <div key={e.id} className="flex items-center gap-1.5 truncate text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-[#059669] shrink-0" />
                            <span className="truncate">{e.title}</span>
                          </div>
                        ))}
                        {product.examAssets.length === 0 && (
                          <div className="text-[11px] text-[#9CA3AF]">暂无考试或免试推荐</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
