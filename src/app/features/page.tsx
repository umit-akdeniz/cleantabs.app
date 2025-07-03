import Link from 'next/link';
import { ArrowRight, Zap, Layout, Search, Import, Shield, Smartphone, Globe, Users, Code, Database, Cloud } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';

const coreFeatures = [
  {
    icon: Layout,
    title: "3-Panel Interface",
    description: "Intuitive layout with categories, sites, and details for effortless navigation",
    details: [
      "Clean, minimalist design",
      "Responsive across all devices", 
      "Keyboard shortcuts support",
      "Customizable panel sizes"
    ]
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Lightning-fast search across all your bookmarks with intelligent filtering",
    details: [
      "Real-time search results",
      "Search by name, URL, or tags",
      "Advanced filtering options",
      "Search history tracking"
    ]
  },
  {
    icon: Import,
    title: "Universal Import",
    description: "Import bookmarks from any browser or service in seconds",
    details: [
      "50+ supported formats",
      "Automatic categorization",
      "Duplicate detection",
      "Batch processing"
    ]
  },
  {
    icon: Globe,
    title: "Auto-Organization",
    description: "AI-powered categorization that learns from your browsing patterns",
    details: [
      "Smart category suggestions",
      "Automatic tagging",
      "Pattern recognition",
      "Manual override options"
    ]
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays yours with end-to-end encryption and zero tracking",
    details: [
      "End-to-end encryption",
      "No data selling",
      "GDPR compliant",
      "Local data options"
    ]
  },
  {
    icon: Cloud,
    title: "Sync Everywhere",
    description: "Access your organized bookmarks on any device, anywhere",
    details: [
      "Real-time synchronization",
      "Cross-device compatibility",
      "Offline access",
      "Conflict resolution"
    ]
  }
];

const advancedFeatures = [
  {
    icon: Code,
    title: "API Integration",
    description: "Build custom tools with our comprehensive REST API",
    comingSoon: false
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share and collaborate on bookmark collections",
    comingSoon: true
  },
  {
    icon: Database,
    title: "Analytics Dashboard",
    description: "Track your browsing patterns and productivity",
    comingSoon: true
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native iOS and Android applications",
    comingSoon: true
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            All Features
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              To Stay Organized
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            CleanTabs combines powerful organization tools with elegant design. 
            Discover all the features that make digital organization effortless and enjoyable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              Try All Features Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/showcase"
              className="border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold"
            >
              See It in Action
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Core Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              The foundation of CleanTabs. These features are available to all users 
              and designed to transform your digital organization experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Powerful tools for power users. These features are coming soon 
              and will be available in our Pro and Enterprise plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative">
                {feature.comingSoon && (
                  <div className="absolute top-4 right-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                    Coming Soon
                  </div>
                )}
                
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose CleanTabs?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              See how CleanTabs compares to traditional bookmark managers.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="grid grid-cols-3 gap-0">
              {/* Header */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700 font-medium text-slate-900 dark:text-white">
                Feature
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 font-medium text-slate-900 dark:text-white text-center">
                Traditional Managers
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 font-medium text-blue-900 dark:text-blue-100 text-center">
                CleanTabs
              </div>

              {/* Rows */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">3-Panel Interface</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-red-500">✗</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-green-500">✓</div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700">Auto-Organization</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-red-500">✗</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-green-500">✓</div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700">Universal Import</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-yellow-500">Limited</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-green-500">✓</div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700">API Access</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-red-500">✗</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-green-500">✓</div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700">Modern UI</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-yellow-500">Outdated</div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-green-500">✓</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience All Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your journey to organized digital life. All core features 
            are free forever, with advanced features coming soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/import"
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all font-semibold"
            >
              Import Your Bookmarks
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}