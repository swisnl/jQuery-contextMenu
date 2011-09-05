# jQuery contextMenu plugin & polyfill #

$.contextMenu is a management facility for - you guessed it - context menus. It was designed for an application where there are hundreds of elements that may show a context menu - so intialization speed and memory usage are kept fairly small. It also allows to register context menus without providing actual markup, as $.contextMenu generates DOMElements as needed.

[features](http://medialize.github.com/jQuery-contextMenu/index.html) - 
[demo](http://medialize.github.com/jQuery-contextMenu/demo.html) - 
[documentation](http://medialize.github.com/jQuery-contextMenu/docs.html)

## Dependencies ##

* jQuery 1.6 (not tested with older versions)
* jQuery UI position (optional but recommended)

## HTML5 Compatibility ##

The [Firefox nightlies](http://nightly.mozilla.org/) implement contextmenu using the 'menuitem' tags for menu-structure. The specs however state that 'command' tags should be used for this purpose. $.contextMenu accepts both.

Firefox 9.0a1 does not yet fully implement the contextmenu specification. The elements
[a](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command),
[button](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command),
[input](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-input-element-to-define-a-command) and
[option](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-option-element-to-define-a-command) 
usable as commands are being ignored altogether. It also doesn't (optically) distinguish between checkbox/radio and regular commands. See [Screenshot](/screenshots/native.firefox-9.0a1.png).

* [contextmenu specs](http://www.w3.org/TR/html5/interactive-elements.html#context-menus)
* [command specs](http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html)

Note: While the specs note &lt;option&gt;s to be renderd as regular commands, $.contextMenu will render an actual &lt;select&gt;.

register contextMenu from javascript:

```javascript
$.contextMenu({
    // define which elements trigger this menu
    selector: ".with-cool-menu",
    // define the elements of the menu
    items: {
        foo: {name: "Foo", callback: function(key, opt){ alert("Foo!"); }},
        bar: {name: "Bar", callback: function(key, opt){ alert("Bar!") }}
    }
    // there's more, have a look at the demos and docs...
});
```

import contextMenu from HTML5 &lt;menu&gt;:

```javascript
$.contextMenu("html5");
```

## Interaction Principles ##

You're (obviously) able to use the context menu with your mouse. Once it is opened, you can also use the keyboard to (fully) navigate it.

* ↑ (up) next item in list, will skip disabled elements and wrap around
* ↓ (down) previous item in, will skip disabled elements and wrap around
* → (right) dive into sub-menu
* ← (left) rise from sub-menu
* ↵ (return) invoke command
* ➟ (tab) next item or input element, will skip disabled elements and wrap around
* ⇪ ➟ (shift tab) previous item or input element, will skip disabled elements and wrap around

Besides the obvious, browser also react to alphanumeric key strokes. Hitting <code>r</code> in a context menu will make Firefox (9) reload the page immediately. Chrome selects the option to see infos on the page, Safari selects the option to print the document. Awesome, right? Until trying the same on Windows I did not realize that the browsers were using the access-key for this. I would've preferred typing the first character of something, say "s" for "save" and then iterate through all the commands beginning with s. But that's me - what do I know about UX? Anyways, $.contextMenu now also supports accesskey handling.


## Minify ##

use [Google Closure Compiler](http://closure-compiler.appspot.com/home):

<pre><code>
// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name contextMenu.js
// @code_url http://medialize.github.com/jQuery-contextMenu/jquery-1.6.2.min.js
// @code_url http://medialize.github.com/jQuery-contextMenu/jquery.ui.position.js
// @code_url http://medialize.github.com/jQuery-contextMenu/jquery.contextMenu.js
// ==/ClosureCompiler==    
</code></pre>


## Authors ##

* [Rodney Rehm](https://github.com/rodneyrehm)
* [Christiaan Baartse](https://github.com/christiaan) (single callback per menu)
* [Addy Osmani](https://github.com/addyosmani) (compatibility with native context menu in Firefox 8)


## License ##

$.contextMenu is published under the [MIT license](http://www.opensource.org/licenses/mit-license.php).


## Changelog ##

### 1.3 ###

* Added support for accesskeys
* Bug where two sub-menus could be open simultaneously

### 1.2.2 ###

* Bug in HTML5 import

### 1.2.1 ###

* Bug in HTML5 detection

### 1.2 ###

* Added compatibility to &lt;menuitem&gt; for Firefox 8
* Upgraded to jQuery 1.6.2

### 1.1 ###

* Bug #1 TypeError on HTML5 action passthru
* Bug #2 disbaled callback not invoked properly
* Feature #3 auto-hide option for hover trigger
* Feature #4 option to use a single callback for all commands, rather than registering the same function for each item
* Option to ignore right-click (original "contextmenu" event trigger) for non-right-click triggers

### 1.0 ###

* Initial $.contextMenu handler