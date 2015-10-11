---
currentMenu: events
---

# Events

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [contextmenu](#contextmenu)
- [prevcommand](#prevcommand)
- [nextcommand](#nextcommand)
- [contextmenu:hide](#contextmenuhide)
- [contextmenu:focus](#contextmenufocus)
- [contextmenu:blur](#contextmenublur)
- [keydown](#keydown)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


List of events that are triggered on the menu. You can manually trigger some events to control the menu.

## contextmenu

`contextmenu` : Trigger context menu to be shown for a trigger object.

Available on trigger object. The Event must be supplied with coordinates for the menu: `{pageX: 123, pageY:123}`

```
$('.context-menu-one').first().trigger(
  $.Event('contextmenu', {pageX: 123, pageY: 123})
);
$('.context-menu-one').first().trigger("contextmenu");
```

will invoke `determinePosition` to position the menu.

## prevcommand

`prevcommand` : Select / highlight the previous possible command

Available on context menu.

```
opt.$menu.trigger("prevcommand");
```



## nextcommand
`nextcommand` : Select / highlight the next possible command

Available on context menu.

```
opt.$menu.trigger("nextcommand");
```

## contextmenu:hide

`contextmenu:hide` : Hide the menu

Available on context menu.

```
opt.$menu.trigger("contextmenu:hide");
```

## contextmenu:focus

`contextmenu:focus` : React to a command item being focused

Triggered on context menu item when mouse or keyboard interaction lead to a "hover state" for that command item.

```
$(document.body).on("contextmenu:focus", ".context-menu-item", 
    function(e){ 
        console.log("focus:", this); 
    }
);
```

## contextmenu:blur

`contextmenu:blur` :  Available on each context menu item.

Triggered on context menu item when mouse or keyboard interaction lead from a "hover state" to "default state" for that command item.

```
$(document.body).on("contextmenu:blur", ".context-menu-item",
    function(e){ 
        console.log("blur:", this);    
    }
);
```

        
## keydown

`keydown` : Available on each context menu item.

Triggered on context menu item when keyboard interaction could not be handled by jQuery.contextMenu.

```
$(document.body).on("keydown", ".context-menu-item",
    function(e){ 
        console.log("key:", e.keyCode);    
    }
);
```
