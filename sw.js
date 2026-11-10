// Service worker: بيحفظ ملفات البرنامج في الجهاز علشان يفتح بسرعة وحتى لو النت وقع لحظة.
// مبيلمسش اتصالات Firebase (Firestore/Auth) خالص — دي بتروح للشبكة دايماً. البيانات الأوفلاين من كاش Firestore نفسه مش من هنا.
// لما تغيّر أي ملف في البرنامج: ارفع رقم V علشان الأجهزة تمسح النسخة القديمة.
const V = 'delivery-v1';
const SHELL = ['./', 'index.html', 'css/app.css', 'src/app.js', 'src/core.js', 'src/config.js', 'src/firebase.js', 'src/firebase-config.js',
  'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const CDN = ['https://www.gstatic.com/firebasejs/', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/'];   // نسخ مثبّتة برقم الإصدار ← cache-first

self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (CDN.some(p => req.url.startsWith(p))) {                       // مكتبات خارجية: من الكاش لو موجودة
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(V).then(c => c.put(req, cp)); }
      return res;
    })));
    return;
  }

  if (url.origin !== location.origin) return;                        // أي حاجة تانية (Firebase APIs…) تعدّي للشبكة

  // ملفات البرنامج: من الكاش فوراً وبنحدّثها في الخلفية (stale-while-revalidate). الصفحة نفسها لو الشبكة وقعت ← index.html المحفوظة.
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => {
    const net = fetch(req).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(req, cp)); } return res; })
      .catch(() => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()));
    return hit || net;
  }));
});
