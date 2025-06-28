'use client';

import { useEffect } from 'react';

export default function NotificationManager() {
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
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
        const response = await fetch('/api/check-reminders');
        const result = await response.json();
        
        if (result.success && result.processedCount > 0) {
          console.log(`Processed ${result.processedCount} reminders`);
        }
      } catch (error) {
        console.error('Error checking reminders:', error);
      }
    };

    // Initial check
    checkReminders();

    // Set up interval for checking reminders
    const reminderInterval = setInterval(checkReminders, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearInterval(reminderInterval);
    };
  }, []);

  return null; // This component doesn't render anything
}