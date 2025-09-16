'use client';

import { UserProfile, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Show loading state while authentication is being checked
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated (this shouldn't happen due to middleware, but just in case)
  if (!isSignedIn) {
    window.location.href = '/sign-in';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
      
      {/* Main container with proper centering */}
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Custom Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-xl sm:text-2xl">W</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 px-2 leading-tight">
            {user?.firstName ? `Welcome, ${user.firstName}` : 'Your'}{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Account</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg px-2">
            Manage your profile and account settings
          </p>
        </div>

        {/* Custom styled Clerk UserProfile - Centered container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 lg:p-8 mx-auto clerk-hide-footer">
          <div className="flex justify-center">
            <UserProfile 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-4xl mx-auto",
                  card: "bg-transparent shadow-none border-0 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  navbar: "bg-slate-50 rounded-xl border border-slate-200",
                  navbarButton: "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200",
                  navbarButtonActive: "bg-indigo-100 text-indigo-700 font-semibold",
                  pageScrollBox: "bg-transparent",
                  page: "bg-transparent",
                  formFieldInput: "border-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl h-12 text-base bg-white/50 backdrop-blur-sm transition-all duration-200 px-4",
                  formFieldLabel: "text-slate-700 font-semibold text-sm mb-2",
                  formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-xl h-12 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-base",
                  formButtonSecondary: "border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl h-12 font-semibold transition-all duration-200",
                  profileSectionTitle: "text-slate-900 font-bold text-lg mb-4",
                  profileSectionContent: "space-y-4",
                  accordionTriggerButton: "text-slate-700 hover:text-indigo-600 font-semibold",
                  breadcrumbsItem: "text-slate-500",
                  breadcrumbsItemCurrent: "text-indigo-600 font-semibold",
                  footer: "!hidden",
                  footerAction: "!hidden",
                  footerActionLink: "!hidden",
                  footerActionText: "!hidden",
                  footerPages: "!hidden"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
