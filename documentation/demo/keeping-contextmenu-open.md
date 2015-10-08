# Demo: Keeping the Menu visible

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
            "edit": {
                name: "Closing on Click", 
                icon: "edit", 
                callback: function(){ return true; }
            },
            "cut": {
                name: "Open after Click", 
                icon: "cut", 
                callback: function(){ return false; }
            }
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>