import Link from 'next/link';
import { ArrowRight, Users, Target, Heart, Lightbulb, Globe, Shield } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';
import { generateSEO } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...generateSEO({
    title: "About CleanTabs - Building the Future of Digital Organization",
    description: "Learn about CleanTabs' mission to transform digital organization. Meet our team, discover our values, and see how we're helping 10,000+ users organize their digital lives with elegant, privacy-first tools.",
    keywords: ['about cleantabs', 'digital organization company', 'bookmark manager team', 'privacy-first technology', 'user-centered design', 'digital workspace solutions', 'productivity startup', 'clean technology'],
    canonical: '/about',
  }),
};

const team = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Former UX designer at tech giants, passionate about digital organization and user experience.",
    avatar: "SC"
  },
  {
    name: "Mike Rodriguez", 
    role: "CTO",
    bio: "Full-stack engineer with 10+ years building scalable web applications and APIs.",
    avatar: "MR"
  },
  {
    name: "Emma Thompson",
    role: "Head of Product",
    bio: "Product manager focused on user research and creating delightful digital experiences.",
    avatar: "ET"
  },
  {
    name: "David Kim",
    role: "Lead Designer",
    bio: "UI/UX designer specializing in responsive design and accessibility.",
    avatar: "DK"
  }
];

const values = [
  {
    icon: Users,
    title: "User-Centered",
    description: "Every decision we make starts with our users. Their needs, workflows, and feedback drive our product development."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data belongs to you. We build with privacy by design and never sell or misuse your personal information."
  },
  {
    icon: Lightbulb,
    title: "Simplicity",
    description: "Powerful doesn't mean complicated. We believe the best tools are intuitive and get out of your way."
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Organization tools should work for everyone, everywhere. We build inclusive experiences across all devices."
  }
];

const milestones = [
  {
    year: "2023",
    title: "The Idea",
    description: "Founded CleanTabs after experiencing the pain of scattered bookmarks across multiple browsers and devices."
  },
  {
    year: "2024 Q1",
    title: "Beta Launch",
    description: "Launched private beta with 100 users. Received overwhelming positive feedback on the 3-panel interface."
  },
  {
    year: "2024 Q2",
    title: "Public Release",
    description: "Released CleanTabs to the public with core features: import, organization, and responsive design."
  },
  {
    year: "2024 Q3",
    title: "API Development",
    description: "Developed comprehensive REST API enabling developers to build custom tools and integrations."
  },
  {
    year: "2024 Q4",
    title: "Growing Community",
    description: "Reached 10,000+ active users and 1M+ organized bookmarks. Community feedback shapes our roadmap."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Our Story
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Building the Future
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              of Digital Organization
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            CleanTabs was born from a simple frustration: why is organizing our digital lives 
            so chaotic when the tools should make it effortless? We&apos;re here to change that.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
              </div>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                To transform the way people organize and interact with their digital content. 
                We believe that good organization shouldn&apos;t require constant maintenance or 
                complex systems—it should just work.
              </p>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Every day, millions of people lose valuable time searching through disorganized 
                bookmarks, struggling with outdated interfaces, or abandoning organization 
                altogether. We&apos;re building CleanTabs to solve this universal problem with 
                elegant design and intelligent automation.
              </p>
              
              <Link
                href="/features"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                See How We Do It
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">10,000+</div>
                <div className="text-slate-600 dark:text-slate-400 mb-4">Happy Users</div>
                
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">1M+</div>
                <div className="text-slate-600 dark:text-slate-400 mb-4">Organized Bookmarks</div>
                
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">50+</div>
                <div className="text-slate-600 dark:text-slate-400">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              The principles that guide everything we build and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Meet the Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              The passionate people building the future of digital organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{member.avatar}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                
                <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">
                  {member.role}
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              From idea to impact—the CleanTabs story so far.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {milestone.year}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-950">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            What&apos;s Next?
          </h2>
          <p className="text-xl text-slate-300 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            We&apos;re just getting started. Mobile apps, team collaboration, advanced analytics, 
            and more exciting features are on the horizon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-4 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              Join Our Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/blog"
              className="border-2 border-slate-300 dark:border-slate-600 text-slate-300 dark:text-slate-400 px-8 py-4 rounded-xl hover:bg-slate-700 dark:hover:bg-slate-800 transition-all font-semibold"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}