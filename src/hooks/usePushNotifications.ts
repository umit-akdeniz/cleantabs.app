import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener, saveFCMToken } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/context';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    try {
      if (!isSupported) {
        console.warn('Push notifications not supported');
        return false;
      }

      const fcmToken = await requestNotificationPermission();
      
      if (fcmToken && user) {
        setToken(fcmToken);
        setPermission('granted');
        
        // Save token to user profile
        const saved = await saveFCMToken(fcmToken, user.id);
        if (saved) {
          console.log('FCM token saved successfully');
        }
        
        return true;
      } else {
        setPermission('denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting push notification permission:', error);
      return false;
    }
  };

  // Listen for foreground messages
  useEffect(() => {
    if (!isSupported || permission !== 'granted') return;

    const unsubscribe = onMessageListener().then((payload: any) => {
      console.log('Foreground push notification received:', payload);
      
      // Show browser notification for foreground messages
      if (payload.notification) {
        new Notification(payload.notification.title || 'CleanTabs Reminder', {
          body: payload.notification.body,
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
          tag: 'cleantabs-reminder',
          requireInteraction: true
        });
      }
    }).catch((error) => {
      console.error('Error listening for foreground messages:', error);
    });

    return () => {
      // Cleanup if needed
    };
  }, [isSupported, permission]);

  return {
    isSupported,
    permission,
    token,
    requestPermission
  };
};