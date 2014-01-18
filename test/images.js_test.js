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

  module('Images');

  test('IMAGES submodule defined', function () {
    strictEqual(typeof window.DECADE_CITY.IMAGES, 'object', 'submodule defined.');
  });

  test('SVG extension replacement', function() {
    equal(window.DECADE_CITY.IMAGES._svgSrc('test.png'), 'test.svg', 'Extension replaced');
    equal(window.DECADE_CITY.IMAGES._svgSrc('test.png?param=value'), 'test.svg?param=value', 'Extension replaced respecting query string');
    equal(window.DECADE_CITY.IMAGES._svgSrc('test.1 % png'), 'test.svg', 'Extension with special chars replaced');
    equal(window.DECADE_CITY.IMAGES._svgSrc('test.ext.png'), 'test.ext.svg', 'Extension replaced with multiple "."');
    equal(window.DECADE_CITY.IMAGES._svgSrc('TEST.PNG'), 'TEST.svg', 'Uppercase extension replaced');
  });

  test('SVG extension replacement in the DOM', function () {
    window.DECADE_CITY.PROFILE.svg = true;
    window.DECADE_CITY.IMAGES.test();
    equal($('#svg-replacement-test').attr('src'), 'file:///image.svg', 'Src replaced');
    equal($('#svg-replacement-test').hasClass('svg-replace'), false, 'Class removed');
  });

}(window.jQuery));
