'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, HelpCircle, Book, Video, Image, Zap } from 'lucide-react';
import BasicNav from '@/components/BasicNav';
import LandingFooter from '@/components/LandingFooter';

const faqCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Zap,
    questions: [
      {
        q: "How do I import my existing bookmarks into CleanTabs?",
        a: "You can import bookmarks from any browser or service in just a few clicks. Go to your dashboard, click the Import button, and follow our step-by-step guide. We support Chrome, Firefox, Safari, Edge, and many more formats. The process typically takes less than 5 minutes."
      },
      {
        q: "Is CleanTabs really free?",
        a: "Yes! CleanTabs offers a comprehensive free plan that includes unlimited bookmarks, categories, the 3-panel interface, search functionality, and import/export features. We also have Pro and Enterprise plans with advanced features like API access and team collaboration."
      },
      {
        q: "How do I organize my bookmarks effectively?",
        a: "Start by creating broad categories (Work, Personal, Learning), then add subcategories for specific topics. Use our drag-and-drop interface to move sites around. Take advantage of tags for cross-category organization and use the smart search to find anything instantly."
      },
      {
        q: "Can I access CleanTabs on my mobile device?",
        a: "Absolutely! CleanTabs is fully responsive and works beautifully on phones, tablets, and desktops. Our interface adapts to your screen size while maintaining full functionality. Native mobile apps are coming soon."
      }
    ]
  },
  {
    id: 'features',
    name: 'Features & Usage',
    icon: Book,
    questions: [
      {
        q: "What is the 3-panel interface?",
        a: "Our signature 3-panel layout shows Categories on the left, Sites in the middle, and Details on the right. This design allows you to navigate thousands of bookmarks effortlessly without losing context. It's like having a filing cabinet that's always organized."
      },
      {
        q: "How does the search function work?",
        a: "Our smart search looks through bookmark names, URLs, descriptions, and tags in real-time. Just start typing and see instant results. You can also use filters to narrow down by category, date added, or tags for even more precise results."
      },
      {
        q: "Can I add custom tags to my bookmarks?",
        a: "Yes! Tags are a powerful way to create connections across categories. Add multiple tags to any bookmark, and use them to create virtual collections. For example, tag bookmarks with 'urgent', 'reference', or 'inspiration' regardless of their category."
      },
      {
        q: "What file formats can I import/export?",
        a: "We support HTML (most common), JSON, CSV, and many browser-specific formats. For export, you can choose from HTML, JSON, CSV, or our native CleanTabs format. This ensures you're never locked into our platform."
      }
    ]
  },
  {
    id: 'media',
    name: 'Videos & Photos',
    icon: Video,
    questions: [
      {
        q: "Can I add screenshots or images to my bookmarks?",
        a: "While CleanTabs automatically captures favicons for visual identification, you can add custom images and screenshots through the bookmark details panel. This is especially useful for design inspiration, recipes, or visual references."
      },
      {
        q: "How do I organize video bookmarks effectively?",
        a: "Create dedicated categories like 'Tutorials', 'Entertainment', or 'Courses'. Use tags to mark completion status ('watched', 'to-watch', 'favorite'). Add notes about video duration, key takeaways, or timestamps for quick reference."
      },
      {
        q: "Can I embed videos directly in CleanTabs?",
        a: "Currently, CleanTabs focuses on organized bookmark management. However, our link preview feature shows video thumbnails and descriptions. Video embedding is planned for future updates based on user feedback."
      },
      {
        q: "How do I manage design inspiration and image collections?",
        a: "Create categories like 'Design Inspiration', 'Color Palettes', or 'UI Examples'. Use tags for styles ('minimalist', 'colorful', 'dark-mode'). Add detailed descriptions to capture what inspired you about each design."
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technical & API',
    icon: Image,
    questions: [
      {
        q: "Is there an API for CleanTabs?",
        a: "Yes! Our REST API allows you to integrate CleanTabs into your workflow. Access your bookmarks programmatically, build custom tools, or sync with other applications. API access is included in our Pro plan."
      },
      {
        q: "How secure is my data in CleanTabs?",
        a: "Your data security is our priority. We use industry-standard encryption, secure authentication, and never sell your personal information. Your bookmarks are stored securely and backed up regularly. You can export your data anytime."
      },
      {
        q: "Can I use CleanTabs offline?",
        a: "CleanTabs works as a Progressive Web App (PWA), which means you can access your recently viewed bookmarks offline. Full offline sync is coming in a future update. For now, we recommend bookmarking frequently accessed sites."
      },
      {
        q: "How do I delete my account and data?",
        a: "You can delete your account anytime from Settings > Account > Delete Account. This permanently removes all your data from our servers. We recommend exporting your bookmarks first if you want to keep them."
      }
    ]
  }
];

const helpResources = [
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides for common tasks",
    icon: Video,
    href: "/guides/videos",
    color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
  },
  {
    title: "Photo Management Guide",
    description: "Best practices for organizing visual bookmarks",
    icon: Image,
    href: "/guides/photos",
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
  },
  {
    title: "Import Guide",
    description: "Complete guide to importing from any browser",
    icon: Book,
    href: "/import",
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
  }
];

export default function HelpPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const toggleQuestion = (categoryId: string, questionIndex: number) => {
    const questionId = `${categoryId}-${questionIndex}`;
    setOpenQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <BasicNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            How can we help you?
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Find answers to common questions, learn best practices, and discover 
            advanced features to get the most out of CleanTabs.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-slate-900 dark:text-white placeholder-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Help Resources */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Quick Help Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {helpResources.map((resource, index) => (
              <Link
                key={index}
                href={resource.href}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${resource.color}`}>
                  <resource.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>

          {filteredCategories.map((category) => (
            <div key={category.id} className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <category.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {category.name}
                </h3>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const questionId = `${category.id}-${index}`;
                  const isOpen = openQuestions.includes(questionId);

                  return (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <button
                        onClick={() => toggleQuestion(category.id, index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <span className="font-medium text-slate-900 dark:text-white pr-4">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4 border-t border-slate-100 dark:border-slate-700">
                          <p className="text-slate-600 dark:text-slate-300 pt-4 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still need help?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help 
            you get the most out of CleanTabs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:support@cleantabs.app"
              className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-lg font-semibold"
            >
              Contact Support
            </Link>
            <Link
              href="/about"
              className="border-2 border-white dark:border-slate-300 text-white dark:text-slate-300 px-8 py-4 rounded-xl hover:bg-white/10 dark:hover:bg-slate-700/30 transition-all font-semibold"
            >
              About CleanTabs
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}