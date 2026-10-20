import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Sparkles,
  BookOpen,
  Headphones,
  GraduationCap,
  ChevronRight,
  ExternalLink,
  Tag,
  Star,
  Layers,
  SendHorizontal,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { Product, RoleConfig } from '../../types/product';
import { AssetTabType } from './AssetDetailModal';

interface ProductListProps {
  products: Product[];
  roleConfigs: RoleConfig[];
  onSelectProduct: (product: Product) => void;
  onOpenAssetModal: (product: Product, tab: AssetTabType) => void;
  onAddNewProduct: () => void;
  onOpenRoleManage: () => void;
  onOpenTaskPublish?: (product: Product) => void;
  onOpenAIRecommendations?: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  roleConfigs,
  onSelectProduct,
  onOpenAssetModal,
  onAddNewProduct,
  onOpenRoleManage,
}) => {
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('全部');
  const [categoryFilter, setCategoryFilter] = useState<string>('全部');
  const [roleFilter, setRoleFilter] = useState<string>('全部');
  const [statusFilter, setStatusFilter] = useState<string>('全部');

  const topRoles = ['全部', '大单品', '激励品', '主推品', '重点品', '连带品'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchSku = p.sku.toLowerCase().includes(query);
        const matchSpu = p.spu.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchSpu && !matchBrand) return false;
      }

      // Role Filter (selected at top or from dropdown)
      if (roleFilter !== '全部' && !p.roles.includes(roleFilter)) return false;

      // Brand
      if (brandFilter !== '全部' && p.brand !== brandFilter) return false;

      // Category
      if (categoryFilter !== '全部' && p.category !== categoryFilter) return false;

      // Status
      if (statusFilter !== '全部' && p.status !== statusFilter) return false;

      return true;
    });
  }, [products, searchQuery, roleFilter, brandFilter, categoryFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setBrandFilter('全部');
    setCategoryFilter('全部');
    setRoleFilter('全部');
    setStatusFilter('全部');
  };

  return (
    <div className="space-y-5">
      {/* Top Header Section matching Section 4.2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">产品管理</h1>
            <span className="text-xs bg-[#FAF3F0] text-[#9E4A2B] px-3 py-0.5 rounded-full font-bold border border-[#FDBA74]/70 shadow-2xs">
              共计 {products.length} 款产品
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            当前产品库收录完整产品档案与配套培训资产
            {filteredProducts.length !== products.length && (
              <span className="text-[#9E4A2B] font-medium ml-1.5">
                （当前筛选显示 <strong>{filteredProducts.length}</strong> 款）
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenRoleManage}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F9F8F6] text-[#374151] text-xs font-medium rounded-lg border border-[#D6D0C4] transition-colors shadow-2xs cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>角色标识管理</span>
          </button>

          <button
            onClick={onAddNewProduct}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ 添加产品</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E6E1] shadow-2xs space-y-3">
        {/* Quick Filter Tabs & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Quick Role Segment Filter: 全部 | 大单品 | 激励品 | 主推品 | 重点品 | 连带品 */}
          <div className="flex items-center gap-1 bg-[#F4F1EA] p-1 rounded-lg border border-[#E5E1D8] flex-wrap">
            {topRoles.map((role) => {
              const count =
                role === '全部'
                  ? products.length
                  : products.filter((p) => p.roles.includes(role)).length;
              const isSelected = roleFilter === role;

              return (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-[#9E4A2B] shadow-2xs font-semibold'
                      : 'text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  <span>
                    {role === '大单品'
                      ? '⭐ 大单品'
                      : role === '激励品'
                      ? '💎 激励品'
                      : role === '主推品'
                      ? '🔥 主推品'
                      : role}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-[#9E4A2B]/10 text-[#9E4A2B]'
                        : 'bg-black/5 text-[#78716C]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索产品名称 / SKU 编码 / 品牌..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-[#D6D0C4] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-[#9E4A2B] focus:ring-1 focus:ring-[#9E4A2B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="pt-2 border-t border-[#F0ECE4] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Brand Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[#6B7280]">品牌:</span>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="px-2 py-1 border border-[#D6D0C4] rounded-md bg-[#FDFCFA] text-[#374151]"
              >
                <option value="全部">全部品牌</option>
                <option value="YOU">Y.O.U (YOU)</option>
                <option value="BNB">barenbliss (BNB)</option>
                <option value="DM">DAZZLE ME (DM)</option>
                <option value="LVJ">lavojoy (LVJ)</option>
                <option value="GF">GLAMFIX (GF)</option>
                <option value="FML">FORMULOGIC (FML)</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[#6B7280]">品类:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 border border-[#D6D0C4] rounded-md bg-[#FDFCFA] text-[#374151]"
              >
                <option value="全部">全部品类</option>
                <option value="MAKEUP">MAKEUP (彩妆)</option>
                <option value="SKINCARE">SKINCARE (护肤)</option>
                <option value="TOOLS">TOOLS (美妆工具)</option>
                <option value="PERSONAL CARE">PERSONAL CARE (个护)</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[#6B7280]">产品角色:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-2 py-1 border border-[#D6D0C4] rounded-md bg-[#FDFCFA] text-[#374151]"
              >
                <option value="全部">全部角色</option>
                {roleConfigs.map((r) => (
                  <option key={r.id} value={r.name}>
                    ⭐ {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[#6B7280]">状态:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 border border-[#D6D0C4] rounded-md bg-[#FDFCFA] text-[#374151]"
              >
                <option value="全部">全部状态</option>
                <option value="当期主推">当期主推</option>
                <option value="在售">在售</option>
                <option value="新品预热">新品预热</option>
                <option value="下架停售">下架停售</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs text-[#9E4A2B] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置筛选</span>
          </button>
        </div>
      </div>

      {/* Product List Table (Section 6 & 6.1) */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF9F6] border-b border-[#EAE7E0] text-[#6B7280] font-medium">
            <tr>
              <th className="py-3 px-4 w-12 text-center">图示</th>
              <th className="py-3 px-4 min-w-[240px]">产品名称 / SKU</th>
              <th className="py-3 px-4 min-w-[140px]">品牌 / 系列</th>
              <th className="py-3 px-4 min-w-[180px]">产品角色 / 重点标识</th>
              <th className="py-3 px-4 text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1" title="关联的已有学习/课件任务">
                  <BookOpen className="w-3.5 h-3.5 text-[#9E4A2B]" />
                  <span>学习</span>
                </div>
              </th>
              <th className="py-3 px-4 text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1" title="关联的已有实战练习任务（数字人/场景/金句）">
                  <Headphones className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>练习</span>
                </div>
              </th>
              <th className="py-3 px-4 text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1" title="关联考试的全国平均分">
                  <GraduationCap className="w-3.5 h-3.5 text-[#059669]" />
                  <span>考试</span>
                </div>
              </th>
              <th className="py-3 px-4 text-right min-w-[120px]">档案详情</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFECE6] text-[#374151]">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#9CA3AF]">
                  未找到符合筛选条件的产品，请调整筛选或
                  <button onClick={handleResetFilters} className="text-[#9E4A2B] ml-1 underline">
                    重置所有筛选
                  </button>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="hover:bg-[#F9F7F3] active:bg-[#F4EFE6] transition-colors group cursor-pointer"
                    title={`点击进入《${p.name}》产品档案与配套培训`}
                  >
                    {/* 1. Thumbnail Image */}
                    <td className="py-3 px-4 text-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E5E1D8] bg-[#F7F6F2] mx-auto shadow-2xs">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </td>

                    {/* 2. Product Name & SKU */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-xs text-[#111827] group-hover:text-[#9E4A2B] transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-[#78716C] font-mono mt-0.5 truncate max-w-sm">
                        {p.sku}
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">
                        {p.category} · {p.subCategory}
                      </div>
                    </td>

                    {/* 3. Brand & Series */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1F2937] text-xs flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-[#F4F1EA] rounded text-[11px] text-[#6B7280] border border-[#E5E1D8]">
                          {p.brand}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B7280] mt-0.5 truncate max-w-[150px]">
                        {p.series}
                      </div>
                    </td>

                  {/* 4. Roles / Multiple Roles (Section 5) */}
                  {(() => {
                    const studyUsage = p.studyAssets && p.studyAssets.length > 0
                      ? p.studyAssets.reduce((s, a) => s + (a.usageCount || 0), 0)
                      : p.studyCount;
                    const practiceUsage = p.practiceAssets && p.practiceAssets.length > 0
                      ? p.practiceAssets.reduce((s, a) => s + (a.usageCount || 0), 0)
                      : p.practiceCount;
                    const examAvg = p.examAssets && p.examAssets.length > 0
                      ? Math.round(p.examAssets.reduce((s, a) => s + (a.averageScore || 0), 0) / p.examAssets.length)
                      : p.examAvgScore;

                    return (
                      <>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 items-center">
                            {p.roles.map((roleName, rIdx) => {
                              const cfg = roleConfigs.find((c) => c.name === roleName);
                              return (
                                <span
                                  key={rIdx}
                                  style={{
                                    backgroundColor: cfg?.bgColor || '#FEF3C7',
                                    color: cfg?.color || '#B45309',
                                    borderColor: cfg?.borderColor || '#FDE68A',
                                  }}
                                  className="px-2 py-0.5 rounded text-[11px] font-semibold border shadow-2xs"
                                >
                                  ⭐{roleName}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* 5. 学习 */}
                        <td className="py-3 px-4 text-center">
                          {studyUsage > 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAssetModal(p, 'study');
                              }}
                              className="font-bold text-[#9E4A2B] hover:underline cursor-pointer font-mono tabular-nums text-xs px-2 py-1 rounded hover:bg-[#FEF5F0] transition-colors"
                              title="点击查看该产品关联的课件与使用记录"
                            >
                              学习 {studyUsage}次
                            </button>
                          ) : (
                            <span className="text-[#9CA3AF] font-bold">—</span>
                          )}
                        </td>

                        {/* 6. 练习 */}
                        <td className="py-3 px-4 text-center">
                          {practiceUsage > 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAssetModal(p, 'practice');
                              }}
                              className="font-bold text-[#4F46E5] hover:underline cursor-pointer font-mono tabular-nums text-xs px-2 py-1 rounded hover:bg-[#EEF2FF] transition-colors"
                              title="点击查看该产品关联的数字人、场景对话和金句练习"
                            >
                              练习 {practiceUsage}次
                            </button>
                          ) : (
                            <span className="text-[#9CA3AF] font-bold">—</span>
                          )}
                        </td>

                        {/* 7. 考试 */}
                        <td className="py-3 px-4 text-center">
                          {examAvg !== null ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAssetModal(p, 'exam');
                              }}
                              className="font-bold text-[#059669] hover:underline cursor-pointer font-mono tabular-nums text-xs px-2 py-1 rounded hover:bg-[#ECFDF5] transition-colors"
                              title="点击查看该产品关联的考试试卷与平均分"
                            >
                              {examAvg}分
                            </button>
                          ) : (
                            <span className="text-[#9CA3AF] font-bold">—</span>
                          )}
                        </td>
                      </>
                    );
                  })()}

                    {/* 8. Actions (Entire row navigates, button reinforces entry) */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#9E4A2B] bg-[#FFF7ED] group-hover:bg-[#9E4A2B] group-hover:text-white rounded-md transition-colors font-medium border border-[#FED7AA]/70 group-hover:border-[#9E4A2B] shadow-2xs">
                          <span>查看档案</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table Footer with Summary */}
        <div className="px-6 py-3.5 bg-[#FAF9F6] border-t border-[#EAE7E0] flex items-center justify-between text-xs text-[#6B7280]">
          <div>
            显示 <span className="font-semibold text-[#1F2937]">{filteredProducts.length}</span> / {products.length} 个产品
            {roleFilter !== '全部' && ` · 角色筛选: ${roleFilter}`}
          </div>
          <div className="text-[11px] text-[#78716C]">
            💡 交互提示：点击产品列表整行任意区域均可直接进入产品档案；点击“学习 / 练习 / 考试”数据可穿透查看关联课件与试卷。
          </div>
        </div>
      </div>
    </div>
  );
};
