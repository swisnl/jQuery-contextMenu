/**
 * @typedef {jQuery.Event} ContextMenuEvent
 * @augments jQuery.Event
 * @property {ContextMenuData} data
 */

/**
 * @class ContextMenuData
 * @augments ContextMenuSettings
 * @instance
 * @interface
 *
 * @property {JQuery} $menu - The menu element for this menu part. Eg. the root menu, or a single submenu.
 * @property {JQuery} $layer - The opened layer when the menu is opened.
 * @property {JQuery} $node - The menu node.
 * @property {JQuery} $trigger - The element that triggered opening the menu.
 * @property {JQuery} $selected - Reference to the `<li>` command element.
 * @property {JQuery} $input - Reference to the `<input>` or `<select>` of the command element.
 * @property {JQuery} $label - Reference to the `<input>` or `<select>` of the command element.
 * @property {string} ns - The namespace (including leading dot) all events for this contextMenu instance were registered under.
 * @property {ContextMenuManager} manager - The contextmenu manager instance.
 * @property {JQuery|jQuery|null} $selected - Currently selected menu item, or input inside menu item.
 * @property {?boolean} hasTypes - The menu has ContextMenuItem which are of a selectable type.
 * @property {?boolean} isInput - We are currently originating events from an input.
 * @property {Object<string, ContextMenuItem>} inputs - Inputs defined in the menu.
 *
 * @property {boolean} hovering Currently hovering, root menu only.
 */

/**
 * @class ContextMenuItem
 * @instance
 * @interface
 * @classdesc The items map contains the commands to list in the menu. Each command has a unique key identifying an item object. The value may either be an item (properties explained below), or a string (which will insert a separator, disregarding the string's content). It is also possible to define a seperator the same as an item, and use the `type`:`cm_separator` to define it.

 ```javascript
 var items = {
  firstCommand: itemOptions,
  separator1: "-----",
  separator2: { "type": "cm_separator" },
  command2: itemOptions
}
 ```

 Since 2.3 it is also possible to use a promise as item, so you can build submenu's based on a snynchronous promis.

 Check out the [demo using a promise](demo/async-promise.md) for an example how to use this. The example uses jQuery deferred, but any promise should do. Promised can only be used in combination with the [build option](docs#build).

 *
 * @property {string} name - Specify the human readable name of the command in the menu. This is used as the label for the option.
 * @property {boolean} isHtmlName - Should this item be called with .html() instead of .text(). Cannot be used with the accesskey option in the same item.
 * @property {ContextMenuItemCallback} callback - Specifies the callback to execute if the item is clicked.
 * @property {string} className - Specifies additional classNames to add to the menu item. Seperate multiple classes by using spaces.
 * @property {ContextMenuIconCallback|string} icon - Specifies the icon class to set for the item. When using a string icons must be defined in CSS with selectors like `.context-menu-item.context-menu-icon-edit`, where edit is the icon class specified. When using a callback you can return a class string to use that as the class on the item. You can also modify the element by using the $itemElement argument.
 * @property {ContextMenuItemCallback|boolean} disabled - Specifies if the command is disabled (`true`) or enabled (`false`). May be a callback returning a `boolean`.
 * @property {ContextMenuItemCallback|boolean} visible - Specifies if the command is disabled (`true`) or enabled (`false`). May be a callback returning a `boolean`.
 * @property {ContextMenuItemTypes|string} type - Specifies the type of the command. See {@link ContextMenuItemTypes}.
 * @property {Object<string, Function>} events - Events to register on a {@link ContextMenuItem}. The contents of the options object are passed as jQuery `e.data`.
 * @property {string} value - The value of the `<input>` element.
 * @property {boolean|string} selected - The selected option of a `select` element and the checked property for `checkbox` and `radio` {@link ContextMenuItemTypes}.
 * @property {string} radio - Specifies the group of the `radio` element.
 * @property {string} options - Specifies the options of the `select` element.
 * @property {Number} height - The height in pixels `<textarea>` element. If not specified, the height is defined by CSS.
 * @property {Object<string, ContextMenuItem>} items - Items to show in a sub-menu. You can nest as many as you like.
 * @property {string} accesskey - Character(s) to be used as accesskey.

 Considering `a b c` $.contextMenu will first try to use »a« as the accesskey, if already taken, it'll fall through to `b`. Words are reduced to the first character, so `hello world` is treated as `h w`.

 Note: Accesskeys are treated unique throughout one menu. This means an item in a sub-menu can't occupy the same accesskey as an item in the main menu.
 *
 * @property {?JQuery} $input - The input element if it was build for this item.
 *
 * @property {Object.<string,ContextMenuItem>} items Object containing the menu items.
 */

/**
 * Specifies the icon class to set for the item.
 *
 * When using a string icons must be defined in CSS with selectors like `.context-menu-item.context-menu-icon-edit`, where edit is the icon class specified.
 *
 * When using a callback you can return a class string to use that as the class on the item. You can also modify the element by using the $itemElement argument.
 *
 * @example
 * var items = {
    firstCommand: {
        name: "Copy",
        icon: function(e, $itemElement, itemKey, item, opt, root){
            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
            $itemElement.html('<span class="glyphicon glyphicon-star" aria-hidden="true"></span> ' + opt.selector);

            // Add the context-menu-icon-updated class to the item
            return 'context-menu-icon-updated';
        }
    },
    secondCommand: {
        name: "Paste",
        icon: "paste" // Class context-menu-icon-paste is used on the menu item.
    }
}
 *
 * @callback ContextMenuIconCallback
 * @param {ContextMenuEvent|JQuery.Event} e,
 * @param {JQuery} $t
 * @param {string} key
 * @param {ContextMenuItem} item
 * @param {ContextMenuData} opt
 * @param {ContextMenuData} root
 */

/**
 * The Callback is executed in the context of the triggering object.
 *
 * @callback ContextMenuItemCallback
 * @param {JQuery.Event} e - Event that trigged the menu.
 * @param {string} key - Key of the menu item.
 * @param {ContextMenuData} opt - Data of the (sub)menu in which the item resides.
 * @param {ContextMenuData} root - Data of the root menu in which the item resides. Might be the same as `opt` if triggered in the menu root.
 * @return {boolean}
 */

/**
 * @callback ContextMenuBuildCallback
 * @param {JQuery.Event} e - Event that trigged the menu.
 * @param {JQuery} $currentTrigger - Element that trigged the menu.
 * @return {Object.<string,ContextMenuItem>}
 */

export default class ContextMenuManager {
    /**
     * @constructor
     * @constructs ContextMenuManager
     *
     * @property {ContextMenuSettings} defaults
     * @property {ContextMenuEventHandler} handle
     * @property {ContextMenuOperations} operations
     * @property {Object<string, ContextMenuData>} menus
     * @property {number} counter - Internal counter to keep track of different menu's on the page.
     * @property {boolean} initialized - Flag the menu as initialized.
     * @param {ContextMenuSettings} defaults
     * @param {ContextMenuEventHandler} handler
     * @param {ContextMenuOperations} operations
     * @param {Object<string, ContextMenuData>} menus
     * @param {Object.<string,string>} namespaces
     */
    constructor(defaults, handler, operations, menus, namespaces) {
        this.defaults = defaults;
        this.handler = handler;
        this.operations = operations;
        this.namespaces = namespaces;
        this.initialized = false;
        this.menus = menus;
        this.counter = 0;
    }

    /**
     * @method create
     * @memberOf ContextMenuManager
     * @instance
     *
     * @param {(string|ContextMenuSettings)} operation
     * @param {(string|ContextMenuSettings)} options
     * @return {ContextMenuManager}
     */
    create(operation, options) {
        if (typeof operation !== 'string') {
            options = operation;
            operation = 'create';
        }

        if (typeof options === 'string') {
            options = {selector: options};
        } else if (typeof options === 'undefined') {
            options = {};
        }

        // merge with default options
        const o = $.extend(true, {manager: this}, this.defaults, options || {});
        const $document = $(document);
        let $context = $document;
        let _hasContext = false;

        if (!o.context || !o.context.length) {
            o.context = document;
        } else {
            // you never know what they throw at you...
            $context = $(o.context).first();
            o.context = $context.get(0);
            _hasContext = !$(o.context).is($(document));
        }

        switch (operation) {
            case 'update':
                // Updates visibility and such
                if (_hasContext) {
                    this.operations.update(null, $context);
                } else {
                    for (let menu in this.menus) {
                        if (this.menus.hasOwnProperty(menu)) {
                            this.operations.update(null, this.menus[menu]);
                        }
                    }
                }
                break;

            case 'create':
                // no selector no joy
                if (!o.selector) {
                    throw new Error('No selector specified');
                }
                // make sure internal classes are not bound to
                if (o.selector.match(/.context-menu-(list|item|input)($|\s)/)) {
                    throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
                }
                if (!o.build && (!o.items || $.isEmptyObject(o.items))) {
                    throw new Error('No Items specified');
                }
                this.counter++;
                o.ns = '.contextMenu' + this.counter;
                if (!_hasContext) {
                    this.namespaces[o.selector] = o.ns;
                }
                this.menus[o.ns] = o;

                // default to right click
                if (!o.trigger) {
                    o.trigger = 'right';
                }

                if (!this.initialized) {
                    const itemClick = o.itemClickEvent === 'click' ? 'click.contextMenu' : 'mouseup.contextMenu';
                    const contextMenuItemObj = {
                        // 'mouseup.contextMenu': this.handler.itemClick,
                        // 'click.contextMenu': this.handler.itemClick,
                        'contextmenu:focus.contextMenu': this.handler.focusItem,
                        'contextmenu:blur.contextMenu': this.handler.blurItem,
                        'contextmenu.contextMenu': this.handler.abortevent,
                        'mouseenter.contextMenu': this.handler.itemMouseenter,
                        'mouseleave.contextMenu': this.handler.itemMouseleave
                    };
                    contextMenuItemObj[itemClick] = this.handler.itemClick;

                    // make sure item click is registered first
                    $document
                        .on({
                            'contextmenu:hide.contextMenu': this.handler.hideMenu,
                            'prevcommand.contextMenu': this.handler.prevItem,
                            'nextcommand.contextMenu': this.handler.nextItem,
                            'contextmenu.contextMenu': this.handler.abortevent,
                            'mouseenter.contextMenu': this.handler.menuMouseenter,
                            'mouseleave.contextMenu': this.handler.menuMouseleave
                        }, '.context-menu-list')
                        .on('mouseup.contextMenu', '.context-menu-input', this.handler.inputClick)
                        .on(contextMenuItemObj, '.context-menu-item');

                    this.initialized = true;
                }

                // engage native contextmenu event
                $context
                    .on('contextmenu' + o.ns, o.selector, o, this.handler.contextmenu);

                if (_hasContext) {
                    // add remove hook, just in case
                    $context.on('remove' + o.ns, function () {
                        $(this).contextMenu('destroy');
                    });
                }

                switch (o.trigger) {
                    case 'hover':
                        $context
                            .on('mouseenter' + o.ns, o.selector, o, this.handler.mouseenter)
                            .on('mouseleave' + o.ns, o.selector, o, this.handler.mouseleave);
                        break;

                    case 'left':
                        $context.on('click' + o.ns, o.selector, o, this.handler.click);
                        break;
                    case 'touchstart':
                        $context.on('touchstart' + o.ns, o.selector, o, this.handler.click);
                        break;
                    /*
                     default:
                     // http://www.quirksmode.org/dom/events/contextmenu.html
                     $document
                     .on('mousedown' + o.ns, o.selector, o, this.handler.mousedown)
                     .on('mouseup' + o.ns, o.selector, o, this.handler.mouseup);
                     break;
                     */
                }

                // create menu
                if (!o.build) {
                    this.operations.create(null, o);
                }
                break;

            case 'destroy':
                let $visibleMenu;
                if (_hasContext) {
                    // get proper options
                    const context = o.context;

                    Object.keys(this.menus).forEach((ns) => {
                        let o = this.menus[ns];

                        if (!o) {
                            return true;
                        }

                        // Is this menu equest to the context called from
                        if (!$(context).is(o.selector)) {
                            return true;
                        }

                        $visibleMenu = $('.context-menu-list').filter(':visible');
                        if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is($(o.context).find(o.selector))) {
                            $visibleMenu.trigger('contextmenu:hide', {force: true});
                        }

                        if (this.menus[o.ns].$menu) {
                            this.menus[o.ns].$menu.remove();
                        }
                        delete this.menus[o.ns];

                        $(o.context).off(o.ns);

                        return true;
                    });
                } else if (!o.selector) {
                    $document.off('.contextMenu .contextMenuAutoHide');

                    Object.keys(this.menus).forEach((ns) => {
                        let o = this.menus[ns];
                        $(o.context).off(o.ns);
                    });

                    this.namespaces = {};
                    this.menus = {};
                    this.counter = 0;
                    this.initialized = false;

                    $('#context-menu-layer, .context-menu-list').remove();
                } else if (this.namespaces[o.selector]) {
                    $visibleMenu = $('.context-menu-list').filter(':visible');
                    if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is(o.selector)) {
                        $visibleMenu.trigger('contextmenu:hide', {force: true});
                    }

                    if (this.menus[this.namespaces[o.selector]].$menu) {
                        this.menus[this.namespaces[o.selector]].$menu.remove();
                    }
                    delete this.menus[this.namespaces[o.selector]];

                    $document.off(this.namespaces[o.selector]);
                }
                break;

            case 'html5':
                // if <command> and <menuitem> are not handled by the browser,
                // or options was a bool true,
                // initialize $.contextMenu for them
                if ((!$.support.htmlCommand && !$.support.htmlMenuitem) || (typeof options === 'boolean' && options)) {
                    $('menu[type="context"]').each(function () {
                        if (this.id) {
                            $.contextMenu({
                                selector: '[contextmenu=' + this.id + ']',
                                items: $.contextMenu.fromMenu(this)
                            });
                        }
                    }).css('display', 'none');
                }
                break;

            default:
                throw new Error('Unknown operation "' + operation + '"');
        }

        return this;
    }
}
