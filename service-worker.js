// --------------------------------------------------
// Online‑Only PWA Service Worker
// --------------------------------------------------

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response(
        "You are offline. Please reconnect to the internet to use this app."
      );
    })
  );
});
