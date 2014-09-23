/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

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

define(['core'], function(core) {

  return {
    runTests: function() {

      module('Core');

      core.init();
      test('Register runs immediately when initialised', function () {
        core.register(function() { window._register_test = 'registered'; });
        equal(window._register_test, 'registered', 'Function immediately invoked');
      });

      core.initLoad();
      test('Register runs immediately when loaded', function () {
        core.registerLoad(function() { window._register_load_test = 'registered'; });
        equal(window._register_load_test, 'registered', 'Function immediately invoked');
      });

      asyncTest('Resize function runs when resisze triggered', function () {
        window._register_resize_test = 'unregistered';
        core.registerResize(function() { window._register_resize_test = 'registered'; });

        // This isn't using new CustomEvent('resize') due to a webkit bug in phantom.
        // https://github.com/ariya/phantomjs/issues/11289
        if (window.CustomEvent) {
          window.dispatchEvent(new window.CustomEvent('resize'));
        } else {
          var evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
          evt.initCustomEvent('resize', false, false, null);
          window.dispatchEvent(evt);
        }

        equal(window._register_resize_test, 'unregistered', 'Function not immediately invoked');
        window.setTimeout(function() {
          equal(window._register_resize_test, 'registered', 'Function invoked after delay');
          start();
        }, 500);
      });


    }
  };

});


