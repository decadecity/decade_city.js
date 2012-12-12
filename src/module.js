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
