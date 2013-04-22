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

  module('Polyfill');

  test('POLYFILL submodule defined', function () {
    strictEqual(typeof window.DECADE_CITY.POLYFILL, 'object', 'submodule defined.');
  });

  test('outerHTML', function () {
    ok($('#outerHTML-test').outerHTML() === '<span id="outerHTML-test">test</span>', 'Returns complete element');
  });


  test('sessionStorage', function () {
    if (window.DECADE_CITY.POLYFILL.sessionStorage.supported) {
      // These are known to be used by the framework - we want to preserve them.
      var load_speed = window.DECADE_CITY.POLYFILL.sessionStorage.getItem('load-speed');
      var load_count = window.DECADE_CITY.POLYFILL.sessionStorage.getItem('load-count');
      var profile_sent = window.DECADE_CITY.POLYFILL.sessionStorage.getItem('profile-sent');
      window.sessionStorage.clear();
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getLength() === 0, 'No items in session storage');
      window.DECADE_CITY.POLYFILL.sessionStorage.setItem('test', 'test');
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getLength() === 1, 'Length of session storage correct');
      window.DECADE_CITY.POLYFILL.sessionStorage.clear();
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getLength() === 0, 'Storage cleared');
      window.DECADE_CITY.POLYFILL.sessionStorage.setItem('test', 'test');
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getItem('test') === 'test', 'Item retrieved');
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.key(0) === 'test', 'Item retrieved by key');
      window.DECADE_CITY.POLYFILL.sessionStorage.removeItem('test');
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getLength() === 0, 'Item removed');
      // Restore any preserved items.
      if (load_speed) {
        window.DECADE_CITY.POLYFILL.sessionStorage.setItem('load-speed', load_speed);
      }
      if (load_count) {
        window.DECADE_CITY.POLYFILL.sessionStorage.setItem('load-count', load_count);
      }
      if (profile_sent) {
        window.DECADE_CITY.POLYFILL.sessionStorage.setItem('profile-sent', profile_sent);
      }
    } else {
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getLength() === 0, 'No items in session storage');
      window.DECADE_CITY.POLYFILL.sessionStorage.setItem('test', 'test');
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getLength() === 0, 'Length of session storage correct');
      window.DECADE_CITY.POLYFILL.sessionStorage.clear();
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getLength() === 0, 'Storage cleared');
      window.DECADE_CITY.POLYFILL.sessionStorage.setItem('test', 'test');
      ok(typeof window.DECADE_CITY.POLYFILL.sessionStorage.getItem('test') === 'undefined', 'Item retrieved does not error');
      ok(typeof window.DECADE_CITY.POLYFILL.sessionStorage.key(0) === 'undefined', 'Item retrieved by key does not error');
      window.DECADE_CITY.POLYFILL.sessionStorage.removeItem('test');
      ok(window.DECADE_CITY.POLYFILL.sessionStorage.getLength() === 0, 'Item removed does not error');
    }
  });



}(window.jQuery));

