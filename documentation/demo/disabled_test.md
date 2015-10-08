# Demo: Disabled

<span class="context-menu-one label label-default">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu({
        selector: '.context-menu-one', 
        callback: function(key, options) {
            var message = "clicked: " + key;
            $('#msg').text(message);
        },
        items: {
            "edit": {name: "Clickable", icon: "edit", disabled: false},
            "cut": {name: "Disabled", icon: "cut", disabled: true}
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
<div id="msg"></div>