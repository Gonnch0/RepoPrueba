const CACHE='riva-foto-pro-v4';
const FILES=["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "mp/selfie_segmentation.js", "mp/model.txt", "mp/graph.txt", "mp/selfie_segmentation_solution_simd_wasm_bin.js", "mp/selfie_segmentation_solution_simd_wasm_bin.wasm", "lib/jspdf.umd.min.js", "lib/jszip.min.js", "lib/pako.min.js", "lib/UTIF.js", "lib/agpsd.js", "lib/heif.js"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isPage=e.request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('index.html');
  if(isPage){ // la pantalla principal: siempre la última versión si hay internet
    e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return res;}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok&&url.origin===location.origin){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return res;})));
});
