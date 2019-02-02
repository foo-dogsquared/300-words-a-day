const cache_name = "300wads";
const cache_version = "v1";
const cache_folder_name = `${cache_name}-${cache_version}`;

const valid_routes = {
    home: "/",
    app: "/app",
    settings: "/settings"
}

const cache_files = {
    stylesheet: "/css/main.css",
    social_links: "/img/author-social-icons.svg",
    favicon: "/img/icon.png",
    icon_original_size: "/img/icon-original-size.png",
    js: "/js/main.js",
    offline: "/offline",
    fonts_woff: "/fonts/TeXGyreSchola-Regular.woff",
    fonts_ttf: "/fonts/TeXGyreSchola-Regular.ttf",
    fonts_otf: "/fonts/TeXGyreSchola-Regular.otf",
    fonts_eot: "/fonts/TeXGyreSchola-Regular.eot"
};

// dynamically adding the valid routes into the cache files list
for (const valid_route in valid_routes) cache_files[valid_route] = valid_routes[valid_route];

self.addEventListener("install", function(event) {
    console.log("Service worker has been installed.");
    console.log("Installing all of the needed assets for the app.");
    event.waitUntil(
        caches.open(cache_folder_name)
        .then(function(cache) {
            cache.addAll(Object.values(cache_files));
        })
    )
})

self.addEventListener("activate", function(event) {
    console.log("Service worker activated.");   
});

function is_valid_route(url, url_whitelist = []) {
    if (url_whitelist.length <= 0) return false;

    for (const valid_url of url_whitelist) {
        if (url === `${self.origin}${valid_url}`) return true;
    }

    return false;
}

self.addEventListener("fetch", function(event) {
    console.log(`Fetching for: ${event.request.url} at ${event.request.mode}`);
    // checking if the request is for the HTML files
    if ((event.request.mode === "navigate") && !is_valid_route(event.request.url, Object.values(valid_routes))) {
        event.respondWith(
            fetch(event.request)
            .catch(function(error) {
                console.error(error);
                return caches.match("/offline");
            })
        )
    }
    else {
        event.respondWith(
            fetch(event.request)
            .then(function(response) {
                caches.add(event.request);
            })
            .catch(function(error) {
                return caches.match(event.request);
            })
        );
    }
});
