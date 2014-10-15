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

define(['sessionStorage'], function(sessionStorage) {

  return {
    runTests: function() {

      module('sessionStorage');

      test('sessionStorage', function () {
        if (sessionStorage.supported) {
          // These are known to be used by the framework - we want to preserve them.
          var load_speed = sessionStorage.getItem('load-speed');
          var load_count = sessionStorage.getItem('load-count');
          var profile_sent = sessionStorage.getItem('profile-sent');
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
        } else {
          ok(sessionStorage.getLength() === 0, 'No items in session storage');
          sessionStorage.setItem('test', 'test');
          ok(sessionStorage.getLength() === 0, 'Length of session storage correct');
          sessionStorage.clear();
          ok(sessionStorage.getLength() === 0, 'Storage cleared');
          sessionStorage.setItem('test', 'test');
          ok(typeof sessionStorage.getItem('test') === 'undefined', 'Item retrieved does not error');
          ok(typeof sessionStorage.key(0) === 'undefined', 'Item retrieved by key does not error');
          sessionStorage.removeItem('test');
          ok(sessionStorage.getLength() === 0, 'Item removed does not error');
        }
      });

    }
  };

});

