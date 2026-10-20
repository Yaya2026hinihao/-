import React, { useState } from 'react';
import { TagDimensionConfig } from '../../types/sparring';
import { X, Plus, Trash2, Check, Settings2, Sliders, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';

interface TagDimensionManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  dimensions: TagDimensionConfig[];
  onSaveDimensions: (updated: TagDimensionConfig[]) => void;
}

export const TagDimensionManageModal: React.FC<TagDimensionManageModalProps> = ({
  isOpen,
  onClose,
  dimensions,
  onSaveDimensions,
}) => {
  const [localDims, setLocalDims] = useState<TagDimensionConfig[]>(dimensions);
  const [selectedDimId, setSelectedDimId] = useState<string>(dimensions[0]?.id || '');
  const [newOptionText, setNewOptionText] = useState('');
  const [isAddingDimension, setIsAddingDimension] = useState(false);
  const [newDimForm, setNewDimForm] = useState({
    name: '',
    assetTarget: 'all' as 'all' | 'digital_human' | 'scenario_script',
    applicableCategory: 'ALL' as 'ALL' | 'MAKEUP' | 'SKINCARE' | 'HAIR' | 'BODY',
    selectionType: 'multiple' as 'single' | 'multiple',
    description: '',
  });

  if (!isOpen) return null;

  const currentDim = localDims.find((d) => d.id === selectedDimId) || localDims[0];

  const handleAddOption = () => {
    if (!newOptionText.trim() || !currentDim) return;
    const trimmed = newOptionText.trim();
    if (currentDim.options.includes(trimmed)) return;

    setLocalDims((prev) =>
      prev.map((d) =>
        d.id === currentDim.id ? { ...d, options: [...d.options, trimmed] } : d
      )
    );
    setNewOptionText('');
  };

  const handleRemoveOption = (optToRemove: string) => {
    if (!currentDim) return;
    setLocalDims((prev) =>
      prev.map((d) =>
        d.id === currentDim.id
          ? { ...d, options: d.options.filter((o) => o !== optToRemove) }
          : d
      )
    );
  };

  const handleToggleDimEnabled = (dimId: string) => {
    setLocalDims((prev) =>
      prev.map((d) => (d.id === dimId ? { ...d, isEnabled: !d.isEnabled } : d))
    );
  };

  const handleToggleSelectionType = (dimId: string) => {
    setLocalDims((prev) =>
      prev.map((d) =>
        d.id === dimId
          ? { ...d, selectionType: d.selectionType === 'single' ? 'multiple' : 'single' }
          : d
      )
    );
  };

  const handleCreateDimension = () => {
    if (!newDimForm.name.trim()) return;
    const newDim: TagDimensionConfig = {
      id: `dim-custom-${Date.now()}`,
      name: newDimForm.name.trim(),
      assetTarget: newDimForm.assetTarget,
      applicableCategory: newDimForm.applicableCategory,
      options: ['选项一', '选项二'],
      selectionType: newDimForm.selectionType,
      isEnabled: true,
      order: localDims.length + 1,
      description: newDimForm.description.trim() || '自定义业务维度',
    };
    setLocalDims((prev) => [...prev, newDim]);
    setSelectedDimId(newDim.id);
    setIsAddingDimension(false);
    setNewDimForm({
      name: '',
      assetTarget: 'all',
      applicableCategory: 'ALL',
      selectionType: 'multiple',
      description: '',
    });
  };

  const handleSaveAndClose = () => {
    onSaveDimensions(localDims);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#EAE6DD]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE6DD] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#9E4A2B]/10 flex items-center justify-center text-[#9E4A2B]">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                <span>统一标签维度配置中心</span>
                <span className="text-[10px] bg-[#9E4A2B] text-white px-2 py-0.5 rounded-full font-medium">
                  可配置 / 非硬编码
                </span>
              </h2>
              <p className="text-xs text-[#6B7280]">
                维护数字人顾客与场景剧本的分类标签体系，支持新增维度、拓展选项及按品类自适应
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Dimensions List, Right Options Detail */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#EAE6DD]">
          {/* Left: Dimensions List */}
          <div className="w-full md:w-72 bg-[#FAF8F5]/60 p-4 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DD]/70">
              <span className="text-xs font-semibold text-[#1F2937]">已有维度 ({localDims.length})</span>
              <button
                onClick={() => setIsAddingDimension(true)}
                className="text-xs text-[#9E4A2B] hover:text-[#7C2D12] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增维度</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {localDims.map((dim) => {
                const isSelected = dim.id === currentDim?.id && !isAddingDimension;
                return (
                  <div
                    key={dim.id}
                    onClick={() => {
                      setSelectedDimId(dim.id);
                      setIsAddingDimension(false);
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-all border text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-[#9E4A2B] shadow-xs text-[#1F2937] font-semibold'
                        : 'bg-white/70 border-transparent hover:bg-white hover:border-[#D6D0C4] text-[#4B5563]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{dim.name}</span>
                        {!dim.isEnabled && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                            已停用
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">
                        {dim.options.length} 个选项 · {dim.selectionType === 'single' ? '单选' : '多选'}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                        dim.applicableCategory === 'ALL'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {dim.applicableCategory === 'ALL' ? '通用' : dim.applicableCategory}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dimension Detail or Create Dimension Form */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {isAddingDimension ? (
              <div className="space-y-5 max-w-xl">
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937]">新建标签维度</h3>
                  <p className="text-xs text-[#6B7280]">
                    添加后可在数字人画像或场景剧本中按此维度进行标签打标与推荐筛选
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-[#374151] mb-1">维度名称 *</label>
                    <input
                      type="text"
                      placeholder="如：消费客单档位 / 购买季节动机"
                      value={newDimForm.name}
                      onChange={(e) => setNewDimForm({ ...newDimForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#374151] mb-1">适用资产类型</label>
                      <select
                        value={newDimForm.assetTarget}
                        onChange={(e) =>
                          setNewDimForm({
                            ...newDimForm,
                            assetTarget: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border border-[#D6D0C4] rounded-lg bg-white"
                      >
                        <option value="all">两者通用 (数字人 + 剧本)</option>
                        <option value="digital_human">仅数字人顾客</option>
                        <option value="scenario_script">仅场景剧本</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#374151] mb-1">适用品类</label>
                      <select
                        value={newDimForm.applicableCategory}
                        onChange={(e) =>
                          setNewDimForm({
                            ...newDimForm,
                            applicableCategory: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border border-[#D6D0C4] rounded-lg bg-white"
                      >
                        <option value="ALL">全品类通用</option>
                        <option value="MAKEUP">彩妆品类</option>
                        <option value="SKINCARE">护肤品类</option>
                        <option value="HAIR">洗发护发</option>
                        <option value="BODY">身体护理</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#374151] mb-1">单选 / 多选设置</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="selType"
                          checked={newDimForm.selectionType === 'multiple'}
                          onChange={() => setNewDimForm({ ...newDimForm, selectionType: 'multiple' })}
                        />
                        <span>支持多选 (推荐)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="selType"
                          checked={newDimForm.selectionType === 'single'}
                          onChange={() => setNewDimForm({ ...newDimForm, selectionType: 'single' })}
                        />
                        <span>仅单选</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#374151] mb-1">维度说明</label>
                    <input
                      type="text"
                      placeholder="简述该维度在对练场景中的业务用途"
                      value={newDimForm.description}
                      onChange={(e) => setNewDimForm({ ...newDimForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleCreateDimension}
                    className="px-4 py-2 bg-[#9E4A2B] text-white rounded-lg text-xs font-semibold hover:bg-[#853C21] transition-colors"
                  >
                    创建该维度
                  </button>
                  <button
                    onClick={() => setIsAddingDimension(false)}
                    className="px-4 py-2 bg-gray-100 text-[#4B5563] rounded-lg text-xs font-medium hover:bg-gray-200"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : currentDim ? (
              <div className="space-y-6">
                {/* Dimension Property Card */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE6DD] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#1F2937]">{currentDim.name}</h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {currentDim.description || '支持动态管理选项值'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleSelectionType(currentDim.id)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-[#D6D0C4] bg-white text-[#374151] hover:border-[#9E4A2B]"
                      >
                        当前模式: <strong>{currentDim.selectionType === 'single' ? '单选' : '多选'}</strong> (点击切换)
                      </button>
                      <button
                        onClick={() => handleToggleDimEnabled(currentDim.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                          currentDim.isEnabled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {currentDim.isEnabled ? '已启用状态' : '已停用'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-[#EAE6DD]/70">
                    <div>
                      <span className="text-[#9CA3AF]">适用资产: </span>
                      <span className="font-semibold text-[#1F2937]">
                        {currentDim.assetTarget === 'all'
                          ? '通用 (数字人+剧本)'
                          : currentDim.assetTarget === 'digital_human'
                          ? '数字人顾客'
                          : '场景剧本'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#9CA3AF]">适用品类: </span>
                      <span className="font-semibold text-[#1F2937]">
                        {currentDim.applicableCategory === 'ALL'
                          ? '全品类自适应'
                          : `${currentDim.applicableCategory} 专属`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#9CA3AF]">选项总数: </span>
                      <span className="font-semibold text-[#9E4A2B]">{currentDim.options.length} 个</span>
                    </div>
                  </div>
                </div>

                {/* Options Management */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1F2937]">
                      可选用标签选项列表 ({currentDim.options.length})
                    </label>
                    <span className="text-[11px] text-[#9CA3AF]">点击选项右侧垃圾桶可移除</span>
                  </div>

                  {/* Add Option Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`在【${currentDim.name}】中新增选项，如：...`}
                      value={newOptionText}
                      onChange={(e) => setNewOptionText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOption();
                        }
                      }}
                      className="flex-1 px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="px-4 py-2 bg-[#9E4A2B] text-white rounded-lg text-xs font-semibold hover:bg-[#853C21] transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>添加选项</span>
                    </button>
                  </div>

                  {/* Options Chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentDim.options.map((opt) => (
                      <div
                        key={opt}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE6DD] bg-[#FAF8F5] text-xs text-[#1F2937] hover:border-[#9E4A2B] transition-all"
                      >
                        <span className="font-medium">{opt}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(opt)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="删除选项"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>数据安全与历史兼容承诺：</strong>
                      修改或停用选项不会影响已有资产的展示与任务记录，已选用的旧标签将无损保留。新添加的选项即刻在数字人与剧本配置界面生效。
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EAE6DD] bg-[#FAF8F5] flex items-center justify-between">
          <div className="text-xs text-[#6B7280]">
            配置变更将同步更新系统多维画像与筛选算法
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#4B5563] hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSaveAndClose}
              className="px-5 py-2 text-xs font-semibold bg-[#9E4A2B] text-white rounded-lg shadow-sm hover:bg-[#853C21] transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>保存配置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
