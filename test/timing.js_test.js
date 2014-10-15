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

define(['timing', 'sessionStorage'], function(timing) {

  return {
    runTests: function() {

      module('Timing');

      if (!timing.timing) {
        sessionStorage.setItem('t_navigation_start', new Date().getTime());
      }

      var loadTest = function () {
        window.setTimeout(function () {
          var vars = timing.getVars();
          ok(vars.hasOwnProperty('b_height'), '`b_height` set.');
          ok(vars.hasOwnProperty('b_width'), '`b_width` set.');
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
        if (document.readyState === 'complete') {
          // window.onload has already fired.
          loadTest();
        } else {
          window.addEventListener('load', function() {
            loadTest();
          });
        }
      });
    }
  };
});
