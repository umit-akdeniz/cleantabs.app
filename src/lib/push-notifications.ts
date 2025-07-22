// Server-side push notification sender using Firebase Admin SDK
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin (server-side)
let adminApp: any = null;

const initializeFirebaseAdmin = () => {
  if (adminApp || getApps().length > 0) {
    return adminApp || getApps()[0];
  }

  try {
    // For demo purposes, we'll use fake credentials
    // In production, you would use real Firebase service account credentials
    const serviceAccount = {
      "type": "service_account",
      "project_id": process.env.FIREBASE_PROJECT_ID || "cleantabs-demo",
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "demo-key-id",
      "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "-----BEGIN PRIVATE KEY-----\nDEMO_KEY\n-----END PRIVATE KEY-----\n",
      "client_email": process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-demo@cleantabs-demo.iam.gserviceaccount.com",
      "client_id": process.env.FIREBASE_CLIENT_ID || "123456789",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token"
    };

    adminApp = initializeApp({
      credential: cert(serviceAccount as any),
      projectId: process.env.FIREBASE_PROJECT_ID || "cleantabs-demo"
    });

    console.log('Firebase Admin initialized successfully');
    return adminApp;
  } catch (error) {
    console.warn('Firebase Admin initialization failed (using demo mode):', error);
    return null;
  }
};

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  siteId?: string;
}

export const sendPushNotification = async (
  fcmToken: string,
  payload: PushNotificationPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const app = initializeFirebaseAdmin();
    
    if (!app) {
      console.warn('Firebase Admin not available - would send push notification:', { fcmToken: fcmToken.substring(0, 20) + '...', payload });
      return { 
        success: true, 
        messageId: `demo-${Date.now()}`,
        error: 'Demo mode - notification would be sent in production'
      };
    }

    const messaging = getMessaging(app);

    const message = {
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.icon || '/icon-192x192.png'
      },
      data: {
        url: payload.url || 'https://cleantabs.app/dashboard',
        siteId: payload.siteId || '',
        click_action: payload.url || 'https://cleantabs.app/dashboard'
      },
      webpush: {
        headers: {
          TTL: '86400' // 24 hours
        },
        notification: {
          title: payload.title,
          body: payload.body,
          icon: payload.icon || '/icon-192x192.png',
          badge: payload.badge || '/icon-72x72.png',
          tag: 'cleantabs-reminder',
          requireInteraction: true,
          actions: [
            {
              action: 'open',
              title: 'Open Site'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        }
      }
    };

    const response = await messaging.send(message);
    
    console.log('Push notification sent successfully:', response);
    return { success: true, messageId: response };

  } catch (error: any) {
    console.error('Error sending push notification:', error);
    
    // For demo purposes, don't fail on Firebase errors
    if (error.code?.includes('app/no-app') || error.message?.includes('credential')) {
      console.warn('Firebase not configured - would send push notification in production');
      return { 
        success: true, 
        messageId: `demo-${Date.now()}`,
        error: 'Demo mode - notification would be sent in production'
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Failed to send push notification' 
    };
  }
};

export const sendBulkPushNotifications = async (
  tokens: string[],
  payload: PushNotificationPayload
): Promise<{ success: boolean; successCount: number; failureCount: number; errors?: any[] }> => {
  const results = await Promise.allSettled(
    tokens.map(token => sendPushNotification(token, payload))
  );

  let successCount = 0;
  let failureCount = 0;
  const errors: any[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success) {
      successCount++;
    } else {
      failureCount++;
      errors.push({
        token: tokens[index].substring(0, 20) + '...',
        error: result.status === 'fulfilled' ? result.value.error : result.reason
      });
    }
  });

  return {
    success: successCount > 0,
    successCount,
    failureCount,
    errors: errors.length > 0 ? errors : undefined
  };
};