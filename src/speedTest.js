define(['core', 'sessionStorage', 'profile'], function(module, sessionStorage, profile) {
  "use strict";

      // Have we run the test yet?
  var tested = false,
      // Object to return
      submodule = {};

  profile.load_speed = 'slow';
  profile.connection_type ='unknown';

  /**
   * Normalise the connection API.
   *
   * @param {Object} connection Connection API to normalise.
   *
   * @returns {Object} Result with `connection_type` and optionally an override for `load_speed`.
   */
  var connectionTest = function (connection) {
    var result = {
      'connection_type': 'unknown'
    };
    switch (connection.type) {
      // If it's cellular we override and declare a slow load.
      case connection.CELL_2G:
      case connection.CELL_3G:
      case 'cellular':
        result.load_speed = 'slow';
        result.connection_type = 'cellular';
        break;
      // For all others we don't assume fast, we leave it to the calculation.
      case connection.WIFI:
      case 'wifi':
        result.connection_type = 'wifi';
        break;
      case connection.ETHERNET:
      case 'ethernet':
        result.connection_type = 'ethernet';
        break;
      case 'bluetooth':
        result.connection_type = 'bluetooth';
        break;
      case 'other':
        result.connection_type = 'other';
        break;
      case 'none':
        result.connection_type = 'none';
        break;
    }
    return result;
  };

  /**
   * Calculate the load speed based on our parameters.
   *
   * @param {Integer} timer Number of ms it took to get to DOM ready.
   * @param {Integer} loads Number of page loads we have measured.
   * @param {String} stored Previously stored value for the speed.
   *
   * @returns {String} Load speed - either `fast` or `slow`.
   */
  var calculateLoadSpeed = function(timer, loads, stored) {
        // Number of seconds above which we count it as a slow load.
    var load_speed_timout = 2.5,
        // After this many loads with no fast load we assume a slow connection.
        load_speed_count =  4;

    if (stored === 'fast') {
      // We have seen a fast load in the past so stay with it.
      return 'fast';
    }
    if (loads <= load_speed_count && timer < load_speed_timout * 1000) {
      // We are still within the load count and it's within our threshold.
      return 'fast';
    }
    // Default to slow.
    return 'slow';
  };

  var test = function () {

        // This is the number of ms we think it took the page to get ready.
    var timer = 0,
        // Is the timing API available?
        timing = !!(typeof window.performance !== 'undefined' && typeof window.performance.timing !== 'undefined'),
        // Connection API.
        connection = navigator.connection || { 'type': 'unknown' },
        // Number of times we have loaded.
        loads = 0,
        // Stored load speed - default to slow.
        stored = 'slow';

    if (tested) {
      // This has already been run so don't run again.
      return;
    }

    if (!window.t_domready) {
      // Set the DOM timer - assume that DOM is ready if we're running this code.
      window.t_domready = new Date();
    }

    // See if we can get the number of loads we've done.
    loads = parseInt(sessionStorage.getItem('load-count'), 10);
    if (isNaN(loads)) {
      loads = 0;
    }
    // Set the number of loads we've done.
    sessionStorage.setItem('load-count', loads + 1);

    // See if we have a stored load speed.
    stored = sessionStorage.getItem('load-speed') || 'slow';

    // Get the time taken for the page to get ready.
    if (timing) {
      // We have the performance timing API so use it.
      timer = window.performance.timing.domInteractive - window.performance.timing.requestStart;
    } else if (window.t_pagestart && window.t_domready) {
      // Fall back on the in page timers.
      // Measured average overhead of a request is 500ms (https://decadecity.net/blog/2012/09/15/how-long-does-an-http-request-take).
      timer = window.t_domready - window.t_pagestart + 500;
    }

    // Set the values based on our environment.
    profile.load_speed = calculateLoadSpeed(timer, loads, stored);

    var connection_result = connectionTest(connection);
    profile.load_speed = connection_result.load_speed || profile.load_speed;
    profile.connection_type = connection_result.connection_type;

    // Normalise.
    if (profile.load_speed !== 'fast') {
      profile.load_speed = 'slow';
    }

    // Set a CSS hook - will be either 'slow' or 'fast'.
    document.querySelector('html').classList.add(profile.load_speed);

    // Store the speed for future use over multiple loads.
    sessionStorage.setItem('load-speed', profile.load_speed);

    tested = true;
  };

  module.register(test);

  submodule._connectionTest = connectionTest;
  submodule._calculateLoadSpeed = calculateLoadSpeed;
  submodule.test = test;
  return submodule;
});
