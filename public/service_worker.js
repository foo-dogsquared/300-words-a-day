const cache_name = "300wads";
const cache_version = "v1";
const cache_folder_name = `${cache_name}-${cache_version}`;

const valid_routes = {
    home: "/",
    app: "/app",
    settings: "/settings",
    notes: "/note"
}

const cache_files = {
    stylesheet: "/css/main.css",
    social_links: "/img/author-social-icons.svg",
    favicon: "/img/icon.png",
    icon_original_size: "/img/icon-original-size.png",
    js: "/js/main.js",
    offline: "/offline",
    main_font_woff: "/fonts/TeXGyreSchola-Regular.woff",
    main_font_ttf: "/fonts/TeXGyreSchola-Regular.ttf",
    main_font_otf: "/fonts/TeXGyreSchola-Regular.otf",
    main_font_eot: "/fonts/TeXGyreSchola-Regular.eot",
    main_font_italic_woff: "/fonts/TeXGyreSchola-Italic.woff",
    main_font_italic_ttf: "/fonts/TeXGyreSchola-Italic.ttf",
    main_font_italic_otf: "/fonts/TeXGyreSchola-Italic.otf",
    main_font_italic_eot: "/fonts/TeXGyreSchola-Italic.eot",
    localforage: "/js/localforage.min.js",
    marked: "/js/marked.min.js"
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
    const notes_url = new RegExp(`^${self.origin}${valid_routes.notes}/`, "gi");
    const notes_param = new RegExp(`^${self.origin}${valid_routes.notes}/(.+)`, "i");
    console.log(`Fetching for: ${event.request.url} at ${event.request.mode}`);
    // checking if the request is for the HTML files
    if (event.request.mode === "navigate" && notes_url.test(event.request.url) && Number(event.request.url.match(notes_param)[1])) {event.respondWith(caches.match(valid_routes.notes));}
    else if ((event.request.mode === "navigate") && !is_valid_route(event.request.url, Object.values(valid_routes))) {
        event.respondWith(
            fetch(event.request)
            .catch(function(error) {
                console.error(error);
                return caches.match(cache_files.offline);
            })
        )
    }
    else {
        event.respondWith(
            fetch(event.request)
            .then(function(response) {
                caches.open(cache_folder_name)
                .then(cache => cache.put(event.request, response))
                return response;
            })
            .catch(function(error) {
                return caches.match(event.request);
            })
        );
    }
});

// offline routing

