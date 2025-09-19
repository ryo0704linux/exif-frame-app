self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('app-cache').then(cache => {
      return cache.addAll(['/', '/index.html', '/script.js']);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});