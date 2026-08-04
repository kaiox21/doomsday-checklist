// Service worker do Protocolo Doomsday.
// Estratégia: network-first para o app (garante que um deploy novo apareça na
// hora), cache-first para assets imutáveis (ícones e fontes). O progresso do
// usuário continua no localStorage — nada aqui toca nele.

const CACHE = 'doomsday-v1';

// Casco mínimo para o site abrir offline.
const SHELL = [
  '/',
  '/index.html',
  '/data.js',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll é tudo-ou-nada; um 404 derrubaria a instalação inteira.
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Placar, OG e analytics precisam de rede de verdade — nunca cacheia.
  if (url.origin === location.origin &&
      (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_vercel/'))) return;

  // Fontes do Google: cache-first, são versionadas e não mudam.
  if (url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // App: rede primeiro, cache como rede de segurança.
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('/index.html')))
  );
});
