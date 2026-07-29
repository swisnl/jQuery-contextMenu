---
currentMenu: input-rename-trigger
---

# Demo: Renaming the trigger from an input command

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Item level [`events`](../docs/items.html#events) handlers are bound with the menu's
options object as jQuery event data, so `e.data.$trigger` is the element that opened
the menu. Inside the handler `this` is the `<input>` itself, exactly like any other
jQuery event handler.

Both buttons below share a single menu definition. Left-click one, type a new label
and click somewhere else so the input loses focus. The button you clicked is renamed,
the other one is not.

<button class="context-menu-rename btn btn-neutral">Button one</button>
<button class="context-menu-rename btn btn-neutral">Button two</button>

## Example code

<script type="text/javascript" class="showcase">
$(function(){
    $.contextMenu({
        selector: '.context-menu-rename',
        trigger: 'left',
        items: {
            label: {
                name: "Label",
                type: 'text',
                events: {
                    focus: function(e) {
                        // `e.data` is the menu's options object, `$trigger` is the
                        // element the menu was opened on
                        $(this).val(e.data.$trigger.text());
                    },
                    focusout: function(e) {
                        // `this` is the <input>, so write its value back onto the
                        // button that opened this menu
                        e.data.$trigger.text($(this).val());
                    }
                }
            },
            sep1: "---------",
            close: {
                name: "Close",
                callback: $.noop
            }
        }
    });
});
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-rename"></div>
