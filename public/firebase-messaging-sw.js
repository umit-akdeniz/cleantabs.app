// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "cleantabs-demo.firebaseapp.com", 
  projectId: "cleantabs-demo",
  storageBucket: "cleantabs-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'CleanTabs Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new reminder',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'cleantabs-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open Site',
        icon: '/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-72x72.png'
      }
    ],
    data: {
      url: payload.data?.url || 'https://cleantabs.app/dashboard',
      siteId: payload.data?.siteId
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  if (event.action === 'open') {
    // Open the site URL
    const url = event.notification.data?.url || 'https://cleantabs.app/dashboard';
    event.waitUntil(clients.openWindow(url));
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open dashboard
    event.waitUntil(clients.openWindow('https://cleantabs.app/dashboard'));
  }
});