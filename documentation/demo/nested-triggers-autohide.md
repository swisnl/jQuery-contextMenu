---
currentMenu: nested-triggers-autohide  
---

# Demo: Nested Triggers With Autohide

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<span class="context-menu-two btn btn-neutral" style="display: block; width: 480px; height: 240px;">
    <span class="context-menu-one btn btn-neutral">left click me!</span>
    <br>
    right click anywhere in this box
</span>

<div style="height: 240px;"></div>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    var items = {
        "edit": {name: "Edit", icon: "edit"},
        "cut": {name: "Cut", icon: "cut"},
        "copy": {name: "Copy", icon: "copy"},
        "paste": {name: "Paste", icon: "paste"},
        "delete": {name: "Delete", icon: "delete"},
        "sep1": "---------",
        "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
    };

    $.contextMenu({
        selector: '.context-menu-one',
        className: 'menu-one',
        trigger: 'left',
        autoHide: true,
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: items
    });

    $.contextMenu({
        selector: '.context-menu-two',
        className: 'menu-two',
        trigger: 'right',
        autoHide: true,
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: items
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-two"></div>
