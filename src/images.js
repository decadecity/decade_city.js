window.DECADE_CITY = (function (module, $) {
  "use strict";
  module.IMAGES = (function (module, submodule, $) {
    submodule._svgSrc = function(src) {
      return src.replace(/\.[^.]*$/, '.svg');
    };

    var init = function () {
      $('.svg-replace').each(function() {
        $(this).attr('src', function (i, src) {
          return submodule._svgSrc(src);
        });
        $(this).removeClass('svg-replace');
      });
    };

    module.register(init);

    return submodule;

  }(module, module.IMAGES || {}, $));

  return module;
}(window.DECADE_CITY || {}, window.jQuery));
