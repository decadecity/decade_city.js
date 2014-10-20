/**
 * Profiles the runtime environment to check support.
 */
define(function(require, exports, module) {
  "use strict";

  var cookies = require('cookies'),
      sessionStorage = require('sessionStorage');

  var submodule = {};

  var image = new Image(),
      html = document.querySelector('html'),
      setProfile,
      script;

  /**
   * Sets the serialised profile as a cookie.
   */
  setProfile = function() {
    if (submodule.profile.json) {
      cookies.setItem('profile', JSON.stringify(submodule.profile), null, '/');
    }
  };

  submodule.profile = submodule.profile || {};
  submodule.profile.profile = true; // We are profiling this environment.

  // SVG support.
  submodule.profile.svg = false;
  if (!!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
    submodule.profile.svg = true;
  }

  // Transform CSS prefix.
  submodule.profile.transform_prefix = '';
  submodule.profile.transform = false;
  if ('webkitTransform' in image.style) {
    submodule.profile.transform_prefix = '-webkit-';
    submodule.profile.transform = true;
  } else if ('MozTransform' in image.style) {
    submodule.profile.transform_prefix = '-moz-';
    submodule.profile.transform = true;
  } else if ('OTransform' in image.style) {
    submodule.profile.transform_prefix = '-o-';
    submodule.profile.transform = true;
  } else if('transform' in image.style) {
    submodule.profile.transform_prefix = '';
    submodule.profile.transform = true;
  }
  if (submodule.profile.transform) {
    html.classList.add('transform');
  }

  // Touch support.
  submodule.profile.touch = false;
  if ('ontouchstart' in window || (typeof navigator.msMaxTouchPoints !== 'undefined' && navigator.msMaxTouchPoints > 0)) {
    submodule.profile.touch = true;
    html.classList.remove('pointer');
  }

  // JSON parser support.
  submodule.profile.json = false;
  if (typeof JSON !== 'undefined') {
    submodule.profile.json = true;
  }

  // Asynchronous script support.
  script = document.createElement('script');
  script.setAttribute('async', true);
  submodule.profile.async_scripts = !!script.async;

  // Timing API
  submodule.profile.timing = !!(typeof window.performance !== 'undefined' && typeof window.performance.timing !== 'undefined');

  /**
   * Sends the profile to the server with an ajax request.
   *
   * @param force {Boolean} Force sending even if the profile has already been sent.
   */
  submodule.sendProfile = function (force) {
    // TODO: remove for testing.
    function toQueryString(obj) {
      var parts = [];
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
      }
      return parts.join("&");
    }

    // Send the data to the server on first load - if we don't do this it won't get sent if there's only one page load.
    window.setTimeout(function () {
      // TODO: remove for testing.
      var sent = false,
          url = module.config.profiler_url || '/profile';
      // Connection information
      if (typeof module.load_speed !== 'undefined') {
        submodule.profile.load_speed = module.load_speed;
      }
      if (typeof module.connection_type !== 'undefined') {
        submodule.profile.connection_type = module.connection_type;
      }
      submodule.profile.session_storage = sessionStorage.supported;
      setProfile(); // Make sure it's been set.
      if (submodule.profile.session_storage) {
        sent = !!(sessionStorage.getItem('profile-sent'));
      } else {
        sent = !!(cookies.getItem('profile-sent'));
      }
      if (!sent || force) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url + '?' + toQueryString(submodule.profile), true);
        httpRequest.send(null);
        if (submodule.profile.session_storage) {
          sessionStorage.setItem('profile-sent', 1);
        } else {
          cookies.setItem('profile-sent', 1, null, '/');
        }
      }
    }, 100);
  };

  submodule.ready = function() {
    setProfile();
    submodule.sendProfile();
  };

  module.exports = submodule;

});
