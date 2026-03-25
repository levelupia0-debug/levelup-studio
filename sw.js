const CACHE_NAME = 'levelup-admin-os-v1';
const urlsToCache = [
  './admin_center.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  // Force le service worker à s'installer immédiatement
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[PWA] Fichiers mis en cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[PWA] Ancien cache supprimé');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne le fichier en cache s'il existe, sinon le télécharge
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
