---
currentMenu: long-menu-submenu
---

# Demo: Long menu with submenu (overflow)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    /**************************************************
     * Context-Menu with many items (taller than the
     * viewport) plus a sub-menu, to reproduce the
     * overflow clipping issue (#775)
     **************************************************/
    var items = {};
    for (var i = 1; i <= 40; i++) {
        items['item' + i] = {name: 'Item ' + i};
    }
    items.fold1 = {
        name: 'Sub group',
        items: {
            'fold1-key1': {name: 'alpha'},
            'fold1-key2': {name: 'bravo'},
            'fold1-key3': {name: 'charlie'}
        }
    };

    $.contextMenu({
        selector: '.context-menu-one',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: items
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
