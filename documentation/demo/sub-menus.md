---
currentMenu: sub-menus  
---

# Demo: Submenus

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    /**************************************************
     * Context-Menu with Sub-Menu
     **************************************************/
    $.contextMenu({
        selector: '.context-menu-one', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        items: {
            "edit": {"name": "Edit", "icon": "edit"},
            "cut": {"name": "Cut", "icon": "cut"},
            "sep1": "---------",
            "quit": {"name": "Quit", "icon": "quit"},
            "sep2": "---------",
            "fold1": {
                "name": "Sub group", 
                "items": {
                    "fold1-key1": {"name": "Foo bar"},
                    "fold2": {
                        "name": "Sub group 2", 
                        "items": {
                            "fold2-key1": {"name": "alpha"},
                            "fold2-key2": {"name": "bravo"},
                            "fold2-key3": {"name": "charlie"}
                        }
                    },
                    "fold1-key3": {"name": "delta"}
                }
            },
            "fold1a": {
                "name": "Other group", 
                "items": {
                    "fold1a-key1": {"name": "echo"},
                    "fold1a-key2": {"name": "foxtrot"},
                    "fold1a-key3": {"name": "golf"}
                }
            }
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>