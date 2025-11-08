const CACHE = 'bharat-darshan-v1';
const assets = ['/', '/index.html', '/exploretrip.html', '/dashboard.html', '/signin.html', '/privacy-policy.html', '/offline.html', '/index.js', '/exploretrip.js', '/image/home/logo.png'];

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