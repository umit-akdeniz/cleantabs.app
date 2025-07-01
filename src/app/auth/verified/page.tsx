'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

export default function EmailVerifiedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:bg-gradient-to-br flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          {/* Success Message */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Email Verified!
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Your email address has been successfully verified. You can now enjoy all features of CleanTabs.
          </p>
          
          {/* Auto-redirect Notice */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Redirecting to dashboard in <span className="font-semibold text-blue-600 dark:text-blue-400">{countdown}</span> seconds...
            </p>
          </div>
          
          {/* Manual Navigation */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign In Again
            </button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              If you have any issues, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}