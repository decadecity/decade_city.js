window.DECADE_CITY = (function (module) {
  "use strict";

  /**
   * Responsive flickr image replacement.
   */
  module.FLICKR = (function (module, submodule) {
    var image_replace = /^http(s)?:\/\/(.*)\.staticflickr.com\/(.*?)(_.\.jpg|\.jpg)$/, // Regex to break up a flickr image URL.
        getInt,
        responsiveImages,
        imageSrc,
        init,
        flickr_suffix = '_m', // Default to suffix of smallest image.
        flickr_suffix_set = false;  //Has the flickr suffix been set? {Boolean}

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
     * Replaces a flickr image URL with the suffix set for the environment.
     *
     * @param src {String} Flickr image URL.
     *
     * @return {String} Image with flickr suffix set.
     */
    imageSrc = function (src) {
      var match, secure;
      match = image_replace.exec(src);
      if (!match) {
        return src;
      }
      secure = match[1] || '';
      return 'http' + secure + '://' + match[2] + '.staticflickr.com/' + match[3] + flickr_suffix + '.jpg';
    };

    /**
     * Replaces any flickr image with a class of .responsive with the appropriate size image for the environment.
     */
    responsiveImages = function () {
      var images = document.querySelectorAll('img.responsive');

      if (images.length) {
        var holder, clearHolder;

        // 'Invisible' holder into which the replacement images can be loaded.
        holder = document.createElement('div');
        /**
         * Clears the cache image holder if it is empty.
         */
        clearHolder = function() {
          if (holder.querySelectorAll('img').length === 0) {
            if (holder.parentElement) {
              holder.parentElement.removeChild(holder);
            }
          }
        };

        // Go through each responsive image and swap it out with the appropriate image.
        for (var i = 0; i < images.length; i += 1) {
          var content_img = images[i],
              src = content_img.src,
              new_src = imageSrc(src), // URL of the replacement image.
              cache_img; // Cache image we will use to load the new image.
          if (src === new_src) {
            // Nothing doing.
            return src;
          }
          cache_img = document.createElement('img');
          cache_img.src = new_src;
          holder.appendChild(cache_img); // Inject the new image into the DOM and get the browser to load it.

          var imageLoadedHandler = function(e) {
            // Once the image has loaded in the hidden version we replace the original image as it should be in the browser cache.
            content_img.src = new_src;
            if (cache_img.parentElement) {
              cache_img.removeEventListener('load', imageLoadedHandler); // Not sure this is correct?
              cache_img.parentElement.removeChild(cache_img); // Don't need the cache image anymore.
            }
            clearHolder();
          };

          // We need to load the image to prevent a big jump as the old src is switched out for a src that hasn't been loaded.
          cache_img.addEventListener('load', imageLoadedHandler);
        }
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
    init = function (width, height, pixel_density, speed) {
      var window_width;

      module.SPEED_TEST.test();
      if (typeof module.load_speed !== 'undefined' && typeof speed === 'undefined') {
        speed = module.load_speed;
      }

      if (!flickr_suffix_set) {
        // This has already been run so don't do it again.

        width = width || window.document.documentElement['clientWidth'];
        height = height || window.document.documentElement['clientHeight'];
        pixel_density = pixel_density || getInt(window.devicePixelRatio) || 1;

        window_width = Math.max(width, height); // Take max to allow for orientation change.
        window_width = window_width * pixel_density; // Take account of a better screen resolution.
        window_width = getInt(window_width);
        if (speed !== 'fast') {
          speed = 'slow';
        }

        // This sorts out the flickr naming convention based on image width.
        if (window_width < 280 || speed === 'slow') {
          flickr_suffix = '_m';
        } else if (window_width < 320) {
          flickr_suffix = '_n';
        } else if (window_width < 500) {
          flickr_suffix = '';
        } else if (window_width < 640) {
          flickr_suffix = '_z';
        } else if (window_width < 800) {
          flickr_suffix = '_c';
        } else {
          flickr_suffix = '_b';
        }
        if (typeof module.PROFILE.profile === 'object') {
          // Store this in the profile.
          module.PROFILE.profile.flickr_suffix = flickr_suffix;
        }
        if (typeof module.COOKIES !== 'undefined') {
          // Set a cookie so we can do some of this work on the server.
          module.COOKIES.setItem('flickr_suffix', flickr_suffix, null, '/');
        }
        flickr_suffix_set = true;
      }
      responsiveImages();
    };

    module.register(init);
    module.register(function () {
      if (module.config.debug) {
        // Open up some internal items for debugging.
        submodule.init = init;
        submodule.imageSrc = imageSrc;
        submodule.responsiveImages = responsiveImages;
        submodule.flickr_suffix = function (value) { if (typeof value !== 'undefined') { flickr_suffix = value; } else { return flickr_suffix; }};
        submodule.flickr_suffix_set = function (value) { if (typeof value !== 'undefined') { flickr_suffix_set = !!(value); } else { return flickr_suffix_set; }};
      }
    });

    return submodule;
  }(module, module.FLICKR || {}));

  return module;
}(window.DECADE_CITY || {}));
