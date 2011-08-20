# jQuery contextMenu plugin & polyfill #


##Reasons for this fork:
 
1) The official release of $.contextMenu is missing a test to check for native support of contextmenu in the browser.
 
2) The Firefox nightlies implement contextmenu using the 'menuitem' tags for menu-structure. The specs however state that 'command' tags should be used for this purpose. Whilst the contextMenu plugin handles correct support for 'command' items, it doesn't for 'menuitem'. My fork handles this.

[contextmenu specs](http://www.w3.org/TR/html5/interactive-elements.html#context-menus)


##Original summary

$.contextMenu is a management facility for - you guessed it - context menus. It was designed for an application where there are hundreds of elements that may show a context menu - so intialization speed and memory usage are kept fairly small. It also allows to register context menus without providing actual markup, as $.contextMenu generates DOMElements as needed.

[features](http://medialize.github.com/jQuery-contextMenu/index.html) - 
[demo](http://medialize.github.com/jQuery-contextMenu/demo.html) - 
[documentation](http://medialize.github.com/jQuery-contextMenu/docs.html)

## Dependencies ##

* jQuery 1.6 (not tested with older versions)
* jQuery UI position (optional but recommended)

## Usage ##

register contextMenu from javascript:

<pre><code>
$.contextMenu({
    // define which elements trigger this menu
    selector: ".with-cool-menu",
    // define the elements of the menu
    items: {
        foo: {name: "Foo", callback: function(key, opt){ alert("Foo!"); }},
        bar: {name: "Bar", callback: function(key, opt){ alert("Bar!") }}
    }
    // there's more, have a look at the demos and docs…
});
</code></pre>

import contextMenu from HTML5 &lt;menu&gt;:

<pre><code>
$.contextMenu("html5");
</code></pre>

## Minify ##

use [Google Closure Compiler](http://closure-compiler.appspot.com/home):

<pre><code>
// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name contextMenu.js
// @code_url http://medialize.github.com/jQuery-contextMenu/jquery-1.6.1.min.js
// @code_url http://medialize.github.com/jQuery-contextMenu/jquery.ui.position.js
// @code_url http://medialize.github.com/jQuery-contextMenu/jquery.contextMenu.js
// ==/ClosureCompiler==    
</code></pre>

## License ##

$.contextMenu is published under the [MIT license](http://www.opensource.org/licenses/mit-license.php).