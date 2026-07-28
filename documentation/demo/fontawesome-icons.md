---
currentMenu: fontawesome-icons
---

# Demo: FontAwesome icons

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

The menu allows you to use [FontAwesome](http://fontawesome.io/) [icons](http://fontawesome.io/icons/) in your menu. Just include the CSS for FontAwesome and you are ready to go.

With Font Awesome 5/6, always prefix the icon name with its style class (`fas `, `far `, `fab `, `fad ` or `fal `), e.g. `icon: "fas fa-edit"`. Using just the icon name (e.g. `icon: "fa-edit"`) is only kept for backwards compatibility with Font Awesome 4 and may not render correctly with newer Font Awesome versions/kits.

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
            "edit": {name: "Edit", icon: "fas fa-edit"},
            "cut": {name: "Beer", icon: "fas fa-beer"},
            copy: {name: "Cloud download", icon: "fas fa-cloud-download-alt"},
            "paste": {name: "Certificate", icon: "fas fa-certificate"}
        }
    });

    $('.context-menu-one').on('click', function(e){
        console.log('clicked', this);
    })
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
