/* jshint qunit:true */
/*
  ======== A Handy Little QUnit Reference ========
  http://docs.jquery.com/QUnit

  Test methods:
    expect(numAssertions)
    stop(increment)
    start(decrement)
  Test assertions:
    ok(value, [message])
    equal(actual, expected, [message])
    notEqual(actual, expected, [message])
    deepEqual(actual, expected, [message])
    notDeepEqual(actual, expected, [message])
    strictEqual(actual, expected, [message])
    notStrictEqual(actual, expected, [message])
    raises(block, [expected], [message])
*/

define(['timing'], function(timing) {

  return {
    runTests: function() {

      module('Timing');

      test('Seconds to milliseconds', function () {
        strictEqual(timing.s2ms(1), 1000, 'Integer');
        strictEqual(timing.s2ms(1.234), 1234, 'Float');
        strictEqual(timing.s2ms(1.2345), 1235, 'Rounded float');
        strictEqual(timing.s2ms('1.234'), 1234, 'String');
      });

      test('Interface', function() {
        strictEqual(typeof timing.load, 'function', 'load is a function');
      });

      timing.ready();

      if (!timing.timing) {
        sessionStorage.setItem('t_navigation_start', new Date().getTime());
      }

      // The load test has a delay on it so give it a change to complete.
      var loadTest = function () {
        window.setTimeout(function () {
          var vars = timing.getVars();
          ok(vars.hasOwnProperty('b_height'), '`b_height` set.');
          ok(vars.hasOwnProperty('b_width'), '`b_width` set.');
          ok(vars.hasOwnProperty('t_firstpaint'), '`t_firstpaint` set.');
          ok(vars.hasOwnProperty('noscript'), '`noscript` set.');
          ok(vars.hasOwnProperty('r'), '`r` set.');
          ok(vars.hasOwnProperty('t_body'), '`t_body` set.');
          ok(vars.hasOwnProperty('t_css'), '`t_css` set.');
          ok(vars.hasOwnProperty('t_domready'), '`t_domready` set.');
          //ok(vars.hasOwnProperty('t_done'), '`t_done` set.');
          ok(vars.hasOwnProperty('t_head'), '`t_head` set.');
          ok(vars.hasOwnProperty('t_js'), '`t_js` set.');
          ok(vars.hasOwnProperty('t_onload'), '`t_onload` set.');
          ok(vars.hasOwnProperty('u'), '`u` set.');
          start();
        }, 1000);
      };

      asyncTest('Timing functionality', function () {
        timing.load();
        loadTest();
      });
    }
  };
});
