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

define(['speedTest', 'sessionStorage', 'profile'], function(speedTest, sessionStorage, profile) {

  // The old connection API used constants to denote the type.
  // Extend this to build the connection object for testing.
  var connection_constants = {
    'UNKNOWN': '0',
    'ETHERNET': '1',
    'WIFI': '2',
    'CELL_2G': '3',
    'CELL_3G': '4'
  };

  return {
    runTests: function() {
      module('Speed test');

      test('Connection api normaliser', function() {
        // New network API
        deepEqual(speedTest._connectionTest({ 'type': 'bluetooth' }), { 'connection_type': 'bluetooth' }, 'Bluetooth');
        deepEqual(speedTest._connectionTest({ 'type': 'cellular' }), { 'load_speed': 'slow', 'connection_type': 'cellular' }, 'Cellular');
        deepEqual(speedTest._connectionTest({ 'type': 'ethernet' }), { 'connection_type': 'ethernet' }, 'Ethernet');
        deepEqual(speedTest._connectionTest({ 'type': 'none' }), { 'connection_type': 'none' }, 'None');
        deepEqual(speedTest._connectionTest({ 'type': 'other' }), { 'connection_type': 'other' }, 'Other');
        deepEqual(speedTest._connectionTest({ 'type': 'unknown' }), { 'connection_type': 'unknown' }, 'Unknown type');
        deepEqual(speedTest._connectionTest({ 'type': 'wifi' }), { 'connection_type': 'wifi' }, 'Wifi');
        // Old network API
        deepEqual(speedTest._connectionTest(window._$.extend({ 'type': '0' }, connection_constants)), { 'connection_type': 'unknown' }, 'Unknown');
        deepEqual(speedTest._connectionTest(window._$.extend({ 'type': '1' }, connection_constants)), { 'connection_type': 'ethernet' }, 'Ethernet');
        deepEqual(speedTest._connectionTest(window._$.extend({ 'type': '2' }, connection_constants)), { 'connection_type': 'wifi' }, 'Wifi');
        deepEqual(speedTest._connectionTest(window._$.extend({ 'type': '3' }, connection_constants)), { 'load_speed': 'slow', 'connection_type': 'cellular' }, '2G');
        deepEqual(speedTest._connectionTest(window._$.extend({ 'type': '4' }, connection_constants)), { 'load_speed': 'slow', 'connection_type': 'cellular' }, '3G');
      });

      test('Speed test calculation', function() {
        // Check the threshold calculation works.
        equal(speedTest._calculateLoadSpeed(0, 0, 'slow'), 'fast', 'Below threshold, below load count, `slow` stored value');
        equal(speedTest._calculateLoadSpeed(3000, 0, 'slow'), 'slow', 'Above threshold, below load count, `slow` stored value');
        // Check the load count
        equal(speedTest._calculateLoadSpeed(0, 5, 'slow'), 'slow', 'Below threshold, above load count, `slow` stored value');
        equal(speedTest._calculateLoadSpeed(3000, 5, 'slow'), 'slow', 'Above threshold, above load count, `slow` stored value');
        // Check the stored value
        equal(speedTest._calculateLoadSpeed(3000, 5, 'fast'), 'fast', 'Above threshold, above load count, `fast` stored value');
      });

      speedTest.ready();

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

