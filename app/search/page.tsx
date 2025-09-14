'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Filter, MapPin, Star, Mic, Loader2, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { searchProducts, getCategories, type Product, type Category } from "@/lib/api/categories";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Load categories for filters
    const loadCategories = async () => {
      const result = await getCategories();
      if (!result.error) {
        setCategories(result.categories.slice(0, 10)); // Show top 10 categories
      }
    };
    loadCategories();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setCurrentPage(1);
    
    const result = await searchProducts(searchQuery, { 
      page: 1, 
      limit: 12, 
      category: selectedCategory 
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
  };

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    setCurrentPage(newPage);
    
    const result = await searchProducts(searchQuery, { 
      page: newPage, 
      limit: 12, 
      category: selectedCategory 
    });
    
    if (!result.error) {
      setProducts(result.products);
      setTotal(result.total);
    }
    
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryFilter = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (searchQuery.trim()) {
      setLoading(true);
      setCurrentPage(1);
      
      const result = await searchProducts(searchQuery, { 
        page: 1, 
        limit: 12, 
        category: categoryId 
      });
      
      if (!result.error) {
        setProducts(result.products);
        setTotal(result.total);
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-cyan-50 py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              AI-Powered <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Search</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find exactly what you&apos;re looking for with our intelligent search technology
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative">
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  disabled={loading || !searchQuery.trim()}
                  className="h-16 px-10 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-r-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group/search"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-5 w-5 group-hover/search:scale-110 transition-transform" />
                  )}
                  Search
                </Button>
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
                  handleSearch(new Event('submit') as any);
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
              </div>
              
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="category"
                        value=""
                        checked={selectedCategory === ''}
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                        className="text-indigo-600 mr-2" 
                      />
                      <span className="text-slate-600">All Categories</span>
                    </label>
                    {categories.slice(0, 8).map((category) => (
                      <label key={category.mcat_id} className="flex items-center">
                        <input 
                          type="radio" 
                          name="category"
                          value={category.mcat_id}
                          checked={selectedCategory === category.mcat_id}
                          onChange={(e) => handleCategoryFilter(e.target.value)}
                          className="text-indigo-600 mr-2" 
                        />
                        <span className="text-slate-600 text-sm">{stripHtmlTags(category.mcat_name)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Location</h4>
                  <div className="space-y-2">
                    {["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune"].map((city) => (
                      <label key={city} className="flex items-center">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 mr-2" />
                        <span className="text-slate-600">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-slate-600">
                {loading ? 'Searching...' : 
                 products.length > 0 ? `Found ${total.toLocaleString()} results${searchQuery ? ` for "${searchQuery}"` : ''}` :
                 searchQuery ? `No results found for "${searchQuery}"` : 'Enter a search query to find products'}
              </p>
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
              <div className="grid gap-6">
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
    </div>
  );
}

function SearchResultCard({ product }: { product: Product }) {

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200">
      <div className="flex gap-6">
        {/* Product Image */}
        <Link href={`/products/${product.id}`} className="w-32 h-32 flex-shrink-0">
          {product.main_image ? (
            <img 
              src={product.main_image} 
              alt={product.title || 'Product image'}
              className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-slate-200 hover:to-slate-300 transition-all cursor-pointer">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Link href={`/products/${product.id}`}>
                <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors">
                  {stripHtmlTags(product.title || 'Product Title')}
                </h3>
              </Link>
              {product.supplier && (
                <div className="text-slate-600 mb-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{stripHtmlTags(product.supplier.name)}</span>
                  </div>
                  {product.supplier.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 opacity-50" />
                      <span className="text-sm text-slate-500">
                        {stripHtmlTags(product.supplier.address.split(',').slice(-2).join(',').trim())}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < (product.supplier?.score || 0) ? 'text-yellow-400 fill-current' : 'text-slate-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  ({product.supplier?.score?.toFixed(1) || 'N/A'})
                </span>
              </div>
            </div>
            <div className="text-right">
              {product.price_display_string && (
                <>
                  <div className="text-sm text-slate-500 mb-1">Price</div>
                  <div className="text-2xl font-bold text-indigo-600">{product.price_display_string}</div>
                </>
              )}
            </div>
          </div>
          
          {product.description && (
            <p className="text-slate-600 mb-4 line-clamp-2">
              {stripHtmlTags(product.description)}
            </p>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {stripHtmlTags(product.mcat_name || 'Category')}
              </span>
              {product.supplier && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Verified Supplier</span>
              )}
            </div>
            <Link href={`/products/${product.id}`}>
              <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}