/**
 * Responsive image replacement.
 */
define(['core', 'speedTest', 'profile', 'cookies'], function(module, speedTest, profile, cookies) {

  "use strict";

  var submodule = {};

    var image_replace,
        aws_url,
        getInt,
        responsiveImages,
        imageSrc,
        svgReplace,
        svgSrc,
        init,
        suffix = '_m', // Default to suffix of smallest image.
        suffix_set = false,  //Has the suffix been set? {Boolean}
        s3_bucket = module.config.s3_bucket || 'decadecity';

    aws_url = '//s3-eu-west-1.amazonaws.com/' + s3_bucket + '/images/';
    image_replace = new RegExp('^' + aws_url + '([^_.]*).*\\.(.*)$'); // Regex to break up an image URL.

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
     * Replaces an image URL with the suffix set for the environment.
     *
     * @param src {String} image URL.
     *
     * @return {String} Image with suffix set.
     */
    imageSrc = function (src) {
      var match, secure;
      src = src.replace(/^http(s)?:/, '');
      src = src.replace('file:', '');
      match = image_replace.exec(src);
      if (!match) {
        return src;
      }
      return aws_url + match[1] + suffix + '.' + match[2];
    };

    /**
     * Sets the SVG url of an image.
     */
    svgSrc = function(src) {
      return src.replace(/\.[^.\?]*($|\?)/, '.svg$1');
    };

    /**
     * Replaces the source of imges with a class of .svg-replace with an SVG.
     */
    svgReplace = function () {
      if (profile.svg) {
        var images = document.querySelectorAll('.svg-replace');
        for (var i = 0; i < images.length; i += 1) {
          var image = images[i];
          image.src = svgSrc(image.src);
          image.classList.remove('svg-replace');
        }
      }
    };

    /**
     * Replaces any image with a class of .responsive with the appropriate size image for the environment.
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
        Array.prototype.forEach.call(images, function(content_img) {
          var src = content_img.src,
              new_src = imageSrc(src), // URL of the replacement image.
              cache_img; // Cache image we will use to load the new image.
          if (src === new_src) {
            // Nothing doing.
            return src;
          }
          cache_img = document.createElement('img');

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
          cache_img.src = new_src;
          holder.appendChild(cache_img); // Inject the new image into the DOM and get the browser to load it.
        });
        clearHolder(); // Clean up if there were no images to insert.
      }
    };

    /**
     * Work out the suffix for this environment and run the replacement.
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

      speedTest.test();
      if (typeof profile.load_speed !== 'undefined' && typeof speed === 'undefined') {
        speed = profile.load_speed;
      }

      if (!suffix_set) {
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
          suffix = '_m';
        } else if (window_width < 320) {
          suffix = '_n';
        } else if (window_width < 500) {
          suffix = '';
        } else if (window_width < 640) {
          suffix = '_z';
        } else if (window_width < 800) {
          suffix = '_c';
        } else {
          suffix = '_b';
        }
        if (typeof profile === 'object') {
          // Store this in the profile.
          profile.image_suffix = suffix;
        }
        cookies.setItem('image_suffix', suffix, null, '/');
        suffix_set = true;
      }
      responsiveImages();
      svgReplace();
    };

    module.register(init);
    module.register(function () {
      if (true) {
        // Open up some internal items for debugging.
        submodule.init = init;
        submodule.imageSrc = imageSrc;
        submodule.responsiveImages = responsiveImages;
        submodule.suffix = function (value) { if (typeof value !== 'undefined') { suffix = value; } else { return suffix; }};
        submodule.suffix_set = function (value) { if (typeof value !== 'undefined') { suffix_set = !!(value); } else { return suffix_set; }};
        submodule.svgSrc = svgSrc;
        submodule.svgReplace = svgReplace;
      }
    });

    return submodule;

});
