'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1234567890'
        })
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = {
    free: [
      'Up to 10 categories',
      'Up to 15 subcategories per category',
      'Up to 50 sites per subcategory',
      'Basic notifications',
      'Basic notes',
      'Standard support'
    ],
    premium: [
      'Unlimited categories',
      'Unlimited subcategories',
      'Unlimited sites',
      'Email notifications',
      'Advanced reminders',
      'Rich notes with markdown',
      'Export data',
      'Priority support',
      'Advanced analytics',
      'Custom themes',
      'API access',
      'Team collaboration'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-primary-50/30 to-accent-50/50 dark:from-brand-950 dark:via-brand-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Logo size="xl" />
          <h1 className="text-4xl font-bold text-brand-900 dark:text-brand-100 mt-8 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-brand-600 dark:text-brand-400 max-w-2xl mx-auto">
            Upgrade to SiteVault Pro Premium for unlimited access and advanced features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white dark:bg-brand-900 rounded-2xl p-8 shadow-professional border border-brand-200 dark:border-brand-700">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-brand-900 dark:text-brand-100 mb-2">
                Free Plan
              </h3>
              <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-4">
                $0<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-brand-600 dark:text-brand-400">
                Perfect for personal use
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                  <span className="text-brand-700 dark:text-brand-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full py-3 px-4 bg-brand-100 dark:bg-brand-800 text-brand-500 dark:text-brand-400 rounded-lg font-medium cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-8 shadow-elevated text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                <Star className="w-4 h-4 inline mr-1" />
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Crown className="w-6 h-6" />
                Premium Plan
              </h3>
              <div className="text-4xl font-bold mb-4">
                $9.99<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-white/80">
                For power users and professionals
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-primary-600 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Upgrade Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-accent-500" />
            <span className="text-brand-700 dark:text-brand-300 font-medium">
              Secure Payment Processing
            </span>
          </div>
          <p className="text-brand-600 dark:text-brand-400 text-sm">
            All payments are processed securely through Stripe. Your card information is never stored on our servers.
            Cancel anytime, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}