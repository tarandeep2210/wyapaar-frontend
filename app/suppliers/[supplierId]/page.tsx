'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Shield, 
  Award, 
  Calendar,
  Package,
  ArrowLeft,
  ExternalLink,
  Mail,
  Users,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSupplierById, type SupplierWithProducts } from "@/lib/api/suppliers";
import { type Product } from "@/lib/api/categories";

export default function SupplierProfilePage() {
  const params = useParams();
  const router = useRouter();
  const supplierId = parseInt(params.supplierId as string);
  
  const [supplier, setSupplier] = useState<SupplierWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'about'>('products');

  useEffect(() => {
    const loadSupplier = async () => {
      if (!supplierId || isNaN(supplierId)) {
        setError('Invalid supplier ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getSupplierById(supplierId);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSupplier(result.supplier);
        setError(null);
      }
      setLoading(false);
    };

    loadSupplier();
  }, [supplierId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading supplier profile...</p>
        </div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Building className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Supplier not found</h3>
          <p className="text-slate-500 mb-4">{error || 'The requested supplier profile could not be found.'}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-cyan-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Suppliers
            </Button>
          </div>

          {/* Supplier Header */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Basic Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6">
                {/* Company Logo/Icon */}
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Building className="h-10 w-10 text-indigo-600" />
                </div>

                {/* Company Details */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{supplier.name}</h1>
                  
                  {supplier.address && (
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                      <MapPin className="h-5 w-5" />
                      <span>{supplier.address}</span>
                    </div>
                  )}

                  {supplier.phone_number && (
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                      <Phone className="h-5 w-5" />
                      <span>{supplier.phone_number}</span>
                    </div>
                  )}

                  {supplier.website_url && (
                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                      <Globe className="h-5 w-5" />
                      <a 
                        href={supplier.website_url.startsWith('http') ? supplier.website_url : `https://${supplier.website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
                      >
                        Visit Website
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}

                  {/* Rating */}
                  {supplier.score && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${
                              i < supplier.score! ? 'text-yellow-400 fill-current' : 'text-slate-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-slate-700">
                        {supplier.score.toFixed(1)} out of 5
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Supplier
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      <Award className="h-3 w-3 mr-1" />
                      Trusted Seller
                    </Badge>
                    {supplier.website_url && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                        <Globe className="h-3 w-3 mr-1" />
                        Website Available
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Supplier Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Response Rate</span>
                    <span className="text-lg font-semibold text-indigo-600">
                      {supplier.response_rate ? `${supplier.response_rate}%` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Products Listed</span>
                    <span className="text-lg font-semibold text-cyan-600">
                      {supplier.products?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Member Since</span>
                    <span className="text-lg font-semibold text-slate-700">
                      {new Date(supplier.created_at).getFullYear()}
                    </span>
                  </div>

                  {supplier.score && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Overall Rating</span>
                      <span className="text-lg font-semibold text-yellow-600">
                        {supplier.score.toFixed(1)}/5.0
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Supplier
                  </Button>
                  
                  {supplier.website_url && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(
                        supplier.website_url!.startsWith('http') 
                          ? supplier.website_url! 
                          : `https://${supplier.website_url!}`, 
                        '_blank'
                      )}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Products ({supplier.products?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'about'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="h-4 w-4 inline mr-2" />
            About Company
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' ? (
          <ProductsTab products={supplier.products || []} />
        ) : (
          <AboutTab supplier={supplier} />
        )}
      </div>
    </div>
  );
}

function ProductsTab({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No products listed</h3>
        <p className="text-slate-500">This supplier hasn't listed any products yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Products & Services</h2>
        <p className="text-slate-600">Browse all products offered by this supplier</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function AboutTab({ supplier }: { supplier: SupplierWithProducts }) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">About {supplier.name}</h2>
        <p className="text-slate-600">Learn more about this supplier and their business</p>
      </div>

      {/* Company About Information */}
      {supplier.about && supplier.about.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">About the Company</h3>
            <div className="space-y-4">
              {supplier.about.map((aboutItem) => (
                <div key={aboutItem.id}>
                  <h4 className="font-medium text-slate-700 mb-2">{aboutItem.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{aboutItem.data}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Company Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Company Name</label>
              <p className="text-slate-900 font-medium">{supplier.name}</p>
            </div>
            
            {supplier.address && (
              <div>
                <label className="text-sm font-medium text-slate-500">Address</label>
                <p className="text-slate-900">{supplier.address}</p>
              </div>
            )}
            
            {supplier.phone_number && (
              <div>
                <label className="text-sm font-medium text-slate-500">Phone</label>
                <p className="text-slate-900">{supplier.phone_number}</p>
              </div>
            )}
            
            {supplier.website_url && (
              <div>
                <label className="text-sm font-medium text-slate-500">Website</label>
                <a 
                  href={supplier.website_url.startsWith('http') ? supplier.website_url : `https://${supplier.website_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
                >
                  {supplier.website_url}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-slate-500">Member Since</label>
              <p className="text-slate-900">
                {new Date(supplier.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Metrics</h3>
          
          <div className="space-y-4">
            {supplier.score && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="font-medium text-slate-900">Overall Rating</p>
                    <p className="text-sm text-slate-600">Based on customer reviews</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {supplier.score.toFixed(1)}
                </span>
              </div>
            )}
            
            {supplier.response_rate && (
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium text-slate-900">Response Rate</p>
                    <p className="text-sm text-slate-600">Average response time</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {supplier.response_rate}%
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium text-slate-900">Products Listed</p>
                  <p className="text-sm text-slate-600">Total active listings</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {supplier.products?.length || 0}
              </span>
            </div>
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
      <div className="h-48 relative overflow-hidden">
        {product.main_image ? (
          <img 
            src={product.main_image} 
            alt={product.title || 'Product image'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Package className="h-16 w-16 text-slate-400" />
          </div>
        )}
        
        {/* Price Badge */}
        {product.price_display_string && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-indigo-600">{product.price_display_string}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.title || 'Product Title'}
        </h3>
        
        {product.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-3">
            {product.description}
          </p>
        )}

        {product.mcat_name && (
          <div className="mb-4">
            <Badge variant="secondary" className="text-xs">
              {product.mcat_name}
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button size="sm" className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
            Inquiry
          </Button>
        </div>
      </div>
    </div>
  );
}
