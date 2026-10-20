import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, Check, Sparkles } from 'lucide-react';
import { RoleConfig } from '../../types/product';

interface RoleManageModalProps {
  roles: RoleConfig[];
  isOpen: boolean;
  onClose: () => void;
  onSaveRoles: (roles: RoleConfig[]) => void;
}

const COLOR_PRESETS = [
  { color: '#B45309', bgColor: '#FEF3C7', borderColor: '#FDE68A', label: '琥珀金' },
  { color: '#C2410C', bgColor: '#FFEDD5', borderColor: '#FDBA74', label: '烈焰橙' },
  { color: '#B91C1C', bgColor: '#FEE2E2', borderColor: '#FECACA', label: '正红色' },
  { color: '#7E22CE', bgColor: '#F3E8FF', borderColor: '#E9D5FF', label: '魅力紫' },
  { color: '#047857', bgColor: '#ECFDF5', borderColor: '#A7F3D0', label: '薄荷绿' },
  { color: '#0369A1', bgColor: '#E0F2FE', borderColor: '#BAE6FD', label: '天空蓝' },
  { color: '#4338CA', bgColor: '#EEF2FF', borderColor: '#C7D2FE', label: '琉璃靛' },
  { color: '#BE185D', bgColor: '#FCE7F3', borderColor: '#FBCFE8', label: '洋红色' },
];

export const RoleManageModal: React.FC<RoleManageModalProps> = ({
  roles,
  isOpen,
  onClose,
  onSaveRoles,
}) => {
  const [roleList, setRoleList] = useState<RoleConfig[]>(roles);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  if (!isOpen) return null;

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newRoleName.trim();
    if (!trimmed) return;
    if (roleList.some((r) => r.name === trimmed)) {
      alert('已存在相同名称的角色');
      return;
    }

    const preset = COLOR_PRESETS[selectedColorIdx];
    const newRole: RoleConfig = {
      id: `role-${Date.now()}`,
      name: trimmed,
      color: preset.color,
      bgColor: preset.bgColor,
      borderColor: preset.borderColor,
      isCustom: true,
    };

    const updated = [...roleList, newRole];
    setRoleList(updated);
    setNewRoleName('');
    onSaveRoles(updated);
  };

  const handleDeleteRole = (id: string) => {
    const updated = roleList.filter((r) => r.id !== id);
    setRoleList(updated);
    onSaveRoles(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-[#E8E6E1] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE7E0] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center border border-[#FDE68A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F2937]">产品角色 / 重点标识体系</h3>
              <p className="text-xs text-[#6B7280]">支持动态扩充，适应各季度不同产品营销策略</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Current Roles List */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wide">
              当前启用的产品角色 (支持多选打标)
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD] min-h-[80px]">
              {roleList.map((r) => (
                <div
                  key={r.id}
                  style={{
                    backgroundColor: r.bgColor,
                    color: r.color,
                    borderColor: r.borderColor,
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-2xs group"
                >
                  <span>⭐ {r.name}</span>
                  {r.isCustom && (
                    <button
                      onClick={() => handleDeleteRole(r.id)}
                      className="opacity-50 hover:opacity-100 transition-opacity ml-1"
                      title="删除此自定义角色"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Custom Role Form */}
          <form onSubmit={handleAddRole} className="p-4 bg-white rounded-xl border border-[#E5E1D8] space-y-3">
            <div className="text-xs font-semibold text-[#1F2937] flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#9E4A2B]" />
              <span>新增产品角色 (如: 新品、战略品、季节主推、区域重点)</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="输入角色名称，例如: 战略品"
                className="flex-1 px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] focus:ring-1 focus:ring-[#9E4A2B] bg-[#FDFCFA]"
              />
              <button
                type="submit"
                disabled={!newRoleName.trim()}
                className="px-4 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] disabled:bg-gray-300 text-white text-xs font-medium rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                + 添加角色
              </button>
            </div>

            {/* Color Palette Selection */}
            <div>
              <div className="text-[11px] text-[#6B7280] mb-1.5">选择标识配色方案:</div>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    style={{ backgroundColor: p.bgColor, borderColor: p.borderColor }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform ${
                      selectedColorIdx === idx ? 'scale-115 ring-2 ring-[#9E4A2B]' : 'hover:scale-105'
                    }`}
                  >
                    {selectedColorIdx === idx && (
                      <Check className="w-3 h-3" style={{ color: p.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Business Tip */}
          <div className="bg-[#F8F7F4] p-3 rounded-lg text-xs text-[#6B7280] border border-[#E8E4DA] leading-relaxed">
            <span className="font-semibold text-[#1F2937]">💡 系统设计规则：</span>
            一个产品允许拥有多个角色（例如：
            <span className="text-[#9E4A2B] font-semibold">【⭐ 大单品】+【⭐ 主推品】</span>
            ）。角色可随时调整，后续可直接用于列表筛选、任务分发与 AI 智能推荐策略。
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF9F6] border-t border-[#EAE7E0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
          >
            完成并保存
          </button>
        </div>
      </div>
    </div>
  );
};
