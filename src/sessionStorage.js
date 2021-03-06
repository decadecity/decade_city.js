/**
 * Facade for sessionStorage API.
 *
 * This is to allow us to use it without handling detection/errors each time.
 * See: http://dev.w3.org/html5/webstorage/#storage
 *
 * @returns {Object} API for accessing local storage.
 */
define(function(require, exports, module) {
  "use strict";

  var config = require('config');

  var supported = typeof window.sessionStorage !== 'undefined';

  module.exports = {};

  /**
   * Number of items in local storage.
   *
   * This breaks the API by being a function - not an attribute.
   *
   * @returns {Number} Number of items in storage.
   */
  // Due to lack of support for getters this is a function which breaks the full API interface wrapper. *sigh*
  module.exports.getLength = function() {
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
  module.exports.key = function (index) {
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
  module.exports.getItem = function (key) {
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
  module.exports.setItem = function (key, value) {
    if (!supported) {
      return;
    } else {
      // Wraper for exception if setting fails - in this case we don't care.
      try {
        return window.sessionStorage.setItem(key, value);
      } catch (error) {
        /* istanbul ignore next */
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
  module.exports.removeItem = function (key) {
    if (!supported) {
      return;
    } else {
      return window.sessionStorage.removeItem(key);
    }
  };

  /**
   * Clears all items from storage.
   */
  module.exports.clear = function () {
    if (!supported) {
      return;
    } else {
      return window.sessionStorage.clear();
    }
  };
  module.exports.supported = supported; // Publicly expose support status.

  /* istanbul ignore next */
  if (config.debug) {
    module.exports.setSupported = function(value) {
      supported = !!value;
    };
  }

});
