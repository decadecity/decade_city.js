window.DECADE_CITY = (function (module, $) {
  "use strict";  module.POLYFILL = (function (module, $) {
    var submodule = {};

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
            if(error.name.toLowerCase() === 'quota_exceeded_err'){
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
