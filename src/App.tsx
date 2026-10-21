import React, { useState } from 'react';
import {
  MOCK_PRODUCTS,
  INITIAL_ROLE_CONFIGS,
  MOCK_AI_RECOMMENDATIONS,
} from './data/mockProducts';
import {
  INITIAL_DIGITAL_HUMANS,
  INITIAL_SCENARIO_SCRIPTS,
  DEFAULT_TAG_DIMENSIONS,
  INITIAL_PRODUCT_COMBINATIONS,
} from './data/mockSparringAssets';
import {
  DigitalHumanCustomer,
  ScenarioScriptItem,
  TagDimensionConfig,
  ProductCombination,
} from './types/sparring';
import {
  Product,
  RoleConfig,
  AIRecommendation,
  CrossSellingItem,
} from './types/product';
import { Sidebar, NavSection } from './components/layout/Sidebar';
import { Header, UserRolePerspective } from './components/layout/Header';
import { ProductList } from './components/product/ProductList';
import { ProductDetail } from './components/product/ProductDetail';
import { AssetDetailModal, AssetTabType } from './components/product/AssetDetailModal';
import { ProductEditModal } from './components/product/ProductEditModal';
import { RoleManageModal } from './components/product/RoleManageModal';
import { TaskPublishModal, SpecificAssetTarget } from './components/task/TaskPublishModal';
import { AIRecommendationCenter } from './components/ai/AIRecommendationCenter';
import { DashboardView } from './components/views/DashboardView';
import { TaskListView } from './components/views/TaskListView';
import { ExamListView } from './components/views/ExamListView';
import { CoursewareListView } from './components/views/CoursewareListView';
import { DigitalHumanView } from './components/sparring/DigitalHumanView';
import { ScenarioScriptView } from './components/sparring/ScenarioScriptView';
import { CrossSellingView } from './components/product/CrossSellingView';
import { TagDimensionManageModal } from './components/sparring/TagDimensionManageModal';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [roleConfigs, setRoleConfigs] = useState<RoleConfig[]>(INITIAL_ROLE_CONFIGS);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(MOCK_AI_RECOMMENDATIONS);

  // Sparring Assets State
  const [digitalHumans, setDigitalHumans] = useState<DigitalHumanCustomer[]>(INITIAL_DIGITAL_HUMANS);
  const [scenarioScripts, setScenarioScripts] = useState<ScenarioScriptItem[]>(INITIAL_SCENARIO_SCRIPTS);
  const [tagDimensions, setTagDimensions] = useState<TagDimensionConfig[]>(DEFAULT_TAG_DIMENSIONS);
  const [productCombinations, setProductCombinations] = useState<ProductCombination[]>(INITIAL_PRODUCT_COMBINATIONS);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Navigation
  const [currentSection, setCurrentSection] = useState<NavSection>('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Perspective (HQ vs Regional)
  const [rolePerspective, setRolePerspective] = useState<UserRolePerspective>('HQ');

  // Modals
  const [assetModal, setAssetModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    initialTab: AssetTabType;
  }>({
    isOpen: false,
    product: null,
    initialTab: 'study',
  });

  const [publishModal, setPublishModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    specificAsset?: SpecificAssetTarget | null;
  }>({
    isOpen: false,
    product: null,
    specificAsset: null,
  });

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Script Navigation & Combination Prefill state
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
  const [scriptPrefillCombo, setScriptPrefillCombo] = useState<ProductCombination | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const list: string[] = ['全国数据'];
    if (currentSection === 'products') {
      list.push('产品管理');
      if (selectedProduct) {
        list.push(selectedProduct.name);
      }
    } else if (currentSection === 'dashboard') {
      list.push('全国培训概览');
    } else if (currentSection === 'ai-recommendations') {
      list.push('产品管理');
      list.push('AI 智能任务推荐');
    } else if (currentSection === 'tasks') {
      list.push('练习任务列表');
    } else if (currentSection === 'exams') {
      list.push('题目与考试');
      list.push('考试任务管理');
    } else if (currentSection === 'courseware') {
      list.push('在线课件库');
    } else if (currentSection === 'cross-selling') {
      list.push('产品管理');
      list.push('连带销售组合');
    } else if (currentSection === 'digital-humans') {
      list.push('AI陪练管理');
      list.push('数字人顾客');
    } else if (currentSection === 'scenario-scripts') {
      list.push('AI陪练管理');
      list.push('场景剧本');
    }
    return list;
  };

  // Sparring Handlers
  const handleSaveDigitalHuman = (dh: DigitalHumanCustomer) => {
    const exists = digitalHumans.some((d) => d.id === dh.id);
    if (exists) {
      setDigitalHumans((prev) => prev.map((d) => (d.id === dh.id ? dh : d)));
      showToast(`已成功保存数字人顾客《${dh.name}》画像标签与关联产品`);
    } else {
      setDigitalHumans((prev) => [dh, ...prev]);
      showToast(`新数字人顾客《${dh.name}》已创建并关联产品`);
    }
  };

  const handleDeleteDigitalHuman = (id: string) => {
    setDigitalHumans((prev) => prev.filter((d) => d.id !== id));
    showToast('数字人顾客已删除');
  };

  const handleSaveScenarioScript = (script: ScenarioScriptItem) => {
    const exists = scenarioScripts.some((s) => s.id === script.id);
    if (exists) {
      setScenarioScripts((prev) => prev.map((s) => (s.id === script.id ? script : s)));
      showToast(`已成功保存场景剧本《${script.title}》`);
    } else {
      setScenarioScripts((prev) => [script, ...prev]);
      showToast(`新场景剧本《${script.title}》已创建并完成产品关联`);
    }
  };

  const handleDeleteScenarioScript = (id: string) => {
    setScenarioScripts((prev) => prev.filter((s) => s.id !== id));
    showToast('场景剧本已删除');
  };

  const handleSaveCombination = (combo: ProductCombination) => {
    const exists = productCombinations.some((c) => c.id === combo.id);
    if (exists) {
      setProductCombinations((prev) => prev.map((c) => (c.id === combo.id ? combo : c)));
      showToast(`已成功保存连带销售组合《${combo.name}》`);
    } else {
      setProductCombinations((prev) => [combo, ...prev]);
      showToast(`新连带销售组合《${combo.name}》已创建`);
    }
  };

  const handleDeleteCombination = (comboId: string) => {
    const combo = productCombinations.find((c) => c.id === comboId);
    setProductCombinations((prev) => prev.filter((c) => c.id !== comboId));
    // 保护规则：删除组合绝不删除场景剧本或任务，将关联转为自定义搭配
    setScenarioScripts((prev) =>
      prev.map((sc) => {
        if (sc.linkedCombination?.combinationId === comboId) {
          return {
            ...sc,
            linkedCombination: {
              ...sc.linkedCombination,
              combinationId: undefined,
              combinationName: '自定义搭配',
              pairingType: 'custom',
            },
          };
        }
        return sc;
      })
    );
    showToast(`已删除产品组合《${combo?.name || ''}》，相关场景剧本已自动转为自定义搭配保留`);
  };

  const handleSaveTagDimensions = (updatedDims: TagDimensionConfig[]) => {
    setTagDimensions(updatedDims);
    showToast('统一标签维度与选项配置已更新');
  };

  // Handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentSection('products');
  };

  const handleOpenAssetModal = (product: Product, tab: AssetTabType) => {
    setAssetModal({
      isOpen: true,
      product,
      initialTab: tab,
    });
  };

  const handleOpenTaskPublish = (
    product: Product,
    specificAsset?: SpecificAssetTarget
  ) => {
    setPublishModal({
      isOpen: true,
      product,
      specificAsset: specificAsset || null,
    });
  };

  const handleSaveProduct = (updated: Product) => {
    const exists = products.some((p) => p.id === updated.id);
    if (exists) {
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      if (selectedProduct?.id === updated.id) {
        setSelectedProduct(updated);
      }
      showToast(`已成功保存产品《${updated.name}》信息与画像卖点`);
    } else {
      setProducts((prev) => [updated, ...prev]);
      showToast(`新产品《${updated.name}》已添加至产品库，已建立初始关联`);
    }
    setEditModal({ isOpen: false, product: null });
  };

  const handleSaveRoles = (newRoles: RoleConfig[]) => {
    setRoleConfigs(newRoles);
    showToast('产品角色与重点标识体系已更新');
  };

  const handleAddCrossSelling = (productId: string, item: CrossSellingItem) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedCross = [...p.crossSelling, item];
          const updatedProd = { ...p, crossSelling: updatedCross };
          if (selectedProduct?.id === productId) {
            setSelectedProduct(updatedProd);
          }
          return updatedProd;
        }
        return p;
      })
    );
    showToast(`已成功为《${selectedProduct?.name}》建立与《${item.productName}》的连带销售关系！`);
  };

  const handlePublishSuccess = (summary: {
    productName: string;
    targetAudience: string;
    assetCount: number;
    taskTitle: string;
  }) => {
    showToast(
      `🎉 任务发布成功！《${summary.taskTitle}》已分发至 ${summary.targetAudience}`
    );
  };

  const handleApplyAIRecommendation = (product: Product, rec: AIRecommendation) => {
    const firstStudyId = rec.suggestedAssets.studyIds[0];
    const firstPracticeId = rec.suggestedAssets.practiceIds[0];
    const firstExamId = rec.suggestedAssets.examIds[0];

    let targetAsset: SpecificAssetTarget | undefined;
    if (firstStudyId) {
      const item = product.studyAssets.find((s) => s.id === firstStudyId);
      if (item) targetAsset = { id: item.id, category: 'study', title: item.title };
    } else if (firstPracticeId) {
      const item = product.practiceAssets.find((p) => p.id === firstPracticeId);
      if (item) targetAsset = { id: item.id, category: 'practice', title: item.title };
    } else if (firstExamId) {
      const item = product.examAssets.find((e) => e.id === firstExamId);
      if (item) targetAsset = { id: item.id, category: 'exam', title: item.title };
    }

    setPublishModal({
      isOpen: true,
      product,
      specificAsset: targetAsset || null,
    });
    showToast(`已根据 AI 建议自动定位《${product.name}》的核心训练任务`);
  };

  return (
    <div className="flex h-screen bg-[#F8F6F2] font-sans text-[#1F2937] overflow-hidden antialiased">
      {/* 1. Left Dark Sidebar (Exact SalesBoost AI UI) */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={(sec) => {
          setCurrentSection(sec);
          if (sec !== 'products') {
            setSelectedProduct(null);
          }
        }}
        productCount={products.length}
        combinationCount={productCombinations.length}
        digitalHumanCount={digitalHumans.length}
        scenarioScriptCount={scenarioScripts.length}
        onOpenTagManage={() => setIsTagModalOpen(true)}
      />

      {/* 2. Main Workspace Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          breadcrumbs={getBreadcrumbs()}
          rolePerspective={rolePerspective}
          onChangePerspective={(role) => {
            setRolePerspective(role);
            showToast(
              role === 'HQ'
                ? '已切换至【总部视角】：可制定全国产品大单品战略与连带拓扑'
                : '已切换至【Jakarta 区域视角】：可重点针对区域考试薄弱点定向发任务'
            );
          }}
          currentSection={currentSection}
          onSelectSection={(sec) => {
            setCurrentSection(sec);
            if (sec !== 'products') {
              setSelectedProduct(null);
            }
          }}
        />

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="bg-[#1E1F24] text-white px-5 py-2.5 flex items-center justify-between text-xs border-b border-[#373A45] shadow-sm animate-in fade-in slide-in-from-top-1 z-20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8F6F2]">
          <div className="max-w-7xl mx-auto">
            {/* View 1: Products Section */}
            {currentSection === 'products' && (
              <>
                {selectedProduct ? (
                  <ProductDetail
                    product={selectedProduct}
                    allProducts={products}
                    roleConfigs={roleConfigs}
                    onBack={() => setSelectedProduct(null)}
                    onOpenAssetModal={(tab) => handleOpenAssetModal(selectedProduct, tab)}
                    onOpenTaskPublish={(prod, preselectedTab) =>
                      handleOpenTaskPublish(prod, preselectedTab)
                    }
                    onEditProduct={(prod) => setEditModal({ isOpen: true, product: prod })}
                    onSaveProduct={handleSaveProduct}
                    onOpenRoleManage={() => setIsRoleModalOpen(true)}
                    onAddCrossSelling={handleAddCrossSelling}
                    digitalHumans={digitalHumans}
                    scenarioScripts={scenarioScripts}
                    combinations={productCombinations}
                    tagDimensions={tagDimensions}
                    onSaveDigitalHuman={handleSaveDigitalHuman}
                    onSaveScript={handleSaveScenarioScript}
                    onNavigateToCrossSelling={() => {
                      setSelectedProduct(null);
                      setCurrentSection('cross-selling');
                    }}
                    onNavigateToScript={(scriptId) => {
                      setSelectedProduct(null);
                      if (scriptId) setSelectedScriptId(scriptId);
                      setCurrentSection('scenario-scripts');
                    }}
                    onCreateScriptForCombo={(combo) => {
                      setSelectedProduct(null);
                      setScriptPrefillCombo(combo);
                      setCurrentSection('scenario-scripts');
                    }}
                  />
                ) : (
                  <ProductList
                    products={products}
                    roleConfigs={roleConfigs}
                    onSelectProduct={handleSelectProduct}
                    onOpenAssetModal={handleOpenAssetModal}
                    onAddNewProduct={() => setEditModal({ isOpen: true, product: null })}
                    onOpenRoleManage={() => setIsRoleModalOpen(true)}
                    onOpenTaskPublish={handleOpenTaskPublish}
                    onOpenAIRecommendations={() => setCurrentSection('ai-recommendations')}
                  />
                )}
              </>
            )}

            {/* View 2: AI Recommendations */}
            {currentSection === 'ai-recommendations' && (
              <AIRecommendationCenter
                recommendations={recommendations}
                products={products}
                onApplyRecommendation={handleApplyAIRecommendation}
                selectedRegion={rolePerspective === 'HQ' ? '全国' : 'Jakarta'}
              />
            )}

            {/* View 3: Dashboard */}
            {currentSection === 'dashboard' && (
              <DashboardView
                products={products}
                onNavigateToProducts={() => {
                  setSelectedProduct(null);
                  setCurrentSection('products');
                }}
                onNavigateToAI={() => setCurrentSection('ai-recommendations')}
              />
            )}

            {/* View 4: Tasks List */}
            {currentSection === 'tasks' && (
              <TaskListView
                products={products}
                onOpenPublishModal={() =>
                  setPublishModal({ isOpen: true, product: products[0] || null })
                }
                onNavigateToProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentSection('products');
                }}
              />
            )}

            {/* View 5: Exams List */}
            {currentSection === 'exams' && (
              <ExamListView
                products={products}
                onOpenPublishModal={() =>
                  setPublishModal({ isOpen: true, product: products[0] || null })
                }
                onNavigateToProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentSection('products');
                }}
              />
            )}

            {/* View 6: Courseware List */}
            {currentSection === 'courseware' && (
              <CoursewareListView
                products={products}
                onOpenPublishModal={() =>
                  setPublishModal({ isOpen: true, product: products[0] || null })
                }
                onNavigateToProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentSection('products');
                }}
              />
            )}

            {/* View 7: Digital Humans (AI 陪练数字人) */}
            {currentSection === 'digital-humans' && (
              <div className="h-[calc(100vh-8.5rem)] -m-6 md:-m-8">
                <DigitalHumanView
                  digitalHumans={digitalHumans}
                  products={products}
                  tagDimensions={tagDimensions}
                  onSaveDigitalHuman={handleSaveDigitalHuman}
                  onDeleteDigitalHuman={handleDeleteDigitalHuman}
                  onOpenTagManage={() => setIsTagModalOpen(true)}
                  onNavigateToProduct={(p) => {
                    setSelectedProduct(p);
                    setCurrentSection('products');
                  }}
                  onOpenTaskPublish={handleOpenTaskPublish}
                />
              </div>
            )}

            {/* View 7.5: Cross-selling (连带销售组合管理) */}
            {currentSection === 'cross-selling' && (
              <div className="h-[calc(100vh-8.5rem)] -m-6 md:-m-8">
                <CrossSellingView
                  allProducts={products}
                  combinations={productCombinations}
                  scenarioScripts={scenarioScripts}
                  onSaveCombination={handleSaveCombination}
                  onDeleteCombination={handleDeleteCombination}
                  onNavigateToProduct={(p) => {
                    setSelectedProduct(p);
                    setCurrentSection('products');
                  }}
                  onNavigateToScript={(scriptId) => {
                    if (scriptId) setSelectedScriptId(scriptId);
                    setCurrentSection('scenario-scripts');
                  }}
                  onCreateScriptForCombo={(combo) => {
                    setScriptPrefillCombo(combo);
                    setCurrentSection('scenario-scripts');
                  }}
                />
              </div>
            )}

            {/* View 8: Scenario Scripts (AI 陪练场景剧本) */}
            {currentSection === 'scenario-scripts' && (
              <div className="h-[calc(100vh-8.5rem)] -m-6 md:-m-8">
                <ScenarioScriptView
                  scripts={scenarioScripts}
                  products={products}
                  combinations={productCombinations}
                  tagDimensions={tagDimensions}
                  onSaveScript={handleSaveScenarioScript}
                  onDeleteScript={handleDeleteScenarioScript}
                  onOpenTagManage={() => setIsTagModalOpen(true)}
                  onSaveCombination={handleSaveCombination}
                  onNavigateToProduct={(p) => {
                    setSelectedProduct(p);
                    setCurrentSection('products');
                  }}
                  onOpenTaskPublish={handleOpenTaskPublish}
                  initialSelectedScriptId={selectedScriptId || undefined}
                  initialPrefillCombo={scriptPrefillCombo}
                  onClearInitialPrefill={() => setScriptPrefillCombo(null)}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. Asset Drilldown Modal (When clicking 学习3次, 练习5次, 86分) */}
      {assetModal.product && (
        <AssetDetailModal
          product={assetModal.product}
          initialTab={assetModal.initialTab}
          isOpen={assetModal.isOpen}
          onClose={() => setAssetModal({ isOpen: false, product: null, initialTab: 'study' })}
          onOpenTaskPublish={(prod, specificAsset) => {
            setAssetModal({ isOpen: false, product: null, initialTab: 'study' });
            setPublishModal({ isOpen: true, product: prod, specificAsset: specificAsset || null });
          }}
        />
      )}

      {/* 2. Task Publish by Product Modal */}
      <TaskPublishModal
        products={products}
        selectedProduct={publishModal.product}
        specificAsset={publishModal.specificAsset}
        isOpen={publishModal.isOpen}
        onClose={() => setPublishModal({ isOpen: false, product: null, specificAsset: null })}
        onPublishSuccess={handlePublishSuccess}
        digitalHumans={digitalHumans}
        scenarioScripts={scenarioScripts}
        combinations={productCombinations}
      />

      {/* 3. Product Add / Edit Modal */}
      <ProductEditModal
        product={editModal.product}
        roleConfigs={roleConfigs}
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, product: null })}
        onSave={handleSaveProduct}
      />

      {/* 4. Role System Management Modal */}
      <RoleManageModal
        roles={roleConfigs}
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSaveRoles={handleSaveRoles}
      />

      {/* 5. Tag Dimension Configuration Modal */}
      <TagDimensionManageModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        dimensions={tagDimensions}
        onSaveDimensions={handleSaveTagDimensions}
      />
    </div>
  );
}
