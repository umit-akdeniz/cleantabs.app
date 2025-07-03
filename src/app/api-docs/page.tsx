import Link from 'next/link';
import { Code, Book, Zap, Shield, Globe, Database, Smartphone, Monitor } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/sites',
    description: 'Retrieve all user sites with optional filtering and pagination',
    auth: 'Required'
  },
  {
    method: 'POST',
    path: '/api/v1/sites',
    description: 'Create a new site bookmark',
    auth: 'Required'
  },
  {
    method: 'GET',
    path: '/api/v1/categories',
    description: 'Get all categories and subcategories',
    auth: 'Required'
  },
  {
    method: 'POST',
    path: '/api/v1/import',
    description: 'Import bookmarks from various formats',
    auth: 'Required'
  },
  {
    method: 'GET',
    path: '/api/v1/export',
    description: 'Export organized bookmarks in multiple formats',
    auth: 'Required'
  },
  {
    method: 'POST',
    path: '/api/v1/search',
    description: 'Advanced search across all user data',
    auth: 'Required'
  }
];

const sdks = [
  {
    name: 'JavaScript/TypeScript',
    icon: Code,
    description: 'Official SDK for web applications and Node.js',
    status: 'Available',
    color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
  },
  {
    name: 'Python',
    icon: Code,
    description: 'SDK for Python applications and data science',
    status: 'Available',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
  },
  {
    name: 'iOS Swift',
    icon: Smartphone,
    description: 'Native iOS SDK for mobile applications',
    status: 'Coming Soon',
    color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
  },
  {
    name: 'Android Kotlin',
    icon: Smartphone,
    description: 'Native Android SDK for mobile applications',
    status: 'Coming Soon',
    color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
  }
];

const useCases = [
  {
    title: "Desktop Applications",
    description: "Build native desktop apps that sync with CleanTabs",
    icon: Monitor,
    examples: ["Electron apps", "System tray utilities", "Browser extensions"]
  },
  {
    title: "Mobile Applications", 
    description: "Create mobile apps with bookmark synchronization",
    icon: Smartphone,
    examples: ["Reading apps", "Research tools", "Productivity suites"]
  },
  {
    title: "Data Analytics",
    description: "Analyze browsing patterns and productivity metrics",
    icon: Database,
    examples: ["Usage analytics", "Team productivity", "Research insights"]
  },
  {
    title: "Automation & Workflows",
    description: "Integrate CleanTabs into your existing workflows",
    icon: Zap,
    examples: ["Zapier integrations", "Workflow automation", "Scheduled imports"]
  }
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4" />
            Developer API
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Build with CleanTabs
            <br />
            <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              Powerful API & SDKs
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Integrate CleanTabs into your applications with our comprehensive REST API. 
            Build custom tools, mobile apps, and automated workflows with organized bookmark data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg font-semibold"
            >
              Get API Key
            </Link>
            <button className="border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Quick Start
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Get up and running with CleanTabs API in minutes.
            </p>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-6 overflow-x-auto">
            <div className="text-sm text-slate-400 mb-2">JavaScript Example</div>
            <pre className="text-green-400 text-sm">
{`// Install the CleanTabs SDK
npm install @cleantabs/sdk

// Initialize and fetch your sites
import { CleanTabs } from '@cleantabs/sdk';

const client = new CleanTabs({
  apiKey: 'your-api-key'
});

// Get all your organized sites
const sites = await client.sites.list({
  category: 'work',
  limit: 50
});

// Create a new bookmark
const newSite = await client.sites.create({
  name: 'CleanTabs API Docs',
  url: 'https://cleantabs.app/api-docs',
  category: 'development',
  tags: ['api', 'documentation']
});

console.log('Sites:', sites);`}
            </pre>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              API Endpoints
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              RESTful API with comprehensive bookmark and organization management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    endpoint.method === 'GET' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                    endpoint.method === 'POST' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                    'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="font-mono text-sm text-slate-700 dark:text-slate-300">
                    {endpoint.path}
                  </code>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                  {endpoint.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Auth: {endpoint.auth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Official SDKs
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Native SDKs for your favorite programming languages and platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sdks.map((sdk, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${sdk.color}`}>
                    <sdk.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{sdk.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      sdk.status === 'Available' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {sdk.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {sdk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Use Cases & Examples
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              See what you can build with CleanTabs API.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <useCase.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {useCase.title}
                  </h3>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {useCase.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">Examples:</div>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    {useCase.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Enterprise API
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Enterprise-Grade API
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Need higher rate limits, dedicated support, or custom integrations? 
            Our Enterprise API is designed for large-scale applications and organizations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">10M+</div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">Requests/month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">24/7</div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">Support</div>
            </div>
          </div>
          
          <Link
            href="mailto:enterprise@cleantabs.app"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-semibold"
          >
            Contact Enterprise Sales
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}