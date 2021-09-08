const staticCacheName = 'site-static-1';
const dynamicCacheName = 'site-dynamic-v1';

const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'pages/fallback.html'
]

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}

// install sw
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets)
    }),
  )
})

// activate sw
self.addEventListener('activate', evt => {
  console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key === dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch sw
self.addEventListener('fetch', (evt) => {
  if(evt.request.url.indexOf('firestore.googleapis.com') == -1) {
    evt.respondWith(
      caches.match(evt.request).then((cachesRes) => {
        return cachesRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(caches => {
            caches.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCacheName, 15)
            return fetchRes
          })
        })
      }).catch(_ => caches.match('/pages/fallback.html'))
    )
  }

})
