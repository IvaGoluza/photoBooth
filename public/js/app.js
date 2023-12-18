if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {type: 'module'})
    .then( (reg) => console.log('service worker has been registered ', reg))
    .catch( (e) => console.log('service worker has not been registered ', e))
}