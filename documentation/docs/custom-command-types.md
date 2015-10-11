---
currentMenu: custom-command-types
---

# Custom Command Types

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Besides the built-in command types custom handlers can be defined. The command generator must be placed in `$.contextMenu.types`. It is identified by the key given in that object. The generator function is executed in the context of the new command's `<li>` within the menu. item is the object passed at creation. Use this to pass values from your definition to the generator. `opt` is the current menu level, `root` is the menu's root-level `opt` (relevant for sub-menus only).

A custom command type can be whatever you like it to be, it can behave how ever you want it to behave. Besides the keyboard interaction paradigm (`up`, `down`, `tab`, `escape`) key-events are passed on to the `<li>` which can be accessed via `$(this).on('keydown', …);`

Note that you'll probably want to disable default action handling (click, pressing enter) in favor of the custom command's behavior.

```javascript
$.contextMenu.types.myType = function(item, opt, root) {
    $('<span>' + item.customName + '</span>').appendTo(this);
    this.on('contextmenu:focus', function(e) {
        // setup some awesome stuff
    }).on('contextmenu:blur', function(e) {
        // tear down whatever you did
    }).on('keydown', function(e) {
        // some funky key handling, maybe?
    });
};
$.contextMenu({
    selector: '.context-menu-custom', 
    items: {
        label: {type: "myType", customName: "Foo Bar"}
    }
});
```