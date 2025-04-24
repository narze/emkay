// Service Worker for eMKay PWA
const CACHE_NAME = "emkay-cache-v1"
const urlsToCache = ["/", "/index.html", "/favicon.ico", "/manifest.json"]

// Only cache valid URLs with supported schemes
function isCacheableUrl(url) {
  try {
    const urlObj = new URL(url.toString())
    const supportedSchemes = ["http", "https"]
    return supportedSchemes.includes(urlObj.protocol.slice(0, -1)) // Remove trailing ':'
  } catch (e) {
    return false
  }
}

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(urlsToCache)
      })
      .catch((err) => {
        console.error("Failed to cache during install", err)
      })
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
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
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          })
      )
    })
  )
  // Take control of all clients as soon as it activates
  event.waitUntil(self.clients.claim())
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and non-cacheable URLs
  if (event.request.method !== "GET" || !isCacheableUrl(event.request.url)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response from cache
      if (response) {
        return response
      }

      // Clone the request because it's a one-time use stream
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response
          }

          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone()

          // Only cache if URL is cacheable
          if (isCacheableUrl(event.request.url)) {
            caches
              .open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
              .catch((err) => {
                console.error("Failed to cache response", err)
              })
          }

          return response
        })
        .catch((error) => {
          console.error("Fetch failed:", error)
          // You could return a custom offline page here
        })
    })
  )
})
