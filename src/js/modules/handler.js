import op from './operations';
import defaults from './defaults';

let handle = {
    $currentTrigger: null,
    hoveract: {},

    // abort anything
    abortevent: function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    },
    // contextmenu show dispatcher
    contextmenu: function (e) {
        const $this = $(this);

        // disable actual context-menu if we are using the right mouse button as the trigger
        if (e.data.trigger === 'right') {
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        // abort native-triggered events unless we're triggering on right click
        if ((e.data.trigger !== 'right' && e.data.trigger !== 'demand') && e.originalEvent) {
            return;
        }

        // Let the current contextmenu decide if it should show or not based on its own trigger settings
        if (typeof e.mouseButton !== 'undefined' && e.data) {
            if (!(e.data.trigger === 'left' && e.mouseButton === 0) && !(e.data.trigger === 'right' && e.mouseButton === 2)) {
                // Mouse click is not valid.
                return;
            }
        }

        // abort event if menu is visible for this trigger
        if ($this.hasClass('context-menu-active')) {
            return;
        }

        if (!$this.hasClass('context-menu-disabled')) {
            // theoretically need to fire a show event at <menu>
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#context-menus
            // var evt = jQuery.Event("show", { data: data, pageX: e.pageX, pageY: e.pageY, relatedTarget: this });
            // e.data.$menu.trigger(evt);

            handle.$currentTrigger = $this;
            if (e.data.build) {
                const built = e.data.build(handle.$currentTrigger, e);
                // abort if build() returned false
                if (built === false) {
                    return;
                }

                // dynamically build menu on invocation
                e.data = $.extend(true, {}, defaults, e.data, built || {});

                // abort if there are no items to display
                if (!e.data.items || $.isEmptyObject(e.data.items)) {
                    // Note: jQuery captures and ignores errors from event handlers
                    if (window.console) {
                        (console.error || console.log).call(console, 'No items specified to show in contextMenu');
                    }

                    throw new Error('No Items specified');
                }

                // backreference for custom command type creation
                e.data.$trigger = handle.$currentTrigger;

                op.create(e.data);
            }
            let showMenu = false;
            for (let item in e.data.items) {
                if (e.data.items.hasOwnProperty(item)) {
                    let visible;
                    if ($.isFunction(e.data.items[item].visible)) {
                        visible = e.data.items[item].visible.call($(e.currentTarget), item, e.data);
                    } else if (typeof e.data.items[item] !== 'undefined' && e.data.items[item].visible) {
                        visible = e.data.items[item].visible === true;
                    } else {
                        visible = true;
                    }
                    if (visible) {
                        showMenu = true;
                    }
                }
            }
            if (showMenu) {
                // show menu
                op.show.call($this, e.data, e.pageX, e.pageY);
            }
        }
    },
    // contextMenu left-click trigger
    click: function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(this).trigger($.Event('contextmenu', {data: e.data, pageX: e.pageX, pageY: e.pageY}));
    },
    // contextMenu right-click trigger
    mousedown: function (e) {
        // register mouse down
        const $this = $(this);

        // hide any previous menus
        if (handle.$currentTrigger && handle.$currentTrigger.length && !handle.$currentTrigger.is($this)) {
            handle.$currentTrigger.data('contextMenu').$menu.trigger('contextmenu:hide');
        }

        // activate on right click
        if (e.button === 2) {
            handle.$currentTrigger = $this.data('contextMenuActive', true);
        }
    },
    // contextMenu right-click trigger
    mouseup: function (e) {
        // show menu
        const $this = $(this);
        if ($this.data('contextMenuActive') && handle.$currentTrigger && handle.$currentTrigger.length && handle.$currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            handle.$currentTrigger = $this;
            $this.trigger($.Event('contextmenu', {data: e.data, pageX: e.pageX, pageY: e.pageY}));
        }

        $this.removeData('contextMenuActive');
    },
    // contextMenu hover trigger
    mouseenter: function (e) {
        const $this = $(this);
        const $related = $(e.relatedTarget);
        const $document = $(document);

        // abort if we're coming from a menu
        if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
            return;
        }

        // abort if a menu is shown
        if (handle.$currentTrigger && handle.$currentTrigger.length) {
            return;
        }

        handle.hoveract.pageX = e.pageX;
        handle.hoveract.pageY = e.pageY;
        handle.hoveract.data = e.data;
        $document.on('mousemove.contextMenuShow', handle.mousemove);
        handle.hoveract.timer = setTimeout(function () {
            handle.hoveract.timer = null;
            $document.off('mousemove.contextMenuShow');
            handle.$currentTrigger = $this;
            $this.trigger($.Event('contextmenu', {
                data: handle.hoveract.data,
                pageX: handle.hoveract.pageX,
                pageY: handle.hoveract.pageY
            }));
        }, e.data.delay);
    },
    // contextMenu hover trigger
    mousemove: function (e) {
        handle.hoveract.pageX = e.pageX;
        handle.hoveract.pageY = e.pageY;
    },
    // contextMenu hover trigger
    mouseleave: function (e) {
        // abort if we're leaving for a menu
        const $related = $(e.relatedTarget);
        if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
            return;
        }

        try {
            clearTimeout(handle.hoveract.timer);
        } catch (e) {
        }

        handle.hoveract.timer = null;
    },
    // click on layer to hide contextMenu
    layerClick: function (e) {
        let $this = $(this);
        let root = $this.data('contextMenuRoot');
        let button = e.button;
        let x = e.pageX;
        let y = e.pageY;
        let target;
        let offset;

        e.preventDefault();

        setTimeout(function () {
            let $window = $(window);
            let triggerAction = ((root.trigger === 'left' && button === 0) || (root.trigger === 'right' && button === 2));

            // find the element that would've been clicked, wasn't the layer in the way
            if (document.elementFromPoint && root.$layer) {
                root.$layer.hide();
                target = document.elementFromPoint(x - $window.scrollLeft(), y - $window.scrollTop());

                // also need to try and focus this element if we're in a contenteditable area,
                // as the layer will prevent the browser mouse action we want
                if (target.isContentEditable) {
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNode(target);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                $(target).trigger(e);
                root.$layer.show();
            }

            if (root.hideOnSecondTrigger && triggerAction && root.$menu !== null && typeof root.$menu !== 'undefined') {
                root.$menu.trigger('contextmenu:hide');
                return;
            }

            if (root.reposition && triggerAction) {
                if (document.elementFromPoint) {
                    if (root.$trigger.is(target)) {
                        root.position.call(root.$trigger, root, x, y);
                        return;
                    }
                } else {
                    offset = root.$trigger.offset();
                    const $window = $(window);
                    // while this looks kinda awful, it's the best way to avoid
                    // unnecessarily calculating any positions
                    offset.top += $window.scrollTop();
                    if (offset.top <= e.pageY) {
                        offset.left += $window.scrollLeft();
                        if (offset.left <= e.pageX) {
                            offset.bottom = offset.top + root.$trigger.outerHeight();
                            if (offset.bottom >= e.pageY) {
                                offset.right = offset.left + root.$trigger.outerWidth();
                                if (offset.right >= e.pageX) {
                                    // reposition
                                    root.position.call(root.$trigger, root, x, y);
                                    return;
                                }
                            }
                        }
                    }
                }
            }

            if (target && triggerAction) {
                root.$trigger.one('contextmenu:hidden', function () {
                    $(target).contextMenu({x: x, y: y, button: button});
                });
            }

            if (root !== null && typeof root !== 'undefined' && root.$menu !== null && typeof root.$menu !== 'undefined') {
                root.$menu.trigger('contextmenu:hide');
            }
        }, 50);
    },
    // key handled :hover
    keyStop: function (e, opt) {
        if (!opt.isInput) {
            e.preventDefault();
        }

        e.stopPropagation();
    },
    key: function (e) {
        let opt = {};

        // Only get the data from handle.$currentTrigger if it exists
        if (handle.$currentTrigger) {
            opt = handle.$currentTrigger.data('contextMenu') || {};
        }
        // If the trigger happen on a element that are above the contextmenu do this
        if (typeof opt.zIndex === 'undefined') {
            opt.zIndex = 0;
        }
        const getZIndexOfTriggerTarget = function (target) {
            if (target.style.zIndex !== '') {
                return target.style.zIndex;
            } else {
                if (target.offsetParent !== null && typeof target.offsetParent !== 'undefined') {
                    return getZIndexOfTriggerTarget(target.offsetParent);
                } else if (target.parentElement !== null && typeof target.parentElement !== 'undefined') {
                    return getZIndexOfTriggerTarget(target.parentElement);
                }
            }
        };
        let targetZIndex = getZIndexOfTriggerTarget(e.target);

        // If targetZIndex is heigher then opt.zIndex dont progress any futher.
        // This is used to make sure that if you are using a dialog with a input / textarea / contenteditable div
        // and its above the contextmenu it wont steal keys events
        if (opt.$menu && parseInt(targetZIndex, 10) > parseInt(opt.$menu.css('zIndex'), 10)) {
            return;
        }
        switch (e.keyCode) {
            case 9:
            case 38: // up
                handle.keyStop(e, opt);
                // if keyCode is [38 (up)] or [9 (tab) with shift]
                if (opt.isInput) {
                    if (e.keyCode === 9 && e.shiftKey) {
                        e.preventDefault();
                        if (opt.$selected) {
                            opt.$selected.find('input, textarea, select').blur();
                        }
                        if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                            opt.$menu.trigger('prevcommand');
                        }
                        return;
                    } else if (e.keyCode === 38 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                        // checkboxes don't capture this key
                        e.preventDefault();
                        return;
                    }
                } else if (e.keyCode !== 9 || e.shiftKey) {
                    if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                        opt.$menu.trigger('prevcommand');
                    }
                    return;
                }
                break;
            // omitting break;
            // case 9: // tab - reached through omitted break;
            case 40: // down
                handle.keyStop(e, opt);
                if (opt.isInput) {
                    if (e.keyCode === 9) {
                        e.preventDefault();
                        if (opt.$selected) {
                            opt.$selected.find('input, textarea, select').blur();
                        }
                        if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                            opt.$menu.trigger('nextcommand');
                        }
                        return;
                    } else if (e.keyCode === 40 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                        // checkboxes don't capture this key
                        e.preventDefault();
                        return;
                    }
                } else {
                    if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                        opt.$menu.trigger('nextcommand');
                    }
                    return;
                }
                break;

            case 37: // left
                handle.keyStop(e, opt);
                if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                    break;
                }

                if (!opt.$selected.parent().hasClass('context-menu-root')) {
                    const $parent = opt.$selected.parent().parent();
                    opt.$selected.trigger('contextmenu:blur');
                    opt.$selected = $parent;
                    return;
                }
                break;

            case 39: // right
                handle.keyStop(e, opt);
                if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                    break;
                }

                const itemdata = opt.$selected.data('contextMenu') || {};
                if (itemdata.$menu && opt.$selected.hasClass('context-menu-submenu')) {
                    opt.$selected = null;
                    itemdata.$selected = null;
                    itemdata.$menu.trigger('nextcommand');
                    return;
                }
                break;

            case 35: // end
            case 36: // home
                if (opt.$selected && opt.$selected.find('input, textarea, select').length) {
                    break;
                } else {
                    ((opt.$selected && opt.$selected.parent()) || opt.$menu)
                        .children(':not(.' + opt.classNames.disabled + ', .' + opt.classNames.notSelectable + ')')[e.keyCode === 36 ? 'first' : 'last']()
                        .trigger('contextmenu:focus');
                    e.preventDefault();
                    break;
                }
            case 13: // enter
                handle.keyStop(e, opt);
                if (opt.isInput) {
                    if (opt.$selected && !opt.$selected.is('textarea, select')) {
                        e.preventDefault();
                        return;
                    }
                    break;
                }
                if (typeof opt.$selected !== 'undefined' && opt.$selected !== null) {
                    opt.$selected.trigger('mouseup');
                }
                return;
            case 32: // space
            case 33: // page up
            case 34: // page down
                // prevent browser from scrolling down while menu is visible
                handle.keyStop(e, opt);
                return;

            case 27: // esc
                handle.keyStop(e, opt);
                if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                    opt.$menu.trigger('contextmenu:hide');
                }
                return;

            default: // 0-9, a-z
                const k = (String.fromCharCode(e.keyCode)).toUpperCase();
                if (opt.accesskeys && opt.accesskeys[k]) {
                    // according to the specs accesskeys must be invoked immediately
                    opt.accesskeys[k].$node.trigger(opt.accesskeys[k].$menu ? 'contextmenu:focus' : 'mouseup');
                    return;
                }
                break;
        }
        // pass event to selected item,
        // stop propagation to avoid endless recursion
        e.stopPropagation();
        if (typeof opt.$selected !== 'undefined' && opt.$selected !== null) {
            opt.$selected.trigger(e);
        }
    },
    // select previous possible command in menu
    prevItem: function (e) {
        e.stopPropagation();
        let opt = $(this).data('contextMenu') || {};
        const root = $(this).data('contextMenuRoot') || {};

        // obtain currently selected menu
        if (opt.$selected) {
            const $s = opt.$selected;
            opt = opt.$selected.parent().data('contextMenu') || {};
            opt.$selected = $s;
        }

        const $children = opt.$menu.children();
        let $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev();
        const $round = $prev;

        // skip disabled or hidden elements
        while ($prev.hasClass(root.classNames.disabled) || $prev.hasClass(root.classNames.notSelectable) || $prev.is(':hidden')) {
            if ($prev.prev().length) {
                $prev = $prev.prev();
            } else {
                $prev = $children.last();
            }

            if ($prev.is($round)) {
                // break endless loop
                return;
            }
        }

        // leave current
        if (opt.$selected) {
            handle.itemMouseleave.call(opt.$selected.get(0), e);
        }

        // activate next
        handle.itemMouseenter.call($prev.get(0), e);

        // focus input
        const $input = $prev.find('input, textarea, select');
        if ($input.length) {
            $input.focus();
        }
    },
    // select next possible command in menu
    nextItem: function (e) {
        e.stopPropagation();
        let opt = $(this).data('contextMenu') || {};
        let root = $(this).data('contextMenuRoot') || {};

        // obtain currently selected menu
        if (opt.$selected) {
            const $s = opt.$selected;
            opt = opt.$selected.parent().data('contextMenu') || {};
            opt.$selected = $s;
        }

        const $children = opt.$menu.children();
        let $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next();
        const $round = $next;

        // skip disabled
        while ($next.hasClass(root.classNames.disabled) || $next.hasClass(root.classNames.notSelectable) || $next.is(':hidden')) {
            if ($next.next().length) {
                $next = $next.next();
            } else {
                $next = $children.first();
            }
            if ($next.is($round)) {
                // break endless loop
                return;
            }
        }

        // leave current
        if (opt.$selected) {
            handle.itemMouseleave.call(opt.$selected.get(0), e);
        }

        // activate next
        handle.itemMouseenter.call($next.get(0), e);

        // focus input
        const $input = $next.find('input, textarea, select');
        if ($input.length) {
            $input.focus();
        }
    },
    // flag that we're inside an input so the key handler can act accordingly
    focusInput: function () {
        let $this = $(this).closest('.context-menu-item');
        let data = $this.data();
        let opt = data.contextMenu;
        let root = data.contextMenuRoot;

        root.$selected = opt.$selected = $this;
        root.isInput = opt.isInput = true;
    },
    // flag that we're inside an input so the key handler can act accordingly
    blurInput: function () {
        let $this = $(this).closest('.context-menu-item');
        let data = $this.data();
        let opt = data.contextMenu;
        let root = data.contextMenuRoot;

        root.isInput = opt.isInput = false;
    },
    // :hover on menu
    menuMouseenter: function () {
        let root = $(this).data().contextMenuRoot;
        root.hovering = true;
    },
    // :hover on menu
    menuMouseleave: function (e) {
        let root = $(this).data().contextMenuRoot;
        if (root.$layer && root.$layer.is(e.relatedTarget)) {
            root.hovering = false;
        }
    },
    // :hover done manually so key handling is possible
    itemMouseenter: function (e) {
        let $this = $(this);
        let data = $this.data();
        let opt = data.contextMenu;
        let root = data.contextMenuRoot;

        root.hovering = true;

        // abort if we're re-entering
        if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        // make sure only one item is selected
        (opt.$menu ? opt : root).$menu
            .children('.' + root.classNames.hover).trigger('contextmenu:blur')
            .children('.hover').trigger('contextmenu:blur');

        if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
            opt.$selected = null;
            return;
        }

        $this.trigger('contextmenu:focus');
    },
    // :hover done manually so key handling is possible
    itemMouseleave: function (e) {
        let $this = $(this);
        let data = $this.data();
        let opt = data.contextMenu;
        let root = data.contextMenuRoot;

        if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
            if (typeof root.$selected !== 'undefined' && root.$selected !== null) {
                root.$selected.trigger('contextmenu:blur');
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            root.$selected = opt.$selected = opt.$node;
            return;
        }

        if (opt && opt.$menu && opt.$menu.hasClass('context-menu-visible')) {
            return;
        }

        $this.trigger('contextmenu:blur');
    },
    // contextMenu item click
    itemClick: function (e) {
        let $this = $(this);
        let data = $this.data();
        let opt = data.contextMenu;
        let root = data.contextMenuRoot;
        let key = data.contextMenuKey;
        let callback;

        // abort if the key is unknown or disabled or is a menu
        if (!opt.items[key] || $this.is('.' + root.classNames.disabled + ', .context-menu-separator, .' + root.classNames.notSelectable) || ($this.is('.context-menu-submenu') && root.selectableSubMenu === false)) {
            return;
        }

        e.preventDefault();
        e.stopImmediatePropagation();

        if ($.isFunction(opt.callbacks[key]) && Object.prototype.hasOwnProperty.call(opt.callbacks, key)) {
            // item-specific callback
            callback = opt.callbacks[key];
        } else if ($.isFunction(root.callback)) {
            // default callback
            callback = root.callback;
        } else {
            // no callback, no action
            return;
        }

        // hide menu if callback doesn't stop that
        if (callback.call(root.$trigger, key, root, e) !== false) {
            root.$menu.trigger('contextmenu:hide');
        } else if (root.$menu.parent().length) {
            op.update.call(root.$trigger, root);
        }
    },
    // ignore click events on input elements
    inputClick: function (e) {
        e.stopImmediatePropagation();
    },
    // hide <menu>
    hideMenu: function (e, data) {
        const root = $(this).data('contextMenuRoot');
        op.hide.call(root.$trigger, root, data && data.force);
    },
    // focus <command>
    focusItem: function (e) {
        e.stopPropagation();
        const $this = $(this);
        const data = $this.data();
        const opt = data.contextMenu;
        const root = data.contextMenuRoot;

        if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
            return;
        }

        $this
            .addClass([root.classNames.hover, root.classNames.visible].join(' '))
            // select other items and included items
            .parent().find('.context-menu-item').not($this)
            .removeClass(root.classNames.visible)
            .filter('.' + root.classNames.hover)
            .trigger('contextmenu:blur');

        // remember selected
        opt.$selected = root.$selected = $this;

        if (opt && opt.$node && opt.$node.hasClass('context-menu-submenu')) {
            opt.$node.addClass(root.classNames.hover);
        }

        // position sub-menu - do after show so dumb $.ui.position can keep up
        if (opt.$node) {
            root.positionSubmenu.call(opt.$node, opt.$menu);
        }
    },
    // blur <command>
    blurItem: function (e) {
        e.stopPropagation();
        const $this = $(this);
        const data = $this.data();
        const opt = data.contextMenu;
        const root = data.contextMenuRoot;

        if (opt.autoHide) { // for tablets and touch screens this needs to remain
            $this.removeClass(root.classNames.visible);
        }
        $this.removeClass(root.classNames.hover);
        opt.$selected = null;
    }
};

export default handle;
