---
currentMenu: dynamic 
---

# Demo: Adding new Context Menu Triggers

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

`jQuery.contextMenu` allows you to define a &lt;menu&gt; before the trigger elements are available.


<div> 
  <button id="add-trigger" class="btn btn-default" type="submit">Button</button>    
</div>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    // add new trigger
    $('#add-trigger').on('click', function(e) {
        $('<div class="context-menu-one clear btn btn-neutral menu-injected">'
            + 'right click me <em>(injected)</em>'
            + '</div><br>').insertBefore(this);
        // not need for re-initializing $.contextMenu here :)
    });
    
    $.contextMenu({
        selector: '.context-menu-one', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        items: {
            "edit": {name: "Edit", icon: "edit"},
            "cut": {name: "Cut", icon: "cut"},
            "copy": {name: "Copy", icon: "copy"},
            "paste": {name: "Paste", icon: "paste"},
            "delete": {name: "Delete", icon: "delete"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>