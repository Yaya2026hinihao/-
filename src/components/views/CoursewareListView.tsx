import React from 'react';
import { BookOpen, Calendar, Users, Plus, ExternalLink, Package } from 'lucide-react';
import { Product } from '../../types/product';

interface CoursewareListViewProps {
  products: Product[];
  onOpenPublishModal: () => void;
  onNavigateToProduct: (product: Product) => void;
}

export const CoursewareListView: React.FC<CoursewareListViewProps> = ({
  products,
  onOpenPublishModal,
  onNavigateToProduct,
}) => {
  const coursewares = [
    {
      id: 'cw-1',
      title: 'Y.O.U Cloud Touch 粉底液核心产品知识与成份解析',
      type: '课件',
      product: products[0],
      duration: '15 分钟',
      author: '总部培训师 A (林静)',
      views: 1840,
      rating: '4.9',
    },
    {
      id: 'cw-2',
      title: 'Cloud Touch 3% 烟酰胺养肤卖点与竞品对比培训',
      type: '课件',
      product: products[0],
      duration: '20 分钟',
      author: 'Jakarta 区域培训经理 (Siti)',
      views: 890,
      rating: '4.8',
    },
    {
      id: 'cw-3',
      title: 'DAZZLE ME 定妆喷雾双配方卖点与成膜实验演示',
      type: '课件',
      product: products[3],
      duration: '15 分钟',
      author: '总部培训师 A (林静)',
      views: 2450,
      rating: '5.0',
    },
    {
      id: 'cw-4',
      title: 'SUNBRELLA 樱花防晒新品技术配方与防晒全波段科普',
      type: '课件',
      product: products[5],
      duration: '20 分钟',
      author: '总部培训师 A (林静)',
      views: 650,
      rating: '4.9',
    },
    {
      id: 'cw-5',
      title: 'GLAMFIX 美妆工具专柜连带陈列与5秒破冰连带法',
      type: '课件',
      product: products[4],
      duration: '10 分钟',
      author: '总部培训师 B (张强)',
      views: 1120,
      rating: '4.7',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">在线课件库</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            已有课件直接与具体产品形成绑定，无需重复开发，支持按产品一键调取组装
          </p>
        </div>

        <button
          onClick={onOpenPublishModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#9E4A2B] hover:bg-[#8C3E20] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ 新建课件任务</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coursewares.map((cw) => (
          <div
            key={cw.id}
            className="bg-white p-4 rounded-xl border border-[#E8E6E1] shadow-2xs hover:border-[#D4CEBF] transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="px-2 py-0.5 bg-[#FAF8F5] text-[#9E4A2B] border border-[#EFECE5] rounded font-medium">
                  {cw.product.brand} · {cw.product.category}
                </span>
                <span className="text-[#6B7280]">{cw.duration}</span>
              </div>

              <h3 className="text-xs font-bold text-[#111827] leading-snug line-clamp-2">
                {cw.title}
              </h3>
            </div>

            <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>讲师: {cw.author}</span>
              <button
                onClick={() => onNavigateToProduct(cw.product)}
                className="text-[#9E4A2B] hover:underline font-medium"
              >
                查看绑定产品 &gt;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
