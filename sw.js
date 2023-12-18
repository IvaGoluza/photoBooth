import {
    del,
    entries
} from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";


const staticCacheConstant = 'static-cache';
const dynamicCacheConstant = 'dynamic-cache';

const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/homeUI.js',
    '/css/styles.css',
    '/img/illustration.png',
    '/pages/fallback.html',
    '/css/fallback.css',
    'https://www.gstatic.com/firebasejs/5.11.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/5.11.0/firebase-firestore.js',
    'https://www.gstatic.com/firebasejs/5.11.0/firebase-storage.js',
    'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm'
];

// limit cash size -> if it is full, delete the oldest cashes 
/*
const limitCashSize = (name, size) => {           // name of the cashe and max size 
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size) {
                cache.delete(keys[0]).then(limitCashSize(name, size));  // call until all of the excess caches have been deleted 
            }
        })
    })

} */
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
      cache.keys().then(keys => {
        if(keys.length > size){
          cache.delete(keys[0]).then(limitCacheSize(name, size));
        }
      });
    });
};

// listen for sw install event -> for caching
self.addEventListener('install', installEvent => { 
   installEvent.waitUntil(
      caches.open(staticCacheConstant)  // if !exist -> creates cache for static site parts, else opens existing
      .then(cache => {    // add resources to cache ... app shell
          console.log('[SW] caching app shell');
          cache.addAll(assets);
       })
    )
})

// listen for when sw becomes active  -> new sw has been activated -> recache static shell (delete old one)
self.addEventListener('activate', activateEvent => {
    activateEvent.waitUntil(
        caches.keys()  // caches names
        .then( keys => {
            return Promise.all(keys.filter(key => key !== dynamicCacheConstant && key !== staticCacheConstant).map(key => caches.delete(key)))
        })
    )
})

// listen for fetch events (when fetching something from server)
// intercept all fetching requests for cached assets..
/*
self.addEventListener('fetch', fetchEvent => {
    if(fetchEvent.request.url.indexOf('firestore.googleapis.com') === -1 && fetchEvent.request.url.indexOf('firebasestorage.googleapis.com') === -1){   // not cashing database data responses
        fetchEvent.respondWith(
            caches.match(fetchEvent.request).then( prechashedResp => {  // if request is not precashed, fetch it from server and cashe it also
                return prechashedResp || fetch(fetchEvent.request).then(uncashedFetchResp => {
                    return caches.open(dynamicCacheConstant).then( cache => {     // cash it before returning 
                        cache.put(fetchEvent.request.url, uncashedFetchResp.clone());   
                        limitCashSize(dynamicCacheConstant, 16);         // if we have > 16 items, delete the oldest
                        return uncashedFetchResp;
                    })
                });    
            }).catch(() => {
                if(fetchEvent.request.url.indexOf('.html') > -1){
                   return caches.match('/pages/fallback.html');
                } 
            })
        );
    }
}) */
self.addEventListener('fetch', evt => {
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                if (cacheRes) {
                    return cacheRes; // Return cached response if available
                } else {
                    return fetch(evt.request)
                        .then(fetchRes => {
                            if (!fetchRes || fetchRes.status !== 200 || fetchRes.type !== 'basic') {
                                // Handle non-successful or non-basic responses
                                return fetchRes;
                            }

                            const responseToCache = fetchRes.clone();
                            caches.open(dynamicCacheConstant)
                                .then(cache => {
                                    cache.put(evt.request, responseToCache); // Cache the response
                                });
                            return fetchRes;
                        })
                        .catch(err => {
                            console.error('Fetch error:', err);
                            // Handle fetch errors
                            return new Response('Fetch failed');
                        });
                }
            }).catch(err => {
                console.error('Cache match error:', err);
                // Handle cache match errors
                return new Response('Cache match failed');
            })
        );
    }
});

self.addEventListener('sync', function (event) {
    console.log(event.tag);
    if (event.tag === 'sync-snaps') {
        console.log('hii');
        event.waitUntil(syncSnaps());
    }
});

let syncSnaps = async function () {
    console.log('hii');
    entries()
        .then((entries) => {
            entries.forEach((entry) => {
                let snap = entry[1]; //  Each entry is an array of [key, value].
                const timestamp = Date.now();
                const randomID = Math.random().toString(36).substring(2, 8); 
                const filename = `photo-${timestamp}-${randomID}.jpg`;             

                const uploadTask = storageRef.child('images/' + filename).put(snap.image);

                // getting downloadURL after the image is uploaded
                uploadTask.then(snapshot => {
                    return snapshot.ref.getDownloadURL();
                }).then(downloadURL => {
                    db.collection('pictures').add({    // save document to Firestore with image URL, note and partyKey
                        imageURL: downloadURL,
                        note: note,
                        partyKey: partyKey,
                    }).then(() => {
                        console.log('Data saved to Firestore');
                        del(entry[0])
                    }).catch(error => {
                        console.error('Error saving data:', error);
                    });
                }).catch(error => {
                    console.error('Error uploading image:', error);
                });
            })
        });
}


