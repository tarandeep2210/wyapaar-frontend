'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Mic, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories, type Category } from "@/lib/api/categories";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

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
          <div className="mb-8 px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight text-center">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Wyapaar
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed text-center px-4">
              Your AI-Powered B2B Marketplace connecting businesses with trusted suppliers worldwide. 
              Discover, connect, and grow your business with intelligent sourcing.
            </p>
          </div>
          
          {/* Modern AI-Powered Search Bar */}
          <form onSubmit={handleSearch} className="max-w-5xl mx-auto relative mb-8 sm:mb-12 px-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative">
                {/* Mobile-first responsive search container */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-2">
                  
                  {/* AI Badge - Mobile responsive */}
                  <div className="flex items-center justify-center mb-4 sm:hidden">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-cyan-100 px-4 py-2 rounded-full">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-bold text-indigo-700">AI-Powered Search</span>
                    </div>
                  </div>
                  
                  {/* Desktop layout */}
                  <div className="hidden sm:flex items-center">
                    {/* AI Badge - Desktop */}
                    <div className="flex items-center pl-4 lg:pl-6">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-cyan-100 px-4 py-2 rounded-full">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-bold text-indigo-700 hidden lg:inline">AI</span>
                      </div>
                    </div>
                    
                    {/* Search Input - Desktop */}
                    <div className="flex-1 relative mx-4">
                      <Input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Describe what you need... AI will find perfect matches" 
                        className="h-14 lg:h-16 text-base lg:text-lg border-0 bg-transparent focus:ring-0 focus:outline-none px-6 pr-16 placeholder:text-slate-400"
                      />
                      
                      {/* Voice Search Button */}
                      <button 
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-all duration-200 group/mic"
                        title="Voice Search"
                      >
                        <Mic className="h-5 w-5 text-slate-400 group-hover/mic:text-indigo-600 group-hover/mic:scale-110 transition-all" />
                      </button>
                    </div>
                    
                    {/* Search Button - Desktop */}
                    <Button 
                      type="submit" 
                      className="h-14 lg:h-16 px-6 lg:px-10 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-2xl text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group/search mr-2"
                    >
                      <Search className="mr-2 h-5 w-5 group-hover/search:scale-110 transition-transform" />
                      <span className="hidden sm:inline">Search</span>
                    </Button>
                  </div>
                  
                  {/* Mobile layout */}
                  <div className="sm:hidden space-y-4">
                    {/* Search Input - Mobile */}
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="What are you looking for?" 
                        className="h-14 text-base border-0 bg-slate-50/50 focus:bg-white rounded-2xl focus:ring-2 focus:ring-indigo-500 px-6 pr-16 placeholder:text-slate-400 transition-all"
                      />
                      
                      {/* Voice Search Button - Mobile */}
                      <button 
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-all duration-200 group/mic"
                        title="Voice Search"
                      >
                        <Mic className="h-5 w-5 text-slate-400 group-hover/mic:text-indigo-600 transition-colors" />
                      </button>
                    </div>
                    
                    {/* Search Button - Mobile */}
                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group/search"
                    >
                      <Search className="mr-3 h-5 w-5 group-hover/search:scale-110 transition-transform" />
                      Search with AI
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
            
            {/* Modern Search Suggestions */}
            <div className="mt-6 px-2">
              <div className="text-center mb-4">
                <span className="text-sm text-slate-500 font-medium">Popular searches:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {["Industrial pumps", "Steel suppliers", "Electronics", "Chemicals"].map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="group relative text-sm bg-white/60 hover:bg-white border border-slate-200/60 hover:border-indigo-300 px-4 py-2 rounded-full text-slate-600 hover:text-indigo-600 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 backdrop-blur-sm"
                  >
                    <span className="relative z-10">{suggestion}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                ))}
              </div>
            </div>

          {/* Modern Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-4">
            <div className="text-center group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
                <div className="text-slate-600 font-medium">Verified Suppliers</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-600 mb-2 group-hover:scale-110 transition-transform duration-300">50K+</div>
                <div className="text-slate-600 font-medium">Products Listed</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
                <div className="text-slate-600 font-medium">Countries Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Discover thousands of products across multiple industries and find the perfect suppliers for your business needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
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

    </div>
  );
}

function CategoryCard({ 
  title, 
  // bgColor, // Unused parameter, removed to avoid warning
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
    <Link href={href} className="group block">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105 border border-slate-200 h-full">
        <div className="h-32 sm:h-40 relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/20 transition-all duration-300"></div>
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg text-center group-hover:text-indigo-600 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm text-center mt-2 group-hover:text-slate-600 transition-colors">
            {productCount ? `${productCount.toLocaleString()} products` : 'Explore products'}
          </p>
        </div>
      </div>
    </Link>
  );
}
