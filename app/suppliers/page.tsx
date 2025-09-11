'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Shield, Award, Filter, Users, Building, Globe, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getSuppliers, getSupplierStats, testSupabaseConnection, type SupplierWithProducts } from "@/lib/api/suppliers";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierWithProducts[]>([]);
  const [stats, setStats] = useState({ totalSuppliers: 0, activeSuppliers: 0, countriesCount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [connectionTested, setConnectionTested] = useState(false);

  const loadSuppliers = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    const result = await getSuppliers({ page, limit: 12, search });
    if (result.error) {
      // Only set error if it's not a connection issue that was already resolved
      if (!connectionTested || result.error.includes('connection') || result.error.includes('credentials')) {
        setError(result.error);
      } else {
        // For data-related errors, just log them but don't show to user
        console.error('Data loading error:', result.error);
        setSuppliers([]);
        setTotal(0);
      }
    } else {
      setSuppliers(result.suppliers);
      setTotal(result.total);
      // Only clear error if we successfully loaded data
      if (result.suppliers.length > 0 || search.trim() === '') {
        setError(null);
      }
    }
    setLoading(false);
  }, [connectionTested]);

  const loadStats = useCallback(async () => {
    const result = await getSupplierStats();
    if (!result.error) {
      setStats(result);
    }
  }, []);

  useEffect(() => {
    const initializePage = async () => {
      // Only test connection once, not on every page change
      if (!connectionTested) {
        const connectionTest = await testSupabaseConnection();
        setConnectionTested(true);
        
        if (!connectionTest.connected) {
          setError(`Database connection failed: ${connectionTest.error}`);
          setLoading(false);
          return;
        }
      }
      
      // Load data - if connection was already tested and working, skip the test
      await loadSuppliers(currentPage, searchQuery);
      if (currentPage === 1) {
        await loadStats();
      }
    };
    
    initializePage();
  }, [currentPage, connectionTested, searchQuery, loadSuppliers, loadStats]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    await loadSuppliers(1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-cyan-50 py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Verified <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Suppliers</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Connect with trusted suppliers from around the world. All suppliers are verified and rated by our community.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suppliers by company name, location, or product..." 
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

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Building className="h-8 w-8 text-indigo-600" />}
            title="Total Suppliers"
            value={stats.totalSuppliers.toLocaleString() + '+'}
            description="Verified suppliers worldwide"
            color="bg-indigo-50"
          />
          <StatCard
            icon={<Globe className="h-8 w-8 text-cyan-600" />}
            title="Countries"
            value={stats.countriesCount + '+'}
            description="Global supplier network"
            color="bg-cyan-50"
          />
          <StatCard
            icon={<Users className="h-8 w-8 text-green-600" />}
            title="Active This Month"
            value={stats.activeSuppliers.toLocaleString() + '+'}
            description="Suppliers actively trading"
            color="bg-green-50"
          />
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
              </div>
              
              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Location</h4>
                  <div className="space-y-2">
                    {["India", "China", "USA", "Germany", "UAE"].map((country) => (
                      <label key={country} className="flex items-center">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 mr-2" />
                        <span className="text-slate-600">{country}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Industry Filter */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Industry</h4>
                  <div className="space-y-2">
                    {["Manufacturing", "Trading", "Export/Import", "Services"].map((industry) => (
                      <label key={industry} className="flex items-center">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 mr-2" />
                        <span className="text-slate-600">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Certification Filter */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Certifications</h4>
                  <div className="space-y-2">
                    {["ISO 9001", "ISO 14001", "CE Certified", "FDA Approved"].map((cert) => (
                      <label key={cert} className="flex items-center">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 mr-2" />
                        <span className="text-slate-600">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suppliers List */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-slate-600">
                {loading ? 'Loading...' : `Showing ${suppliers.length} of ${total.toLocaleString()} suppliers`}
              </p>
              <select className="px-4 py-2 border border-slate-300 rounded-lg">
                <option>Sort by Relevance</option>
                <option>Sort by Rating</option>
                <option>Sort by Experience</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-red-800 mb-2">Database Connection Error</h4>
                <p className="text-red-600 mb-3">{error}</p>
                {error.includes('Database connection failed') && (
                  <div className="text-sm text-red-700 mb-3">
                    <p>Please check:</p>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      <li>Supabase credentials are set in your .env file</li>
                      <li>NEXT_PUBLIC_SUPABASE_URL is correct</li>
                      <li>NEXT_PUBLIC_SUPABASE_ANON_KEY is correct</li>
                      <li>Your Supabase project is active</li>
                    </ul>
                  </div>
                )}
                <Button 
                  onClick={async () => {
                    setError(null);
                    setConnectionTested(false); // Reset connection test
                    setLoading(true);
                    
                    // Test connection again
                    const connectionTest = await testSupabaseConnection();
                    setConnectionTested(true);
                    
                    if (connectionTest.connected) {
                      // If connection is successful, load data
                      await loadSuppliers(currentPage, searchQuery);
                      await loadStats();
                    } else {
                      setError(`Database connection failed: ${connectionTest.error}`);
                      setLoading(false);
                    }
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  Retry Connection
                </Button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-slate-600">Loading suppliers...</span>
              </div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No suppliers found</h3>
                <p className="text-slate-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'No suppliers available at the moment'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {suppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && suppliers.length > 0 && (
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

function StatCard({ 
  icon, 
  title, 
  value, 
  description, 
  color 
}: { 
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 ${color} rounded-xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: SupplierWithProducts }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-xl flex items-center justify-center">
            <Building className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{supplier.name}</h3>
            {supplier.address && (
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{supplier.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < (supplier.score || 0) ? 'text-yellow-400 fill-current' : 'text-slate-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">
                ({supplier.score?.toFixed(1) || 'N/A'}) • {supplier.product_count || 0} products
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              {supplier.phone_number ? `Phone: ${supplier.phone_number}` : 'Contact details available'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 mb-1">Response Rate</div>
          <div className="text-lg font-bold text-indigo-600">
            {supplier.response_rate ? `${supplier.response_rate}%` : 'N/A'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Verified
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
            <Award className="h-3 w-3" />
            Trusted Seller
          </span>
        </div>
        <div className="text-sm text-slate-500">
          {supplier.website_url ? 'Website Available' : 'Contact for more info'}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-slate-500 mb-1">Member since</div>
            <div className="text-sm font-semibold text-slate-700">
              {new Date(supplier.created_at).getFullYear()}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/suppliers/${supplier.id}`}>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </Link>
            <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}