window.DECADE_CITY = (function (module) {
  "use strict";
  module.ACCESSIBILITY = (function (module, submodule) {
    /**
     * Adds the hook for focus highlight.
     */
    var addKeyboardHook = function () {
      document.querySelector('html').classList.add('keyboard');
      document.removeEventListener('keydown', addKeyboardHook);
    };

    var init = function () {
      document.addEventListener('keydown', addKeyboardHook);
    };

    module.register(init);

    return submodule;
  }(module, module.ACCESSIBILITY || {}));

  return module;
}(window.DECADE_CITY || {}));
