---
currentMenu: async-promise 
---

# Demo: Submenu through promis (asynchronous)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example code](#example-code)
- [Example HTML](#example-html)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<span class="context-menu-one btn btn-neutral">right click me</span>

## Example code

<script type="text/javascript" class="showcase">
    var $ = jQuery;
    $(document).ready(function () {
        'use strict';
        var errorItems = { "errorItem": { name: "Items Load error" },};
        var loadItems = function () {
            var dfd = jQuery.Deferred();
            setTimeout(function () {
                dfd.resolve(subItems);
            }, 2000);
            //setTimeout(function () {
            //    dfd.reject(errorItems);
            //}, 1000);
            return dfd.promise();
        };

        var subItems = {
            "sub1": { name: "Submenu1", icon: "edit" },
            "sub2": { name: "Submenu2", icon: "cut" },
        };

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
                            items: loadItems(),
                        },
                        "normalSub": {
                            name: "Normal Sub",
                            items: {
                                "normalsub1": { name: "normal Sub 1"},
                                "normalsub2": { name: "normal Sub 2"},
                                "normalsub3": { name: "normal Sub 3" },
                            }
                        }
                    }
                };
            }
        });

        //normal promise usage example
        var completedPromise = function (status) {
            console.log("completed promise:", status);
        };

        var failPromise = function (status) {
            console.log("fail promise:", status);
        };

        var notifyPromise = function (status) {
            console.log("notify promise:", status);
        };

        $.loadItemsAsync = function() {
            console.log("loadItemsAsync");
            var promise = loadItems();
            $.when(promise).then(completedPromise, failPromise, notifyPromise);
        };

    });
</script>

## Example HTML
<div style="display:none;" class="showcase" data-showcase-import=".context-menu-one"></div>
