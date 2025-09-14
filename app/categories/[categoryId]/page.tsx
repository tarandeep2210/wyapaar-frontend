'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, MapPin, Building, Package, ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductsByCategory, searchProducts, type Product } from "@/lib/api/categories";
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
  const [priceFilter, setPriceFilter] = useState('');

  const loadProducts = async (page = 1, search = '') => {
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
    } catch (err) {
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(currentPage, searchQuery);
  }, [categoryId, currentPage]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    await loadProducts(1, searchQuery);
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

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${categoryName || 'this category'}...`}
                className="h-14 pl-12 pr-4 text-lg border-2 border-slate-200 focus:border-indigo-500 rounded-xl"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="absolute right-2 top-2 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
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
                {/* Sort By */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Sort By</h4>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="created_at">Newest First</option>
                    <option value="title">Name A-Z</option>
                    <option value="price">Price Low to High</option>
                  </select>
                </div>

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

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-slate-600">
                {loading ? 'Loading...' : `Showing ${products.length} of ${total.toLocaleString()} products`}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Grid View
                </Button>
              </div>
            </div>

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

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-slate-600">Loading products...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
