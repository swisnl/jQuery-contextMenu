---
currentMenu: long-menu-submenu-promise
---

# Demo: Long menu with a promise-based sub-menu (overflow)

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
     * viewport) whose direct sub-menu items arrive via a
     * promise that resolves after the menu is shown (and
     * has already been detected as scrollable), to
     * reproduce the overflow clipping issue for
     * promise-based sub-menus (#775 review comment 2)
     **************************************************/
    function loadSubItems() {
        var dfd = jQuery.Deferred();
        // resolves well after the ~50ms show animation (and the
        // op.activated() overflow check that runs right after it)
        setTimeout(function () {
            dfd.resolve({
                'fold1-key1': {name: 'alpha'},
                'fold1-key2': {name: 'bravo'},
                'fold1-key3': {name: 'charlie'}
            });
        }, 300);
        return dfd.promise();
    }

    $.contextMenu({
        selector: '.context-menu-one',
        // items are (re)built on every trigger, so the promise for the
        // sub-menu items is created fresh each time the menu is opened
        build: function ($trigger, e) {
            var items = {};
            for (var i = 1; i <= 40; i++) {
                items['item' + i] = {name: 'Item ' + i};
            }
            items.fold1 = {
                name: 'Sub group',
                items: loadSubItems()
            };

            return {
                callback: function(key, options) {
                    var m = "clicked: " + key;
                    window.console && console.log(m) || alert(m);
                },
                items: items
            };
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
