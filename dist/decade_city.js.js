/*! decade_city.js - v0.2.0 - 2013-04-22
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

  module.config = {};
  /**
   * Runs all functions in the init registry.
   */
  module.init = function (config) {
    $.extend(module.config, config);
    $.each(resistry, function(i, funct) {
      funct.call();
    });
    is_initialised = true;
  };

  var load_registry = [], // Functions to be run on resize.
      is_loaded = false; // Has window.onload already run?
  /**
   * Registers a function to be run on load.
   *
   * @param funct {Function} Function to be run when the document is loaded.
   */
   module.registerLoad = function (funct) {
    if (typeof funct === 'function') {
      if (is_loaded) {
        funct.call();
      } else {
        load_registry.push(funct);
      }
    }
  };

  /**
   * Handles running registered functions on load.
   */
  $(window).load(function() {
    $.each(load_registry, function(i, funct) {
      funct.call();
    });
    is_loaded = true;
  });


  var resize_registry = []; // Functions to be run on resize.
  /**
   * Registers a function to be run on re-size.
   *
   * @param funct {Function} Function to be run when window is resized.
   */
   module.registerResize = function (funct) {
    if (typeof funct === 'function') {
      resize_registry.push(funct);
    }
  };


  /**
   * Handles running registered functions on the resize event.
   *
   * Adds a delay to prevent them constantly firing whilst being resized.
   */
  var resizeHander = function() {
    var resize_timer; // Used to set a delay on the resize callback.
    $(window).resize(function () {
      var delay = 250;
      if (resize_timer) {
        resize_timer = window.clearTimeout(resize_timer);
      }
      resize_timer = window.setTimeout(function () {
        $.each(resize_registry, function(i, funct) {
          funct.call();
        });
      }, delay);
    });
  };

  module.register(resizeHander);

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

window.DECADE_CITY = (function (module, $) {
  "use strict";  module.POLYFILL = (function (module, submodule, $) {

    /**
    * Outer HTML polyfill for browsers that don't support it.
    * @extends jQuery
    *
    * @returns {String} Full HTML for element including the element itself.
    */
    $.fn.outerHTML = function () {
      var content;
      if (!$(this).length) {
        return '';
      }
      if ('outerHTML' in $(this)[0]) {
        return $(this)[0].outerHTML;
      } else {
        content = $(this).wrap('<div></div>').parent().html();
        $(this).unwrap();
        return content;
      }
    };

    /**
     * Facade for sessionStorage API.
     *
     * This is to allow us to use it without handling detection/errors each time.
     * See: http://dev.w3.org/html5/webstorage/#storage
     *
     * @returns {Object} API for accessing local storage.
     */
    submodule.sessionStorage = (function () {
      var supported = typeof window.sessionStorage !== 'undefined',
          that = {};
      /**
       * Number of items in local storage.
       *
       * This breaks the API by being a function - not an attribute.
       *
       * @returns {Number} Number of items in storage.
       */
      // Due to lack of support for getters this is a function which breaks the full API interface wrapper. *sigh*
      that.getLength = function() {
        if (!supported) {
          return 0;
        } else {
          return window.sessionStorage.length;
        }
      };
      /**
       * Returns an item from the storage by index.
       *
       * @param {Number} index Index number of item in storage
       *
       * @returns Item from storage or null if not present.
       */
      that.key = function (index) {
        if (!supported) {
          return null;
        } else {
          return window.sessionStorage.key(index);
        }
      };
      /**
       * Gets an item from storage by key.
       *
       * @param {String} key Key of item in storage.
       *
       * @return Item from storage or null if not present.
       */
      that.getItem = function (key) {
        if (!supported) {
          return null;
        } else {
          return window.sessionStorage.getItem(key);
        }
      };
      /**
       * Stores an item in storage.
       *
       * @param {String} key Key of item in storage.
       * @param value Item to store.
       */
      that.setItem = function (key, value) {
        if (!supported) {
          return;
        } else {
          // Wraper for exception if setting fails - in this case we don't care.
          try {
            return window.sessionStorage.setItem(key, value);
          } catch (error) {
            if (error.name.toLowerCase() === 'quota_exceeded_err'){
              return;
            } else {
              throw error;
            }
          }
        }
      };
      /**
       * Removes an item from storage.
       *
       * @param {String} key Key of item in storage.
       */
      that.removeItem = function (key) {
        if (!supported) {
          return;
        } else {
          return window.sessionStorage.removeItem(key);
        }
      };
      /**
       * Clears all items from storage.
       */
      that.clear = function () {
        if (!supported) {
          return;
        } else {
          return window.sessionStorage.clear();
        }
      };
      return that;
    }());

    return submodule;

  }(module, module.POLYFILL || {}, $));

  return module;
}(window.DECADE_CITY || {}, window.jQuery));

window.DECADE_CITY = (function (module, $) {
  "use strict";
  module.SPEED_TEST = (function (module, submodule, $) {

    var init = function () {
      var load_speed_timout = 2.5, // Number of seconds above which we count it as a slow load.
          load_speed_count =  4, // After this many loads with no fast load we assume a slow connection.
          timer = 0, // This is the number of ms we think it took the page to load.
          timing = !!(typeof window.performance !== 'undefined' && typeof window.performance.timing !== 'undefined'),
          storage = !!(typeof module.POLYFILL !== 'undefined' && typeof module.POLYFILL.sessionStorage !== 'undefined'),
          connection = navigator.connection || { 'type': 0 },
          loads; // Number of times we have loaded.


      module.load_speed = 'slow'; // Default to slow.

      window.t_dom_ready = new Date(); // Set the DOM timer.

      if (storage) {
        loads = parseInt(module.POLYFILL.sessionStorage.getItem('load-count'), 10);
        module.POLYFILL.sessionStorage.setItem('load-count', loads + 1);
      }
      if (isNaN(loads)) {
        loads = 0;
      }

      load_speed_timout = load_speed_timout * 1000; // Now working in ms for ease of comparison.

      if (timing) {
        // We have the performance timing API so use it.
        timer = window.performance.timing.domInteractive - window.performance.timing.requestStart;
      } else if (window.t_head && window.t_dom_ready) {
        // Fall back on the in page timers.
        timer = window.t_dom_ready - window.t_head + 500;  // Measured average overhead of a request is 500ms (see ).
      }
      if (storage && module.POLYFILL.sessionStorage.getLength()) {
        // If we have something in session storage then try and do this over a number of loads.
        module.load_speed = module.POLYFILL.sessionStorage.getItem('load-speed') || 'slow';
        if (module.load_speed !== 'fast' && loads < load_speed_count && timer < load_speed_timout) {
          // We haven't seen a fast load up to now but this one is.
          module.load_speed = 'fast';
        }
      } else if (timer < load_speed_timout) {
        // We don't have anything in session storage so it's first load or on a page-by-page basis.
        module.load_speed = 'fast';
      }
      switch (connection.type) {
        // If we actually know the connection type then override.
        case connection.CELL_2G:
          module.load_speed = 'slow';
          module.connection_type = '2g';
          break;
        case connection.CELL_3G:
          module.load_speed = 'slow';
          module.connection_type = '3g';
          break;
        case connection.WIFI:
          module.connection_type = 'wifi';
          break;
        case connection.ETHERNET:
          module.connection_type = 'wired';
          break;
        default:
          module.connection_type = 'unknown';
      }
      if (module.load_speed !== 'fast') {
        module.load_speed = 'slow';
      }
      $('html').addClass(module.load_speed); // Set a CSS hook - will be either 'slow' or 'fast'.
      if (storage) {
        module.POLYFILL.sessionStorage.setItem('load-speed', module.load_speed); // Store the speed for future use over multiple loads.
      }
    };
    module.register(init);

    return submodule;

  }(module, module.SPEED_TEST || {}, $));

  return module;
}(window.DECADE_CITY || {}, window.jQuery));

window.DECADE_CITY = (function (module, $) {
  "use strict";
  module.TIMING = (function (module, submodule, $) {
    var vars = {},
        url,
        timing = !!(typeof window.performance !== "undefined" && typeof window.performance.timing !== "undefined");

    /**
     * Adds a variable to the internal register.
     *
     * @param name {String} Name of variable to add.
     * @param value {String} Value of variable.
     */
    submodule.addVar = function (name, value) {
      if (typeof name === "string") {
        vars[name] = value;
      }
      else if (typeof name === "object") {
        var data = name,
            key;
        for (key in data) {
          if (data.hasOwnProperty(key)) {
            vars[key] = data[key];
          }
        }
      }
    };

    // Add some information we know at this stage.
    submodule.addVar({
      'b_height': $(window).height(),
      'b_width': $(window).width(),
      'noscript': 0,
      'r': document.referrer,
      'u': window.location.href
    });

    /**
     * Sends the tracking data.
     */
    var sendBeacon = function () {
      var params = [],
          seperator = '?',
          key, img;
      if (vars && url) {
        if (url.search(/\?/) > -1) {
          // There's already a '?' in the URL so we need to add params.
          seperator = '&';
        }
        for (key in vars) {
          if (vars.hasOwnProperty(key)) {
            params.push(key + '=' + encodeURIComponent(vars[key]));
          }
        }
        img = new Image();
        img.src = url + seperator + params.join('&');
      }
    };

    /**
     * Initialise submodule and set vars known at DOMReady.
     */
    var init = function () {
      var t_done;
      if (module.config.hasOwnProperty('beacon_url')) {
        url = module.config.beacon_url;
      }
      if (module.config.debug) {
        // If we're in debug mode then we expose the vars for testing.
        submodule.getVars = function () {
          return vars;
        };
      }
      if (!timing) {
        // Need to use storage to get the navigation start time.
        if (typeof module.COOKIES !== 'undefined') {
          $(window).on('unload', function () {
            module.COOKIES.setItem('t_navigation_start', (new Date()).getTime(), false, '/');
          });
        }
      }
      if (timing) {
        // Override any in-page timer.
        window.t_pagestart = window.performance.timing.responseEnd;
      }
      if (!window.t_domready) {
        // We need to set a DOMReady timer.
        $(document).ready(function () {
          if (timing) {
            window.t_domready = window.performance.timing.domInteractive;
          } else {
            window.t_domready = new Date().getTime();
          }
        });
      }
    };
    module.register(init);

    /**
     * Final timing values and send beacon.
     */
    var main = function() {
      var t_onload = window.t_onload || new Date(),
          t_navigation_start,
          t_done,
          onload;

      // Collect the remaining timing data.
      if (timing) {
        t_onload = window.performance.timing.loadEventStart;
        t_done = window.performance.timing.domInteractive - window.performance.timing.navigationStart;
        onload = t_onload - window.t_pagestart;
      } else {
        // Pull the navigation start from storage if we have it.
        if (typeof module.COOKIES !== 'undefined') {
          t_navigation_start = module.COOKIES.getItem('t_navigation_start');
          if (t_navigation_start) {
            t_done = window.t_domready - t_navigation_start;
          }
        }
        if (window.t_pagestart) {
          onload = t_onload - window.t_pagestart;
        }
      }

      // Now we have the data we set the variables.
      if (window.t_pagestart && window.t_domready) {
        submodule.addVar('t_domready', window.t_domready - window.t_pagestart);
        if (window.t_headend) {
          submodule.addVar('t_head', window.t_headend - window.t_pagestart);
          if (window.t_bodyend) {
            submodule.addVar('t_body', window.t_bodyend - window.t_headend);
          }
        }
      }
      if (t_done) {
        submodule.addVar('t_done', t_done);
      }
      if (onload) {
        submodule.addVar('t_onload', onload);
      }
      if (window.t_jsstart && window.t_jsend) {
        submodule.addVar('t_js', window.t_jsend - window.t_jsstart);
      }

      // Finally, send the data after a delay.
      window.setTimeout(sendBeacon, 500);
    };
    module.registerLoad(function() {
      // Need onload to have had a chance to finish to get timings.
      window.t_onload = new Date();
      window.setTimeout(main, 500);
    });

    return submodule;
  }(module, module.TIMING || {}, $));

  return module;
}(window.DECADE_CITY || {}, window.jQuery));

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

    // Connection information
    if (typeof module.load_speed !== 'undefined') {
      submodule.profile.load_speed = module.load_speed;
    }
    if (typeof module.connection_type !== 'undefined') {
      submodule.profile.connection_type = module.connection_type;
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

      speed = speed || 'slow'; // Hard coded override for now.

      if (typeof module.SPEED_TEST === 'object' && typeof module.SPEED_TEST.load_speed !== 'undefined') {
        speed = module.SPEED_TEST.load_speed;
      }

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
