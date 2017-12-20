import {zindex, splitAccesskey} from '../helpers';
import handle from './event-handler';

/**
 * Operations that van be done by the contextmenu.
 *
 * @type {{handle: {}, show: op.show, hide: op.hide, create: op.create, resize: op.resize, update: op.update, layer: op.layer, processPromises: op.processPromises, activated: op.activated}}
 */
let op = {
    handle: {},

    /**
     * @param {JQuery.Event} e
     * @param opt
     * @param {Number} x
     * @param {Number} y
     */
    show: function (e, opt, x, y) {
        const $trigger = $(this);
        const css = {};

        // hide any open menus
        $('#context-menu-layer').trigger('mousedown');

        // backreference for callbacks
        opt.$trigger = $trigger;

        // show event
        if (opt.events.show.call($trigger, opt) === false) {
            handle.$currentTrigger = null;
            return;
        }

        // create or update context menu
        op.update.call($trigger, e, opt);

        // position menu
        opt.position.call($trigger, e, opt, x, y);

        // make sure we're in front
        if (opt.zIndex) {
            let additionalZValue = opt.zIndex;
            // If opt.zIndex is a function, call the function to get the right zIndex.
            if (typeof opt.zIndex === 'function') {
                additionalZValue = opt.zIndex.call($trigger, opt);
            }
            css.zIndex = zindex($trigger) + additionalZValue;
        }

        // add layer
        op.layer.call(opt.$menu, e, opt, css.zIndex);

        // adjust sub-menu zIndexes
        opt.$menu.find('ul').css('zIndex', css.zIndex + 1);

        // position and show context menu
        opt.$menu.css(css)[opt.animation.show](opt.animation.duration, function () {
            $trigger.trigger('contextmenu:visible');

            op.activated(e, opt);
            opt.events.activated(e, opt);
        });
        // make options available and set state
        $trigger
            .data('contextMenu', opt)
            .addClass('context-menu-active');

        // register key handler
        $(document).off('keydown.contextMenu').on('keydown.contextMenu', handle.key);
        // register autoHide handler
        if (opt.autoHide) {
            // mouse position handler
            $(document).on('mousemove.contextMenuAutoHide', function (e) {
                // need to capture the offset on mousemove,
                // since the page might've been scrolled since activation
                const pos = $trigger.offset();
                pos.right = pos.left + $trigger.outerWidth();
                pos.bottom = pos.top + $trigger.outerHeight();

                if (opt.$layer && !opt.hovering && (!(e.pageX >= pos.left && e.pageX <= pos.right) || !(e.pageY >= pos.top && e.pageY <= pos.bottom))) {
                    /* Additional hover check after short time, you might just miss the edge of the menu */
                    setTimeout(function () {
                        if (!opt.hovering && opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                            opt.$menu.trigger('contextmenu:hide');
                        }
                    }, 50);
                }
            });
        }
    },

    /**
     * @param {JQuery.Event} e
     * @param opt
     * @param {bool} force
     */
    hide: function (e, opt, force) {
        const $trigger = $(this);
        console.log('e', e)
        console.log('opt', opt)
        console.log('$trigger', $trigger)
        if (!opt) {
            opt = $trigger.data('contextMenu') || {};
        }

        // hide event
        if (!force && opt.events && opt.events.hide.call($trigger, e, opt) === false) {
            return;
        }

        // remove options and revert state
        $trigger
            .removeData('contextMenu')
            .removeClass('context-menu-active');

        if (opt.$layer) {
            // keep layer for a bit so the contextmenu event can be aborted properly by opera
            setTimeout((function ($layer) {
                return function () {
                    $layer.remove();
                };
            })(opt.$layer), 10);

            try {
                delete opt.$layer;
            } catch (e) {
                opt.$layer = null;
            }
        }

        // remove handle
        handle.$currentTrigger = null;
        // remove selected
        console.log('opt?', opt)
        opt.$menu.find('.' + opt.classNames.hover).trigger('contextmenu:blur');
        opt.$selected = null;
        // collapse all submenus
        opt.$menu.find('.' + opt.classNames.visible).removeClass(opt.classNames.visible);
        // unregister key and mouse handlers
        // $(document).off('.contextMenuAutoHide keydown.contextMenu'); // http://bugs.jquery.com/ticket/10705
        $(document).off('.contextMenuAutoHide').off('keydown.contextMenu');
        // hide menu
        if (opt.$menu) {
            opt.$menu[opt.animation.hide](opt.animation.duration, function () {
                // tear down dynamically built menu after animation is completed.
                if (opt.build) {
                    opt.$menu.remove();
                    Object.keys(opt).forEach((key) => {
                        switch (key) {
                            case 'ns':
                            case 'selector':
                            case 'build':
                            case 'trigger':
                                return true;

                            default:
                                opt[key] = undefined;
                                try {
                                    delete opt[key];
                                } catch (e) {
                                }
                                return true;
                        }
                    });
                }

                setTimeout(function () {
                    $trigger.trigger('contextmenu:hidden');
                }, 10);
            });
        }
    },

    /**
     * @param {JQuery.Event} e
     * @param opt
     * @param root
     */
    create: function (e, opt, root) {
        if (typeof root === 'undefined') {
            root = opt;
        }

        // create contextMenu
        opt.$menu = $('<ul class="context-menu-list"></ul>').addClass(opt.className || '').data({
            'contextMenu': opt,
            'contextMenuRoot': root
        });

        $.each(['callbacks', 'commands', 'inputs'], function (i, k) {
            opt[k] = {};
            if (!root[k]) {
                root[k] = {};
            }
        });

        if (!root.accesskeys) {
            root.accesskeys = {};
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
        $.each(opt.items, function (key, item) {
            let $t = $('<li class="context-menu-item"></li>').addClass(item.className || '');
            let $label = null;
            let $input = null;

            // iOS needs to see a click-event bound to an element to actually
            // have the TouchEvents infrastructure trigger the click event
            $t.on('click', $.noop);

            // Make old school string seperator a real item so checks wont be
            // akward later.
            // And normalize 'cm_separator' into 'cm_seperator'.
            if (typeof item === 'string' || item.type === 'cm_separator') {
                item = {type: 'cm_seperator'};
            }

            item.$node = $t.data({
                'contextMenu': opt,
                'contextMenuRoot': root,
                'contextMenuKey': key
            });

            // register accesskey
            // NOTE: the accesskey attribute should be applicable to any element, but Safari5 and Chrome13 still can't do that
            if (typeof item.accesskey !== 'undefined') {
                const aks = splitAccesskey(item.accesskey);
                for (let i = 0, ak; ak = aks[i]; i++) {
                    if (!root.accesskeys[ak]) {
                        root.accesskeys[ak] = item;
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

            if (item.type && root.types[item.type]) {
                // run custom type handler
                root.types[item.type].call($t, item, opt, root);
                // register commands
                $.each([opt, root], function (i, k) {
                    k.commands[key] = item;
                    // Overwrite only if undefined or the item is appended to the root. This so it
                    // doesn't overwrite callbacks of root elements if the name is the same.
                    if ($.isFunction(item.callback) && (typeof k.callbacks[key] === 'undefined' || typeof opt.type === 'undefined')) {
                        k.callbacks[key] = item.callback;
                    }
                });
            } else {
                // add label for input
                if (item.type === 'cm_seperator') {
                    $t.addClass('context-menu-separator ' + root.classNames.notSelectable);
                } else if (item.type === 'html') {
                    $t.addClass('context-menu-html ' + root.classNames.notSelectable);
                } else if (item.type && item.type !== 'sub') {
                    $label = $('<label></label>').appendTo($t);
                    createNameNode(item).appendTo($label);

                    $t.addClass('context-menu-input');
                    opt.hasTypes = true;
                    $.each([opt, root], function (i, k) {
                        k.commands[key] = item;
                        k.inputs[key] = item;
                    });
                } else if (item.items) {
                    item.type = 'sub';
                }

                switch (item.type) {
                    case 'cm_seperator':
                        break;

                    case 'text':
                        $input = $('<input type="text" value="1" name="" />')
                            .attr('name', 'context-menu-input-' + key)
                            .val(item.value || '')
                            .appendTo($label);
                        break;

                    case 'textarea':
                        $input = $('<textarea name=""></textarea>')
                            .attr('name', 'context-menu-input-' + key)
                            .val(item.value || '')
                            .appendTo($label);

                        if (item.height) {
                            $input.height(item.height);
                        }
                        break;

                    case 'checkbox':
                        $input = $('<input type="checkbox" value="1" name="" />')
                            .attr('name', 'context-menu-input-' + key)
                            .val(item.value || '')
                            .prop('checked', !!item.selected)
                            .prependTo($label);
                        break;

                    case 'radio':
                        $input = $('<input type="radio" value="1" name="" />')
                            .attr('name', 'context-menu-input-' + item.radio)
                            .val(item.value || '')
                            .prop('checked', !!item.selected)
                            .prependTo($label);
                        break;

                    case 'select':
                        $input = $('<select name=""></select>')
                            .attr('name', 'context-menu-input-' + key)
                            .appendTo($label);
                        if (item.options) {
                            $.each(item.options, function (value, text) {
                                $('<option></option>').val(value).text(text).appendTo($input);
                            });
                            $input.val(item.selected);
                        }
                        break;

                    case 'sub':
                        createNameNode(item).appendTo($t);
                        item.appendTo = item.$node;
                        $t.data('contextMenu', item).addClass('context-menu-submenu');
                        item.callback = null;

                        // If item contains items, and this is a promise, we should create it later
                        // check if subitems is of type promise. If it is a promise we need to create
                        // it later, after promise has been resolved.
                        if (typeof item.items.then === 'function') {
                            // probably a promise, process it, when completed it will create the sub menu's.
                            op.processPromises(e, item, root, item.items);
                        } else {
                            // normal submenu.
                            op.create(e, item, root);
                        }
                        break;

                    case 'html':
                        $(item.html).appendTo($t);
                        break;

                    default:
                        $.each([opt, root], function (i, k) {
                            k.commands[key] = item;
                            // Overwrite only if undefined or the item is appended to the root. This so it
                            // doesn't overwrite callbacks of root elements if the name is the same.
                            if ($.isFunction(item.callback) && (typeof k.callbacks[key] === 'undefined' || typeof opt.type === 'undefined')) {
                                k.callbacks[key] = item.callback;
                            }
                        });
                        createNameNode(item).appendTo($t);
                        break;
                }

                // disable key listener in <input>
                if (item.type && item.type !== 'sub' && item.type !== 'html' && item.type !== 'cm_seperator') {
                    $input
                        .on('focus', handle.focusInput)
                        .on('blur', handle.blurInput);

                    if (item.events) {
                        $input.on(item.events, opt);
                    }
                }

                // add icons
                if (item.icon) {
                    if ($.isFunction(item.icon)) {
                        item._icon = item.icon.call(this, this, $t, key, item);
                    } else {
                        if (typeof (item.icon) === 'string' && item.icon.substring(0, 3) === 'fa-') {
                            // to enable font awesome
                            item._icon = root.classNames.icon + ' ' + root.classNames.icon + '--fa fa ' + item.icon;
                        } else {
                            item._icon = root.classNames.icon + ' ' + root.classNames.icon + '-' + item.icon;
                        }
                    }
                    $t.addClass(item._icon);
                }
            }

            // cache contained elements
            item.$input = $input;
            item.$label = $label;

            // attach item to menu
            $t.appendTo(opt.$menu);

            // Disable text selection
            if (!opt.hasTypes && $.support.eventSelectstart) {
                // browsers support user-select: none,
                // IE has a special event for text-selection
                // browsers supporting neither will not be preventing text-selection
                $t.on('selectstart.disableTextSelect', handle.abortevent);
            }
        });
        // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
        if (!opt.$node) {
            opt.$menu.css('display', 'none').addClass('context-menu-root');
        }
        opt.$menu.appendTo(opt.appendTo || document.body);
    },

    /**
     * @param {JQuery.Event} e
     * @param {JQuery} $menu
     * @param {bool} nested
     */
    resize: function (e, $menu, nested) {
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
        $menu.find('> li > ul').each(function () {
            op.resize(e, $(this), true);
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
    },

    /**
     * @param {JQuery.Event} e
     * @param opt
     * @param root
     */
    update: function (e, opt, root) {
        console.log('update', e)
        console.log('update', opt)
        console.log('update', root)
        const $trigger = this;
        if (typeof root === 'undefined') {
            root = opt;
            op.resize(e, opt.$menu);
        }
        // re-check disabled for each item
        opt.$menu.children().each(function () {
            let $item = $(this)
            let key = $item.data('contextMenuKey')
            let item = opt.items[key]
            let disabled = ($.isFunction(item.disabled) && item.disabled.call($trigger, e, key, opt, root)) || item.disabled === true
            let visible;

            if ($.isFunction(item.visible)) {
                visible = item.visible.call($trigger, e, key, root);
            } else if (typeof item.visible !== 'undefined') {
                visible = item.visible === true;
            } else {
                visible = true;
            }
            $item[visible ? 'show' : 'hide']();

            // dis- / enable item
            $item[disabled ? 'addClass' : 'removeClass'](root.classNames.disabled);

            if ($.isFunction(item.icon)) {
                $item.removeClass(item._icon);
                item._icon = item.icon.call(this, $trigger, $item, key, item);
                $item.addClass(item._icon);
            }

            if (item.type) {
                // dis- / enable input elements
                $item.find('input, select, textarea').prop('disabled', disabled);

                // update input states
                switch (item.type) {
                    case 'text':
                    case 'textarea':
                        item.$input.val(item.value || '');
                        break;

                    case 'checkbox':
                    case 'radio':
                        item.$input.val(item.value || '').prop('checked', !!item.selected);
                        break;

                    case 'select':
                        item.$input.val((item.selected === 0 ? '0' : item.selected) || '');
                        break;
                }
            }

            if (item.$menu) {
                // update sub-menu
                op.update.call($trigger, e, item, root);
            }
        });
    },

    /**
     * @param {JQuery.Event} e
     * @param opt
     * @param zIndex
     * @returns {jQuery}
     */
    layer: function (e, opt, zIndex) {
        const $window = $(window);
        // add transparent layer for click area
        // filter and background for Internet Explorer, Issue #23
        const $layer = opt.$layer = $('<div id="context-menu-layer"></div>')
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
            .data('contextMenuRoot', opt)
            .insertBefore(this)
            .on('contextmenu', handle.abortevent)
            .on('mousedown', handle.layerClick);

        // IE6 doesn't know position:fixed;
        if (typeof document.body.style.maxWidth === 'undefined') { // IE6 doesn't support maxWidth
            $layer.css({
                'position': 'absolute',
                'height': $(document).height()
            });
        }

        return $layer;
    },

    /**
     * @param {JQuery.Event} e
     * @param opt
     * @param root
     * @param promise
     */
    processPromises: function (opt, root, promise) {
        // Start
        opt.$node.addClass(root.classNames.iconLoadingClass);

        function finishPromiseProcess(opt, root, items) {
            if (typeof root.$menu === 'undefined' || !root.$menu.is(':visible')) {
                return;
            }
            opt.$node.removeClass(root.classNames.iconLoadingClass);
            opt.items = items;
            op.create(e, opt, root); // Create submenu
            op.update(e, opt, root); // Correctly update position if user is already hovered over menu item
            root.positionSubmenu.call(opt.$node, opt.$menu); // positionSubmenu, will only do anything if user already hovered over menu item that just got new subitems.
        }

        function errorPromise(opt, root, errorItem) {
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
            finishPromiseProcess(opt, root, errorItem);
        }

        function completedPromise(opt, root, items) {
            // Completed promise (dev called promise.resolve). We now have a list of items which can
            // be used to create the rest of the context menu.
            if (typeof items === 'undefined') {
                // Null result, dev should have checked
                errorPromise(undefined); // own error object
            }
            finishPromiseProcess(opt, root, items);
        }

        // Wait for promise completion. .then(success, error, notify) (we don't track notify). Bind the opt
        // and root to avoid scope problems
        promise.then(completedPromise.bind(this, opt, root), errorPromise.bind(this, opt, root));
    },

    /**
     * operation that will run after contextMenu showed on screen
     * @param {JQuery.Event} e
     * @param opt
     */
    activated: function (e, opt) {
        const $menu = opt.$menu;
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

export default op;
