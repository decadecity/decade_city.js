# decade_city.js

Module system for functionality used on [decadecity.net][1]

[1]: http://decadecity.net/

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/decadecity/decade_city.js/master/dist/decade_city.js.min.js
[max]: https://raw.github.com/decadecity/decade_city.js/master/dist/decade_city.js.js

In your web page:

Cutting the mustard requirements:

    'classList' in document.documentElement
    'querySelectorAll' in document
    'addEventListner' and 'removeEventListner' in window
    window.XMLHttpRequest
    window.innerWidth
    window.innerHeight

```html
<script src="dist/decade_city.js.min.js"></script>
<script>window.DECADE_CITY.init()</script><!-- Manually initialise the library. -->
```
