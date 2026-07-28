---
currentMenu: sub-menu-select
---

# Demo: Select input nested in a sub-sub-menu

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
     * Context-Menu with a `type: 'select'` item nested
     * two levels deep, to reproduce #744 (choosing an
     * option in Firefox closed the menu)
     **************************************************/
    $.contextMenu({
        selector: '.context-menu-one',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: {
            "fold1": {
                "name": "Sub group",
                "items": {
                    "fold2": {
                        "name": "Sub group 2",
                        "items": {
                            "my-select": {
                                "name": "Choose",
                                "type": "select",
                                "options": {"opt1": "Option 1", "opt2": "Option 2", "opt3": "Option 3"},
                                "selected": "opt1"
                            }
                        }
                    }
                }
            }
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
