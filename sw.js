const CACHE='rathod-hub-v16-admin-entry';const ASSETS=['./','./index.html','./styles.css?v=16','./app.js?v=16','./manifest.webmanifest','./icons/icon.svg',
  "./about.html",
  "./faq.html",
  "./privacy.html",
  "./help.html",
  "./terms.html",
  "./rules.html",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg"
];self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))})
