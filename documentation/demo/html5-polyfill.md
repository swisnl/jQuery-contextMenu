# Demo: HTML5 Polyfill

`jQuery.contextMenu` allows you to import HTML5's &lt;menu&gt; structures to use in older browsers. 

<span class="context-menu-one label label-default" contextmenu="html5polyfill">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu('html5');
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>

<menu id="html5polyfill" type="context" style="display:none" class="showcase">  
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