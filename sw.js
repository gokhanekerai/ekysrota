// EKYSrota Service Worker (Network-First for HTML, Stale-While-Revalidate for Assets)
const CACHE_NAME = 'ekysrota-v230.0';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Eski tüm önbellekleri anında temizle ve istemcileri devral
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Firestore & Firebase Auth API çağrılarını önbelleğe alma (canlı veri)
  if (url.origin.includes('firestore.googleapis.com') || url.origin.includes('identitytoolkit')) {
    return;
  }

  // 1. HTML ve Ana Sayfa İstekleri: Network-First (Çevrimiçiyken daima en güncel sürüm, çevrimdışıyken önbellek)
  if (e.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname === '/' || url.pathname === '/ekysrota/' || url.pathname === '/ekysrota') {
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // 2. Statik Varlıklar (JS, CSS, Font, Resim): Stale-While-Revalidate
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        const fetchPromise = fetch(e.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      });
    })
  );
});
