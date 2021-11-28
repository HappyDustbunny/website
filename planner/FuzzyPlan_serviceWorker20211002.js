
let FP_CACHE = 'FP-cache';
let CACHED_URLS = [
  '200px-A_SVG_semicircle_heart_empty.svg.png',
  '200px-A_SVG_semicircle_heart.svg.png',
  '200px-Flag_of_Denmark.png',
  '200px-Flag_of_the_United_Kingdom.png',
  'FuzzyPlan20211002.css',
  'FuzzyPlan20211002.js',
  'apple-touch-icon.png',
  'favicon.ico',
  'favicon.png',
  'icon.svg',
  'index.html',
  'instructions_dk.html',
  'instructions.html',
  'manifest.json',
  'favicons/maskable_192.png',
  'favicons/favicon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(FP_CACHE).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Fetch request for: ', event.request.url);
  event.respondWith( caches.match(event.request, {ignoreVary: true}).then( // ignoreVary should make the cache match ignore flags and stuff that can make a mathc fail unintentionally
    function(response) {
      return response || fetch(event.request);
    }).catch(function(error) {
      console.log('FuzzyPlan serviceWorker respondWith error', error);
    })
  );
})
