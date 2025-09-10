'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, ArrowRight, Users, Shield, Zap, Mic, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, type Category } from "@/lib/api/categories";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const result = await getCategories();
      if (!result.error) {
        // Get top 5 categories for the home page
        setCategories(result.categories.slice(0, 5));
      }
    };
    loadCategories();
  }, []);

  // Helper function to get background color
  const getBgColor = (index: number) => {
    const bgColors = [
      "bg-gradient-to-br from-slate-600 to-slate-800",
      "bg-gradient-to-br from-amber-500 to-orange-600", 
      "bg-gradient-to-br from-blue-600 to-indigo-700",
      "bg-gradient-to-br from-purple-600 to-violet-700",
      "bg-gradient-to-br from-emerald-500 to-teal-600"
    ];
    return bgColors[index % bgColors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Wyapaar
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your AI-Powered B2B Marketplace connecting businesses with trusted suppliers worldwide. 
              Discover, connect, and grow your business with intelligent sourcing.
            </p>
          </div>
          
          {/* Enhanced AI-Powered Search Bar */}
          <div className="max-w-4xl mx-auto relative mb-12">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative flex bg-white rounded-2xl shadow-xl border border-slate-200">
                {/* AI Badge */}
                <div className="flex items-center pl-6">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-cyan-100 px-3 py-1.5 rounded-full">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-700">AI</span>
                  </div>
                </div>
                
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Input 
                    type="text" 
                    placeholder="Describe what you're looking for... AI will find the best matches" 
                    className="h-16 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none px-6 pr-16"
                  />
                  
                  {/* Voice Search Button */}
                  <button 
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-colors group/mic"
                    title="Voice Search"
                  >
                    <Mic className="h-5 w-5 text-slate-400 group-hover/mic:text-indigo-600 transition-colors" />
                  </button>
                </div>
                
                {/* Search Button */}
                <Button 
                  type="submit" 
                  className="h-16 px-10 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-r-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group/search"
                >
                  <Search className="mr-2 h-5 w-5 group-hover/search:scale-110 transition-transform" />
                  
                </Button>
              </div>
            </div>
            
            {/* Search Suggestions */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-slate-500">Try:</span>
              {["Industrial pumps", "Steel suppliers in Mumbai", "Electronics components", "Chemical raw materials"].map((suggestion, index) => (
                <button
                  key={index}
                  className="text-sm bg-white/50 hover:bg-white border border-slate-200 hover:border-indigo-300 px-3 py-1 rounded-full text-slate-600 hover:text-indigo-600 transition-all duration-200 hover:shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
              <div className="text-slate-600">Verified Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">50K+</div>
              <div className="text-slate-600">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-slate-600">Countries Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover thousands of products across multiple industries and find the perfect suppliers for your business needs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <CategoryCard
                  key={category.mcat_id}
                  title={category.mcat_name}
                  bgColor={getBgColor(index)}
                  imageUrl={`/category-${category.mcat_name.toLowerCase().replace(/\s+/g, '-')}.svg`}
                  href={`/categories/${encodeURIComponent(category.mcat_id)}`}
                  productCount={category.product_count}
                />
              ))
            ) : (
              // Fallback static categories while loading
              <>
                <CategoryCard
                  title="Industrial Equipment"
                  bgColor="bg-gradient-to-br from-slate-600 to-slate-800"
                  imageUrl="/category-industrial.svg"
                  href="/categories/industrial"
                />
                <CategoryCard
                  title="Raw Materials"
                  bgColor="bg-gradient-to-br from-amber-500 to-orange-600"
                  imageUrl="/category-materials.svg"
                  href="/categories/raw-materials"
                />
                <CategoryCard
                  title="Electronics"
                  bgColor="bg-gradient-to-br from-blue-600 to-indigo-700"
                  imageUrl="/category-electronics.svg"
                  href="/categories/electronics"
                />
                <CategoryCard
                  title="Office Supplies"
                  bgColor="bg-gradient-to-br from-emerald-500 to-teal-600"
                  imageUrl="/category-office.svg"
                  href="/categories/office"
                />
                <CategoryCard
                  title="Chemicals"
                  bgColor="bg-gradient-to-br from-purple-600 to-violet-700"
                  imageUrl="/category-chemicals.svg"
                  href="/categories/chemicals"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How Wyapaar Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, secure, and efficient. Get connected with verified suppliers in just three easy steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              step="1"
              title="Search & Discover"
              description="Use our AI-powered search to find suppliers and products that perfectly match your business needs and requirements."
              icon={<Search className="w-8 h-8" />}
              color="from-indigo-500 to-purple-600"
            />
            <FeatureCard
              step="2"
              title="Connect & Negotiate"
              description="Connect with verified suppliers directly through our platform to discuss requirements, negotiate terms, and build relationships."
              icon={<Users className="w-8 h-8" />}
              color="from-cyan-500 to-blue-600"
            />
            <FeatureCard
              step="3"
              title="Transact & Manage"
              description="Securely complete transactions and manage your entire supply chain through our comprehensive order management system."
              icon={<Shield className="w-8 h-8" />}
              color="from-emerald-500 to-teal-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Sourcing?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of businesses already using Wyapaar to find trusted suppliers, 
            negotiate better deals, and streamline their procurement process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              Watch Demo
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ 
  title, 
  bgColor, 
  imageUrl, 
  href,
  productCount 
}: { 
  title: string; 
  bgColor: string; 
  imageUrl: string; 
  href: string;
  productCount?: number;
}) {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105 border border-slate-200">
        <div className="h-40 relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/20 transition-all duration-300"></div>
        </div>
        <div className="p-6">
          <h3 className="font-bold text-slate-900 text-lg text-center group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          <p className="text-slate-500 text-sm text-center mt-2 group-hover:text-slate-600 transition-colors">
            {productCount ? `${productCount.toLocaleString()} products` : 'Explore products'}
          </p>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ 
  step, 
  title, 
  description, 
  icon,
  color 
}: { 
  step: string; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="relative group">
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 h-full">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${color} text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="mb-4">
            <span className={`inline-block w-8 h-8 bg-gradient-to-r ${color} text-white rounded-full text-sm font-bold flex items-center justify-center mb-3`}>
              {step}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {title}
            </h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-lg">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}