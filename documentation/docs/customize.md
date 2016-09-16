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

## Customize CSS

You can use the _variables.scss to adjust variables on pretty much everything you want to change.
