var cacheName = 'weatherPWA-step-6-1';
var dataCacheName = 'weatherData-v1';
var filesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

self.addEventListener("install", function(e) {
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener("activate", function(e) {
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName && key !== dataCacheName) {
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

self.addEventListener("fetch", function(e) {
	var dataUrl = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
	if (e.request.url.indexOf(dataUrl) > -1){
		// Cache then network strategy
		e.respondWith(
			caches.open(dataCacheName).then(function(cache) {
	   			return fetch(e.request).then(function(response){
		 			cache.put(e.request.url, response.clone());
		 				return response;
	   			});
	 		})
		);
	} else {
		// Cache failing back to the network offline strategy
		e.respondWith(
			caches.match(e.request).then(function(response){
				return response || fetch(e.request);
			})
		);
	}
});
