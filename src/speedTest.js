define(['core', 'sessionStorage', 'profile'], function(module, sessionStorage, profile) {
  "use strict";

    var tested = false,
        submodule = {};

    submodule.test = function () {
      var load_speed_timout = 2.5, // Number of seconds above which we count it as a slow load.
          load_speed_count =  4, // After this many loads with no fast load we assume a slow connection.
          timer = 0, // This is the number of ms we think it took the page to load.
          timing = !!(typeof window.performance !== 'undefined' && typeof window.performance.timing !== 'undefined'),
          storage = (sessionStorage !== 'undefined'),
          connection = navigator.connection || { 'type': 0 },
          loads; // Number of times we have loaded.

      if (tested) {
        return;
      }

      profile.load_speed = 'slow'; // Default to slow.

      if (!window.t_domready) {
        window.t_domready = new Date(); // Set the DOM timer - assume that DOM is ready if we're running this code.
      }

      if (storage) {
        loads = parseInt(sessionStorage.getItem('load-count'), 10);
        if (isNaN(loads)) {
          loads = 0;
        }
        sessionStorage.setItem('load-count', loads + 1);
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
      if (storage && sessionStorage.getLength()) {
        // If we have something in session storage then try and do this over a number of loads.
        profile.load_speed = sessionStorage.getItem('load-speed') || 'slow';
        if (profile.load_speed !== 'fast' && loads < load_speed_count && timer < load_speed_timout) {
          // We haven't seen a fast load up to now but this one is.
          profile.load_speed = 'fast';
        }
      } else if (timer < load_speed_timout) {
        // We don't have anything in session storage so it's first load or on a page-by-page basis.
        profile.load_speed = 'fast';
      }
      switch (connection.type) {
        // If we actually know the connection type then override.
        case connection.CELL_2G:
          profile.load_speed = 'slow';
          profile.connection_type = '2g';
          break;
        case connection.CELL_3G:
          profile.load_speed = 'slow';
          profile.connection_type = '3g';
          break;
        case connection.WIFI:
          profile.connection_type = 'wifi';
          break;
        case connection.ETHERNET:
          profile.connection_type = 'wired';
          break;
        default:
          profile.connection_type = 'unknown';
      }
      if (profile.load_speed !== 'fast') {
        profile.load_speed = 'slow';
      }
      document.querySelector('html').classList.add(profile.load_speed); // Set a CSS hook - will be either 'slow' or 'fast'.
      if (storage) {
        sessionStorage.setItem('load-speed', profile.load_speed); // Store the speed for future use over multiple loads.
      }
      tested = true;
    };

    module.register(submodule.test);
    return submodule;
});
