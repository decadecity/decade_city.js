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

  var profile = require('profile');

  return {
    runTests: function() {

      module('Profile');

      test('Interface', function() {
        strictEqual(typeof profile.sendProfile, 'function', 'sendProfile is a function');
        strictEqual(typeof profile.ready, 'function', 'ready is a function');
      });

      profile.ready();

      test('Query string builder', function() {
        strictEqual(profile.toQueryString({}), '', 'No query string');
        strictEqual(profile.toQueryString({'key': 'value'}), 'key=value', 'Simple query string');
        strictEqual(profile.toQueryString({'key': 'value', 'key1': 'value1'}), 'key=value&key1=value1', 'Complex query string');
      });

      test('Profile items defined', function () {
        ok(typeof profile.profile === 'object', 'Profile object exists.');
        ok(typeof profile.profile.svg === 'boolean', 'SVG key exists.');
        ok(typeof profile.profile.transform === 'boolean', 'Transform key exists.');
        ok(typeof profile.profile.transform_prefix === 'string', 'Transform prefix key exists.');
        ok(typeof profile.profile.touch === 'boolean', 'Touch key exists.');
        ok(typeof profile.profile.json === 'boolean', 'JSON key exists.');
        ok(typeof profile.profile.async_scripts === 'boolean', 'Async scripts key exists.');
        ok(typeof profile.profile.timing === 'boolean', 'Timing key exists.');
      });

    }
  };
});

