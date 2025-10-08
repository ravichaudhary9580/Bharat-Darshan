const BASE_URL = 'https://ravichaudhary9580.github.io/Bharat-Darshan/';
const CACHE_NAME = 'bharat-darshan-v2';
const urlsToCache = [
  BASE_URL,
  BASE_URL + 'index.html',
  BASE_URL + 'exploretrip.html',
  BASE_URL + 'dashboard.html',
  BASE_URL + 'signin.html',
  BASE_URL + 'index.js',
  BASE_URL + 'exploretrip.js',
  BASE_URL + 'manifest.json',
  BASE_URL + 'icon-192.png',
  BASE_URL + 'icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(name => name !== CACHE_NAME && caches.delete(name))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request).catch(() => {
      if (event.request.destination === 'document') {
        return caches.match(BASE_URL + 'index.html');
      }
    }))
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New trip available!',
    icon: BASE_URL + 'icon-192.png',
    badge: BASE_URL + 'icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: BASE_URL + 'index.html' }
  };
  event.waitUntil(self.registration.showNotification('Bharat Darshan', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || BASE_URL + 'index.html'));
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  console.log('Background sync triggered');
  return Promise.resolve();
}

if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'trips-sync') {
      event.waitUntil(syncTripsData());
    }
  });
}

function syncTripsData() {
  return fetch('https://script.google.com/macros/s/AKfycbzBEnTzYfb1HF0JgHzMjmUKLnHACmGpjWN_a-5W5E1Q1UvweIM97eqzmYVRLYs2LEbK/exec')
    .then(response => response.json())
    .then(data => caches.open('trips-data').then(cache => cache.put('/trips-data', new Response(JSON.stringify(data)))))
    .catch(error => console.log('Periodic sync failed:', error));
}