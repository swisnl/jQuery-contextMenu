/**
 * @class Manager
 * @property {ContextMenuOperations} op
 * @property {ContextMenuSettings} defaults
 * @property {ContextMenuEventHandlers} handle
 * @property {Object<string, ContextMenuData>} menus
 * @property {Number} counter
 * @property {boolean} initialized
 * @property {boolean} initialized
 */
export default class Manager {
    constructor(defaults, handler, operations, menus, namespaces) {
        this.defaults = defaults;
        this.handle = handler;
        this.op = operations;
        this.namespaces = namespaces;
        this.initialized = false;
        this.menus = menus;
        this.counter = 0;
    }

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
        const o = $.extend(true, {}, this.defaults, options || {});
        const $document = $(document);
        let $context = $document;
        let _hasContext = false;

        if (!o.context || !o.context.length) {
            o.context = document;
        } else {
            // you never know what they throw at you...
            $context = $(o.context).first();
            o.context = $context.get(0);
            _hasContext = !$(o.context).is(document);
        }

        switch (operation) {
            case 'update':
                // Updates visibility and such
                if (_hasContext) {
                    this.op.update($context);
                } else {
                    for (let menu in this.menus) {
                        if (this.menus.hasOwnProperty(menu)) {
                            this.op.update(this.menus[menu]);
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
                        // 'mouseup.contextMenu': this.handle.itemClick,
                        // 'click.contextMenu': this.handle.itemClick,
                        'contextmenu:focus.contextMenu': this.handle.focusItem,
                        'contextmenu:blur.contextMenu': this.handle.blurItem,
                        'contextmenu.contextMenu': this.handle.abortevent,
                        'mouseenter.contextMenu': this.handle.itemMouseenter,
                        'mouseleave.contextMenu': this.handle.itemMouseleave
                    };
                    contextMenuItemObj[itemClick] = this.handle.itemClick;

                    // make sure item click is registered first
                    $document
                        .on({
                            'contextmenu:hide.contextMenu': this.handle.hideMenu,
                            'prevcommand.contextMenu': this.handle.prevItem,
                            'nextcommand.contextMenu': this.handle.nextItem,
                            'contextmenu.contextMenu': this.handle.abortevent,
                            'mouseenter.contextMenu': this.handle.menuMouseenter,
                            'mouseleave.contextMenu': this.handle.menuMouseleave
                        }, '.context-menu-list')
                        .on('mouseup.contextMenu', '.context-menu-input', this.handle.inputClick)
                        .on(contextMenuItemObj, '.context-menu-item');

                    this.initialized = true;
                }

                // engage native contextmenu event
                $context
                    .on('contextmenu' + o.ns, o.selector, o, this.handle.contextmenu);

                if (_hasContext) {
                    // add remove hook, just in case
                    $context.on('remove' + o.ns, function () {
                        $(this).contextMenu('destroy');
                    });
                }

                switch (o.trigger) {
                    case 'hover':
                        $context
                            .on('mouseenter' + o.ns, o.selector, o, this.handle.mouseenter)
                            .on('mouseleave' + o.ns, o.selector, o, this.handle.mouseleave);
                        break;

                    case 'left':
                        $context.on('click' + o.ns, o.selector, o, this.handle.click);
                        break;
                    case 'touchstart':
                        $context.on('touchstart' + o.ns, o.selector, o, this.handle.click);
                        break;
                    /*
                     default:
                     // http://www.quirksmode.org/dom/events/contextmenu.html
                     $document
                     .on('mousedown' + o.ns, o.selector, o, this.handle.mousedown)
                     .on('mouseup' + o.ns, o.selector, o, this.handle.mouseup);
                     break;
                     */
                }

                // create menu
                if (!o.build) {
                    this.op.create(null, o);
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

                        try {
                            if (this.menus[o.ns].$menu) {
                                this.menus[o.ns].$menu.remove();
                            }

                            delete this.menus[o.ns];
                        } catch (e) {
                            this.menus[o.ns] = null;
                        }

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

                    try {
                        if (this.menus[this.namespaces[o.selector]].$menu) {
                            this.menus[this.namespaces[o.selector]].$menu.remove();
                        }

                        delete this.menus[this.namespaces[o.selector]];
                    } catch (e) {
                        this.menus[this.namespaces[o.selector]] = null;
                    }

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
