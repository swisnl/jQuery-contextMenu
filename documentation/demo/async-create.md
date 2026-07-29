---
currentMenu: async-create 
---

# Demo: Create Context Menu (asynchronous)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Sometimes the menu items are not known up front, for example because they have to be
fetched from the server first. This demo registers the menu with `trigger: 'none'` and
opens it by hand once the items have arrived. The `setTimeout` below stands in for that
server round trip, so the menu appears about a second after you right click.

Two things are worth pointing out:

* The `contextmenu` event is handled directly on the trigger and `preventDefault()` is
  called on it, otherwise the browser shows its own context menu while you are still
  waiting for the items.
* `$.fn.contextMenu()` opens the menu by triggering a `contextmenu` event on the element,
  which runs the very same handler again. The `asyncMenuBusy` flag below makes that
  re-entrant call a no-op, and it doubles as a guard against firing a second request while
  one is still in flight.

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    // pretend this goes to the server; it hands the menu to the callback when ready
    function fetchSomeMenu(done) {
        setTimeout(function(){
            done({
                callback: function(key, options) {
                    var m = "clicked: " + key;
                    window.console && console.log(m) || alert(m);
                },
                items: {
                    "edit": {name: "Edit", icon: "edit"},
                    "cut": {name: "Cut", icon: "cut"},
                    "copy": {name: "Copy", icon: "copy"}
                }
            });
        }, 1000);
    }

    // handle the right click ourselves, the menu is not ready yet
    $('.context-menu-one').on('contextmenu', function(e){
        var $this = $(this);

        // suppress the browser's own context menu
        e.preventDefault();

        // $this.contextMenu() below triggers a 'contextmenu' event on the trigger,
        // so this handler runs again. Ignore that re-entrant call, and any right
        // click that arrives while the items are still being fetched.
        if ($this.data('asyncMenuBusy')) {
            return;
        }
        $this.data('asyncMenuBusy', true);

        var position = {x: e.pageX, y: e.pageY};

        fetchSomeMenu(function(menu){
            // store the result on the trigger so build() can pick it up
            $this.data('asyncMenu', menu);

            // open the contextMenu, this re-enters the handler above
            $this.contextMenu(position);

            // ready for the next right click
            $this.removeData('asyncMenuBusy');
        });
    });

    // setup context menu
    $.contextMenu({
        selector: '.context-menu-one',
        trigger: 'none',
        build: function($trigger) {
            // pull the asynchronously fetched menu off the trigger
            return $trigger.data('asyncMenu');
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>