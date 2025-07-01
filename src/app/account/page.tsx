'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Crown, Calendar, Shield, Edit3, Save, X, CreditCard, Download, RefreshCcw } from 'lucide-react';

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving:', { name, email });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(session?.user?.name || '');
    setEmail(session?.user?.email || '');
    setIsEditing(false);
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
                <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">My Account</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          
          {/* Profile Information */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  session?.user?.plan === 'PREMIUM' 
                    ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
                    : 'bg-gradient-to-br from-slate-500 to-slate-600'
                }`}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile Information</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal details</p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                ) : (
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-slate-100">
                    {session?.user?.name || 'Not set'}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                ) : (
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-slate-100">
                    {session?.user?.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subscription Management */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Subscription Management</h2>
            </div>
            
            {/* Current Plan */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    session?.user?.plan === 'PREMIUM' 
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600' 
                      : 'bg-slate-500'
                  }`}>
                    {session?.user?.plan === 'PREMIUM' ? (
                      <Crown className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {session?.user?.plan === 'PREMIUM' ? 'Premium Plan' : 'Free Plan'}
                      </span>
                      {session?.user?.plan === 'PREMIUM' && (
                        <span className="text-sm px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {session?.user?.plan === 'PREMIUM' 
                        ? '$9.99/month • Next billing: January 15, 2024' 
                        : 'Limited to 5 categories and 50 sites'
                      }
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {session?.user?.plan === 'PREMIUM' ? '$9.99' : 'Free'}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {session?.user?.plan === 'PREMIUM' ? 'per month' : 'forever'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-3">
              {session?.user?.plan === 'PREMIUM' ? (
                <>
                  <button className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <RefreshCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Manage Subscription</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Download Invoices</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 border border-red-200 dark:border-red-800 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">Cancel Subscription</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">Upgrade to Premium</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <CreditCard className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">View Pricing</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Free Trial</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Billing History */}
          {session?.user?.plan === 'PREMIUM' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Billing History</h2>
              </div>
              
              <div className="space-y-3">
                {/* Sample invoices */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">Premium Plan</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">December 15, 2023</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900 dark:text-slate-100">$9.99</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Download</button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">Premium Plan</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">November 15, 2023</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900 dark:text-slate-100">$9.99</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Download</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Account Statistics</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">5</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Categories</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Subcategories</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">28</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Websites</div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <div className="font-medium text-red-600">Delete Account</div>
                <div className="text-sm text-red-500">Permanently delete your account and all data</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}