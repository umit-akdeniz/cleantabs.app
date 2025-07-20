export const dynamic = 'force-dynamic';

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';
import Logo from '@/components/Logo';
import { safeFetch } from '@/lib/api-client';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
      return;
    }

    // Verify email with token
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        
        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now sign in to your account.');
          
          // Redirect to sign in after 3 seconds
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
        } else {
          const data = await response.json();
          setStatus('error');
          setMessage(data.error || 'Invalid or expired verification token.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const handleResendVerification = async () => {
    if (!email.trim()) {
      return;
    }

    setResendLoading(true);
    setResendSuccess(false);

    try {
      await safeFetch('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      setResendSuccess(true);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Logo size="md" showText={true} />
        </div>

        {/* Main Container */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
          {status === 'loading' && (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Verifying your email
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Email verified!
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                {message}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Redirecting to sign in...
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Verification failed
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                {message}
              </p>
              
              {/* Resend verification */}
              <div className="space-y-4">
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Need a new verification link? Enter your email address:
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="your@email.com"
                        autoComplete="email"
                      />
                    </div>
                    <button
                      onClick={handleResendVerification}
                      disabled={resendLoading || !email.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Resend'
                      )}
                    </button>
                  </div>
                  
                  {resendSuccess && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                      <p className="text-green-600 dark:text-green-400 text-sm">
                        Verification email sent! Check your inbox.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="mt-8 text-center space-y-2">
            <Link 
              href="/auth/signin" 
              className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              Go to sign in
            </Link>
            <Link 
              href="/auth/signup" 
              className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}