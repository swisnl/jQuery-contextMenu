import ContextMenuHelper from './ContextMenuHelper';
import ContextMenuItemTypes from './ContextMenuItemTypes';

export default class ContextMenuOperations {
    /**
     * @constructor
     * @constructs ContextMenuOperations
     */
    constructor() {
        return this;
    }

    /**
     * Show the menu.
     *
     * @method
     * @memberOf ContextMenuOperations
     * @instance
     *
     * @param {JQuery.Event} e
     * @param {ContextMenuData} menuData
     * @param {number} x
     * @param {number} y
     */
    show(e, menuData, x, y) {
        const $trigger = $(this);
        const css = {};

        // hide any open menus
        $('#context-menu-layer').trigger('mousedown');

        // backreference for callbacks
        menuData.$trigger = $trigger;

        // show event
        if (menuData.events.show.call($trigger, e, menuData) === false) {
            menuData.manager.handler.$currentTrigger = null;
            return;
        }

        // create or update context menu
        menuData.manager.operations.update.call($trigger, e, menuData);

        // position menu
        menuData.position.call($trigger, e, menuData, x, y);

        // make sure we're in front
        if (menuData.zIndex) {
            let additionalZValue = menuData.zIndex;
            // If menuData.zIndex is a function, call the function to get the right zIndex.
            if (typeof menuData.zIndex === 'function') {
                additionalZValue = menuData.zIndex.call($trigger, menuData);
            }
            css.zIndex = ContextMenuHelper.zindex($trigger) + additionalZValue;
        }

        // add layer
        menuData.manager.operations.layer.call(menuData.$menu, e, menuData, css.zIndex);

        // adjust sub-menu zIndexes
        menuData.$menu.find('ul').css('zIndex', css.zIndex + 1);

        // position and show context menu
        menuData.$menu.css(css)[menuData.animation.show](menuData.animation.duration, () => {
            $trigger.trigger('contextmenu:visible');

            menuData.manager.operations.activated(e, menuData);
            menuData.events.activated($trigger, e, menuData);
        });
        // make options available and set state
        $trigger
            .data('contextMenu', menuData)
            .addClass('context-menu-active');

        // register key handler
        $(document).off('keydown.contextMenu').on('keydown.contextMenu', menuData, menuData.manager.handler.key);
        // register autoHide handler
        if (menuData.autoHide) {
            // mouse position handler
            $(document).on('mousemove.contextMenuAutoHide', (e) => {
                // need to capture the offset on mousemove,
                // since the page might've been scrolled since activation
                const pos = $trigger.offset();
                pos.right = pos.left + $trigger.outerWidth();
                pos.bottom = pos.top + $trigger.outerHeight();

                if (menuData.$layer && !menuData.hovering && (!(e.pageX >= pos.left && e.pageX <= pos.right) || !(e.pageY >= pos.top && e.pageY <= pos.bottom))) {
                    /* Additional hover check after short time, you might just miss the edge of the menu */
                    setTimeout(() => {
                        if (!menuData.hovering && menuData.$menu !== null && typeof menuData.$menu !== 'undefined') {
                            menuData.$menu.trigger('contextmenu:hide');
                        }
                    }, 50);
                }
            });
        }
    }

    /**
     * Hide the menu.
     *
     * @method
     * @memberOf ContextMenuOperations
     * @instance
     *
     * @param {JQuery.Event} e
     * @param {ContextMenuData} menuData
     * @param {boolean} force
     */
    hide(e, menuData, force) {
        const $trigger = $(this);
        if (typeof menuData !== 'object' && $trigger.data('contextMenu')) {
            menuData = $trigger.data('contextMenu');
        } else if (typeof menuData !== 'object') {
            return;
        }

        // hide event
        if (!force && menuData.events && menuData.events.hide.call($trigger, e, menuData) === false) {
            return;
        }

        // remove options and revert state
        $trigger
            .removeData('contextMenu')
            .removeClass('context-menu-active');

        if (menuData.$layer) {
            // keep layer for a bit so the contextmenu event can be aborted properly by opera
            setTimeout((function ($layer) {
                return function () {
                    $layer.remove();
                };
            })(menuData.$layer), 10);

            try {
                delete menuData.$layer;
            } catch (e) {
                menuData.$layer = null;
            }
        }

        // remove handle
        menuData.manager.handler.$currentTrigger = null;
        // remove selected
        menuData.$menu.find('.' + menuData.classNames.hover).trigger('contextmenu:blur');
        menuData.$selected = null;
        // collapse all submenus
        menuData.$menu.find('.' + menuData.classNames.visible).removeClass(menuData.classNames.visible);
        // unregister key and mouse handlers
        $(document).off('.contextMenuAutoHide').off('keydown.contextMenu');
        // hide menu
        if (menuData.$menu) {
            menuData.$menu[menuData.animation.hide](menuData.animation.duration, () => {
                // tear down dynamically built menu after animation is completed.
                if (menuData.build) {
                    menuData.$menu.remove();
                    Object.keys(menuData).forEach((key) => {
                        switch (key) {
                            case 'ns':
                            case 'selector':
                            case 'build':
                            case 'trigger':
                                return true;

                            default:
                                menuData[key] = undefined;
                                try {
                                    delete menuData[key];
                                } catch (e) {
                                }
                                return true;
                        }
                    });
                }

                setTimeout(() => {
                    $trigger.trigger('contextmenu:hidden');
                }, 10);
            });
        }
    }

    /**
     * Create a menu based on the options. Also created submenus.
     *
     * @method
     * @memberOf ContextMenuOperations
     * @instance
     *
     * @param {JQuery.Event} e
     * @param {ContextMenuData} currentMenuData
     * @param {ContextMenuData?} rootMenuData
     */
    create(e, currentMenuData, rootMenuData) {
        if (typeof rootMenuData === 'undefined') {
            rootMenuData = currentMenuData;
        }

        // create contextMenu
        currentMenuData.$menu = $('<ul class="context-menu-list"></ul>').addClass(currentMenuData.className || '').data({
            'contextMenu': currentMenuData,
            'contextMenuRoot': rootMenuData
        });

        ['callbacks', 'commands', 'inputs'].forEach((k) => {
            currentMenuData[k] = {};
            if (!rootMenuData[k]) {
                rootMenuData[k] = {};
            }
        });

        if (!rootMenuData.accesskeys) {
            rootMenuData.accesskeys = {};
        }

        function createNameNode(item) {
            const $name = $('<span></span>');
            if (item._accesskey) {
                if (item._beforeAccesskey) {
                    $name.append(document.createTextNode(item._beforeAccesskey));
                }
                $('<span></span>')
                    .addClass('context-menu-accesskey')
                    .text(item._accesskey)
                    .appendTo($name);
                if (item._afterAccesskey) {
                    $name.append(document.createTextNode(item._afterAccesskey));
                }
            } else {
                if (item.isHtmlName) {
                    // restrict use with access keys
                    if (typeof item.accesskey !== 'undefined') {
                        throw new Error('accesskeys are not compatible with HTML names and cannot be used together in the same item');
                    }
                    $name.html(item.name);
                } else {
                    $name.text(item.name);
                }
            }
            return $name;
        }

        // create contextMenu items
        Object.keys(currentMenuData.items).forEach((key) => {
            let item = currentMenuData.items[key];
            let $t = $('<li class="context-menu-item"></li>').addClass(item.className || '');
            let $label = null;
            let $input = null;

            // iOS needs to see a click-event bound to an element to actually
            // have the TouchEvents infrastructure trigger the click event
            $t.on('click', $.noop);

            // Make old school string separator a real item so checks wont be
            // awkward later.
            // And normalize 'cm_separator' into 'cm_separator'.
            if (typeof item === 'string' || item.type === 'cm_seperator') {
                item = {type: ContextMenuItemTypes.separator};
            }

            item.$node = $t.data({
                'contextMenu': currentMenuData,
                'contextMenuRoot': rootMenuData,
                'contextMenuKey': key
            });

            // register accesskey
            // NOTE: the accesskey attribute should be applicable to any element, but Safari5 and Chrome13 still can't do that
            if (typeof item.accesskey !== 'undefined') {
                const aks = ContextMenuHelper.splitAccesskey(item.accesskey);
                for (let i = 0, ak; ak = aks[i]; i++) {
                    if (!rootMenuData.accesskeys[ak]) {
                        rootMenuData.accesskeys[ak] = item;
                        const matched = item.name.match(new RegExp('^(.*?)(' + ak + ')(.*)$', 'i'));
                        if (matched) {
                            item._beforeAccesskey = matched[1];
                            item._accesskey = matched[2];
                            item._afterAccesskey = matched[3];
                        }
                        break;
                    }
                }
            }

            if (item.type && rootMenuData.types[item.type]) {
                // run custom type handler
                rootMenuData.types[item.type].call($t, e, item, currentMenuData, rootMenuData);
                // register commands
                [currentMenuData, rootMenuData].forEach((k) => {
                    k.commands[key] = item;
                    // Overwrite only if undefined or the item is appended to the rootMenuData. This so it
                    // doesn't overwrite callbacks of rootMenuData elements if the name is the same.
                    if (typeof item.callback === 'function' && (typeof k.callbacks[key] === 'undefined' || typeof currentMenuData.type === 'undefined')) {
                        k.callbacks[key] = item.callback;
                    }
                });
            } else {
                // add label for input
                if (item.type === ContextMenuItemTypes.separator) {
                    $t.addClass('context-menu-separator ' + rootMenuData.classNames.notSelectable);
                } else if (item.type === ContextMenuItemTypes.html) {
                    $t.addClass('context-menu-html ' + rootMenuData.classNames.notSelectable);
                } else if (item.type && item.type !== ContextMenuItemTypes.submenu) {
                    $label = $('<label></label>').appendTo($t);
                    createNameNode(item).appendTo($label);

                    $t.addClass('context-menu-input');
                    currentMenuData.hasTypes = true;
                    [currentMenuData, rootMenuData].forEach((k) => {
                        k.commands[key] = item;
                        k.inputs[key] = item;
                    });
                } else if (item.items) {
                    item.type = ContextMenuItemTypes.submenu;
                }

                switch (item.type) {
                    case ContextMenuItemTypes.separator:
                        break;

                    case ContextMenuItemTypes.text:
                        $input = $('<input type="text" value="1" name="" />')
                            .attr('name', 'context-menu-input-' + key)
                            .val(item.value || '')
                            .appendTo($label);
                        break;

                    case ContextMenuItemTypes.textarea:
                        $input = $('<textarea name=""></textarea>')
                            .attr('name', 'context-menu-input-' + key)
                            .val(item.value || '')
                            .appendTo($label);

                        if (item.height) {
                            $input.height(item.height);
                        }
                        break;

                    case ContextMenuItemTypes.checkbox:
                        $input = $('<input type="checkbox" value="1" name="" />')
                            .attr('name', 'context-menu-input-' + key)
                            .val(item.value || '')
                            .prop('checked', !!item.selected)
                            .prependTo($label);
                        break;

                    case ContextMenuItemTypes.radio:
                        $input = $('<input type="radio" value="1" name="" />')
                            .attr('name', 'context-menu-input-' + item.radio)
                            .val(item.value || '')
                            .prop('checked', !!item.selected)
                            .prependTo($label);
                        break;

                    case ContextMenuItemTypes.select:
                        $input = $('<select name=""></select>')
                            .attr('name', 'context-menu-input-' + key)
                            .appendTo($label);
                        if (item.options) {
                            Object.keys(item.options).forEach((value) => {
                                $('<option></option>').val(value).text(item.options[value]).appendTo($input);
                            });
                            $input.val(item.selected);
                        }
                        break;

                    case ContextMenuItemTypes.submenu:
                        createNameNode(item).appendTo($t);
                        item.appendTo = item.$node;
                        $t.data('contextMenu', item).addClass('context-menu-submenu');
                        item.callback = null;

                        // If item contains items, and this is a promise, we should create it later
                        // check if subitems is of type promise. If it is a promise we need to create
                        // it later, after promise has been resolved.
                        if (typeof item.items.then === 'function') {
                            // probably a promise, process it, when completed it will create the sub menu's.
                            rootMenuData.manager.operations.processPromises(e, item, rootMenuData, item.items);
                        } else {
                            // normal submenu.
                            rootMenuData.manager.operations.create(e, item, rootMenuData);
                        }
                        break;

                    case ContextMenuItemTypes.html:
                        $(item.html).appendTo($t);
                        break;

                    default:
                        [currentMenuData, rootMenuData].forEach((k) => {
                            k.commands[key] = item;
                            // Overwrite only if undefined or the item is appended to the rootMenuData. This so it
                            // doesn't overwrite callbacks of rootMenuData elements if the name is the same.
                            if (typeof item.callback === 'function' && (typeof k.callbacks[key] === 'undefined' || typeof currentMenuData.type === 'undefined')) {
                                k.callbacks[key] = item.callback;
                            }
                        });
                        createNameNode(item).appendTo($t);
                        break;
                }

                // disable key listener in <input>
                if (item.type && item.type !== ContextMenuItemTypes.submenu && item.type !== ContextMenuItemTypes.html && item.type !== ContextMenuItemTypes.separator) {
                    $input
                        .on('focus', rootMenuData.manager.handler.focusInput)
                        .on('blur', rootMenuData.manager.handler.blurInput);

                    if (item.events) {
                        $input.on(item.events, currentMenuData);
                    }
                }

                // add icons
                if (item.icon) {
                    if (typeof item.icon === 'function') {
                        item._icon = item.icon.call(this, e, $t, key, item, currentMenuData, rootMenuData);
                    } else {
                        if (typeof item.icon === 'string' && item.icon.substring(0, 3) === 'fa-') {
                            // to enable font awesome
                            item._icon = rootMenuData.classNames.icon + ' ' + rootMenuData.classNames.icon + '--fa fa ' + item.icon;
                        } else {
                            item._icon = rootMenuData.classNames.icon + ' ' + rootMenuData.classNames.icon + '-' + item.icon;
                        }
                    }
                    $t.addClass(item._icon);
                }
            }

            // cache contained elements
            item.$input = $input;
            item.$label = $label;

            // attach item to menu
            $t.appendTo(currentMenuData.$menu);

            // Disable text selection
            if (!currentMenuData.hasTypes && $.support.eventSelectstart) {
                // browsers support user-select: none,
                // IE has a special event for text-selection
                // browsers supporting neither will not be preventing text-selection
                $t.on('selectstart.disableTextSelect', currentMenuData.manager.handler.abortevent);
            }
        });
        // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
        if (!currentMenuData.$node) {
            currentMenuData.$menu.css('display', 'none').addClass('context-menu-rootMenuData');
        }
        currentMenuData.$menu.appendTo(currentMenuData.appendTo || document.body);
    }

    /**
     * Resize the menu to its content.
     *
     * @method
     * @memberOf ContextMenuOperations
     * @instance
     *
     * @param {ContextMenuEvent} e
     * @param {JQuery} $menu
     * @param {boolean?} nested
     */
    resize(e, $menu, nested) {
        let domMenu;
        // determine widths of submenus, as CSS won't grow them automatically
        // position:absolute within position:absolute; min-width:100; max-width:200; results in width: 100;
        // kinda sucks hard...

        // determine width of absolutely positioned element
        $menu.css({position: 'absolute', display: 'block'});
        // don't apply yet, because that would break nested elements' widths
        $menu.data('width',
            (domMenu = $menu.get(0)).getBoundingClientRect
                ? Math.ceil(domMenu.getBoundingClientRect().width)
                : $menu.outerWidth() + 1); // outerWidth() returns rounded pixels
        // reset styles so they allow nested elements to grow/shrink naturally
        $menu.css({
            position: 'static',
            minWidth: '0px',
            maxWidth: '100000px'
        });
        // identify width of nested menus
        $menu.find('> li > ul').each((index, element) => {
            e.data.manager.operations.resize(e, $(element), true);
        });
        // reset and apply changes in the end because nested
        // elements' widths wouldn't be calculatable otherwise
        if (!nested) {
            $menu.find('ul').addBack().css({
                position: '',
                display: '',
                minWidth: '',
                maxWidth: ''
            }).outerWidth(function () {
                return $(this).data('width');
            });
        }
    }

    /**
     * Update the contextmenu, re-evaluates the whole menu (including disabled/visible callbacks)
     *
     * @method
     * @memberOf ContextMenuOperations
     * @instance
     *
     * @param {JQuery.Event} e
     * @param {ContextMenuData?} currentMenuData
     * @param {ContextMenuData?} rootMenuData
     */
    update(e, currentMenuData, rootMenuData) {
        const $trigger = this;
        if (typeof rootMenuData === 'undefined') {
            rootMenuData = currentMenuData;
            rootMenuData.manager.operations.resize(e, currentMenuData.$menu);
        }
        // re-check disabled for each item
        currentMenuData.$menu.children().each(function (index, element) {
            let $item = $(element);
            let key = $item.data('contextMenuKey');
            let item = currentMenuData.items[key];

            let disabled = (typeof item.disabled === 'function' && item.disabled.call($trigger, e, key, currentMenuData, rootMenuData)) || item.disabled === true;
            let visible;

            if (typeof item.visible === 'function') {
                visible = item.visible.call($trigger, e, key, currentMenuData, rootMenuData);
            } else if (typeof item.visible !== 'undefined') {
                visible = item.visible === true;
            } else {
                visible = true;
            }
            $item[visible ? 'show' : 'hide']();

            // dis- / enable item
            $item[disabled ? 'addClass' : 'removeClass'](rootMenuData.classNames.disabled);

            if (typeof item.icon === 'function') {
                $item.removeClass(item._icon);
                item._icon = item.icon.call($trigger, e, $item, key, item, currentMenuData, rootMenuData);
                $item.addClass(item._icon);
            }

            if (item.type) {
                // dis- / enable input elements
                $item.find('input, select, textarea').prop('disabled', disabled);

                // update input states
                switch (item.type) {
                    case ContextMenuItemTypes.text:
                    case ContextMenuItemTypes.textarea:
                        item.$input.val(item.value || '');
                        break;

                    case ContextMenuItemTypes.checkbox:
                    case ContextMenuItemTypes.radio:
                        item.$input.val(item.value || '').prop('checked', !!item.selected);
                        break;

                    case ContextMenuItemTypes.select:
                        item.$input.val((item.selected === 0 ? '0' : item.selected) || '');
                        break;
                }
            }

            if (item.$menu) {
                // update sub-menu
                rootMenuData.manager.operations.update.call($trigger, e, item, rootMenuData);
            }
        });
    }

    /**
     * Create the overlay layer so we can capture the click outside the menu and close it.
     *
     * @method
     * @memberOf ContextMenuOperations
     * @instance
     *
     * @param {JQuery.Event} e
     * @param {ContextMenuData} menuData
     * @param {number} zIndex
     * @returns {jQuery}
     */
    layer(e, menuData, zIndex) {
        const $window = $(window);

        // add transparent layer for click area
        // filter and background for Internet Explorer, Issue #23
        const $layer = menuData.$layer = $('<div id="context-menu-layer"></div>')
            .css({
                height: $window.height(),
                width: $window.width(),
                display: 'block',
                position: 'fixed',
                'z-index': zIndex,
                top: 0,
                left: 0,
                opacity: 0,
                filter: 'alpha(opacity=0)',
                'background-color': '#000'
            })
            .data('contextMenuRoot', menuData)
            .insertBefore(this)
            .on('contextmenu', menuData.manager.handler.abortevent)
            .on('mousedown', menuData.manager.handler.layerClick);

        // IE6 doesn't know position:fixed;
        if (typeof document.body.style.maxWidth === 'undefined') { // IE6 doesn't support maxWidth
            $layer.css({
                'position': 'absolute',
                'height': $(document).height()
            });
        }

        return $layer;
    }

    /**
     * Process submenu promise.
     *
     * @method
     * @memberOf ContextMenuOperations
     * @instance
     *
     * @param {JQuery.Event} e
     * @param {ContextMenuData} currentMenuData
     * @param {ContextMenuData} rootMenuData
     * @param {Promise} promise
     */
    processPromises(e, currentMenuData, rootMenuData, promise) {
        // Start
        currentMenuData.$node.addClass(rootMenuData.classNames.iconLoadingClass);

        function finishPromiseProcess(currentMenuData, rootMenuData, items) {
            if (typeof rootMenuData.$menu === 'undefined' || !rootMenuData.$menu.is(':visible')) {
                return;
            }
            currentMenuData.$node.removeClass(rootMenuData.classNames.iconLoadingClass);
            currentMenuData.items = items;
            rootMenuData.manager.operations.create(e, currentMenuData, rootMenuData); // Create submenu
            rootMenuData.manager.operations.update(e, currentMenuData, rootMenuData); // Correctly update position if user is already hovered over menu item
            rootMenuData.positionSubmenu.call(currentMenuData.$node, e, currentMenuData.$menu); // positionSubmenu, will only do anything if user already hovered over menu item that just got new subitems.
        }

        function errorPromise(currentMenuData, rootMenuData, errorItem) {
            // User called promise.reject() with an error item, if not, provide own error item.
            if (typeof errorItem === 'undefined') {
                errorItem = {
                    'error': {
                        name: 'No items and no error item',
                        icon: 'context-menu-icon context-menu-icon-quit'
                    }
                };
                if (window.console) {
                    (console.error || console.log).call(console, 'When you reject a promise, provide an "items" object, equal to normal sub-menu items');
                }
            } else if (typeof errorItem === 'string') {
                errorItem = {'error': {name: errorItem}};
            }
            finishPromiseProcess(currentMenuData, rootMenuData, errorItem);
        }

        function completedPromise(currentMenuData, rootMenuData, items) {
            // Completed promise (dev called promise.resolve). We now have a list of items which can
            // be used to create the rest of the context menu.
            if (typeof items === 'undefined') {
                // Null result, dev should have checked
                errorPromise(undefined); // own error object
            }
            finishPromiseProcess(currentMenuData, rootMenuData, items);
        }

        // Wait for promise completion. .then(success, error, notify) (we don't track notify). Bind the currentMenuData
        // and rootMenuData to avoid scope problems
        promise.then(completedPromise.bind(this, currentMenuData, rootMenuData), errorPromise.bind(this, currentMenuData, rootMenuData));
    }

    /**
     * Operation that will run after contextMenu showed on screen.
     *
     * @method
     * @memberOf ContextMenuOperations
     * @instance
     *
     * @param {JQuery.Event} e
     * @param {ContextMenuData} menuData
     * @return {undefined}
     */
    activated(e, menuData) {
        const $menu = menuData.$menu;
        const $menuOffset = $menu.offset();
        const winHeight = $(window).height();
        const winScrollTop = $(window).scrollTop();
        const menuHeight = $menu.height();
        if (menuHeight > winHeight) {
            $menu.css({
                'height': winHeight + 'px',
                'overflow-x': 'hidden',
                'overflow-y': 'auto',
                'top': winScrollTop + 'px'
            });
        } else if (($menuOffset.top < winScrollTop) || ($menuOffset.top + menuHeight > winScrollTop + winHeight)) {
            $menu.css({
                'top': '0px'
            });
        }
    }
};
