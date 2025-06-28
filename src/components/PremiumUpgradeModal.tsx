'use client';

import { useState } from 'react';
import { X, Crown, Check, Zap, Shield, Infinity } from 'lucide-react';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumUpgradeModal({ isOpen, onClose }: PremiumUpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    // TODO: Implement payment integration (Stripe, PayPal, etc.)
    console.log('Upgrade to Premium');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-2xl p-8 w-full max-w-2xl shadow-professional">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="gradient-accent p-3 rounded-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient-accent">
                Upgrade to Premium
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Unlock unlimited potential
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Free Plan */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Free Plan
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Current Plan</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success-600" />
                <span>3 Categories</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success-600" />
                <span>5 Subcategories per Category</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success-600" />
                <span>10 Sites per Subcategory</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success-600" />
                <span>150 Total Sites</span>
              </li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="p-6 gradient-accent text-white rounded-xl shadow-lg">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Premium Plan</h3>
              </div>
              <div className="text-2xl font-bold">$9.99/month</div>
              <p className="text-sm opacity-90">Billed monthly</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Infinity className="w-4 h-4" />
                <span>Unlimited Categories</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Infinity className="w-4 h-4" />
                <span>Unlimited Subcategories</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Infinity className="w-4 h-4" />
                <span>Unlimited Sites</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                <span>Advanced Security</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4" />
                <span>Export & Backup</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Why upgrade to Premium?
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mx-auto mb-3">
                <Infinity className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                No Limits
              </h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Create unlimited categories, subcategories, and sites
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 gradient-success rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                Premium Features
              </h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Advanced features and priority support
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                Enhanced Security
              </h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Advanced security features and data protection
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1 gradient-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Upgrade Now'}
          </button>
        </div>
      </div>
    </div>
  );
}