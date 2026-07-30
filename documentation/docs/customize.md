---
currentMenu: custom-icons
---

## Customize icons

You can add icons to src/icons and run ``gulp build-icons``. This will make the icons available for use in the contextmenu using the icon property.

So for example the file checkmark.svg wil result in the CSS context-menu-icon-checkmark which you can use by using the [icon option](items#icon) when defining a menu item.

Is is also possible to just use FontAwesome icons, see the [demo of FontAwesome](https://swisnl.github.io/jQuery-contextMenu/demo/fontawesome-icons). 

### Example

```javascript
var items = {
    firstCommand: {        
        name: "Paste",
        icon: "checkmark" // Class context-menu-icon-checkmark is used on the menu item. This is generated from checkmark.svg
    }
}
```

Font-Awesome icons used from [encharm/Font-Awesome-SVG-PNG](https://github.com/encharm/Font-Awesome-SVG-PNG). You can download more there if you like.

Finally, you will need to re-build the CSS using [`sass`](http://sass-lang.com), otherwise you may see mismatchings between the icon references. Use the command ``gulp css`` to re-build the CSS in the dist directory. The new CSS files will contain the icons you added.

### Using your own SVG icons without a build step

The `gulp build-icons` pipeline above compiles the SVGs in `src/icons` into an icon font, which is meant for icons you want bundled into this package's own build. If you just want to use your own SVG icons in your project, you don't need to fork or build anything, since the [icon option](items#icon) already supports both of the following, plain CSS approaches:

```javascript
var items = {
    firstCommand: {
        name: "Paste",
        // context-menu-icon-checkmark must be defined in your own CSS, e.g.
        // .context-menu-icon-checkmark { background-image: url(checkmark.svg); }
        icon: "checkmark"
    },
    secondCommand: {
        name: "Copy",
        // or inject an inline <svg> (or <img>) directly into the item and
        // return a class name to mark it as done (see the icon option docs)
        icon: function (opt, $itemElement) {
            // A callback icon runs again every time the menu is shown or
            // updated, not just once, so anything that adds to the item has to
            // check first. Without the guard every open would prepend another
            // <svg> and the item would keep growing.
            if (!$itemElement.children('svg.my-inline-icon').length) {
                $itemElement.prepend('<svg class="my-inline-icon" ...>...</svg>');
            }
            return 'context-menu-icon-inline';
        }
    }
}
```

Give the injected element a class of your own rather than `context-menu-icon`,
which this plugin already uses on the menu item itself.

Anything that replaces the item's content instead of adding to it is idempotent
on its own and needs no guard, which is why the
[icon option](items#icon) example can call `$itemElement.html(...)` directly.

## Customize CSS

You can use the _variables.scss to adjust variables on pretty much everything you want to change.
