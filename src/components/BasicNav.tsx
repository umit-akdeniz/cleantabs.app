'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default function BasicNav() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!session;

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await signOut({ 
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://cleantabs.app',
      redirect: true 
    });
  };

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo 
              size="md" 
              showText={true} 
              onClick={() => window.location.href = '/'} 
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Features
              </Link>
              <Link href="/import" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Import
              </Link>
              <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Pricing
              </Link>
              <Link href="/help" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Help
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium">
                  Dashboard
                </Link>
                
                {/* Admin Button - Only for umitakdenizjob@gmail.com */}
                {session?.user?.email === 'umitakdenizjob@gmail.com' && (
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
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {session?.user?.name || 'User'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {session?.user?.email}
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
                      {session?.user?.email === 'umitakdenizjob@gmail.com' && (
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
                <Link href="/auth/signin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
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
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              <Link href="/features" className="block px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
              <Link href="/import" className="block px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Import</Link>
              <Link href="/pricing" className="block px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/help" className="block px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Help</Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 bg-blue-500 text-white rounded-lg mx-3 text-center">Dashboard</Link>
                  <Link href="/account" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Account</Link>
                  <Link href="/settings" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Settings</Link>
                  {session?.user?.email === 'umitakdenizjob@gmail.com' && (
                    <button 
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
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
                      className="block w-full text-left px-3 py-2 text-purple-600 dark:text-purple-400"
                    >
                      Administration
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-red-600 dark:text-red-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Sign In</Link>
                  <Link href="/auth/signup" className="block px-3 py-2 bg-blue-500 text-white rounded-lg mx-3 text-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}