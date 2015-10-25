---
currentMenu: menu-title  
---

# Demo: Menu Title


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example CSS](#example-css)
- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


<span class="context-menu-one btn btn-neutral">right click me</span>
<span class="context-menu-two btn btn-neutral">right click me</span>
<span class="context-menu-three btn btn-neutral">right click me</span>



## Example CSS

<style type="text/css" class="showcase">
    /* menu header */
    .css-title:before {
        content: "some CSS title";
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        background: #DDD;
        padding: 2px;
    
        font-family: Verdana, Arial, Helvetica, sans-serif;
        font-size: 11px;
        font-weight: bold;
    }
    .css-title :first-child {
        margin-top: 20px;
    }
    
    /* menu header via data attribute */
    .data-title:before {
        content: attr(data-menutitle);
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        background: #DDD;
        padding: 2px;
    
        font-family: Verdana, Arial, Helvetica, sans-serif;
        font-size: 11px;
        font-weight: bold;
    }
    .data-title :first-child {
        margin-top: 20px;
    }
</style>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    // register regular menu
    $.contextMenu({
        selector: '.context-menu-one',
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
            "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
        }
    });
    
    // register menu with title provided by CSS
    $.contextMenu({
        selector: '.context-menu-two',
        className: 'css-title',
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
            "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
        }
    });
    
    // register menu with title provided by data-attribute
    $.contextMenu({
        selector: '.context-menu-three',
        className: 'data-title',
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
            "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
        }
    });
    
    // set a title
    $('.data-title').attr('data-menutitle', "Some JS Title");
});
</script>

## Example HTML

```html
<span class="context-menu-one btn btn-neutral">right click me</span>

<span class="context-menu-two btn btn-neutral">right click me</span>

<span class="context-menu-three btn btn-neutral">right click me</span>
```



