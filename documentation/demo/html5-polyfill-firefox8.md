---
currentMenu: html5-polyfill-firefox8 
---

# Demo: HTML5 Polyfill (Firefox)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<span class="context-menu-one btn btn-neutral" contextmenu="html5firefox8">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu('html5');
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>

```html
<menu id="html5firefox8" type="context" >
  <menuitem label="rotate" onclick="alert('rotate')" hint="I'm a hint"></menuitem>
  <menuitem label="resize" onclick="alert('resize')"></menuitem>
  <menuitem label="disabled" onclick="alert('disabled')" disabled></menuitem>
  <menu label="share">
    <menuitem label="twitter" onclick="alert('twitter')"></menuitem>
    <menuitem label="facebook" onclick="alert('facebook')"></menuitem>
    <hr>
    <menuitem type="checkbox" label="(checkbox) yes or no?" 
        onclick="alert('checkbox: ' + (this.checked ? 'yep!' : 'nope'))"></menuitem>
    <hr>
    <menuitem type="radio" label="(radio) yes" radiogroup="alpha" checked 
        onclick="alert('radio: yes')"></menuitem>
    <menuitem type="radio" label="(radio) no" radiogroup="alpha" 
        onclick="alert('radio: no')"></menuitem>
  </menu>
</menu>
```


<menu id="html5firefox8" type="context">
  <menuitem label="rotate" onclick="alert('rotate')" hint="I'm a hint"></menuitem>
  <menuitem label="resize" onclick="alert('resize')"></menuitem>
  <menuitem label="disabled" onclick="alert('disabled')" disabled></menuitem>
  <menu label="share">
    <menuitem label="twitter" onclick="alert('twitter')"></menuitem>
    <menuitem label="facebook" onclick="alert('facebook')"></menuitem>
    <hr>
    <menuitem type="checkbox" label="(checkbox) yes or no?" 
        onclick="alert('checkbox: ' + (this.checked ? 'yep!' : 'nope'))"></menuitem>
    <hr>
    <menuitem type="radio" label="(radio) yes" radiogroup="alpha" checked 
        onclick="alert('radio: yes')"></menuitem>
    <menuitem type="radio" label="(radio) no" radiogroup="alpha" 
        onclick="alert('radio: no')"></menuitem>
  </menu>
</menu>