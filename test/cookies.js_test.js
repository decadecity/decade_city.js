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

define(function(require) {
  "use strict";

  var cookies = require('cookies');

  return {
    runTests: function() {

      module('Cookies', {
        setup: function() {
          cookies.removeItem('test');
        }
      });

      test('Interface', function() {
        strictEqual(typeof cookies.getItem, 'function', 'getItem is a function');
        strictEqual(typeof cookies.setItem, 'function', 'setItem is a function');
        strictEqual(typeof cookies.hasItem, 'function', 'hasItem is a function');
        strictEqual(typeof cookies.removeItem, 'function', 'removeItem is a function');
      });

      test('setItem', function () {
        strictEqual(cookies.setItem('test', true), true, 'Value is echoed back');

        strictEqual(typeof cookies.setItem(), 'undefined', 'Empty key returns undefined');

        strictEqual(typeof cookies.setItem('expires'), 'undefined', 'Reserved value: expires');
        strictEqual(typeof cookies.setItem('max-age'), 'undefined', 'Reserved value: max-age');
        strictEqual(typeof cookies.setItem('path'), 'undefined', 'Reserved value: path');
        strictEqual(typeof cookies.setItem('domain'), 'undefined', 'Reserved value: domain');
        strictEqual(typeof cookies.setItem('secure'), 'undefined', 'Reserved value: secure');

        strictEqual(cookies.setItem('test', '13', 1), true, 'Set with end integer');
        strictEqual(cookies.setItem('test', '13', 'Thu, 01-Jan-1970 00:00:01 GMT;'), true, 'Set with end string');
        strictEqual(cookies.setItem('test', '13', new Date()), true, 'Set with end date object');

        strictEqual(cookies.setItem('test', '13', 1, '/', 'example.com', true), true, 'All parameters defined');

      });

      test('getItem', function () {
        strictEqual(cookies.getItem(), null, 'Empty key returns null');
        cookies.setItem('test', 13);
        strictEqual(cookies.getItem('test'), '13', 'Test cookie retrieved');
      });


      test('getItem', function () {
        strictEqual(cookies.getItem(), null, 'Empty key returns null');
        cookies.setItem('test', 13);
        strictEqual(cookies.getItem('test'), '13', 'Test cookie retrieved');
      });

      test('removeItem', function () {
        cookies.setItem('test', 13);
        cookies.removeItem('test');
        ok(!cookies.getItem('test'), 'Test cookie deleted');
      });

      test('hasItem', function () {
        ok(!cookies.hasItem('test'), 'Test cookie deleted');
        cookies.setItem('test', 13);
        ok(cookies.hasItem('test'), 'Test cookie present');
      });

    }
  };
});

