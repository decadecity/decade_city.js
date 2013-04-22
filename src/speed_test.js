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

      if (!window.t_domready) {
        window.t_domready = new Date(); // Set the DOM timer.
      }

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
      } else if (window.t_pagestart && window.t_domready) {
        // Fall back on the in page timers.
        timer = window.t_domready - window.t_pagestart + 500;  // Measured average overhead of a request is 500ms (see http://decadecity.net/blog/2012/09/15/how-long-does-an-http-request-take).
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
