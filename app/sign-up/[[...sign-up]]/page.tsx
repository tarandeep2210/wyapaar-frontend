import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center py-6 sm:py-12 px-4">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
      <div className="relative w-full max-w-md">
        {/* Custom Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-xl sm:text-2xl">W</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 px-2">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Wyapaar
            </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg px-2">
            Create your account and start connecting with trusted suppliers
          </p>
        </div>

        {/* Custom styled Clerk SignUp */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-8">
          <SignUp 
            forceRedirectUrl="/user"
            fallbackRedirectUrl="/user"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 rounded-xl h-12 font-semibold",
                socialButtonsBlockButtonText: "text-slate-700 font-semibold",
                dividerLine: "bg-slate-200",
                dividerText: "text-slate-500 font-medium",
                formFieldInput: "border-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl h-12 text-base bg-white/50 backdrop-blur-sm transition-all duration-200",
                formFieldLabel: "text-slate-700 font-semibold text-sm",
                formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-xl h-12 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-base",
                footerActionLink: "text-indigo-600 hover:text-indigo-700 font-semibold",
                formFieldSuccessText: "text-emerald-600",
                formFieldErrorText: "text-red-500",
                identityPreviewText: "text-slate-600",
                identityPreviewEditButton: "text-indigo-600 hover:text-indigo-700",
                formFieldHintText: "text-slate-500 text-sm",
                formFieldWarningText: "text-amber-600"
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton"
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 px-2">
          <p className="text-slate-500 text-sm sm:text-base">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Benefits Section - Hidden on small mobile screens to save space */}
        <div className="mt-8 sm:mt-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 sm:p-6 hidden sm:block">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 text-center">
            Why choose Wyapaar?
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex-shrink-0"></div>
              <span className="text-slate-600 text-sm sm:text-base">Connect with 10K+ verified suppliers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex-shrink-0"></div>
              <span className="text-slate-600 text-sm sm:text-base">AI-powered product matching</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex-shrink-0"></div>
              <span className="text-slate-600 text-sm sm:text-base">Secure transactions & payments</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex-shrink-0"></div>
              <span className="text-slate-600 text-sm sm:text-base">24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
