<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Demo: Callback](#demo-callback)
  - [Example code](#example-code)
  - [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Demo: Callback

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu({
        selector: '.context-menu-one', 
        callback: function(key, options) {
            var message = "global: " + key;
            $('#msg').text(message); 
        },
        items: {
            "edit": {
                name: "Edit", 
                icon: "edit", 
                // superseeds "global" callback
                callback: function(key, options) {
                    var m = "edit was clicked";
                    $('#msg').text(m); 
                }
            },
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
<div id="msg"></div>