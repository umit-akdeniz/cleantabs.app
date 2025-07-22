import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cleantabs-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cleantabs-demo", 
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cleantabs-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo-app-id"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Cloud Messaging
let messaging: any = null;
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase messaging not available:', error);
  }
}

// Notification permission helper
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    if (!messaging) {
      console.warn('Firebase messaging not initialized');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      // Get FCM registration token
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'demo-vapid-key'
      });
      
      if (currentToken) {
        console.log('FCM registration token:', currentToken);
        return currentToken;
      } else {
        console.log('No registration token available');
        return null;
      }
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () => 
  new Promise((resolve) => {
    if (!messaging) {
      console.warn('Firebase messaging not available for foreground messages');
      return;
    }

    onMessage(messaging, (payload: MessagePayload) => {
      console.log('Foreground message received:', payload);
      resolve(payload);
    });
  });

// Save FCM token to user profile
export const saveFCMToken = async (token: string, userId: string) => {
  try {
    const response = await fetch('/api/user/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        userId
      })
    });

    if (response.ok) {
      console.log('FCM token saved successfully');
      return true;
    } else {
      console.error('Failed to save FCM token');
      return false;
    }
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return false;
  }
};

export { messaging };
export default app;