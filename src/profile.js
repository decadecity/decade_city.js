/**
 * Profiles the runtime environment to check support.
 */
define(function(require, exports, module) {
  "use strict";

  var config = require('config'),
      cookies = require('cookies'),
      sessionStorage = require('sessionStorage');

  module.exports = {};

  var image = new Image(),
      html = document.querySelector('html'),
      setProfile,
      script;

  /**
   * Sets the serialised profile as a cookie.
   */
  setProfile = function() {
    /* istanbul ignore else */
    if (module.exports.profile.json) {
      cookies.setItem('profile', JSON.stringify(module.exports.profile), null, '/');
    }
  };

  module.exports.profile = {};
  module.exports.profile.profile = true; // We are profiling this environment.

  // SVG support.
  module.exports.profile.svg = false;
  /* istanbul ignore else */
  if (!!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
    module.exports.profile.svg = true;
  }

  // Transform CSS prefix.
  module.exports.profile.transform_prefix = '';
  module.exports.profile.transform = false;
  /* istanbul ignore next */
  if ('webkitTransform' in image.style) {
    module.exports.profile.transform_prefix = '-webkit-';
    module.exports.profile.transform = true;
  }
  /* istanbul ignore next */
  else if ('MozTransform' in image.style) {
    module.exports.profile.transform_prefix = '-moz-';
    module.exports.profile.transform = true;
  }
  /* istanbul ignore next */
  else if ('OTransform' in image.style) {
    module.exports.profile.transform_prefix = '-o-';
    module.exports.profile.transform = true;
  }
  /* istanbul ignore next */
  else if('transform' in image.style) {
    module.exports.profile.transform_prefix = '';
    module.exports.profile.transform = true;
  }
  /* istanbul ignore else */
  if (module.exports.profile.transform) {
    html.classList.add('transform');
  }

  // Touch support.
  module.exports.profile.touch = false;
  /* istanbul ignore else */
  if ('ontouchstart' in window /* istanbul ignore next default */ || (typeof navigator.msMaxTouchPoints !== 'undefined' && navigator.msMaxTouchPoints > 0)) {
    module.exports.profile.touch = true;
    html.classList.remove('pointer');
  }

  // JSON parser support.
  module.exports.profile.json = false;
  /* istanbul ignore else */
  if (typeof JSON !== 'undefined') {
    module.exports.profile.json = true;
  }

  // Asynchronous script support.
  script = document.createElement('script');
  script.setAttribute('async', true);
  module.exports.profile.async_scripts = !!script.async;

  // Timing API
  module.exports.profile.timing = !!(typeof window.performance !== 'undefined' /* istanbul ignore next default */ && typeof window.performance.timing !== 'undefined');

  function toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
      }
    }
    return parts.join("&");
  }

  /**
   * Sends the profile to the server with an ajax request.
   *
   * @param force {Boolean} Force sending even if the profile has already been sent.
   */
  module.exports.sendProfile = function (force) {

    /* istanbul ignore next TODO fix */

    // Send the data to the server on first load - if we don't do this it won't get sent if there's only one page load.
    window.setTimeout(function () {
      // TODO: remove for testing.
      var sent = false,
          url = module.config.profiler_url || '/profile';
      // Connection information
      if (typeof module.load_speed !== 'undefined') {
        module.exports.profile.load_speed = module.load_speed;
      }
      if (typeof module.connection_type !== 'undefined') {
        module.exports.profile.connection_type = module.connection_type;
      }
      module.exports.profile.session_storage = sessionStorage.supported;
      setProfile(); // Make sure it's been set.
      if (module.exports.profile.session_storage) {
        sent = !!(sessionStorage.getItem('profile-sent'));
      } else {
        sent = !!(cookies.getItem('profile-sent'));
      }
      if (!sent || force) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url + '?' + toQueryString(module.exports.profile), true);
        httpRequest.send(null);
        if (module.exports.profile.session_storage) {
          sessionStorage.setItem('profile-sent', 1);
        } else {
          cookies.setItem('profile-sent', 1, null, '/');
        }
      }
    }, 100);
  };

  module.exports.ready = function() {
    setProfile();
    module.exports.sendProfile();
  };

  /* istanbul ignore next */
  // Open up items for debugging.
  if (config.debug) {
    module.exports.toQueryString = toQueryString;
  }

});
