'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Layout, Search, Import, Shield, Smartphone, Check, Star, Users, Globe, Play, ChevronLeft, ChevronRight, Brain, Download } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';

export default function LandingPage() {
  // Demo features for the grid
  const features = [
    {
      id: 1,
      title: "Clean 3-Panel Interface",
      description: "Navigate effortlessly through categories, sites, and details",
      icon: Layout,
      color: "from-blue-500 to-indigo-600",
      features: ["Intuitive navigation", "Drag & drop organization", "Clean, minimal design"]
    },
    {
      id: 2,
      title: "Instant Search & Filtering",
      description: "Find any bookmark in seconds with powerful search",
      icon: Search,
      color: "from-green-500 to-emerald-600",
      features: ["Full-text search", "Advanced filters", "Smart suggestions"]
    },
    {
      id: 3,
      title: "Smart Organization",
      description: "AI-powered categorization keeps everything tidy",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      features: ["Auto-categorization", "Duplicate detection", "Smart tags"]
    },
    {
      id: 4,
      title: "Import from Anywhere",
      description: "Bring bookmarks from Chrome, Firefox, Safari and more",
      icon: Download,
      color: "from-orange-500 to-red-600",
      features: ["One-click import", "Cross-browser sync", "Bulk operations"]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              CleanTabs
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Transform Your Digital Chaos Into Organized Clarity
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The minimalist site organization platform for the modern web. 
              Turn scattered bookmarks into a beautifully organized digital workspace.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-semibold text-lg flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#demo"
                className="border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold text-lg"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              See CleanTabs in Action
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Experience the clean, intuitive interface that makes bookmark organization effortless
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              
              return (
                <div key={feature.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="text-slate-600 dark:text-slate-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* YouTube Video Section */}
      <section id="demo" className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Watch How CleanTabs Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              See how easy it is to transform your chaotic bookmarks into organized clarity
            </p>
          </div>

          {/* Video Container */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                {/* YouTube Video Embed - Placeholder with professional demo styling */}
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/ScMzIvxBSi4?rel=0&showinfo=0&modestbranding=1&autoplay=0&mute=1"
                  title="CleanTabs Demo - Transform Your Digital Chaos into Organized Clarity"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose CleanTabs?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Built for modern professionals who value clean design and powerful functionality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Layout className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                3-Panel Interface
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Navigate through categories, sites, and details with our intuitive three-panel layout designed for efficiency.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Instant Search
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Find any bookmark in seconds with powerful search across titles, descriptions, and tags.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Import className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Easy Import
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Import thousands of bookmarks from Chrome, Firefox, Safari and other browsers instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Smart Organization
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                AI-powered categorization automatically organizes your bookmarks for optimal productivity.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Mobile Ready
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Access your organized bookmarks anywhere with our responsive design and mobile apps.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your data is encrypted and secure. We respect your privacy and never sell your information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Organize Your Digital Life?
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their chaotic bookmarks into organized clarity with CleanTabs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-4 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-400 px-8 py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all font-semibold"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}