'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Search, Mic, Sparkles, ChevronDown } from "lucide-react";
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
        // Get all categories for the home page
        setCategories(result.categories);
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
          <div className="flex flex-col items-center gap-6">
            {/* First 3 categories in a grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl">
              {categories.length > 0 ? (
                categories.slice(0, 3).map((category, index) => (
                  <CategoryCard
                    key={category.mcat_id}
                    title={category.mcat_name}
                    bgColor={getBgColor(index)}
                    imageUrl=""
                    href={`/categories/${encodeURIComponent(category.mcat_id)}`}
                    productCount={category.product_count}
                  />
                ))
              ) : (
                // Fallback static categories while loading
                <>
                  <CategoryCard
                    title="Industrial Equipment"
                    bgColor="from-slate-600 to-slate-800"
                    imageUrl="/category-industrial.svg"
                    href="/categories/industrial"
                  />
                  <CategoryCard
                    title="Raw Materials"
                    bgColor="from-amber-500 to-orange-600"
                    imageUrl="/category-materials.svg"
                    href="/categories/raw-materials"
                  />
                  <CategoryCard
                    title="Electronics"
                    bgColor="from-blue-600 to-indigo-700"
                    imageUrl="/category-electronics.svg"
                    href="/categories/electronics"
                  />
                </>
              )}
            </div>

            {/* Dropdown for remaining categories */}
            {categories.length > 3 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-300 rounded-xl px-6 py-3 h-auto text-slate-700 hover:text-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span className="mr-2">More Categories</span>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm font-bold mr-2">
                      +{categories.length - 3}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="center" 
                  className="w-80 max-h-96 overflow-y-auto bg-white border-2 border-slate-200 rounded-xl shadow-xl p-2"
                >
                  <div className="grid grid-cols-1 gap-1">
                    {categories.slice(3).map((category) => (
                      <DropdownMenuItem key={category.mcat_id} asChild className="p-0 focus:bg-slate-50 rounded-lg">
                        <Link 
                          href={`/categories/${encodeURIComponent(category.mcat_id)}`}
                          className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors w-full"
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 text-sm">{category.mcat_name}</span>
                            <span className="text-xs text-slate-500">{category.product_count.toLocaleString()} products</span>
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {category.mcat_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <DropdownMenuItem asChild className="p-0 focus:bg-slate-50 rounded-lg">
                      <Link 
                        href="/categories"
                        className="flex items-center justify-center p-3 text-indigo-600 hover:text-indigo-700 font-semibold text-sm hover:bg-indigo-50 rounded-lg transition-colors w-full"
                      >
                        View All Categories
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Fallback dropdown for static categories */}
            {categories.length === 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-300 rounded-xl px-6 py-3 h-auto text-slate-700 hover:text-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span className="mr-2">More Categories</span>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm font-bold mr-2">
                      +2
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="center" 
                  className="w-80 bg-white border-2 border-slate-200 rounded-xl shadow-xl p-2"
                >
                  <div className="grid grid-cols-1 gap-1">
                    <DropdownMenuItem asChild className="p-0 focus:bg-slate-50 rounded-lg">
                      <Link 
                        href="/categories/office"
                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors w-full"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">Office Supplies</span>
                          <span className="text-xs text-slate-500">Explore products</span>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">O</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0 focus:bg-slate-50 rounded-lg">
                      <Link 
                        href="/categories/chemicals"
                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors w-full"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">Chemicals</span>
                          <span className="text-xs text-slate-500">Explore products</span>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-violet-700 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">C</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <DropdownMenuItem asChild className="p-0 focus:bg-slate-50 rounded-lg">
                      <Link 
                        href="/categories"
                        className="flex items-center justify-center p-3 text-indigo-600 hover:text-indigo-700 font-semibold text-sm hover:bg-indigo-50 rounded-lg transition-colors w-full"
                      >
                        View All Categories
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

// Function to get default image based on category name
const getDefaultCategoryImage = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  // Map category names to available images
  if (name.includes('chemical') || name.includes('pharmaceutical')) {
    return '/category-chemicals.svg';
  }
  if (name.includes('electronic') || name.includes('electrical') || name.includes('computer') || name.includes('software')) {
    return '/category-electronics.svg';
  }
  if (name.includes('industrial') || name.includes('machinery') || name.includes('equipment') || name.includes('tool')) {
    return '/category-industrial.svg';
  }
  if (name.includes('material') || name.includes('steel') || name.includes('metal') || name.includes('construction')) {
    return '/category-materials.svg';
  }
  if (name.includes('office') || name.includes('stationery') || name.includes('furniture')) {
    return '/category-office.svg';
  }
  
  // Default fallback image
  return '/category-industrial.svg';
};

// Function to get background color based on category name
const getCategoryBgColor = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('chemical') || name.includes('pharmaceutical')) {
    return 'from-purple-600 to-violet-700';
  }
  if (name.includes('electronic') || name.includes('electrical') || name.includes('computer') || name.includes('software')) {
    return 'from-blue-600 to-indigo-700';
  }
  if (name.includes('industrial') || name.includes('machinery') || name.includes('equipment') || name.includes('tool')) {
    return 'from-slate-600 to-slate-800';
  }
  if (name.includes('material') || name.includes('steel') || name.includes('metal') || name.includes('construction')) {
    return 'from-amber-500 to-orange-600';
  }
  if (name.includes('office') || name.includes('stationery') || name.includes('furniture')) {
    return 'from-emerald-500 to-teal-600';
  }
  
  // Default fallback color
  return 'from-slate-600 to-slate-800';
};

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
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Get default image and background color based on category name
  const defaultImage = getDefaultCategoryImage(title);
  const categoryBgColor = getCategoryBgColor(title);
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105 border border-slate-200 h-full">
        <div className="h-32 sm:h-40 relative overflow-hidden">
          {!imageError ? (
            <>
              {/* Loading state */}
              {imageLoading && (
                <div className={`absolute inset-0 bg-gradient-to-br ${categoryBgColor} flex items-center justify-center`}>
                  <div className="text-white text-4xl font-bold opacity-20">
                    {title.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              {/* Actual image */}
              <img 
                src={imageUrl || defaultImage} 
                alt={title}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </>
          ) : (
            /* Fallback gradient background with icon */
            <div className={`w-full h-full bg-gradient-to-br ${categoryBgColor} flex items-center justify-center relative`}>
              {/* Try to load default image as backup */}
              <img 
                src={defaultImage} 
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-80"
                onError={() => {
                  // If default image also fails, show gradient with letter
                }}
              />
              {/* Fallback letter overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 flex items-center justify-center">
                <div className="text-white text-4xl sm:text-5xl font-bold opacity-60">
                  {title.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          )}
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
