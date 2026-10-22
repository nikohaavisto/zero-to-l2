// Offline cache for Zero to L2. A new build changes CACHE, which makes installed apps update.
const CACHE = 'zero-to-l2-c6a1e8936b';
const FILES = ["./", "index.html", "manifest.webmanifest", "rajdhani-latin-500-normal.woff2", "rajdhani-latin-600-normal.woff2", "rajdhani-latin-700-normal.woff2", "chakra-petch-latin-400-normal.woff2", "chakra-petch-latin-400-italic.woff2", "chakra-petch-latin-500-normal.woff2", "chakra-petch-latin-600-normal.woff2", "share-tech-mono-latin-400-normal.woff2", "jetbrains-mono-latin-400-normal.woff2", "jetbrains-mono-latin-600-normal.woff2", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "favicon-64.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(resp => {
      if (resp.ok && new URL(e.request.url).origin === location.origin) { const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return resp;
    }).catch(() => caches.match('index.html')))
  );
});
