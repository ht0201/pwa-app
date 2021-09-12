let cacheName = 'appV1';
this.addEventListener('install', function (e) {
  console.log('[Service worker] Installing service worker... ', e);
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll([
        'static/js/main.chunk.js',
        'static/js/0.chunk.js',
        'static/js/bundle.js',
        'index.html',
        'static/js/vendors~main.chunk.js',
        '/',
        '/cities',
      ]);
    })()
  );
});

this.addEventListener('fetch', function (e) {
  if (!navigator.onLine) {
    if (e.request.url === 'http://localhost:3000/static/js/main.chunk.js') {
      e.waitUntil(
        this.registration.showNotification('Internet', {
          body: 'Internet not working',
        })
      );
    }

    e.respondWith(
      (async () => {
        const data = await caches.match(e.request);
        console.log(`[Service Worker] Fetched resource ${e.request.url}`);

        if (data) return data;

        const res = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log('[Service worker] Caching new resource ', e.request.url);
        cache.put(e.request, res.clone());
        return res;
      })()
    );
  }
});
