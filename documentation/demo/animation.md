---
currentMenu: animation
---

# Demo: Animation Options

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Both elements below share the same menu. It fades in slowly and out quickly, and because
`animateOnReopen` is `false` it simply moves to the new position when you right click the
other element while the menu is still open.

<span class="context-menu-one btn btn-neutral">right click me</span>
<span class="context-menu-one btn btn-neutral">and then right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu({
        selector: '.context-menu-one',
        animation: {
            // used for the show animation
            showDuration: 400,
            // used for the hide animation
            hideDuration: 100,
            // both fall back to `duration` when not set
            duration: 250,
            show: 'fadeIn',
            hide: 'fadeOut',
            // don't replay the show animation when this menu is already visible
            animateOnReopen: false
        },
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: {
            "edit": {name: "Edit", icon: "edit"},
            "cut": {name: "Cut", icon: "cut"},
            "copy": {name: "Copy", icon: "copy"},
            "paste": {name: "Paste", icon: "paste"},
            "delete": {name: "Delete", icon: "delete"}
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
