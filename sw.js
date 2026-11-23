const CACHE = 'vestiaire-0.80.1';
const FICHIERS = ["./","index.html","manifest.webmanifest","icone-180.png","icone-192.png","icone-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const copie = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copie)); } return r; })
    .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))));
});
