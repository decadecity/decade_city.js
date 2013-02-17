/*! decade_city.js - v0.2.0 - 2013-02-17
* https://github.com/decadecity/decade_city.js
* Copyright (c) 2013 Orde Saunders; Licensed MIT */

// Loosely based on jQuery's DOM ready.
window.DECADE_CITY = (function (module, $) {
  var resistry = [], // List of functions to be run.
      is_initialised = false; // Are we already initialised?
  /**
   * Registers a function to be run when the module is complete.
   *
   * If the module is already initialised the function will run immediately.
   *
   * @param funct {Function} Function to be run when module is initialised.
   */
  module.register = function (funct) {
    if (typeof funct === 'function') {
      if (is_initialised) {
        funct.call();
      } else {
        resistry.push(funct);
      }
    }
  };

  /**
   * Runs all functions in the registry.
   */
  module.init = function () {
    $.each(resistry, function(i, funct) {
      funct.call();
    });
    is_initialised = true;
  };

  return module;
}(window.DECADE_CITY || {}, window.jQuery));

window.DECADE_CITY = (function (module) {
  "use strict";

  /**
   * Handler for Cookies.
   */
  // https://developer.mozilla.org/en/DOM/document.cookie
  module.COOKIES = (function (module, submodule) {
    // Aliasing to keep JSHint happy.
    var escape = window.escape,
        unescape = window.unescape;
    /**
     * Gets an item from the cookie jar.
     *
     * @param key {String} Key of item to get.
     */
    submodule.getItem = function (key) {
      if (!key || !this.hasItem(key)) {
        return null;
      }
      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    };

    /**
     * Puts an item into the cookie jar.
     *
     * @param key {String} Key of item to store.
     * @param value {String} Value to store.
     * @param end {Number|String|Date} Expiry information, if number it will be max-age otherwise expires.  Set to falsy for session cookie.
     * @param path {String} Path for cookie scope.
     * @param domain {String} Domain for cookie scope.
     * @param secure {Boolean} Is this a secure cookie.
     */
    submodule.setItem = function (key, value, end, path, domain, secure) {
      if (!key || /^(?:expires|max\-age|path|domain|secure)$/.test(key)) {
        return;
      }
      var expires = "";
      if (end) {
        switch (typeof end) {
          case "number":
            expires = "; max-age=" + end;
            break;
          case "string":
            expires = "; expires=" + end;
            break;
          case "object":
            if (end.hasOwnProperty("toGMTString")) {
              expires = ";expires=" + end.toGMTString();
            }
            break;
        }
      }
      document.cookie = escape(key) + "=" + escape(value) + expires + (domain ? ";domain=" + domain : "") + (path ? ";path=" + path : "") + (secure ? ";secure" : "");
    };

    /**
     * Removes an item from the cookie jar.
     *
     * @param key {String} Key of item to remove.
     */
    submodule.removeItem = function (key) {
      if (!key || !this.hasItem(key)) { return; }
      document.cookie = escape(key) + "=;expires=Thu, 01-Jan-1970 00:00:01 GMT;";
    };

    /**
     * Check for presence of a key in the cookie jar.
     *
     * @param key {String} Key to look for.
     */
    submodule.hasItem = function (key) {
      return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    };

    return submodule;
  }(module, module.COOKIES || {}));

  return module;
}(window.DECADE_CITY || {}));

window.DECADE_CITY = (function (module, $){
  "use strict";

  /**
   * Profiles the runtime environment to check support.
   */
  module.PROFILE = (function (module, submodule, $) {
    var image = new Image(),
        html = $('html'),
        setProfile;

    /**
     * Sets the serialised profile as a cookie.
     */
    setProfile = function() {
      if (submodule.profile.json && typeof module.COOKIES !== 'undefined') {
        module.COOKIES.setItem('profile', JSON.stringify(submodule.profile), null, '/');
      }
    };

    submodule.profile = submodule.profile || {};

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

window.DECADE_CITY = (function (module, $) {
  "use strict";
  module.IMAGES = (function (module, submodule, $) {
    submodule._svgSrc = function(src) {
      return src.replace(/\.[^.\?]*($|\?)/, '.svg$1');
    };

    var init = function () {
      if (module.PROFILE.svg) {
        $('.svg-replace').each(function() {
          $(this).attr('src', function (i, src) {
            return submodule._svgSrc(src);
          });
          $(this).removeClass('svg-replace');
        });
      }
    };

    module.register(init);

    return submodule;

  }(module, module.IMAGES || {}, $));

  return module;
}(window.DECADE_CITY || {}, window.jQuery));

window.DECADE_CITY = (function (module, $) {
  "use strict";

  /**
   * Responsive flickr image replacement.
   */
  module.FLICKR = (function (module, submodule, $) {
    var image_replace = /^http(s)?:\/\/(.*)\.staticflickr.com\/(.*?)(_.\.jpg|\.jpg)$/, // Regex to break up a flickr image URL.
        getInt,
        responsiveImages;

    /**
     * Sanitiser for parseInt that will cope with NaN.
     *
     * @param number {Integer|String} Input to be sanitised.
     */
    getInt = function(number) {
      number = parseInt(number, 10);
      if (isNaN(number)) {
        number = 0;
      }
      return number;
    };

    /**
     * Suffix for Flckr images. {String}
     */
    submodule._flickr_suffix = '_m'; // Default to suffix of smallest image. Public for testing.

    /**
     * Has the flickr suffix been set? {Boolean}
     */
    submodule._flickr_suffix_set = false; //Public for testing.

    /**
     * Replaces a flickr image URL with the suffix set for the environment.
     *
     * Public for testing.
     *
     * @param src {String} Flickr image URL.
     *
     * @return {String} Image with flickr suffix set.
     */
    submodule._imageSrc = function (src) {
      var match, secure;
      match = image_replace.exec(src);
      if (!match) {
        return src;
      }
      secure = match[1] || '';
      return 'http' + secure + '://' + match[2] + '.staticflickr.com/' + match[3] + submodule._flickr_suffix + '.jpg';
    };

    /**
     * Replaces any flickr image with a class of .responsive with the appropriate size image for the environment.
     */
    responsiveImages = function () {
      var images = $('img.responsive');

      if (images.length) {
        var holder, clearHolder;

        // 'Invisible' holder into which the replacement images can be loaded.
        holder= $('<div id="flickr-image-holder"/>').css({'height': '1px', 'width': '1px'}).fadeTo(1, 0.1).appendTo('body');
        /**
         * Clears the cache image holder if it is empty.
         */
        clearHolder = function() {
          if (holder.find('img').length === 0) {
            holder.remove();
          }
        };

        // Go through each responsive image and swap it out with the appropriate image.
        images.each(function () {
          var content_img = $(this), // Re-scope this.
              src = content_img.attr('src'),
              new_src = submodule._imageSrc(src), // URL of the replacement image.
              cache_img; // Cache image we will use to load the new image.
          if (src === new_src) {
            // Nothing doing.
            return src;
          }
          cache_img = $('<img src="' + new_src + '" alt="" height="1" width="1">');
          holder.append(cache_img); // Inject the new image into the DOM and get the browser to load it.
          // We need to load the image to prevent a big jump as the old src is switched out for a src that hasn't been loaded.
          cache_img.on('load', function() {
            // Once the image has loaded in the hidden version we replace the original image as it should be in the browser cache.
            content_img.attr('src', new_src);
            cache_img.remove(); // Don't need the cache image anymore.
            clearHolder();
          });
        });
        clearHolder(); // Clean up if there were no images to insert.
      }
    };

    /**
     * Work out the flickr suffix for this environment and run the replacement.
     *
     * Accepts arguments for testing.
     *
     * @param width {Number} Width of environment to take account of.
     * @param height {Number} Height of environment to take account of.
     * @param pixel_density {Number} Pixel density of display.
     * @param speed {String} Connection speed [fast|slow].
     */
    submodule.init = function (width, height, pixel_density, speed) {
      var window_width;

      speed = 'fast'; // Hard coded override for now.

      if (!submodule._flickr_suffix_set) {
        // This has already been run so don't do it again.

        width = width || $(window).width();
        height = height || $(window).height();
        pixel_density = pixel_density || getInt(window.devicePixelRatio) || 1;

        window_width = Math.max(width, height); // Take max to allow for orientation change.
        window_width = window_width * pixel_density; // Take account of a better screen resolution.
        window_width = getInt(window_width);
        if (speed !== 'fast') {
          speed = 'slow';
        }

        // This sorts out the flickr naming convention based on image width.
        if (window_width < 280 || speed === 'slow') {
          submodule._flickr_suffix = '_m';
        } else if (window_width < 320) {
          submodule._flickr_suffix = '_n';
        } else if (window_width < 500) {
          submodule._flickr_suffix = '';
        } else if (window_width < 640) {
          submodule._flickr_suffix = '_z';
        } else if (window_width < 800) {
          submodule._flickr_suffix = '_c';
        } else {
          submodule._flickr_suffix = '_b';
        }
        if (typeof module.PROFILE.profile === 'object') {
          // Store this in the profile.
          module.PROFILE.profile.flickr_suffix = submodule._flickr_suffix;
        }
        if (typeof module.COOKIES !== 'undefined') {
          // Set a cookie so we can do some of this work on the server.
          module.COOKIES.setItem('flickr_suffix', submodule._flickr_suffix, null, '/');
        }
        submodule._flickr_suffix_set = true;
      }
      responsiveImages();
    };

    module.register(submodule.init);

    return submodule;
  }(module, module.FLICKR || {}, $));

  return module;
}(window.DECADE_CITY || {}, window.jQuery));
