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

  var resetFlickrSuffix = function() {
      window.DECADE_CITY.FLICKR.flickr_suffix_set(false);
      window.DECADE_CITY.FLICKR.flickr_suffix('_m');
  };

  module('Flickr');

  test('FLICKR submodule defined', function () {
    strictEqual(typeof window.DECADE_CITY.FLICKR, 'object', 'submodule defined.');
  });

  test('Flickr suffix is correctly set by init()', function () {
    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(1, 1, 1, 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_m', 'Flickr suffix is "_m" at minimum width');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(280, 1, 1, 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_n', 'Flickr suffix is "_n" at 280px width');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(320, 1, 1, 'fast');
    strictEqual(window.DECADE_CITY.FLICKR.flickr_suffix(), '', 'Flickr suffix is "" at 320px width');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(500, 1, 1, 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_z', 'Flickr suffix is "_z" at 500px width');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(640, 1, 1, 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_c', 'Flickr suffix is "_c" at 640px width');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(800, 1, 1, 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_b', 'Flickr suffix is "_b" at 800px width');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(1, 800, 1, 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_b', 'Flickr suffix is "_b" at 800px height');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(400, 1, 2, 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_b', 'Flickr suffix is "_b" with 400 width and pixel density 2');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(400, 1, 1, 'slow');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_m', 'Flickr suffix is "_m" on slow connection');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init('800', 1, 1, 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_b', 'Flickr init copes with string width.');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(1, '800', 1, 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_b', 'Flickr init copes with string height.');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init(400, 1, '2', 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_b', 'Flickr init copes with string pixel density.');

    resetFlickrSuffix();

    window.DECADE_CITY.FLICKR.init('string', 'string', 'string', 'fast');
    equal(window.DECADE_CITY.FLICKR.flickr_suffix(), '_m', 'Flickr init copes with garbage string inputs.');
  });

  test('Flickr image URL replacement.', function () {
    equal(window.DECADE_CITY.FLICKR.imageSrc('non flickr url'), 'non flickr url', 'Non Flickr URL was passed through unmodified');

    window.DECADE_CITY.FLICKR.flickr_suffix('_m');

    equal(window.DECADE_CITY.FLICKR.imageSrc('http://farm9.staticflickr.com/8204/8230113340_4975b71bf6_m.jpg'), 'http://farm9.staticflickr.com/8204/8230113340_4975b71bf6_m.jpg', 'Flickr image with "_m" suffix is unaltered');

    window.DECADE_CITY.FLICKR.flickr_suffix('_b');

    equal(window.DECADE_CITY.FLICKR.imageSrc('http://farm9.staticflickr.com/8204/8230113340_4975b71bf6_m.jpg'), 'http://farm9.staticflickr.com/8204/8230113340_4975b71bf6_b.jpg', 'Flickr image with suffix is replaced');

    window.DECADE_CITY.FLICKR.flickr_suffix('_b');

    equal(window.DECADE_CITY.FLICKR.imageSrc('http://farm9.staticflickr.com/8204/8230113340_4975b71bf6.jpg'), 'http://farm9.staticflickr.com/8204/8230113340_4975b71bf6_b.jpg', 'Flickr image with no suffix is replaced');

    window.DECADE_CITY.FLICKR.flickr_suffix('');

    equal(window.DECADE_CITY.FLICKR.imageSrc('http://farm9.staticflickr.com/8204/8230113340_4975b71bf6_m.jpg'), 'http://farm9.staticflickr.com/8204/8230113340_4975b71bf6.jpg', 'Flickr image with suffix is replaced with no suffix');
  });

  test('Flickr responsive images', function () {
    expect(0);
    window.DECADE_CITY.FLICKR.flickr_suffix('_b');
    window.DECADE_CITY.FLICKR.responsiveImages();
    console.log($('#flickr-responsive-test').attr('src'));
  });

}(window.jQuery));

