/* Scale & Tell service worker.
 * Push reminders, plus a cache of the app's own static files (artwork, guides, icons, code)
 * so it opens fast. It never caches account data, photos or anything from Supabase. */
'use strict';
const CACHE = 'scale-tell-static-v3.74';
const SHELL = ['./', './index.html', './styles.css?v=3.51', './watch-learn.css?v=10', './watch-learn.js?v=1', './app.js?v=3.74', './guides.js?v=3.67', './supabase.min.js?v=2.57.4', './home-nav-hub.webp', './home-nav-breeder.webp', './home-nav-rescue.webp', './manifest.webmanifest', './install.html',
  './icon-180.png', './icon-192.png', './header.webp', './header-compact.webp', './dashboard.webp', './auth-art.webp'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('scale-tell-static-') && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  const isAsset = /\.webp$|\/icon-[^/]+\.png$/.test(url.pathname);
  if (isAsset) {
    // Artwork and guides rarely change: serve from cache, fetch once if missing.
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  // Versioned code (app.js?v=…, styles.css?v=…, supabase.min.js?v=…) never changes once published:
  // open instantly from the phone's copy. A new version has a new address, so updates still arrive.
  if (url.search.includes('v=') && /\.(js|css)$/.test(url.pathname)) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  // Pages: try the network, but never make the keeper wait more than 3 seconds on a weak signal.
  event.respondWith((async () => {
    const cached = await caches.match(req) || (req.mode === 'navigate' ? await caches.match('./index.html') : undefined);
    const network = fetch(req).then(res => {
      if (res.ok && (req.mode === 'navigate' || /\.(js|css|webmanifest|html)$/.test(url.pathname))) {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    });
    if (!cached) return network;
    const timeout = new Promise(resolve => setTimeout(() => resolve(cached), 3000));
    return Promise.race([network.catch(() => cached), timeout]);
  })());
});
self.addEventListener('push', event => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; }
  catch (_) { payload = { body: event.data ? event.data.text() : '' }; }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) payload = {};
  const title = typeof payload.title === 'string' && payload.title.trim() ? payload.title.slice(0, 90) : 'Scale & Tell';
  const body = typeof payload.body === 'string' && payload.body.trim() ? payload.body.slice(0, 250) : 'Open your Care Schedule to review what is due.';
  event.waitUntil(self.registration.showNotification(title, {
    body, icon: './icon-192.png', badge: './icon-192.png',
    tag: 'scale-tell-care', renotify: false, data: { openCareSchedule: true }
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const destination = new URL('./?care=1', self.registration.scope).href;
  event.waitUntil((async () => {
    const windows = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find(c => c.url.startsWith(self.registration.scope));
    if (existing) {
      await existing.focus();
      existing.postMessage({ type: 'OPEN_CARE_SCHEDULE' });
    } else if (clients.openWindow) {
      await clients.openWindow(destination);
    }
  })());
});
