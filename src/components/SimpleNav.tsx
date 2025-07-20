'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default function SimpleNav() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [showDevelopers, setShowDevelopers] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const user = session?.user;
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-trigger') && !target.closest('.dropdown-menu')) {
        setShowProduct(false);
        setShowDevelopers(false);
        setShowCompany(false);
        setShowUser(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo 
            size="md" 
            showText={true} 
            onClick={() => window.location.href = '/'} 
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Product Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium dropdown-trigger"
                onClick={() => {
                  console.log('Product clicked');
                  setShowProduct(!showProduct);
                  setShowDevelopers(false);
                  setShowCompany(false);
                }}
              >
                Product
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showProduct && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 dropdown-menu">
                  <Link href="/features" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    Features
                  </Link>
                  <Link href="/import" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    Import Guide
                  </Link>
                  <Link href="/showcase" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    Showcase
                  </Link>
                </div>
              )}
            </div>

            {/* Developers Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium dropdown-trigger"
                onClick={() => {
                  console.log('Developers clicked');
                  setShowDevelopers(!showDevelopers);
                  setShowProduct(false);
                  setShowCompany(false);
                }}
              >
                Developers
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showDevelopers && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 dropdown-menu">
                  <Link href="/api-docs" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    API Documentation
                  </Link>
                  <Link href="/blog" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    Developer Blog
                  </Link>
                </div>
              )}
            </div>

            {/* Company Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium dropdown-trigger"
                onClick={() => {
                  console.log('Company clicked');
                  setShowCompany(!showCompany);
                  setShowProduct(false);
                  setShowDevelopers(false);
                }}
              >
                Company
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showCompany && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 dropdown-menu">
                  <Link href="/about" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    About Us
                  </Link>
                  <Link href="/blog" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    Blog
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">
              Pricing
            </Link>
            <Link href="/help" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">
              Help
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium">
                  Dashboard
                </Link>
                
                {/* User Dropdown */}
                <div className="relative">
                  <button 
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
                    onClick={() => {
                      setShowUser(!showUser);
                      setShowProduct(false);
                      setShowDevelopers(false);
                      setShowCompany(false);
                    }}
                  >
                    <User className="w-4 h-4" />
                    {user?.name || user?.email || 'User'}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showUser && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 dropdown-menu">
                      <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <User className="w-4 h-4" />
                        Account
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        Settings
                      </Link>
                      <hr className="my-1 border-slate-200 dark:border-slate-700" />
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium">
                  Get Started
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 dark:text-slate-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 py-4">
            <div className="space-y-2">
              <Link href="/features" className="block py-2 text-slate-600 dark:text-slate-300">Features</Link>
              <Link href="/import" className="block py-2 text-slate-600 dark:text-slate-300">Import</Link>
              <Link href="/showcase" className="block py-2 text-slate-600 dark:text-slate-300">Showcase</Link>
              <Link href="/api-docs" className="block py-2 text-slate-600 dark:text-slate-300">API Docs</Link>
              <Link href="/blog" className="block py-2 text-slate-600 dark:text-slate-300">Blog</Link>
              <Link href="/about" className="block py-2 text-slate-600 dark:text-slate-300">About</Link>
              <Link href="/pricing" className="block py-2 text-slate-600 dark:text-slate-300">Pricing</Link>
              <Link href="/help" className="block py-2 text-slate-600 dark:text-slate-300">Help</Link>
              <hr className="my-4 border-slate-200 dark:border-slate-700" />
              
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block py-2 bg-blue-500 text-white px-4 rounded-lg text-center">Dashboard</Link>
                  <Link href="/account" className="block py-2 text-slate-600 dark:text-slate-300">Account</Link>
                  <Link href="/settings" className="block py-2 text-slate-600 dark:text-slate-300">Settings</Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left py-2 text-red-600 dark:text-red-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="block py-2 text-slate-600 dark:text-slate-300">Sign In</Link>
                  <Link href="/auth/signup" className="block py-2 bg-blue-500 text-white px-4 rounded-lg text-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}