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

  module('Cookies');

  test('COOKIE submodule defined', function () {
    strictEqual(typeof window.DECADE_CITY.COOKIES, 'object', 'submodule defined.');
  });

  test('Cookie functionality', function () {
    window.DECADE_CITY.COOKIES.setItem('test', true);
    ok(window.DECADE_CITY.COOKIES.hasItem('test'), 'Test cookie set and present');

    window.DECADE_CITY.COOKIES.setItem('test', 13);
    strictEqual(window.DECADE_CITY.COOKIES.getItem('test'), '13', 'Test cookie retrieved');

    window.DECADE_CITY.COOKIES.setItem('test', 13);
    window.DECADE_CITY.COOKIES.removeItem('test');
    ok(!window.DECADE_CITY.COOKIES.hasItem('test'), 'Test cookie deleted');
  });


}(window.jQuery));

