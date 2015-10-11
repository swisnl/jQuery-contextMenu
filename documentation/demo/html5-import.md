---
currentMenu: html5-import 
---

# Demo: Importing HTML5 `<menu type="context">`

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

`jQuery.contextMenu` allows you to import HTML5's `<menu>` structures to use in older browsers. 

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu({
        selector: '.context-menu-one', 
        items: $.contextMenu.fromMenu($('#html5menu'))
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>

```html
<menu id="html5menu" style="display:none" class="showcase">
  <command label="rotate" icon="edit" onclick="alert('rotate')">
  <command label="resize" onclick="alert('resize')"> 
    <command label="twitter" onclick="alert('twitter')">
    <hr> 
    <command label="facebook" onclick="alert('facebook')">
  </menu>
</menu>
```

<menu id="html5menu" type="context" style="display:none">
  <command label="rotate" icon="edit" onclick="alert('rotate')">
  <command label="resize" onclick="alert('resize')"> 
    <command label="twitter" onclick="alert('twitter')">
    <hr> 
    <command label="facebook" onclick="alert('facebook')">
  </menu>
</menu>
