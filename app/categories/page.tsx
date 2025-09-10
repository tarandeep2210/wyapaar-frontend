'use client';

import Link from "next/link";
import { ArrowRight, TrendingUp, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, getTrendingCategories, type Category } from "@/lib/api/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [categoriesResult, trendingResult] = await Promise.all([
          getCategories(),
          getTrendingCategories(8)
        ]);

        if (categoriesResult.error) {
          setError(categoriesResult.error);
        } else {
          setCategories(categoriesResult.categories);
        }

        if (!trendingResult.error) {
          setTrendingCategories(trendingResult.categories);
        }
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-cyan-50 py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Product <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Categories</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore our comprehensive range of product categories and find the perfect suppliers for your business needs
          </p>
          {categories.length > 0 && (
            <p className="text-lg text-slate-500 mt-4">
              {categories.length} categories • {categories.reduce((sum, cat) => sum + cat.product_count, 0).toLocaleString()} total products
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No categories found</h3>
            <p className="text-slate-500">Categories will appear here once products are added to the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <CategoryCard key={category.mcat_id} category={category} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Trending Categories */}
      {trendingCategories.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                <h2 className="text-3xl font-bold text-slate-900">Trending Categories</h2>
              </div>
              <p className="text-lg text-slate-600">Most active categories this month</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trendingCategories.map((category) => (
                <TrendingCategoryCard key={category.mcat_id} category={category} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryCard({ 
  category,
  index
}: { 
  category: Category;
  index: number;
}) {
  // Generate different background colors for variety
  const bgColors = [
    "from-slate-600 to-slate-800",
    "from-amber-500 to-orange-600", 
    "from-blue-600 to-indigo-700",
    "from-purple-600 to-violet-700",
    "from-emerald-500 to-teal-600",
    "from-pink-500 to-rose-600"
  ];
  const bgColor = bgColors[index % bgColors.length];

  // Use category images if available, otherwise use a default pattern
  const imageUrl = `/category-${category.mcat_name.toLowerCase().replace(/\s+/g, '-')}.svg`;
  
  return (
    <Link href={`/categories/${encodeURIComponent(category.mcat_id)}`} className="group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105 border border-slate-200 h-full">
        <div className="h-48 relative overflow-hidden">
          <div className={`w-full h-full bg-gradient-to-br ${bgColor} flex items-center justify-center`}>
            <div className="text-white text-6xl font-bold opacity-20">
              {category.mcat_name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-bold text-white text-xl mb-1 group-hover:text-indigo-200 transition-colors line-clamp-2">
              {category.mcat_name}
            </h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            Explore {category.product_count.toLocaleString()} products in {category.mcat_name.toLowerCase()}
          </p>
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-600">{category.product_count.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Products</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-600">Active</div>
              <div className="text-xs text-slate-500">Category</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
              Explore Category
            </span>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function TrendingCategoryCard({ category }: { category: Category }) {
  // Calculate a fake growth percentage for demonstration
  const growthPercentage = Math.floor(Math.random() * 50) + 10;
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200">
      <div className="text-center">
        <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2">{category.mcat_name}</h4>
        <div className="flex items-center justify-center gap-1 mb-1">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm font-semibold text-green-600">+{growthPercentage}%</span>
        </div>
        <p className="text-xs text-slate-500">{category.product_count} products</p>
      </div>
    </div>
  );
}