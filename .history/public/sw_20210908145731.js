let cacheName = 'appV1';
this.addEventListener('install', function (e) {
  console.log('[Service worker] Installing service worker... ', e);
  e.waitUntil(async () => {
    const cache = await caches.open(cacheName);
  });
});
