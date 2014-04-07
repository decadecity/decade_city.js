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

  var resetSuffix = function() {
      window.DECADE_CITY.IMAGES.suffix_set(false);
      window.DECADE_CITY.IMAGES.suffix('_m');
  };

  module('Images');

  test('IMAGES submodule defined', function () {
    strictEqual(typeof window.DECADE_CITY.IMAGES, 'object', 'submodule defined.');
  });

  test('SVG extension replacement', function() {
    equal(window.DECADE_CITY.IMAGES.svgSrc('test.png'), 'test.svg', 'Extension replaced');
    equal(window.DECADE_CITY.IMAGES.svgSrc('test.png?param=value'), 'test.svg?param=value', 'Extension replaced respecting query string');
    equal(window.DECADE_CITY.IMAGES.svgSrc('test.1 % png'), 'test.svg', 'Extension with special chars replaced');
    equal(window.DECADE_CITY.IMAGES.svgSrc('test.ext.png'), 'test.ext.svg', 'Extension replaced with multiple "."');
    equal(window.DECADE_CITY.IMAGES.svgSrc('TEST.PNG'), 'TEST.svg', 'Uppercase extension replaced');
  });

  test('SVG extension replacement in the DOM', function () {
    window.DECADE_CITY.PROFILE.svg = true;
    window.DECADE_CITY.IMAGES.svgReplace();
    equal($('#svg-replacement-test').attr('src'), 'file:///image.svg', 'Src replaced');
    equal($('#svg-replacement-test').hasClass('svg-replace'), false, 'Class removed');
  });

  test('Image suffix is correctly set by init()', function () {
    resetSuffix();

    window.DECADE_CITY.IMAGES.init(1, 1, 1, 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_m', 'Image suffix is "_m" at minimum width');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(280, 1, 1, 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_n', 'Image suffix is "_n" at 280px width');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(320, 1, 1, 'fast');
    strictEqual(window.DECADE_CITY.IMAGES.suffix(), '', 'Image suffix is "" at 320px width');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(500, 1, 1, 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_z', 'Image suffix is "_z" at 500px width');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(640, 1, 1, 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_c', 'Image suffix is "_c" at 640px width');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(800, 1, 1, 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_b', 'Image suffix is "_b" at 800px width');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(1, 800, 1, 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_b', 'Image suffix is "_b" at 800px height');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(400, 1, 2, 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_b', 'Image suffix is "_b" with 400 width and pixel density 2');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(400, 1, 1, 'slow');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_m', 'Image suffix is "_m" on slow connection');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init('800', 1, 1, 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_b', 'Image init copes with string width.');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(1, '800', 1, 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_b', 'Image init copes with string height.');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init(400, 1, '2', 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_b', 'Image init copes with string pixel density.');

    resetSuffix();

    window.DECADE_CITY.IMAGES.init('string', 'string', 'string', 'fast');
    equal(window.DECADE_CITY.IMAGES.suffix(), '_m', 'Image init copes with garbage string inputs.');
  });

  test('Flickr image URL replacement.', function () {
    equal(window.DECADE_CITY.IMAGES.imageSrc('non flickr url'), 'non flickr url', 'Non Image URL was passed through unmodified');

    window.DECADE_CITY.IMAGES.suffix('_m');

    equal(
      window.DECADE_CITY.IMAGES.imageSrc('//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg',
      'Image image with "_m" suffix is unaltered'
    );

    window.DECADE_CITY.IMAGES.suffix('_b');

    equal(
      window.DECADE_CITY.IMAGES.imageSrc('//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_b.jpeg',
      'Image image with suffix is replaced'
    );

    window.DECADE_CITY.IMAGES.suffix('_b');

    equal(
      window.DECADE_CITY.IMAGES.imageSrc('//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_b.jpeg',
      'Image image with no suffix is replaced'
    );

    window.DECADE_CITY.IMAGES.suffix('');

    equal(
      window.DECADE_CITY.IMAGES.imageSrc('//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340.jpeg',
      'Image image with suffix is replaced with no suffix'
    );
  });

  /* Not convinced this is testable in phantom?
  test('Flickr responsive images', function () {
    window.DECADE_CITY.IMAGES.flickr_suffix('_b');
    window.DECADE_CITY.IMAGES.responsiveImages();
    //$('#flickr-responsive-test').trigger('load');
    equal($('#flickr-responsive-test').attr('src'), 'http://farm9.staticflickr.com/8204/8230113340_4975b71bf6_b.jpg', 'DOM element has image src replaced');
  });
*/

}(window.jQuery));

