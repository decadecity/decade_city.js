window.DECADE_CITY = (function (module) {
  "use strict";
  module.IMAGES = (function (module, submodule) {
    submodule._svgSrc = function(src) {
      return src.replace(/\.[^.\?]*($|\?)/, '.svg$1');
    };

    var init = function () {
      if (module.PROFILE.svg) {
        var images = document.querySelectorAll('.svg-replace');
        for (var i = 0; i < images.length; i += 1) {
          var image = images[i];
          image.src = submodule._svgSrc(image.src);
          image.classList.remove('svg-replace');
        }
      }
    };
    submodule._test = init; //TODO: add to debug method.

    module.register(init);

    return submodule;

  }(module, module.IMAGES || {}));

  return module;
}(window.DECADE_CITY || {}));
