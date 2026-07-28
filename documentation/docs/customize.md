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
            $itemElement.prepend('<svg class="context-menu-icon" ...>...</svg>');
            return 'context-menu-icon-inline';
        }
    }
}
```

## Customize CSS

You can use the _variables.scss to adjust variables on pretty much everything you want to change.
