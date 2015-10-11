---
currentMenu: html5-polyfill
---

# HTML5 `<menu>` shiv/polyfill

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [HTML5 `<menu>` import](#html5-menu-import)
- [HTML5 `<menu>` shiv/polyfill](#html5-menu-shivpolyfill)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## HTML5 `<menu>` import

considering the following HTML `$.contextMenu.fromMenu($('#html5menu'))` will return a proper items object.

```
<menu id="html5menu" type="context" style="display:none">
  <command label="rotate" onclick="alert('rotate')">
  <command label="resize" onclick="alert('resize')">
  <menu label="share">
    <command label="twitter" onclick="alert('twitter')">
    <hr>
    <command label="facebook" onclick="alert('facebook')">
  </menu>
</menu>
```


`$.contextMenu.fromMenu()` will properly import (and thus handle) the following elements. Everything else is imported as `{type: "html"}`

```
<menu>
<hr>
<a>
<command type="command|radio|checkbox"> (W3C Specification)
<menuitem type="command|radio|checkbox"> (Firefox)
<input type="text|radio|checkbox">
<select>
<textarea>
<label for="someId">
<label> the text <input|textarea|select>
```

The `<menu>` must be hidden but not removed, as all command events (clicks) are passed-thru to the original command element!

Note: While the specs note `<option>`s to be renderd as regular commands, `$.contextMenu` will render an actual `<select>`.

## HTML5 `<menu>` shiv/polyfill

Engaging the HTML5 polyfill (ignoring `$.contextMenu` if context menus are available natively):

```
$(function(){ 
    $.contextMenu("html5"); 
});
```

Engaging the HTML5 polyfill (ignoring browser native implementation):

```
$(function(){ 
    $.contextMenu("html5", true); 
});
```
