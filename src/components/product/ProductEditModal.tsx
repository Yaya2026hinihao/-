import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Tag, Check } from 'lucide-react';
import { Product, RoleConfig } from '../../types/product';

interface ProductEditModalProps {
  product: Product | null; // null means adding a new product
  roleConfigs: RoleConfig[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  roleConfigs,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = !!product;

  const [formData, setFormData] = useState<Partial<Product>>(() => {
    if (product) return { ...product };
    return {
      id: `prod-${Date.now()}`,
      spu: '',
      sku: '',
      name: '',
      brand: 'YOU',
      series: 'Cloud Touch 系列',
      category: 'MAKEUP',
      subCategory: 'FACE',
      image: '/src/assets/images/you_skin_tint_1790622591492.jpg',
      status: '当期主推',
      stock: 10000,
      roles: ['大单品', '主推品'],
      isFocus: true,
      description: '',
      sellingPoints: ['3% 高纯度烟酰胺复配，上妆即养肤', '水感轻透爆水质地，10秒迅速成膜'],
      goldenSentences: ['“底妆不是面具，是会呼吸的第二层原生皮肤。”'],
      persona: {
        targetGroups: ['年轻白领', '早八学生党'],
        skinTypes: ['混油皮', '油皮'],
        demands: ['清爽控油', '持久不脱妆'],
        scenarios: ['日常通勤', '长时间带妆'],
      },
      crossSelling: [],
      studyCount: 0,
      practiceCount: 0,
      examAvgScore: null,
      studyAssets: [],
      practiceAssets: [],
      examAssets: [],
    };
  });

  const [newSellingPoint, setNewSellingPoint] = useState('');
  const [newGoldenSentence, setNewGoldenSentence] = useState('');

  // Persona tag inputs
  const [newTargetGroup, setNewTargetGroup] = useState('');
  const [newSkinType, setNewSkinType] = useState('');
  const [newDemand, setNewDemand] = useState('');
  const [newScenario, setNewScenario] = useState('');

  if (!isOpen) return null;

  const handleToggleRole = (roleName: string) => {
    const current = formData.roles || [];
    if (current.includes(roleName)) {
      setFormData({ ...formData, roles: current.filter((r) => r !== roleName) });
    } else {
      setFormData({ ...formData, roles: [...current, roleName] });
    }
  };

  const handleAddSellingPoint = () => {
    if (!newSellingPoint.trim()) return;
    setFormData({
      ...formData,
      sellingPoints: [...(formData.sellingPoints || []), newSellingPoint.trim()],
    });
    setNewSellingPoint('');
  };

  const handleRemoveSellingPoint = (idx: number) => {
    setFormData({
      ...formData,
      sellingPoints: (formData.sellingPoints || []).filter((_, i) => i !== idx),
    });
  };

  const handleAddGoldenSentence = () => {
    if (!newGoldenSentence.trim()) return;
    setFormData({
      ...formData,
      goldenSentences: [...(formData.goldenSentences || []), newGoldenSentence.trim()],
    });
    setNewGoldenSentence('');
  };

  const handleRemoveGoldenSentence = (idx: number) => {
    setFormData({
      ...formData,
      goldenSentences: (formData.goldenSentences || []).filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.sku?.trim()) {
      alert('请填写完整产品名称和 SKU 编码');
      return;
    }
    onSave(formData as Product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-[#E8E6E1] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE7E0] flex items-center justify-between bg-[#FAF9F6]">
          <div>
            <h3 className="text-base font-semibold text-[#1F2937]">
              {isEditing ? `编辑产品信息 · ${product.name}` : '+ 添加新产品至产品管理库'}
            </h3>
            <p className="text-xs text-[#6B7280]">
              以产品为核心建立信息、画像、卖点、金句与配套练习体系
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-[#1F2937] border-b border-[#EFECE6] pb-1.5">
              1. 基础信息 (Basic Information)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#4B5563] mb-1">
                  产品名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如: Y.O.U 云感 3% 烟酰胺养肤粉底液 (Skin Tint)"
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1">
                  SKU 编码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="例如: Y.O.U CLOUD TOUCH 3% NIACINAMIDE C203"
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1">
                  所属品牌
                </label>
                <select
                  value={formData.brand || 'YOU'}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B]"
                >
                  <option value="YOU">Y.O.U (YOU)</option>
                  <option value="BNB">barenbliss (BNB)</option>
                  <option value="DM">DAZZLE ME (DM)</option>
                  <option value="LVJ">lavojoy (LVJ)</option>
                  <option value="GF">GLAMFIX (GF)</option>
                  <option value="FML">FORMULOGIC (FML)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1">产品系列</label>
                <input
                  type="text"
                  value={formData.series || ''}
                  onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                  placeholder="例如: Cloud Touch 系列"
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1">
                  类目与部位
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.category || 'MAKEUP'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B]"
                  >
                    <option value="MAKEUP">MAKEUP (彩妆)</option>
                    <option value="SKINCARE">SKINCARE (护肤)</option>
                    <option value="TOOLS">TOOLS (美妆工具)</option>
                    <option value="PERSONAL CARE">PERSONAL CARE (个护)</option>
                  </select>

                  <select
                    value={formData.subCategory || 'FACE'}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B]"
                  >
                    <option value="FACE">FACE (面部)</option>
                    <option value="LIPS">LIPS (唇部)</option>
                    <option value="EYES">EYES (眼部)</option>
                    <option value="HAIR">HAIR (头部洗护)</option>
                    <option value="BODY">BODY (身体护理)</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#4B5563] mb-1">产品简介</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="输入产品核心定位与概述..."
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Roles (Multiple Selection) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-1.5">
              <h4 className="font-semibold text-sm text-[#1F2937]">
                2. 产品角色 / 重点标识 (支持多选)
              </h4>
              <span className="text-[11px] text-[#9E4A2B]">一个产品允许配置多个角色</span>
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD]">
              {roleConfigs.map((r) => {
                const isSelected = (formData.roles || []).includes(r.name);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleToggleRole(r.name)}
                    style={{
                      backgroundColor: isSelected ? r.bgColor : '#FFFFFF',
                      color: isSelected ? r.color : '#6B7280',
                      borderColor: isSelected ? r.borderColor : '#D1D5DB',
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected ? 'font-semibold shadow-2xs' : 'hover:border-gray-400'
                    }`}
                  >
                    <span>⭐ {r.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: User Persona Tags */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-[#1F2937] border-b border-[#EFECE6] pb-1.5">
              3. 用户画像标签化归类 (Target Persona)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Target Groups */}
              <div className="bg-[#FAF9F7] p-3 rounded-lg border border-[#EAE6DD] space-y-2">
                <span className="font-semibold text-[#1F2937]">目标人群:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.persona?.targetGroups || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white text-[#374151] rounded text-[11px] border border-[#E0DBD0] flex items-center gap-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            persona: {
                              ...formData.persona!,
                              targetGroups: formData.persona!.targetGroups.filter((_, i) => i !== idx),
                            },
                          })
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newTargetGroup}
                    onChange={(e) => setNewTargetGroup(e.target.value)}
                    placeholder="+ 人群标签"
                    className="flex-1 px-2 py-1 text-xs border border-[#D6D0C4] rounded bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTargetGroup.trim()) return;
                      setFormData({
                        ...formData,
                        persona: {
                          ...formData.persona!,
                          targetGroups: [...(formData.persona?.targetGroups || []), newTargetGroup.trim()],
                        },
                      });
                      setNewTargetGroup('');
                    }}
                    className="px-2.5 py-1 bg-[#9E4A2B] text-white rounded text-xs"
                  >
                    添加
                  </button>
                </div>
              </div>

              {/* Skin Types */}
              <div className="bg-[#FAF9F7] p-3 rounded-lg border border-[#EAE6DD] space-y-2">
                <span className="font-semibold text-[#1F2937]">肤质 / 特征:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.persona?.skinTypes || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white text-[#374151] rounded text-[11px] border border-[#E0DBD0] flex items-center gap-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            persona: {
                              ...formData.persona!,
                              skinTypes: (formData.persona?.skinTypes || []).filter((_, i) => i !== idx),
                            },
                          })
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newSkinType}
                    onChange={(e) => setNewSkinType(e.target.value)}
                    placeholder="+ 肤质标签"
                    className="flex-1 px-2 py-1 text-xs border border-[#D6D0C4] rounded bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSkinType.trim()) return;
                      setFormData({
                        ...formData,
                        persona: {
                          ...formData.persona!,
                          skinTypes: [...(formData.persona?.skinTypes || []), newSkinType.trim()],
                        },
                      });
                      setNewSkinType('');
                    }}
                    className="px-2.5 py-1 bg-[#9E4A2B] text-white rounded text-xs"
                  >
                    添加
                  </button>
                </div>
              </div>

              {/* Demands */}
              <div className="bg-[#FAF9F7] p-3 rounded-lg border border-[#EAE6DD] space-y-2">
                <span className="font-semibold text-[#1F2937]">消费需求 / 功效:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.persona?.demands || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white text-[#374151] rounded text-[11px] border border-[#E0DBD0] flex items-center gap-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            persona: {
                              ...formData.persona!,
                              demands: formData.persona!.demands.filter((_, i) => i !== idx),
                            },
                          })
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newDemand}
                    onChange={(e) => setNewDemand(e.target.value)}
                    placeholder="+ 需求标签"
                    className="flex-1 px-2 py-1 text-xs border border-[#D6D0C4] rounded bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newDemand.trim()) return;
                      setFormData({
                        ...formData,
                        persona: {
                          ...formData.persona!,
                          demands: [...(formData.persona?.demands || []), newDemand.trim()],
                        },
                      });
                      setNewDemand('');
                    }}
                    className="px-2.5 py-1 bg-[#9E4A2B] text-white rounded text-xs"
                  >
                    添加
                  </button>
                </div>
              </div>

              {/* Scenarios */}
              <div className="bg-[#FAF9F7] p-3 rounded-lg border border-[#EAE6DD] space-y-2">
                <span className="font-semibold text-[#1F2937]">使用场景:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.persona?.scenarios || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white text-[#374151] rounded text-[11px] border border-[#E0DBD0] flex items-center gap-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            persona: {
                              ...formData.persona!,
                              scenarios: formData.persona!.scenarios.filter((_, i) => i !== idx),
                            },
                          })
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newScenario}
                    onChange={(e) => setNewScenario(e.target.value)}
                    placeholder="+ 场景标签"
                    className="flex-1 px-2 py-1 text-xs border border-[#D6D0C4] rounded bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newScenario.trim()) return;
                      setFormData({
                        ...formData,
                        persona: {
                          ...formData.persona!,
                          scenarios: [...(formData.persona?.scenarios || []), newScenario.trim()],
                        },
                      });
                      setNewScenario('');
                    }}
                    className="px-2.5 py-1 bg-[#9E4A2B] text-white rounded text-xs"
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Selling Points & Golden Sentences */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-[#1F2937] border-b border-[#EFECE6] pb-1.5">
              4. 产品核心卖点与销售金句
            </h4>

            {/* Selling points */}
            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                核心卖点列表 (FABE 结构)
              </label>
              <div className="space-y-1.5 mb-2">
                {(formData.sellingPoints || []).map((sp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-[#FDFCFA] rounded-lg border border-[#EAE6DD]"
                  >
                    <span className="text-[#374151]">
                      {idx + 1}. {sp}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSellingPoint(idx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSellingPoint}
                  onChange={(e) => setNewSellingPoint(e.target.value)}
                  placeholder="添加一条核心卖点，例如: 12H持久控油抗汗，妆感通透自然"
                  className="flex-1 px-3 py-1.5 text-xs border border-[#D6D0C4] rounded-lg bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddSellingPoint}
                  className="px-3 py-1.5 bg-[#9E4A2B] text-white rounded-lg text-xs"
                >
                  + 添加卖点
                </button>
              </div>
            </div>

            {/* Golden sentences */}
            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                BA 专柜销售金句 (Golden Sentences)
              </label>
              <div className="space-y-1.5 mb-2">
                {(formData.goldenSentences || []).map((gs, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-[#FDFCFA] rounded-lg border border-[#EAE6DD]"
                  >
                    <span className="text-[#9E4A2B] font-medium">{gs}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGoldenSentence(idx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoldenSentence}
                  onChange={(e) => setNewGoldenSentence(e.target.value)}
                  placeholder="添加一条专柜金句，例如: “底妆不是面具，是会呼吸的第二层原生皮肤。”"
                  className="flex-1 px-3 py-1.5 text-xs border border-[#D6D0C4] rounded-lg bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddGoldenSentence}
                  className="px-3 py-1.5 bg-[#9E4A2B] text-white rounded-lg text-xs"
                >
                  + 添加金句
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#EAE7E0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#4B5563] bg-[#EAE6DD] hover:bg-[#DDD8CC] rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              保存产品档案
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
