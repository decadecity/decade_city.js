# decade_city.js

AMD module system for functionality used on [decadecity.net][1]

[1]: http://decadecity.net/

## Getting Started
Include these modules in your build.

Modules may expose the following methods that should be run on the relevant browser events:

  * `ready()` - DOM ready.
  * `load()` - Page Load.
  * `defer()` - After page load.
  * `resize()` - Browser resize.
  * `scroll()` - Page scroll.

# Cutting the mustard requirements

    'classList' in document.documentElement
    'querySelectorAll' in document
    'addEventListner' and 'removeEventListner' in window
    window.XMLHttpRequest
    window.innerWidth
    window.innerHeight

# Release history

* 2014-10-20   v1.0.0   Moved to AMD modules.
* 2014-03-11   v0.2.0   Removed jQuery dependency.
* 2012-12-12   v0.0.0   Initial import to Git.


