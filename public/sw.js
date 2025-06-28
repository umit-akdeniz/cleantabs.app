// Service Worker for SiteHub Pro notifications

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);
  
  event.notification.close();
  
  // Get the URL from notification data
  const url = event.notification.data?.url || '/';
  
  // Open the app or focus existing window
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no existing window, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

// Handle push notifications (for future use with web push)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: {
        url: data.url || '/'
      },
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
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle background sync (for future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-reminder-check') {
    event.waitUntil(checkRemindersInBackground());
  }
});

async function checkRemindersInBackground() {
  try {
    const response = await fetch('/api/check-reminders');
    const result = await response.json();
    console.log('Background reminder check completed:', result);
  } catch (error) {
    console.error('Background reminder check failed:', error);
  }
}