// Ouqro Service Worker
// Modern caching strategies for performance optimization

const CACHE_NAME = 'ouqro-v1.0.0';
const STATIC_CACHE = 'ouqro-static-v1.0.0';
const DYNAMIC_CACHE = 'ouqro-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/main.js',
    '/assets/js/aos.js',
    '/assets/js/slider.js',
    '/assets/favicon/site.webmanifest'
];

// Cache-first resources (rarely change)
const CACHE_FIRST_PATTERNS = [
    /\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/,
    /\.(?:woff|woff2|ttf|eot)$/,
    /\.(?:css|js)$/
];

// Network-first resources (frequently change)
const NETWORK_FIRST_PATTERNS = [
    /\/api\//,
    /\.(?:json)$/
];

// Maximum cache age (24 hours)
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000;

// Install event
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Precaching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Failed to cache static assets:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all pages
            self.clients.claim()
        ])
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(handleFetch(request));
});

// Main fetch handler
async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Handle different resource types
        if (isCacheFirst(url.pathname)) {
            return await handleCacheFirst(request);
        } else if (isNetworkFirst(url.pathname)) {
            return await handleNetworkFirst(request);
        } else {
            return await handleStaleWhileRevalidate(request);
        }
    } catch (error) {
        console.error('[SW] Fetch error:', error);
        return await handleFallback(request);
    }
}

// Cache-first strategy
async function handleCacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Check if cache is still fresh
        const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0);
        const isExpired = Date.now() - cacheDate.getTime() > MAX_CACHE_AGE;
        
        if (!isExpired) {
            return cachedResponse;
        }
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            await cacheResponse(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Network-first strategy
async function handleNetworkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            await cacheResponse(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Stale-while-revalidate strategy
async function handleStaleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // Fetch and cache in background
    const fetchPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                cacheResponse(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => null);
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Otherwise wait for network
    return await fetchPromise;
}

// Fallback handler
async function handleFallback(request) {
    const url = new URL(request.url);
    
    // Try to return cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
        const offlinePage = await caches.match('/');
        if (offlinePage) {
            return offlinePage;
        }
    }
    
    // Return basic response for other requests
    return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}

// Cache response helper
async function cacheResponse(request, response) {
    if (!response || response.status !== 200 || response.type !== 'basic') {
        return;
    }
    
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        
        // Add cache date header
        const responseToCache = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                ...Object.fromEntries(response.headers.entries()),
                'sw-cache-date': new Date().toISOString()
            }
        });
        
        await cache.put(request, responseToCache);
    } catch (error) {
        console.error('[SW] Failed to cache response:', error);
    }
}

// Check if resource should use cache-first strategy
function isCacheFirst(pathname) {
    return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(pathname));
}

// Check if resource should use network-first strategy
function isNetworkFirst(pathname) {
    return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(pathname));
}

// Message handler
self.addEventListener('message', event => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_INFO':
            getCacheInfo().then(info => {
                event.ports[0].postMessage({ type: 'CACHE_INFO', payload: info });
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
            });
            break;
            
        default:
            console.warn('[SW] Unknown message type:', type);
    }
});

// Get cache information
async function getCacheInfo() {
    const cacheNames = await caches.keys();
    const cacheInfo = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheInfo[cacheName] = keys.length;
    }
    
    return cacheInfo;
}

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    
    console.log('[SW] All caches cleared');
}

// Background sync (if supported)
if ('sync' in self.registration) {
    self.addEventListener('sync', event => {
        console.log('[SW] Background sync:', event.tag);
        
        switch (event.tag) {
            case 'contact-form':
                event.waitUntil(handleContactFormSync());
                break;
                
            default:
                console.warn('[SW] Unknown sync tag:', event.tag);
        }
    });
}

// Handle contact form background sync
async function handleContactFormSync() {
    try {
        // Get stored form data from IndexedDB or localStorage
        const formData = await getStoredFormData();
        
        if (formData.length === 0) {
            return;
        }
        
        // Attempt to send each form submission
        for (const data of formData) {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    await removeStoredFormData(data.id);
                    console.log('[SW] Form submission synced:', data.id);
                }
            } catch (error) {
                console.error('[SW] Failed to sync form:', error);
            }
        }
    } catch (error) {
        console.error('[SW] Background sync error:', error);
    }
}

// Get stored form data (placeholder - implement with IndexedDB)
async function getStoredFormData() {
    // This would typically use IndexedDB to store offline form submissions
    return [];
}

// Remove stored form data (placeholder)
async function removeStoredFormData(id) {
    // This would remove the synced form data from IndexedDB
    return Promise.resolve();
}

console.log('[SW] Service worker script loaded');