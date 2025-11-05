const CACHE_NAME = 'vp-static-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  // liste ici les assets critiques si tu les as
  '/styles.css',
  '/main.js',
  '/Zu1MKPS9.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // stratégie cache-first pour permettre au SW d'intercepter les requêtes
  event.respondWith(
    caches.match(event.request).then(resp => {
      if (resp) return resp;
      return fetch(event.request).then(fetchResp => {
        // optionnel : mettre en cache les réponses GET pour offline
        if (event.request.method === 'GET' && fetchResp && fetchResp.status === 200 && fetchResp.type === 'basic') {
          const respClone = fetchResp.clone();
          caches.open(CACHE_NAME).then(cache => {
            try { cache.put(event.request, respClone); } catch(e){}
          });
        }
        return fetchResp;
      }).catch(() => {
        // fallback si tu veux (image placeholder, offline page, etc.)
        return caches.match('/index.html');
      });
    })
  );
});
