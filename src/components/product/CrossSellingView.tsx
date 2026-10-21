import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Package,
  ArrowRight,
  Sparkles,
  Info,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Product } from '../../types/product';
import { ProductCombination, ScenarioScriptItem } from '../../types/sparring';

interface CrossSellingViewProps {
  allProducts: Product[];
  combinations: ProductCombination[];
  scenarioScripts: ScenarioScriptItem[];
  onSaveCombination: (combo: ProductCombination) => void;
  onDeleteCombination: (comboId: string) => void;
  onNavigateToProduct?: (product: Product) => void;
  onNavigateToScript?: (scriptId: string) => void;
  onCreateScriptForCombo?: (combo: ProductCombination) => void;
}

export const CrossSellingView: React.FC<CrossSellingViewProps> = ({
  allProducts,
  combinations,
  scenarioScripts,
  onSaveCombination,
  onDeleteCombination,
  onNavigateToProduct,
  onNavigateToScript,
  onCreateScriptForCombo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [scriptStatusFilter, setScriptStatusFilter] = useState<'ALL' | 'HAS_SCRIPT' | 'NO_SCRIPT'>('ALL');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<ProductCombination | null>(null);

  // Form states
  const [formMainProductId, setFormMainProductId] = useState('');
  const [formCrossProductIds, setFormCrossProductIds] = useState<string[]>([]);
  const [formComboName, setFormComboName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [productSearchKeyword, setProductSearchKeyword] = useState('');

  // Delete & Impact confirmation
  const [comboToDelete, setComboToDelete] = useState<ProductCombination | null>(null);
  const [impactWarning, setImpactWarning] = useState<{
    show: boolean;
    pendingCombo: ProductCombination | null;
    affectedScriptsCount: number;
  }>({
    show: false,
    pendingCombo: null,
    affectedScriptsCount: 0,
  });

  // Calculate linked scripts map
  const linkedScriptsMap = useMemo(() => {
    const map = new Map<string, ScenarioScriptItem[]>();
    combinations.forEach((c) => {
      const scripts = scenarioScripts.filter(
        (sc) =>
          sc.linkedCombination?.combinationId === c.id ||
          (sc.linkedCombination?.mainProductId === c.mainProductId &&
            sc.linkedCombination?.crossSellingProductIds?.length === c.crossSellingProductIds.length &&
            sc.linkedCombination?.crossSellingProductIds.every((id) =>
              c.crossSellingProductIds.includes(id)
            ))
      );
      map.set(c.id, scripts);
    });
    return map;
  }, [combinations, scenarioScripts]);

  // Unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [allProducts]);

  // Filtered combinations
  const filteredCombinations = useMemo(() => {
    return combinations.filter((c) => {
      const mainProd = allProducts.find((p) => p.id === c.mainProductId);
      const crossProds = c.crossSellingProductIds
        .map((id) => allProducts.find((p) => p.id === id))
        .filter(Boolean) as Product[];

      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mainProd && mainProd.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        crossProds.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (brandFilter !== 'ALL') {
        const matchesBrand =
          (mainProd && mainProd.brand === brandFilter) ||
          crossProds.some((p) => p.brand === brandFilter);
        if (!matchesBrand) return false;
      }

      const scripts = linkedScriptsMap.get(c.id) || [];
      if (scriptStatusFilter === 'HAS_SCRIPT' && scripts.length === 0) return false;
      if (scriptStatusFilter === 'NO_SCRIPT' && scripts.length > 0) return false;

      return true;
    });
  }, [combinations, allProducts, searchQuery, brandFilter, scriptStatusFilter, linkedScriptsMap]);

  // Summary counts
  const stats = useMemo(() => {
    const mainProdIds = new Set(combinations.map((c) => c.mainProductId));
    const crossProdIds = new Set(combinations.flatMap((c) => c.crossSellingProductIds));
    let totalLinkedScripts = 0;
    linkedScriptsMap.forEach((scripts) => {
      totalLinkedScripts += scripts.length;
    });
    return {
      comboCount: combinations.length,
      mainCount: mainProdIds.size,
      crossCount: crossProdIds.size,
      scriptCount: totalLinkedScripts,
    };
  }, [combinations, linkedScriptsMap]);

  // Open create modal
  const handleOpenCreateModal = () => {
    const firstMain = allProducts[0]?.id || '';
    const firstCross = allProducts.filter((p) => p.id !== firstMain)[0]?.id;
    setEditingCombo(null);
    setFormMainProductId(firstMain);
    setFormCrossProductIds(firstCross ? [firstCross] : []);
    const mainP = allProducts.find((p) => p.id === firstMain);
    const crossP = allProducts.find((p) => p.id === firstCross);
    setFormComboName(
      mainP && crossP
        ? `【${mainP.brand || '组合'}】${mainP.name.split(' ')[0]} + ${crossP.name.split(' ')[0]} 连带销售组合`
        : '新连带销售产品组合'
    );
    setFormDescription('针对专柜核心客流，以主推品打底，顺势引导搭配连带品，提高客单价与连带率。');
    setProductSearchKeyword('');
    setIsEditModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (combo: ProductCombination) => {
    setEditingCombo(combo);
    setFormMainProductId(combo.mainProductId);
    setFormCrossProductIds([...combo.crossSellingProductIds]);
    setFormComboName(combo.name);
    setFormDescription(combo.description || '');
    setProductSearchKeyword('');
    setIsEditModalOpen(true);
  };

  // Handle main product change in modal
  const handleSelectMainProduct = (productId: string) => {
    setFormMainProductId(productId);
    // Remove from cross-selling if was selected as cross
    const updatedCross = formCrossProductIds.filter((id) => id !== productId);
    setFormCrossProductIds(updatedCross);

    // Auto-update combo name if default pattern
    if (!editingCombo) {
      const mainP = allProducts.find((p) => p.id === productId);
      const crossP = allProducts.find((p) => p.id === updatedCross[0]);
      if (mainP) {
        setFormComboName(
          `【${mainP.brand || '组合'}】${mainP.name.split(' ')[0]}${
            crossP ? ` + ${crossP.name.split(' ')[0]}` : ''
          } 连带销售组合`
        );
      }
    }
  };

  // Toggle cross-selling product
  const handleToggleCrossProduct = (productId: string) => {
    if (productId === formMainProductId) return; // Cannot be main product
    if (formCrossProductIds.includes(productId)) {
      setFormCrossProductIds(formCrossProductIds.filter((id) => id !== productId));
    } else {
      setFormCrossProductIds([...formCrossProductIds, productId]);
    }
  };

  // Save combination
  const handleSaveModal = () => {
    if (!formMainProductId) {
      alert('请选择主推品');
      return;
    }
    if (formCrossProductIds.length === 0) {
      alert('请至少选择一个连带品');
      return;
    }
    if (!formComboName.trim()) {
      alert('请输入组合名称');
      return;
    }

    const payload: ProductCombination = {
      id: editingCombo ? editingCombo.id : `combo-${Date.now()}`,
      name: formComboName.trim(),
      mainProductId: formMainProductId,
      crossSellingProductIds: formCrossProductIds,
      description: formDescription.trim(),
      isConfirmed: true,
      updatedAt: new Date().toISOString().split('T')[0],
      createdAt: editingCombo?.createdAt || new Date().toISOString().split('T')[0],
    };

    // If editing existing combination, check if product pairings changed and impact warning is needed
    if (editingCombo) {
      const hasProductsChanged =
        editingCombo.mainProductId !== payload.mainProductId ||
        editingCombo.crossSellingProductIds.length !== payload.crossSellingProductIds.length ||
        !editingCombo.crossSellingProductIds.every((id) =>
          payload.crossSellingProductIds.includes(id)
        );

      const affectedScripts = linkedScriptsMap.get(editingCombo.id) || [];
      if (hasProductsChanged && affectedScripts.length > 0) {
        setImpactWarning({
          show: true,
          pendingCombo: payload,
          affectedScriptsCount: affectedScripts.length,
        });
        return;
      }
    }

    onSaveCombination(payload);
    setIsEditModalOpen(false);
  };

  // Confirm impact save
  const handleConfirmImpactSave = () => {
    if (impactWarning.pendingCombo) {
      onSaveCombination(impactWarning.pendingCombo);
    }
    setImpactWarning({ show: false, pendingCombo: null, affectedScriptsCount: 0 });
    setIsEditModalOpen(false);
  };

  // Execute delete combination
  const handleConfirmDelete = () => {
    if (comboToDelete) {
      onDeleteCombination(comboToDelete.id);
      setComboToDelete(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF9F7] overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-[#EAE7E0] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF7F2] border border-[#FDBA74] flex items-center justify-center text-[#9E4A2B] shadow-2xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#1F2937]">连带销售组合管理</h1>
              <span className="text-[11px] bg-[#9E4A2B]/10 text-[#9E4A2B] px-2 py-0.5 rounded-full font-semibold border border-[#9E4A2B]/20">
                主推品 ➔ 连带品销售拓扑
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              维护产品间搭配销售组合，为专柜销售与 AI 场景剧本对练提供搭配依据（剧本支持自由搭配，已配组合支持一键引用）
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-[#9E4A2B] hover:bg-[#853C21] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>新建组合</span>
        </button>
      </div>

      {/* ================= STATS & OVERVIEW BAR ================= */}
      <div className="bg-white border-b border-[#EAE7E0] px-6 py-3 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE6DD] flex items-center justify-between">
            <div>
              <span className="text-[#6B7280] block text-[11px]">正式销售组合</span>
              <span className="text-base font-bold text-[#1F2937]">{stats.comboCount} <span className="text-xs font-normal text-gray-500">组</span></span>
            </div>
            <Layers className="w-5 h-5 text-[#9E4A2B]" />
          </div>

          <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE6DD] flex items-center justify-between">
            <div>
              <span className="text-[#6B7280] block text-[11px]">覆盖主推品</span>
              <span className="text-base font-bold text-[#C2410C]">{stats.mainCount} <span className="text-xs font-normal text-gray-500">款</span></span>
            </div>
            <Package className="w-5 h-5 text-[#C2410C]" />
          </div>

          <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE6DD] flex items-center justify-between">
            <div>
              <span className="text-[#6B7280] block text-[11px]">覆盖连带品</span>
              <span className="text-base font-bold text-[#047857]">{stats.crossCount} <span className="text-xs font-normal text-gray-500">款</span></span>
            </div>
            <Sparkles className="w-5 h-5 text-[#047857]" />
          </div>

          <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE6DD] flex items-center justify-between">
            <div>
              <span className="text-[#6B7280] block text-[11px]">已关联场景剧本</span>
              <span className="text-base font-bold text-[#4338CA]">{stats.scriptCount} <span className="text-xs font-normal text-gray-500">篇</span></span>
            </div>
            <FileText className="w-5 h-5 text-[#4338CA]" />
          </div>
        </div>
      </div>

      {/* ================= SEARCH & FILTER ================= */}
      <div className="bg-[#FAF8F5] px-6 py-3 border-b border-[#EAE7E0] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜索组合名称、主推品或连带品名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B]"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              清除
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#D6D0C4] rounded-lg focus:outline-none text-[#4B5563]"
          >
            <option value="ALL">全部品牌</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={scriptStatusFilter}
            onChange={(e) => setScriptStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#D6D0C4] rounded-lg focus:outline-none text-[#4B5563]"
          >
            <option value="ALL">全部剧本关联状态</option>
            <option value="HAS_SCRIPT">已关联场景剧本</option>
            <option value="NO_SCRIPT">待配置场景剧本</option>
          </select>
        </div>
      </div>

      {/* ================= COMBINATION CARDS LIST ================= */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
        {filteredCombinations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#D6D0C4]">
            <Layers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-600">未找到匹配的产品组合</p>
            <p className="text-[11px] text-gray-400 mt-1">您可以尝试调整搜索关键词或新建产品组合</p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-3 py-1.5 bg-[#9E4A2B] text-white rounded-lg text-xs font-medium hover:bg-[#853C21] transition-colors cursor-pointer"
            >
              + 新建产品组合
            </button>
          </div>
        ) : (
          filteredCombinations.map((combo) => {
            const mainProd = allProducts.find((p) => p.id === combo.mainProductId);
            const crossProds = combo.crossSellingProductIds
              .map((id) => allProducts.find((p) => p.id === id))
              .filter(Boolean) as Product[];
            const linkedScripts = linkedScriptsMap.get(combo.id) || [];

            return (
              <div
                key={combo.id}
                className="bg-white rounded-xl border border-[#EAE6DD] hover:border-[#D6D0C4] p-5 shadow-2xs transition-all space-y-4"
              >
                {/* Header row: Name, status badge, action buttons */}
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#F0ECE3]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-[#1F2937]">{combo.name}</h3>
                      {linkedScripts.length > 0 ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          已关联 {linkedScripts.length} 篇剧本
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          待配置场景剧本
                        </span>
                      )}
                    </div>
                    {combo.description && (
                      <p className="text-xs text-[#6B7280] leading-relaxed">
                        搭配策略：{combo.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(combo)}
                      className="px-3 py-1.5 text-xs font-medium text-[#4B5563] bg-[#FAF8F5] hover:bg-[#F3F0E8] border border-[#D6D0C4] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                      <span>编辑</span>
                    </button>
                    <button
                      onClick={() => setComboToDelete(combo)}
                      className="px-2 py-1.5 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="删除组合"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Topology Display: Main Product -> Cross-selling Products */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Left: Main Product (5 cols) */}
                  <div className="lg:col-span-5 bg-[#FFF9F5] border border-[#FED7AA] rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#9A3412]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                        <span>⭐ 核心主推品 (必推)</span>
                      </span>
                      {mainProd && onNavigateToProduct && (
                        <button
                          onClick={() => onNavigateToProduct(mainProd)}
                          className="text-[11px] text-[#9E4A2B] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>产品详情</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {mainProd ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={mainProd.image}
                          alt={mainProd.name}
                          className="w-14 h-14 rounded-lg object-cover border border-[#FDBA74] bg-white shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-[#1F2937] truncate">
                            {mainProd.name}
                          </h4>
                          <div className="text-[11px] text-[#6B7280] font-mono mt-0.5">
                            品牌: {mainProd.brand} · SKU: {mainProd.sku}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded font-medium">
                              {mainProd.category}
                            </span>
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded">
                              {mainProd.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-red-500">主推品已失效 (ID: {combo.mainProductId})</div>
                    )}
                  </div>

                  {/* Center: Arrow connector (1 col) */}
                  <div className="lg:col-span-1 flex flex-col items-center justify-center text-gray-400 py-1">
                    <ArrowRight className="w-5 h-5 text-[#9E4A2B] hidden lg:block" />
                    <span className="text-[10px] text-gray-400 font-semibold lg:hidden">➔ 连带搭配</span>
                  </div>

                  {/* Right: Cross-selling Products (6 cols) */}
                  <div className="lg:col-span-6 bg-[#F8FAF9] border border-[#D1FAE5] rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#065F46]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#059669]" />
                        <span>🔗 连带销售搭配品 ({crossProds.length} 款)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {crossProds.map((cross) => (
                        <div
                          key={cross.id}
                          className="bg-white p-2 rounded-lg border border-[#A7F3D0] flex items-center gap-2"
                        >
                          <img
                            src={cross.image}
                            alt={cross.name}
                            className="w-10 h-10 rounded-md object-cover border border-[#E5E7EB] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="font-semibold text-[11px] text-[#1F2937] truncate">
                              {cross.name}
                            </h5>
                            <div className="text-[10px] text-gray-400 truncate">
                              [{cross.brand}] {cross.sku}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Linked Scenario Scripts Bar */}
                <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#EAE6DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-[#1F2937] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#9E4A2B]" />
                      <span>对应场景剧本 ({linkedScripts.length})</span>
                    </span>
                    {linkedScripts.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {linkedScripts.map((sc) => (
                          <button
                            key={sc.id}
                            onClick={() => onNavigateToScript && onNavigateToScript(sc.id)}
                            className="px-2 py-1 bg-white hover:bg-orange-50 text-[#9E4A2B] border border-[#FDBA74] rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>《{sc.title}》</span>
                            <span className="text-[9px] text-gray-400">({sc.steps?.length || 3} 步骤)</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400">
                        当前组合尚未建立对应场景剧本。可点击右侧为该组合创建专属话术剧本。
                      </p>
                    )}
                  </div>

                  {onCreateScriptForCombo && (
                    <button
                      onClick={() => onCreateScriptForCombo(combo)}
                      className="px-3 py-1.5 bg-white hover:bg-[#FFF7F2] text-[#9E4A2B] border border-[#9E4A2B] rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>为该组合创建场景剧本</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= CREATE / EDIT COMBINATION MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-[#E5E1D8] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EAE7E0] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#9E4A2B]" />
                <h3 className="font-bold text-sm text-[#1F2937]">
                  {editingCombo ? '编辑连带销售组合' : '新建连带销售组合'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs scrollbar-thin">
              {/* Product Combination Name */}
              <div>
                <label className="block text-xs font-bold text-[#1F2937] mb-1">
                  组合名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formComboName}
                  onChange={(e) => setFormComboName(e.target.value)}
                  placeholder="例如：【YOU】Skin Tint + 定妆喷雾 锁妆组合"
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white font-medium"
                />
              </div>

              {/* Combination Strategy / Rationale */}
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                  搭配策略与推荐理由 <span className="text-gray-400 font-normal">(选填)</span>
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="例如：针对年轻出油脱妆痛点，采用三明治定妆法，延长持妆时间..."
                  className="w-full px-3 py-2 text-xs border border-[#D6D0C4] rounded-lg focus:outline-none focus:border-[#9E4A2B] bg-white leading-relaxed"
                />
              </div>

              {/* SECTION A: 主推品 (必选，从全量产品选择) */}
              <div className="p-4 bg-[#FFF9F5] rounded-xl border border-[#FED7AA] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#9A3412] flex items-center gap-1.5">
                    <span>⭐ 选择主推品 (必选)</span>
                    <span className="text-[10px] text-gray-500 font-normal">从系统全部产品库选择</span>
                  </label>
                  <span className="text-[10px] text-[#C2410C] font-semibold bg-[#FFEDD5] px-1.5 py-0.5 rounded">
                    单选 · 组合核心
                  </span>
                </div>

                <select
                  value={formMainProductId}
                  onChange={(e) => handleSelectMainProduct(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#FDBA74] rounded-lg bg-white font-semibold text-[#1F2937] focus:outline-none focus:border-[#9E4A2B]"
                >
                  <option value="">-- 请选择主推产品 --</option>
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.brand}] {p.name} ({p.category})
                    </option>
                  ))}
                </select>

                {/* Selected Main Product preview */}
                {(() => {
                  const p = allProducts.find((prod) => prod.id === formMainProductId);
                  if (!p) return null;
                  return (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-[#FDBA74]">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-md object-cover border border-gray-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-[#1F2937] truncate">{p.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          品牌: {p.brand} · SKU: {p.sku}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* SECTION B: 连带品 (多选，必选至少1个，从全量产品选择) */}
              <div className="p-4 bg-[#F8FAF9] rounded-xl border border-[#A7F3D0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#065F46] flex items-center gap-1.5">
                    <span>🔗 选择连带搭配品 (必选至少1个，支持多选)</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-semibold">
                    已选 {formCrossProductIds.length} 款
                  </span>
                </div>

                {/* Selected Cross Products Chips */}
                {formCrossProductIds.length > 0 ? (
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-gray-500 font-medium">已选中的连带品列表：</span>
                    <div className="flex flex-wrap gap-2">
                      {formCrossProductIds.map((id) => {
                        const p = allProducts.find((item) => item.id === id);
                        if (!p) return null;
                        return (
                          <div
                            key={id}
                            className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-2 shadow-2xs"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-5 h-5 rounded object-cover"
                            />
                            <span className="font-medium text-xs text-[#1F2937] truncate max-w-[180px]">
                              {p.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleCrossProduct(id)}
                              className="text-gray-400 hover:text-red-500 cursor-pointer ml-1"
                              title="移除"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    请在下方产品列表中勾选至少一款产品作为连带搭配品。
                  </div>
                )}

                {/* Search & Select From All Products */}
                <div className="space-y-2 pt-2 border-t border-[#D1FAE5]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#374151]">
                      从系统全量产品库添加连带品：
                    </span>
                    <div className="relative w-48">
                      <Search className="w-3 h-3 text-gray-400 absolute left-2 top-2" />
                      <input
                        type="text"
                        placeholder="搜索添加产品..."
                        value={productSearchKeyword}
                        onChange={(e) => setProductSearchKeyword(e.target.value)}
                        className="w-full pl-6 pr-2 py-1 text-[11px] border border-gray-300 rounded-md bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="max-h-44 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                    {allProducts
                      .filter((p) => p.id !== formMainProductId)
                      .filter(
                        (p) =>
                          !productSearchKeyword ||
                          p.name.toLowerCase().includes(productSearchKeyword.toLowerCase()) ||
                          p.brand.toLowerCase().includes(productSearchKeyword.toLowerCase()) ||
                          p.sku.toLowerCase().includes(productSearchKeyword.toLowerCase())
                      )
                      .map((p) => {
                        const isSelected = formCrossProductIds.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleToggleCrossProduct(p.id)}
                            className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-7 h-7 rounded object-cover border border-gray-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-xs truncate">{p.name}</div>
                                <div className="text-[10px] text-gray-400 truncate">
                                  [{p.brand}] {p.sku}
                                </div>
                              </div>
                            </div>
                            <div className="shrink-0 ml-2">
                              {isSelected ? (
                                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-semibold flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> 已添加
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px]">
                                  + 添加
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#EAE7E0] flex items-center justify-end gap-2 bg-[#FAF8F5]">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-4 py-2 bg-[#9E4A2B] hover:bg-[#853C21] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                保存组合
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= IMPACT CONFIRMATION MODAL ================= */}
      {impactWarning.show && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 border border-amber-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#1F2937]">确认产品组合变更</h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  当前组合已被 <span className="font-bold text-[#C2410C]">{impactWarning.affectedScriptsCount}</span> 个场景剧本正式关联。修改主推品或连带品搭配可能会影响剧本的匹配状态。
                </p>
                <p className="text-[11px] text-gray-500">
                  确认更新后，系统将自动同步受影响剧本的关联关系；原剧本内容与练习任务不会被删除。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() =>
                  setImpactWarning({ show: false, pendingCombo: null, affectedScriptsCount: 0 })
                }
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                取消修改
              </button>
              <button
                onClick={handleConfirmImpactSave}
                className="px-3 py-1.5 bg-[#9E4A2B] hover:bg-[#853C21] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                确认并保存变更
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {comboToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 border border-red-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#1F2937]">确认删除连带销售组合？</h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  即将删除组合：<span className="font-bold">{comboToDelete.name}</span>。
                </p>
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-800 space-y-1">
                  <p className="font-semibold">⚠️ 业务保护规则：</p>
                  <p>
                    删除产品组合<strong>不会删除任何场景剧本、金句、数字人顾客或已发布的练习任务</strong>。
                  </p>
                  <p>
                    原关联该组合的场景剧本将自动转为<strong>「自定义搭配」</strong>状态，在产品详情页和对练中仍然正常可用。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setComboToDelete(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                确认删除组合
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
