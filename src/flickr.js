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
