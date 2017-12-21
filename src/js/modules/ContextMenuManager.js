/**
 * @typedef {jQuery.Event} ContextMenuEvent
 * @augments jQuery.Event
 * @property {ContextMenuData} data
 */

/**
 * @typedef {ContextMenuSettings} ContextMenuData
 *
 * @property {JQuery} $menu - The menu element for this menu part. Eg. the root menu, or a single submenu
 * @property {JQuery} $layer - The opened layer when the menu is opened
 * @property {JQuery} $node - The menu item node
 * @property {JQuery} $trigger - The element that triggered opening the menu
 * @property {ContextMenuManager} manager - The contextmenu manager instance
 * @property {JQuery|jQuery|null} $selected - Currently selected menu item, or input inside menu item
 * @property {?boolean} hasTypes - The menu has ContextMenuItem which are of a selectable type
 * @property {?boolean} isInput - We are currently originating events from an input
 * @property {Object<string, ContextMenuItem>} inputs - Inputs defined in the menu
 *
 * @property {boolean} hovering Currently hovering, root menu only.
 */

/**
 * @class ContextMenuItem
 * @instance
 * @interface
 *
 * @property {string} type
 * @property {string|Function} icon
 * @property {boolean} isHtmlName - Should this item be called with .html() instead of .text()
 * @property {?JQuery} $input - The input element if it was build for this item
 *
 * @property {Object.<string,ContextMenuItem>} items
 */

/**
 * @callback ContextMenuBuildCallback
 * @param {JQuery.Event} e - Event that trigged the menu
 * @param {JQuery} $currentTrigger - Element that trigged the menu
 * @return {Object.<string,ContextMenuItem>}
 */

export default class ContextMenuManager {
    /**
     * @constructor
     * @constructs ContextMenuManager
     *
     * @property {ContextMenuSettings} defaults
     * @property {ContextMenuEventHandler} handle
     * @property {ContextMenuOperations} op
     * @property {Object<string, ContextMenuData>} menus
     * @property {number} counter
     * @property {boolean} initialized
     * @property {boolean} initialized
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
     * @method execute
     * @memberOf ContextMenuManager
     * @instance
     *
     * @param {(string|ContextMenuSettings)} operation
     * @param {(string|ContextMenuSettings)} options
     * @return {ContextMenuManager}
     */
    execute(operation, options) {
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
