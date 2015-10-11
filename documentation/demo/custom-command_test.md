<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Demo: Custom command](#demo-custom-command)
  - [Example code](#example-code)
  - [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Demo: Custom command

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    /**************************************************
     * Custom Command Handler
     **************************************************/
    $.contextMenu.types.label = function(item, opt, root) {
        // this === item.$node

        $('<span>Label</span><ul>'
            + '<li class="label1" title="label 1">label 1</li>'
            + '<li class="label2" title="label 2">label 2</li>'
            + '<li class="label3" title="label 3">label 3</li>'
            + '<li class="label4" title="label 4">label 4</li></ul>')
            .appendTo(this)
            .on('click', 'li', function() {
                var message = "text: " + $(this).text();      
                $('#msg').text($('#msg').text() + ' | ' + message);
                
                // hide the menu
                root.$menu.trigger('contextmenu:hide');
            });
            
        this.addClass('labels').on('contextmenu:focus', function(e) {
            // setup some awesome stuff
        }).on('contextmenu:blur', function(e) {
            // tear down whatever you did
        }).on('keydown', function(e) {
            // some funky key handling, maybe?
        });
    };
    
    /**************************************************
     * Context-Menu with custom command "label"
     **************************************************/
    $.contextMenu({
        selector: '.context-menu-one', 
        callback: function(key, options) {
            var message = "clicked: " + key;
            $('#msg').text(message);
        },
        items: {
            open: {name: "Open", callback: $.noop},
            label: {type: "label", customName: "Label"},
            edit: {name: "Edit", callback: $.noop}
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>

<div id="msg"></div>

<style type="text/css" class="showcase">
    .labels > ul {
        margin: 0; 
        padding: 0;
        list-style: none;
        display: block;
        float: none;
    }
    .labels > ul > li {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 1px solid #CCC;
        overflow: hidden;
        text-indent: -2000px;
    }
    .labels > ul > li.selected,
    .labels > ul > li:hover { border: 1px solid #000; }
    .labels > ul > li + li { margin-left: 5px; }
    .labels > ul > li.label1 { background: red; }
    .labels > ul > li.label2 { background: green; }
    .labels > ul > li.label3 { background: blue; }
    .labels > ul > li.label4 { background: yellow; }
</style>