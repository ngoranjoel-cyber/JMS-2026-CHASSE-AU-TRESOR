// Service worker : permet d'ouvrir la page sans internet une fois qu'elle a été chargée une fois.
const C='jms26-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url); if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith(
      Promise.race([fetch(r),new Promise((_,rej)=>setTimeout(()=>rej(new Error('lent')),3500))])
        .then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));return res})
        .catch(()=>caches.match('./index.html').then(m=>m||caches.match('./')))
    );return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
