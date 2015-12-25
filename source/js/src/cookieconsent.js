var cookieConsent;

(function ($) {
	"use strict";

	cookieConsent = {
		/**
		 * Returns true if a Do Not Track setting can be detected. Disables all but necessary cookies.
		 *
		 * @returns {boolean}
		 */
		isDoNotTrack: function() {
			return !!(navigator.doNotTrack || navigator.msDoNotTrack);
		},
		/**
		 * Returns the consent information if available, defaults otherwise.
		 *
		 * @return {object}
		 *
		 * @internal
		 */
		getConsentCookie: function() {
			var cookieData;
			try {
				cookieData = $.parseJSON($.cookie("tracking-consent"));
			} catch (e) {
				//skip error
			}
			if (typeof cookieData != "object") {
				cookieData = {};
			}
			if (cookieConsent.isDoNotTrack()) {
				// Do Not Track means automatic optout, no cookies stored.
				cookieData.optOut = true;
			} else if (typeof cookieData.optOut === "undefined") {
				cookieData.optOut = false;
			}
			if (cookieConsent.isDoNotTrack()) {
				// Cookie consent not needed as it is completely disabled.
				cookieData.seen = true;
			} else if (typeof cookieData.seen === "undefined") {
				cookieData.seen = false;
			}
			return cookieData;
		},
		/**
		 * Saves the consent information for 30 days.
		 *
		 * @param data
		 *
		 * @internal
		 */
		setConsentCookie: function(data) {
			if (cookieConsent.isDoNotTrack()) {
				// In case of Do Not Track, we don't need to store any cookies.
				return;
			}
			var expires = new Date();
			expires.setDate(expires.getDate() + 30);
			$.cookie('tracking-consent', JSON.stringify(data), {'expires': expires, 'path':'/'});
		},
		/**
		 * Returns true if tracking is enabled, false if not.
		 *
		 * @returns {boolean}
		 */
		trackingEnabled: function () {
			var consent = cookieConsent.getConsentCookie();
			return !(typeof consent.optOut !== "undefined" && consent.optOut === true);
		},
		hideBar: function() {
			$('.alert.alert-cookie').slideUp(500, function() {
				$(this).remove();
			});
			$('.alert-cookie-container').slideUp(500, function() {
				$(this).remove();
			});
		},
		/**
		 * Sets the tracking to explicit optout, which will be stored in a cookie for 30 days.
		 */
		optOut: function() {
			var consent = cookieConsent.getConsentCookie();
			consent.optOut = true;
			consent.seen = true;
			cookieConsent.setConsentCookie(consent);

			$('.cookie-optin i.glyphicon').addClass('glyphicon-unchecked').removeClass('glyphicon-check');
			$('.cookie-optout i.glyphicon').addClass('glyphicon-check').removeClass('glyphicon-unchecked');

			cookieConsent.hideBar();
		},
		/**
		 * Sets the tracking to explicit optin, which will be stored in a cookie for 30 days.
		 */
		optIn: function() {
			var consent = cookieConsent.getConsentCookie();
			consent.optOut = false;
			consent.seen = true;
			cookieConsent.setConsentCookie(consent);
			$('.cookie-optin i.glyphicon').addClass('glyphicon-check').removeClass('glyphicon-unchecked');
			$('.cookie-optout i.glyphicon').addClass('glyphicon-unchecked').removeClass('glyphicon-check');

			cookieConsent.hideBar();
		},
		renderCookieConsent: function() {
			var settings;
			if (!cookieConsent.isDoNotTrack()) {
				settings = $(
					'<div class="margin-top text-center">' +
						'<button type="button" class="btn btn-success cookie-optin">' +
							'<i class="glyphicon glyphicon-unchecked"></i> ' +
							'Turn cookies on' +
						'</button> ' +
						'<button type="button" class="btn btn-warning cookie-optout">' +
							'<i class="glyphicon glyphicon-unchecked"></i> ' +
							'Turn cookies off for 30 days' +
						'</button> ' +
					'</div>'
				);
				settings.find('.cookie-optout').click(cookieConsent.optOut);
				settings.find('.cookie-optin').click(cookieConsent.optIn);

				if (!cookieConsent.getConsentCookie().optOut) {
					settings.find('.cookie-optin i.glyphicon').addClass('glyphicon-check')
						.removeClass('glyphicon-unchecked');
				} else {
					settings.find('.cookie-optout i.glyphicon').addClass('glyphicon-check')
						.removeClass('glyphicon-unchecked');
				}
			} else {
				settings = $('<div class="margin-top text-center"><strong>Tracking is currently disabled because ' +
					'of your <em>Do Not Track</em> browser setting.</strong></div>');
			}
			$(".cookie-settings").append(settings);

			if (!cookieConsent.getConsentCookie().seen) {
				var banner = $(
					'<div class="alert-cookie-container"><div class="alert alert-cookie fade in alert-top" role="alert">' +
						'<div class="container">' +
							'This site is using cookies to better understand visitor needs. We store all tracking ' +
							'data on our own servers and respect your privacy. For more information, please ' +
							'<a href="/cookies">read our cookie policy</a>.<br />' +
							'<div class="margin-top text-center">' +
								'<button type="button" class="btn btn-success cookie-optin">' +
									'Keep cookies turned on' +
								'</button> ' +
								'<button type="button" class="btn btn-warning cookie-optout">' +
									'Opt me out for 30 days' +
								'</button> ' +
								'<a href="/cookies" class="btn btn-info" data-dismiss="alert">' +
									'Learn more' +
								'</a> ' +
							'</div>' +
						'</div>' +
					'</div></div>'
				);
				banner.find('.cookie-optout').click(cookieConsent.optOut);
				banner.find('.cookie-optin').click(cookieConsent.optIn);
				$("body").prepend(banner);
				banner.height(banner.find('.alert-cookie').outerHeight());
				$(window).on('resize', function() {
					banner.height(banner.find('.alert-cookie').outerHeight());
				});
			}
		}
	};

	cookieConsent.renderCookieConsent();
})(jQuery);
