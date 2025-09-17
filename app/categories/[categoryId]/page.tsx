'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, MapPin, Building, Package, ArrowLeft, Loader2, ShoppingCart, ChevronDown, Sparkles, Mic } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import type { CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductsByCategory, searchProducts } from "@/lib/api/categories";
import { type Product } from "@/lib/supabase";
import { stripHtmlTags } from "@/lib/utils/text";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [showFilters, setShowFilters] = useState(false);
  // const [priceFilter, setPriceFilter] = useState(''); // Unused state

  // Animation state to move header search bar to bottom
  const [hasSearched, setHasSearched] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ghostStyle, setGhostStyle] = useState<CSSProperties | null>(null);
  const headerBarRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const bottomInputRef = useRef<HTMLInputElement | null>(null);

  // Start header -> bottom transition (used on first type or submit)
  const startBarTransition = useCallback(() => {
    try {
      const el = headerBarRef.current;
      if (!el || hasSearched) return;

      const rect = el.getBoundingClientRect();
      const height = rect.height;
      const initial: CSSProperties = {
        position: 'fixed',
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height,
        zIndex: 60,
        transition: 'transform 320ms ease-out, opacity 320ms ease-out',
        transform: 'translate3d(0,0,0)',
        opacity: 1,
      };
      setGhostStyle(initial);
      setIsAnimating(true);

      const targetTop = window.innerHeight - height - 16;
      requestAnimationFrame(() => {
        setGhostStyle((s) => s ? {
          ...s,
          transform: `translate3d(0px, ${targetTop - rect.top}px, 0)`,
          opacity: 0.98,
        } : null);
      });

      window.setTimeout(() => {
        setIsAnimating(false);
        setGhostStyle(null);
        setHasSearched(true);
        // Re-focus bottom input without scrolling
        bottomInputRef.current?.focus({ preventScroll: true });
      }, 320);

      // Do not scroll during the transition to avoid input blur on mobile
    } catch {}
  }, [hasSearched]);

  const loadProducts = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      let result;
      if (search.trim()) {
        // If searching, use search API with category filter
        result = await searchProducts(search, { page, limit: 12, category: categoryId });
      } else {
        // Otherwise, get products by category
        result = await getProductsByCategory(categoryId, { page, limit: 12 });
      }

      if (result.error) {
        setError(result.error);
        setProducts([]);
      } else {
        setProducts(result.products);
        setTotal(result.total);
        setError(null);
        
        // Set category name from first product if available
        if (result.products.length > 0 && result.products[0].mcat_name) {
          setCategoryName(result.products[0].mcat_name);
        }
      }
    } catch {
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadProducts(currentPage, searchQuery);
  }, [categoryId, currentPage, searchQuery, loadProducts]);

  // On open: show bottom search bar and focus product list area (good for mobile)
  useEffect(() => {
    setHasSearched(true);
    // Smoothly bring products into view after first paint
    const id = window.setTimeout(() => {
      const y = resultsRef.current?.offsetTop ?? 0;
      window.scrollTo({ top: Math.max(0, y - 12), behavior: 'smooth' });
    }, 80);
    return () => window.clearTimeout(id);
  }, [categoryId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);

    // Ensure the transition is started if not already
    startBarTransition();

    // Run search concurrently; do not block animation
    void loadProducts(1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-cyan-50 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {categoryName || 'Category'} <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Products</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover high-quality {categoryName?.toLowerCase() || 'products'} from verified suppliers
            </p>
            {!loading && (
              <p className="text-lg text-slate-500 mt-4">
                {total.toLocaleString()} products available
              </p>
            )}
          </div>

          {/* Search Bar - only show in header until first search */}
          {!hasSearched && (
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div ref={headerBarRef} className={`relative ${isAnimating ? 'opacity-0' : ''}`}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim().length === 1) {
                      // Start the transition as soon as user begins typing
                      startBarTransition();
                    }
                  }}
                  placeholder={`Search in ${categoryName || 'this category'}...`}
                  className="h-14 pl-12 pr-16 text-lg border-2 border-slate-200 focus:border-indigo-500 rounded-xl"
                  autoComplete="off"
                  inputMode="search"
                  onBlur={(evt) => {
                    // If animation is in progress, immediately re-focus to avoid losing focus
                    if (isAnimating) {
                      evt.preventDefault();
                      (evt.target as HTMLInputElement).focus({ preventScroll: true });
                    }
                  }}
                  onKeyDown={(e) => {
                    // Prevent Enter from submitting and losing focus during animation
                    if (isAnimating && e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  size="sm"
                  className="absolute right-2 top-2 h-10 w-10 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 p-0"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Content */}
      <div ref={resultsRef} className={`max-w-7xl mx-auto px-4 py-8 ${hasSearched ? 'pb-48 sm:pb-40' : ''}`}>
        {/* Mobile Filter Button & Desktop Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-slate-600 order-2 sm:order-1">
              {loading ? 'Loading...' : `Showing ${products.length} of ${total.toLocaleString()} products`}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
              {/* Mobile Filter Toggle Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 sm:hidden w-full"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              {/* Sort Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
              >
                <option value="created_at">Newest First</option>
                <option value="title">Name A-Z</option>
                <option value="price">Price Low to High</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Dropdown */}
          <div className={`sm:hidden mt-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
              <div className="grid grid-cols-1 gap-4">
                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Price Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["Under ₹1,000", "₹1,000 - ₹10,000", "₹10,000 - ₹50,000", "Above ₹50,000"].map((range) => (
                      <label key={range} className="flex items-center text-sm">
                        <input type="radio" name="price" className="text-indigo-600 mr-2" />
                        <span className="text-slate-600">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Supplier Location */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Supplier Location</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune"].map((city) => (
                      <label key={city} className="flex items-center text-sm">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 mr-2" />
                        <span className="text-slate-600">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Filter Sidebar + Grid - render only when products exist */}
          {products.length > 0 && (
          <div className="hidden sm:flex gap-8 mt-8">
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {["Under ₹1,000", "₹1,000 - ₹10,000", "₹10,000 - ₹50,000", "Above ₹50,000"].map((range) => (
                        <label key={range} className="flex items-center">
                          <input type="radio" name="price" className="text-indigo-600 mr-2" />
                          <span className="text-slate-600 text-sm">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Supplier Location */}
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-3">Supplier Location</h4>
                    <div className="space-y-2">
                      {["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune"].map((city) => (
                        <label key={city} className="flex items-center">
                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 mr-2" />
                          <span className="text-slate-600 text-sm">{city}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid - Desktop */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Error Handling - Shared for both mobile and desktop */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error: {error}</p>
            <Button 
              onClick={() => loadProducts(currentPage, searchQuery)} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading State - Shared for both mobile and desktop */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-slate-600">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No products found</h3>
            <p className="text-slate-500">
              {searchQuery ? 'Try adjusting your search terms or filters' : 'No products available in this category'}
            </p>
            {searchQuery && (
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  loadProducts(1, '');
                }}
                variant="outline" 
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Products Grid */}
            <div className="sm:hidden">
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination - Shared for both mobile and desktop */}
        {!loading && products.length > 0 && Math.ceil(total / 12) > 1 && (
          <div className="flex justify-center mt-8 sm:mt-12">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                size="sm"
                className="text-sm sm:text-base"
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, Math.ceil(total / 12)) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className={`${currentPage === page ? "bg-indigo-600" : ""} text-sm sm:text-base`}
                    onClick={() => handlePageChange(page)}
                    size="sm"
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button 
                variant="outline"
                disabled={currentPage >= Math.ceil(total / 12)}
                onClick={() => handlePageChange(currentPage + 1)}
                size="sm"
                className="text-sm sm:text-base"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ghost clone for fly-down animation */}
      {isAnimating && ghostStyle && (
        <div style={ghostStyle} className="pointer-events-none">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${categoryName || 'this category'}...`}
                className="h-14 pl-12 pr-16 text-lg border-2 border-slate-200 rounded-xl"
              />
              <Button 
                type="button" 
                disabled
                size="sm"
                className="absolute right-2 top-2 h-10 w-10 bg-gradient-to-r from-indigo-600 to-cyan-600 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom sticky compact search bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-transparent z-40 transform transition-transform duration-300 ease-out will-change-transform ${
          hasSearched && !isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-2 flex items-center gap-2">
                {/* AI Badge */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-cyan-100 px-4 py-2 rounded-full">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-700">AI</span>
                </div>
                {/* Input */}
                <div className="relative flex-1 min-w-0">
                  <Input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search in ${categoryName || 'this category'}...`}
                    className="h-12 text-base border-0 bg-slate-50/50 focus:bg-white rounded-2xl focus:ring-2 focus:ring-indigo-500 pl-10 pr-24"
                    ref={bottomInputRef}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  {/* Right inline actions to mimic search page */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button type="button" className="p-2 hover:bg-slate-200 rounded-full transition-all duration-200" title="Voice Search">
                      <Mic className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                </div>
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="sm"
                  className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-xl"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 group">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="h-48 relative overflow-hidden block">
        {product.main_image ? (
          <img 
            src={product.main_image} 
            alt={product.title || 'Product image'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center cursor-pointer">
            <Package className="h-16 w-16 text-slate-400" />
          </div>
        )}
        
        {/* Price Badge */}
        {product.price_display_string && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-indigo-600">{product.price_display_string}</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 hover:text-indigo-600 cursor-pointer transition-colors">
            {stripHtmlTags(product.title || 'Product Title')}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {stripHtmlTags(product.description)}
          </p>
        )}

        {/* Supplier Info */}
        {product.supplier && (
          <div className="text-slate-500 text-sm mb-4 space-y-1">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium text-slate-600">{stripHtmlTags(product.supplier.name)}</span>
            </div>
            {product.supplier.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 opacity-50" />
                <span className="text-slate-500">
                  {stripHtmlTags(product.supplier.address.split(',').slice(-2).join(',').trim())}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Rating */}
        {product.supplier?.score && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < product.supplier!.score! ? 'text-yellow-400 fill-current' : 'text-slate-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm text-slate-600">({product.supplier.score.toFixed(1)})</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              View Details
            </Button>
          </Link>
          <Link href="/rfq" className="flex-1">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Inquiry
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
