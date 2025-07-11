import Link from 'next/link';
import { Play, Clock, Users, Star, ArrowRight, Video, Download, Search, Layout } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: 'Video Tutorials - Learn CleanTabs Step by Step',
  description: 'Master CleanTabs with comprehensive video guides. Learn bookmark organization, import techniques, search shortcuts, and advanced features with step-by-step tutorials.',
  keywords: ['cleantabs tutorials', 'bookmark manager videos', 'how to use cleantabs', 'video guides', 'bookmark organization tutorial', 'cleantabs training'],
  canonical: '/guides/videos',
});

const videoGuides = [
  {
    id: 1,
    title: "Getting Started with CleanTabs",
    description: "Complete walkthrough of creating your account, importing bookmarks, and organizing your first categories.",
    duration: "8:42",
    difficulty: "Beginner",
    views: "12.5K",
    rating: 4.9,
    thumbnail: "/placeholder-thumb.jpg",
    topics: ["Account Setup", "Import", "Organization"],
    featured: true
  },
  {
    id: 2,
    title: "Mastering the 3-Panel Interface",
    description: "Learn how to navigate the categories, sites, and details panels efficiently for maximum productivity.",
    duration: "6:15",
    difficulty: "Beginner",
    views: "8.3K",
    rating: 4.8,
    thumbnail: "/placeholder-thumb.jpg",
    topics: ["Interface", "Navigation", "Productivity"]
  },
  {
    id: 3,
    title: "Advanced Search & Filtering Techniques",
    description: "Discover powerful search operators, filters, and shortcuts to find any bookmark instantly.",
    duration: "5:30",
    difficulty: "Intermediate",
    views: "6.7K",
    rating: 4.9,
    thumbnail: "/placeholder-thumb.jpg",
    topics: ["Search", "Filters", "Shortcuts"]
  },
  {
    id: 4,
    title: "Importing from Chrome, Firefox & Safari",
    description: "Step-by-step guide to importing bookmarks from all major browsers and organizing them automatically.",
    duration: "12:20",
    difficulty: "Beginner",
    views: "15.2K",
    rating: 4.7,
    thumbnail: "/placeholder-thumb.jpg",
    topics: ["Import", "Browsers", "Migration"]
  },
  {
    id: 5,
    title: "Organization Strategies for Different Use Cases",
    description: "Learn proven organization methods for work, research, learning, and personal bookmark collections.",
    duration: "14:35",
    difficulty: "Intermediate",
    views: "9.1K",
    rating: 4.8,
    thumbnail: "/placeholder-thumb.jpg",
    topics: ["Organization", "Strategies", "Use Cases"]
  },
  {
    id: 6,
    title: "Using Tags and Categories Effectively",
    description: "Master the art of tagging and categorization to create flexible, searchable bookmark systems.",
    duration: "7:45",
    difficulty: "Intermediate",
    views: "7.4K",
    rating: 4.9,
    thumbnail: "/placeholder-thumb.jpg",
    topics: ["Tags", "Categories", "Organization"]
  },
  {
    id: 7,
    title: "Mobile Usage Tips & Tricks",
    description: "Optimize your CleanTabs experience on phones and tablets with touch gestures and mobile workflows.",
    duration: "9:10",
    difficulty: "Beginner",
    views: "5.8K",
    rating: 4.6,
    thumbnail: "/placeholder-thumb.jpg",
    topics: ["Mobile", "Touch", "Workflows"]
  },
  {
    id: 8,
    title: "API Integration for Developers",
    description: "Build custom tools and integrations using the CleanTabs REST API with real code examples.",
    duration: "18:55",
    difficulty: "Advanced",
    views: "3.2K",
    rating: 4.9,
    thumbnail: "/placeholder-thumb.jpg",
    topics: ["API", "Development", "Integration"]
  }
];

const difficultyColors = {
  Beginner: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
  Intermediate: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
  Advanced: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
};

export default function VideoGuidesPage() {
  const featuredVideo = videoGuides.find(video => video.featured);
  const regularVideos = videoGuides.filter(video => !video.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Video className="w-4 h-4" />
              Video Tutorials
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Learn CleanTabs
              <br />
              <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                Through Video
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Master CleanTabs with our comprehensive video library. From basic setup to advanced 
              techniques, learn at your own pace with step-by-step visual guides.
            </p>
          </div>

          {/* Featured Video */}
          {featuredVideo && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 rounded-2xl p-8 border border-red-200/50 dark:border-red-800/30 mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[featuredVideo.difficulty as keyof typeof difficultyColors]}`}>
                      {featuredVideo.difficulty}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    {featuredVideo.title}
                  </h2>
                  
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                    {featuredVideo.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredVideo.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {featuredVideo.views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {featuredVideo.rating}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredVideo.topics.map((topic) => (
                      <span key={topic} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-lg font-semibold flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Watch Now
                  </button>
                </div>
                
                <div className="relative">
                  <div className="bg-slate-200 dark:bg-slate-700 rounded-xl aspect-video flex items-center justify-center">
                    <div className="w-16 h-16 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-slate-700 dark:text-slate-300 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                    {featuredVideo.duration}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Video Library */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Video Library
            </h2>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                <option>All Topics</option>
                <option>Getting Started</option>
                <option>Organization</option>
                <option>Search</option>
                <option>API</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularVideos.map((video) => (
              <div key={video.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="bg-slate-200 dark:bg-slate-700 aspect-video flex items-center justify-center">
                    <div className="w-12 h-12 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-slate-700 dark:text-slate-300 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[video.difficulty as keyof typeof difficultyColors]}`}>
                      {video.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {video.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {video.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {video.rating}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {video.topics.slice(0, 2).map((topic) => (
                      <span key={topic} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium">
                    Watch Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Recommended Learning Path
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Follow this sequence to master CleanTabs systematically.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { step: 1, title: "Getting Started with CleanTabs", time: "8 min" },
              { step: 2, title: "Mastering the 3-Panel Interface", time: "6 min" },
              { step: 3, title: "Importing from Chrome, Firefox & Safari", time: "12 min" },
              { step: 4, title: "Using Tags and Categories Effectively", time: "7 min" },
              { step: 5, title: "Advanced Search & Filtering Techniques", time: "5 min" },
              { step: 6, title: "Organization Strategies for Different Use Cases", time: "14 min" }
            ].map((item) => (
              <div key={item.step} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.time}</p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                  Watch
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-950">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Now that you know how to use CleanTabs, create your account and start 
            organizing your digital life today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-4 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              Start Organizing
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/import"
              className="border-2 border-slate-300 dark:border-slate-600 text-slate-300 dark:text-slate-400 px-8 py-4 rounded-xl hover:bg-slate-700 dark:hover:bg-slate-800 transition-all font-semibold"
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