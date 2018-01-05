import defaults from '../defaults';

export default class ContextMenuEventHandler {
    /**
     * @constructs ContextMenuEventHandler
     * @constructor
     * @property {?JQuery} $currentTrigger
     * @property {Object} hoveract
     */
    constructor() {
        this.$currentTrigger = null;
        this.hoveract = {};
    }

    /**
     * Helper to abort an event
     *
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    abortevent(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    contextmenu(e) {
        const $this = $(e.currentTarget);

        if (!e.data) {
            throw new Error('No data attached');
        }

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
        if (typeof e.mouseButton !== 'undefined') {
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
                const built = e.data.build(e, $this);
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

            Object.keys(e.data.items).forEach((key) => {
                let visible;
                if (typeof e.data.items[key].visible === 'function') {
                    visible = e.data.items[key].visible.call($this, e, key, e.data, e.data);
                } else if (typeof e.data.items[key].visible !== 'undefined') {
                    visible = e.data.items[key].visible === true;
                } else {
                    visible = true;
                }
                if (visible) {
                    showMenu = true;
                }
            });

            if (showMenu) {
                // show menu
                e.data.manager.operations.show.call($this, e, e.data, e.pageX, e.pageY);
            }
        }
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    click(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(this).trigger($.Event('contextmenu', {data: e.data, pageX: e.pageX, pageY: e.pageY, originalEvent: e}));
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    mousedown(e) {
        // register mouse down
        const $this = $(this);

        // hide any previous menus
        if (e.data.manager.handler.$currentTrigger && e.data.manager.handler.$currentTrigger.length && !e.data.manager.handler.$currentTrigger.is($this)) {
            e.data.manager.handler.$currentTrigger.data('contextMenu').$menu.trigger($.Event('contextmenu', {data: e.data, originalEvent: e}));
        }

        // activate on right click
        if (e.button === 2) {
            e.data.manager.handler.$currentTrigger = $this.data('contextMenuActive', true);
        }
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
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
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
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
        e.data.manager.handler.hoveract.timer = setTimeout(() => {
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
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    mousemove(e) {
        e.data.manager.handler.hoveract.pageX = e.pageX;
        e.data.manager.handler.hoveract.pageY = e.pageY;
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
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
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    layerClick(e) {
        let $this = $(this);
        /** @var ContextMenuData **/
        let root = $this.data('contextMenuRoot');

        if (root === null || typeof root === 'undefined') {
            throw new Error('No ContextMenuData found');
        }

        let button = e.button;
        let x = e.pageX;
        let y = e.pageY;
        let target;
        let offset;

        e.preventDefault();

        setTimeout(() => {
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
                root.$menu.trigger('contextmenu:hide', {data: root, originalEvent: e});
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
                root.$trigger.one('contextmenu:hidden', () => {
                    $(target).contextMenu({x: x, y: y, button: button, originalEvent: e});
                });
            }

            if (root.$menu !== null && typeof root.$menu !== 'undefined') {
                root.$menu.trigger('contextmenu:hide', {data: root, originalEvent: e});
            }
        }, 50);
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     * @param {ContextMenuItem} currentMenuData
     */
    keyStop(e, currentMenuData) {
        if (!currentMenuData.isInput) {
            e.preventDefault();
        }

        e.stopPropagation();
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    key(e) {
        let rootMenuData = {};

        // Only get the data from this.$currentTrigger if it exists
        if (e.data.manager.handler.$currentTrigger) {
            rootMenuData = e.data.manager.handler.$currentTrigger.data('contextMenu') || {};
        }
        // If the trigger happen on a element that are above the contextmenu do this
        if (typeof rootMenuData.zIndex === 'undefined') {
            rootMenuData.zIndex = 0;
        }
        const getZIndexOfTriggerTarget = (target) => {
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

        // If targetZIndex is heigher then rootMenuData.zIndex dont progress any futher.
        // This is used to make sure that if you are using a dialog with a input / textarea / contenteditable div
        // and its above the contextmenu it wont steal keys events
        if (rootMenuData.$menu && parseInt(targetZIndex, 10) > parseInt(rootMenuData.$menu.css('zIndex'), 10)) {
            return;
        }
        switch (e.keyCode) {
            case 9:
            case 38: // up
                e.data.manager.handler.keyStop(e, rootMenuData);
                // if keyCode is [38 (up)] or [9 (tab) with shift]
                if (rootMenuData.isInput) {
                    if (e.keyCode === 9 && e.shiftKey) {
                        e.preventDefault();
                        if (rootMenuData.$selected) {
                            rootMenuData.$selected.find('input, textarea, select').blur();
                        }
                        if (rootMenuData.$menu !== null && typeof rootMenuData.$menu !== 'undefined') {
                            rootMenuData.$menu.trigger('prevcommand', {data: rootMenuData, originalEvent: e});
                        }
                        return;
                    } else if (e.keyCode === 38 && rootMenuData.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                        // checkboxes don't capture this key
                        e.preventDefault();
                        return;
                    }
                } else if (e.keyCode !== 9 || e.shiftKey) {
                    if (rootMenuData.$menu !== null && typeof rootMenuData.$menu !== 'undefined') {
                        rootMenuData.$menu.trigger('prevcommand', {data: rootMenuData, originalEvent: e});
                    }
                    return;
                }
                break;
            // omitting break;
            // case 9: // tab - reached through omitted break;
            case 40: // down
                e.data.manager.handler.keyStop(e, rootMenuData);
                if (rootMenuData.isInput) {
                    if (e.keyCode === 9) {
                        e.preventDefault();
                        if (rootMenuData.$selected) {
                            rootMenuData.$selected.find('input, textarea, select').blur();
                        }
                        if (rootMenuData.$menu !== null && typeof rootMenuData.$menu !== 'undefined') {
                            rootMenuData.$menu.trigger('nextcommand', {data: rootMenuData, originalEvent: e});
                        }
                        return;
                    } else if (e.keyCode === 40 && rootMenuData.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                        // checkboxes don't capture this key
                        e.preventDefault();
                        return;
                    }
                } else {
                    if (rootMenuData.$menu !== null && typeof rootMenuData.$menu !== 'undefined') {
                        rootMenuData.$menu.trigger('nextcommand', {data: rootMenuData, originalEvent: e});
                    }
                    return;
                }
                break;

            case 37: // left
                e.data.manager.handler.keyStop(e, rootMenuData);
                if (rootMenuData.isInput || !rootMenuData.$selected || !rootMenuData.$selected.length) {
                    break;
                }

                if (!rootMenuData.$selected.parent().hasClass('context-menu-root')) {
                    const $parent = rootMenuData.$selected.parent().parent();
                    rootMenuData.$selected.trigger('contextmenu:blur', {data: rootMenuData, originalEvent: e});
                    rootMenuData.$selected = $parent;
                    return;
                }
                break;

            case 39: // right
                e.data.manager.handler.keyStop(e, rootMenuData);
                if (rootMenuData.isInput || !rootMenuData.$selected || !rootMenuData.$selected.length) {
                    break;
                }

                const itemdata = rootMenuData.$selected.data('contextMenu') || {};
                if (itemdata.$menu && rootMenuData.$selected.hasClass('context-menu-submenu')) {
                    rootMenuData.$selected = null;
                    itemdata.$selected = null;
                    itemdata.$menu.trigger('nextcommand', {data: itemdata, originalEvent: e});
                    return;
                }
                break;

            case 35: // end
            case 36: // home
                if (rootMenuData.$selected && rootMenuData.$selected.find('input, textarea, select').length) {
                    break;
                } else {
                    ((rootMenuData.$selected && rootMenuData.$selected.parent()) || rootMenuData.$menu)
                        .children(':not(.' + rootMenuData.classNames.disabled + ', .' + rootMenuData.classNames.notSelectable + ')')[e.keyCode === 36 ? 'first' : 'last']()
                        .trigger('contextmenu:focus', {data: rootMenuData, originalEvent: e});
                    e.preventDefault();
                    break;
                }
            case 13: // enter
                e.data.manager.handler.keyStop(e, rootMenuData);
                if (rootMenuData.isInput) {
                    if (rootMenuData.$selected && !rootMenuData.$selected.is('textarea, select')) {
                        e.preventDefault();
                        return;
                    }
                    break;
                }
                if (typeof rootMenuData.$selected !== 'undefined' && rootMenuData.$selected !== null) {
                    rootMenuData.$selected.trigger('mouseup', {data: rootMenuData, originalEvent: e});
                }
                return;
            case 32: // space
            case 33: // page up
            case 34: // page down
                // prevent browser from scrolling down while menu is visible
                e.data.manager.handler.keyStop(e, rootMenuData);
                return;

            case 27: // esc
                e.data.manager.handler.keyStop(e, rootMenuData);
                if (rootMenuData.$menu !== null && typeof rootMenuData.$menu !== 'undefined') {
                    rootMenuData.$menu.trigger('contextmenu:hide', {data: rootMenuData, originalEvent: e});
                }
                return;

            default: // 0-9, a-z
                const k = (String.fromCharCode(e.keyCode)).toUpperCase();
                if (rootMenuData.accesskeys && rootMenuData.accesskeys[k]) {
                    // according to the specs accesskeys must be invoked immediately
                    rootMenuData.accesskeys[k].$node.trigger(rootMenuData.accesskeys[k].$menu ? 'contextmenu:focus' : 'mouseup', {data: rootMenuData, originalEvent: e});
                    return;
                }
                break;
        }
        // pass event to selected item,
        // stop propagation to avoid endless recursion
        e.stopPropagation();
        if (typeof rootMenuData.$selected !== 'undefined' && rootMenuData.$selected !== null) {
            rootMenuData.$selected.trigger(e);
        }
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    prevItem(e) {
        e.stopPropagation();
        let currentMenuData = $(this).data('contextMenu') || {};
        const rootMenuData = $(this).data('contextMenuRoot') || {};

        // obtain currently selected menu
        if (currentMenuData.$selected) {
            const $s = currentMenuData.$selected;
            currentMenuData = currentMenuData.$selected.parent().data('contextMenu') || {};
            currentMenuData.$selected = $s;
        }

        const $children = currentMenuData.$menu.children();
        let $prev = !currentMenuData.$selected || !currentMenuData.$selected.prev().length ? $children.last() : currentMenuData.$selected.prev();
        const $round = $prev;

        // skip disabled or hidden elements
        while ($prev.hasClass(rootMenuData.classNames.disabled) || $prev.hasClass(rootMenuData.classNames.notSelectable) || $prev.is(':hidden')) {
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
        if (currentMenuData.$selected) {
            rootMenuData.manager.handler.itemMouseleave.call(currentMenuData.$selected.get(0), e);
        }

        // activate next
        rootMenuData.manager.handler.itemMouseenter.call($prev.get(0), e);

        // focus input
        const $input = $prev.find('input, textarea, select');
        if ($input.length) {
            $input.focus();
        }
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    nextItem(e) {
        e.stopPropagation();
        let currentMenuData = $(this).data('contextMenu') || {};
        let rootMenuData = $(this).data('contextMenuRoot') || {};

        // obtain currently selected menu
        if (currentMenuData.$selected) {
            const $s = currentMenuData.$selected;
            currentMenuData = currentMenuData.$selected.parent().data('contextMenu') || {};
            currentMenuData.$selected = $s;
        }

        const $children = currentMenuData.$menu.children();
        let $next = !currentMenuData.$selected || !currentMenuData.$selected.next().length ? $children.first() : currentMenuData.$selected.next();
        const $round = $next;

        // skip disabled
        while ($next.hasClass(rootMenuData.classNames.disabled) || $next.hasClass(rootMenuData.classNames.notSelectable) || $next.is(':hidden')) {
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
        if (currentMenuData.$selected) {
            rootMenuData.manager.handler.itemMouseleave.call(currentMenuData.$selected.get(0), e);
        }

        // activate next
        rootMenuData.manager.handler.itemMouseenter.call($next.get(0), e);

        // focus input
        const $input = $next.find('input, textarea, select');
        if ($input.length) {
            $input.focus();
        }
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    focusInput(e) {
        let $this = $(this).closest('.context-menu-item');
        let data = $this.data();
        let currentMenuData = data.contextMenu;
        let rootMenuData = data.contextMenuRoot;

        rootMenuData.$selected = currentMenuData.$selected = $this;
        rootMenuData.isInput = currentMenuData.isInput = true;
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    blurInput(e) {
        let $this = $(this).closest('.context-menu-item');
        let data = $this.data();
        let currentMenuData = data.contextMenu;
        let rootMenuData = data.contextMenuRoot;

        rootMenuData.isInput = currentMenuData.isInput = false;
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    menuMouseenter(e) {
        let root = $(this).data().contextMenuRoot;
        root.hovering = true;
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    menuMouseleave(e) {
        let root = $(this).data().contextMenuRoot;
        if (root.$layer && root.$layer.is(e.relatedTarget)) {
            root.hovering = false;
        }
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    itemMouseenter(e) {
        let $this = $(this);
        let data = $this.data();
        let currentMenuData = data.contextMenu;
        let rootMenuData = data.contextMenuRoot;

        rootMenuData.hovering = true;

        // abort if we're re-entering
        if (e && rootMenuData.$layer && rootMenuData.$layer.is(e.relatedTarget)) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        // make sure only one item is selected
        let targetMenu = (currentMenuData.$menu ? currentMenuData : rootMenuData);
        targetMenu.$menu
            .children('.' + rootMenuData.classNames.hover).trigger('contextmenu:blur', {data: targetMenu, originalEvent: e})
            .children('.hover').trigger('contextmenu:blur', {data: targetMenu, originalEvent: e});

        if ($this.hasClass(rootMenuData.classNames.disabled) || $this.hasClass(rootMenuData.classNames.notSelectable)) {
            currentMenuData.$selected = null;
            return;
        }

        $this.trigger('contextmenu:focus', {data: currentMenuData, originalEvent: e});
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    itemMouseleave(e) {
        let $this = $(this);
        let data = $this.data();
        let currentMenuData = data.contextMenu;
        let rootMenuData = data.contextMenuRoot;

        if (rootMenuData !== currentMenuData && rootMenuData.$layer && rootMenuData.$layer.is(e.relatedTarget)) {
            if (typeof rootMenuData.$selected !== 'undefined' && rootMenuData.$selected !== null) {
                rootMenuData.$selected.trigger('contextmenu:blur', {data: rootMenuData, originalEvent: e});
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            rootMenuData.$selected = currentMenuData.$selected = currentMenuData.$node;
            return;
        }

        if (currentMenuData && currentMenuData.$menu && currentMenuData.$menu.hasClass(rootMenuData.classNames.visible)) {
            return;
        }

        $this.trigger('contextmenu:blur');
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    itemClick(e) {
        let $this = $(this);
        let data = $this.data();
        let currentMenuData = data.contextMenu;
        let rootMenuData = data.contextMenuRoot;
        let key = data.contextMenuKey;
        let callback;

        // abort if the key is unknown or disabled or is a menu
        if (!currentMenuData.items[key] || $this.is('.' + rootMenuData.classNames.disabled + ', .context-menu-separator, .' + rootMenuData.classNames.notSelectable) || ($this.is('.context-menu-submenu') && rootMenuData.selectableSubMenu === false)) {
            return;
        }

        e.preventDefault();
        e.stopImmediatePropagation();

        if (typeof currentMenuData.callbacks[key] === 'function' && Object.prototype.hasOwnProperty.call(currentMenuData.callbacks, key)) {
            // item-specific callback
            callback = currentMenuData.callbacks[key];
        } else if (typeof rootMenuData.callback === 'function') {
            // default callback
            callback = rootMenuData.callback;
        } else {
            // no callback, no action
            return;
        }

        // hide menu if callback doesn't stop that
        if (callback.call(rootMenuData.$trigger, e, key, currentMenuData, rootMenuData) !== false) {
            rootMenuData.$menu.trigger('contextmenu:hide');
        } else if (rootMenuData.$menu.parent().length) {
            rootMenuData.manager.operations.update.call(rootMenuData.$trigger, e, rootMenuData);
        }
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    inputClick(e) {
        e.stopImmediatePropagation();
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     * @param {Object} data
     */
    hideMenu(e, data) {
        const root = $(this).data('contextMenuRoot');
        root.manager.operations.hide.call(root.$trigger, e, root, data && data.force);
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    focusItem(e) {
        e.stopPropagation();
        const $this = $(this);
        const data = $this.data();
        const currentMenuData = data.contextMenu;
        const rootMenuData = data.contextMenuRoot;

        if ($this.hasClass(rootMenuData.classNames.disabled) || $this.hasClass(rootMenuData.classNames.notSelectable)) {
            return;
        }

        $this
            .addClass([rootMenuData.classNames.hover, rootMenuData.classNames.visible].join(' '))
            // select other items and included items
            .parent().find('.context-menu-item').not($this)
            .removeClass(rootMenuData.classNames.visible)
            .filter('.' + rootMenuData.classNames.hover)
            .trigger('contextmenu:blur');

        // remember selected
        currentMenuData.$selected = rootMenuData.$selected = $this;

        if (currentMenuData.$node && currentMenuData.$node.hasClass('context-menu-submenu')) {
            currentMenuData.$node.addClass(rootMenuData.classNames.hover);
        }

        // position sub-menu - do after show so dumb $.ui.position can keep up
        if (currentMenuData.$node) {
            rootMenuData.positionSubmenu.call(currentMenuData.$node, e, currentMenuData.$menu);
        }
    }

    /**
     * @method
     * @memberOf ContextMenuEventHandler
     * @instance
     *
     * @param {JQuery.Event} e
     */
    blurItem(e) {
        e.stopPropagation();
        const $this = $(this);
        const data = $this.data();
        const currentMenuData = data.contextMenu;
        const rootMenuData = data.contextMenuRoot;

        if (rootMenuData.autoHide) { // for tablets and touch screens this needs to remain
            $this.removeClass(rootMenuData.classNames.visible);
        }
        $this.removeClass(rootMenuData.classNames.hover);
        currentMenuData.$selected = null;
    }
};
