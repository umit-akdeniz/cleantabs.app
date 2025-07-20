'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function NotificationManager() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    // Only register service worker and check notifications if user is authenticated
    if (!isAuthenticated) return;

    // Register service worker only in production and over HTTPS
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Check for due reminders every 5 minutes
    const checkReminders = async () => {
      try {
        if (!session) return;

        const response = await fetch('/api/check-reminders', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          // Don't log error if it's authentication related
          if (response.status === 401 || response.status === 403) {
            return;
          }
          return;
        }
        
        const result = await response.json();
        
        if (result.success && result.processedCount > 0) {
          console.log(`Processed ${result.processedCount} reminders`);
        }
      } catch (error) {
        // Silent fail for auth errors
      }
    };

    // Initial check after 2 seconds delay
    const initialTimeout = setTimeout(checkReminders, 2000);

    // Set up interval (5 minutes)
    const interval = setInterval(checkReminders, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isAuthenticated, session]);

  return null;
}