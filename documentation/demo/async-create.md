---
currentMenu: async-create 
---

# Demo: Create Context Menu (asynchronous)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    // some build handler to call asynchronously
    function createSomeMenu() {
        return {
            callback: function(key, options) {
                var m = "clicked: " + key;
                window.console && console.log(m) || alert(m);
            },
            items: {
                "edit": {name: "Edit", icon: "edit"},
                "cut": {name: "Cut", icon: "cut"},
                "copy": {name: "Copy", icon: "copy"}
            }
        };
    }

    // some asynchronous click handler
    $('.context-menu-one').on('mouseup', function(e){
        var $this = $(this);
        // store a callback on the trigger
        $this.data('runCallbackThingie', createSomeMenu);
        var _offset = $this.offset(),
            position = {
                x: _offset.left + 10, 
                y: _offset.top + 10
            }
        // open the contextMenu asynchronously
        setTimeout(function(){ $this.contextMenu(position); }, 1000);
    });

    // setup context menu
    $.contextMenu({
        selector: '.context-menu-one',
        trigger: 'none',
        build: function($trigger, e) {
            // pull a callback from the trigger
            return $trigger.data('runCallbackThingie')();
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>