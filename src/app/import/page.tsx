import Link from 'next/link';
import { Download, Upload, Check, ArrowRight, Chrome, Bookmark, FileText, Globe, Monitor, Smartphone } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: 'Import Bookmarks from Any Browser',
  description: 'Import thousands of bookmarks from Chrome, Firefox, Safari, Edge and more. CleanTabs automatically organizes your bookmarks with AI-powered categorization in minutes.',
  keywords: ['import bookmarks', 'chrome bookmarks', 'firefox bookmarks', 'safari bookmarks', 'bookmark migration', 'browser import', 'bookmark transfer'],
  canonical: '/import',
});

const supportedSources = [
  {
    name: "Google Chrome",
    icon: Chrome,
    description: "Import bookmarks from Chrome browser",
    format: "HTML",
    steps: ["Open Chrome → Bookmarks → Bookmark Manager", "Click ⋯ → Export bookmarks", "Upload to CleanTabs"],
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
  },
  {
    name: "Mozilla Firefox",
    icon: Monitor,
    description: "Import bookmarks from Firefox browser",
    format: "HTML/JSON",
    steps: ["Open Firefox → Bookmarks → Show All Bookmarks", "Import and Backup → Export Bookmarks to HTML", "Upload to CleanTabs"],
    color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
  },
  {
    name: "Safari",
    icon: Smartphone,
    description: "Import bookmarks from Safari browser",
    format: "HTML",
    steps: ["Open Safari → File → Export Bookmarks", "Save as HTML file", "Upload to CleanTabs"],
    color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20"
  },
  {
    name: "Microsoft Edge",
    icon: Monitor,
    description: "Import bookmarks from Edge browser",
    format: "HTML",
    steps: ["Open Edge → Settings → Favorites", "Export favorites", "Upload to CleanTabs"],
    color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
  },
  {
    name: "Pocket",
    icon: Bookmark,
    description: "Import saved articles from Pocket",
    format: "HTML",
    steps: ["Go to getpocket.com/export", "Request export file", "Upload to CleanTabs"],
    color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
  },
  {
    name: "Notion",
    icon: FileText,
    description: "Import web clips from Notion",
    format: "JSON",
    steps: ["Export Notion database", "Select web clip entries", "Upload to CleanTabs"],
    color: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20"
  }
];

const importStats = [
  { number: "10M+", label: "Bookmarks Imported" },
  { number: "50+", label: "Supported Formats" },
  { number: "99.9%", label: "Success Rate" },
  { number: "<5min", label: "Average Import Time" }
];

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Download className="w-4 h-4" />
            Import Your Bookmarks
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Bring Your Bookmarks
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Into Organized Clarity
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Import thousands of bookmarks from any browser or service in minutes. 
            CleanTabs automatically organizes and categorizes your links for instant productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              Start Importing Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {importStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Sources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Import From Anywhere
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              CleanTabs supports all major browsers and bookmark services. 
              No matter where your bookmarks live, we&apos;ll bring them home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportedSources.map((source, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${source.color}`}>
                    <source.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{source.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{source.format} format</p>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  {source.description}
                </p>
                
                <div className="space-y-2">
                  {source.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                        {stepIndex + 1}
                      </div>
                      <span className="text-slate-600 dark:text-slate-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Import Process */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              How Import Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Three simple steps to transform your scattered bookmarks into organized clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Upload File</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Export your bookmarks from any browser or service and upload the file to CleanTabs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Auto-Organize</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our AI analyzes and categorizes your bookmarks automatically into relevant folders.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Ready to Use</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Start using your newly organized digital workspace immediately with full search and filtering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Import Demo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              See Import in Action
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Watch how CleanTabs transforms a messy bookmark export into organized clarity.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Before */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Before: Chaotic Bookmarks
                </h3>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-600 dark:text-slate-300">📄 Unsorted (247 items)</div>
                    <div className="ml-4 space-y-1 text-slate-500 dark:text-slate-400">
                      <div>• GitHub - Some random repo</div>
                      <div>• Recipe for pasta</div>
                      <div>• Work document #142</div>
                      <div>• YouTube video about cats</div>
                      <div>• Design inspiration site</div>
                      <div>• ... 242 more items</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* After */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  After: Organized Clarity
                </h3>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-600 dark:text-slate-300">🚀 Work (45 items)</div>
                    <div className="text-slate-600 dark:text-slate-300">🎨 Design (32 items)</div>
                    <div className="text-slate-600 dark:text-slate-300">📚 Learning (67 items)</div>
                    <div className="text-slate-600 dark:text-slate-300">🍳 Recipes (18 items)</div>
                    <div className="text-slate-600 dark:text-slate-300">🎥 Entertainment (85 items)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-950">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Import Your Bookmarks?
          </h2>
          <p className="text-xl text-slate-300 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have successfully imported and organized 
            their digital collections with CleanTabs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-4 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              Start Free Import
              <Upload className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="border-2 border-slate-300 dark:border-slate-600 text-slate-300 dark:text-slate-400 px-8 py-4 rounded-xl hover:bg-slate-700 dark:hover:bg-slate-800 transition-all font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}