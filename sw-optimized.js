// OPTIMIZED SERVICE WORKER - Performance First
// Version 2.0 - Core Web Vitals Optimized

const CACHE_NAME = 'smc-v2.0';
const STATIC_CACHE = 'smc-static-v2.0';
const DYNAMIC_CACHE = 'smc-dynamic-v2.0';

// Critical resources that MUST be cached immediately
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script-optimized.js',
    '/error-filter.js',
    '/manifest.json',
    '/icons/favicon.svg'
];

// Resources to cache on first visit (non-blocking)
const SECONDARY_ASSETS = [
    '/obrigado.html',
    '/sitemap.xml',
    '/robots.txt'
];

// External resources to cache strategically
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Network timeout for dynamic requests
const NETWORK_TIMEOUT = 3000;

// Install Event - Cache Critical Resources Only
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            // Cache critical assets immediately
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(CRITICAL_ASSETS).catch(err => {
                    console.warn('Failed to cache some critical assets:', err);
                    // Continue with partial cache
                });
            }),
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// Activate Event - Clean Old Caches
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control immediately
            self.clients.claim()
        ])
    );
});

// Fetch Event - Optimized Caching Strategy
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and moz-extension requests
    if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
        return;
    }
    
    // Skip analytics and tracking requests
    if (url.hostname.includes('google-analytics.com') || 
        url.hostname.includes('googletagmanager.com') ||
        url.hostname.includes('vercel.com')) {
        return;
    }
    
    // Handle different resource types with optimized strategies
    if (url.origin === location.origin) {
        // Same-origin requests - Cache First for static, Network First for HTML
        if (request.destination === 'document') {
            event.respondWith(networkFirstWithCache(request));
        } else {
            event.respondWith(cacheFirstWithNetwork(request));
        }
    } else if (EXTERNAL_RESOURCES.some(resource => request.url.includes(resource))) {
        // External fonts and CDN resources - Cache First
        event.respondWith(cacheFirstWithNetwork(request));
    } else if (url.hostname.includes('fonts.googleapis.com') || 
               url.hostname.includes('fonts.gstatic.com') ||
               url.hostname.includes('cdnjs.cloudflare.com')) {
        // Font and CDN resources - Cache First with long timeout
        event.respondWith(cacheFirstWithNetworkFallback(request));
    }
});

// Network First with Cache Fallback (for HTML documents)
async function networkFirstWithCache(request) {
    try {
        // Try network first with timeout
        const networkResponse = await Promise.race([
            fetch(request),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
            )
        ]);
        
        if (networkResponse.ok) {
            // Cache successful response
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone()).catch(() => {
                // Silent fail for cache errors
            });
            return networkResponse;
        }
        throw new Error('Network response not ok');
    } catch (error) {
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Ultimate fallback for HTML documents
        if (request.destination === 'document') {
            const fallbackResponse = await caches.match('/');
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }
        
        throw error;
    }
}

// Cache First with Network Fallback (for static assets)
async function cacheFirstWithNetwork(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Update cache in background for critical resources
        if (CRITICAL_ASSETS.some(asset => request.url.includes(asset))) {
            updateCacheInBackground(request);
        }
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone()).catch(() => {
                // Silent fail for cache errors
            });
        }
        return networkResponse;
    } catch (error) {
        // For CSS/JS files, return a minimal fallback
        if (request.destination === 'style') {
            return new Response('/* Fallback CSS */', {
                headers: { 'Content-Type': 'text/css' }
            });
        }
        
        if (request.destination === 'script') {
            return new Response('// Fallback JS', {
                headers: { 'Content-Type': 'application/javascript' }
            });
        }
        
        throw error;
    }
}

// Cache First with Long Network Fallback (for external resources)
async function cacheFirstWithNetworkFallback(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await Promise.race([
            fetch(request),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT * 2)
            )
        ]);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone()).catch(() => {
                // Silent fail for cache errors
            });
        }
        return networkResponse;
    } catch (error) {
        // Return empty response for failed external resources
        return new Response('', {
            status: 204,
            statusText: 'No Content'
        });
    }
}

// Background cache update for critical resources
function updateCacheInBackground(request) {
    fetch(request).then(response => {
        if (response.ok) {
            caches.open(STATIC_CACHE).then(cache => {
                cache.put(request, response).catch(() => {
                    // Silent fail
                });
            });
        }
    }).catch(() => {
        // Silent fail for background updates
    });
}

// Cache secondary assets on idle
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CACHE_SECONDARY') {
        event.waitUntil(
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(SECONDARY_ASSETS).catch(() => {
                    // Silent fail for secondary assets
                });
            })
        );
    }
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Prefetch critical resources during idle time
self.addEventListener('sync', event => {
    if (event.tag === 'prefetch-critical') {
        event.waitUntil(
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(CRITICAL_ASSETS).catch(() => {
                    // Silent fail
                });
            })
        );
    }
});

// Handle background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'form-sync') {
        event.waitUntil(syncFormData());
    }
});

async function syncFormData() {
    // Handle offline form submissions when back online
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        
        for (const request of requests) {
            if (request.url.includes('formspree.io') && request.method === 'POST') {
                try {
                    await fetch(request);
                    await cache.delete(request);
                } catch (error) {
                    // Keep in cache for next sync attempt
                }
            }
        }
    } catch (error) {
        // Silent fail for sync operations
    }
}

// Performance monitoring
self.addEventListener('fetch', event => {
    // Track cache hit rates in development
    if (self.location.hostname === 'localhost') {
        const startTime = performance.now();
        event.respondWith(
            event.respondWith.then ? event.respondWith : Promise.resolve()
                .then(() => {
                    const endTime = performance.now();
                    const duration = endTime - startTime;
                    
                    if (duration > 100) {
                        console.log(`Slow request: ${event.request.url} took ${duration}ms`);
                    }
                })
        );
    }
});

// Error handling and reporting
self.addEventListener('error', event => {
    // Only log errors in development
    if (self.location.hostname === 'localhost') {
        console.error('Service Worker error:', event.error);
    }
});

self.addEventListener('unhandledrejection', event => {
    // Only log unhandled rejections in development
    if (self.location.hostname === 'localhost') {
        console.error('Service Worker unhandled rejection:', event.reason);
    }
    event.preventDefault();
});