import ContextMenuOperations from './ContextMenuOperations';
import defaults from '../defaults';
import ContextMenuHtml5Builder from './ContextMenuHtml5Builder';
import ContextMenuEventHandler from './ContextMenuEventHandler';

export default class ContextMenu {
    /**
     * @constructor
     * @constructs ContextMenu
     * @classdesc The ContextMenu is the core class that manages contextmenu's. You can call this class directly and skip going through jQuery.
     * @class ContextMenu
     *
     * @example
     * // You can call this class directly and skip going through jQuery, although it still requires jQuery to run.
     * const manager = new ContextMenu();
     * manager.execute("create", options);
     *
     * @property {ContextMenuSettings|Object} defaults
     * @property {ContextMenuEventHandler} handle
     * @property {ContextMenuOperations} operations
     * @property {Object<string, ContextMenuData>} menus
     * @property {number} counter - Internal counter to keep track of different menu's on the page.
     * @property {boolean} initialized - Flag the menu as initialized.
     */
    constructor() {
        this.html5builder = new ContextMenuHtml5Builder();
        this.defaults = defaults;
        this.handler = new ContextMenuEventHandler();
        this.operations = new ContextMenuOperations();
        this.namespaces = {};
        this.initialized = false;
        this.menus = {};
        this.counter = 0;
    }

    /**
     * @method execute
     * @memberOf ContextMenu
     * @instance
     *
     * @param {(string|ContextMenuSettings)} operation
     * @param {(string|ContextMenuSettings)} options
     * @return {ContextMenu}
     */
    execute(operation, options) {
        const normalizedArguments = this.normalizeArguments(operation, options);
        operation = normalizedArguments.operation;
        options = normalizedArguments.options;

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

    normalizeArguments(operation, options) {
        if (typeof operation !== 'string') {
            options = operation;
            operation = 'create';
        }

        if (typeof options === 'string') {
            options = {selector: options};
        } else if (typeof options === 'undefined') {
            options = {};
        }
        return {operation, options};
    }

    /**
     * import values into `<input>` commands
     *
     * @method setInputValues
     * @memberOf ContextMenu
     * @instance
     *
     * @param {ContextMenuData} opt - {@link ContextMenuData} object
     * @param {Object} data - Values to set
     * @return {undefined}
     */
    setInputValues(opt, data) {
        if (typeof data === 'undefined') {
            data = {};
        }

        $.each(opt.inputs, function (key, item) {
            switch (item.type) {
                case 'text':
                case 'textarea':
                    item.value = data[key] || '';
                    break;

                case 'checkbox':
                    item.selected = !!data[key];
                    break;

                case 'radio':
                    item.selected = (data[item.radio] || '') === item.value;
                    break;

                case 'select':
                    item.selected = data[key] || '';
                    break;
            }
        });
    }

    /**
     * export values from `<input>` commands
     *
     * @method getInputValues
     * @memberOf ContextMenu
     * @instance
     *
     * @param {ContextMenuData} opt - {@link ContextMenuData} object
     * @param {Object} data - Values object
     * @return {Object} - Values of input elements
     */
    getInputValues(opt, data) {
        if (typeof data === 'undefined') {
            data = {};
        }

        $.each(opt.inputs, function (key, item) {
            switch (item.type) {
                case 'text':
                case 'textarea':
                case 'select':
                    data[key] = item.$input.val();
                    break;

                case 'checkbox':
                    data[key] = item.$input.prop('checked');
                    break;

                case 'radio':
                    if (item.$input.prop('checked')) {
                        data[item.radio] = item.value;
                    }
                    break;
            }
        });

        return data;
    }
}
