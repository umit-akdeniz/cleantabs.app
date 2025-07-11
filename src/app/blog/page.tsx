import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';

const blogPosts = [
  {
    id: 1,
    title: "Chrome Bookmarks Import Guide: Transfer Your Bookmarks to CleanTabs in 3 Steps",
    excerpt: "Complete step-by-step guide to importing Chrome bookmarks into CleanTabs. Learn how to export, sync, and organize your bookmarks efficiently.",
    content: "Detailed Chrome bookmark import tutorial with screenshots and troubleshooting tips...",
    author: "Umit Akdeniz",
    date: "2024-01-20",
    readTime: "8 min read",
    category: "Guide",
    tags: ["chrome-bookmarks", "import", "bookmark-sync", "browser-migration"],
    featured: true,
    slug: "chrome-bookmarks-import-guide"
  },
  {
    id: 2,
    title: "Firefox Bookmark Manager vs CleanTabs: Why Digital Organization Matters",
    excerpt: "Compare Firefox's built-in bookmark manager with CleanTabs' advanced organization features. Discover the benefits of modern bookmark management.",
    content: "Detailed comparison of Firefox bookmarks vs CleanTabs features...",
    author: "Umit Akdeniz",
    date: "2024-01-18",
    readTime: "10 min read",
    category: "Comparison",
    tags: ["firefox-bookmarks", "digital-organization", "bookmark-manager", "productivity"],
    featured: false,
    slug: "firefox-vs-cleantabs-comparison"
  },
  {
    id: 3,
    title: "Safari Bookmark Sync: Complete Migration Guide for Mac Users",
    excerpt: "Learn how to export Safari bookmarks and sync them with CleanTabs for better organization across all your devices.",
    content: "Safari bookmark export and sync tutorial for Mac users...",
    author: "Umit Akdeniz",
    date: "2024-01-16",
    readTime: "7 min read",
    category: "Guide",
    tags: ["safari-bookmarks", "mac-bookmarks", "cross-device-sync", "apple-migration"],
    featured: false,
    slug: "safari-bookmark-sync-guide"
  },
  {
    id: 4,
    title: "The Science Behind Note-Taking: How CleanTabs Reduces Cognitive Load",
    excerpt: "Discover the psychological benefits of organized note-taking and how CleanTabs' 3-panel interface reduces mental fatigue and improves focus.",
    content: "Scientific research on note-taking effectiveness and cognitive psychology...",
    author: "Umit Akdeniz",
    date: "2024-01-14",
    readTime: "12 min read",
    category: "Psychology",
    tags: ["note-taking", "cognitive-load", "brain-science", "productivity-psychology"],
    featured: false,
    slug: "science-note-taking-cognitive-load"
  },
  {
    id: 5,
    title: "Edge Bookmarks Transfer: Microsoft to CleanTabs Migration Tutorial",
    excerpt: "Step-by-step guide to exporting Microsoft Edge bookmarks and importing them into CleanTabs for better organization.",
    content: "Complete Edge bookmark migration tutorial with troubleshooting...",
    author: "Umit Akdeniz",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Guide",
    tags: ["edge-bookmarks", "microsoft-edge", "bookmark-export", "windows-migration"],
    featured: false,
    slug: "edge-bookmarks-transfer-guide"
  },
  {
    id: 6,
    title: "Digital Minimalism: How CleanTabs Promotes Mindful Web Browsing",
    excerpt: "Explore the benefits of digital minimalism and how CleanTabs' clean interface promotes mindful browsing habits and reduces digital clutter.",
    content: "Digital minimalism principles and CleanTabs' design philosophy...",
    author: "Umit Akdeniz",
    date: "2024-01-10",
    readTime: "9 min read",
    category: "Lifestyle",
    tags: ["digital-minimalism", "mindful-browsing", "digital-detox", "clean-interface"],
    featured: false,
    slug: "digital-minimalism-mindful-browsing"
  },
  {
    id: 7,
    title: "Cross-Browser Bookmark Synchronization: The Complete 2024 Guide",
    excerpt: "Learn how to sync bookmarks across Chrome, Firefox, Safari, and Edge using CleanTabs as your central bookmark management hub.",
    content: "Complete cross-browser synchronization guide with tips and tricks...",
    author: "Umit Akdeniz",
    date: "2024-01-08",
    readTime: "11 min read",
    category: "Guide",
    tags: ["cross-browser-sync", "bookmark-synchronization", "multi-browser", "universal-bookmarks"],
    featured: false,
    slug: "cross-browser-bookmark-sync-guide"
  },
  {
    id: 8,
    title: "Memory Palace Technique: Transform Your Bookmarks Into a Digital Memory System",
    excerpt: "Apply the ancient memory palace technique to your digital bookmarks using CleanTabs' organizational features for better information retention.",
    content: "Memory palace technique applied to digital bookmark organization...",
    author: "Dr. Sarah Chen",
    date: "2024-01-06",
    readTime: "13 min read",
    category: "Psychology",
    tags: ["memory-palace", "information-retention", "cognitive-techniques", "digital-memory"],
    featured: false,
    slug: "memory-palace-digital-bookmarks"
  },
  {
    id: 9,
    title: "Productivity Hacks: 10 Ways CleanTabs Boosts Your Daily Workflow",
    excerpt: "Discover proven productivity techniques and workflow optimizations using CleanTabs' advanced features for maximum efficiency.",
    content: "Productivity tips and workflow optimization strategies...",
    author: "Umit Akdeniz",
    date: "2024-01-04",
    readTime: "8 min read",
    category: "Productivity",
    tags: ["productivity-hacks", "workflow-optimization", "time-management", "efficiency-tips"],
    featured: false,
    slug: "productivity-hacks-cleantabs-workflow"
  },
  {
    id: 10,
    title: "The Psychology of Digital Hoarding: Why Organized Bookmarks Improve Mental Health",
    excerpt: "Understand the psychological impact of digital clutter and how CleanTabs' organization system promotes better mental health and focus.",
    content: "Psychology of digital hoarding and mental health benefits of organization...",
    author: "Umit Akdeniz",
    date: "2024-01-02",
    readTime: "10 min read",
    category: "Psychology",
    tags: ["digital-hoarding", "mental-health", "digital-wellness", "organization-psychology"],
    featured: false,
    slug: "psychology-digital-hoarding-mental-health"
  }
];

const categories = ["All", "Guide", "Psychology", "Productivity", "Comparison", "Lifestyle"];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            CleanTabs Blog
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Insights on digital organization, productivity tips, technical guides, 
            and the latest updates from the CleanTabs team.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
                <span className="text-slate-500 dark:text-slate-400">•</span>
                <span className="text-slate-600 dark:text-slate-300 text-sm">{featuredPost.category}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {featuredPost.title}
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                
                <Link 
                  href={`/blog/${featuredPost.slug}`}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Regular Posts Grid */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Latest Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                      {post.category}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                  </h4>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                      <div>{post.author}</div>
                      <div>{new Date(post.date).toLocaleDateString()} • {post.readTime}</div>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Get the latest CleanTabs updates, productivity tips, and technical insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm font-medium">
              Subscribe
            </button>
          </div>
        </section>
      </div>

      <LandingFooter />
    </div>
  );
}