'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Package, 
  Truck, 
  Shield, 
  MessageCircle,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { supabase, type Product, type ProductImage, type ProductSpecification } from "@/lib/supabase";
import Link from 'next/link';
import { stripHtmlTags } from "@/lib/utils/text";

interface ProductDetails extends Product {
  images: ProductImage[];
  specifications: ProductSpecification[];
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch product with supplier details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          supplier:suppliers(*)
        `)
        .eq('id', productId)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        setError('Product not found');
        return;
      }

      // Fetch product images
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId);

      // Fetch product specifications
      const { data: specificationsData, error: specificationsError } = await supabase
        .from('product_specifications')
        .select('*')
        .eq('product_id', productId);

      if (imagesError) {
        console.error('Error fetching images:', imagesError);
      }

      if (specificationsError) {
        console.error('Error fetching specifications:', specificationsError);
      }

      setProduct({
        ...productData,
        images: imagesData || [],
        specifications: specificationsData || []
      });

    } catch (err) {
      console.error('Error in fetchProductDetails:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">Product Not Found</h2>
          <p className="text-slate-500 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const allImages = [
    ...(product.main_image ? [{ full_url: product.main_image, medium_url: product.main_image }] : []),
    ...product.images
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              {allImages.length > 0 ? (
                <>
                  <div className="aspect-square relative">
                    <img
                      src={allImages[currentImageIndex]?.full_url || allImages[currentImageIndex]?.medium_url}
                      alt={product.title || 'Product image'}
                      className="w-full h-full object-cover"
                    />
                    
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {allImages.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex ? 'border-indigo-500' : 'border-slate-200'
                          }`}
                        >
                          <img
                            src={image.medium_url || image.full_url}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <Package className="h-24 w-24 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {stripHtmlTags(product.title || 'Product Title')}
                  </h1>
                  {product.mcat_name && (
                    <Badge variant="secondary" className="mb-2">
                      {stripHtmlTags(product.mcat_name)}
                    </Badge>
                  )}
                </div>
                {product.price_display_string && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">
                      {product.price_display_string}
                    </div>
                    {product.price_unit && (
                      <div className="text-sm text-slate-500">
                        per {product.price_unit}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {product.description && (
                <p className="text-slate-600 text-lg leading-relaxed">
                  {stripHtmlTags(product.description)}
                </p>
              )}
            </div>

            {/* Supplier Information */}
            {product.supplier && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Supplier Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800">{stripHtmlTags(product.supplier.name)}</h4>
                    {product.supplier.score && (
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < product.supplier.score ? 'text-yellow-400 fill-current' : 'text-slate-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600 ml-1">
                          ({product.supplier.score?.toFixed(1)})
                        </span>
                      </div>
                    )}
                  </div>

                  {product.supplier.address && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{stripHtmlTags(product.supplier.address)}</span>
                    </div>
                  )}

                  {product.supplier.phone_number && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{stripHtmlTags(product.supplier.phone_number)}</span>
                    </div>
                  )}

                  {product.supplier.website_url && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={product.supplier.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {product.supplier.response_rate && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MessageCircle className="h-4 w-4" />
                      <span>{product.supplier.response_rate}% Response Rate</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Supplier
                  </Button>
                  <Link href="/rfq" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Request Quote
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Product Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Specifications</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="font-medium text-slate-700">{spec.key}</span>
                      <span className="text-slate-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Why Choose This Product?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-slate-600">Verified Supplier</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-slate-600">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <span className="text-slate-600">Quality Assured</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-indigo-600" />
                  <span className="text-slate-600">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
