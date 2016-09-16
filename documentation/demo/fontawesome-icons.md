---
currentMenu: accesskeys
---

# Demo: FontAwesome icons

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

The menu allows you to use [FontAwesome](http://fontawesome.io/) [icons](http://fontawesome.io/icons/) in your menu. Just include the CSS for FontAwesome and you are ready to go.

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
 $(function() {
    $.contextMenu({
        selector: '.context-menu-one',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: {
            "edit": {name: "Edit", icon: "fa-edit"},
            "cut": {name: "Beer", icon: "fa-beer"},
            copy: {name: "Cloud download", icon: "fa-cloud-download"},
            "paste": {name: "Certificate", icon: "fa-certificate"}
        }
    });

    $('.context-menu-one').on('click', function(e){
        console.log('clicked', this);
    })
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
