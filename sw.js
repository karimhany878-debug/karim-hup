const VERSION = "kg-v3";
const CACHE_STATIC = `kg-static-${VERSION}`;
const CACHE_RUNTIME = `kg-runtime-${VERSION}`;

// عدّل القائمة دي لو أسماء صفحاتك مختلفة
const PRECACHE = [
  "./",
  "./index.html",
  "./start.html",
  "./play.html",
  "./state.html",
  "./chess.html",
  "./xo.html",
  "./read.html",
  "./settings.html",

  // styles/scripts المشتركين (عدّل حسب ملفاتك الفعلية)
  "./style.css",
  "./start.css",
  "./hub.css",
  "./chess.css",
  "./xo.css",
  "./read.css",

  "./game.js",
  "./chess.js",
  "./xo.js",
  "./read.js",
  "./break.js",
  "./bootfix.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![CACHE_STATIC, CACHE_RUNTIME].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

function isSameOrigin(req) {
  try {
    const u = new URL(req.url);
    return u.origin === self.location.origin;
  } catch {
    return false;
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;
  if (!isSameOrigin(req)) return;

  // 1) صفحات التنقل (HTML): Network-first + fallback للـ cache (عشان التحديثات توصل)
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_RUNTIME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(req);
        return cached || caches.match("./start.html") || caches.match("./index.html");
      }
    })());
    return;
  }

  // 2) Assets: Cache-first + تحديث بالكواليس (stale-while-revalidate)
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const fetchPromise = fetch(req)
      .then(async (resp) => {
        const cache = await caches.open(CACHE_RUNTIME);
        cache.put(req, resp.clone());
        return resp;
      })
      .catch(() => cached);

    return cached || fetchPromise;
  })());
});
