// Define the cache name for versioning
const CACHE_NAME = "ntc-zoo-cache-v1";

// List of essential files to pre-cache for offline use
const FILES_TO_CACHE = [
  "/", 
  "/index.html",
  "/styles.css",
  "/zoo.js",
  "/AnimalAPI.js",
  "/AnimalData.js",
  "/AdminDashboard.js",
  "/UiFeedback.js",
  "/Security.js",
  "/zooLocations.js",
  "/ZooOperations.js",
  "/Components/zoo-animal-card.js",
  "/Components/z-hover-highlight.js",
  "/Components/zoo-photo-booth.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/serviceworker.js"
];

// Install event – cache app shell
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// Fetch event – serve from cache, then fallback to network
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // 🔒 Same-origin only
  if (url.origin !== self.location.origin) return;

  // 🚫 Bypass API + warmup endpoints (let browser hit network directly)
  if (url.pathname.startsWith("/api/") || url.pathname === "/ping") {
    return; // do not respondWith — no SW interception
  }

  // 🧭 Navigations: network-first with cached fallback to app shell
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        return await fetch(req); // live page if online
      } catch {
        return (await caches.match("/index.html")) || Response.error();
      }
    })());
    return;
  }

  // 📦 Static assets: cache-first, then network (and cache good responses)
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    try {
      const resp = await fetch(req);
      if (resp.ok) {
        const copy = resp.clone();
        const cache = await caches.open("ntc-zoo-vaj-v1");
        cache.put(req, copy);
      }
      return resp;
    } catch {
      // No cached copy and network failed
      return new Response("Offline", { status: 503 });
    }
  })());
});