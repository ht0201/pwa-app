let cacheName = 'appV1';
this.addEventListener('install', function (e) {
  console.log('[Service worker] Installing service worker... ', e);
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log('[Service worker] Caching all: app shell and content');
      await cache.addAll([
        'static/js/main.chunk.js',
        'static/js/0.chunk.js',
        'static/js/bundle.js',
        'index.html',
      ]);
    })()
  );
});
