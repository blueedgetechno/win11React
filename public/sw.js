// service has been instaalled
self.addEventListener('install', evnt => {
    console.log("service worker has been installed!");

});

//activate event
self.addEventListener('activate', evnt => {
    console.log("service worker has been activated!");

});


self.addEventListener('fetch', evnt => {
    console.log("fetch", evnt);
    
});
