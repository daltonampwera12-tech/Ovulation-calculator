// --------------------------------------------------
// Online‑Only PWA Service Worker
// --------------------------------------------------

const SW_VERSION = "v12"; // bump this whenever you update

self.addEventListener("install", (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of all pages immediately
  self.clients.claim();
});

// Network‑only fetch: no caching at all
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response(
        "You are offline. Please reconnect to the internet to use this app."
      );
    })
  );
});
