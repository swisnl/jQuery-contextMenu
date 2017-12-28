---
currentMenu: options
---
# Documentation

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Register new contextMenu](#register-new-contextmenu)
- [Update contextMenu state](#update-contextmenu-state)
- [Options (at registration)](#options-at-registration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Register new contextMenu

To register a new contextMenu:

* Note: For SVG support use jQuery >= 1.12|2.2

```javascript
$.contextMenu( options );
```

## Update contextMenu state

It is possible to refresh the state of the contextmenu [disabled](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#disabled), [visibility](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#visible), [icons](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#icon) and [input values](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#type) through the `update` command. This will reevaluate any custom callbacks. 

```javascript
$('.context-menu-one').contextMenu('update'); // update single menu
$.contextMenu('update') // update all open menus
```

## Options (at registration)

For documentation on possible options, check out the [API documentation of ContextMenuOptions](api/ContextMenuOptions.html).