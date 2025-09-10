import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Clock, Users, CheckCircle, PlusCircle, Upload } from "lucide-react";

export default function RFQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-cyan-50 py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Request for <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Quotation</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get competitive quotes from verified suppliers for your business requirements
            </p>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New RFQ
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<FileText className="h-8 w-8 text-indigo-600" />}
            title="Active RFQs"
            value="1,245"
            description="Currently open for quotes"
            color="bg-indigo-50"
          />
          <StatCard
            icon={<Clock className="h-8 w-8 text-amber-600" />}
            title="Avg Response Time"
            value="4.2 hrs"
            description="Average supplier response"
            color="bg-amber-50"
          />
          <StatCard
            icon={<Users className="h-8 w-8 text-cyan-600" />}
            title="Participating Suppliers"
            value="3,500+"
            description="Verified suppliers ready to quote"
            color="bg-cyan-50"
          />
          <StatCard
            icon={<CheckCircle className="h-8 w-8 text-green-600" />}
            title="Success Rate"
            value="94%"
            description="RFQs successfully fulfilled"
            color="bg-green-50"
          />
        </div>

        {/* RFQ Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New RFQ</h2>
            <p className="text-slate-600">Fill in the details below to get quotes from our verified suppliers</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product/Service Name</label>
                <Input 
                  placeholder="e.g., Industrial Steel Pipes"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select className="w-full h-12 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Select Category</option>
                  <option>Industrial Equipment</option>
                  <option>Raw Materials</option>
                  <option>Electronics</option>
                  <option>Chemicals</option>
                  <option>Office Supplies</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Description</label>
              <textarea 
                className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Provide detailed specifications, quantity, quality requirements, delivery timeline, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                <Input 
                  placeholder="e.g., 1000 units"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Price Range</label>
                <Input 
                  placeholder="e.g., ₹50,000 - ₹75,000"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Location</label>
                <Input 
                  placeholder="e.g., Mumbai, Maharashtra"
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Required By Date</label>
                <Input 
                  type="date"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quote Deadline</label>
                <Input 
                  type="date"
                  className="h-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Attach Documents (Optional)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">Click to upload technical drawings, specifications, or other documents</p>
                <p className="text-sm text-slate-400 mt-1">PDF, DOC, JPG up to 10MB</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button"
                variant="outline"
                size="lg"
                className="px-8"
              >
                Save as Draft
              </Button>
              <Button 
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 px-8"
              >
                Publish RFQ
              </Button>
            </div>
          </form>
        </div>

        {/* Recent RFQs */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent RFQs</h2>
          <div className="grid gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <RFQCard key={i} />
            ))}
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className={`inline-flex items-center justify-center w-12 h-12 ${color} rounded-xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}

function RFQCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Industrial Steel Pipes - Grade A</h3>
          <p className="text-slate-600 mb-2">Quantity: 500 units | Location: Mumbai</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Posted: 2 days ago</span>
            <span>Deadline: 5 days left</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 mb-1">Expected Budget</div>
          <div className="text-xl font-bold text-indigo-600">₹2,50,000</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Active</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">12 Quotes</span>
        </div>
        <Button variant="outline">
          View Details
        </Button>
      </div>
    </div>
  );
}
