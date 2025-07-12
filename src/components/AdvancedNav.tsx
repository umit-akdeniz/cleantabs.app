'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Zap, FileText, Download, Smartphone, Code, Users, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdvancedNav() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const productLinks = [
    { href: '/features', label: 'Features', icon: Zap, description: 'Core functionality' },
    { href: '/import', label: 'Import Guide', icon: Download, description: 'Bring your bookmarks' },
    { href: '/showcase', label: 'Showcase', icon: Smartphone, description: 'See it in action' },
  ];

  const developersLinks = [
    { href: '/api-docs', label: 'API Documentation', icon: Code, description: 'Integrate with CleanTabs' },
    { href: '/blog', label: 'Developer Blog', icon: FileText, description: 'Technical insights' },
  ];


  // Company dropdown removed

  const isActive = (href: string) => pathname === href;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-trigger') && !target.closest('.dropdown-menu')) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    setActiveDropdown(null);
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-700/30" style={{ zIndex: 9999 }}>
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
            {/* About Us - Direct Link */}
            <Link 
              href="/about" 
              className={`transition-colors font-medium ${ 
                isActive('/about') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              About Us
            </Link>

            {/* Product Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium dropdown-trigger"
                onClick={() => toggleDropdown('product')}
              >
                Product
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'product' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'product' && (
                <div 
                  className="absolute top-full left-0 mt-3 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 py-3 dropdown-menu"
                  style={{ zIndex: 10000 }}
                >
                  {productLinks.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10 rounded-xl flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-200">
                        <link.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{link.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{link.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Developers Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium dropdown-trigger"
                onClick={() => toggleDropdown('developers')}
              >
                Developers
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'developers' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'developers' && (
                <div 
                  className="absolute top-full left-0 mt-3 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 py-3 dropdown-menu"
                  style={{ zIndex: 10000 }}
                >
                  {developersLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-400/10 dark:to-green-500/10 rounded-xl flex items-center justify-center group-hover:from-green-500/20 group-hover:to-green-600/20 transition-all duration-200">
                        <link.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{link.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{link.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>


            {/* Company Dropdown removed */}

            {/* Direct Links */}
            <Link 
              href="/pricing" 
              className={`transition-colors font-medium ${
                isActive('/pricing') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pricing
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm font-medium">
                  Dashboard
                </Link>
                
                {/* Admin Button - Only for umitakdenizjob@gmail.com */}
                {user?.email === 'umitakdenizjob@gmail.com' && (
                  <button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/generate-key', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' }
                        });
                        const data = await response.json();
                        if (data.adminKey) {
                          window.location.href = `/secure-admin/${data.adminKey}`;
                        }
                      } catch (error) {
                        console.error('Admin key generation error:', error);
                      }
                    }}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm font-medium flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Administration
                  </button>
                )}
                
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {user?.name || 'User'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {user?.email}
                        </div>
                      </div>
                      
                      <Link 
                        href="/account" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Account Settings
                      </Link>
                      
                      <Link 
                        href="/settings" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Preferences
                      </Link>
                      
                      {/* Admin Menu Item - Only for admin user */}
                      {user?.email === 'umitakdenizjob@gmail.com' && (
                        <button 
                          onClick={async () => {
                            setIsUserMenuOpen(false);
                            try {
                              const response = await fetch('/api/admin/generate-key', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' }
                              });
                              const data = await response.json();
                              if (data.adminKey) {
                                window.location.href = `/secure-admin/${data.adminKey}`;
                              }
                            } catch (error) {
                              console.error('Admin key generation error:', error);
                            }
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
                        >
                          <Shield className="w-4 h-4" />
                          Administration
                        </button>
                      )}
                      
                      
                      
                      
                      <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm font-medium"
                >
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
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 py-4">
            <div className="space-y-4">
              {/* Product Section */}
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Product</div>
                {productLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="flex items-center gap-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setActiveDropdown(null);
                    }}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Developers Section */}
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Developers</div>
                {developersLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="flex items-center gap-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setActiveDropdown(null);
                    }}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>


              {/* About Us */}
              <Link 
                href="/about" 
                className="block py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>

              <Link 
                href="/pricing" 
                className="block py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/account"
                      className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Account
                    </Link>
                    <Link
                      href="/settings"
                      className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    {user?.email === 'umitakdenizjob@gmail.com' && (
                      <button
                        onClick={async () => {
                          setIsMenuOpen(false);
                          try {
                            const response = await fetch('/api/admin/generate-key', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' }
                            });
                            const data = await response.json();
                            if (data.adminKey) {
                              window.location.href = `/secure-admin/${data.adminKey}`;
                            }
                          } catch (error) {
                            console.error('Admin key generation error:', error);
                          }
                        }}
                        className="block w-full text-left text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
                      >
                        Administration
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full text-left text-red-600 dark:text-red-400 font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}