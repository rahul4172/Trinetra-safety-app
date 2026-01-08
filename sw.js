// Service Worker for TRINETRA PWA
const CACHE_NAME = 'trinetra-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy: Cache First, Network Fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// ========== PUSH NOTIFICATIONS ==========
self.addEventListener('push', event => {
  console.log('[ServiceWorker] Push Received:', event.data.text());

  const data = event.data ? event.data.json() : {};
  const title = data.title || '🚨 TRINETRA Emergency';
  const options = {
    body: data.body || 'Emergency alert triggered',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [200, 100, 200, 100, 200, 100, 400],
    tag: 'trinetra-emergency',
    renotify: true,
    requireInteraction: true,
    data: data,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'sos',
        title: '🚨 View SOS'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle Notification Click
self.addEventListener('notificationclick', event => {
  console.log('[ServiceWorker] Notification click:', event.action);

  event.notification.close();

  const urlToOpen = new URL('/', self.location.origin).href;

  switch(event.action) {
    case 'open':
      // Open main app
      event.waitUntil(
        clients.openWindow(urlToOpen)
      );
      break;
    
    case 'sos':
      // Open with SOS mode
      event.waitUntil(
        clients.openWindow(`${urlToOpen}?sos=true`)
      );
      break;
    
    case 'dismiss':
      // Just dismiss
      break;
    
    default:
      // Default: open app
      event.waitUntil(
        clients.openWindow(urlToOpen)
      );
  }
});

// Background Sync (for offline SOS)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-sos') {
    console.log('[ServiceWorker] Background sync for SOS');
    event.waitUntil(syncSOS());
  }
});

async function syncSOS() {
  // This would sync pending SOS alerts when back online
  console.log('Syncing SOS data...');
}
