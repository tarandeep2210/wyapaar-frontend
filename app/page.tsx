import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Suppliers and Products
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Your AI-Powered B2B Marketplace for seamless sourcing.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex">
              <Input 
                type="text" 
                placeholder="Search for products or suppliers..." 
                className="flex-1 h-14 text-lg border-2 border-gray-200 rounded-l-lg focus:border-blue-500 focus:ring-0"
              />
              <Button 
                type="submit" 
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 rounded-r-lg rounded-l-none text-lg font-medium"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <CategoryCard
              title="Industrial Equipment"
              bgColor="bg-gradient-to-br from-emerald-400 to-emerald-600"
              icon="🏭"
              href="/categories/industrial"
            />
            <CategoryCard
              title="Raw Materials"
              bgColor="bg-gradient-to-br from-amber-400 to-orange-500"
              icon="🌾"
              href="/categories/raw-materials"
            />
            <CategoryCard
              title="Electronics"
              bgColor="bg-gradient-to-br from-blue-500 to-blue-700"
              icon="💻"
              href="/categories/electronics"
            />
            <CategoryCard
              title="Office Supplies"
              bgColor="bg-gradient-to-br from-green-400 to-green-600"
              icon="📋"
              href="/categories/office"
            />
            <CategoryCard
              title="Chemicals"
              bgColor="bg-gradient-to-br from-purple-500 to-purple-700"
              icon="🧪"
              href="/categories/chemicals"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            How TradeConnect Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              step="1"
              title="Search & Discover"
              description="Find suppliers and products that meet your business needs."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <FeatureCard
              step="2"
              title="Connect & Negotiate"
              description="Connect with suppliers directly to discuss your requirements."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              }
            />
            <FeatureCard
              step="3"
              title="Transact & Manage"
              description="Securely transact and manage your orders through our platform."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to start sourcing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses finding their perfect suppliers.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-4 text-lg font-semibold rounded-lg"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ 
  title, 
  bgColor, 
  icon, 
  href 
}: { 
  title: string; 
  bgColor: string; 
  icon: string; 
  href: string; 
}) {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className={`${bgColor} h-32 flex items-center justify-center text-4xl`}>
          {icon}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm text-center group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ 
  step, 
  title, 
  description, 
  icon 
}: { 
  step: string; 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {step}. {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}