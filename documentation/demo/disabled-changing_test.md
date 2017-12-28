<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Demo: Disabled changing](#demo-disabled-changing)
  - [Example code](#example-code)
  - [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Demo: Disabled changing

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu({
        selector: '.context-menu-one', 
        callback: function(e, key, currentMenuData, rootMenuData) {
            var message = "clicked: " + key;
            $('#msg').text(message); 
        },
        items: {
            "edit": {name: "Clickable", icon: "edit"},
            "cut": {
                name: "Disabled", 
                icon: "cut", 
                disabled: function(e, key, currentMenuData, rootMenuData) { 
                    // this references the trigger element
                    return !this.data('cutDisabled'); 
                }
            },
            "toggle": {
                name: "Toggle", 
                callback: function(e, key, currentMenuData, rootMenuData) {
                    // this references the trigger element
                    this.data('cutDisabled', !this.data('cutDisabled'));
                    return false;
                }
            }
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
<div id="msg"></div>