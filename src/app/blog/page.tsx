import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';

const blogPosts = [
  {
    id: 1,
    title: "The Future of Digital Organization: Why CleanTabs Matters",
    excerpt: "In a world drowning in digital chaos, CleanTabs emerges as the solution for modern professionals who value organization and efficiency.",
    content: "Detailed analysis of digital organization trends...",
    author: "Sarah Chen",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Product",
    tags: ["organization", "productivity", "digital-workspace"],
    featured: true
  },
  {
    id: 2,
    title: "API Integration Guide: Building with CleanTabs",
    excerpt: "Learn how to integrate CleanTabs API into your applications for seamless bookmark management and data organization.",
    content: "Step-by-step integration guide...",
    author: "Mike Rodriguez",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Developer",
    tags: ["api", "integration", "development"],
    featured: false
  },
  {
    id: 3,
    title: "Migrating from Traditional Bookmark Managers",
    excerpt: "Complete guide to importing your bookmarks from Chrome, Firefox, Safari, and other bookmark managers into CleanTabs.",
    content: "Migration strategies and best practices...",
    author: "Emma Thompson",
    date: "2024-01-08",
    readTime: "6 min read",
    category: "Guide",
    tags: ["migration", "import", "bookmarks"],
    featured: false
  },
  {
    id: 4,
    title: "Mobile vs Desktop: The CleanTabs Experience",
    excerpt: "How CleanTabs adapts to different devices and screen sizes while maintaining functionality and ease of use.",
    content: "Cross-platform experience analysis...",
    author: "David Kim",
    date: "2024-01-05",
    readTime: "5 min read",
    category: "Design",
    tags: ["mobile", "responsive", "ux"],
    featured: false
  },
  {
    id: 5,
    title: "Enterprise Data Management with CleanTabs API",
    excerpt: "How large organizations can leverage CleanTabs API for enterprise-level bookmark and data management solutions.",
    content: "Enterprise use cases and implementation...",
    author: "Alex Johnson",
    date: "2024-01-03",
    readTime: "10 min read",
    category: "Enterprise",
    tags: ["enterprise", "api", "data-management"],
    featured: false
  },
  {
    id: 6,
    title: "Privacy-First Design: How CleanTabs Protects Your Data",
    excerpt: "Deep dive into CleanTabs' privacy architecture and security measures that keep your organized data safe.",
    content: "Security and privacy technical details...",
    author: "Lisa Park",
    date: "2024-01-01",
    readTime: "7 min read",
    category: "Security",
    tags: ["privacy", "security", "data-protection"],
    featured: false
  }
];

const categories = ["All", "Product", "Developer", "Guide", "Design", "Enterprise", "Security"];

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
                  href={`/blog/${featuredPost.id}`}
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
                      href={`/blog/${post.id}`}
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