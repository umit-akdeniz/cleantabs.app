'use client';

import { useState } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface PushNotificationSetupProps {
  className?: string;
}

export default function PushNotificationSetup({ className = '' }: PushNotificationSetupProps) {
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnablePushNotifications = async () => {
    setIsLoading(true);
    try {
      await requestPermission();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={`bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <BellOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200">
              Push Notifications Not Supported
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Your browser doesn&apos;t support push notifications. Email notifications will still work.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (permission === 'granted') {
    return (
      <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 className="font-semibold text-green-800 dark:text-green-200">
              Push Notifications Enabled
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              You&apos;ll receive push notifications even when the site is closed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <X className="w-5 h-5 text-red-600 dark:text-red-400" />
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-200">
              Push Notifications Blocked
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              Enable notifications in your browser settings to receive push notifications when the site is closed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              Enable Push Notifications
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Get reminded even when the site is closed (FREE feature!)
            </p>
          </div>
        </div>
        
        <button
          onClick={handleEnablePushNotifications}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Bell className="w-4 h-4" />
          )}
          {isLoading ? 'Enabling...' : 'Enable'}
        </button>
      </div>
    </div>
  );
}