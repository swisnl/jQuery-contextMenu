# Demo: Custom Activated Context Menu

<span class="context-menu-one label label-default">press that button</span>

<button id="activate-menu" class="btn btn-default" type="submit">Button</button>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    // make button open the menu
    $('#activate-menu').on('click', function(e) {
        e.preventDefault();
        $('.context-menu-one').contextMenu();
        // or $('.context-menu-one').trigger("contextmenu");
        // or $('.context-menu-one').contextMenu({x: 100, y: 100});
    });
    
    $.contextMenu({
        selector: '.context-menu-one', 
        trigger: 'none',
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