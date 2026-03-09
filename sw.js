const CACHE_NAME = 'delivery-app-v3';
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
      // 캐시 우선이 아닌 네트워크 우선으로 변경 (항상 최신 파일 사용)
      return fetch(e.request).then(function(networkResponse) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(function() {
        return response;
      });
    })
  );
});
