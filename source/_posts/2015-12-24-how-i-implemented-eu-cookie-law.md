---
title: How I implemented the EU cookie law
author:
    name: Janos Pasztor
    link: https://plus.google.com/103823461975597573448
tags:
    - legal
    - JavaScript
categories:
    - Development
layout: post
description: >
             In this blog post, we'll take a good look at the EU regulation regarding cookies and also implement a
             solution in JavaScript to deal with it.
---

{% block warning %}
{% import "utils.twig" as utils %}
{{ utils.legal() }}
{% endblock %}

{% block excerpt %}
I'm late to this party, very late. The EU cookie law went into effect as early as 2011, yet nobody seemed 
to care. However, in 2015 this law has seen an unprecedented attention and annoyance by both developers and 
business owners, no small part due to Google now requiring sites using Adsense and Doubleclick to implement
the EU cookie law. Also, some countries also started to fine companies not complying with the law.
{% endblock %}

{% block content %}
{% import "utils.twig" as utils %}
## What's the point, anyway?

Most of the time everyone is thoroughly annoyed by the whole topic and wants to be done with a banner
saying <q>We are using cookies! Screw you!</q> Unfortunately that's completely missing the point, not to
mention that it's &ndash; as far as I can tell &ndash; not even enough to comply with the legal
requirements.

If you read the actual [EU info page](http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm),
you will realize that the whole issue is about privacy. Embedding various widgets and buttons in our
webpages inevitably is causing us to give companies our visitors data, to the point that I begin seeing
ads about absolutely everything I have read up on the internet, with very few exceptions.

If you install [Ghostery](https://www.ghostery.com/), you'll realize just how rampant the whole issue
has become across the board. It's not like these companies respect the privacy of people either. Facebook,
for example, continues to track you even if you are not logged in, as it was proven in
[a recent court case Belgium](http://techcrunch.com/2015/11/11/facebook-faces-privacy-fines/).

And why do you think Google Analytics is free? Or Facebook? It's becoming a cliche real fast, but
*you (or in this case your viewers) are the product*.
[Remarketing](https://support.google.com/adwords/answer/2454000?hl=en) is more popular than ever,
and other, more dubious schemes are most assuredly in the works.

The question is: is it really that bad bad? Are we fast becoming the society of
[Minority Report](https://en.wikipedia.org/wiki/Minority_Report_\(film\)) where advertising is
tailored specifically to us? If yes, how bad would it be? I've long held the opinion that I'd love to have 
advertising tailored to me. I don't want to buy the crap that everbody seems to try and sell to me. I want 
cool geeky stuff, and I'm willing to spend money on it and I'm not in the least bit interested in most of the
stuff being advertised to me.

There are a few instances where targeting has worked fairly well for me, for example one Kickstarter advertising 
agency has targeted me with an ad that lead to me fund the campaign. And guess what, they delivered 100%, I'm
now a proud and very satisfied owner of said product.

Unfortunately the advertising industry doesn't serve me, it serves the advertisers. In other words, it
s not like there is a personal assistant that combs the internet for the stuff that interests me, most of the
time it is trying to push stuff I don't really care about. More often than not I end up seeing advertisements
that either don't interest me or I have seen three dozen times and they are driving me nuts. A certain
advertising agency seems hell-bent on spending money advertising a dating app to people who have chosen not
to provide Facebook with their relationship status. I've seen the ad about a bazillion times and I've clicked
it away more than a few times, yet it keeps coming back. They push the advertisements on the off chance that
I may reconsider clicking the damn thing, annoying the hell out of me.

My conclusion? We are in this situation because of ad fatigue A.K.A. banner blindness. Some new method was
needed where customers pay attention once more. Unfortunately, ads don't cause ad fatigue, idiots in the
marketing industry do, and there is apparently no shortage of those. At some point, personalized ads will
result in ad fatigue too, and one has to wonder, what comes then? Something even more intrusive?

That's the reason why the EU has taken up the topic, as for the most part they have been more
inclined to serve its constituents rather than corporate interests. It's by far not perfect, but it's way
better than the US in this respect. That resulted in the EU cookie law, which aims to bring some
transparency and choice, whether to accept tracking or not, to the consumer.

As it usually is, the original idea has been watered down quite a bit, but the transparency part is still there.
EU law now requires websites to be transparent about how and why they track their users, and most
importantly, who they are giving their data away to. And let me be clear, that is a good thing. Some websites
have gone completely overboard with including third party JavaScript gadgets, selling out their visitors in
the process.

## What do I need to do?

As the [EU page on cookies](http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm) explains, 
the law differentiates between **session cookies** vs.
**persistent cookies** and **first-party cookies** vs.
**third party cookies**. When writing your **cookie policy**, you will have to split your 
cookies according to these and explain to the user what you are doing. 

The EU page also details that you should separate your cookies based on what their <strong>purpose</strong> 
is. [Some cookies are exempt from the cookie consent requirement.](http://ec.europa.eu/justice/data-protection/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf)
These are called strictly necessary cookies that are required for carrying out the action the user has 
requested. In other words, nope, you don't need a cookie consent banner for session cookies and you also
don't need a consent if you are only storing user preferences (such as language choice) for a session or
slightly longer.

On the other hand you do need a cookie consent if you are storing data for a prolonged time, and/or
you are tracking the user or use it for advertising. You also need consent if you are sending the data to third
parties.

## Technical implementation

The whole policy-issue comes from the limitation of the technology. There are perfectly legitimate use cases 
for cookies across multiple domains, such as single sign on, and there is no easy way to differentiate 
between cookies that facilitate user-requested data storage and advertisement/tracking. So, we are left with 
doing JavaScript magic.

Instead of doing it ourselves, we can of course use pre-made scripts like
[silktide's cookie script](https://silktide.com/tools/cookie-consent/) or services like
[Optanon](https://www.cookielaw.org/). While I like Optanons approach better, both do a reasonable
job of implementing the current legal requirements.

If you are like me and want to go a step further, you can also implement your own JavaScript and allow your 
users a true choice. We will be implementing the following algorithm:

- If the [Do Not Track header](https://en.wikipedia.org/wiki/Do_Not_Track) is set, don't show the 
  cookie consent banner and disable all tracking scripts.
- If the user has explicitly decided whether to use or not use tracking cookies, don't display the cookie 
  banner and act accordingly.
- Otherwise display the banner with an &ldquo;enable&rdquo;, a &ldquo;disable&rdquo; and a &ldquo;more 
  info&rdquo; button and enable tracking as a default.
- When the &ldquo;enable&rdquo; or a &ldquo;disable&rdquo; button is clicked, hide the banner and record 
  the preference in a short-lived cookie (30 days).
- When the &ldquo;more info&rdquo; button is clicked, go to the cookie policy, where the first two 
  buttons are displayed again to change the setting later.
- When embedding the tracking code, do a query to this script to ask if tracking is enabled or not.

As you can see, it's nothing too complicated. Although I'm not a lawyer, I'm fairly sure this will fulfill 
requirements in most EU countries. Some countries seem to have even stricter requirements, such as the 
requirement to have an explicit and freely given consent (i.e. you can't set cookies until the user has 
clicked the accept button).

The italian regulation, for example, is, as far as I understand, one that requires explicit
opt-in. However, when digging into the details, I found an italian text citing the option to set the Do Not
Track header as a sufficient option, so I am unsure whether you need to do anything else. Big companies seem
to thing this is enough, so unless you hear tons of lawsuits coming their way in the news, my guess is,
you're good.

So without further ado, here's my script, for your customizing pleasure, built with jQuery and Bootstrap. You
will also need the [jquery-cookie plugin](https://plugins.jquery.com/cookie/).

```javascript
/**
 * Cookie consent handler
 */
var cookieConsent;

(function ($) {
  "use strict";

  cookieConsent = {
    /**
     * Returns true if a Do Not Track setting can be detected.
     * Disables all but necessary cookies.
     *
     * @returns {boolean}
     *
     * @internal
     */
    isDoNotTrack: function() {
      return !!(navigator.doNotTrack || navigator.msDoNotTrack);
    },
    /**
     * Returns the consent information if available, defaults
     * otherwise.
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
        // In case of Do Not Track, we don't need to store
        // any cookies.
        return;
      }
      var expires = new Date();
      expires.setDate(expires.getDate() + 30);
      $.cookie('tracking-consent', JSON.stringify(data),
        {'expires': expires, 'path':'/'});
    },
    /**
     * Returns true if tracking is enabled, false if not.
     *
     * @returns {boolean}
     */
    trackingEnabled: function () {
      var consent = cookieConsent.getConsentCookie();
      return !(typeof consent.optOut !== "undefined" &&
        consent.optOut === true);
    },
    /**
     * Hide the cookie consent bar
     */
    hideBar: function() {
      $('.alert.alert-cookie').slideUp(500, function() {
        $(this).remove();
      });
      $('.alert-cookie-container').slideUp(500, function() {
        $(this).remove();
      });
    },
    /**
     * Sets the tracking to explicit optout, which will be stored
     * in a cookie for 30 days.
     */
    optOut: function() {
      var consent = cookieConsent.getConsentCookie();
      consent.optOut = true;
      consent.seen = true;
      cookieConsent.setConsentCookie(consent);

      // Change the form on the cookie policy page
      $('.cookie-optin i.glyphicon')
        .addClass('glyphicon-unchecked')
        .removeClass('glyphicon-check');
      $('.cookie-optout i.glyphicon')
        .addClass('glyphicon-check')
        .removeClass('glyphicon-unchecked');

      cookieConsent.hideBar();
    },
    /**
     * Sets the tracking to explicit optin, which will be stored
     * in a cookie for 30 days.
     */
    optIn: function() {
      var consent = cookieConsent.getConsentCookie();
      consent.optOut = false;
      consent.seen = true;
      cookieConsent.setConsentCookie(consent);
      // Change the form on the cookie policy page
      $('.cookie-optin i.glyphicon')
            .addClass('glyphicon-check')
            .removeClass('glyphicon-unchecked');
      $('.cookie-optout i.glyphicon')
            .addClass('glyphicon-unchecked')
            .removeClass('glyphicon-check');

      cookieConsent.hideBar();
    },
    renderCookieConsent: function() {
      var settings;
      
      // Render the settings on the cookie policy page
      if (!cookieConsent.isDoNotTrack()) {
        settings = $(
          '<div class="margin-top text-center">' +
            '<button type="button" '+
              'class="btn btn-success cookie-optin">' +
              '<i class="glyphicon glyphicon-unchecked"></i> ' +
              'Turn cookies on' +
            '</button> ' +
            '<button type="button" '+
              'class="btn btn-warning cookie-optout">' +
              '<i class="glyphicon glyphicon-unchecked"></i> ' +
              'Turn cookies off for 30 days' +
            '</button> ' +
          '</div>'
        );
        settings.find('.cookie-optout').click(
          cookieConsent.optOut);
        settings.find('.cookie-optin').click(
          cookieConsent.optIn);

        // Update the state on the cookie policy page
        if (!cookieConsent.getConsentCookie().optOut) {
          settings.find('.cookie-optin i.glyphicon')
            .addClass('glyphicon-check')
            .removeClass('glyphicon-unchecked');
        } else {
          settings.find('.cookie-optout i.glyphicon')
            .addClass('glyphicon-check')
            .removeClass('glyphicon-unchecked');
        }
      } else {
        settings = $(
            '<div class="margin-top text-center"><strong>' +
            'Tracking is currently disabled because ' +
            'of your <em>Do Not Track</em> browser setting.' +
          '</strong></div>');
      }
      $(".cookie-settings").append(settings);

      // Render the cookie consent bar
      if (!cookieConsent.getConsentCookie().seen) {
        var banner = $(
          '<div class="alert-cookie-container">' +
            '<div class="alert alert-cookie alert-dismissible ' +
              'fade in alert-top" role="alert">' +
            '<div class="container">' +
              'This site is using cookies to better understand ' +
              'visitor needs. We store all tracking ' +
              'data on our own servers and respect ' +
              'your privacy. For more information, please ' +
              '<a href="/cookies">read our cookie policy</a>.' +
              '<br />' +
              '<div class="margin-top text-center">' +
                '<button type="button" ' +
                  'class="btn btn-success cookie-optin">' +
                  'Keep cookies turned on' +
                '</button> ' +
                '<button type="button" ' +
                  'class="btn btn-warning cookie-optout">' +
                  'Opt me out for 30 days' +
                '</button> ' +
                '<a href="/cookies" ' +
                  'class="btn btn-info" data-dismiss="alert">' +
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
```

To effectively use it, you will also need some minimal CSS (implemented in
[SCSS](http://sass-lang.com/):

```css
body .alert-cookie {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eee;
}

body .alert-cookie .btn {
  margin-bottom:15px;
}

@media (max-width: $screen-xs-max) {
  body .alert-cookie {
    position: static;
  }
  body .alert-cookie .btn {
    width:100%;
  }
}
```

You can then use the `cookieConsent.trackingEnabled()` function to ask the script if a consent has 
been given. Or course, you will have to adapt the text to your own policy. :)

## Writing the policy

Don't forget, you will also need to write a proper cookie policy. If you use my script, you can add a div to 
render the cookie settings: <code>&lt;div class=&quot;cookie-settings&quot;&gt;&lt;/div&gt;</code>. If you 
need an example for a cookie policy (again, without warranty), <a href="/cookies">take a look at mine</a>.

## Frequently asked questions

## I'm a US company. I don't need to comply, right?

That's a tricky proposition. The US is a [World Trade Organization](https://www.wto.org/) member, 
just like the EU. That means that WTO agreements and regulations apply, so if you are selling services or products to
EU customers, you must comply with EU laws (i.e. pay VAT for example). This means (as far as I know) that you 
need to comply with the EU cookie and privacy protection laws as well. So no dice, you have to serve up the 
cookie consent bar to your EU visitors.

If you are a small time blog or non-profit, you probably don't have to / won't be fined for it, but don't 
take my word for it.

### Do I have to let my customers opt out?

Probably not. In most EU countries it is enough if you detail how you use cookies and give your users a hint 
how they can block them. Observing the DNT header is also not compulsory, only advisable, since it is not 
standardized. 

### Sources

- [European Commission](http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm)
- [Optanon / cookielaw.org](https://www.cookielaw.org/)
- [Directive 2002/58/EC of the European Parliament](
  http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=CELEX:32002L0058:EN:HTML)
{% endblock %}
