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

  var accessibility = require('accessibility');

  return {
    runTests: function() {

      module('Accessibility');

      test('Interface', function() {
        strictEqual(typeof accessibility.ready, 'function', 'ready is a function');
      });

      accessibility.ready();

      test('Keyboard styling hook', function () {
        var html = window._$('html');
        ok(!html.hasClass('keyboard'), 'No class set');

        // This isn't using new CustomEvent('keydown') due to a webkit bug in phantom.
        // https://github.com/ariya/phantomjs/issues/11289
        var event_data = { 'keyCode': 9 };
        if (window.CustomEvent) {
          document.dispatchEvent(new window.CustomEvent('keydown', event_data));
        } else {
          var evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
          evt.initCustomEvent('keydown', false, false, event_data);
          document.dispatchEvent(evt);
        }

        ok(html.hasClass('keyboard'), 'Class set after keydown');
      });

    }
  };

});


