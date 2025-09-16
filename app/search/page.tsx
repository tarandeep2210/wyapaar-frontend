'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, MapPin, Star, Mic, Loader2, Package, Camera } from "lucide-react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { searchProducts, getCategories } from "@/lib/api/categories";
import { type Product, type Category } from "@/lib/supabase";

// Simple function to strip HTML tags
const stripHtmlTags = (str: string) => {
  return str ? str.replace(/<[^>]*>/g, '') : '';
};

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Extract search logic to reusable function
  const performSearch = useCallback(async (query: string, page = 1, category = selectedCategory) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setCurrentPage(page);
    
    const result = await searchProducts(query, { 
      page, 
      limit: 12, 
      category 
    });
    
    if (result.error) {
      setError(result.error);
      setProducts([]);
    } else {
      setProducts(result.products);
      setTotal(result.total);
      setError(null);
    }
    
    setLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    // Load categories for filters
    const loadCategories = async () => {
      const result = await getCategories();
      if (!result.error) {
        setCategories(result.categories.slice(0, 10)); // Show top 10 categories
      }
    };
    loadCategories();
    
    // Check for search query in URL parameters
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      performSearch(queryParam, 1);
    }
  }, [searchParams, performSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(searchQuery, 1);
  };

  const handlePageChange = async (newPage: number) => {
    await performSearch(searchQuery, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryFilter = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (searchQuery.trim()) {
      await performSearch(searchQuery, 1, categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-cyan-50 py-12 sm:py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
              AI-Powered <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Search</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Find exactly what you&apos;re looking for with our intelligent search technology
            </p>
          </div>

          {/* Modern Search Bar */}
          <form onSubmit={handleSearch} className="max-w-5xl mx-auto relative">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-2">
                  
                  {/* Mobile Layout */}
                  <div className="sm:hidden space-y-4">
                    {/* AI Badge - Mobile */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-cyan-100 px-4 py-2 rounded-full">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-bold text-indigo-700">AI-Powered Search</span>
                      </div>
                    </div>
                    
                    {/* Search Input - Mobile */}
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products, suppliers, categories..." 
                        className="h-14 text-base border-0 bg-slate-50/50 focus:bg-white rounded-2xl focus:ring-2 focus:ring-indigo-500 px-6 pr-24 placeholder:text-slate-400 transition-all"
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
                    
                    {/* Search Button - Mobile */}
                    <Button 
                      type="submit" 
                      disabled={loading || !searchQuery.trim()}
                      className="w-full h-14 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group/search"
                    >
                      {loading ? (
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="mr-3 h-5 w-5 group-hover/search:scale-110 transition-transform" />
                      )}
                      Search with AI
                    </Button>
                  </div>
                  
                  {/* Desktop Layout */}
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
                        placeholder="Search products, suppliers, categories..." 
                        className="h-14 lg:h-16 text-base lg:text-lg border-0 bg-transparent focus:ring-0 focus:outline-none px-6 pr-24 placeholder:text-slate-400"
                      />
                      
                      {/* Desktop Action Icons */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button 
                          type="button"
                          className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 group/camera"
                          title="Search by Image"
                        >
                          <Camera className="h-5 w-5 text-slate-400 group-hover/camera:text-indigo-600 group-hover/camera:scale-110 transition-all" />
                        </button>
                        <button 
                          type="button"
                          className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 group/mic"
                          title="Voice Search"
                        >
                          <Mic className="h-5 w-5 text-slate-400 group-hover/mic:text-indigo-600 group-hover/mic:scale-110 transition-all" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Search Button - Desktop */}
                    <Button 
                      type="submit" 
                      disabled={loading || !searchQuery.trim()}
                      className="h-14 lg:h-16 px-6 lg:px-10 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-2xl text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group/search mr-2"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="mr-2 h-5 w-5 group-hover/search:scale-110 transition-transform" />
                      )}
                      <span className="hidden sm:inline">Search</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Search Suggestions */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-slate-500">Try:</span>
            {["Industrial pumps", "Steel suppliers", "Electronics components", "Chemical raw materials"].map((suggestion, index) => (
              <button
                key={index}
                onClick={async () => {
                  setSearchQuery(suggestion);
                  await performSearch(suggestion, 1);
                }}
                className="text-sm bg-white/50 hover:bg-white border border-slate-200 hover:border-indigo-300 px-3 py-1 rounded-full text-slate-600 hover:text-indigo-600 transition-all duration-200 hover:shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div>
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {(loading || products.length > 0 || searchQuery) && (
                  <p className="text-slate-600 text-lg">
                    {loading ? 'Searching...' : 
                     products.length > 0 ? `Found ${total.toLocaleString()} results${searchQuery ? ` for "${searchQuery}"` : ''}` :
                     searchQuery ? `No results found for "${searchQuery}"` : ''}
                  </p>
                )}
                {searchQuery && (
                  <p className="text-sm text-slate-500 mt-1">Search query: &ldquo;{searchQuery}&rdquo;</p>
                )}
              </div>
              {products.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Sort by:</span>
                  <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Relevance</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                  </select>
                </div>
              )}
            </div>
          </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">Error: {error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-slate-600">Searching products...</span>
              </div>
            ) : products.length === 0 && searchQuery ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your search terms or removing filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {products.map((product) => (
                  <SearchResultCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && Math.ceil(total / 12) > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, Math.ceil(total / 12)) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className={currentPage === page ? "bg-indigo-600" : ""}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline"
                    disabled={currentPage >= Math.ceil(total / 12)}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
            <p className="text-slate-600">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchResultCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-slate-200 group">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <Link href={`/products/${product.id}`} className="w-full sm:w-24 h-24 flex-shrink-0 relative">
          {product.main_image ? (
            <img 
              src={product.main_image} 
              alt={product.title || 'Product image'}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-slate-400" />
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <Link href={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors group-hover:text-indigo-600">
                  {stripHtmlTags(product.title || 'Product Title')}
                </h3>
              </Link>
              
              {product.supplier && (
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <span className="font-medium text-sm">{stripHtmlTags(product.supplier.name)}</span>
                  {product.supplier.score && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-slate-500">{product.supplier.score.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {product.price_display_string && (
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-indigo-600">{product.price_display_string}</div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              {product.supplier && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  ✓ Verified
                </span>
              )}
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                {stripHtmlTags(product.mcat_name || 'Category')}
              </span>
            </div>
            
            <Link href={`/products/${product.id}`}>
              <Button 
                size="sm" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}