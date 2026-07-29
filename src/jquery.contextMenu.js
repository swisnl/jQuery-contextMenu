/**
 * jQuery contextMenu v@VERSION - Plugin for simple contextMenu handling
 *
 * Version: v@VERSION
 *
 * Authors: Björn Brala (SWIS.nl), Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://swisnl.github.io/jQuery-contextMenu/
 *
 * Copyright (c) 2011-@YEAR SWIS BV and contributors
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 * Date: @DATE
 */

/* jshint ignore:start */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function ($) {

    'use strict';

    // helper function to check for rapid interactions after menu display
    var isInteractionTooFast = function($element) {
        if (!('ontouchstart' in window
            || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) {
            return false;
        }
        var interactionTime = Date.now();
        var $liItem = $element.is('input, textarea, select') ? $element.closest('.context-menu-item') : $element;
        if (!$liItem || !$liItem.length) {
            return false;
        }
        var $parentMenu = $liItem.parent();
        if (!$parentMenu || !$parentMenu.length) {
            return false;
        }

        // only apply the check for items within submenus
        if ($parentMenu.hasClass('context-menu-root')) {
            return false;
        }

        var showTimestamp = $parentMenu.data('_showTimestamp');
        var timeDifference = showTimestamp ? interactionTime - showTimestamp : Infinity;

        // threshold for fast interaction (e.g., mobile tap)
        var threshold = 50; // ms

        return timeDifference < threshold;
    };

    // TODO: -
    // ARIA stuff: menuitem, menuitemcheckbox und menuitemradio
    // create <menu> structure if $.support[htmlCommand || htmlMenuitem] and !opt.disableNative

    // determine html5 compatibility
    $.support.htmlMenuitem = ('HTMLMenuItemElement' in window);
    $.support.htmlCommand = ('HTMLCommandElement' in window);
    $.support.eventSelectstart = ('onselectstart' in document.documentElement);
    /* // should the need arise, test for css user-select
     $.support.cssUserSelect = (function(){
     var t = false,
     e = document.createElement('div');

     $.each('Moz|Webkit|Khtml|O|ms|Icab|'.split('|'), function(i, prefix) {
     var propCC = prefix + (prefix ? 'U' : 'u') + 'serSelect',
     prop = (prefix ? ('-' + prefix.toLowerCase() + '-') : '') + 'user-select';

     e.style.cssText = prop + ': text;';
     if (e.style[propCC] == 'text') {
     t = true;
     return false;
     }

     return true;
     });

     return t;
     })();
     */


    if (!$.ui || !$.widget) {
        // duck punch $.cleanData like jQueryUI does to get that remove event
        $.cleanData = (function (orig) {
            return function (elems) {
                var events, elem, i;
                for (i = 0; elems[i] != null; i++) {
                    elem = elems[i];
                    try {
                        // Only trigger remove when necessary to save time
                        events = $._data(elem, 'events');
                        if (events && events.remove) {
                            $(elem).triggerHandler('remove');
                        }

                        // Http://bugs.jquery.com/ticket/8235
                    } catch (e) {
                    }
                }
                orig(elems);
            };
        })($.cleanData);
    }
    /* jshint ignore:end */

    var // currently active contextMenu trigger
        $currentTrigger = null,
        // is contextMenu initialized with at least one menu?
        initialized = false,
        // window handle
        $win = $(window),
        // number of registered menus
        counter = 0,
        // mapping selector to namespace
        namespaces = {},
        // mapping namespace to options
        menus = {},
        // mapping namespace to the options object a `build` menu was actually
        // built from. A build menu is rebuilt on every invocation into a fresh
        // options object (see handle.contextmenu), so the registration kept in
        // `menus` never carries the on-screen menu's $menu/items and can't be
        // refreshed by $.contextMenu('update') on its own. Entries are removed
        // along with their `menus` entry on destroy; a hidden build menu keeps
        // its entry, but op.hide() has emptied the options object by then so
        // op.update() below skips it on the $menu guard.
        builtMenus = {},
        // registrations keyed by raw DOM element rather than a selector
        // string - used when `selector` is an Element or jQuery object,
        // since those can't be used as `namespaces` object keys the way
        // selector strings are. Array of {el: DOMElement, ns: String}.
        elementSelectors = [],
        // custom command type handlers
        types = {},
        // default values
        defaults = {
            // selector of contextMenu trigger
            selector: null,
            // where to append the menu to
            appendTo: null,
            // method to trigger context menu ["right", "left", "hover"]
            trigger: 'right',
            // hide menu when mouse leaves trigger / menu elements
            autoHide: false,
            // ms to wait before showing a hover-triggered context menu
            delay: 200,
            // flag denoting if a second trigger should simply move (true) or rebuild (false) an open menu
            // as long as the trigger happened on one of the trigger-element's child nodes
            reposition: true,
            // Flag denoting if a second trigger should close the menu, as long as
            // the trigger happened on one of the trigger-element's child nodes.
            // This overrides the reposition option.
            hideOnSecondTrigger: false,

            // use a modal layer for closing the menu rather than a captured event on document
            useModal: true,

            //ability to select submenu
            selectableSubMenu: false,

            // text direction of the menu, use 'rtl' for right-to-left languages.
            // adds a `context-menu-rtl` class to the menu and flips the side
            // sub-menus open on.
            direction: 'ltr',

            // Default classname configuration to be able avoid conflicts in frameworks
            classNames: {
                hover: 'context-menu-hover', // Item hover
                disabled: 'context-menu-disabled', // Item disabled
                visible: 'context-menu-visible', // Item visible
                notSelectable: 'context-menu-not-selectable', // Item not selectable

                icon: 'context-menu-icon',
                iconEdit: 'context-menu-icon-edit',
                iconCut: 'context-menu-icon-cut',
                iconCopy: 'context-menu-icon-copy',
                iconPaste: 'context-menu-icon-paste',
                iconDelete: 'context-menu-icon-delete',
                iconAdd: 'context-menu-icon-add',
                iconQuit: 'context-menu-icon-quit',
                iconLoadingClass: 'context-menu-icon-loading'
            },

            // determine position to show menu at
            determinePosition: function ($menu) {
                // position to the lower middle of the trigger element
                if ($.ui && $.ui.position) {
                    // .position() is provided as a jQuery UI utility
                    // (...and it won't work on hidden elements)
                    $menu.css('display', 'block').position({
                        my: 'center top',
                        at: 'center bottom',
                        of: this,
                        offset: '0 5',
                        collision: 'fit'
                    }).css('display', 'none');
                } else {
                    // determine contextMenu position
                    var offset = this.offset();
                    offset.top += this.outerHeight();
                    offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
                    $menu.css(offset);
                }
            },
            // position menu
            position: function (opt, x, y) {
                var offset;
                // determine contextMenu position
                if (!x && !y) {
                    opt.determinePosition.call(this, opt.$menu);
                    return;
                } else if (x === 'maintain' && y === 'maintain') {
                    // x and y must not be changed (after re-show on command click)
                    offset = opt.$menu.position();
                } else {
                    // x and y are given (by mouse event)
                    var offsetParentOffset = opt.$menu.offsetParent().offset();
                    offset = {top: y - offsetParentOffset.top, left: x -offsetParentOffset.left};
                }

                // correct offset if viewport demands it
                var bottom = $win.scrollTop() + $win.height(),
                    right = $win.scrollLeft() + $win.width(),
                    height = opt.$menu.outerHeight(),
                    width = opt.$menu.outerWidth();

                if (offset.top + height > bottom) {
                    offset.top -= height;
                }

                if (offset.top < 0) {
                    offset.top = 0;
                }

                if (offset.left + width > right) {
                    offset.left -= width;
                }

                if (offset.left < 0) {
                    offset.left = 0;
                }

                opt.$menu.css(offset);
            },
            // position the sub-menu
            positionSubmenu: function ($menu) {
                if (typeof $menu === 'undefined') {
                    // When user hovers over item (which has sub items) handle.focusItem will call this.
                    // but the submenu does not exist yet if opt.items is a promise. just return, will
                    // call positionSubmenu after promise is completed.
                    return;
                }
                // in 'rtl' mode sub-menus open to the left of their parent
                // item instead of the right (see op.create / opt.direction).
                var root = $menu.data('contextMenuRoot'),
                    isRtl = !!root && root.direction === 'rtl';

                // 'top' (used further down to position a detached sub-menu)
                // places the element's margin edge, not its border edge, so
                // its own margin-top still pushes the visible box down from
                // wherever 'top' is clamped to - both when capping the
                // height below and when clamping 'top' to the bottom of the
                // viewport, or the box's actual bottom edge overshoots by
                // that margin either way.
                var marginTop = parseFloat($menu.css('margin-top')) || 0;

                // A sub-menu taller than the viewport can't be fully reached in
                // its normal position: items past the bottom edge of the screen
                // have no scrollbar and no room to flip into, since the
                // sub-menu's top is already clamped to the item it hangs off
                // of (below, and in the detached branch further down). Detach
                // it to <body> - the same mechanism used for #775, when the
                // ROOT menu overflows - if it isn't already, and cap/scroll it
                // exactly like an overflowing root menu (see op.activated),
                // regardless of whether an ancestor menu needed that same
                // treatment. (#752)
                //
                // This sizing/detaching check only runs while the sub-menu
                // isn't detached yet. handle.focusItem() calls positionSubmenu()
                // again for every sibling item hovered inside an
                // already-open sub-menu (they all share the same opener/menu
                // pair), so re-measuring and re-capping on every one of those
                // calls would reset the scroll position of a sub-menu the
                // user has already scrolled through. Once detached, sizing is
                // considered settled for the rest of this show cycle; it's
                // only redone in op.reattachSubmenus(), right before the next
                // time the root menu is (re)activated.
                //
                // This is independent of which side (left/right) the
                // sub-menu opens on - the RTL/LTR open-side decision below
                // only affects horizontal placement, not whether/how a
                // too-tall sub-menu gets detached and capped.
                if (!$menu.hasClass('context-menu-detached') && (preciseOuterHeight($menu) || $menu.height()) > $win.height()) {
                    if (root) {
                        root._detachedSubmenus = root._detachedSubmenus || [];
                        $menu
                            .addClass('context-menu-detached')
                            .data('contextMenuDetachedFrom', this)
                            .appendTo(document.body);
                        root._detachedSubmenus.push($menu);
                        // This runs after handle.focusItem() already decided
                        // (based on the pre-detach state) whether to add the
                        // detached-visibility class, so it never saw this
                        // sub-menu as detached. Add it here instead - without
                        // it, moving the sub-menu to <body> just above drops it
                        // out from under the CSS parent/child selector that was
                        // making it visible, and it disappears immediately.
                        if (this.hasClass(root.classNames.hover)) {
                            $menu.addClass(root.classNames.visible);
                            $menu.data('_scrollTopAtShow', root.$menu.scrollTop());
                        }
                        $menu.css({
                            // see the note on the equivalent root-menu cap in
                            // op.activated for why overflow-x must be
                            // 'hidden' rather than 'visible' here
                            'overflow-x': 'hidden',
                            'overflow-y': 'auto'
                        // .outerHeight(value), rather than .css('height',
                        // value), accounts for border/padding so the
                        // element's actual (outer) height ends up matching
                        // the target exactly
                        }).outerHeight($win.height() - marginTop);
                    }
                }

                if ($menu.hasClass('context-menu-detached')) {
                    // This sub-menu was moved out to <body> (see op.detachSubmenus,
                    // or the on-demand detach above) because its parent menu is
                    // scrollable, or the sub-menu is simply taller than the
                    // viewport itself, and would otherwise clip it. Position it
                    // like a root menu would be positioned: in page coordinates,
                    // next to the trigger item, flipped and clamped to stay
                    // within the viewport.
                    var itemOffset = this.offset(),
                        menuWidth = $menu.outerWidth() || $menu.width(),
                        // see preciseOuterHeight() for why this can't just be
                        // $menu.outerHeight()
                        menuHeight = preciseOuterHeight($menu) || $menu.height(),
                        left = isRtl ?
                            itemOffset.left - menuWidth + 5 :
                            itemOffset.left + this.outerWidth() - 5,
                        top = itemOffset.top - 9,
                        maxTop = $win.scrollTop() + $win.height() - menuHeight - marginTop;

                    if (isRtl) {
                        if (left < $win.scrollLeft()) {
                            // doesn't fit to the left of the item, flip to the right
                            left = itemOffset.left + this.outerWidth() - 5;
                            // ...and if it doesn't fit there either (viewport
                            // narrower than the menu), clamp against the
                            // right edge rather than leaving it hanging off.
                            if (left + menuWidth > $win.scrollLeft() + $win.width()) {
                                left = $win.scrollLeft() + $win.width() - menuWidth;
                            }
                        }
                    } else if (left + menuWidth > $win.scrollLeft() + $win.width()) {
                        // doesn't fit to the right of the item, flip to the left
                        left = itemOffset.left - menuWidth + 5;
                    }
                    if (left < $win.scrollLeft()) {
                        left = $win.scrollLeft();
                    }
                    if (top > maxTop) {
                        top = maxTop;
                    }
                    if (top < $win.scrollTop()) {
                        top = $win.scrollTop();
                    }

                    $menu.css({position: 'absolute', top: top, left: left});
                    return;
                }
                if ($.ui && $.ui.position) {
                    // .position() is provided as a jQuery UI utility
                    // (...and it won't work on hidden elements)
                    $menu.css('display', 'block').position({
                        my: isRtl ? 'right top-5' : 'left top-5',
                        at: isRtl ? 'left top' : 'right top',
                        of: this,
                        collision: 'flipfit fit'
                    }).css('display', '');
                } else {
                    // determine contextMenu position
                    var offset = isRtl ? {
                        top: -9,
                        left: -(($menu.outerWidth() || $menu.width()) - 5)
                    } : {
                        top: -9,
                        left: this.outerWidth() - 5
                    };
                    $menu.css(offset);
                }
            },
            // offset to add to zIndex
            zIndex: 1,
            // show hide animation settings
            animation: {
                duration: 50,
                show: 'slideDown',
                hide: 'slideUp'
            },
            // events
            events: {
                preShow: $.noop,
                show: $.noop,
                hide: $.noop,
                activated: $.noop
            },
            // default callback
            callback: null,
            // list of contextMenu items
            items: {}
        },
        // mouse position for hover activation
        hoveract = {
            timer: null,
            pageX: null,
            pageY: null
        },
        // determine zIndex
        zindex = function ($t) {
            var zin = 0,
                $tt = $t;

            while (true) {
                zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
                $tt = $tt.parent();
                if (!$tt || !$tt.length || 'html body'.indexOf($tt.prop('nodeName').toLowerCase()) > -1) {
                    break;
                }
            }
            return zin;
        },
        // Precise (fractional) border-box height of an element, used instead
        // of jQuery's own outerHeight() getter for viewport-overflow math
        // (see positionSubmenu()) where sub-pixel accuracy actually matters:
        // outerHeight() (no argument) is fractional (getBoundingClientRect-
        // based) as of jQuery 3, but is ROUNDED to a whole pixel in jQuery
        // <3. Mixing that rounded value into a clamp computed against other,
        // still-fractional measurements (like $win.height() or margin-top)
        // silently let the sub-menu's real, unrounded box overshoot the
        // viewport by up to ~1px on jQuery 1.x/2.x - only ever surfaced on
        // those older jQuery versions.
        preciseOuterHeight = function ($el) {
            return $el && $el.length ? $el[0].getBoundingClientRect().height : 0;
        },
        // event handlers
        handle = {
            // abort anything
            abortevent: function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
            },
            // contextmenu show dispatcher
            contextmenu: function (e) {
                var $this = $(this);

                // Guard against handlers firing with missing/incomplete event data
                // (e.g. a stale/manual invocation not carrying the registered menu
                // options). Without this, e.data.events.preShow throws.
                if (!e.data || !e.data.events) {
                    return;
                }

                //Show browser context-menu when preShow returns false
                if (e.data.events.preShow($this,e) === false) {
                    return;
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

                    $currentTrigger = $this;
                    if (e.data.build) {
                        var built = e.data.build($currentTrigger, e);
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
                        e.data.$trigger = $currentTrigger;

                        op.create(e.data);
                        builtMenus[e.data.ns] = e.data;
                    }
                    op.show.call($this, e.data, e.pageX, e.pageY);
                }
            },
            // contextMenu left-click trigger
            click: function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                // Invoke the dispatcher directly instead of triggering a real,
                // bubbling 'contextmenu' event: a bubbling synthetic event is
                // indistinguishable from a genuine right-click to any other
                // 'contextmenu' listener bound on an ancestor element, causing
                // unrelated handlers elsewhere on the page to fire on a plain
                // left-click. See https://github.com/swisnl/jQuery-contextMenu/issues/754
                handle.contextmenu.call(this, $.Event('contextmenu', {
                    data: e.data,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    target: this,
                    currentTarget: this
                }));
            },
            // contextMenu right-click trigger
            mousedown: function (e) {
                // register mouse down
                var $this = $(this);

                // hide any previous menus
                if ($currentTrigger && $currentTrigger.length && !$currentTrigger.is($this)) {
                    $currentTrigger.data('contextMenu').$menu.trigger('contextmenu:hide');
                }

                // activate on right click
                if (e.button === 2) {
                    $currentTrigger = $this.data('contextMenuActive', true);
                }
            },
            // contextMenu right-click trigger
            mouseup: function (e) {
                // show menu
                var $this = $(this);
                if ($this.data('contextMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $currentTrigger = $this;
                    // See handle.click for why we call the dispatcher directly
                    // instead of triggering a bubbling 'contextmenu' event.
                    handle.contextmenu.call(this, $.Event('contextmenu', {
                        data: e.data,
                        pageX: e.pageX,
                        pageY: e.pageY,
                        target: this,
                        currentTarget: this
                    }));
                }

                $this.removeData('contextMenuActive');
            },
            // contextMenu hover trigger
            mouseenter: function (e) {
                var $this = $(this),
                    $related = $(e.relatedTarget),
                    $document = $(document);

                // abort if we're coming from a menu
                if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                    return;
                }

                // abort if a menu is shown
                if ($currentTrigger && $currentTrigger.length) {
                    return;
                }

                hoveract.pageX = e.pageX;
                hoveract.pageY = e.pageY;
                hoveract.data = e.data;
                $document.on('mousemove.contextMenuShow', handle.mousemove);
                hoveract.timer = setTimeout(function () {
                    hoveract.timer = null;
                    $document.off('mousemove.contextMenuShow');

                    // The trigger may have been removed from the document while
                    // this delay was pending. Triggering a bubbling event used to
                    // make that a silent no-op (a detached node can't bubble to
                    // the delegated listener); calling the dispatcher directly
                    // doesn't have that safety net, so check explicitly.
                    if (!$.contains(document.documentElement, $this[0])) {
                        return;
                    }

                    $currentTrigger = $this;
                    // See handle.click for why we call the dispatcher directly
                    // instead of triggering a bubbling 'contextmenu' event.
                    handle.contextmenu.call($this[0], $.Event('contextmenu', {
                        data: hoveract.data,
                        pageX: hoveract.pageX,
                        pageY: hoveract.pageY,
                        target: $this[0],
                        currentTarget: $this[0]
                    }));
                }, e.data.delay);
            },
            // contextMenu hover trigger
            mousemove: function (e) {
                hoveract.pageX = e.pageX;
                hoveract.pageY = e.pageY;
            },
            // contextMenu hover trigger
            mouseleave: function (e) {
                // abort if we're leaving for a menu
                var $related = $(e.relatedTarget);
                if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                    return;
                }

                try {
                    clearTimeout(hoveract.timer);
                } catch (e) {
                }

                hoveract.timer = null;
            },
            // click on layer to hide contextMenu
            layerClick: function (e, opt, onhide) {
                var $this = $(this),
                    root = (opt !== undefined) ? opt : $this.data('contextMenuRoot'),
                    button = e.button,
                    x = e.pageX,
                    y = e.pageY,
                    fakeClick = x === undefined,
                    target,
                    offset;

                // If the click is not real, things break: https://github.com/swisnl/jQuery-contextMenu/issues/132
                if(fakeClick){
                    if (root !== null && typeof root !== 'undefined' && root.$menu !== null  && typeof root.$menu !== 'undefined') {
                        root.$menu.trigger('contextmenu:hide');
                    }
                    return;
                }

                // if the click closing is done through windwow event listener rather than a transparent layer
                if (!root.$layer) {
                    target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                    if (root.$menu === null || typeof root.$menu === 'undefined' || (!root.$menu[0].contains(target) && !isWithinDetachedSubmenus(root, target))) {
                        // Choosing an option from a native <select> item's dropdown can
                        // make Firefox fire a spurious click/mousedown shortly
                        // afterwards, at coordinates that don't necessarily land within
                        // root.$menu's own (possibly clipped) bounding box - because the
                        // browser's native options popup isn't constrained by it - even
                        // though the user's interaction never actually left the menu.
                        // Only skip hiding the menu, and only when the coordinates are
                        // plausibly within that select's own native popup (its
                        // horizontal span) shortly after it last changed - a real
                        // outside click elsewhere is unaffected.
                        // See https://github.com/swisnl/jQuery-contextMenu/issues/744
                        if (isNearRecentSelectChange(root, x, y)) {
                            return;
                        }

                        root.$menu.trigger('contextmenu:hide');
                        if (typeof onhide !== 'undefined')
                            onhide();
                    }
                    return;
                }
                e.preventDefault();

                setTimeout(function () {

                    var $window;
                    var triggerAction = ((root.trigger === 'left' && button === 0) || (root.trigger === 'right' && button === 2));

                    // find the element that would've been clicked, wasn't the layer in the way
                    if (document.elementFromPoint && root.$layer) {
                        root.$layer.hide();
                        target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());

                        // also need to try and focus this element if we're in a contenteditable area,
                        // as the layer will prevent the browser mouse action we want
                        if (target !== null && target.isContentEditable) {
                            var range = document.createRange(),
                                sel = window.getSelection();
                            range.selectNode(target);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                        // jQuery's trigger() only assigns event.target when it isn't
                        // already set, so re-triggering the layer's own mousedown/
                        // contextmenu event further down would otherwise keep
                        // reporting the (now hidden) layer as event.target instead of
                        // the element the user actually clicked on.
                        // See https://github.com/swisnl/jQuery-contextMenu/issues/771
                        if (target) {
                            e.target = target;
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
                            $window = $(window);
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

                    // See the comment above isNearRecentSelectChange() /
                    // https://github.com/swisnl/jQuery-contextMenu/issues/744 - the
                    // click/mousedown has already been passed through to whatever's
                    // actually under the cursor above, so a genuine outside click
                    // still reaches its real target either way; this only leaves the
                    // menu itself open a little longer than usual in the rare case of
                    // a real click that happens to land within a just-changed
                    // select's own horizontal span.
                    if (root !== null && typeof root !== 'undefined' && root.$menu !== null && typeof root.$menu !== 'undefined' && !isNearRecentSelectChange(root, x, y)) {
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

                var opt = {};

                // Only get the data from $currentTrigger if it exists
                if ($currentTrigger) {
                    opt = $currentTrigger.data('contextMenu') || {};
                }
                // If the trigger happen on a element that are above the contextmenu do this
                if (typeof opt.zIndex === 'undefined') {
                    opt.zIndex = 0;
                }
                var targetZIndex = 0;
                var getZIndexOfTriggerTarget = function (target) {
                    if (target.style.zIndex !== '') {
                        targetZIndex = target.style.zIndex;
                    } else {
                        if (target.offsetParent !== null && typeof target.offsetParent !== 'undefined') {
                            getZIndexOfTriggerTarget(target.offsetParent);
                        }
                        else if (target.parentElement !== null && typeof target.parentElement !== 'undefined') {
                            getZIndexOfTriggerTarget(target.parentElement);
                        }
                    }
                };
                getZIndexOfTriggerTarget(e.target);
                // If targetZIndex is heigher then opt.zIndex dont progress any futher.
                // This is used to make sure that if you are using a dialog with a input / textarea / contenteditable div
                // and its above the contextmenu it wont steal keys events
                if (opt.$menu && parseInt(targetZIndex,10) > parseInt(opt.$menu.css("zIndex"),10)) {
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
                            // Look up the opener <li> via the sub-menu's own
                            // back-reference (opt.$node) rather than DOM
                            // ancestry (.parent().parent()): a detached
                            // sub-menu (see op.detachSubmenus) no longer has
                            // its opener <li> as a DOM parent.
                            var $selectedMenu = opt.$selected.parent(),
                                selectedMenuOpt = $selectedMenu.data('contextMenu'),
                                $parent = (selectedMenuOpt && selectedMenuOpt.$node) || $selectedMenu.parent();
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

                        var itemdata = opt.$selected.data('contextMenu') || {};
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
                            return;
                        } else {
                            (opt.$selected && opt.$selected.parent() || opt.$menu)
                                .children(':not(.' + opt.classNames.disabled + ', .' + opt.classNames.notSelectable + ')')[e.keyCode === 36 ? 'first' : 'last']()
                                .trigger('contextmenu:focus');
                            e.preventDefault();
                            return;
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
                        var k = (String.fromCharCode(e.keyCode)).toUpperCase();
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
                var opt = $(this).data('contextMenu') || {};
                var root = $(this).data('contextMenuRoot') || {};

                // obtain currently selected menu
                if (opt.$selected) {
                    var $s = opt.$selected;
                    opt = opt.$selected.parent().data('contextMenu') || {};
                    opt.$selected = $s;
                }

                var $children = opt.$menu.children(),
                    $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev(),
                    $round = $prev;

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
                var $input = $prev.find('input, textarea, select');
                if ($input.length) {
                    $input.focus();
                }
            },
            // select next possible command in menu
            nextItem: function (e) {
                e.stopPropagation();
                var opt = $(this).data('contextMenu') || {};
                var root = $(this).data('contextMenuRoot') || {};

                // obtain currently selected menu
                if (opt.$selected) {
                    var $s = opt.$selected;
                    opt = opt.$selected.parent().data('contextMenu') || {};
                    opt.$selected = $s;
                }

                var $children = opt.$menu.children(),
                    $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next(),
                    $round = $next;

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
                var $input = $next.find('input, textarea, select');
                if ($input.length) {
                    $input.focus();
                }
            },
            // flag that we're inside an input so the key handler can act accordingly
            focusInput: function () {
                var $this = $(this).closest('.context-menu-item'),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.$selected = opt.$selected = $this;
                root.isInput = opt.isInput = true;
            },
            // flag that we're inside an input so the key handler can act accordingly
            blurInput: function () {
                var $this = $(this).closest('.context-menu-item'),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.isInput = opt.isInput = false;
            },
            // :hover on menu
            menuMouseenter: function () {
                var root = $(this).data().contextMenuRoot;
                root.hovering = true;
            },
            // :hover on menu
            menuMouseleave: function (e) {
                var root = $(this).data().contextMenuRoot;
                if (root.$layer && root.$layer.is(e.relatedTarget)) {
                    root.hovering = false;
                }
            },
            // :hover done manually so key handling is possible
            itemMouseenter: function (e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                // prevent fast hover on mobile tap-through
                if (isInteractionTooFast($this)) {
                    return;
                }

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
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
                    if (typeof root.$selected !== 'undefined' && root.$selected !== null) {
                        root.$selected.trigger('contextmenu:blur');
                    }
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    root.$selected = opt.$selected = opt.$node;
                    return;
                }

                if(opt && opt.$menu && opt.$menu.hasClass('context-menu-visible')){
                    return;
                }

                $this.trigger('contextmenu:blur');
            },
            // contextMenu item click
            itemClick: function (e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot,
                    key = data.contextMenuKey,
                    callback;

                // prevent fast click-through on mobile taps
                if (isInteractionTooFast($this)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return;
                }

                // abort if the key is unknown or disabled or is a menu
                // explicitly handle non-selectable submenu clicks first to stop propagation
                if ($this.is('.context-menu-submenu') && root.selectableSubMenu === false) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // Stop event here for non-selectable submenus
                    return;
                }

                // original check for other non-clickable/disabled items
                if (!opt.items[key] || $this.is('.' + root.classNames.disabled + ', .context-menu-separator, .' + root.classNames.notSelectable)) {
                    return;
                }

                // if it wasn't a non-selectable submenu or other disabled item, prevent default and stop propagation before callback
                e.preventDefault();
                e.stopImmediatePropagation();

                if ((typeof opt.callbacks[key] === 'function') && Object.prototype.hasOwnProperty.call(opt.callbacks, key)) {
                    // item-specific callback
                    callback = opt.callbacks[key];
                } else if (typeof root.callback === 'function') {
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
                var root = $(this).data('contextMenuRoot');
                op.hide.call(root.$trigger, root, data && data.force);
            },
            // focus <command>
            focusItem: function (e) {
                e.stopPropagation();
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

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


                if(opt && opt.$node && opt.$node.hasClass('context-menu-submenu')){
                    opt.$node.addClass(root.classNames.hover);
                    // detached sub-menus (see op.detachSubmenus) aren't a DOM
                    // descendant of opt.$node any more, so the CSS combinator
                    // that normally shows/hides them doesn't apply - toggle the
                    // class on the sub-menu itself instead.
                    if (opt.$menu && opt.$menu.hasClass('context-menu-detached')) {
                        opt.$menu.addClass(root.classNames.visible);
                        // baseline for hideDetachedSubmenus() (see op.activated),
                        // so it can tell a scroll that merely revealed the opener
                        // (as part of showing this same sub-menu) apart from a
                        // real, later scroll of an already-open sub-menu's root
                        opt.$menu.data('_scrollTopAtShow', root.$menu.scrollTop());
                    }
                }

                // position sub-menu - do after show so dumb $.ui.position can keep up
                if (opt.$node) {
                    root.positionSubmenu.call(opt.$node, opt.$menu);
                    if (opt.$menu) {
                        var focusShowTimestamp = Date.now();
                         opt.$menu.data('_showTimestamp', focusShowTimestamp);
                    }
                }
            },
            // blur <command>
            blurItem: function (e) {
                e.stopPropagation();
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                if (opt.autoHide) { // for tablets and touch screens this needs to remain
                    $this.removeClass(root.classNames.visible);
                }
                // mirror onto the detached sub-menu itself, see focusItem(). Unlike
                // the LI's own visible class above, this must happen unconditionally
                // (not gated on opt.autoHide): a nested sub-menu's visibility is
                // driven by its opener LI's visible class via a CSS combinator
                // (".context-menu-item.context-menu-visible > .context-menu-list"),
                // which focusItem() already clears unconditionally for sibling items
                // - but a detached sub-menu is no longer a DOM descendant of its
                // opener, so its visibility is driven entirely by its own
                // "context-menu-visible" class instead. With the default
                // autoHide:false, nothing else would ever clear that class, leaving
                // the old sub-menu visible and clickable after moving focus away.
                if (opt.$menu && opt.$menu.hasClass('context-menu-detached')) {
                    opt.$menu.removeClass(root.classNames.visible);
                }
                $this.removeClass(root.classNames.hover);
                opt.$selected = null;
            }
        },
        // operations
        op = {
            show: function (opt, x, y) {
                var $trigger = $(this),
                    css = {};

                // hide any open menus
                if ($('#context-menu-layer').length > 0)
                    $('#context-menu-layer').trigger('mousedown');
                else
                    $(document).trigger('contextmenu:hide');

                // backreference for callbacks
                opt.$trigger = $trigger;

                // show event
                if (opt.events.show.call($trigger, opt) === false) {
                    $currentTrigger = null;
                    return;
                }

                // create or update context menu
                var hasVisibleItems = op.update.call($trigger, opt);
                if (hasVisibleItems === false) {
                    $currentTrigger = null;
                    return;
                }

                // position menu
                opt.position.call($trigger, opt, x, y);

                // make sure we're in front
                if (opt.zIndex) {
                    var additionalZValue = opt.zIndex;
                    // If opt.zIndex is a function, call the function to get the right zIndex.
                    if (typeof opt.zIndex === 'function') {
                        additionalZValue = opt.zIndex.call($trigger, opt);
                    }
                    css.zIndex = zindex($trigger) + additionalZValue;
                }

                // add layer
                op.layer.call(opt.$menu, opt, css.zIndex);

                // adjust sub-menu zIndexes
                opt.$menu.find('ul').css('zIndex', css.zIndex + 1);

                // position and show context menu
                opt.$menu.css(css)[opt.animation.show](opt.animation.duration, function () {
                    $trigger.trigger('contextmenu:visible');

                    var rootShowTimestamp = Date.now();
                    opt.$menu.data('_showTimestamp', rootShowTimestamp);

                    op.activated(opt);
                    opt.events.activated(opt);
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
                        var pos = $trigger.offset();
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
            hide: function (opt, force) {
                var $trigger = $(this);
                if (!opt) {
                    opt = $trigger.data('contextMenu') || {};
                }

                // hide event
                if (!force && opt.events && opt.events.hide.call($trigger, opt) === false) {
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
                $currentTrigger = null;
                // remove selected
                opt.$menu.find('.' + opt.classNames.hover).trigger('contextmenu:blur');
                opt.$selected = null;
                // collapse all submenus
                opt.$menu.find('.' + opt.classNames.visible).removeClass(opt.classNames.visible);
                // move any detached (see detachSubmenus()) sub-menus back where
                // they came from
                op.reattachSubmenus(opt);
                // stop watching for the root menu scrolling internally (see
                // op.activated() / op.hideDetachedSubmenus()) while it's hidden
                if (opt.$menu) {
                    opt.$menu.off('scroll.contextMenuDetachedSubmenus');
                }
                // unregister key and mouse handlers
                // $(document).off('.contextMenuAutoHide keydown.contextMenu'); // http://bugs.jquery.com/ticket/10705
                $(document).off('.contextMenuAutoHide').off('keydown.contextMenu');
                // hide menu
                if (opt.$menu) {
                    opt.$menu[opt.animation.hide](opt.animation.duration, function () {
                        // tear down dynamically built menu after animation is completed.
                        if (opt.build) {
                            opt.$menu.remove();
                            $.each(opt, function (key) {
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
            create: function (opt, root) {
                if (typeof root === 'undefined') {
                    root = opt;
                }

                // define handler for fast input clicks
                var handleFastInputClick = function(e) {
                    var $inputClicked = $(this);
                    if (isInteractionTooFast($inputClicked)) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    }
                };

                // create contextMenu
                opt.$menu = $('<ul class="context-menu-list"></ul>').addClass(opt.className || '').data({
                    'contextMenu': opt,
                    'contextMenuRoot': root
                });
                if (root.direction === 'rtl') {
                    // applied to every menu/sub-menu, not just the root, so
                    // detached sub-menus (see op.detachSubmenus) that get
                    // moved out to <body> keep the styling even though
                    // they're no longer a CSS descendant of the root menu.
                    opt.$menu.addClass('context-menu-rtl');
                }
                // menu level data-* attributes. Only for the root menu: sub-menus
                // are created by calling op.create() with the parent *item* as
                // `opt`, so applying this here as well would put an item's
                // `dataAttr` on both its <li> and its sub-menu <ul>.
                if (opt === root) {
                    applyDataAttr(opt.$menu, opt.dataAttr);
                }

                $.each(['callbacks', 'commands', 'inputs'], function (i, k) {
                    opt[k] = {};
                    if (!root[k]) {
                        root[k] = {};
                    }
                });

                if (!root.accesskeys) {
                    root.accesskeys = {};
                }

                function createNameNode(item, $t, key) {
                    var $name = $('<span></span>');
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
                        // just like `icon`, `name` may be a function returning the
                        // current label to display. Called with the same signature
                        // and context icon uses at creation time, so the two stay
                        // consistent for anyone already using function-based icons.
                        item._name = (typeof item.name === 'function') ?
                            item.name.call(item, item, $t, key, item) :
                            item.name;

                        if (item.isHtmlName) {
                            // restrict use with access keys
                            if (typeof item.accesskey !== 'undefined') {
                                throw new Error('accesskeys are not compatible with HTML names and cannot be used together in the same item');
                            }
                            $name.html(item._name);
                        } else {
                            $name.text(item._name);
                        }
                    }
                    // cache so op.update() can refresh the label in place when
                    // `name` is a function (see the icon._icon handling below).
                    item.$name = $name;
                    return $name;
                }

                // create contextMenu items
                $.each(opt.items, function (key, item) {
                    var $t = $('<li class="context-menu-item"></li>').addClass(item.className || ''),
                        $label = null,
                        $input = null;

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

                    // arbitrary data-* attributes for this item
                    applyDataAttr($t, item.dataAttr);

                    // register accesskey
                    // NOTE: the accesskey attribute should be applicable to any element, but Safari5 and Chrome13 still can't do that
                    if (typeof item.accesskey !== 'undefined') {
                        var aks = splitAccesskey(item.accesskey);
                        for (var i = 0, ak; (ak = aks[i]); i++) {
                            if (!root.accesskeys[ak]) {
                                root.accesskeys[ak] = item;
                                // accesskey highlighting needs a static string to search
                                // within; a function-based name has no fixed text to
                                // match against, so it's just skipped (the item still
                                // reserves the accesskey, it just won't be highlighted).
                                if (typeof item.name === 'string') {
                                    var matched = item.name.match(new RegExp('^(.*?)(' + ak + ')(.*)$', 'i'));
                                    if (matched) {
                                        item._beforeAccesskey = matched[1];
                                        item._accesskey = matched[2];
                                        item._afterAccesskey = matched[3];
                                    }
                                }
                                break;
                            }
                        }
                    }

                    if (item.type && types[item.type]) {
                        // run custom type handler
                        types[item.type].call($t, item, opt, root);
                        // register commands
                        $.each([opt, root], function (i, k) {
                            k.commands[key] = item;
                            // Overwrite only if undefined or the item is appended to the root. This so it
                            // doesn't overwrite callbacks of root elements if the name is the same.
                            if ((typeof item.callback === 'function') && (typeof k.callbacks[key] === 'undefined' || typeof opt.type === 'undefined')) {
                                k.callbacks[key] = item.callback;
                            }
                        });
                    } else {
                        // add label for input
                        if (item.type === 'cm_seperator') {
                            $t.addClass('context-menu-separator ' + root.classNames.notSelectable);
                        } else if (item.type === 'html') {
                            $t.addClass('context-menu-html ' + root.classNames.notSelectable);
                        } else if (item.type !== 'sub' && item.type) {
                            $label = $('<label></label>').appendTo($t);
                            createNameNode(item, $t, key).appendTo($label);

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
                                // prevent checkbox default action on fast click-through
                                $input.on('click', handleFastInputClick);
                                break;

                            case 'radio':
                                $input = $('<input type="radio" value="1" name="" />')
                                    .attr('name', 'context-menu-input-' + item.radio)
                                    .val(item.value || '')
                                    .prop('checked', !!item.selected)
                                    .prependTo($label);
                                // prevent radio default action on fast click-through
                                $input.on('click', handleFastInputClick);
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
                                // Choosing an option from a native <select> popup can make
                                // Firefox fire a spurious click/mousedown shortly afterwards
                                // (see handle.layerClick / isNearRecentSelectChange()),
                                // which used to be mistaken for a genuine click outside the
                                // menu and closed it - even though the interaction never
                                // left the menu.
                                // See https://github.com/swisnl/jQuery-contextMenu/issues/744
                                $input.on('change', function () {
                                    root._recentSelectChangeAt = Date.now();
                                    root._recentSelectEl = this;
                                });
                                break;

                            case 'sub':
                                createNameNode(item, $t, key).appendTo($t);
                                item.appendTo = item.$node;
                                $t.data('contextMenu', item).addClass('context-menu-submenu');
                                item.callback = null;

                                // If item contains items, and this is a promise, we should create it later
                                // check if subitems is of type promise. If it is a promise we need to create
                                // it later, after promise has been resolved.
                                if ('function' === typeof item.items.then) {
                                    // probably a promise, process it, when completed it will create the sub menu's.
                                    op.processPromises(item, root, item.items);
                                } else {
                                    // normal submenu.
                                    op.create(item, root);
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
                                    if ((typeof item.callback === 'function') && (typeof k.callbacks[key] === 'undefined' || typeof opt.type === 'undefined')) {
                                        k.callbacks[key] = item.callback;
                                    }
                                });
                                createNameNode(item, $t, key).appendTo($t);
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
                            if (typeof item.icon === 'function') {
                                item._icon = item.icon.call(this, this, $t, key, item);
                            } else {
                                if (typeof(item.icon) === 'string' && (
                                    item.icon.substring(0, 4) === 'fab '
                                    || item.icon.substring(0, 4) === 'fas '
                                    || item.icon.substring(0, 4) === 'fad '
                                    || item.icon.substring(0, 4) === 'far '
                                    || item.icon.substring(0, 4) === 'fal ')
                                ) {
                                    // to enable font awesome
                                    $t.addClass(root.classNames.icon + ' ' + root.classNames.icon + '--fa5');
                                    item._icon = $('<i class="' + item.icon + '"></i>');
                                } else if (typeof(item.icon) === 'string' && item.icon.substring(0, 3) === 'fa-') {
                                    // legacy Font Awesome 4 style icon class (e.g. "fa-trash"), kept for
                                    // backwards compatibility. Just like the fas/far/fab/fad/fal syntax
                                    // above, this needs its own <i> tag instead of being applied to the
                                    // menu item itself: Font Awesome's classes set font-family/font-weight
                                    // and their own ::before content on whatever element they're put on,
                                    // which used to bleed into (and bold) the item's label text and clash
                                    // with this plugin's own icon styling.
                                    $t.addClass(root.classNames.icon + ' ' + root.classNames.icon + '--fa5');
                                    item._icon = $('<i class="fa ' + item.icon + '"></i>');
                                } else {
                                    item._icon = root.classNames.icon + ' ' + root.classNames.icon + '-' + item.icon;
                                }
                            }

                            if(typeof(item._icon) === "string"){
                                $t.addClass(item._icon);
                            } else {
                                $t.prepend(item._icon);
                            }
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
            resize: function ($menu, nested) {
                var domMenu;
                // determine widths of submenus, as CSS won't grow them automatically
                // position:absolute within position:absolute; min-width:100; max-width:200; results in width: 100;
                // kinda sucks hard...

                // remember the display value set before measuring (e.g. "none" while the
                // root menu is hidden), so it can be restored afterwards instead of being
                // cleared. Clearing it would make the menu visible again before the show
                // animation runs, defeating fadeIn/slideDown (see issue #764).
                var originalDisplay = $menu[0].style.display;

                // determine width of absolutely positioned element
                $menu.css({position: 'absolute', display: 'block'});
                // don't apply yet, because that would break nested elements' widths
                $menu.data('width',
                    (domMenu = $menu.get(0)).getBoundingClientRect ?
                        Math.ceil(domMenu.getBoundingClientRect().width) :
                        $menu.outerWidth() + 1); // outerWidth() returns rounded pixels
                // reset styles so they allow nested elements to grow/shrink naturally
                $menu.css({
                    position: 'static',
                    minWidth: '0px',
                    maxWidth: '100000px'
                });
                // identify width of nested menus
                $menu.find('> li > ul').each(function () {
                    op.resize($(this), true);
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
                    // restore the display value that was in place before measuring
                    // (e.g. "none" for a menu that's about to be shown with an animation)
                    $menu.css('display', originalDisplay);
                }
            },
            // Move the direct sub-menus of a (scrollable) root menu out to <body>,
            // so they're no longer clipped by the root's overflow (see #775):
            // a scroll container clips ALL of its descendants regardless of how
            // overflow-x/-y are combined (per the CSS Overflow spec, once one axis
            // is non-'visible' the other computes to 'auto' too), so a sub-menu
            // nested inside the scrollable <ul> can never escape its clipping via
            // CSS alone. Sub-menus nested deeper than one level come along for the
            // ride (they stay nested inside the detached sub-menu), so only the
            // root's direct sub-menu children need to be moved.
            detachSubmenus: function (root) {
                root._detachedSubmenus = root._detachedSubmenus || [];
                root.$menu.children('.context-menu-submenu').each(function () {
                    var $li = $(this),
                        subOpt = $li.data('contextMenu');

                    if (!subOpt || !subOpt.$menu || subOpt.$menu.hasClass('context-menu-detached')) {
                        return;
                    }

                    subOpt.$menu
                        .addClass('context-menu-detached')
                        .data('contextMenuDetachedFrom', $li)
                        .appendTo(document.body);
                    root._detachedSubmenus.push(subOpt.$menu);
                });
            },
            // Undo detachSubmenus(): move sub-menus back where they came from, so
            // the menu starts from a clean, fully-nested state the next time it's
            // shown (e.g. after a resize that no longer requires scrolling).
            reattachSubmenus: function (root) {
                if (!root._detachedSubmenus || !root._detachedSubmenus.length) {
                    return;
                }
                $.each(root._detachedSubmenus, function (i, $sub) {
                    var $originalParent = $sub.data('contextMenuDetachedFrom');
                    $sub
                        .removeClass('context-menu-detached ' + root.classNames.visible)
                        .removeData('contextMenuDetachedFrom')
                        // undo any height cap applied in positionSubmenu() for
                        // a sub-menu that was taller than the viewport (see
                        // #752), so it's re-measured at its natural height
                        // the next time it's shown, rather than keeping
                        // whatever cap happened to be in place last time
                        // (e.g. from a viewport that's since grown taller).
                        .css({top: '', left: '', height: '', 'overflow-x': '', 'overflow-y': ''});
                    if ($originalParent && $originalParent.length) {
                        $sub.appendTo($originalParent);
                    }
                });
                root._detachedSubmenus = [];
            },
            // Close any open detached sub-menu(s) (see detachSubmenus()) in
            // response to the root menu itself scrolling internally. A detached
            // sub-menu is positioned in page coordinates relative to its opener at
            // the moment it's shown (see positionSubmenu()); if the user then
            // scrolls the (scrollable) root menu without moving the pointer, the
            // opener moves within the root but the body-level sub-menu doesn't
            // follow it, and nothing else re-runs positionSubmenu() to catch up.
            // Rather than tracking the root's scroll position live to keep it
            // correctly positioned (a much larger subsystem), just hide it - the
            // user can re-open it by hovering the (now-visible-elsewhere) opener
            // again. This intentionally does not restore keyboard/$selected state.
            hideDetachedSubmenus: function (root) {
                if (!root._detachedSubmenus || !root._detachedSubmenus.length) {
                    return;
                }
                var scrollTop = root.$menu.scrollTop();
                $.each(root._detachedSubmenus, function (i, $sub) {
                    if (!$sub.hasClass(root.classNames.visible)) {
                        return;
                    }
                    // Bringing the opener into view (e.g. the browser scrolling it
                    // into view as part of hovering it) fires this same 'scroll'
                    // event, typically *after* the sub-menu has already been shown
                    // (native 'scroll' events are dispatched asynchronously, so
                    // they can arrive after a synchronous focus/hover that
                    // triggered them). Comparing against the scrollTop recorded
                    // when the sub-menu was shown (see focusItem()) tells that
                    // "reveal" scroll apart from a real, subsequent scroll of an
                    // already-open sub-menu's root - only the latter should close
                    // it.
                    if (scrollTop === $sub.data('_scrollTopAtShow')) {
                        return;
                    }
                    $sub.removeClass(root.classNames.visible);
                    var $opener = $sub.data('contextMenuDetachedFrom');
                    if ($opener && $opener.length) {
                        $opener.removeClass(root.classNames.hover + ' ' + root.classNames.visible);
                    }
                });
            },
            update: function (opt, root) {
                var $trigger = this;
                // Nothing to update for a registration whose menu element doesn't
                // exist (yet): a `build` menu only gets its $menu when it is first
                // shown, and a destroyed registration can linger as null. Both are
                // reachable from $.contextMenu('update'), which walks every
                // registered menu, so bail out instead of throwing on $menu (see
                // https://github.com/swisnl/jQuery-contextMenu/issues/740).
                if (!opt || !opt.$menu || !opt.$menu.length) {
                    return false;
                }
                if (typeof root === 'undefined') {
                    root = opt;
                    op.resize(opt.$menu);
                }

                var hasVisibleItems = false;

                // re-check disabled for each item
                opt.$menu.children().each(function () {
                    var $item = $(this),
                        key = $item.data('contextMenuKey'),
                        item = opt.items[key],
                        disabled = ((typeof item.disabled === 'function') && item.disabled.call($trigger, key, root)) || item.disabled === true,
                        visible;
                    if (typeof item.visible === 'function') {
                        visible = item.visible.call($trigger, key, root);
                    } else if (typeof item.visible !== 'undefined') {
                        visible = item.visible === true;
                    } else {
                        visible = true;
                    }

                    if (visible) {
                        hasVisibleItems = true;
                    }

                    $item[visible ? 'show' : 'hide']();

                    // dis- / enable item
                    $item[disabled ? 'addClass' : 'removeClass'](root.classNames.disabled);

                    if (typeof item.icon === 'function') {
                        $item.removeClass(item._icon);
                        var iconResult = item.icon.call(this, $trigger, $item, key, item);
                        if(typeof(iconResult) === "string"){
                            $item.addClass(iconResult);
                        } else {
                            $item.prepend(iconResult);
                        }
                    }

                    // re-evaluate a function-based `name` on every update, same as
                    // `icon`/`disabled` above, so a dynamic label reflects current
                    // state instead of only whatever it resolved to at creation.
                    if (typeof item.name === 'function') {
                        item._name = item.name.call(this, $trigger, $item, key, item);
                        if (item.$name && item.$name.length) {
                            if (item.isHtmlName) {
                                item.$name.html(item._name);
                            } else {
                                item.$name.text(item._name);
                            }
                        }
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
                                item.$input.val((item.selected === 0 ? "0" : item.selected) || '');
                                break;
                        }
                    }

                    if (item.$menu) {
                        // update sub-menu
                        var subMenuHasVisibleItems = op.update.call($trigger, item, root);
                        if (subMenuHasVisibleItems) {
                            hasVisibleItems = true;
                        }
                    }
                });
                return hasVisibleItems;
            },
            layer: function (opt, zIndex) {
                if (!opt.useModal) {
                    var listener = function (ev) {
                        handle.layerClick(ev, opt, function() {
                            document.removeEventListener('mousedown', listener, true);
                        });
                    };
                    document.addEventListener('mousedown', listener, true);
                    return;
                }

                // add transparent layer for click area
                // filter and background for Internet Explorer, Issue #23
                var $layer = opt.$layer = $('<div id="context-menu-layer"></div>')
                    .css({
                        height: $win.height(),
                        width: $win.width(),
                        display: 'block',
                        position: 'fixed',
                        'z-index': zIndex - 1,
                        top: 0,
                        left: 0,
                        opacity: 0,
                        filter: 'alpha(opacity=0)',
                        'background-color': '#000'
                    })
                    .data('contextMenuRoot', opt)
                    .appendTo(document.body)
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
            processPromises: function (opt, root, promise) {
                // Start
                opt.$node.addClass(root.classNames.iconLoadingClass);

                function completedPromise(opt, root, items) {
                    // Completed promise (dev called promise.resolve). We now have a list of items which can
                    // be used to create the rest of the context menu.
                    if (typeof items === 'undefined') {
                        // Null result, dev should have checked
                        errorPromise(undefined);//own error object
                    }
                    finishPromiseProcess(opt, root, items);
                }

                function errorPromise(opt, root, errorItem) {
                    // User called promise.reject() with an error item, if not, provide own error item.
                    if (typeof errorItem === 'undefined') {
                        errorItem = {
                            "error": {
                                name: "No items and no error item",
                                icon: "context-menu-icon context-menu-icon-quit"
                            }
                        };
                        if (window.console) {
                            (console.error || console.log).call(console, 'When you reject a promise, provide an "items" object, equal to normal sub-menu items');
                        }
                    } else if (typeof errorItem === 'string') {
                        errorItem = {"error": {name: errorItem}};
                    }
                    finishPromiseProcess(opt, root, errorItem);
                }

                function finishPromiseProcess(opt, root, items) {
                    if (typeof root.$menu === 'undefined' || !root.$menu.is(':visible')) {
                        return;
                    }
                    opt.$node.removeClass(root.classNames.iconLoadingClass);
                    opt.items = items;
                    op.create(opt, root, true); // Create submenu
                    // If the root menu is currently scrollable (see #775,
                    // op.activated() / op.detachSubmenus()), it detaches its direct
                    // sub-menu children to <body> so they aren't clipped - but a
                    // sub-menu that's still waiting on a promise at that point isn't
                    // created yet, so it gets skipped. Now that it exists, run it
                    // through the same detach step, otherwise it stays nested inside
                    // the scrollable list and is clipped exactly like before this
                    // sub-menu overflow fix. Only do this when the root is actually
                    // in that scrollable state (op.activated sets its overflow-y to
                    // 'auto' only then), so non-overflowing menus are unaffected.
                    if (root.$menu && root.$menu.css('overflow-y') === 'auto') {
                        op.detachSubmenus(root);
                        // A detached sub-menu's visibility is driven by its own
                        // "context-menu-visible" class rather than a CSS
                        // combinator off its (still-nested) opener LI (see
                        // focusItem()) - normally set there when the sub-menu is
                        // focused, but that ran before this sub-menu existed if
                        // the user was already hovering its opener while its
                        // items were still a pending promise. Restore it here so
                        // it actually renders, and so positionSubmenu() below
                        // (which needs the now-visible element's real dimensions)
                        // can measure it correctly.
                        if (opt.$menu.hasClass('context-menu-detached') && opt.$node.hasClass(root.classNames.hover)) {
                            opt.$menu.addClass(root.classNames.visible);
                            opt.$menu.data('_scrollTopAtShow', root.$menu.scrollTop());
                        }
                    }
                    // bind `this` to the trigger, same as every other op.update()
                    // call site: function-based disabled/visible/name/icon options
                    // are documented to run against the trigger element, and a
                    // plain op.update(...) call would hand them the internal `op`
                    // object instead.
                    op.update.call(root.$trigger || $(), opt, root); // Correctly update position if user is already hovered over menu item
                    root.positionSubmenu.call(opt.$node, opt.$menu); // positionSubmenu, will only do anything if user already hovered over menu item that just got new subitems.
                }

                // Wait for promise completion. .then(success, error, notify) (we don't track notify). Bind the opt
                // and root to avoid scope problems
                promise.then(completedPromise.bind(this, opt, root), errorPromise.bind(this, opt, root));
            },
            // operation that will run after contextMenu showed on screen
            activated: function(opt){
                var $menu = opt.$menu;
                // Undo a previous activation's height cap / overflow / detached
                // sub-menus (if any) before measuring, so a menu element that's
                // reused across multiple show/hide cycles (the common,
                // non-dynamically-built case) is always measured at its natural
                // height here. Without this, a leftover inline 'height' from an
                // earlier activation would make the menu appear to already fit
                // the viewport, silently skipping both the scroll handling AND
                // detachSubmenus() below on every re-open after the first.
                $menu.css({height: '', 'overflow-x': '', 'overflow-y': ''});
                op.reattachSubmenus(opt);
                // unbind any scroll handler from a previous activation (see below) -
                // it gets rebound below only if this activation needs it again
                $menu.off('scroll.contextMenuDetachedSubmenus');

                var $menuOffset = $menu.offset();
                var winHeight = $(window).height();
                var winWidth = $(window).width();
                var winScrollTop = $(window).scrollTop();
                var winScrollLeft = $(window).scrollLeft();
                var menuHeight = $menu.height();
                var outerHeight = $menu.outerHeight();
                var outerWidth = $menu.outerWidth();

                if(menuHeight > winHeight){
                    $menu.css({
                        'height' : winHeight + 'px',
                        // Note: 'overflow-x: visible' would NOT keep sub-menus
                        // visible here even though that reads intuitively - per
                        // the CSS Overflow spec, when overflow-y is 'auto' (or
                        // any value other than 'visible'), overflow-x computes to
                        // 'auto' as well if specified as 'visible'. Both axes end
                        // up clipping regardless of what's requested here.
                        'overflow-x': 'hidden',
                        'overflow-y': 'auto',
                        'top': winScrollTop + 'px'
                    });
                    // The clipping above also cuts off any sub-menus, since they
                    // are (by default) DOM descendants of this scrollable list.
                    // Detach them to <body> so they render unclipped (see #775
                    // and detachSubmenus() above for the full explanation).
                    op.detachSubmenus(opt);
                    // A detached sub-menu is positioned in page coordinates and
                    // doesn't track its opener while the root scrolls internally
                    // (see hideDetachedSubmenus() above for the full explanation) -
                    // close it instead of leaving it floating over the wrong item.
                    $menu.on('scroll.contextMenuDetachedSubmenus', function () {
                        op.hideDetachedSubmenus(opt);
                    });
                } else if($menuOffset.top < winScrollTop){
                    $menu.css({
                      'top': winScrollTop + 'px'
                    });
                } else if($menuOffset.top + outerHeight > winScrollTop + winHeight){
                    $menu.css({
                      'top': $menuOffset.top - (($menuOffset.top + outerHeight) - (winScrollTop + winHeight)) + "px"
                    });
                }
                if($menuOffset.left + outerWidth > winScrollLeft + winWidth){
                    $menu.css({
                      'left': $menuOffset.left - (($menuOffset.left + outerWidth) - (winScrollLeft + winWidth)) + "px"
                    });
                }
            }
        };

    // true if target is inside one of root's sub-menus that were detached to
    // <body> by op.detachSubmenus() (see #775) - used where code otherwise
    // relies on root.$menu[0].contains(target) to detect clicks/targets
    // still "inside" the context menu.
    function isWithinDetachedSubmenus(root, target) {
        var detached = root._detachedSubmenus, i;
        if (!detached || !detached.length) {
            return false;
        }
        for (i = 0; i < detached.length; i++) {
            if (detached[i] && detached[i][0] && detached[i][0].contains(target)) {
                return true;
            }
        }
        return false;
    }

    // true if (x, y) - page coordinates from a mousedown handle.layerClick is
    // about to treat as an "outside click" - plausibly belong to the native
    // options popup of a `type: 'select'` menu input that changed a moment
    // ago (see the 'change' handler set up in op.create()'s 'select' case).
    // Guards against https://github.com/swisnl/jQuery-contextMenu/issues/744:
    // Firefox fires a spurious click/mousedown shortly after choosing an
    // option from a <select>, at coordinates that don't necessarily fall
    // within root.$menu's own (possibly clipped) bounding box, because the
    // browser's native popup isn't constrained by it - even though the
    // interaction never left the menu. A real native popup always renders
    // directly below (or, flipped, above) its <select> and overlaps that
    // <select>'s own horizontal span, so requiring the coordinates to fall
    // within that span (rather than just checking elapsed time) keeps this
    // from also swallowing an unrelated, genuinely-outside click that
    // happens to follow shortly after some other select on the menu changed.
    function isNearRecentSelectChange(root, x, y) {
        if (!root || typeof root._recentSelectChangeAt !== 'number') {
            return false;
        }

        var graceMs = 500;
        if ((Date.now() - root._recentSelectChangeAt) >= graceMs) {
            return false;
        }

        var el = root._recentSelectEl;
        if (!el || !document.body.contains(el)) {
            return false;
        }

        var rect = el.getBoundingClientRect(),
            scrollLeft = $win.scrollLeft(),
            scrollTop = $win.scrollTop(),
            margin = 4,
            left = rect.left + scrollLeft - margin,
            right = rect.right + scrollLeft + margin,
            top = rect.top + scrollTop - margin;

        return x >= left && x <= right && y >= top;
    }

    // split accesskey according to http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key
    function splitAccesskey(val) {
        var t = val.split(/\s+/);
        var keys = [];

        for (var i = 0, k; (k = t[i]); i++) {
            k = k.charAt(0).toUpperCase(); // first character only
            // theoretically non-accessible characters should be ignored, but different systems, different keyboard layouts, ... screw it.
            // a map to look up already used access keys would be nice
            keys.push(k);
        }

        return keys;
    }

    // apply a `dataAttr` option object as HTML5 data-* attributes on the given
    // element. Keys are converted from camelCase to the dashed form the HTML
    // spec (and jQuery's `.data()` getter) expects, so `{menuTitle: 'x'}` is
    // written as `data-menu-title="x"` and reads back as `.data('menuTitle')`.
    // Values are set through `.attr()` so they're escaped by the DOM instead of
    // ever being interpolated into an HTML string. `null`/`undefined` values are
    // skipped, everything else is stringified.
    function applyDataAttr($element, dataAttr) {
        if (!dataAttr || typeof dataAttr !== 'object') {
            return;
        }

        $.each(dataAttr, function (key, value) {
            if (value === null || typeof value === 'undefined') {
                return;
            }

            var name = String(key).replace(/[A-Z]/g, '-$&').toLowerCase();
            if (!name) {
                return;
            }

            $element.attr('data-' + name, String(value));
        });
    }

    // is the given contextMenu `selector` option an Element or jQuery object,
    // rather than a CSS selector string? Elements/jQuery objects can't be used
    // as a delegated `.on()` selector argument (jQuery only delegates via CSS
    // selector strings), so they're bound directly instead - see
    // `elementSelectors` and the 'create'/'destroy' operations below.
    function isElementSelector(selector) {
        return !!selector && typeof selector === 'object' &&
            (selector.nodeType === 1 || (typeof selector.jquery !== 'undefined' && typeof selector.length === 'number'));
    }

    // remove every `elementSelectors` entry (and its bound handler) registered
    // under the given namespace. Used to tear down direct element/jQuery-object
    // bindings from any destroy code path, regardless of whether the menu was
    // created with a custom `context`.
    function teardownElementSelectorBindings(ns) {
        for (var i = elementSelectors.length - 1; i >= 0; i--) {
            if (elementSelectors[i].ns !== ns) {
                continue;
            }
            $(elementSelectors[i].el).off(elementSelectors[i].ns);
            elementSelectors.splice(i, 1);
        }
    }

// handle contextMenu triggers
    $.fn.contextMenu = function (operation) {
        var $t = this, $o = operation;
        if (this.length > 0) {  // this is not a build on demand menu
            if (typeof operation === 'undefined') {
                this.first().trigger('contextmenu');
            } else if (typeof operation.x !== 'undefined' && typeof operation.y !== 'undefined') {
                this.first().trigger($.Event('contextmenu', {
                    pageX: operation.x,
                    pageY: operation.y,
                    mouseButton: operation.button
                }));
            } else if (operation === 'hide') {
                var $menu = this.first().data('contextMenu') ? this.first().data('contextMenu').$menu : null;
                if ($menu) {
                    $menu.trigger('contextmenu:hide');
                }
            } else if (operation === 'destroy') {
                $.contextMenu('destroy', {context: this});
            } else if ($.isPlainObject(operation)) {
                operation.context = this;
                $.contextMenu('create', operation);
            } else if (operation) {
                this.removeClass('context-menu-disabled');
            } else if (!operation) {
                this.addClass('context-menu-disabled');
            }
        } else {
            $.each(menus, function () {
                // Note: jQuery.fn.selector was deprecated in jQuery 1.9 and removed in
                // jQuery 3.0, so $t.selector is always undefined on modern jQuery. This
                // means a matching menu can only be found when jQuery still exposes the
                // (legacy) `.selector` property.
                if (typeof $t.selector !== 'undefined' && this.selector === $t.selector) {
                    $o.data = this;

                    $.extend($o.data, {trigger: 'demand'});
                }
            });

            // Without a matching registered menu there's nothing to show. Bail out
            // instead of invoking the handler with incomplete/missing event data,
            // which would throw when it tries to read e.data.events.
            if (!$o || !$o.data) {
                return this;
            }

            handle.contextmenu.call($o.target, $o);
        }

        return this;
    };

    // manage contextMenu instances
    $.contextMenu = function (operation, options) {
        if (typeof operation !== 'string') {
            options = operation;
            operation = 'create';
        }

        if (typeof options === 'string') {
            options = {selector: options};
        } else if (typeof options === 'undefined') {
            options = {};
        } else if (isElementSelector(options)) {
            // e.g. $.contextMenu('destroy', element) / $.contextMenu('destroy', $(element))
            options = {selector: options};
        }

        // merge with default options
        var o = $.extend(true, {}, defaults, options || {});
        var $document = $(document);
        var $context = $document;
        var _hasContext = false;

        // an Element / jQuery object can't be used as a delegated-event
        // selector string, so it's normalized here once and handled
        // separately by the 'create'/'destroy' operations below.
        var useElementSelector = isElementSelector(o.selector);
        var $elements = useElementSelector ? (o.selector.jquery ? o.selector : $(o.selector)) : null;

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
                for (var menu in menus) {
                    if (!Object.prototype.hasOwnProperty.call(menus, menu)) {
                        continue;
                    }
                    // when a context was given, only update the menus registered
                    // against it. Passing the context element itself to op.update()
                    // (as this used to) can never work, it expects a menu's options
                    // object and immediately dereferences its $menu.
                    if (_hasContext && (!menus[menu] || menus[menu].context !== o.context)) {
                        continue;
                    }
                    // for a `build` menu the registration isn't the object the
                    // on-screen menu was built from, so refresh the built
                    // instance when there is one.
                    var target = builtMenus[menu] || menus[menu];
                    // function-based `disabled`/`visible`/`name`/`icon` options
                    // are documented to run against the trigger element, so bind
                    // `this` to it rather than leaving it as the internal `op`
                    // object that a plain op.update(...) call would pass along.
                    op.update.call((target && target.$trigger) || $(), target);
                }
                break;

            case 'create':
                // no selector no joy
                if (!o.selector || (useElementSelector && $elements.length === 0)) {
                    throw new Error('No selector specified');
                }
                // make sure internal classes are not bound to
                if (!useElementSelector && o.selector.match(/.context-menu-(list|item|input)($|\s)/)) {
                    throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
                }
                if (!o.build && (!o.items || $.isEmptyObject(o.items))) {
                    throw new Error('No Items specified');
                }
                counter++;
                o.ns = '.contextMenu' + counter;
                if (useElementSelector) {
                    // Element/jQuery-object selectors are always bound directly
                    // to the given element(s) (see below), regardless of
                    // whether a custom `context` was supplied, so they must
                    // always be tracked here too - otherwise a registration
                    // made with a non-document `context` (e.g. via
                    // `$(container).contextMenu({selector: element, ...})`)
                    // could never be found and torn down again by destroy().
                    $elements.each(function () {
                        elementSelectors.push({el: this, ns: o.ns});
                    });
                } else if (!_hasContext) {
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
                if (useElementSelector) {
                    // Elements/jQuery objects aren't valid delegated-event
                    // selectors, so bind directly to the given element(s)
                    // instead of delegating through $context.
                    $elements.on('contextmenu' + o.ns, o, handle.contextmenu);
                } else {
                    $context
                        .on('contextmenu' + o.ns, o.selector, o, handle.contextmenu);
                }

                if (_hasContext) {
                    // add remove hook, just in case
                    $context.on('remove' + o.ns, function () {
                        $(this).contextMenu('destroy');
                    });
                }

                switch (o.trigger) {
                    case 'hover':
                        if (useElementSelector) {
                            $elements
                                .on('mouseenter' + o.ns, o, handle.mouseenter)
                                .on('mouseleave' + o.ns, o, handle.mouseleave);
                        } else {
                            $context
                                .on('mouseenter' + o.ns, o.selector, o, handle.mouseenter)
                                .on('mouseleave' + o.ns, o.selector, o, handle.mouseleave);
                        }
                        break;

                    case 'left':
                        if (useElementSelector) {
                            $elements.on('click' + o.ns, o, handle.click);
                        } else {
                            $context.on('click' + o.ns, o.selector, o, handle.click);
                        }
                        break;
				    case 'touchstart':
                        if (useElementSelector) {
                            $elements.on('touchstart' + o.ns, o, handle.click);
                        } else {
                            $context.on('touchstart' + o.ns, o.selector, o, handle.click);
                        }
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
                            delete builtMenus[o.ns];
                        } catch (e) {
                            menus[o.ns] = null;
                        }

                        $(o.context).off(o.ns);
                        // Element/jQuery-object selectors are bound directly to
                        // the trigger element(s) rather than to `o.context`
                        // (see the 'create' operation), so they need their own
                        // teardown here too.
                        teardownElementSelectorBindings(o.ns);

                        return true;
                    });
                } else if (!o.selector) {
                    $document.off('.contextMenu .contextMenuAutoHide');
                    $.each(menus, function (ns, o) {
                        $(o.context).off(o.ns);
                    });
                    $.each(elementSelectors, function (i, entry) {
                        $(entry.el).off(entry.ns);
                    });

                    namespaces = {};
                    menus = {};
                    builtMenus = {};
                    elementSelectors = [];
                    counter = 0;
                    initialized = false;

                    $('#context-menu-layer, .context-menu-list').remove();
                } else if (useElementSelector) {
                    $elements.each(function () {
                        var el = this;
                        for (var i = elementSelectors.length - 1; i >= 0; i--) {
                            if (elementSelectors[i].el !== el) {
                                continue;
                            }

                            var ns = elementSelectors[i].ns;

                            $visibleMenu = $('.context-menu-list').filter(':visible');
                            if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is(el)) {
                                $visibleMenu.trigger('contextmenu:hide', {force: true});
                            }

                            try {
                                if (menus[ns] && menus[ns].$menu) {
                                    menus[ns].$menu.remove();
                                }

                                delete menus[ns];
                                delete builtMenus[ns];
                            } catch (e) {
                                menus[ns] = null;
                            }

                            $(el).off(ns);
                            elementSelectors.splice(i, 1);
                        }
                    });
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
                        delete builtMenus[namespaces[o.selector]];
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

// import values into <input> commands
    $.contextMenu.setInputValues = function (opt, data) {
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
                    item.selected = data[key] ? true : false;
                    break;

                case 'radio':
                    item.selected = (data[item.radio] || '') === item.value;
                    break;

                case 'select':
                    item.selected = data[key] || '';
                    break;
            }
        });
    };

// export values from <input> commands
    $.contextMenu.getInputValues = function (opt, data) {
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
    };

// find <label for="xyz">
    function inputLabel(node) {
        return (node.id && $('label[for="' + node.id + '"]').val()) || node.name;
    }

// convert <menu> to items object
    function menuChildren(items, $children, counter) {
        if (!counter) {
            counter = 0;
        }

        $children.each(function () {
            var $node = $(this),
                node = this,
                nodeName = this.nodeName.toLowerCase(),
                label,
                item;

            // extract <label><input>
            if (nodeName === 'label' && $node.find('input, textarea, select').length) {
                label = $node.text();
                $node = $node.children().first();
                node = $node.get(0);
                nodeName = node.nodeName.toLowerCase();
            }

            /*
             * <menu> accepts flow-content as children. that means <embed>, <canvas> and such are valid menu items.
             * Not being the sadistic kind, $.contextMenu only accepts:
             * <command>, <menuitem>, <hr>, <span>, <p> <input [text, radio, checkbox]>, <textarea>, <select> and of course <menu>.
             * Everything else will be imported as an html node, which is not interfaced with contextMenu.
             */

            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#concept-command
            switch (nodeName) {
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#the-menu-element
                case 'menu':
                    item = {name: $node.attr('label'), items: {}};
                    counter = menuChildren(item.items, $node.children(), counter);
                    break;

                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command
                case 'a':
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command
                // falls through
                case 'button':
                    item = {
                        name: $node.text(),
                        disabled: !!$node.attr('disabled'),
                        callback: (function () {
                            return function (itemKey, opt, ev) {
                                if ($node.get(0).onclick !== null) {
                                    $node.get(0).click();
                                } else {
                                    opt.callback(itemKey, opt, ev);
                                }
                            };
                        })()
                    };
                    break;

                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-command-element-to-define-a-command
                case 'menuitem':
                case 'command':
                    switch ($node.attr('type')) {
                        case undefined:
                        case 'command':
                        case 'menuitem':
                            item = {
                                name: $node.attr('label'),
                                disabled: !!$node.attr('disabled'),
                                icon: $node.attr('icon'),
                                callback: (function () {
                                    return function (itemKey, opt, ev) {
                                        if ($node.get(0).onclick !== null) {
                                            $node.get(0).click();
                                        } else {
                                            opt.callback(itemKey, opt, ev);
                                        }
                                    };
                                })()
                            };
                            break;

                        case 'checkbox':
                            item = {
                                type: 'checkbox',
                                disabled: !!$node.attr('disabled'),
                                name: $node.attr('label'),
                                selected: !!$node.attr('checked')
                            };
                            break;
                        case 'radio':
                            item = {
                                type: 'radio',
                                disabled: !!$node.attr('disabled'),
                                name: $node.attr('label'),
                                radio: $node.attr('radiogroup'),
                                value: $node.attr('id'),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        default:
                            item = undefined;
                    }
                    break;

                case 'hr':
                    item = '-------';
                    break;

                case 'input':
                    switch ($node.attr('type')) {
                        case 'text':
                            item = {
                                type: 'text',
                                name: label || inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                value: $node.val()
                            };
                            break;

                        case 'checkbox':
                            item = {
                                type: 'checkbox',
                                name: label || inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        case 'radio':
                            item = {
                                type: 'radio',
                                name: label || inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                radio: !!$node.attr('name'),
                                value: $node.val(),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        default:
                            item = undefined;
                            break;
                    }
                    break;

                case 'select':
                    item = {
                        type: 'select',
                        name: label || inputLabel(node),
                        disabled: !!$node.attr('disabled'),
                        selected: $node.val(),
                        options: {}
                    };
                    $node.children().each(function () {
                        item.options[this.value] = $(this).text();
                    });
                    break;

                case 'textarea':
                    item = {
                        type: 'textarea',
                        name: label || inputLabel(node),
                        disabled: !!$node.attr('disabled'),
                        value: $node.val()
                    };
                    break;

                case 'label':
                    break;

                default:
                    item = {type: 'html', html: $node.clone(true)};
                    break;
            }

            if (item) {
                counter++;
                items['key' + counter] = item;
            }
        });

        return counter;
    }

// convert html5 menu
    $.contextMenu.fromMenu = function (element) {
        var $this = $(element),
            items = {};

        menuChildren(items, $this.children());

        return items;
    };

// make defaults accessible
    $.contextMenu.defaults = defaults;
    $.contextMenu.types = types;
// export internal functions - undocumented, for hacking only!
    $.contextMenu.handle = handle;
    $.contextMenu.op = op;
    $.contextMenu.menus = menus;

});
