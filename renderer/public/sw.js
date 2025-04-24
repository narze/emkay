// Service Worker for eMKay PWA
const CACHE_NAME = "emkay-cache-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/src/main.ts",
  "/src/App.svelte",
  "/src/assets/logo.png",
  "/src/assets/bg.png",
  "/src/assets/up_diamond.png",
]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME
          })
          .map((cacheName) => {
            return caches.delete(cacheName)
          })
      )
    })
  )
})

// Helper function to check if a URL is cacheable
function isCacheableUrl(url) {
  const urlObj = new URL(url.toString())
  const supportedSchemes = ["http", "https"]
  return supportedSchemes.includes(urlObj.protocol.slice(0, -1)) // Remove trailing ':'
}

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-cacheable URLs
  if (!isCacheableUrl(event.request.url)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request).then((response) => {
        // Return the response without caching if it's not valid
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        // Only cache if URL is cacheable
        if (isCacheableUrl(event.request.url)) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
    })
  )
})
