// --------------------------------------------------
// Online‑First PWA Service Worker
// --------------------------------------------------

const SW_VERSION = "v13"; // bump this whenever you update

self.addEventListener("install", (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of all pages immediately
  self.clients.claim();
});

// Network-first fetch: try network, fallback to offline message
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If response is valid, return it
        return response;
      })
      .catch(() => {
        // Fallback for offline usage
        if (event.request.destination === "document") {
          return new Response(
            `<h1>You are offline</h1><p>Please reconnect to the internet to use this app.</p>`,
            { headers: { "Content-Type": "text/html" } }
          );
        } else {
          return new Response(
            "You are offline. Please reconnect to the internet.",
            { headers: { "Content-Type": "text/plain" } }
          );
        }
      })
  );
});
