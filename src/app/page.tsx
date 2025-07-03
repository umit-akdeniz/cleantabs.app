'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Layout, Search, Import, Shield, Smartphone, Check, Star, Users, Globe } from 'lucide-react';
import BasicNav from '@/components/BasicNav';
import LandingFooter from '@/components/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <BasicNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Transform Digital Chaos
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Into Organized Clarity
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              CleanTabs is the minimalist site organization platform that turns your scattered bookmarks 
              into a beautifully organized digital workspace. Clean, simple, and powerfully effective.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-semibold text-lg flex items-center justify-center gap-2"
              >
                Start Organizing Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold text-lg"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Hero Demo Visual */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-64">
                {/* Panel 1 - Categories */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Layout className="w-4 h-4 text-blue-500" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-sm">🚀 Work</div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-sm">📚 Learning</div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-sm">🎨 Design</div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-sm">🛠️ Tools</div>
                  </div>
                </div>

                {/* Panel 2 - Sites */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    Sites
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded text-sm">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      GitHub
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded text-sm">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      Figma
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded text-sm">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      Notion
                    </div>
                  </div>
                </div>

                {/* Panel 3 - Details */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Details
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <p><strong>GitHub</strong></p>
                    <p>Development platform for version control and collaboration.</p>
                    <div className="flex gap-1 mt-2">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">dev</span>
                      <span className="bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">git</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Stay Organized
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features designed for simplicity. Organize thousands of sites with just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Layout className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">3-Panel Interface</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Clean, intuitive layout with categories, sites, and details. Navigate thousands of bookmarks effortlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Built for speed. Search, filter, and organize your sites instantly with optimized performance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Smart Search</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Find any site instantly with intelligent search across names, descriptions, and tags.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <Import className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Import Bookmarks</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Bring your existing bookmarks from any browser. Start organizing in seconds, not hours.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Privacy First</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your data stays yours. Secure authentication and encryption protect your organized workspace.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Mobile Ready</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Access your organized sites anywhere. Fully responsive design works beautifully on all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Free</h3>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                $0<span className="text-lg font-normal text-slate-500">/month</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">Perfect for personal use</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600 dark:text-slate-300">Unlimited sites & categories</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600 dark:text-slate-300">3-panel interface</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600 dark:text-slate-300">Import bookmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600 dark:text-slate-300">Smart search</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="w-full block text-center border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-xl shadow-lg text-white relative">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                Coming Soon
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-4">
                $9<span className="text-lg font-normal opacity-80">/month</span>
              </div>
              <p className="opacity-90 mb-6">For power users and teams</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  <span>API Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                disabled
                className="w-full bg-white/20 text-white py-3 rounded-lg font-semibold opacity-60 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Custom
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">For large organizations</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600 dark:text-slate-300">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600 dark:text-slate-300">Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600 dark:text-slate-300">SSO support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600 dark:text-slate-300">Dedicated support</span>
                </li>
              </ul>
              <Link
                href="mailto:enterprise@cleantabs.app"
                className="w-full block text-center border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Built for the Modern Web
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              CleanTabs was born from the frustration of digital clutter. We believe that organizing 
              your digital life shouldn't be complicated, time-consuming, or overwhelming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">User-Centered</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Every feature is designed with user experience in mind. Simple, intuitive, and powerful.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Performance First</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Built with modern technology stack for lightning-fast performance and reliability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Privacy Focused</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your data belongs to you. We use industry-standard security to keep your information safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Organize Your Digital Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their chaotic bookmarks into organized, 
            searchable digital workspaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg font-semibold text-lg flex items-center justify-center gap-2"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signin"
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all font-semibold text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}