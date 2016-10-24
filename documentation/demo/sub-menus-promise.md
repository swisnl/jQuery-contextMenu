---
currentMenu: sub-menus-promise  
---

# Demo: Submenus with promise

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
var errorItems = { "errorItem": { name: "Could not load items" },};//example usage if you want to reject promise
    var loadItems = function () {//example method that will eventually do an async call
        var dfd = jQuery.Deferred();
        setTimeout(function () {
            dfd.resolve(subItems);
        }, 1000);
        //setTimeout(function () {
        //    dfd.reject(errorItems);
        //}, 1000); //could be used to reject items, providing the same format list.
        return dfd.promise();//return a jquery promise, see http://api.jquery.com/deferred.promise/
    };

    var subItems = {
        "sub1": { name: "Submenu1", icon: "edit" },
        "sub2": { name: "Submenu2", icon: "cut" },
    };
    //normal context menu initialization.
    $.contextMenu({
        selector: '.context-menu-one',
        build: function ($trigger, e) {
            return {
                callback: function (key, options) {
                    var m = "clicked: " + key;
                    console.log(m);
                },
                items: {
                    "edit": { name: "Edit", icon: "edit" },
                    "cut": { name: "Cut", icon: "cut" },
                    "status": {
                        name: "Status",
                        icon: "delete",
                        items: loadItems(),//providing promise instead of items
                    },
                }
            };
        }
    });
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
