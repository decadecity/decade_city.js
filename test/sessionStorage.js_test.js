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

  var sessionStorage = require('sessionStorage');

  // We use these for preservation.
  var load_speed,
      load_count,
      profile_sent;

  return {
    runTests: function() {

      module('sessionStorage', {
        setup: function() {
          // These are known to be used by the framework - we want to preserve them.
          load_speed = sessionStorage.getItem('load-speed');
          load_count = sessionStorage.getItem('load-count');
          profile_sent = sessionStorage.getItem('profile-sent');
        },
        teardown: function() {
          // Restore any preserved items.
          if (load_speed) {
            sessionStorage.setItem('load-speed', load_speed);
          }
          if (load_count) {
            sessionStorage.setItem('load-count', load_count);
          }
          if (profile_sent) {
            sessionStorage.setItem('profile-sent', profile_sent);
          }
        }
      });

      test('Interface', function() {
        strictEqual(typeof sessionStorage.supported, 'boolean', 'supported is a boolean');
        strictEqual(typeof sessionStorage.getItem, 'function', 'getItem is a function');
        strictEqual(typeof sessionStorage.setItem, 'function', 'setItem is a function');
        strictEqual(typeof sessionStorage.getLength, 'function', 'getLength is a function');
        strictEqual(typeof sessionStorage.removeItem, 'function', 'removeItem is a function');
      });

      test('sessionStorage supported', function () {
        window.sessionStorage.clear();
        ok(sessionStorage.getLength() === 0, 'No items in session storage');
        sessionStorage.setItem('test', 'test');
        ok(sessionStorage.getLength() === 1, 'Length of session storage correct');
        sessionStorage.clear();
        ok(sessionStorage.getLength() === 0, 'Storage cleared');
        sessionStorage.setItem('test', 'test');
        ok(sessionStorage.getItem('test') === 'test', 'Item retrieved');
        ok(sessionStorage.key(0) === 'test', 'Item retrieved by key');
        sessionStorage.removeItem('test');
        ok(sessionStorage.getLength() === 0, 'Item removed');
      });
      test('sessionStorage unsupported', function () {
        sessionStorage.setSupported(false);
        ok(sessionStorage.getLength() === 0, 'No items in session storage');
        sessionStorage.setItem('test', 'test');
        ok(sessionStorage.getLength() === 0, 'Length of session storage correct');
        sessionStorage.clear();
        ok(sessionStorage.getLength() === 0, 'Storage cleared');
        sessionStorage.setItem('test', 'test');
        strictEqual(sessionStorage.getItem('test'), null, 'Item retrieved does not error');
        strictEqual(sessionStorage.key(0), null, 'Item retrieved by key does not error');
        sessionStorage.removeItem('test');
        ok(sessionStorage.getLength() === 0, 'Item removed does not error');
      });

    }
  };

});

