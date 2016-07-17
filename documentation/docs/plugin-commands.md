---
currentMenu: plugin-commands
---

# Plugin commands

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Disable a contextMenu trigger](#disable-a-contextmenu-trigger)
- [Enable a contextMenu trigger](#enable-a-contextmenu-trigger)
- [Manually show a contextMenu](#manually-show-a-contextmenu)
- [Manually hide a contextMenu](#manually-hide-a-contextmenu)
- [Unregister all contextMenus](#unregister-all-contextmenus)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Disable a contextMenu trigger

disable contextMenu to be shown on specified trigger elements

```
$(".some-selector").contextMenu(false);
```


## Enable a contextMenu trigger

enable contextMenu to be shown on specified trigger elements

```
$(".some-selector").contextMenu(true);
```

## Manually show a contextMenu

show the contextMenu of the first element of the selector (position determined by determinePosition):

```
$(".some-selector").contextMenu();
$(".some-selector").contextMenu({x: 123, y: 123});
```

## Manually hide a contextMenu

hide the contextMenu of the first element of the selector:

```
$(".some-selector").contextMenu("hide");
Unregister contextMenu
```

## Unregister a specific contextMenu

To unregister / destroy a specific contextMenu:

```
$.contextMenu( 'destroy', selector );
```

selector expects the (string) selector that the contextMenu was registered to

## Unregister all contextMenus

To unregister / destroy all contextMenus:

```
$.contextMenu( 'destroy' );
```

