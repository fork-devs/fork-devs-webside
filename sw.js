/**
 * DriveOS - Service Worker (offline cache).
 * Network first: always serves the latest deploy and falls back to cache offline.
 */
const CACHE_NAME = 'driveos-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './i18n.js',
  './manifest.webmanifest',
  './assets/vendor/phosphor/style.css',
  './assets/vendor/phosphor/Phosphor.woff2',
  './assets/fonts/satoshi/Satoshi-Variable.woff2',
  './assets/fonts/albert-sans/AlbertSans-ExtraBold.ttf',
  './assets/brand/driveos-icon.svg',
  './assets/brand/driveos-hex.svg',
  './assets/brand/driveos-mark.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Some assets could not be pre-cached:', err);
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.headers.get('accept')?.includes('text/html')) return caches.match('./index.html');
        })
      )
  );
});
