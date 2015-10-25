---
currentMenu: on-dom-element
---

# Demo: Context Menu on DOM Element

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<ul id="the-node">
    <li><span class="context-menu-one btn btn-neutral">right click me 1</span></li>
    <li><span class="context-menu-one btn btn-neutral">right click me 2</span></li>
    <li>right click me 3</li>
    <li>right click me 4</li>
</ul>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $('#the-node').contextMenu({
        selector: 'li', 
        callback: function(key, options) {
            var m = "clicked: " + key + " on " + $(this).text();
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

```html
<ul id="the-node">
    <li><span class="context-menu-one btn btn-neutral">right click me 1</span></li>
    <li><span class="context-menu-one btn btn-neutral">right click me 2</span></li>
    <li>right click me 3</li>
    <li>right click me 4</li>
</ul>

```
