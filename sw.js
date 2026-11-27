const CACHE='dartarossa-v20-1-clean';
const FILES=['./','./index.html','./admin.html','./app-v19.js','./manifest.webmanifest','./data/3k-sync.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(new URL(e.request.url).pathname.endsWith('/data/3k-sync.json'))return e.respondWith(fetch(e.request,{cache:'no-store'}));e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
