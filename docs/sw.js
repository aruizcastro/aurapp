/* Service worker. Caches the app shell so the painting side works with no
   internet at all — in the car, on a plane. Videos obviously still need a
   connection, and YouTube requests are never cached. */

const CACHE = 'aurapp-v1';

const SHELL = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './silhouettes.js',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never touch YouTube: the player and the thumbnails must stay live.
  if (url.hostname.includes('youtube.com') || url.hostname.includes('ytimg.com')) return;

  if (event.request.method !== 'GET') return;

  // Cache first for the shell, then network. Keeps launch instant.
  event.respondWith(
    caches.match(event.request).then(hit => {
      if (hit) return hit;
      return fetch(event.request).then(response => {
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => hit);
    })
  );
});
