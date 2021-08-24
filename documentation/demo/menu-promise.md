---
currentMenu: menu-promise 
---

# Demo: Submenu through promise (asynchronous)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<h3>right-clickable context menus</h3>
<ul>
  <li><label for="immediate">immediate:</label><input id="immediate"/></li>
  <li><label for="async">async:</label><input id="async"/></li>
</ul>

## Example code

<script type="text/javascript" class="showcase">
    $(function() {
        // normally, contextMenu sets up a handler for right click
        $.contextMenu({
            selector: '#immediate',
            callback: menuCallback,
            items: buildMenuItems()
        });
    
        // for async menus, we set up a handler and a menu for it to call
        $('#async').on('contextmenu', rightClickHandler)
        $.contextMenu({
            selector: '#async',
            trigger: 'none',
            build: function($trigger, e) {
                // return callback set by the mouseup handler
                return $trigger.data('runCallbackThingie')();
            }
        });
    
        function buildMenuItems () {
            return {
                "GTA": {name: "Lysine", icon: "edit"},
                "TGG": {name: "Tryptophan", icon: "cut"},
                "TTC": {name: "Phenylalanine", icon: "copy"}
            }
        }
    
        // asynchronous menu item construction takes one second
        function buildMenuItemsPromise () {
            return new Promise((accept, reject) => {
                setTimeout(() => accept(buildMenuItems()), 1000)
            })
        }
    
        // right-click handler enables mouseup handler
        function rightClickHandler (e) {
            e.preventDefault();
            const $this = $(this);
            $this.off('contextmenu', rightClickHandler);
    
            // when the items are ready,
            buildMenuItemsPromise().then(items => {
    
                // store a callback on the trigger
                $this.data('runCallbackThingie', function () {
                    return {
                        callback: menuCallback,
                        items: items
                    };
                });
                const _offset = $this.offset(),
                        position = {
                            x: _offset.left + 10,
                            y: _offset.top + 10
                        }
                $this.contextMenu(position);
    
                $this.on('contextmenu', rightClickHandler)
            });
        }
    
        // callback insert letters over the selection
        function menuCallback (key, options) {
            const contents = $(this).val(),
                        start = this.get(0).selectionStart,
                        end = this.get(0).selectionEnd
            $(this).val(contents.substr(0, start)
                                    + key
                                    + contents.substr(end)
            )
        }
    });
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
