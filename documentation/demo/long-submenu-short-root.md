---
currentMenu: long-submenu-short-root
---

# Demo: Short menu with a long sub-menu (overflow)

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
     * Context-Menu that itself fits the viewport, but
     * whose sub-menu has many items (taller than the
     * viewport) - reproduces #752, a variant of the
     * overflow clipping issue (#775) where it's the
     * sub-menu, not the root menu, that overflows.
     **************************************************/
    var subItems = {};
    for (var i = 1; i <= 40; i++) {
        subItems['sub-key' + i] = {name: 'Sub item ' + i};
    }

    $.contextMenu({
        selector: '.context-menu-one',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: {
            item1: {name: 'Item 1'},
            item2: {name: 'Item 2'},
            fold1: {
                name: 'Long sub group',
                items: subItems
            }
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
