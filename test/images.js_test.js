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

define(['images', 'profile'], function(images, profile) {

  return {
    runTests: function() {
  var resetSuffix = function() {
    images.suffix_set(false);
    images.suffix('_m');
  };

  module('Images');

  test('SVG extension replacement', function() {
    equal(images.svgSrc('test.png'), 'test.svg', 'Extension replaced');
    equal(images.svgSrc('test.png?param=value'), 'test.svg?param=value', 'Extension replaced respecting query string');
    equal(images.svgSrc('test.1 % png'), 'test.svg', 'Extension with special chars replaced');
    equal(images.svgSrc('test.ext.png'), 'test.ext.svg', 'Extension replaced with multiple "."');
    equal(images.svgSrc('TEST.PNG'), 'TEST.svg', 'Uppercase extension replaced');
  });

  test('SVG extension replacement in the DOM', function () {
    profile.svg = true;
    images.svgReplace();
    equal(window._$('#svg-replacement-test').attr('src'), window.location.origin + '/image.svg', 'Src replaced');
    equal(window._$('#svg-replacement-test').hasClass('svg-replace'), false, 'Class removed');
  });

  test('Image suffix is correctly set by init()', function () {
    resetSuffix();

    images.init(1, 1, 1, 'fast');
    equal(images.suffix(), '_m', 'Image suffix is "_m" at minimum width');

    resetSuffix();

    images.init(280, 1, 1, 'fast');
    equal(images.suffix(), '_n', 'Image suffix is "_n" at 280px width');

    resetSuffix();

    images.init(320, 1, 1, 'fast');
    strictEqual(images.suffix(), '', 'Image suffix is "" at 320px width');

    resetSuffix();

    images.init(500, 1, 1, 'fast');
    equal(images.suffix(), '_z', 'Image suffix is "_z" at 500px width');

    resetSuffix();

    images.init(640, 1, 1, 'fast');
    equal(images.suffix(), '_c', 'Image suffix is "_c" at 640px width');

    resetSuffix();

    images.init(800, 1, 1, 'fast');
    equal(images.suffix(), '_b', 'Image suffix is "_b" at 800px width');

    resetSuffix();

    images.init(1, 800, 1, 'fast');
    equal(images.suffix(), '_b', 'Image suffix is "_b" at 800px height');

    resetSuffix();

    images.init(400, 1, 2, 'fast');
    equal(images.suffix(), '_b', 'Image suffix is "_b" with 400 width and pixel density 2');

    resetSuffix();

    images.init(400, 1, 1, 'slow');
    equal(images.suffix(), '_m', 'Image suffix is "_m" on slow connection');

    resetSuffix();

    images.init('800', 1, 1, 'fast');
    equal(images.suffix(), '_b', 'Image init copes with string width.');

    resetSuffix();

    images.init(1, '800', 1, 'fast');
    equal(images.suffix(), '_b', 'Image init copes with string height.');

    resetSuffix();

    images.init(400, 1, '2', 'fast');
    equal(images.suffix(), '_b', 'Image init copes with string pixel density.');

    resetSuffix();

    images.init('string', 'string', 'string', 'fast');
    equal(images.suffix(), '_m', 'Image init copes with garbage string inputs.');
  });

  test('Flickr image URL replacement.', function () {
    equal(images.imageSrc('non flickr url'), 'non flickr url', 'Non Image URL was passed through unmodified');

    images.suffix('_m');


    equal(
      images.imageSrc('//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg',
      'Protocol relative path not changed.'
    );
    equal(
      images.imageSrc('http://s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg',
      'HTTP procol stripped.'
    );
    equal(
      images.imageSrc('https://s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg',
      'HTTPS procol stripped.'
    );
    equal(
      images.imageSrc('file://s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg',
      'File procol stripped.'
    );

    equal(
      images.imageSrc('//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg',
      'Image image with "_m" suffix is unaltered'
    );
    equal(
      images.imageSrc('http://s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg',
      'Image image with "_m" suffix is unaltered'
    );
    equal(
      images.imageSrc('https://s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg',
      'Image image with "_m" suffix is unaltered'
    );
    equal(
      images.imageSrc('file://s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg',
      'Image image with "_m" suffix is unaltered'
    );

    images.suffix('_b');

    equal(
      images.imageSrc('//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_b.jpeg',
      'Image image with suffix is replaced'
    );

    images.suffix('_b');

    equal(
      images.imageSrc('//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_b.jpeg',
      'Image image with no suffix is replaced'
    );

    images.suffix('');

    equal(
      images.imageSrc('//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340_m.jpeg'),
      '//s3-eu-west-1.amazonaws.com/decadecity/images/8230113340.jpeg',
      'Image image with suffix is replaced with no suffix'
    );
  });

  /* Not convinced this is testable in phantom?
  test('Flickr responsive images', function () {
    images.flickr_suffix('_b');
    images.responsiveImages();
    //window._$('#flickr-responsive-test').trigger('load');
    equal(window._$('#flickr-responsive-test').attr('src'), 'http://farm9.staticflickr.com/8204/8230113340_4975b71bf6_b.jpg', 'DOM element has image src replaced');
  });
*/

    }
  };
});

