/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

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

  module('Speed test');

  test('SPEED_TEST submodule defined', function () {
    ok(typeof window.DECADE_CITY.SPEED_TEST === 'object', 'submodule defined.');
  });

  test('Load speed', function () {
    ok(typeof window.DECADE_CITY.load_speed === 'string', 'load speed set.');
    ok(window.DECADE_CITY.load_speed === 'fast' || window.DECADE_CITY.load_speed === 'slow', 'load speed is an allowed value.');
    ok($('html').hasClass(window.DECADE_CITY.load_speed), 'class hook set.');
    if (window.DECADE_CITY.POLYFILL.sessionStorage.supported) {
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getItem('load-speed') === window.DECADE_CITY.load_speed, 'session storage speed set.');
      ok(typeof parseInt(window.DECADE_CITY.POLYFILL.sessionStorage.getItem('load-count'), 10) === 'number', 'session storage loads set.');
    }
  });

  test('Connection type', function () {
    ok(typeof window.DECADE_CITY.connection_type === 'string', 'connection type set.');
  });

}(window.jQuery));

