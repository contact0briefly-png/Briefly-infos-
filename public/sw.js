const CACHE_NAME = 'briefly-admin-v2.7.0';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Pour les appels d'API externes (Supabase DB/Auth), laisser passer le réseau
  if (url.origin.includes('supabase.co') || url.pathname.startsWith('/api/')) {
    return;
  }

  // Pour toutes les ressources de navigation et assets :
  // Cache First avec mise en cache dynamique & revalidation réseau
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(req);

      // Si déjà en cache et qu'on n'est pas sur une page HTML, le renvoyer tout de suite
      // et rafraîchir en tâche de fond si le réseau est dispo
      if (cached && !req.headers.get('accept')?.includes('text/html')) {
        fetch(req).then(resp => {
          if (resp && resp.status === 200 && req.method === 'GET') {
            cache.put(req, resp.clone());
          }
        }).catch(() => {});
        return cached;
      }

      // Tenter le réseau
      try {
        const netResp = await fetch(req);
        if (netResp && netResp.status === 200 && req.method === 'GET') {
          cache.put(req, netResp.clone());
        }
        return netResp;
      } catch (err) {
        // En mode avion / hors connexion totale :
        if (cached) return cached;

        // Si navigation HTML : renvoyer la page d'administration mise en cache
        if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
          const fallback = (await cache.match('/admin/index.html')) ||
                           (await cache.match('/admin/')) ||
                           (await cache.match('/index.html')) ||
                           (await cache.match('/'));
          if (fallback) return fallback;
        }

        return new Response('Hors connexion — Aucune version en cache disponible.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      }
    })
  );
});
