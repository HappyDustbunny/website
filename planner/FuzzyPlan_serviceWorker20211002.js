
let FP_CACHE = 'FP-cache';
let CACHED_URLS = [
  '200px-A_SVG_semicircle_heart_empty.svg.png',
  '200px-A_SVG_semicircle_heart.svg.png',
  '200px-Flag_of_Denmark.png',
  '200px-Flag_of_the_United_Kingdom.png',
  'FPlogo.png',
  'favicons/favicon.ico',
  'favicons/favicon-16.png',
  'favicons/favicon-32.png',
  'favicons/favicon-57.png',
  'favicons/favicon-60.png',
  'favicons/favicon-64.png',
  'favicons/favicon-76.png',
  'favicons/favicon-72.png',
  'favicons/favicon-96.png',
  'favicons/favicon-114.png',
  'favicons/favicon-120.png',
  'favicons/favicon-144.png',
  'favicons/favicon-152.png',
  'favicons/favicon-160.png',
  'favicons/favicon-180.png',
  'favicons/favicon-192.png',
  'favicons/browserconfig.xml',
  'FuzzyPlan20211002.css',
  'FuzzyPlan20211002.js',
  'instructions_dk.html',
  'instructions.html',
  'FuzzyPlan_manifest.json',
  'main.html'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(FP_CACHE).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // console.log('Fetch request for: ', event.request.url);
  event.respondWith( caches.match(event.request) );
})
