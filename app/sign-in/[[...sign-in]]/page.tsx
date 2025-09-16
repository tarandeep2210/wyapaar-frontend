import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
      
      {/* Main container with proper centering */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
        {/* Custom Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-xl sm:text-2xl">W</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 px-2 leading-tight">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Wyapaar
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg px-2">
            Sign in to continue to your account
          </p>
        </div>

        {/* Custom styled Clerk SignIn - Centered container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 mx-auto clerk-hide-footer">
          <div className="flex justify-center">
            <SignIn 
              forceRedirectUrl="/user"
              fallbackRedirectUrl="/user"
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-sm mx-auto",
                  card: "bg-transparent shadow-none border-0 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 rounded-xl h-12 sm:h-14 font-semibold text-sm sm:text-base min-h-[48px] touch-manipulation",
                  socialButtonsBlockButtonText: "text-slate-700 font-semibold",
                  dividerLine: "bg-slate-200",
                  dividerText: "text-slate-500 font-medium text-sm",
                  formFieldInput: "border-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl h-12 sm:h-14 text-sm sm:text-base bg-white/50 backdrop-blur-sm transition-all duration-200 min-h-[48px] touch-manipulation px-4",
                  formFieldLabel: "text-slate-700 font-semibold text-sm mb-2",
                  formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-xl h-12 sm:h-14 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base min-h-[48px] touch-manipulation",
                  formFieldSuccessText: "text-emerald-600 text-sm",
                  formFieldErrorText: "text-red-500 text-sm",
                  identityPreviewText: "text-slate-600 text-sm",
                  identityPreviewEditButton: "text-indigo-600 hover:text-indigo-700 text-sm",
                  footer: "!hidden",
                  footerAction: "!hidden",
                  footerActionLink: "!hidden",
                  footerActionText: "!hidden",
                  footerPages: "!hidden"
                },
                layout: {
                  socialButtonsPlacement: "top",
                  socialButtonsVariant: "blockButton"
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 px-2">
          <p className="text-slate-500 text-sm sm:text-base">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors touch-manipulation">
              Get Started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
