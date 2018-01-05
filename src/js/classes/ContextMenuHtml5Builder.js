/**
 * @class ContextMenuHtml5Builder
 * @classdesc considering the following HTML `$.contextMenu.fromMenu($('#html5menu'))` will return a proper items object.

 ```
 <menu id="html5menu" type="context" style="display:none">
    <command label="rotate" onclick="alert('rotate')">
    <command label="resize" onclick="alert('resize')">
    <menu label="share">
        <command label="twitter" onclick="alert('twitter')">
        <hr>
        <command label="facebook" onclick="alert('facebook')">
    </menu>
 </menu>
 ```

 `$.contextMenu.fromMenu()` will properly import (and thus handle) the following elements. Everything else is imported as `{type: "html"}`

 ```
 <menu>
 <hr>
 <a>
 <command type="command|radio|checkbox"> (W3C Specification)
 <menuitem type="command|radio|checkbox"> (Firefox)
 <input type="text|radio|checkbox">
 <select>
 <textarea>
 <label for="someId">
 <label> the text <input|textarea|select>
 ```

 The `<menu>` must be hidden but not removed, as all command events (clicks) are passed-thru to the original command element!

 Note: While the specs note `<option>`s to be renderd as regular commands, `$.contextMenu` will render an actual `<select>`.

 ## HTML5 `<menu>` shiv/polyfill

 Engaging the HTML5 polyfill (ignoring `$.contextMenu` if context menus are available natively):

 ```
 $(function(){
    $.contextMenu("html5");
 });
 ```

 Engaging the HTML5 polyfill (ignoring browser native implementation):

 ```
 $(function(){
    $.contextMenu("html5", true);
 });
 ```

 */
export default class ContextMenuHtml5Builder {
    /**
     * Get the input label for the given node.
     *
     * @method inputLabel
     * @memberOf ContextMenuHtml5Builder
     * @instance
     *
     * @param {HTMLElement} node - Html element
     * @returns {string|JQuery|jQuery} - Input label element
     */
    inputLabel(node) {
        return (node.id && $('label[for="' + node.id + '"]').val()) || node.name;
    }

    /**
     * Helper function to build ContextMenuItems from an html5 menu element.
     *
     * @method fromMenu
     * @memberOf ContextMenuHtml5Builder
     * @instance
     *
     * @param {JQuery|string} element - Menu element or selector to generate the menu from.
     * @returns {Object.<string, ContextMenuItem>} - Collection of {@link ContextMenuItem}
     */
    fromMenu(element) {
        const $this = $(element);
        const items = {};

        this.build(items, $this.children());

        return items;
    }

    /**
     * Helper function for building a menu from a HTML menu element.
     *
     * @method build
     * @memberOf ContextMenuHtml5Builder
     * @instance
     *
     * @param {Object.<string, ContextMenuItem>} items - {@link ContextMenuItem} object to build.
     * @param {(JQuery)} $children - Collection of elements inside the `<menu>` element
     * @param {number?} counter - Counter to generate {@link ContextMenuItem} key names.
     * @returns {number} - Counter to generate {@link ContextMenuItem} key names.
     */
    build(items, $children, counter) {
        if (!counter) {
            counter = 0;
        }

        let builder = this;

        $children.each(function () {
            let $node = $(this);
            let node = this;
            let nodeName = this.nodeName.toLowerCase();
            let label;
            let item;

            // extract <label><input>
            if (nodeName === 'label' && $node.find('input, textarea, select').length) {
                label = $node.text();
                $node = $node.children().first();
                node = $node.get(0);
                nodeName = node.nodeName.toLowerCase();
            }

            /*
             * <menu> accepts flow-content as children. that means <embed>, <canvas> and such are valid menu items.
             * Not being the sadistic kind, $.contextMenu only accepts:
             * <command>, <menuitem>, <hr>, <span>, <p> <input [text, radio, checkbox]>, <textarea>, <select> and of course <menu>.
             * Everything else will be imported as an html node, which is not interfaced with contextMenu.
             */

            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#concept-command
            switch (nodeName) {
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#the-menu-element
                case 'menu':
                    item = {name: $node.attr('label'), items: {}};
                    counter = builder.build(item.items, $node.children(), counter);
                    break;

                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command
                case 'a':
                case 'button':
                    item = {
                        name: $node.text(),
                        disabled: !!$node.attr('disabled'),
                        callback: (function () {
                            return function () {
                                $node.get(0).click();
                            };
                        })()
                    };
                    break;

                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-command-element-to-define-a-command
                case 'menuitem':
                case 'command':
                    switch ($node.attr('type')) {
                        case undefined:
                        case 'command':
                        case 'menuitem':
                            item = {
                                name: $node.attr('label'),
                                disabled: !!$node.attr('disabled'),
                                icon: $node.attr('icon'),
                                callback: (function () {
                                    return function () {
                                        $node.get(0).click();
                                    };
                                })()
                            };
                            break;

                        case 'checkbox':
                            item = {
                                type: 'checkbox',
                                disabled: !!$node.attr('disabled'),
                                name: $node.attr('label'),
                                selected: !!$node.attr('checked')
                            };
                            break;
                        case 'radio':
                            item = {
                                type: 'radio',
                                disabled: !!$node.attr('disabled'),
                                name: $node.attr('label'),
                                radio: $node.attr('radiogroup'),
                                value: $node.attr('id'),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        default:
                            item = undefined;
                    }
                    break;

                case 'hr':
                    item = '-------';
                    break;

                case 'input':
                    switch ($node.attr('type')) {
                        case 'text':
                            item = {
                                type: 'text',
                                name: label || builder.inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                value: $node.val()
                            };
                            break;

                        case 'checkbox':
                            item = {
                                type: 'checkbox',
                                name: label || builder.inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        case 'radio':
                            item = {
                                type: 'radio',
                                name: label || builder.inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                radio: !!$node.attr('name'),
                                value: $node.val(),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        default:
                            item = undefined;
                            break;
                    }
                    break;

                case 'select':
                    item = {
                        type: 'select',
                        name: label || builder.inputLabel(node),
                        disabled: !!$node.attr('disabled'),
                        selected: $node.val(),
                        options: {}
                    };
                    $node.children().each(function () {
                        item.options[this.value] = $(this).text();
                    });
                    break;

                case 'textarea':
                    item = {
                        type: 'textarea',
                        name: label || builder.inputLabel(node),
                        disabled: !!$node.attr('disabled'),
                        value: $node.val()
                    };
                    break;

                case 'label':
                    break;

                default:
                    item = {type: 'html', html: $node.clone(true)};
                    break;
            }

            if (item) {
                counter++;
                items['key' + counter] = item;
            }
        });

        return counter;
    }
}
