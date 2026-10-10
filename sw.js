// EKYSrota Service Worker (Stale-While-Revalidate - Şimşek Hızında Açılış)
const CACHE_NAME = 'ekysrota-v159.0';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Eski tüm önbellekleri anında temizle
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

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Firestore & Firebase API çağrılarını önbelleğe alma (canlı veri)
  if (url.origin.includes('firestore.googleapis.com') || url.origin.includes('identitytoolkit')) {
    return;
  }

  // Stale-While-Revalidate: Önbellek varsa anında (0ms) döndür, arka planda sessizce güncelle
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
