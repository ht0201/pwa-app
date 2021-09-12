let cacheName = 'appV1';
this.addEventListener('install', function (e) {
  console.log('[Service worker] Installing service worker... ', e);
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll([
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
    e.respondWith(
      (async () => {
        try {
          const data = await caches.match(e.request);
          console.log(`[Service Worker] Fetched resource ${e.request.url}`);

          if (data) return data;

          const res = await fetch(e.request);
          const cache = await caches.open(cacheName);
          console.log('[Service worker] Caching new resource ', e.request.url);

          cache.put(e.request, res.clone());

          return res;
        } catch (err) {
          console.log(err);
          return caches.match('/sw-test/gallery/myLittleVader.jpg');
        }
      })()
    );
  }
});

this.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            // eslint-disable-next-line array-callback-return
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});
