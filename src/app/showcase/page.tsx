'use client';

import { useState } from 'react';
import { Monitor, Tablet, Smartphone, Check, Play, Pause } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';

const devices = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%', height: '600px' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: '768px', height: '600px' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '375px', height: '600px' }
];

const features = [
  {
    title: "Responsive 3-Panel Layout",
    description: "Adapts seamlessly across all screen sizes while maintaining full functionality",
    devices: ["desktop", "tablet", "mobile"]
  },
  {
    title: "Touch-Optimized Interface",
    description: "Native touch gestures for mobile and tablet users",
    devices: ["tablet", "mobile"]
  },
  {
    title: "Progressive Enhancement",
    description: "Advanced features on larger screens, essential features everywhere",
    devices: ["desktop", "tablet", "mobile"]
  },
  {
    title: "Offline Capability",
    description: "Access your organized bookmarks even without internet connection",
    devices: ["desktop", "tablet", "mobile"]
  }
];

export default function ShowcasePage() {
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [isPlaying, setIsPlaying] = useState(false);

  const currentDevice = devices.find(d => d.id === activeDevice);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Smartphone className="w-4 h-4" />
            Responsive Design Showcase
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Beautiful on Every Device
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Powerful Everywhere
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            CleanTabs delivers a premium experience across desktop, tablet, and mobile. 
            See how our responsive design adapts to your workflow, wherever you are.
          </p>
        </div>
      </section>

      {/* Device Selector */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-4 mb-8">
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => setActiveDevice(device.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeDevice === device.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <device.icon className="w-5 h-5" />
                {device.label}
              </button>
            ))}
          </div>

          {/* Device Frame */}
          <div className="flex justify-center">
            <div 
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-500"
              style={{ width: currentDevice?.width, maxWidth: '100%' }}
            >
              {/* Browser Chrome */}
              <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 border-b border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="ml-4 bg-white dark:bg-slate-600 rounded-md px-3 py-1 text-sm text-slate-600 dark:text-slate-300">
                      cleantabs.app/dashboard
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Demo'}
                  </button>
                </div>
              </div>

              {/* App Interface */}
              <div 
                className="relative bg-slate-50 dark:bg-slate-900"
                style={{ height: currentDevice?.height }}
              >
                {activeDevice === 'desktop' && <DesktopView />}
                {activeDevice === 'tablet' && <TabletView />}
                {activeDevice === 'mobile' && <MobileView />}
                
                {/* Overlay for demo mode */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">Interactive Demo</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Experience CleanTabs live</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Responsive Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Every feature designed to work perfectly on every device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Available on:</span>
                  <div className="flex gap-2">
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          feature.devices.includes(device.id)
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        <device.icon className="w-3 h-3" />
                        {feature.devices.includes(device.id) && <Check className="w-3 h-3" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Technical Excellence
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Built with modern web technologies for optimal performance across all devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Progressive Web App</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Install CleanTabs on any device for native app-like experience with offline support.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Mobile-First Design</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Designed for mobile first, enhanced for larger screens. Touch-optimized interactions everywhere.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tablet className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Adaptive Interface</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Interface adapts intelligently to screen size and device capabilities for optimal usability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

// Desktop Interface Component
function DesktopView() {
  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-900 dark:text-white">Categories</div>
          <div className="space-y-1">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm">🚀 Work</div>
            <div className="text-slate-600 dark:text-slate-400 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700">📚 Learning</div>
            <div className="text-slate-600 dark:text-slate-400 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700">🎨 Design</div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm font-medium text-slate-900 dark:text-white mb-3">Sites</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm">GitHub</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-sm">Figma</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm font-medium text-slate-900 dark:text-white mb-3">Details</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              <p><strong>GitHub</strong></p>
              <p>Development platform for version control and collaboration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tablet Interface Component
function TabletView() {
  return (
    <div className="h-full p-4">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="text-sm font-medium text-slate-900 dark:text-white mb-3">Categories</div>
          <div className="space-y-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm">🚀 Work</div>
            <div className="text-slate-600 dark:text-slate-400 px-3 py-2 rounded-lg text-sm">📚 Learning</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="text-sm font-medium text-slate-900 dark:text-white mb-3">Sites</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">GitHub</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-sm">Figma</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Interface Component  
function MobileView() {
  return (
    <div className="h-full p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 h-full">
        <div className="text-sm font-medium text-slate-900 dark:text-white mb-3">Categories</div>
        <div className="space-y-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm">🚀 Work (24 sites)</div>
          <div className="text-slate-600 dark:text-slate-400 px-3 py-2 rounded-lg text-sm">📚 Learning (12 sites)</div>
          <div className="text-slate-600 dark:text-slate-400 px-3 py-2 rounded-lg text-sm">🎨 Design (8 sites)</div>
        </div>
      </div>
    </div>
  );
}