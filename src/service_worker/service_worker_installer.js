// installing a service worker for offline capabilities
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service_worker.js", {scope: "./"});
}