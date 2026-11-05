/* SA-Ready · Service Worker
   Speichert die App auf dem Gerät, damit sie auch ohne Internet startet.
   Bei einer neuen Version CACHE hochzählen. */
const CACHE='sa-ready-v4';
const FILES=[
  './',
  './index.html',
  './styles.css',
  './mech.css',
  './js/aufgaben.js',
  './js/grundlagen.js',
  './js/grundlagen-en.js',
  './js/mech-fig.js',
  './js/mech-kraft.js',
  './js/mech-statik.js',
  './js/mech-learn.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  // Eigenständige Seite im Unterordner: nicht anfassen, sonst überschreibt sie die gespeicherte Startseite
  if(url.pathname.indexOf('/fx-ready/')!==-1)return;

  // Seitenaufruf: zuerst aus dem Netz (für Updates), ohne Netz aus dem Speicher
  if(req.mode==='navigate'){
    e.respondWith(
      fetch(req)
        .then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return res;})
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  // Dateien: sofort aus dem Speicher, im Hintergrund aktualisieren
  e.respondWith(
    caches.match(req).then(hit=>{
      const net=fetch(req)
        .then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;})
        .catch(()=>hit);
      return hit||net;
    })
  );
});
