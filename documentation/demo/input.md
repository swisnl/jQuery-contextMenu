---
currentMenu: input 
---

# Demo: Input Commands

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu({
        selector: '.context-menu-one', 
        items: {
            // <input type="text">
            name: {
                name: "Text", 
                type: 'text', 
                value: "Hello World", 
                events: {
                    keyup: function(e) {
                        // add some fancy key handling here?
                        window.console && console.log('key: '+ e.keyCode); 
                    }
                }
            },
            sep1: "---------",
            // <input type="checkbox">
            yesno: {
                name: "Boolean", 
                type: 'checkbox', 
                selected: true
            },
            sep2: "---------",
            // <input type="radio">
            radio1: {
                name: "Radio1", 
                type: 'radio', 
                radio: 'radio', 
                value: '1'
            },
            radio2: {
                name: "Radio2", 
                type: 'radio', 
                radio: 'radio', 
                value: '2', 
                selected: true
            },
            radio3: {
                name: "Radio3", 
                type: 'radio', 
                radio: 'radio', 
                value: '3'
            },
            radio4: {
                name: "Radio3", 
                type: 'radio', 
                radio: 'radio', 
                value: '4', 
                disabled: true
            },
            sep3: "---------",
            // <select>
            select: {
                name: "Select", 
                type: 'select', 
                options: {1: 'one', 2: 'two', 3: 'three'}, 
                selected: 2
            },
            // <textarea>
            area1: {
                name: "Textarea with height", 
                type: 'textarea', 
                value: "Hello World", 
                height: 40
            },
            area2: {
                name: "Textarea", 
                type: 'textarea', 
                value: "Hello World"
            },
            sep4: "---------",
            key: {
                name: "Something Clickable", 
                callback: $.noop
            }
        }, 
        events: {
            show: function(opt) {
                // this is the trigger element
                var $this = this;
                // import states from data store 
                $.contextMenu.setInputValues(opt, $this.data());
                // this basically fills the input commands from an object
                // like {name: "foo", yesno: true, radio: "3", …}
            }, 
            hide: function(opt) {
                // this is the trigger element
                var $this = this;
                // export states to data store
                $.contextMenu.getInputValues(opt, $this.data());
                // this basically dumps the input commands' values to an object
                // like {name: "foo", yesno: true, radio: "3", …}
            }
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>