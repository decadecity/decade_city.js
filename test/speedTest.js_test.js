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

define(['speedTest', 'sessionStorage', 'profile'], function(speedTest, sessionStorage, profile) {


  return {
    runTests: function() {
      module('Speed test');

      test('Load speed', function () {
        ok(typeof profile.load_speed === 'string', 'load speed set.');
        ok(profile.load_speed === 'fast' || profile.load_speed === 'slow', 'load speed is an allowed value.');
        ok(window._$('html').hasClass(profile.load_speed), 'class hook set.');
        if (sessionStorage.supported) {
          ok(sessionStorage.getItem('load-speed') === profile.load_speed, 'session storage speed set.');
          ok(typeof parseInt(sessionStorage.getItem('load-count'), 10) === 'number', 'session storage loads set.');
        }
      });

      test('Connection type', function () {
        ok(typeof profile.connection_type === 'string', 'connection type set.');
      });
    }
  };
});

