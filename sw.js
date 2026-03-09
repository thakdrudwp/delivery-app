const CACHE_NAME = 'delivery-app-v1';
const CACHE_FILES = [
  './납품앱.html',
  './manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
