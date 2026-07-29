---
currentMenu: rtl-long-submenu
---

# Demo: RTL menu with a long (overflowing) sub-menu

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
     * Combined regression coverage for `direction: 'rtl'`
     * (#742) together with a sub-menu taller than the
     * viewport (#752): the sub-menu must still open on
     * the LEFT of its parent item (RTL) AND be detached,
     * capped to the viewport and scrollable, exactly like
     * the plain LTR case in long-submenu-short-root.md.
     **************************************************/
    var subItems = {};
    for (var i = 1; i <= 40; i++) {
        subItems['sub-key' + i] = {name: 'Sub item ' + i};
    }

    $.contextMenu({
        selector: '.context-menu-one',
        direction: 'rtl',
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
