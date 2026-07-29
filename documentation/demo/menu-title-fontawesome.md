---
currentMenu: menu-title-fontawesome
---

# Demo: Menu Title with Font Awesome icons


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example CSS](#example-css)
- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

Combining a [menu title](menu-title.html) with [Font Awesome icons](fontawesome-icons.html).
The icons stay vertically centered in their item, whether the menu has a title or not.

<span class="context-menu-fa-title btn btn-neutral">right click me (with title)</span>
<span class="context-menu-fa-plain btn btn-neutral">right click me (no title)</span>

## Example CSS

Note the child combinator in `> :first-child`: the top margin is only meant for
the first menu item, so that the title has room. Without it the rule also
matches the `<i>` element that the plugin creates for a Font Awesome icon,
and the label of an input item, since those are the first child of their own
menu item.

<style type="text/css" class="showcase">
    /* menu header */
    .menu-title-fa:before {
        content: "Font Awesome title";
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
    .menu-title-fa > :first-child {
        margin-top: 20px;
    }
</style>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    var items = {
        "edit": {name: "Edit", icon: "fas fa-edit"},
        "cut": {name: "Beer", icon: "fas fa-beer"},
        "copy": {name: "Cloud download", icon: "fas fa-cloud-download-alt"},
        "paste": {name: "Certificate", icon: "fas fa-certificate"}
    };

    // menu with a title provided by CSS
    $.contextMenu({
        selector: '.context-menu-fa-title',
        className: 'menu-title-fa',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: items
    });

    // the same menu without a title, for comparison
    $.contextMenu({
        selector: '.context-menu-fa-plain',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: items
    });
});
</script>

## Example HTML

```html
<span class="context-menu-fa-title btn btn-neutral">right click me (with title)</span>

<span class="context-menu-fa-plain btn btn-neutral">right click me (no title)</span>
```
