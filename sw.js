const CACHE = 'bharat-darshan-v1';
const assets = ['/index.html', '/exploretrip.html', '/dashboard.html', '/signin.html', '/privacy-policy.html', '/offline.html', '/index.js', '/exploretrip.js', '/image/home/logo.png', 'https://cdn.tailwindcss.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(assets)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).then(fetchRes => {
      if (fetchRes.ok && e.request.url.startsWith(self.location.origin)) {
        const clone = fetchRes.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
      }
      return fetchRes;
    }).catch(() => caches.match('/offline.html')))
  );
});

self.addEventListener('periodicsync', e => {
  if (e.tag === 'update-trips') {
    e.waitUntil(fetch('https://script.google.com/macros/s/AKfycbzBEnTzYfb1HF0JgHzMjmUKLnHACmGpjWN_a-5W5E1Q1UvweIM97eqzmYVRLYs2LEbK/exec')
      .then(res => res.json())
      .then(data => caches.open(CACHE).then(cache => cache.put('/api/trips', new Response(JSON.stringify(data))))));
  }
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {title: 'Bharat Darshan', body: 'New trip available!'};
  e.waitUntil(self.registration.showNotification(data.title, {body: data.body, icon: '/image/home/logo.png', badge: '/image/home/logo.png'}));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});