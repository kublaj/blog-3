// If Do Not Track is enabled, don't even load the tracking code
// Piwik doesn't track anyway, but this is a nice reinforcement to anyone looking at the code.
if (!cookieConsent.isDoNotTrack()) {
	var _paq = _paq || [];

	if (!cookieConsent.trackingEnabled()) {
		_paq.push(['disableCookies']);
	}
	_paq.push(['trackPageView']);
	_paq.push(['enableLinkTracking']);

	(function () {
		var u = "//track.opsbears.com/";
		_paq.push(['setTrackerUrl', u + 'js/']);
		_paq.push(['setSiteId', 1]);
	})();
}
