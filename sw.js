const CACHE_NAME = 'bharat-darshan-v1';
const urlsToCache = [
  './',
  './index.html',
  './exploretrip.html',
  './dashboard.html',
  './signin.html',
  './index.js',
  './exploretrip.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New trip available!',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: './index.html' }
  };
  event.waitUntil(
    self.registration.showNotification('Bharat Darshan', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || './index.html')
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return fetch('/api/sync')
    .then(response => {
      console.log('Background sync completed');
    })
    .catch(error => {
      console.log('Background sync failed:', error);
    });
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'trips-sync') {
    event.waitUntil(syncTripsData());
  }
});

function syncTripsData() {
  return fetch('https://script.google.com/macros/s/AKfycbzBEnTzYfb1HF0JgHzMjmUKLnHACmGpjWN_a-5W5E1Q1UvweIM97eqzmYVRLYs2LEbK/exec')
    .then(response => response.json())
    .then(data => {
      return caches.open('trips-data').then(cache => {
        cache.put('/trips-data', new Response(JSON.stringify(data)));
      });
    })
    .catch(error => console.log('Periodic sync failed:', error));
}