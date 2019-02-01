function render_date(){}
if("serviceWorker"in navigator){navigator.serviceWorker.register("/service-worker.js",{scope:"./"}).then(function(registration){console.log(`Service worker has been installed!`)}).catch(function(error){console.log(`Service worker registration failed. See error message:\nERROR: ${error}`)})}

