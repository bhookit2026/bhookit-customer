// ParcelKar V1.0 Progressive Web App Service Worker
const CACHE_NAME = 'parcelkar-v18.0-cache';
const STATIC_ASSETS = [
  './',
  './customer.html',
  './index.html',
  './style.css',
  './app.js',
  './translations.js',
  './manifest.json',
  './parcelkar-logo.png',
  './icon-192.png',
  './icon-512.png',
  './favicon.png',
  './footer_logo.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install Event: Cache Core Assets and force active
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event: Clear ALL Stale Caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message Event: Skip waiting if requested
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Event: Network-first for HTML, JS, CSS, and API endpoints
// Ensures phone browsers and PWAs always get live, latest updates immediately
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Bypass cache for API calls & dynamic endpoints
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'Offline - API not reachable' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Network-first for HTML, CSS, and JS so phone browsers never get stuck on stale cache
  const isCodeOrDoc = 
    event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    requestUrl.pathname.endsWith('.html') ||
    requestUrl.pathname.endsWith('.css') ||
    requestUrl.pathname.endsWith('.js') ||
    requestUrl.pathname === '/';

  if (isCodeOrDoc) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-while-revalidate for static media assets (images, icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});