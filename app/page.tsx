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
import { Search, Mic, Sparkles, ChevronDown, Settings, Zap, Cpu, Beaker, CheckCircle, Package, Globe, Camera, Upload } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCategories, type Category } from "@/lib/api/categories";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
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

  const fetchSuggestions = useCallback(async (query: string) => {
    // Mock suggestions - in real app, this would call an API
    const mockSuggestions = [
      'Industrial pumps',
      'Industrial pump suppliers in India',
      'Industrial water pumps',
      'Steel suppliers near me',
      'Steel manufacturing companies',
      'Electronics components wholesale',
      'Electronic parts suppliers',
      'Chemical raw materials',
      'Chemical suppliers India',
      'Machinery parts suppliers'
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
    
    setSuggestions(mockSuggestions);
    setShowSuggestions(mockSuggestions.length > 0 && isSearchFocused);
  }, [isSearchFocused]);

  // Debounced search for suggestions
  useEffect(() => {
    // Set search as active when user starts typing
    setIsSearchActive(searchQuery.trim().length > 0);
    
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSuggestions]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuery = selectedSuggestionIndex >= 0 ? suggestions[selectedSuggestionIndex] : searchQuery.trim();
    if (finalQuery) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
    }
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsSearchFocused(true);
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsSearchFocused(false);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      // Only reset search active if there's no query
      if (!searchQuery.trim()) {
        setIsSearchActive(false);
      }
    }, 200);
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
      <div className={`relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 transition-all duration-700 ease-in-out ${
        isSearchActive ? 'py-12 sm:py-16' : 'py-20'
      }`}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className={`px-4 transition-all duration-700 ease-in-out ${
            isSearchActive ? 'mb-6 sm:mb-8' : 'mb-12'
          }`}>
            <div className="text-center mb-8">
              {/* Modern Brand Name */}
              <div className={`transition-all duration-700 ease-in-out ${
                isSearchActive ? 'mb-3 sm:mb-4' : 'mb-6'
              }`}>
                <span className={`font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent tracking-tight transition-all duration-700 ease-in-out ${
                  isSearchActive 
                    ? 'text-3xl sm:text-4xl md:text-5xl' 
                    : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
                }`}>
                Wyapaar
              </span>
              </div>
              
              {/* Hindi Tagline */}
              <h1 className={`font-bold text-slate-900 tracking-tight leading-tight transition-all duration-700 ease-in-out ${
                isSearchActive 
                  ? 'text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3' 
                  : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4'
              }`}>
                Business ko do{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  naya boost
                </span>{" "}
                <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI powered
                </span>{" "}
            </h1>
              
              {/* Subtitle */}
              <p className={`text-slate-600 mx-auto leading-relaxed font-medium transition-all duration-700 ease-in-out ${
                isSearchActive 
                  ? 'text-sm sm:text-base max-w-xl' 
                  : 'text-lg sm:text-xl max-w-2xl'
              }`}>
                India&apos;s smartest B2B marketplace connecting businesses with verified suppliers
              </p>
            </div>
          </div>
          
          {/* Enhanced Search Bar with Mobile Optimization */}
          <div className={`mx-auto relative px-4 transition-all duration-700 ease-in-out ${
            isSearchActive 
              ? 'max-w-5xl mb-4 sm:mb-6' 
              : 'max-w-4xl mb-8 sm:mb-12'
          }`}>
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative group">
                {/* Animated gradient border */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur opacity-30 group-hover:opacity-50 transition-all duration-700 animate-pulse ${
                  isSearchActive 
                    ? 'rounded-2xl' 
                    : 'rounded-full'
                }`}></div>
                
                <div className={`relative bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/30 p-1 transition-all duration-700 ease-in-out ${
                  isSearchActive 
                    ? 'rounded-2xl' 
                    : 'rounded-full'
                }`}>
                  <div className="flex items-center">
                    {/* AI Icon - Inside left */}
                <div className="flex items-center pl-6">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                        <span className="text-sm font-bold">AI</span>
                  </div>
                </div>
                
                {/* Search Input */}
                    <div className="flex-1 relative mx-4">
                  <Input 
                    type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        placeholder="Search by product, category, or supplier… AI will match you instantly" 
                        className="h-16 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none px-4 placeholder:text-slate-400 placeholder:text-base"
                      />
                    </div>
                    
                    {/* Image Upload Icon */}
                    <button 
                      type="button"
                      className="p-3 hover:bg-slate-100 rounded-full transition-all duration-200 group/camera mr-2"
                      title="Search by Image"
                    >
                      <Camera className="h-5 w-5 text-slate-400 group-hover/camera:text-indigo-600 group-hover/camera:scale-110 transition-all" />
                    </button>
                    
                    {/* Voice Icon */}
                  <button 
                    type="button"
                      className="p-3 hover:bg-slate-100 rounded-full transition-all duration-200 group/mic mr-2"
                    title="Voice Search"
                  >
                      <Mic className="h-5 w-5 text-slate-400 group-hover/mic:text-indigo-600 group-hover/mic:scale-110 transition-all" />
                  </button>
                
                {/* Search Button */}
                <Button 
                  type="submit" 
                      className={`h-14 px-8 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 group/search transition-all duration-700 ease-in-out ${
                        isSearchActive 
                          ? 'rounded-xl' 
                          : 'rounded-full'
                      }`}
                >
                  <Search className="mr-2 h-5 w-5 group-hover/search:scale-110 transition-transform" />
                      Search
                    </Button>
                  </div>
                </div>

                {/* Desktop Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border border-t-0 border-white/30 shadow-2xl z-50 max-h-80 overflow-y-auto transition-all duration-700 ease-in-out ${
                    isSearchActive 
                      ? 'rounded-b-2xl' 
                      : 'rounded-b-3xl'
                  }`}>
                    <div className="p-3">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-200 flex items-center gap-4 ${
                            selectedSuggestionIndex === index
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Search className="h-5 w-5 text-slate-400" />
                          <span className="text-base font-medium">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Mobile Search Bar */}
            <div className="sm:hidden">
              <div className="relative group">
                {/* Enhanced mobile gradient border */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-40 group-hover:opacity-60 transition duration-500 animate-pulse ${showSuggestions ? 'rounded-b-none' : ''}`}></div>
                
                <div className={`relative bg-white/98 backdrop-blur-2xl shadow-2xl border-2 border-white/50 p-4 transition-all duration-300 ${showSuggestions ? 'rounded-t-3xl rounded-b-none' : 'rounded-3xl'}`}>
                  {/* Mobile AI Badge */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-cyan-100 px-4 py-2 rounded-full">
                      <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                      <span className="text-sm font-bold text-indigo-700">AI-Powered Search</span>
                    </div>
                  </div>
                  
                  {/* Mobile Search Input */}
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        placeholder="Search products, suppliers, categories..." 
                        className="h-14 text-base border-0 bg-slate-50/80 focus:bg-white rounded-2xl focus:ring-2 focus:ring-indigo-500 px-4 pr-20 placeholder:text-slate-400 transition-all font-medium shadow-inner"
                      />
                      
                      {/* Mobile Action Icons */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button 
                          type="button"
                          className="p-2 hover:bg-slate-200 rounded-full transition-all duration-200 group/camera"
                          title="Search by Image"
                        >
                          <Camera className="h-4 w-4 text-slate-500 group-hover/camera:text-indigo-600 transition-all" />
                        </button>
                        <button 
                          type="button"
                          className="p-2 hover:bg-slate-200 rounded-full transition-all duration-200 group/mic"
                          title="Voice Search"
                        >
                          <Mic className="h-4 w-4 text-slate-500 group-hover/mic:text-indigo-600 transition-all" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Mobile Search Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 group/search"
                    >
                      <Search className="mr-3 h-5 w-5 group-hover/search:scale-110 transition-transform" />
                      Search with AI
                </Button>
                  </form>
                </div>

                {/* Mobile Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-2xl border-2 border-t-0 border-white/50 rounded-b-3xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                    <div className="p-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 flex items-center gap-3 ${
                            selectedSuggestionIndex === index
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Search className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
            
            {/* Enhanced Popular Searches */}
            <div className={`mt-8 px-4 transition-all duration-700 ease-in-out ${
              isSearchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
              <div className="text-center mb-6">
                <span className="text-sm text-slate-500 font-medium">Try these popular searches:</span>
              </div>
              
              {/* Mobile: 2x2 Grid */}
              <div className="grid grid-cols-2 sm:hidden gap-4 max-w-sm mx-auto">
                {[
                  { text: "Industrial pumps", icon: Settings, color: "from-blue-500 to-indigo-600" },
                  { text: "Steel suppliers", icon: Zap, color: "from-gray-500 to-slate-600" },
                  { text: "Electronics", icon: Cpu, color: "from-purple-500 to-violet-600" },
                  { text: "Chemicals", icon: Beaker, color: "from-emerald-500 to-teal-600" }
                ].map((suggestion, index) => {
                  const IconComponent = suggestion.icon;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="group relative flex flex-col items-center gap-3 bg-white/90 hover:bg-white border border-slate-200/60 hover:border-indigo-300 p-4 rounded-2xl text-slate-600 hover:text-indigo-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm active:scale-95"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${suggestion.color} shadow-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-center relative z-10 leading-tight">{suggestion.text}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  );
                })}
              </div>

              {/* Desktop: Horizontal Row */}
              <div className="hidden sm:flex flex-wrap justify-center gap-4">
                {[
                  { text: "Industrial pumps", icon: Settings, color: "from-blue-500 to-indigo-600" },
                  { text: "Steel suppliers", icon: Zap, color: "from-gray-500 to-slate-600" },
                  { text: "Electronics", icon: Cpu, color: "from-purple-500 to-violet-600" },
                  { text: "Chemicals", icon: Beaker, color: "from-emerald-500 to-teal-600" }
                ].map((suggestion, index) => {
                  const IconComponent = suggestion.icon;
                  return (
                <button
                  key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="group relative flex items-center gap-2 bg-white/80 hover:bg-white border border-slate-200/60 hover:border-indigo-300 px-5 py-3 rounded-full text-slate-600 hover:text-indigo-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm hover:scale-105"
                >
                      <IconComponent className={`h-4 w-4 bg-gradient-to-r ${suggestion.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`} />
                      <span className="text-sm font-medium relative z-10">{suggestion.text}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                  );
                })}
              </div>
            </div>

          {/* Enhanced Stats Section */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 max-w-6xl mx-auto px-4 mt-16 transition-all duration-700 ease-in-out ${
            isSearchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            {[
              { 
                icon: CheckCircle, 
                number: "50K+", 
                label: "Verified Suppliers", 
                color: "from-emerald-500 to-teal-600",
                bgColor: "from-emerald-50 to-teal-50"
              },
              { 
                icon: Package, 
                number: "10M+", 
                label: "Products Listed", 
                color: "from-indigo-500 to-purple-600",
                bgColor: "from-indigo-50 to-purple-50"
              },
              { 
                icon: Globe, 
                number: "200+", 
                label: "Countries Covered", 
                color: "from-cyan-500 to-blue-600",
                bgColor: "from-cyan-50 to-blue-50"
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group cursor-pointer">
                  <div className={`relative bg-gradient-to-br ${stat.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/40 backdrop-blur-sm group-hover:scale-105`}>
                    {/* Animated border */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
                    
                    <div className="relative">
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      
                      {/* Number */}
                      <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        {stat.number}
          </div>

                      {/* Label */}
                      <div className="text-slate-700 font-semibold text-lg group-hover:text-slate-900 transition-colors">
                        {stat.label}
                      </div>
            </div>
            </div>
            </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className={`py-16 sm:py-20 bg-white transition-all duration-700 ease-in-out ${
        isSearchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
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
