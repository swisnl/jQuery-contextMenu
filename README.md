# jQuery contextMenu plugin & polyfill #

[![Travis](https://img.shields.io/travis/swisnl/jQuery-contextMenu/master.svg?style=flat-square&maxAge=600)](https://travis-ci.org/swisnl/jQuery-contextMenu) [![npm](https://img.shields.io/npm/v/jquery-contextmenu.svg?style=flat-square&maxAge=600)](https://www.npmjs.com/package/jquery-contextmenu) [![npm](https://img.shields.io/npm/vpre/jquery-contextmenu.svg?style=flat-square&maxAge=600)](https://www.npmjs.com/package/jquery-contextmenu) [![npm](https://img.shields.io/npm/dm/jquery-contextmenu.svg?style=flat-square&maxAge=600)](https://www.npmjs.com/package/jquery-contextmenu) [![CDNJS](https://img.shields.io/cdnjs/v/jquery-contextmenu.svg?style=flat-square&maxAge=600)](https://cdnjs.com/libraries/jquery-contextmenu) [![npm](https://img.shields.io/npm/l/jquery-contextmenu.svg?style=flat-square)]() [![Coverage Status](https://img.shields.io/coveralls/github/swisnl/jQuery-contextMenu/3.x.svg)](https://coveralls.io/github/swisnl/jQuery-contextMenu?branch=3.x) [![Greenkeeper badge](https://badges.greenkeeper.io/swisnl/jQuery-contextMenu.svg)](https://greenkeeper.io/)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M0xTRE4zc3ZiY1Y2TVpubHZWT2NZUEU4TU9aNlY1ME9QS2FKeEdoUFl6ST0tLWtGcUd0U2M2U3hMZEF1OWs3S09GdFE9PQ==--fa7fa1e362e706cc38d21f37a8e28181e0bff94f)](https://www.browserstack.com/automate/public-build/M0xTRE4zc3ZiY1Y2TVpubHZWT2NZUEU4TU9aNlY1ME9QS2FKeEdoUFl6ST0tLWtGcUd0U2M2U3hMZEF1OWs3S09GdFE9PQ==--fa7fa1e362e706cc38d21f37a8e28181e0bff94f)


$.contextMenu is a management facility for - you guessed it - context menus. It was designed for an application where there are hundreds of elements that may show a context menu - so intialization speed and memory usage are kept fairly small. It also allows to register context menus without providing actual markup, as $.contextMenu generates DOMElements as needed.

[features](http://swisnl.github.io/jQuery-contextMenu/index.html) - 
[demo](http://swisnl.github.io/jQuery-contextMenu/demo.html) - 
[documentation](http://swisnl.github.io/jQuery-contextMenu/docs.html)



## Dependencies ##

* jQuery >=1.8.2
* jQuery UI position (optional but recommended)


## Usage ##

register contextMenu from javascript:

```javascript
$.contextMenu({
    // define which elements trigger this menu
    selector: ".with-cool-menu",
    // define the elements of the menu
    items: {
        foo: {name: "Foo", callback: function(e, key, currentMenuData){ alert("Foo!"); }},
        bar: {name: "Bar", callback: function(e, key, currentMenuData){ alert("Bar!") }}
    }
    // there's more, have a look at the demos and docs...
});
```

have a look at the [demos](http://swisnl.github.io/jQuery-contextMenu/demo.html).

## Version 3.0 beta

Version 3.0 is a restructure of the javascript into something more sane written in ES6. It consolidates all API's so callbacks are better documented and more concise. The basics are still the same, but all callbacks are structured differently. 

The goal of this refactor was mostly to make the ContextMenu easier to maintain, and make the API's more consise. It also adds JSdoc comments so the API documentation is generated from the code and it enables code completion.

Code coverage is also introduced in the test suite.   

If you really want you can also use the ContextMenu class to instantiate the menu objects instead of the jQuery calls. It still requires jQuery to function.

```javascript
import {ContextMenu, ContextMenuItemTypes} from 'jquery-contextmenu';
const contextMenu = new ContextMenu();
contextMenu.create({
    // define which elements trigger this menu
    selector: ".with-cool-menu",
    // define the elements of the menu
    items: {
        foo: {name: "Foo", callback: function(e, key, currentMenuData){ alert("Foo!"); }},
        bar: {name: "Bar", callback: function(e, key, currentMenuData){ alert("Bar!") }}
    }
    // there's more, have a look at the demos and docs...
});
```

Check out [the documentation for 3.0-beta](http://swisnl.github.io/jQuery-contextMenu) for more information.

## HTML5 Compatibility ##

_Update June 2017: [The &lt;menu&gt; element has been deprecated](https://github.com/whatwg/html/issues/2730) in the html spec because of lack of support. This means the menu element won't be coming to browsers anymore, and the polyfill part of this menu is now deprecated._ 

Firefox 8 implemented contextmenu using the &lt;menuitem&gt; tags for menu-structure. The specs however state that &lt;command&gt; tags should be used for this purpose. $.contextMenu accepts both.

Firefox 8 does not yet fully implement the contextmenu specification ([Ticket #617528](https://bugzilla.mozilla.org/show_bug.cgi?id=617528)). The elements [a](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command),
[button](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command), [input](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-input-element-to-define-a-command) and [option](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-option-element-to-define-a-command) are usable as commands are being ignored altogether. It also doesn't (optically) distinguish between checkbox/radio and regular commands ([Bug #705292](https://bugzilla.mozilla.org/show_bug.cgi?id=705292)).

* [contextmenu specs](http://www.w3.org/TR/html5/interactive-elements.html#context-menus)
* [command specs](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html)
* [Browser support according to caniuse.com](http://caniuse.com/#search=context%20menu)

Note: While the specs note &lt;option&gt;s to be renderd as regular commands, $.contextMenu will render an actual &lt;select&gt;. import contextMenu from HTML5 &lt;menu&gt;:

```javascript
$.contextMenu("html5");
```

## Interaction Principles 

You're (obviously) able to use the context menu with your mouse. Once it is opened, you can also use the keyboard to (fully) navigate it.

* ↑ (up) previous item in list, will skip disabled elements and wrap around
* ↓ (down) next item in, will skip disabled elements and wrap around
* → (right) dive into sub-menu
* ← (left) rise from sub-menu
* ↵ (return) invoke command
* ⇥ (tab) next item or input element, will skip disabled elements and wrap around
* ⇪ ⇥ (shift tab) previous item or input element, will skip disabled elements and wrap around
* ⎋ (escape) close menu
* ⌴ (space) captured and ignore to avoid page scrolling (for consistency with native menus)
* ⇞ (page up) captured and ignore to avoid page scrolling (for consistency with native menus)
* ⇟ (page down) captured and ignore to avoid page scrolling (for consistency with native menus)
* ↖ (home) first item in list, will skip disabled elements
* ↘ (end) last item in list, will skip disabled elements

Besides the obvious, browser also react to alphanumeric key strokes. Hitting <code>r</code> in a context menu will make Firefox (8) reload the page immediately. Chrome selects the option to see infos on the page, Safari selects the option to print the document. Awesome, right? Until trying the same on Windows I did not realize that the browsers were using the access-key for this. I would've preferred typing the first character of something, say "s" for "save" and then iterate through all the commands beginning with s. But that's me - what do I know about UX? Anyways, $.contextMenu now also supports accesskey handling.


## Authors

* [Björn Brala](https://github.com/swisnl)
* [Rodney Rehm](https://github.com/rodneyrehm) (original creator)
* [Christiaan Baartse](https://github.com/christiaan) (single callback per menu)
* [Addy Osmani](https://github.com/addyosmani) (compatibility with native context menu in Firefox 8)

## Special thanks 

Font-Awesome icons used from [encharm/Font-Awesome-SVG-PNG](https://github.com/encharm/Font-Awesome-SVG-PNG).
