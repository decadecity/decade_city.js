window.DECADE_CITY = (function (module, $){
  "use strict";

  /**
   * Profiles the runtime environment to check support.
   */
  module.PROFILE = (function (module, submodule, $) {
    var image = new Image(),
        html = $('html'),
        setProfile,
        script;

    /**
     * Sets the serialised profile as a cookie.
     */
    setProfile = function() {
      if (submodule.profile.json && typeof module.COOKIES !== 'undefined') {
        module.COOKIES.setItem('profile', JSON.stringify(submodule.profile), null, '/');
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
    module.transform_prefix = '';
    if ('webkitTransform' in image.style) {
      module.transform_prefix = '-webkit-';
      submodule.profile.transform = true;
    } else if ('MozTransform' in image.style) {
      module.transform_prefix = '-moz-';
      submodule.profile.transform = true;
    } else if ('OTransform' in image.style) {
      module.transform_prefix = '-o-';
      submodule.profile.transform = true;
    } else if('transform' in image.style) {
      module.transform_prefix = '';
      submodule.profile.transform = true;
    }
    if (submodule.profile.transform) {
      html.addClass('transform');
    }

    // Touch support.
    if ('ontouchstart' in window || (typeof navigator.msMaxTouchPoints !== 'undefined' && navigator.msMaxTouchPoints > 0)) {
      submodule.profile.touch = true;
      if ($(html).hasClass('pointer')) {
        $(html).removeClass('pointer');
      }
    }

    // JSON parser support.
    if (typeof JSON !== 'undefined') {
      submodule.profile.json = true;
    }

    // Asynchronous script support.
    script = document.createElement('script');
    script.setAttribute('async', true);
    submodule.profile.async_scripts = !!script.async;

    /**
     * Sends the profile to the server with a ajax request.
     *
     * @param force {Boolean} Force sending even if the profile has already been sent.
     */
    submodule.sendProfile = function (force) {
      if (typeof module.COOKIES === 'undefined') {
        return false;
      }
      // Send the data to the server on first load - if we don't do this it won't get sent if there's only one page load.
      $(document).ready(function () {
        window.setTimeout(function () {
          // Connection information
          if (typeof module.load_speed !== 'undefined') {
            submodule.profile.load_speed = module.load_speed;
          }
          if (typeof module.connection_type !== 'undefined') {
            submodule.profile.connection_type = module.connection_type;
          }
          if (typeof module.POLYFILL.sessionStorage !== 'undefined') {
            submodule.profile.session_storage = module.POLYFILL.sessionStorage.supported;
          }
          setProfile(); // Make sure it's been set.
          if (!module.COOKIES.getItem('profile_sent') || force) {
            $.get('/profile', submodule.profile); // TODO: Parameterise the profiler URL.
            module.COOKIES.setItem('profile_sent', 1, null, '/');
          }
        }, 100);
      });
    };

    module.register(submodule.sendProfile);
    module.register(setProfile);

    return submodule;
  }(module, module.PROFILE || {}, $));

  return module;
}(window.DECADE_CITY || {}, window.jQuery));
