'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Check, Settings } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary-only');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Cookie className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Cookie Preferences
              </h3>
              
              {!showDetails ? (
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                    By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Accept All
                    </button>
                    
                    <button
                      onClick={handleAcceptNecessary}
                      className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Necessary Only
                    </button>
                    
                    <button
                      onClick={() => setShowDetails(true)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    Choose which cookies you want to accept:
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Essential Cookies</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Required for basic site functionality</p>
                      </div>
                      <div className="text-slate-500 text-sm">Always Active</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Analytics Cookies</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Help us improve by collecting usage data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Save Preferences
                    </button>
                    
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleReject}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Reject all cookies"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}