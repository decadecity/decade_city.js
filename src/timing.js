/**
 * RUM data collection.
 */
define(function(require, exports, module) {
  "use strict";

  var config = require('config'),
      cookies = require('cookies'),
      sessionStorage = require('sessionStorage');

  module.exports = {};

  var vars = {},
      url = config.beacon_url,
      timing = !!(typeof window.performance !== "undefined" /* istanbul ignore next default */ && typeof window.performance.timing !== "undefined");

  /**
   * Adds a variable to the internal register.
   *
   * @param name {String} Name of variable to add.
   * @param value {String} Value of variable.
   */
  module.exports.addVar = function (name, value) {
    if (typeof name === "string") {
      vars[name] = value;
    }
    /* istanbul ignore else */
    else if (typeof name === "object") {
      var data = name,
          key;
      for (key in data) {
        /* istanbul ignore else */
        if (data.hasOwnProperty(key)) {
          vars[key] = data[key];
        }
      }
    }
  };

  // Add some information we know at this stage.
  module.exports.addVar({
    'noscript': 0,
    'r': document.referrer,
    'u': window.location.href
  });

  module.exports.addVar({
    'b_height': window.document.documentElement['clientHeight'],
    'b_width': window.document.documentElement['clientWidth']
  });

  /**
   * Sends the tracking data.
   */
  var sendBeacon = function () {
    var params = [],
        seperator = '?',
        key, img;
    /* istanbul ignore else */
    if (vars && url) {
      /* istanbul ignore else */
      if (url.search(/\?/) > -1) {
        // There's already a '?' in the URL so we need to add params.
        seperator = '&';
      }
      for (key in vars) {
        /* istanbul ignore else */
        if (vars.hasOwnProperty(key)) {
          params.push(key + '=' + encodeURIComponent(vars[key]));
        }
      }
      img = new Image();
      img.src = url + seperator + params.join('&');
    }
  };

  /**
   * Initialise module.exports and set vars known at DOMReady.
   */
  /* istanbul ignore next Browser API normalisation. */
  var init = function () {
    var t_done;

    if (timing) {
      // Override any in-page timer.
      window.t_pagestart = window.performance.timing.responseEnd;
    } else {
      // Need to use storage to get the navigation start time.
      window.addEventListener('beforeunload', function () {
        if (sessionStorage.supported) {
          sessionStorage.setItem('t_navigation_start', new Date().getTime());
        } else {
          cookies.setItem('t_navigation_start', new Date().getTime(), false, '/');
        }
      });
    }
    if (!window.t_domready) {
      if (timing) {
        window.t_domready = window.performance.timing.domInteractive;
      } else {
        window.t_domready = new Date().getTime(); // Hit and hope.
      }
    }
  };

  /**
   * Final timing values and send beacon.
   */
  var main = function() {
    var t_onload = window.t_onload /* istanbul ignore next default */ || new Date().getTime(), // Should have been set but if not then hit and hope.
        t_navigation_start,
        t_done,
        t_firstpaint = null,
        onload;

    // Collect the remaining timing data.
    /* istanbul ignore next Browser API normalisation. */
    if (timing) {
      t_onload = window.performance.timing.loadEventStart;
      t_done = window.performance.timing.responseEnd - window.performance.timing.navigationStart;
      onload = t_onload - window.t_pagestart;
    } else {
      // Pull the navigation start from storage if we have it.
      if (sessionStorage.supported) {
        t_navigation_start = sessionStorage.getItem('t_navigation_start');
      } else {
        t_navigation_start = cookies.getItem('t_navigation_start');
      }
      // Collect data if available.
      if (t_navigation_start && window.t_pagestart) {
        t_done = window.t_pagestart - t_navigation_start;
        onload = t_onload - window.t_pagestart;
      }
    }

    // Figure out first paint
    /* istanbul ignore next Browser normalisation. */
    if (timing && timing.msFirstPaint && window.t_pagestart) {
      t_firstpaint = timing.msFirstPaint - window.t_pagestart;
    } else if (window.chrome && typeof window.chrome.loadTimes === 'function') {
      t_firstpaint = Math.round((window.chrome.loadTimes().firstPaintTime - window.chrome.loadTimes().startLoadTime) * 1000);
    }

    // Now we have the data we set the variables.
    /* istanbul ignore else */
    if (window.t_pagestart && window.t_domready) {
      module.exports.addVar('t_domready', window.t_domready - window.t_pagestart);
      /* istanbul ignore else */
      if (window.t_headend) {
        module.exports.addVar('t_head', window.t_headend - window.t_pagestart);
        /* istanbul ignore else */
        if (window.t_bodyend) {
          module.exports.addVar('t_body', window.t_bodyend - window.t_headend);
        }
      }
    }
    /* istanbul ignore else */
    if (t_done) {
      module.exports.addVar('t_done', t_done);
    }
    /* istanbul ignore else */
    if (onload) {
      module.exports.addVar('t_onload', onload);
    }
    /* istanbul ignore else */
    if (window.t_jsstart && window.t_jsend) {
      module.exports.addVar('t_js', window.t_jsend - window.t_jsstart);
    }
    /* istanbul ignore else */
    if (window.t_cssstart && window.t_cssend) {
      module.exports.addVar('t_css', window.t_cssend - window.t_cssstart);
    }
    module.exports.addVar('t_firstpaint', t_firstpaint);

    // Finally, send the data after a delay.
    window.setTimeout(sendBeacon, 500);
  };

  module.exports.timing = timing;
  module.exports.ready = init;
  module.exports.load = function() {
    // Need onload to have had a chance to finish to get timings.
    window.t_onload = new Date();
    window.setTimeout(main, 500);
  };

  /* istanbul ignore next */
  if (config.debug) {
    // If we're in debug mode then we expose the vars for testing.
    module.exports.getVars = function () {
      return vars;
    };
  }

});
