import defaults from './defaults';
import handle from './handler';
import op from './operations';

let counter = 0;
let namespaces = {};
let menus = {};
let initialized = false;

export default function manager(operation, options) {
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
    var o = $.extend(true, {}, defaults, options || {});
    var $document = $(document);
    var $context = $document;
    var _hasContext = false;

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
            if(_hasContext){
                op.update($context);
            } else {
                for(var menu in menus){
                    if(menus.hasOwnProperty(menu)){
                        op.update(menus[menu]);
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
            counter++;
            o.ns = '.contextMenu' + counter;
            if (!_hasContext) {
                namespaces[o.selector] = o.ns;
            }
            menus[o.ns] = o;

            // default to right click
            if (!o.trigger) {
                o.trigger = 'right';
            }

            if (!initialized) {
                var itemClick = o.itemClickEvent === 'click' ? 'click.contextMenu' : 'mouseup.contextMenu';
                var contextMenuItemObj = {
                    // 'mouseup.contextMenu': handle.itemClick,
                    // 'click.contextMenu': handle.itemClick,
                    'contextmenu:focus.contextMenu': handle.focusItem,
                    'contextmenu:blur.contextMenu': handle.blurItem,
                    'contextmenu.contextMenu': handle.abortevent,
                    'mouseenter.contextMenu': handle.itemMouseenter,
                    'mouseleave.contextMenu': handle.itemMouseleave
                };
                contextMenuItemObj[itemClick] = handle.itemClick;

                // make sure item click is registered first
                $document
                    .on({
                        'contextmenu:hide.contextMenu': handle.hideMenu,
                        'prevcommand.contextMenu': handle.prevItem,
                        'nextcommand.contextMenu': handle.nextItem,
                        'contextmenu.contextMenu': handle.abortevent,
                        'mouseenter.contextMenu': handle.menuMouseenter,
                        'mouseleave.contextMenu': handle.menuMouseleave
                    }, '.context-menu-list')
                    .on('mouseup.contextMenu', '.context-menu-input', handle.inputClick)
                    .on(contextMenuItemObj, '.context-menu-item');

                initialized = true;
            }

            // engage native contextmenu event
            $context
                .on('contextmenu' + o.ns, o.selector, o, handle.contextmenu);

            if (_hasContext) {
                // add remove hook, just in case
                $context.on('remove' + o.ns, function () {
                    $(this).contextMenu('destroy');
                });
            }

            switch (o.trigger) {
                case 'hover':
                    $context
                        .on('mouseenter' + o.ns, o.selector, o, handle.mouseenter)
                        .on('mouseleave' + o.ns, o.selector, o, handle.mouseleave);
                    break;

                case 'left':
                    $context.on('click' + o.ns, o.selector, o, handle.click);
                    break;
                case 'touchstart':
                    $context.on('touchstart' + o.ns, o.selector, o, handle.click);
                    break;
                /*
                 default:
                 // http://www.quirksmode.org/dom/events/contextmenu.html
                 $document
                 .on('mousedown' + o.ns, o.selector, o, handle.mousedown)
                 .on('mouseup' + o.ns, o.selector, o, handle.mouseup);
                 break;
                 */
            }

            // create menu
            if (!o.build) {
                op.create(o);
            }
            break;

        case 'destroy':
            var $visibleMenu;
            if (_hasContext) {
                // get proper options
                var context = o.context;
                $.each(menus, function (ns, o) {

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
                        if (menus[o.ns].$menu) {
                            menus[o.ns].$menu.remove();
                        }

                        delete menus[o.ns];
                    } catch (e) {
                        menus[o.ns] = null;
                    }

                    $(o.context).off(o.ns);

                    return true;
                });
            } else if (!o.selector) {
                $document.off('.contextMenu .contextMenuAutoHide');
                $.each(menus, function (ns, o) {
                    $(o.context).off(o.ns);
                });

                namespaces = {};
                menus = {};
                counter = 0;
                initialized = false;

                $('#context-menu-layer, .context-menu-list').remove();
            } else if (namespaces[o.selector]) {
                $visibleMenu = $('.context-menu-list').filter(':visible');
                if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is(o.selector)) {
                    $visibleMenu.trigger('contextmenu:hide', {force: true});
                }

                try {
                    if (menus[namespaces[o.selector]].$menu) {
                        menus[namespaces[o.selector]].$menu.remove();
                    }

                    delete menus[namespaces[o.selector]];
                } catch (e) {
                    menus[namespaces[o.selector]] = null;
                }

                $document.off(namespaces[o.selector]);
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
};