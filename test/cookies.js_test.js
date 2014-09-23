/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
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

define(['cookies'], function(cookies) {

  return {
    runTests: function() {

      module('Cookies');

      test('Cookie functionality', function () {
        cookies.setItem('test', true);
        ok(cookies.hasItem('test'), 'Test cookie set and present');

        cookies.setItem('test', 13);
        strictEqual(cookies.getItem('test'), '13', 'Test cookie retrieved');

        cookies.setItem('test', 13);
        cookies.removeItem('test');
        ok(!cookies.hasItem('test'), 'Test cookie deleted');
      });

    }
  };
});

