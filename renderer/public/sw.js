// Minimal Service Worker for eMKay PWA - No Caching
// This service worker does not cache or provide offline functionality
// It only exists to allow PWA installation

// Skip waiting on install
self.addEventListener("install", (event) => {
  self.skipWaiting()
  console.log("Service Worker installed")
})

// Clear any previous caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("Deleting cache:", cacheName)
            return caches.delete(cacheName)
          })
        )
      })
      .then(() => {
        console.log("Service Worker activated and caches cleared")
        return self.clients.claim()
      })
  )
})

// Handle fetch events without caching
self.addEventListener("fetch", (event) => {
  // Just pass through to the network
  // No caching or offline functionality
})
