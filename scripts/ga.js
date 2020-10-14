// Global Site Tag (gtag.js) - Google Analytics // https://developers.google.com/analytics/devguides/collection/gtagjs/events
document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=' + config.tracking.gaID + '"><\/script>');

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments) };
gtag('js', new Date());
gtag('config', config.tracking.gaID, { 
    'dimension1': config.tracking.campaign_id, 
    'dimension2': config.tracking.app 
});

var timerStart = Date.now();

window.sendTrackEvent = function(evAction, evLabel) {
    if (typeof (gtag) !== 'undefined' && !config.devMode) {
        gtag('event', evAction, {
            'event_category': config.tracking.gaEventCategory,
            'event_label': evLabel,
            'dimension1': config.tracking.campaign_id,
            'dimension2': config.tracking.app,
            'value': Math.round((Date.now() - timerStart) / 100)/10,
        });
    }
    else {
        console.log('event!', config.tracking.gaEventCategory, evAction, evLabel);
    }
};

/**
 * Envoie un event ga toutes les secondes afin de comptabiliser
 * le temps d'affichage
 */
(function trackTime(sec) {
    if (sec == undefined) sendTrackEvent("Display time", "0 second");
    var sec = sec == undefined ? 1 : sec;
    setTimeout(function() {
        sendTrackEvent("Display time", sec+" second(s)");
        trackTime(sec+1);
    }, 1000);
})();