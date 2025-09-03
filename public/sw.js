// Service Worker for STEM Quest - Offline Learning Platform
const CACHE_NAME = 'stemquest-v1.0.0';
const STATIC_CACHE_NAME = 'stemquest-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'stemquest-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/pages/Home.tsx',
  '/src/pages/Quiz.tsx',
  '/src/lib/translations.ts',
  '/src/lib/offlineStorage.ts',
  '/src/components/ui/button.tsx',
  '/src/components/ui/card.tsx',
  '/src/components/ui/progress.tsx',
  '/src/components/ui/badge.tsx',
  '/src/hooks/use-toast.ts',
  '/src/index.css',
  '/src/lib/utils.ts',
  '/src/lib/queryClient.ts',
  // Add more static assets as needed
];

// External resources to cache
const EXTERNAL_RESOURCES = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap',
  'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
  'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache external resources
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching external resources');
        return cache.addAll(EXTERNAL_RESOURCES);
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME && 
              cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
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

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(url)) {
      return await cacheFirst(request, STATIC_CACHE_NAME);
    }
    
    // Strategy 2: Network First for API calls
    if (isApiRequest(url)) {
      return await networkFirst(request, DYNAMIC_CACHE_NAME);
    }
    
    // Strategy 3: Stale While Revalidate for external resources
    if (isExternalResource(url)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
    }
    
    // Strategy 4: Network First with fallback for other requests
    return await networkFirst(request, DYNAMIC_CACHE_NAME);
    
  } catch (error) {
    console.error('Service Worker: Error handling request:', error);
    
    // Fallback: try to serve from any cache
    const cachedResponse = await getFromAnyCache(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback: return offline page
    if (request.destination === 'document') {
      return await getOfflinePage();
    }
    
    throw error;
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Network request failed:', error);
    throw error;
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, return cached version if available
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.startsWith('/src/') ||
         url.pathname.startsWith('/assets/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.tsx') ||
         url.pathname.endsWith('.ts');
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/') ||
         url.hostname === 'api.stemquest.com';
}

function isExternalResource(url) {
  return url.hostname === 'cdn.tailwindcss.com' ||
         url.hostname === 'unpkg.com' ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com';
}

async function getFromAnyCache(request) {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    if (response) {
      return response;
    }
  }
  
  return null;
}

async function getOfflinePage() {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const offlinePage = await cache.match('/');
  
  if (offlinePage) {
    return offlinePage;
  }
  
  // Create a simple offline page
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>STEM Quest - Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          text-align: center;
          max-width: 500px;
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📚</div>
        <h1>STEM Quest</h1>
        <p>You're currently offline, but your learning journey continues!</p>
        <p>All your progress is saved locally. When you're back online, everything will sync automatically.</p>
        <p>Try refreshing the page when you have internet connection.</p>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'quiz-results-sync') {
    event.waitUntil(syncQuizResults());
  } else if (event.tag === 'progress-sync') {
    event.waitUntil(syncUserProgress());
  }
});

async function syncQuizResults() {
  try {
    // Get pending quiz results from IndexedDB
    const pendingResults = await getPendingQuizResults();
    
    for (const result of pendingResults) {
      try {
        // Try to sync with server
        const response = await fetch('/api/quiz-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result)
        });
        
        if (response.ok) {
          // Mark as synced
          await markQuizResultAsSynced(result.id);
        }
      } catch (error) {
        console.error('Failed to sync quiz result:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncUserProgress() {
  try {
    // Get user progress from IndexedDB
    const progress = await getUserProgress();
    
    if (progress) {
      const response = await fetch('/api/user-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress)
      });
      
      if (response.ok) {
        console.log('User progress synced successfully');
      }
    }
  } catch (error) {
    console.error('Failed to sync user progress:', error);
  }
}

// Push notifications for achievements and reminders
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Continue Learning',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for background sync
async function getPendingQuizResults() {
  // This would interact with IndexedDB to get unsynced results
  // Implementation depends on your IndexedDB structure
  return [];
}

async function markQuizResultAsSynced(id) {
  // Mark quiz result as synced in IndexedDB
  console.log('Marking quiz result as synced:', id);
}

async function getUserProgress() {
  // Get user progress from IndexedDB
  return null;
}

// Periodic background sync for content updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-update') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  try {
    // Check for new content updates
    const response = await fetch('/api/content/check-updates');
    if (response.ok) {
      const updates = await response.json();
      
      if (updates.hasUpdates) {
        // Cache new content
        await cacheNewContent(updates.content);
        
        // Notify user about new content
        self.registration.showNotification('New Content Available!', {
          body: 'New quizzes and topics have been added to STEM Quest.',
          icon: '/icon-192x192.png',
          tag: 'content-update'
        });
      }
    }
  } catch (error) {
    console.error('Failed to check for content updates:', error);
  }
}

async function cacheNewContent(content) {
  // Cache new content for offline access
  console.log('Caching new content:', content);
}

console.log('Service Worker: Loaded successfully');
