'use client';

import React from 'react';
import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { Search, Menu, X, Sparkles, ChevronDown, User } from 'lucide-react';

const Header = () => {
  const { userId } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/98 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Wyapaar
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors flex items-center gap-2 group">
              <div className="flex items-center gap-1 bg-gradient-to-r from-indigo-50 to-cyan-50 group-hover:from-indigo-100 group-hover:to-cyan-100 px-2 py-1 rounded-lg transition-all duration-200">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <Search className="w-4 h-4" />
                <span>AI Search</span>
              </div>
            </Link>
            <Link href="/categories" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
              Categories
            </Link>
            <Link href="/rfq" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
              RFQ
            </Link>
            <Link href="/suppliers" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
              Suppliers
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {userId ? (
              <div className="flex items-center space-x-4">
                <Link href="/user" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
                  Dashboard
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-xl"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <Link 
                      href="/sign-in" 
                      className="block px-4 py-3 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors font-medium"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/sign-up" 
                      className="block px-4 py-3 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors font-medium"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/search" 
                className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors flex items-center gap-2 px-4 py-2 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-1 bg-gradient-to-r from-indigo-50 to-cyan-50 group-hover:from-indigo-100 group-hover:to-cyan-100 px-2 py-1 rounded-lg transition-all duration-200">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <Search className="w-4 h-4" />
                  <span>AI Search</span>
                </div>
              </Link>
              <Link 
                href="/categories" 
                className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/rfq" 
                className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                RFQ
              </Link>
              <Link 
                href="/suppliers" 
                className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Suppliers
              </Link>
              {!userId && (
                <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-slate-200">
                  <Link 
                    href="/sign-in" 
                    className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/sign-up" 
                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-cyan-700 transition-all duration-300 font-semibold shadow-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
