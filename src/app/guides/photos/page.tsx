import Link from 'next/link';
import { Image, Camera, Palette, Layout, Tag, Search, ArrowRight, Download, Eye, Heart } from 'lucide-react';
import SimpleNav from '@/components/SimpleNav';
import LandingFooter from '@/components/LandingFooter';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: 'Photo & Visual Organization Guide',
  description: 'Learn how to organize photos, images, and visual bookmarks in CleanTabs. Best practices for design inspiration, photography collections, and visual content organization.',
  keywords: ['photo organization', 'visual bookmarks', 'image organization', 'design inspiration organization', 'photography bookmarks', 'visual content management'],
  canonical: '/guides/photos',
});

const photoStrategies = [
  {
    title: "Design Inspiration",
    description: "Organize UI/UX designs, color palettes, and creative inspiration",
    icon: Palette,
    tips: [
      "Create separate categories for UI, Colors, Typography, and Illustrations",
      "Use tags like 'minimalist', 'colorful', 'dark-mode', 'mobile-first'",
      "Add detailed descriptions about what inspired you",
      "Save color codes and design specifications in notes"
    ],
    examples: [
      "🎨 Design → UI Inspiration → E-commerce",
      "🎨 Design → Color Palettes → Gradients",
      "🎨 Design → Typography → Sans-serif"
    ]
  },
  {
    title: "Photography & Art",
    description: "Curate photography portfolios, art galleries, and visual references",
    icon: Camera,
    tips: [
      "Organize by style (Portrait, Landscape, Street, Abstract)",
      "Tag with techniques (HDR, Black&White, Long-exposure)",
      "Note camera settings, locations, or artistic techniques",
      "Create mood boards for different projects"
    ],
    examples: [
      "📸 Photography → Portrait → Studio Lighting",
      "📸 Photography → Landscape → Golden Hour",
      "🖼️ Art → Abstract → Geometric Patterns"
    ]
  },
  {
    title: "Product Research",
    description: "Save product images, comparisons, and visual shopping references",
    icon: Search,
    tips: [
      "Group by category (Electronics, Fashion, Home, etc.)",
      "Tag with features (Wireless, Vintage, Eco-friendly)",
      "Save price ranges and availability in descriptions",
      "Create wishlists and comparison collections"
    ],
    examples: [
      "🛍️ Shopping → Electronics → Headphones",
      "🛍️ Shopping → Fashion → Minimalist",
      "🏠 Home → Furniture → Scandinavian"
    ]
  },
  {
    title: "Recipe Collections",
    description: "Organize food photography, recipe images, and cooking inspiration",
    icon: Heart,
    tips: [
      "Categorize by meal type (Breakfast, Dinner, Desserts)",
      "Tag with dietary preferences (Vegan, Gluten-free, Keto)",
      "Note cooking time, difficulty, and key ingredients",
      "Save seasonal or occasion-based recipes"
    ],
    examples: [
      "🍳 Recipes → Breakfast → Quick & Easy",
      "🥗 Recipes → Healthy → Plant-based",
      "🎂 Recipes → Desserts → Special Occasions"
    ]
  }
];

const organizationTips = [
  {
    title: "Visual Hierarchy",
    description: "Structure your image collections for easy browsing",
    tips: [
      "Use emojis in category names for quick visual identification",
      "Create thumbnail-friendly descriptions",
      "Prioritize most-used collections at the top",
      "Group similar visual styles together"
    ]
  },
  {
    title: "Tagging Strategy",
    description: "Create flexible cross-category connections",
    tips: [
      "Use consistent tag naming (lowercase, hyphens)",
      "Include style tags (minimal, vintage, modern)",
      "Add color tags (blue, warm-tones, monochrome)",
      "Tag by usage context (work, personal, inspiration)"
    ]
  },
  {
    title: "Description Best Practices",
    description: "Make your visual bookmarks searchable and meaningful",
    tips: [
      "Include key visual elements in descriptions",
      "Note source, artist, or designer when relevant",
      "Add context about why you saved it",
      "Include technical details if applicable"
    ]
  }
];

const visualExamples = [
  {
    category: "🎨 Design Inspiration",
    subcategories: [
      "UI/UX Examples",
      "Color Palettes",
      "Typography",
      "Icons & Illustrations"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    category: "📸 Photography",
    subcategories: [
      "Portrait Photography",
      "Landscape & Nature",
      "Street Photography",
      "Abstract & Artistic"
    ],
    color: "from-blue-500 to-indigo-500"
  },
  {
    category: "🏠 Home & Decor",
    subcategories: [
      "Interior Design",
      "Furniture Ideas",
      "DIY Projects",
      "Garden & Outdoor"
    ],
    color: "from-green-500 to-teal-500"
  },
  {
    category: "👗 Fashion & Style",
    subcategories: [
      "Outfit Ideas",
      "Accessories",
      "Seasonal Styles",
      "Color Coordination"
    ],
    color: "from-pink-500 to-rose-500"
  }
];

export default function PhotoGuidePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SimpleNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Image className="w-4 h-4" />
            Photo & Visual Guide
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Organize Visual Content
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Master the art of organizing photos, images, and visual bookmarks in CleanTabs. 
            From design inspiration to recipe collections, learn proven strategies for visual organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              Start Organizing Photos
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guides/videos"
              className="border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold"
            >
              Watch Video Tutorials
            </Link>
          </div>
        </div>
      </section>

      {/* Organization Strategies */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Visual Organization Strategies
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Different types of visual content require different organization approaches. 
              Here are proven strategies for common use cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {photoStrategies.map((strategy, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <strategy.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{strategy.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{strategy.description}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">Best Practices:</h4>
                  <ul className="space-y-2">
                    {strategy.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">Example Structure:</h4>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 space-y-1">
                    {strategy.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="text-sm font-mono text-slate-700 dark:text-slate-300">
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Examples */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Example Category Structures
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Visual examples of how to structure different types of image collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visualExamples.map((example, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className={`bg-gradient-to-r ${example.color} p-4 rounded-lg mb-4`}>
                  <h3 className="text-white font-semibold text-lg">{example.category}</h3>
                </div>
                
                <div className="space-y-2">
                  {example.subcategories.map((subcategory, subIndex) => (
                    <div key={subIndex} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                        <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{subcategory}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Advanced Organization Tips
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Take your visual organization to the next level with these professional techniques.
            </p>
          </div>

          <div className="space-y-8">
            {organizationTips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {tip.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {tip.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tip.tips.map((tipItem, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{tipItem}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tagging Examples */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Smart Tagging Examples
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              See how effective tagging can make your visual bookmarks searchable and connected.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Example: UI Design Bookmark</h3>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="font-medium text-slate-900 dark:text-white mb-2">Dashboard Design - Spotify Clone</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Clean dashboard interface with dark mode, card-based layout, and intuitive navigation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">ui-design</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">dashboard</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">dark-mode</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">cards</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">music-app</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">inspiration</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Example: Recipe Photo</h3>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="font-medium text-slate-900 dark:text-white mb-2">Mediterranean Quinoa Bowl</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Healthy quinoa bowl with roasted vegetables, feta cheese, and tahini dressing. 30-minute meal.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">healthy</span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">vegetarian</span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">quinoa</span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">mediterranean</span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">quick-meal</span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">lunch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Organize Your Visual Collection?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Start organizing your photos, designs, and visual inspiration with CleanTabs. 
            Turn visual chaos into organized clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-purple-50 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              Start Organizing
              <Image className="w-5 h-5" />
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