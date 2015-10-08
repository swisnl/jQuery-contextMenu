# Demo: Adding new Context Menu Triggers

`jQuery.contextMenu` allows you to define a &lt;menu&gt; before the trigger elements are available.

<span class="context-menu-one label label-default">right click me</span>

<button id="add-trigger" class="btn btn-default" type="submit">Button</button>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    // add new trigger
    $('#add-trigger').on('click', function(e) {
        $('<div class="context-menu-one box menu-injected">'
            + 'right click me <em>(injected)</em>'
            + '</div>').insertBefore(this);

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
            "quit": {name: "Quit", icon: function($element, key, item){ return 'icon icon-quit'; }}
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>