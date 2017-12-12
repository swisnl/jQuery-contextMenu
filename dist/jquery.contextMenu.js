(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["jQuery"], factory);
	else if(typeof exports === 'object')
		exports["jquery.contextMenu"] = factory(require("jQuery"));
   //
 /**
 * jQuery contextMenu v2.6.3 - Plugin for simple contextMenu handling
 *
 * Version: v2.6.3
 *
 * Authors: Björn Brala (SWIS.nl), Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://swisnl.github.io/jQuery-contextMenu/
 *
 * Copyright (c) 2011-2017 SWIS BV and contributors
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 * Date: 2017-12-12T11:34:41.945Z
 */
 
	else
		root["jquery.contextMenu"] = factory(root["jQuery"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {let defaults = {
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

    //ability to select submenu
    selectableSubMenu: false,

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
            const offset = this.offset();
            offset.top += this.outerHeight();
            offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
            $menu.css(offset);
        }
    },
    // position menu
    position: function (opt, x, y) {
        const $window = $(window);
        let offset;
        // determine contextMenu position
        if (!x && !y) {
            opt.determinePosition.call(this, opt.$menu);
            return;
        } else if (x === 'maintain' && y === 'maintain') {
            // x and y must not be changed (after re-show on command click)
            offset = opt.$menu.position();
        } else {
            // x and y are given (by mouse event)
            const offsetParentOffset = opt.$menu.offsetParent().offset();
            offset = { top: y - offsetParentOffset.top, left: x - offsetParentOffset.left };
        }

        // correct offset if viewport demands it
        const bottom = $window.scrollTop() + $window.height(),
              right = $window.scrollLeft() + $window.width(),
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
        if ($.ui && $.ui.position) {
            // .position() is provided as a jQuery UI utility
            // (...and it won't work on hidden elements)
            $menu.css('display', 'block').position({
                my: 'left top-5',
                at: 'right top',
                of: this,
                collision: 'flipfit fit'
            }).css('display', '');
        } else {
            // determine contextMenu position
            const offset = {
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
        show: $.noop,
        hide: $.noop,
        activated: $.noop
    },
    // default callback
    callback: null,
    // list of contextMenu items
    items: {},
    types: {}
};

/* harmony default export */ __webpack_exports__["a"] = (defaults);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__operations__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__defaults__ = __webpack_require__(1);



let $currentTrigger;
let handle = {
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
        if (e.data.trigger !== 'right' && e.data.trigger !== 'demand' && e.originalEvent) {
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
                const built = e.data.build($currentTrigger, e);
                // abort if build() returned false
                if (built === false) {
                    return;
                }

                // dynamically build menu on invocation
                e.data = $.extend(true, {}, __WEBPACK_IMPORTED_MODULE_1__defaults__["a" /* default */], e.data, built || {});

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

                __WEBPACK_IMPORTED_MODULE_0__operations__["a" /* default */].create(e.data);
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
                __WEBPACK_IMPORTED_MODULE_0__operations__["a" /* default */].show.call($this, e.data, e.pageX, e.pageY);
            }
        }
    },
    // contextMenu left-click trigger
    click: function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(this).trigger($.Event('contextmenu', { data: e.data, pageX: e.pageX, pageY: e.pageY }));
    },
    // contextMenu right-click trigger
    mousedown: function (e) {
        // register mouse down
        const $this = $(this);

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
        const $this = $(this);
        if ($this.data('contextMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $currentTrigger = $this;
            $this.trigger($.Event('contextmenu', { data: e.data, pageX: e.pageX, pageY: e.pageY }));
        }

        $this.removeData('contextMenuActive');
    },
    // contextMenu hover trigger
    mouseenter: function (e) {
        const $this = $(this),
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

        handle.hoveract.pageX = e.pageX;
        handle.hoveract.pageY = e.pageY;
        handle.hoveract.data = e.data;
        $document.on('mousemove.contextMenuShow', handle.mousemove);
        handle.hoveract.timer = setTimeout(function () {
            handle.hoveract.timer = null;
            $document.off('mousemove.contextMenuShow');
            $currentTrigger = $this;
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
        } catch (e) {}

        handle.hoveract.timer = null;
    },
    // click on layer to hide contextMenu
    layerClick: function (e) {
        let $this = $(this),
            root = $this.data('contextMenuRoot'),
            button = e.button,
            x = e.pageX,
            y = e.pageY,
            target,
            offset;

        e.preventDefault();

        setTimeout(function () {
            let $window = $(window);
            let triggerAction = root.trigger === 'left' && button === 0 || root.trigger === 'right' && button === 2;

            // find the element that would've been clicked, wasn't the layer in the way
            if (document.elementFromPoint && root.$layer) {
                root.$layer.hide();
                target = document.elementFromPoint(x - $window.scrollLeft(), y - $window.scrollTop());

                // also need to try and focus this element if we're in a contenteditable area,
                // as the layer will prevent the browser mouse action we want
                if (target.isContentEditable) {
                    const range = document.createRange(),
                          sel = window.getSelection();
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
                    $(target).contextMenu({ x: x, y: y, button: button });
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

        // Only get the data from $currentTrigger if it exists
        if ($currentTrigger) {
            opt = $currentTrigger.data('contextMenu') || {};
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
        if (opt.$menu && parseInt(targetZIndex, 10) > parseInt(opt.$menu.css("zIndex"), 10)) {
            return;
        }
        switch (e.keyCode) {
            case 9:
            case 38:
                // up
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
            case 40:
                // down
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

            case 37:
                // left
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

            case 39:
                // right
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
            case 36:
                // home
                if (opt.$selected && opt.$selected.find('input, textarea, select').length) {
                    return;
                } else {
                    (opt.$selected && opt.$selected.parent() || opt.$menu).children(':not(.' + opt.classNames.disabled + ', .' + opt.classNames.notSelectable + ')')[e.keyCode === 36 ? 'first' : 'last']().trigger('contextmenu:focus');
                    e.preventDefault();
                    return;
                }
            case 13:
                // enter
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
            case 34:
                // page down
                // prevent browser from scrolling down while menu is visible
                handle.keyStop(e, opt);
                return;

            case 27:
                // esc
                handle.keyStop(e, opt);
                if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                    opt.$menu.trigger('contextmenu:hide');
                }
                return;

            default:
                // 0-9, a-z
                const k = String.fromCharCode(e.keyCode).toUpperCase();
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
        let $this = $(this).closest('.context-menu-item'),
            data = $this.data(),
            opt = data.contextMenu,
            root = data.contextMenuRoot;

        root.$selected = opt.$selected = $this;
        root.isInput = opt.isInput = true;
    },
    // flag that we're inside an input so the key handler can act accordingly
    blurInput: function () {
        let $this = $(this).closest('.context-menu-item'),
            data = $this.data(),
            opt = data.contextMenu,
            root = data.contextMenuRoot;

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
        let $this = $(this),
            data = $this.data(),
            opt = data.contextMenu,
            root = data.contextMenuRoot;

        root.hovering = true;

        // abort if we're re-entering
        if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        // make sure only one item is selected
        (opt.$menu ? opt : root).$menu.children('.' + root.classNames.hover).trigger('contextmenu:blur').children('.hover').trigger('contextmenu:blur');

        if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
            opt.$selected = null;
            return;
        }

        $this.trigger('contextmenu:focus');
    },
    // :hover done manually so key handling is possible
    itemMouseleave: function (e) {
        let $this = $(this),
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

        if (opt && opt.$menu && opt.$menu.hasClass('context-menu-visible')) {
            return;
        }

        $this.trigger('contextmenu:blur');
    },
    // contextMenu item click
    itemClick: function (e) {
        let $this = $(this),
            data = $this.data(),
            opt = data.contextMenu,
            root = data.contextMenuRoot,
            key = data.contextMenuKey,
            callback;

        // abort if the key is unknown or disabled or is a menu
        if (!opt.items[key] || $this.is('.' + root.classNames.disabled + ', .context-menu-separator, .' + root.classNames.notSelectable) || $this.is('.context-menu-submenu') && root.selectableSubMenu === false) {
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
            __WEBPACK_IMPORTED_MODULE_0__operations__["a" /* default */].update.call(root.$trigger, root);
        }
    },
    // ignore click events on input elements
    inputClick: function (e) {
        e.stopImmediatePropagation();
    },
    // hide <menu>
    hideMenu: function (e, data) {
        const root = $(this).data('contextMenuRoot');
        __WEBPACK_IMPORTED_MODULE_0__operations__["a" /* default */].hide.call(root.$trigger, root, data && data.force);
    },
    // focus <command>
    focusItem: function (e) {
        e.stopPropagation();
        const $this = $(this),
              data = $this.data(),
              opt = data.contextMenu,
              root = data.contextMenuRoot;

        if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
            return;
        }

        $this.addClass([root.classNames.hover, root.classNames.visible].join(' '))
        // select other items and included items
        .parent().find('.context-menu-item').not($this).removeClass(root.classNames.visible).filter('.' + root.classNames.hover).trigger('contextmenu:blur');

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
        const $this = $(this),
              data = $this.data(),
              opt = data.contextMenu,
              root = data.contextMenuRoot;

        if (opt.autoHide) {
            // for tablets and touch screens this needs to remain
            $this.removeClass(root.classNames.visible);
        }
        $this.removeClass(root.classNames.hover);
        opt.$selected = null;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (handle);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__zindex__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__handler__ = __webpack_require__(2);



let $currentTrigger = null;
let op = {
    show: function (opt, x, y) {
        const $trigger = $(this),
              css = {};

        // hide any open menus
        $('#context-menu-layer').trigger('mousedown');

        // backreference for callbacks
        opt.$trigger = $trigger;

        // show event
        if (opt.events.show.call($trigger, opt) === false) {
            $currentTrigger = null;
            return;
        }

        // create or update context menu
        op.update.call($trigger, opt);

        // position menu
        opt.position.call($trigger, opt, x, y);

        // make sure we're in front
        if (opt.zIndex) {
            let additionalZValue = opt.zIndex;
            // If opt.zIndex is a function, call the function to get the right zIndex.
            if (typeof opt.zIndex === 'function') {
                additionalZValue = opt.zIndex.call($trigger, opt);
            }
            css.zIndex = Object(__WEBPACK_IMPORTED_MODULE_0__zindex__["a" /* default */])($trigger) + additionalZValue;
        }

        // add layer
        op.layer.call(opt.$menu, opt, css.zIndex);

        // adjust sub-menu zIndexes
        opt.$menu.find('ul').css('zIndex', css.zIndex + 1);

        // position and show context menu
        opt.$menu.css(css)[opt.animation.show](opt.animation.duration, function () {
            $trigger.trigger('contextmenu:visible');

            op.activated(opt);
            opt.events.activated();
        });
        // make options available and set state
        $trigger.data('contextMenu', opt).addClass('context-menu-active');

        // register key handler
        $(document).off('keydown.contextMenu').on('keydown.contextMenu', __WEBPACK_IMPORTED_MODULE_1__handler__["a" /* default */].key);
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
    hide: function (opt, force) {
        const $trigger = $(this);
        if (!opt) {
            opt = $trigger.data('contextMenu') || {};
        }

        // hide event
        if (!force && opt.events && opt.events.hide.call($trigger, opt) === false) {
            return;
        }

        // remove options and revert state
        $trigger.removeData('contextMenu').removeClass('context-menu-active');

        if (opt.$layer) {
            // keep layer for a bit so the contextmenu event can be aborted properly by opera
            setTimeout(function ($layer) {
                return function () {
                    $layer.remove();
                };
            }(opt.$layer), 10);

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
                                } catch (e) {}
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
                $('<span></span>').addClass('context-menu-accesskey').text(item._accesskey).appendTo($name);
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
            let $t = $('<li class="context-menu-item"></li>').addClass(item.className || ''),
                $label = null,
                $input = null;

            // iOS needs to see a click-event bound to an element to actually
            // have the TouchEvents infrastructure trigger the click event
            $t.on('click', $.noop);

            // Make old school string seperator a real item so checks wont be
            // akward later.
            // And normalize 'cm_separator' into 'cm_seperator'.
            if (typeof item === 'string' || item.type === 'cm_separator') {
                item = { type: 'cm_seperator' };
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
                } else if (item.type === 'sub') {
                    // We don't want to execute the next else-if if it is a sub.
                } else if (item.type) {
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
                        $input = $('<input type="text" value="1" name="" />').attr('name', 'context-menu-input-' + key).val(item.value || '').appendTo($label);
                        break;

                    case 'textarea':
                        $input = $('<textarea name=""></textarea>').attr('name', 'context-menu-input-' + key).val(item.value || '').appendTo($label);

                        if (item.height) {
                            $input.height(item.height);
                        }
                        break;

                    case 'checkbox':
                        $input = $('<input type="checkbox" value="1" name="" />').attr('name', 'context-menu-input-' + key).val(item.value || '').prop('checked', !!item.selected).prependTo($label);
                        break;

                    case 'radio':
                        $input = $('<input type="radio" value="1" name="" />').attr('name', 'context-menu-input-' + item.radio).val(item.value || '').prop('checked', !!item.selected).prependTo($label);
                        break;

                    case 'select':
                        $input = $('<select name=""></select>').attr('name', 'context-menu-input-' + key).appendTo($label);
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
                            if ($.isFunction(item.callback) && (typeof k.callbacks[key] === 'undefined' || typeof opt.type === 'undefined')) {
                                k.callbacks[key] = item.callback;
                            }
                        });
                        createNameNode(item).appendTo($t);
                        break;
                }

                // disable key listener in <input>
                if (item.type && item.type !== 'sub' && item.type !== 'html' && item.type !== 'cm_seperator') {
                    $input.on('focus', __WEBPACK_IMPORTED_MODULE_1__handler__["a" /* default */].focusInput).on('blur', __WEBPACK_IMPORTED_MODULE_1__handler__["a" /* default */].blurInput);

                    if (item.events) {
                        $input.on(item.events, opt);
                    }
                }

                // add icons
                if (item.icon) {
                    if ($.isFunction(item.icon)) {
                        item._icon = item.icon.call(this, this, $t, key, item);
                    } else {
                        if (typeof item.icon === 'string' && item.icon.substring(0, 3) === 'fa-') {
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
                $t.on('selectstart.disableTextSelect', __WEBPACK_IMPORTED_MODULE_1__handler__["a" /* default */].abortevent);
            }
        });
        // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
        if (!opt.$node) {
            opt.$menu.css('display', 'none').addClass('context-menu-root');
        }
        opt.$menu.appendTo(opt.appendTo || document.body);
    },
    resize: function ($menu, nested) {
        let domMenu;
        // determine widths of submenus, as CSS won't grow them automatically
        // position:absolute within position:absolute; min-width:100; max-width:200; results in width: 100;
        // kinda sucks hard...

        // determine width of absolutely positioned element
        $menu.css({ position: 'absolute', display: 'block' });
        // don't apply yet, because that would break nested elements' widths
        $menu.data('width', (domMenu = $menu.get(0)).getBoundingClientRect ? Math.ceil(domMenu.getBoundingClientRect().width) : $menu.outerWidth() + 1); // outerWidth() returns rounded pixels
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
        }
    },
    update: function (opt, root) {
        const $trigger = this;
        if (typeof root === 'undefined') {
            root = opt;
            op.resize(opt.$menu);
        }
        // re-check disabled for each item
        opt.$menu.children().each(function () {
            let $item = $(this),
                key = $item.data('contextMenuKey'),
                item = opt.items[key],
                disabled = $.isFunction(item.disabled) && item.disabled.call($trigger, key, root) || item.disabled === true,
                visible;
            if ($.isFunction(item.visible)) {
                visible = item.visible.call($trigger, key, root);
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
                        item.$input.val((item.selected === 0 ? "0" : item.selected) || '');
                        break;
                }
            }

            if (item.$menu) {
                // update sub-menu
                op.update.call($trigger, item, root);
            }
        });
    },
    layer: function (opt, zIndex) {
        const $window = $(window);
        // add transparent layer for click area
        // filter and background for Internet Explorer, Issue #23
        const $layer = opt.$layer = $('<div id="context-menu-layer"></div>').css({
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
        }).data('contextMenuRoot', opt).insertBefore(this).on('contextmenu', __WEBPACK_IMPORTED_MODULE_1__handler__["a" /* default */].abortevent).on('mousedown', __WEBPACK_IMPORTED_MODULE_1__handler__["a" /* default */].layerClick);

        // IE6 doesn't know position:fixed;
        if (typeof document.body.style.maxWidth === 'undefined') {
            // IE6 doesn't support maxWidth
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
                errorPromise(undefined); //own error object
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
                errorItem = { "error": { name: errorItem } };
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
            op.update(opt, root); // Correctly update position if user is already hovered over menu item
            root.positionSubmenu.call(opt.$node, opt.$menu); // positionSubmenu, will only do anything if user already hovered over menu item that just got new subitems.
        }

        // Wait for promise completion. .then(success, error, notify) (we don't track notify). Bind the opt
        // and root to avoid scope problems
        promise.then(completedPromise.bind(this, opt, root), errorPromise.bind(this, opt, root));
    },
    // operation that will run after contextMenu showed on screen
    activated: function (opt) {
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
        } else if ($menuOffset.top < winScrollTop || $menuOffset.top + menuHeight > winScrollTop + winHeight) {
            $menu.css({
                'top': '0px'
            });
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (op);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_manager__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_inputvalues__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_html5__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_sass_jquery_contextMenu_scss__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_sass_jquery_contextMenu_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__src_sass_jquery_contextMenu_scss__);









const manager = new __WEBPACK_IMPORTED_MODULE_1__modules_manager__["a" /* default */]();
// manage contextMenu instances
let contextMenu = function (arg) {
    manager.manager(arg);
};

contextMenu.setInputValues = __WEBPACK_IMPORTED_MODULE_2__modules_inputvalues__["b" /* setInputValues */];
contextMenu.getInputValues = __WEBPACK_IMPORTED_MODULE_2__modules_inputvalues__["a" /* getInputValues */];
contextMenu.fromMenu = __WEBPACK_IMPORTED_MODULE_3__modules_html5__["a" /* default */];

//@todo deze zijn nu niet toegankelijk?
// make defaults accessible
contextMenu.defaults = manager.defaults;
contextMenu.types = manager.defaults.types;

// export internal functions - undocumented, for hacking only!
contextMenu.handle = manager.handle;
contextMenu.op = manager.op;
contextMenu.menus = manager.menus;

__WEBPACK_IMPORTED_MODULE_0_jquery___default.a.fn.contextMenu = contextMenu;
__WEBPACK_IMPORTED_MODULE_0_jquery___default.a.contextMenu = contextMenu;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__defaults__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__handler__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__operations__ = __webpack_require__(3);




class Manager {

    constructor() {
        this.defaults = __WEBPACK_IMPORTED_MODULE_0__defaults__["a" /* default */];
        this.handle = __WEBPACK_IMPORTED_MODULE_1__handler__["a" /* default */];
        this.op = __WEBPACK_IMPORTED_MODULE_2__operations__["a" /* default */];
        this.namespaces = {};
        this.initialized = false;
        this.menus = {};
        this.counter = 0;
    }

    manager(operation, options) {
        if (typeof operation !== 'string') {
            options = operation;
            operation = 'create';
        }

        if (typeof options === 'string') {
            options = { selector: options };
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
                    $document.on({
                        'contextmenu:hide.contextMenu': this.handle.hideMenu,
                        'prevcommand.contextMenu': this.handle.prevItem,
                        'nextcommand.contextMenu': this.handle.nextItem,
                        'contextmenu.contextMenu': this.handle.abortevent,
                        'mouseenter.contextMenu': this.handle.menuMouseenter,
                        'mouseleave.contextMenu': this.handle.menuMouseleave
                    }, '.context-menu-list').on('mouseup.contextMenu', '.context-menu-input', this.handle.inputClick).on(contextMenuItemObj, '.context-menu-item');

                    this.initialized = true;
                }

                // engage native contextmenu event
                $context.on('contextmenu' + o.ns, o.selector, o, this.handle.contextmenu);

                if (_hasContext) {
                    // add remove hook, just in case
                    $context.on('remove' + o.ns, function () {
                        $(this).contextMenu('destroy');
                    });
                }

                switch (o.trigger) {
                    case 'hover':
                        $context.on('mouseenter' + o.ns, o.selector, o, this.handle.mouseenter).on('mouseleave' + o.ns, o.selector, o, this.handle.mouseleave);
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
                    this.op.create(o);
                }
                break;

            case 'destroy':
                let $visibleMenu;
                if (_hasContext) {
                    // get proper options
                    const context = o.context;
                    $.each(this.menus, function (ns, o) {

                        if (!o) {
                            return true;
                        }

                        // Is this menu equest to the context called from
                        if (!$(context).is(o.selector)) {
                            return true;
                        }

                        $visibleMenu = $('.context-menu-list').filter(':visible');
                        if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is($(o.context).find(o.selector))) {
                            $visibleMenu.trigger('contextmenu:hide', { force: true });
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
                    $.each(this.menus, function (ns, o) {
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
                        $visibleMenu.trigger('contextmenu:hide', { force: true });
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
                if (!$.support.htmlCommand && !$.support.htmlMenuitem || typeof options === 'boolean' && options) {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Manager;
;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = zindex;
// determine zIndex
function zindex($t) {
    let zin = 0,
        $tt = $t;

    while (true) {
        zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
        $tt = $tt.parent();
        if (!$tt || !$tt.length || 'html body'.indexOf($tt.prop('nodeName').toLowerCase()) > -1) {
            break;
        }
    }
    return zin;
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (immutable) */ __webpack_exports__["b"] = setInputValues;
/* harmony export (immutable) */ __webpack_exports__["a"] = getInputValues;
// import values into <input> commands
function setInputValues(opt, data) {
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
}

// export values from <input> commands
function getInputValues(opt, data) {
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
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (immutable) */ __webpack_exports__["a"] = fromMenu;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__menuchildren__ = __webpack_require__(9);


function fromMenu(element) {
    let $this = $(element),
        items = {};

    Object(__WEBPACK_IMPORTED_MODULE_0__menuchildren__["a" /* default */])(items, $this.children());

    return items;
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (immutable) */ __webpack_exports__["a"] = menuChildren;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__inputlabel__ = __webpack_require__(10);


function menuChildren(items, $children, counter) {
    if (!counter) {
        counter = 0;
    }

    $children.each(function () {
        let $node = $(this),
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
                item = { name: $node.attr('label'), items: {} };
                counter = menuChildren(item.items, $node.children(), counter);
                break;

            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command
            case 'a':
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command
            case 'button':
                item = {
                    name: $node.text(),
                    disabled: !!$node.attr('disabled'),
                    callback: function () {
                        return function () {
                            $node.get(0).click();
                        };
                    }()
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
                            callback: function () {
                                return function () {
                                    $node.get(0).click();
                                };
                            }()
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
                            name: label || Object(__WEBPACK_IMPORTED_MODULE_0__inputlabel__["a" /* default */])(node),
                            disabled: !!$node.attr('disabled'),
                            value: $node.val()
                        };
                        break;

                    case 'checkbox':
                        item = {
                            type: 'checkbox',
                            name: label || Object(__WEBPACK_IMPORTED_MODULE_0__inputlabel__["a" /* default */])(node),
                            disabled: !!$node.attr('disabled'),
                            selected: !!$node.attr('checked')
                        };
                        break;

                    case 'radio':
                        item = {
                            type: 'radio',
                            name: label || Object(__WEBPACK_IMPORTED_MODULE_0__inputlabel__["a" /* default */])(node),
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
                    name: label || Object(__WEBPACK_IMPORTED_MODULE_0__inputlabel__["a" /* default */])(node),
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
                    name: label || Object(__WEBPACK_IMPORTED_MODULE_0__inputlabel__["a" /* default */])(node),
                    disabled: !!$node.attr('disabled'),
                    value: $node.val()
                };
                break;

            case 'label':
                break;

            default:
                item = { type: 'html', html: $node.clone(true) };
                break;
        }

        if (item) {
            counter++;
            items['key' + counter] = item;
        }
    });

    return counter;
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (immutable) */ __webpack_exports__["a"] = inputLabel;
// find <label for="xyz">
function inputLabel(node) {
    return node.id && $('label[for="' + node.id + '"]').val() || node.name;
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
});