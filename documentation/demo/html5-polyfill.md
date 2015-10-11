---
currentMenu: html5-polyfill 
---

# Demo: HTML5 Polyfill

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

`jQuery.contextMenu` allows you to import HTML5's &lt;menu&gt; structures to use in older browsers. 

<span class="context-menu-one btn btn-neutral" contextmenu="html5polyfill">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu('html5');
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>

```html
<menu id="html5polyfill" type="context" style="display:none">  
    <command label="rotate" onclick="alert('rotate')" icon="images/cut.png">
    <command label="resize" onclick="alert('resize')" icon="images/door.png">
    <menu label="share">
        <command label="twitter" onclick="alert('twitter')" icon="images/page_white_copy.png">
        <hr>
        <command label="facebook" onclick="alert('facebook')" icon="images/page_white_edit.png">
        <hr>
        <label>foo bar<input type="text" name="foo"></label>
    </menu>
</menu>
```

<menu id="html5polyfill" type="context" style="display:none">  
    <command label="rotate" onclick="alert('rotate')" icon="images/cut.png">
    <command label="resize" onclick="alert('resize')" icon="images/door.png">
    <menu label="share">
        <command label="twitter" onclick="alert('twitter')" icon="images/page_white_copy.png">
        <hr>
        <command label="facebook" onclick="alert('facebook')" icon="images/page_white_edit.png">
        <hr>
        <label>foo bar<input type="text" name="foo"></label>
    </menu>
</menu>