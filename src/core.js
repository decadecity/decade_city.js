/**
 * Defines some event registries.
 */
define(function() {
  "use strict";

  var module = {},
      resistry = [], // List of functions to be run.
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

  //TODO - fix config.
  // Make sure we have a config object if one hasn't been defined.
  if (typeof module.config !== 'object') {
    module.config = {};
  }

  /**
   * Runs all functions in the init registry.
   */
  module.init = function (config) {
    if (is_initialised) {
      return;
    }
    for (var prop in config) {
      if(config.hasOwnProperty(prop)) {
        module.config[prop] = config[prop];
      }
    }
    resistry.forEach(function(funct) {
      funct.call();
    });
    is_initialised = true;
  };

  if ( document.readyState !== 'loading' ) {
    // DOMContentLoaded has already fired.
    module.init();
  } else {
    document.addEventListener('DOMContentLoaded', module.init, false);
  }

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

  module.initLoad = function() {
    load_registry.forEach(function(funct) {
      funct.call();
    });
    is_loaded = true;
  };

  /**
   * Handles running registered functions on load.
   */
  if (document.readyState === 'complete') {
    // window.onload has already fired.
    module.initLoad();
  } else {
    window.addEventListener('load', function() {
      module.initLoad();
    });
  }


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
    window.addEventListener('resize', function () {
      var delay = 250;
      if (resize_timer) {
        resize_timer = window.clearTimeout(resize_timer);
      }
      resize_timer = window.setTimeout(function () {
        resize_registry.forEach(function(funct) {
          funct.call();
        });
      }, delay);
    }, false);
  };

  module.register(resizeHander);

  return module;

});
