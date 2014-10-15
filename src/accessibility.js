define(['core'], function(core) {
  "use strict";
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

  core.register(init);
});
