'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const handleUpgrade = async (priceType: 'premium_monthly' | 'premium_yearly' = 'premium_monthly') => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceType
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Payment system is currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const plans = {
    free: {
      name: 'FREE',
      price: 0,
      period: 'Forever',
      description: 'Perfect for personal use',
      features: [
        '5 categories',
        '15 subcategories total',
        '100 sites total',
        'Basic notes',
        'Standard support',
        'Web access'
      ],
      popular: false,
      buttonText: 'Current Plan',
      buttonStyle: 'disabled'
    },
    pro: {
      name: 'PRO',
      price: 4.99,
      yearlyPrice: 49.90,
      period: 'month',
      description: 'For power users and professionals',
      features: [
        'Unlimited categories & subcategories',
        'Unlimited sites',
        'Advanced search',
        'Email reminders',
        'Rich notes with markdown',
        'Export/import data',
        'Priority support',
        'Mobile apps',
        'Advanced analytics'
      ],
      popular: true,
      buttonText: 'Start Free Trial',
      buttonStyle: 'primary'
    },
    lifetime: {
      name: 'LIFETIME',
      price: 129,
      period: 'one-time',
      description: 'All PRO features forever',
      features: [
        'Everything in PRO',
        'Lifetime access',
        'Future updates included',
        'Premium support',
        'Early access to new features',
        'No recurring payments',
        'Lifetime license'
      ],
      popular: false,
      buttonText: 'Buy Lifetime',
      buttonStyle: 'secondary'
    },
    enterprise: {
      name: 'ENTERPRISE',
      price: 19.99,
      period: 'month/team',
      description: 'For teams and organizations',
      features: [
        'Everything in PRO',
        'Team collaboration',
        'SSO integration',
        'API access',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'Security compliance',
        'Admin dashboard'
      ],
      popular: false,
      buttonText: 'Contact Sales',
      buttonStyle: 'secondary'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-primary-50/30 to-accent-50/50 dark:from-brand-950 dark:via-brand-900 dark:to-slate-900">
      <AdvancedNav />
      <div className="container mx-auto px-4 py-16 pt-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-brand-900 dark:text-brand-100 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-brand-600 dark:text-brand-400 max-w-2xl mx-auto">
            Upgrade to CleanTabs Premium for unlimited access and advanced features
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-brand-900 dark:text-brand-100' : 'text-brand-500 dark:text-brand-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-200 dark:bg-brand-700 transition-colors"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-brand-900 dark:text-brand-100' : 'text-brand-500 dark:text-brand-400'}`}>
              Yearly <span className="text-accent-500 font-bold">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`rounded-2xl p-6 shadow-professional border relative ${
                plan.popular
                  ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white border-primary-500'
                  : 'bg-white dark:bg-brand-900 border-brand-200 dark:border-brand-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white text-primary-600 rounded-full px-4 py-1 text-sm font-medium shadow-sm">
                    <Star className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold mb-2 ${
                  plan.popular ? 'text-white' : 'text-brand-900 dark:text-brand-100'
                }`}>
                  {plan.name}
                </h3>
                <div className={`text-3xl font-bold mb-2 ${
                  plan.popular ? 'text-white' : 'text-brand-600 dark:text-brand-400'
                }`}>
                  ${plan.name === 'PRO' && isYearly && 'yearlyPrice' in plan && plan.yearlyPrice ? (plan.yearlyPrice / 12).toFixed(2) : plan.price}
                  <span className="text-lg font-normal">
                    {plan.period === 'one-time' ? '' : `/${plan.period}`}
                  </span>
                </div>
                {plan.name === 'PRO' && isYearly && 'yearlyPrice' in plan && plan.yearlyPrice && (
                  <div className={`text-sm mb-2 ${
                    plan.popular ? 'text-white/80' : 'text-brand-500'
                  }`}>
                    Billed annually at ${plan.yearlyPrice}
                  </div>
                )}
                <p className={`text-sm ${
                  plan.popular ? 'text-white/80' : 'text-brand-600 dark:text-brand-400'
                }`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      plan.popular ? 'text-white' : 'text-accent-500'
                    }`} />
                    <span className={`text-sm ${
                      plan.popular ? 'text-white' : 'text-brand-700 dark:text-brand-300'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (plan.buttonText === 'Contact Sales') {
                    window.location.href = 'mailto:sales@cleantabs.app';
                  } else if (plan.buttonText !== 'Current Plan') {
                    handleUpgrade(plan.name === 'PRO' && isYearly ? 'premium_yearly' : 'premium_monthly');
                  }
                }}
                disabled={loading || plan.buttonStyle === 'disabled'}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  plan.buttonStyle === 'primary'
                    ? 'bg-white text-primary-600 hover:bg-white/90'
                    : plan.buttonStyle === 'secondary'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-brand-100 dark:bg-brand-800 text-brand-500 dark:text-brand-400 cursor-not-allowed'
                }`}
              >
                {loading && plan.popular ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {plan.buttonText === 'Start Free Trial' && <Zap className="w-4 h-4" />}
                    {plan.buttonText === 'Buy Lifetime' && <Crown className="w-4 h-4" />}
                    {plan.buttonText}
                  </>
                )}
              </button>
            </div>
          ))}
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
      <LandingFooter />
    </div>
  );
}