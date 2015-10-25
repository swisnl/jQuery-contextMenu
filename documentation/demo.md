---
currentMenu: simple-context-menu
---

# Demo: Simple Context Menu

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code: Simple Context Menu](#example-code-simple-context-menu)
- [Example HTML: Simple Context Menu](#example-html-simple-context-menu)
- [jQuery Context Menu Demo Gallery](#jquery-context-menu-demo-gallery)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code: Simple Context Menu

<script type="text/javascript" class="showcase">
    $(function() {
        $.contextMenu({
            selector: '.context-menu-one', 
            callback: function(key, options) {
                var m = "clicked: " + key;
                window.console && console.log(m) || alert(m); 
            },
            items: {
                "edit": {name: "Edit", icon: "edit"},
                "cut": {name: "Cut", icon: "cut"},
               copy: {name: "Copy", icon: "copy"},
                "paste": {name: "Paste", icon: "paste"},
                "delete": {name: "Delete", icon: "delete"},
                "sep1": "---------",
                "quit": {name: "Quit", icon: function(){
                    return 'context-menu-icon context-menu-icon-quit';
                }}
            }
        });
        
        $('.context-menu-one').on('click', function(e){
            console.log('clicked', this);
        })    
    });
</script>

## Example HTML: Simple Context Menu
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>

## jQuery Context Menu Demo Gallery

*   [Simple Context Menu](demo.html)
*   [Context Menu on DOM Element](demo/on-dom-element.html)
*   [Adding new Context Menu Triggers](demo/dynamic.html)
*   [Create Context Menu on demand](demo/dynamic-create.html)
*   [Create Context Menu (asynchronous)](demo/async-create.html)
*   [Keeping the context menu open](demo/keeping-contextmenu-open.html)
*   [Command's action (callbacks)](demo/callback.html)
*   [Left-Click Trigger](demo/trigger-left-click.html)
*   [Swipe Trigger](demo/trigger-swipe.html)
*   [Hover Activated Context Menu](demo/trigger-hover.html)
*   [Hover Activated Context Menu With Autohide](demo/trigger-hover-autohide.html)
*   [Custom Activated Context Menu](demo/trigger-custom.html)
*   [Disabled Menu](demo/disabled-menu.html)
*   [Disabled Command](demo/disabled.html)
*   [Disabled Callback Command](demo/disabled-callback.html)
*   [Changing Command's disabled status](demo/disabled-changing.html)
*   [Accesskeys](demo/accesskeys.html)
*   [Submenus](demo/sub-menus.html)
*   [Input Commands](demo/input.html)
*   [Custom Command Types](demo/custom-command.html)
*   [Menus with titles](demo/menu-title.html)
*   [Importing HTML5 <menu type="context">](demo/html5-import.html)
*   [HTML5 Polyfill](demo/html5-polyfill.html)
*   [HTML5 Polyfill (Firefox)](demo/html5-polyfill-firefox8.html)
