# jQuery contextMenu Plugin #

[http://medialize.github.com/jQuery-contextMenu/index.html](features)
[http://medialize.github.com/jQuery-contextMenu/demo.html](demo)
[http://medialize.github.com/jQuery-contextMenu/docs.html](documentation)

## Usage ##

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

## License ##

$.contextMenu is published under the [MIT license](http://www.opensource.org/licenses/mit-license.php).