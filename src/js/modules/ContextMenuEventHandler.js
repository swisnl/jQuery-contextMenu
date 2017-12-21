import defaults from '../defaults';

/**
 * @property {?JQuery} $currentTrigger
 * @property {Object} hoveract
 * @property {ContextMenuOperations} operations
 */
export default class ContextMenuEventHandler {
    constructor() {
        this.$currentTrigger = null;
        this.hoveract = {};
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    abortevent(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    contextmenu(e) {
        const $this = $(e.currentTarget);

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

            e.data.manager.handler.$currentTrigger = $this;
            if (e.data.build) {
                const built = e.data.build(e, this.$currentTrigger);
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
                e.data.$trigger = e.data.manager.handler.$currentTrigger;

                e.data.manager.operations.create(e, e.data);
            }
            let showMenu = false;
            for (let item in e.data.items) {
                if (e.data.items.hasOwnProperty(item)) {
                    let visible;
                    if ($.isFunction(e.data.items[item].visible)) {
                        visible = e.data.items[item].visible.call(e, $(e.currentTarget), item, e.data);
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
                e.data.manager.operations.show.call($this, e, e.data, e.pageX, e.pageY);
            }
        }
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    click(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(this).trigger($.Event('contextmenu', {data: e.data, pageX: e.pageX, pageY: e.pageY, originalEvent: e}));
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    mousedown(e) {
        // register mouse down
        const $this = $(this);

        // hide any previous menus
        if (e.data.manager.handler.$currentTrigger && e.data.manager.handler.$currentTrigger.length && !e.data.manager.handler.$currentTrigger.is($this)) {
            e.data.manager.handler.$currentTrigger.data('contextMenu').$menu.trigger($.Event('contextmenu', {originalEvent: e}));
        }

        // activate on right click
        if (e.button === 2) {
            e.data.manager.handler.$currentTrigger = $this.data('contextMenuActive', true);
        }
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    mouseup(e) {
        // show menu
        const $this = $(this);
        if ($this.data('contextMenuActive') && e.data.manager.handler.$currentTrigger && e.data.manager.handler.$currentTrigger.length && e.data.manager.handler.$currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.data.manager.handler.$currentTrigger = $this;
            $this.trigger($.Event('contextmenu', {data: e.data, pageX: e.pageX, pageY: e.pageY, originalEvent: e}));
        }

        $this.removeData('contextMenuActive');
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    mouseenter(e) {
        const $this = $(this);
        const $related = $(e.relatedTarget);
        const $document = $(document);

        // abort if we're coming from a menu
        if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
            return;
        }

        // abort if a menu is shown
        if (e.data.manager.handler.$currentTrigger && e.data.manager.handler.$currentTrigger.length) {
            return;
        }

        e.data.manager.handler.hoveract.pageX = e.pageX;
        e.data.manager.handler.hoveract.pageY = e.pageY;
        e.data.manager.handler.hoveract.data = e.data;
        $document.on('mousemove.contextMenuShow', e.data.manager.handler.mousemove);
        e.data.manager.handler.hoveract.timer = setTimeout(function () {
            e.data.manager.handler.hoveract.timer = null;
            $document.off('mousemove.contextMenuShow');
            e.data.manager.handler.$currentTrigger = $this;
            $this.trigger($.Event('contextmenu', {
                data: e.data.manager.handler.hoveract.data,
                pageX: e.data.manager.handler.hoveract.pageX,
                pageY: e.data.manager.handler.hoveract.pageY
            }));
        }, e.data.delay);
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    mousemove(e) {
        e.data.manager.handler.hoveract.pageX = e.pageX;
        e.data.manager.handler.hoveract.pageY = e.pageY;
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    mouseleave(e) {
        // abort if we're leaving for a menu
        const $related = $(e.relatedTarget);
        if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
            return;
        }

        try {
            clearTimeout(e.data.manager.handler.hoveract.timer);
        } catch (e) {

        }

        e.data.manager.handler.hoveract.timer = null;
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    layerClick(e) {
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
                root.$menu.trigger('contextmenu:hide', {originalEvent: e});
                return;
            }

            if (root.reposition && triggerAction) {
                if (document.elementFromPoint) {
                    if (root.$trigger.is(target)) {
                        root.position.call(root.$trigger, e, root, x, y);
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
                                    root.position.call(root.$trigger, e, root, x, y);
                                    return;
                                }
                            }
                        }
                    }
                }
            }

            if (target && triggerAction) {
                root.$trigger.one('contextmenu:hidden', function () {
                    $(target).contextMenu({x: x, y: y, button: button, originalEvent: e});
                });
            }

            if (root !== null && typeof root !== 'undefined' && root.$menu !== null && typeof root.$menu !== 'undefined') {
                root.$menu.trigger('contextmenu:hide', {originalEvent: e});
            }
        }, 50);
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     * @param {ContextMenuItem} opt
     */
    keyStop(e, opt) {
        if (!opt.isInput) {
            e.preventDefault();
        }

        e.stopPropagation();
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    key(e) {
        let opt = {};

        // Only get the data from this.$currentTrigger if it exists
        if (e.data.manager.handler.$currentTrigger) {
            opt = e.data.manager.handler.$currentTrigger.data('contextMenu') || {};
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
                e.data.manager.handler.keyStop(e, opt);
                // if keyCode is [38 (up)] or [9 (tab) with shift]
                if (opt.isInput) {
                    if (e.keyCode === 9 && e.shiftKey) {
                        e.preventDefault();
                        if (opt.$selected) {
                            opt.$selected.find('input, textarea, select').blur();
                        }
                        if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                            opt.$menu.trigger('prevcommand', {originalEvent: e});
                        }
                        return;
                    } else if (e.keyCode === 38 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                        // checkboxes don't capture this key
                        e.preventDefault();
                        return;
                    }
                } else if (e.keyCode !== 9 || e.shiftKey) {
                    if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                        opt.$menu.trigger('prevcommand', {originalEvent: e});
                    }
                    return;
                }
                break;
            // omitting break;
            // case 9: // tab - reached through omitted break;
            case 40: // down
                e.data.manager.handler.keyStop(e, opt);
                if (opt.isInput) {
                    if (e.keyCode === 9) {
                        e.preventDefault();
                        if (opt.$selected) {
                            opt.$selected.find('input, textarea, select').blur();
                        }
                        if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                            opt.$menu.trigger('nextcommand', {originalEvent: e});
                        }
                        return;
                    } else if (e.keyCode === 40 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                        // checkboxes don't capture this key
                        e.preventDefault();
                        return;
                    }
                } else {
                    if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                        opt.$menu.trigger('nextcommand', {originalEvent: e});
                    }
                    return;
                }
                break;

            case 37: // left
                e.data.manager.handler.keyStop(e, opt);
                if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                    break;
                }

                if (!opt.$selected.parent().hasClass('context-menu-root')) {
                    const $parent = opt.$selected.parent().parent();
                    opt.$selected.trigger('contextmenu:blur', {originalEvent: e});
                    opt.$selected = $parent;
                    return;
                }
                break;

            case 39: // right
                e.data.manager.handler.keyStop(e, opt);
                if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                    break;
                }

                const itemdata = opt.$selected.data('contextMenu') || {};
                if (itemdata.$menu && opt.$selected.hasClass('context-menu-submenu')) {
                    opt.$selected = null;
                    itemdata.$selected = null;
                    itemdata.$menu.trigger('nextcommand', {originalEvent: e});
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
                        .trigger('contextmenu:focus', {originalEvent: e});
                    e.preventDefault();
                    break;
                }
            case 13: // enter
                e.data.manager.handler.keyStop(e, opt);
                if (opt.isInput) {
                    if (opt.$selected && !opt.$selected.is('textarea, select')) {
                        e.preventDefault();
                        return;
                    }
                    break;
                }
                if (typeof opt.$selected !== 'undefined' && opt.$selected !== null) {
                    opt.$selected.trigger('mouseup', {originalEvent: e});
                }
                return;
            case 32: // space
            case 33: // page up
            case 34: // page down
                // prevent browser from scrolling down while menu is visible
                e.data.manager.handler.keyStop(e, opt);
                return;

            case 27: // esc
                e.data.manager.handler.keyStop(e, opt);
                if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                    opt.$menu.trigger('contextmenu:hide', {originalEvent: e});
                }
                return;

            default: // 0-9, a-z
                const k = (String.fromCharCode(e.keyCode)).toUpperCase();
                if (opt.accesskeys && opt.accesskeys[k]) {
                    // according to the specs accesskeys must be invoked immediately
                    opt.accesskeys[k].$node.trigger(opt.accesskeys[k].$menu ? 'contextmenu:focus' : 'mouseup', {originalEvent: e});
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
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    prevItem(e) {
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
            root.manager.handler.itemMouseleave.call(opt.$selected.get(0), e);
        }

        // activate next
        root.manager.handler.itemMouseenter.call($prev.get(0), e);

        // focus input
        const $input = $prev.find('input, textarea, select');
        if ($input.length) {
            $input.focus();
        }
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    nextItem(e) {
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
            root.manager.handler.itemMouseleave.call(opt.$selected.get(0), e);
        }

        // activate next
        root.manager.handler.itemMouseenter.call($next.get(0), e);

        // focus input
        const $input = $next.find('input, textarea, select');
        if ($input.length) {
            $input.focus();
        }
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    focusInput(e) {
        let $this = $(this).closest('.context-menu-item');
        let data = $this.data();
        let opt = data.contextMenu;
        let root = data.contextMenuRoot;

        root.$selected = opt.$selected = $this;
        root.isInput = opt.isInput = true;
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    blurInput(e) {
        let $this = $(this).closest('.context-menu-item');
        let data = $this.data();
        let opt = data.contextMenu;
        let root = data.contextMenuRoot;

        root.isInput = opt.isInput = false;
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    menuMouseenter(e) {
        let root = $(this).data().contextMenuRoot;
        root.hovering = true;
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    menuMouseleave(e) {
        let root = $(this).data().contextMenuRoot;
        if (root.$layer && root.$layer.is(e.relatedTarget)) {
            root.hovering = false;
        }
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    itemMouseenter(e) {
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
            .children('.hover').trigger('contextmenu:blur', {originalEvent: e});

        if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
            opt.$selected = null;
            return;
        }

        $this.trigger('contextmenu:focus', {originalEvent: e});
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    itemMouseleave(e) {
        let $this = $(this);
        let data = $this.data();
        let opt = data.contextMenu;
        let root = data.contextMenuRoot;

        if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
            if (typeof root.$selected !== 'undefined' && root.$selected !== null) {
                root.$selected.trigger('contextmenu:blur', {originalEvent: e});
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            root.$selected = opt.$selected = opt.$node;
            return;
        }

        if (opt && opt.$menu && opt.$menu.hasClass(root.classNames.visible)) {
            return;
        }

        $this.trigger('contextmenu:blur');
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    itemClick(e) {
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
        if (callback.call(root.$trigger, e, key, opt, root) !== false) {
            root.$menu.trigger('contextmenu:hide');
        } else if (root.$menu.parent().length) {
            root.manager.operations.update.call(root.$trigger, e, root);
        }
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    inputClick(e) {
        e.stopImmediatePropagation();
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     * @param {Object} data
     */
    hideMenu(e, data) {
        const root = $(this).data('contextMenuRoot');
        root.manager.operations.hide.call(root.$trigger, e, root, data && data.force);
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    focusItem(e) {
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
            root.positionSubmenu.call(opt.$node, e, opt.$menu);
        }
    }

    /**
     * @typedef {JQuery.EventHandler}
     * @param {ContextMenuEvent|JQuery.Event} e
     */
    blurItem(e) {
        e.stopPropagation();
        const $this = $(this);
        const data = $this.data();
        const opt = data.contextMenu;
        const root = data.contextMenuRoot;

        if (root.autoHide) { // for tablets and touch screens this needs to remain
            $this.removeClass(root.classNames.visible);
        }
        $this.removeClass(root.classNames.hover);
        opt.$selected = null;
    }
};
