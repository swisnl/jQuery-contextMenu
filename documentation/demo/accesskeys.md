# Demo: Accesskeys

<span class="context-menu-one label label-default">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu({
        selector: '.context-menu-one', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        items: {
            "edit": {name: "Edit", icon: "edit", accesskey: "e"},
            "cut": {name: "Cut", icon: "cut", accesskey: "c"},
            // first unused character is taken (here: o)
            "copy": {name: "Copy", icon: "copy", accesskey: "c o p y"},
            // words are truncated to their first letter (here: p)
            "paste": {name: "Paste", icon: "paste", accesskey: "cool paste"},
            "delete": {name: "Delete", icon: "delete"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: function($element, key, item){ return 'icon icon-quit'; }}
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>