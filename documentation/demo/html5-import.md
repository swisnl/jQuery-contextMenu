# Demo: Importing HTML5 &lt;menu type=&quot;context&quot;&gt;

`jQuery.contextMenu` allows you to import HTML5's &lt;menu&gt; structures to use in older browsers. 

<span class="context-menu-one label label-default">right click me</span>

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

<menu id="html5menu" type="context" style="display:none" class="showcase">
  <command label="rotate" icon="edit" onclick="alert('rotate')">
  <command label="resize" onclick="alert('resize')">
  <menu label="share">
    <command label="twitter" onclick="alert('twitter')">
    <hr>
    <command label="facebook" onclick="alert('facebook')">
  </menu>
</menu>