self.addEventListener("install", () => {
  globalThis.skipWaiting();
});

self.addEventListener("activate", () => {
  globalThis.registration
    .unregister()
    .then(() => globalThis.clients.matchAll())
    .then((clients) => {
      for (const client of clients) {
        if (client.url && "navigate" in client) {
          client.navigate(client.url);
        }
      }
    });
});
