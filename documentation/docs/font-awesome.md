---
currentMenu: font-awesome
---

## Customize icons

It is possible to use font-awesome icons if you like. You need to include the [Font Awesome CSS](https://www.bootstrapcdn.com/fontawesome/) in your application. That will enable you to use the icon classes to use those icons.

Check out the [demo](https://swisnl.github.io/jQuery-contextMenu/demo/fontawesome-icons)

## Bring your own icons

It is also possible to use your own SVG icons if you like, you can [customize](customize) this by using the SASS files.

## Supported Font Awesome versions

Include the Font Awesome CSS for the version you use, then pass its classes as
the item's [icon](items#icon). The contextmenu creates the `i` tag for the icon
inside the menu item and adjusts its own CSS accordingly. Every version from 4
to 7 works, using that version's own syntax:

```javascript
var items = {
    // Font Awesome 4
    a: {name: "Beer", icon: "fa-beer"},          // shorthand, `fa` is added for you
    b: {name: "Beer", icon: "fa fa-beer"},       // or the full v4 syntax

    // Font Awesome 5
    c: {name: "Beer", icon: "fas fa-beer"},
    d: {name: "GitHub", icon: "fab fa-github"},

    // Font Awesome 6 and 7, which name the family and the style separately
    e: {name: "Beer", icon: "fa-solid fa-beer"},
    f: {name: "Beer", icon: "fa-regular fa-beer"},
    g: {name: "GitHub", icon: "fa-brands fa-github"},
    h: {name: "Beer", icon: "fa-sharp fa-solid fa-beer"},
    i: {name: "Beer", icon: "fa-sharp-duotone fa-solid fa-beer"},

    // per-pack short prefixes work too
    j: {name: "Beer", icon: "fasds fa-beer"}
}
```

Anything containing a `fa-` class is treated as Font Awesome and passed through
to the `i` tag unchanged, so a family or style added in a future release needs
no change here. The one exception is the version 4 shorthand: when the class
list does not say which family or style to use, the base `fa` class is supplied
so `icon: "fa-beer"` keeps working on its own.

A single word with no `fa-` in it stays a [built-in icon](customize) name, so
`icon: "edit"` still refers to this plugin's own icon font rather than to Font
Awesome.

The menu item itself gets a `context-menu-icon--fa5` class, which the stylesheet
uses to position the child icon. The name is historical: it applies to every
Font Awesome version, not just 5, and is kept as-is so existing custom CSS keeps
matching.
