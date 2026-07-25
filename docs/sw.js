/* Service worker.
   Network first, cache as fallback. That order matters: cache-first makes
   updates land one or two launches late, which is maddening when you have
   just pushed a fix. This way a launch with signal always gets the newest
   code, and a launch without signal still opens from the cache, so the
   painting side keeps working in the car or on a plane.

   The shell files are tiny, so the extra request costs nothing noticeable.
   Bumping CACHE below is optional now — the old copies get overwritten on
   every successful fetch anyway. */

const CACHE = 'aurapp-v4';

const SHELL = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './silhouettes.js',
  './pets.js',
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
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then(hit => hit || caches.match('./index.html')))
  );
});
