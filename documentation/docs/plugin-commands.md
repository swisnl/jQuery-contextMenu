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

`x` and `y` are **page** coordinates, the same space as `event.pageX` / `event.pageY`, so they include the document scroll. They are not viewport coordinates and they are not relative to the trigger element. Coming from a viewport-based source (`event.clientX` / `event.clientY`, `getBoundingClientRect()`, a canvas or map library) add the current scroll offset:

```
var rect = element.getBoundingClientRect();
$(".some-selector").contextMenu({
  x: rect.left + window.scrollX,
  y: rect.bottom + window.scrollY
});
```

When either `x` or `y` is missing or is not a number, which happens when they are read off an event that carries no pointer position such as a keyboard or synthetic one, the menu falls back to `determinePosition` and is positioned relative to the trigger element, just like `$(".some-selector").contextMenu()`.

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

`selector` expects the same value the contextMenu was registered with: either the CSS selector string, or - if the contextMenu was registered with an `Element` or jQuery object as its `selector` - that same `Element` / jQuery object.

## Unregister all contextMenus

To unregister / destroy all contextMenus:

```
$.contextMenu( 'destroy' );
```

