'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Globe, Bell, Shield, Download, Crown, UserCog } from 'lucide-react';
// import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportBookmarks = async () => {
    if (user?.plan !== 'PREMIUM') {
      alert('Premium subscription required for bookmark export');
      return;
    }

    setIsExporting(true);
    try {
      const response = await fetch('/api/export/bookmarks', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Export successful! ${data.totalBookmarks} bookmarks have been sent to your email.`);
      } else {
        alert(data.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:bg-gradient-to-br">
      {/* Header */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-700/30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">Desktop Notifications</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Get notified about important updates</div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

{/* Language - Temporarily disabled
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Language</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Interface Language
                </label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="en">English</option>
                  <option value="tr">Turkish</option>
                </select>
              </div>
            </div>
          </div>
          */}

          {/* Data Export & Backup */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Data Export & Backup</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">Export All Bookmarks</h3>
                      {user?.plan === 'PREMIUM' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full">
                          <Crown className="w-3 h-3" />
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          Premium Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      Export all your bookmarks as an HTML file and receive it via email. 
                      Compatible with all browsers and bookmark managers.
                    </p>
                    <button
                      onClick={handleExportBookmarks}
                      disabled={isExporting || user?.plan !== 'PREMIUM'}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        user?.plan === 'PREMIUM' && !isExporting
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      {isExporting ? 'Exporting...' : 'Export to Email'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Panel */}
          {user?.email === 'umitakdenizjob@gmail.com' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <UserCog className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Administration</h2>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={() => router.push('/dashboard-9f3b74bf7f89769bc4ce3b538f864dff916b85a11acb33c0756633441e089841')}
                  className="w-full text-left p-3 rounded-lg border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <div className="font-medium text-purple-900 dark:text-purple-100">Admin Dashboard</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Access system administration panel</div>
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Security */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Privacy & Security</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className="font-medium text-slate-900 dark:text-slate-100">Change Password</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Update your account password</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className="font-medium text-slate-900 dark:text-slate-100">Two-Factor Authentication</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Add extra security to your account</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}