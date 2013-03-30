Google Chrome extension allowing you to know russian translation of english word on a web page.
Plugin uses Yandex.Slovari API.
Project released under MIT license.

* * *

Usage
============

1. Select unknown word in browser.
2. Press `Ctrl + C + C`

Build
=========
1. `git clone https://github.com/nloginov/chrome_slovari.git`
2. `cd chrome_slovari`
3. `make`
4. Load Chrome extension from `production` directory.

Dependencies
-

* [node.js] for generating templates
* [lessc] for generating css styles

Tech
============
Plugin uses number of open source libraries:

* [jquery] for easy ajax and dom manipulation.
* [hogan.js] for javascript template library
* [Twitter Bootstrap] styles
* [inflection.js] for inflection support

  [lessc]: http://lesscss.org/
  [node.js]: http://nodejs.org
  [Twitter Bootstrap]: http://twitter.github.com/bootstrap/
  [jQuery]: http://jquery.com
  [hogan.js]: http://twitter.github.com/hogan.js/  
  [inflection.js]: https://code.google.com/p/inflection-js/
