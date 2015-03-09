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

## Modules

 * `accessibility` - Enhancements hooks for keyboard navigation.
 * `cookies` - Library for dealing with cookies.
 * `images` - Conditional loading of images based on screen size.
 * `namespaced_attributes` - Library for working with namespaced data attributes.
 * `profile` - Browser capability profiling.
 * `sessionStorage` - Facade for session storage API.
 * `speed_test` - Estimate connection speed.
 * `timing` - RUM data collection.

## Cutting the mustard requirements

    'classList' and 'dataset' in document.documentElement
    'querySelectorAll' in document
    'addEventListner' and 'removeEventListner' in window
    window.XMLHttpRequest
    window.innerWidth
    window.innerHeight
    JSON
    Array.forEach

## Release history

* 2015-03-09   v1.1.1   Added test coverage and cleaned up internal syntax.
* 2015-03-09   v1.1.0   Added first paint to timing.
* 2014-10-30   v1.0.1   Images bugfix.
* 2014-10-20   v1.0.0   Moved to AMD modules.
* 2014-03-11   v0.2.0   Removed jQuery dependency (also: messed up versioning).
* 2013-06-02   v0.2.0   Built against jQuery v2.
* 2012-12-13   v0.1.1   Removed initialisation from library.
* 2012-12-13   v0.1.0   Versioned.
* 2012-12-12   v0.0.0   Initial import to Git.


