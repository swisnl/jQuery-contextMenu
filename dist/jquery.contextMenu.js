/*!
 * 
 * jQuery contextMenu v2.6.3 - Plugin for simple contextMenu handling
 * 
 * Version: v2.6.3
 * 
 * Authors: Björn Brala (SWIS.nl), Rodney Rehm, Addy Osmani (patches for FF)
 * 
 * Web: http://swisnl.github.io/jQuery-contextMenu/
 * 
 * Copyright (c) 2011-2017 SWIS BV and contributors
 * 
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 * 
 * Date: 2017-12-26T11:47:59.216Z
 * 
 * 
 */(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ContextMenu"] = factory();
	else
		root["ContextMenu"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _position = __webpack_require__(7);

exports.default = {
    selector: null,

    appendTo: null,

    trigger: 'right',

    autoHide: false,

    delay: 200,

    reposition: true,

    hideOnSecondTrigger: false,

    selectableSubMenu: false,

    className: '',

    classNames: {
        hover: 'context-menu-hover',
        disabled: 'context-menu-disabled',
        visible: 'context-menu-visible',
        notSelectable: 'context-menu-not-selectable',

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

    zIndex: 1,

    animation: {
        duration: 50,
        show: 'slideDown',
        hide: 'slideUp'
    },

    events: {
        show: $.noop,
        hide: $.noop,
        activated: $.noop
    },

    callback: null,

    items: {},

    build: false,

    types: {},

    determinePosition: _position.determinePosition,

    position: _position.position,

    positionSubmenu: _position.positionSubmenu
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(2);

var _ContextMenu = __webpack_require__(3);

var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

var _contextMenuFunction = __webpack_require__(10);

var _contextMenuFunction2 = _interopRequireDefault(_contextMenuFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var manager = new _ContextMenu2.default();

var contextMenu = function contextMenu(operation, options) {
    manager.execute(operation, options);
};

contextMenu.getInputValues = function (opt, data) {
    return manager.getInputValues(opt, data);
};
contextMenu.setInputValues = function (opt, data) {
    return manager.getInputValues(opt, data);
};
contextMenu.fromMenu = function (element) {
    return manager.html5builder.fromMenu(element);
};

contextMenu.defaults = manager.defaults;
contextMenu.types = manager.defaults.types;
contextMenu.manager = manager;

contextMenu.handle = manager.handler;
contextMenu.operations = manager.operations;
contextMenu.menus = manager.menus;
contextMenu.namespaces = manager.namespaces;

$.fn.contextMenu = _contextMenuFunction2.default;
$.contextMenu = contextMenu;

module.exports = _ContextMenu2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ContextMenuOperations = __webpack_require__(4);

var _ContextMenuOperations2 = _interopRequireDefault(_ContextMenuOperations);

var _defaults = __webpack_require__(0);

var _defaults2 = _interopRequireDefault(_defaults);

var _ContextMenuHtml5Builder = __webpack_require__(8);

var _ContextMenuHtml5Builder2 = _interopRequireDefault(_ContextMenuHtml5Builder);

var _ContextMenuEventHandler = __webpack_require__(9);

var _ContextMenuEventHandler2 = _interopRequireDefault(_ContextMenuEventHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContextMenu = function () {
    function ContextMenu() {
        _classCallCheck(this, ContextMenu);

        this.html5builder = new _ContextMenuHtml5Builder2.default();
        this.defaults = _defaults2.default;
        this.handler = new _ContextMenuEventHandler2.default();
        this.operations = new _ContextMenuOperations2.default();
        this.namespaces = {};
        this.initialized = false;
        this.menus = {};
        this.counter = 0;
    }

    _createClass(ContextMenu, [{
        key: 'execute',
        value: function execute(operation, options) {
            var _this = this;

            var normalizedArguments = this.normalizeArguments(operation, options);
            operation = normalizedArguments.operation;
            options = normalizedArguments.options;

            var o = $.extend(true, { manager: this }, this.defaults, options || {});
            var $document = $(document);
            var $context = $document;
            var _hasContext = false;

            if (!o.context || !o.context.length) {
                o.context = document;
            } else {
                $context = $(o.context).first();
                o.context = $context.get(0);
                _hasContext = !$(o.context).is($(document));
            }

            switch (operation) {
                case 'update':
                    if (_hasContext) {
                        this.operations.update(null, $context);
                    } else {
                        for (var menu in this.menus) {
                            if (this.menus.hasOwnProperty(menu)) {
                                this.operations.update(null, this.menus[menu]);
                            }
                        }
                    }
                    break;

                case 'create':
                    if (!o.selector) {
                        throw new Error('No selector specified');
                    }

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

                    if (!o.trigger) {
                        o.trigger = 'right';
                    }

                    if (!this.initialized) {
                        var itemClick = o.itemClickEvent === 'click' ? 'click.contextMenu' : 'mouseup.contextMenu';
                        var contextMenuItemObj = {
                            'contextmenu:focus.contextMenu': this.handler.focusItem,
                            'contextmenu:blur.contextMenu': this.handler.blurItem,
                            'contextmenu.contextMenu': this.handler.abortevent,
                            'mouseenter.contextMenu': this.handler.itemMouseenter,
                            'mouseleave.contextMenu': this.handler.itemMouseleave
                        };
                        contextMenuItemObj[itemClick] = this.handler.itemClick;

                        $document.on({
                            'contextmenu:hide.contextMenu': this.handler.hideMenu,
                            'prevcommand.contextMenu': this.handler.prevItem,
                            'nextcommand.contextMenu': this.handler.nextItem,
                            'contextmenu.contextMenu': this.handler.abortevent,
                            'mouseenter.contextMenu': this.handler.menuMouseenter,
                            'mouseleave.contextMenu': this.handler.menuMouseleave
                        }, '.context-menu-list').on('mouseup.contextMenu', '.context-menu-input', this.handler.inputClick).on(contextMenuItemObj, '.context-menu-item');

                        this.initialized = true;
                    }

                    $context.on('contextmenu' + o.ns, o.selector, o, this.handler.contextmenu);

                    if (_hasContext) {
                        $context.on('remove' + o.ns, function () {
                            $(this).contextMenu('destroy');
                        });
                    }

                    switch (o.trigger) {
                        case 'hover':
                            $context.on('mouseenter' + o.ns, o.selector, o, this.handler.mouseenter).on('mouseleave' + o.ns, o.selector, o, this.handler.mouseleave);
                            break;

                        case 'left':
                            $context.on('click' + o.ns, o.selector, o, this.handler.click);
                            break;
                        case 'touchstart':
                            $context.on('touchstart' + o.ns, o.selector, o, this.handler.click);
                            break;
                    }

                    if (!o.build) {
                        this.operations.create(null, o);
                    }
                    break;

                case 'destroy':
                    var $visibleMenu = void 0;
                    if (_hasContext) {
                        var context = o.context;

                        Object.keys(this.menus).forEach(function (ns) {
                            var o = _this.menus[ns];

                            if (!o) {
                                return true;
                            }

                            if (!$(context).is(o.selector)) {
                                return true;
                            }

                            $visibleMenu = $('.context-menu-list').filter(':visible');
                            if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is($(o.context).find(o.selector))) {
                                $visibleMenu.trigger('contextmenu:hide', { force: true });
                            }

                            if (_this.menus[o.ns].$menu) {
                                _this.menus[o.ns].$menu.remove();
                            }
                            delete _this.menus[o.ns];

                            $(o.context).off(o.ns);

                            return true;
                        });
                    } else if (!o.selector) {
                        $document.off('.contextMenu .contextMenuAutoHide');

                        Object.keys(this.menus).forEach(function (ns) {
                            var o = _this.menus[ns];
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

                        if (this.menus[this.namespaces[o.selector]].$menu) {
                            this.menus[this.namespaces[o.selector]].$menu.remove();
                        }
                        delete this.menus[this.namespaces[o.selector]];

                        $document.off(this.namespaces[o.selector]);
                    }
                    break;

                case 'html5':
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
    }, {
        key: 'normalizeArguments',
        value: function normalizeArguments(operation, options) {
            if (typeof operation !== 'string') {
                options = operation;
                operation = 'create';
            }

            if (typeof options === 'string') {
                options = { selector: options };
            } else if (typeof options === 'undefined') {
                options = {};
            }
            return { operation: operation, options: options };
        }
    }, {
        key: 'setInputValues',
        value: function setInputValues(opt, data) {
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
    }, {
        key: 'getInputValues',
        value: function getInputValues(opt, data) {
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
    }]);

    return ContextMenu;
}();

exports.default = ContextMenu;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ContextMenuHelper = __webpack_require__(5);

var _ContextMenuHelper2 = _interopRequireDefault(_ContextMenuHelper);

var _ContextMenuItemTypes = __webpack_require__(6);

var _ContextMenuItemTypes2 = _interopRequireDefault(_ContextMenuItemTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContextMenuOperations = function () {
    function ContextMenuOperations() {
        _classCallCheck(this, ContextMenuOperations);

        return this;
    }

    _createClass(ContextMenuOperations, [{
        key: 'show',
        value: function show(e, opt, x, y) {
            var $trigger = $(this);
            var css = {};

            $('#context-menu-layer').trigger('mousedown');

            opt.$trigger = $trigger;

            if (opt.events.show.call($trigger, e, opt) === false) {
                opt.manager.handler.$currentTrigger = null;
                return;
            }

            opt.manager.operations.update.call($trigger, e, opt);

            opt.position.call($trigger, e, opt, x, y);

            if (opt.zIndex) {
                var additionalZValue = opt.zIndex;

                if (typeof opt.zIndex === 'function') {
                    additionalZValue = opt.zIndex.call($trigger, opt);
                }
                css.zIndex = _ContextMenuHelper2.default.zindex($trigger) + additionalZValue;
            }

            opt.manager.operations.layer.call(opt.$menu, e, opt, css.zIndex);

            opt.$menu.find('ul').css('zIndex', css.zIndex + 1);

            opt.$menu.css(css)[opt.animation.show](opt.animation.duration, function () {
                $trigger.trigger('contextmenu:visible');

                opt.manager.operations.activated(e, opt);
                opt.events.activated($trigger, e, opt);
            });

            $trigger.data('contextMenu', opt).addClass('context-menu-active');

            $(document).off('keydown.contextMenu').on('keydown.contextMenu', opt, opt.manager.handler.key);

            if (opt.autoHide) {
                $(document).on('mousemove.contextMenuAutoHide', function (e) {
                    var pos = $trigger.offset();
                    pos.right = pos.left + $trigger.outerWidth();
                    pos.bottom = pos.top + $trigger.outerHeight();

                    if (opt.$layer && !opt.hovering && (!(e.pageX >= pos.left && e.pageX <= pos.right) || !(e.pageY >= pos.top && e.pageY <= pos.bottom))) {
                        setTimeout(function () {
                            if (!opt.hovering && opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                                opt.$menu.trigger('contextmenu:hide');
                            }
                        }, 50);
                    }
                });
            }
        }
    }, {
        key: 'hide',
        value: function hide(e, opt, force) {
            var $trigger = $(this);
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) !== 'object' && $trigger.data('contextMenu')) {
                opt = $trigger.data('contextMenu');
            } else if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) !== 'object') {
                return;
            }

            if (!force && opt.events && opt.events.hide.call($trigger, e, opt) === false) {
                return;
            }

            $trigger.removeData('contextMenu').removeClass('context-menu-active');

            if (opt.$layer) {
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

            opt.manager.handler.$currentTrigger = null;

            opt.$menu.find('.' + opt.classNames.hover).trigger('contextmenu:blur');
            opt.$selected = null;

            opt.$menu.find('.' + opt.classNames.visible).removeClass(opt.classNames.visible);

            $(document).off('.contextMenuAutoHide').off('keydown.contextMenu');

            if (opt.$menu) {
                opt.$menu[opt.animation.hide](opt.animation.duration, function () {
                    if (opt.build) {
                        opt.$menu.remove();
                        Object.keys(opt).forEach(function (key) {
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
        }
    }, {
        key: 'create',
        value: function create(e, opt, root) {
            if (typeof root === 'undefined') {
                root = opt;
            }

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
                var $name = $('<span></span>');
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

            $.each(opt.items, function (key, item) {
                var $t = $('<li class="context-menu-item"></li>').addClass(item.className || '');
                var $label = null;
                var $input = null;

                $t.on('click', $.noop);

                if (typeof item === 'string' || item.type === 'cm_seperator') {
                    item = { type: _ContextMenuItemTypes2.default.separator };
                }

                item.$node = $t.data({
                    'contextMenu': opt,
                    'contextMenuRoot': root,
                    'contextMenuKey': key
                });

                if (typeof item.accesskey !== 'undefined') {
                    var aks = _ContextMenuHelper2.default.splitAccesskey(item.accesskey);
                    for (var i = 0, ak; ak = aks[i]; i++) {
                        if (!root.accesskeys[ak]) {
                            root.accesskeys[ak] = item;
                            var matched = item.name.match(new RegExp('^(.*?)(' + ak + ')(.*)$', 'i'));
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
                    root.types[item.type].call($t, item, opt, root);

                    $.each([opt, root], function (i, k) {
                        k.commands[key] = item;

                        if ($.isFunction(item.callback) && (typeof k.callbacks[key] === 'undefined' || typeof opt.type === 'undefined')) {
                            k.callbacks[key] = item.callback;
                        }
                    });
                } else {
                    if (item.type === _ContextMenuItemTypes2.default.separator) {
                        $t.addClass('context-menu-separator ' + root.classNames.notSelectable);
                    } else if (item.type === _ContextMenuItemTypes2.default.html) {
                        $t.addClass('context-menu-html ' + root.classNames.notSelectable);
                    } else if (item.type && item.type !== _ContextMenuItemTypes2.default.submenu) {
                        $label = $('<label></label>').appendTo($t);
                        createNameNode(item).appendTo($label);

                        $t.addClass('context-menu-input');
                        opt.hasTypes = true;
                        $.each([opt, root], function (i, k) {
                            k.commands[key] = item;
                            k.inputs[key] = item;
                        });
                    } else if (item.items) {
                        item.type = _ContextMenuItemTypes2.default.submenu;
                    }

                    switch (item.type) {
                        case _ContextMenuItemTypes2.default.separator:
                            break;

                        case _ContextMenuItemTypes2.default.text:
                            $input = $('<input type="text" value="1" name="" />').attr('name', 'context-menu-input-' + key).val(item.value || '').appendTo($label);
                            break;

                        case _ContextMenuItemTypes2.default.textarea:
                            $input = $('<textarea name=""></textarea>').attr('name', 'context-menu-input-' + key).val(item.value || '').appendTo($label);

                            if (item.height) {
                                $input.height(item.height);
                            }
                            break;

                        case _ContextMenuItemTypes2.default.checkbox:
                            $input = $('<input type="checkbox" value="1" name="" />').attr('name', 'context-menu-input-' + key).val(item.value || '').prop('checked', !!item.selected).prependTo($label);
                            break;

                        case _ContextMenuItemTypes2.default.radio:
                            $input = $('<input type="radio" value="1" name="" />').attr('name', 'context-menu-input-' + item.radio).val(item.value || '').prop('checked', !!item.selected).prependTo($label);
                            break;

                        case _ContextMenuItemTypes2.default.select:
                            $input = $('<select name=""></select>').attr('name', 'context-menu-input-' + key).appendTo($label);
                            if (item.options) {
                                $.each(item.options, function (value, text) {
                                    $('<option></option>').val(value).text(text).appendTo($input);
                                });
                                $input.val(item.selected);
                            }
                            break;

                        case _ContextMenuItemTypes2.default.submenu:
                            createNameNode(item).appendTo($t);
                            item.appendTo = item.$node;
                            $t.data('contextMenu', item).addClass('context-menu-submenu');
                            item.callback = null;

                            if (typeof item.items.then === 'function') {
                                root.manager.operations.processPromises(e, item, root, item.items);
                            } else {
                                root.manager.operations.create(e, item, root);
                            }
                            break;

                        case _ContextMenuItemTypes2.default.html:
                            $(item.html).appendTo($t);
                            break;

                        default:
                            $.each([opt, root], function (i, k) {
                                k.commands[key] = item;

                                if ($.isFunction(item.callback) && (typeof k.callbacks[key] === 'undefined' || typeof opt.type === 'undefined')) {
                                    k.callbacks[key] = item.callback;
                                }
                            });
                            createNameNode(item).appendTo($t);
                            break;
                    }

                    if (item.type && item.type !== _ContextMenuItemTypes2.default.submenu && item.type !== _ContextMenuItemTypes2.default.html && item.type !== _ContextMenuItemTypes2.default.separator) {
                        $input.on('focus', root.manager.handler.focusInput).on('blur', root.manager.handler.blurInput);

                        if (item.events) {
                            $input.on(item.events, opt);
                        }
                    }

                    if (item.icon) {
                        if ($.isFunction(item.icon)) {
                            item._icon = item.icon.call(this, e, $t, key, item, opt, root);
                        } else {
                            if (typeof item.icon === 'string' && item.icon.substring(0, 3) === 'fa-') {
                                item._icon = root.classNames.icon + ' ' + root.classNames.icon + '--fa fa ' + item.icon;
                            } else {
                                item._icon = root.classNames.icon + ' ' + root.classNames.icon + '-' + item.icon;
                            }
                        }
                        $t.addClass(item._icon);
                    }
                }

                item.$input = $input;
                item.$label = $label;

                $t.appendTo(opt.$menu);

                if (!opt.hasTypes && $.support.eventSelectstart) {
                    $t.on('selectstart.disableTextSelect', opt.manager.handler.abortevent);
                }
            });

            if (!opt.$node) {
                opt.$menu.css('display', 'none').addClass('context-menu-root');
            }
            opt.$menu.appendTo(opt.appendTo || document.body);
        }
    }, {
        key: 'resize',
        value: function resize(e, $menu, nested) {
            var domMenu = void 0;

            $menu.css({ position: 'absolute', display: 'block' });

            $menu.data('width', (domMenu = $menu.get(0)).getBoundingClientRect ? Math.ceil(domMenu.getBoundingClientRect().width) : $menu.outerWidth() + 1);
            $menu.css({
                position: 'static',
                minWidth: '0px',
                maxWidth: '100000px'
            });

            $menu.find('> li > ul').each(function (index, element) {
                e.data.manager.operations.resize(e, $(element), true);
            });

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
    }, {
        key: 'update',
        value: function update(e, opt, root) {
            var $trigger = this;
            if (typeof root === 'undefined') {
                root = opt;
                root.manager.operations.resize(e, opt.$menu);
            }

            opt.$menu.children().each(function (index, element) {
                var $item = $(element);
                var key = $item.data('contextMenuKey');
                var item = opt.items[key];

                var disabled = $.isFunction(item.disabled) && item.disabled.call($trigger, e, key, opt, root) || item.disabled === true;
                var visible = void 0;

                if ($.isFunction(item.visible)) {
                    visible = item.visible.call($trigger, e, key, opt, root);
                } else if (typeof item.visible !== 'undefined') {
                    visible = item.visible === true;
                } else {
                    visible = true;
                }
                $item[visible ? 'show' : 'hide']();

                $item[disabled ? 'addClass' : 'removeClass'](root.classNames.disabled);

                if ($.isFunction(item.icon)) {
                    $item.removeClass(item._icon);
                    item._icon = item.icon.call(this, $trigger, $item, key, item);
                    $item.addClass(item._icon);
                }

                if (item.type) {
                    $item.find('input, select, textarea').prop('disabled', disabled);

                    switch (item.type) {
                        case _ContextMenuItemTypes2.default.text:
                        case _ContextMenuItemTypes2.default.textarea:
                            item.$input.val(item.value || '');
                            break;

                        case _ContextMenuItemTypes2.default.checkbox:
                        case _ContextMenuItemTypes2.default.radio:
                            item.$input.val(item.value || '').prop('checked', !!item.selected);
                            break;

                        case _ContextMenuItemTypes2.default.select:
                            item.$input.val((item.selected === 0 ? '0' : item.selected) || '');
                            break;
                    }
                }

                if (item.$menu) {
                    root.manager.operations.update.call($trigger, e, item, root);
                }
            });
        }
    }, {
        key: 'layer',
        value: function layer(e, opt, zIndex) {
            var $window = $(window);

            var $layer = opt.$layer = $('<div id="context-menu-layer"></div>').css({
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
            }).data('contextMenuRoot', opt).insertBefore(this).on('contextmenu', opt.manager.handler.abortevent).on('mousedown', opt.manager.handler.layerClick);

            if (typeof document.body.style.maxWidth === 'undefined') {
                $layer.css({
                    'position': 'absolute',
                    'height': $(document).height()
                });
            }

            return $layer;
        }
    }, {
        key: 'processPromises',
        value: function processPromises(e, opt, root, promise) {
            opt.$node.addClass(root.classNames.iconLoadingClass);

            function finishPromiseProcess(opt, root, items) {
                if (typeof root.$menu === 'undefined' || !root.$menu.is(':visible')) {
                    return;
                }
                opt.$node.removeClass(root.classNames.iconLoadingClass);
                opt.items = items;
                root.manager.operations.create(e, opt, root);
                root.manager.operations.update(e, opt, root);
                root.positionSubmenu.call(opt.$node, e, opt.$menu);
            }

            function errorPromise(opt, root, errorItem) {
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
                    errorItem = { 'error': { name: errorItem } };
                }
                finishPromiseProcess(opt, root, errorItem);
            }

            function completedPromise(opt, root, items) {
                if (typeof items === 'undefined') {
                    errorPromise(undefined);
                }
                finishPromiseProcess(opt, root, items);
            }

            promise.then(completedPromise.bind(this, opt, root), errorPromise.bind(this, opt, root));
        }
    }, {
        key: 'activated',
        value: function activated(e, opt) {
            var $menu = opt.$menu;
            var $menuOffset = $menu.offset();
            var winHeight = $(window).height();
            var winScrollTop = $(window).scrollTop();
            var menuHeight = $menu.height();
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
    }]);

    return ContextMenuOperations;
}();

exports.default = ContextMenuOperations;
;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContextMenuHelper = function () {
    function ContextMenuHelper() {
        _classCallCheck(this, ContextMenuHelper);
    }

    _createClass(ContextMenuHelper, null, [{
        key: 'zindex',
        value: function zindex($t) {
            var zin = 0;
            var $tt = $t;

            while (true) {
                zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
                $tt = $tt.parent();
                if (!$tt || !$tt.length || 'html body'.indexOf($tt.prop('nodeName').toLowerCase()) > -1) {
                    break;
                }
            }
            return zin;
        }
    }, {
        key: 'splitAccesskey',
        value: function splitAccesskey(val) {
            var t = val.split(/\s+/);
            var keys = [];

            for (var i = 0, k; k = t[i]; i++) {
                k = k.charAt(0).toUpperCase();
                keys.push(k);
            }

            return keys;
        }
    }]);

    return ContextMenuHelper;
}();

exports.default = ContextMenuHelper;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var ContextMenuItemTypes = {
  simple: '',

  text: 'text',

  textarea: 'textarea',

  checkbox: 'checkbox',

  radio: 'radio',

  select: 'select',

  html: 'html',

  separator: 'cm_separator',

  submenu: 'sub'
};

exports.default = ContextMenuItemTypes;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.determinePosition = determinePosition;
exports.position = position;
exports.positionSubmenu = positionSubmenu;
function determinePosition($menu) {
    if ($.ui && $.ui.position) {
        $menu.css('display', 'block').position({
            my: 'center top',
            at: 'center bottom',
            of: this,
            offset: '0 5',
            collision: 'fit'
        }).css('display', 'none');
    } else {
        var offset = this.offset();
        offset.top += this.outerHeight();
        offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
        $menu.css(offset);
    }
}

function position(e, opt, x, y) {
    var $window = $(window);
    var offset = void 0;

    if (!x && !y) {
        opt.determinePosition.call(this, opt.$menu);
        return;
    } else if (x === 'maintain' && y === 'maintain') {
        offset = opt.$menu.position();
    } else {
        var offsetParentOffset = opt.$menu.offsetParent().offset();
        offset = { top: y - offsetParentOffset.top, left: x - offsetParentOffset.left };
    }

    var bottom = $window.scrollTop() + $window.height();
    var right = $window.scrollLeft() + $window.width();
    var height = opt.$menu.outerHeight();
    var width = opt.$menu.outerWidth();

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
}

function positionSubmenu(e, $menu) {
    if (typeof $menu === 'undefined') {
        return;
    }
    if ($.ui && $.ui.position) {
        $menu.css('display', 'block').position({
            my: 'left top-5',
            at: 'right top',
            of: this,
            collision: 'flipfit fit'
        }).css('display', '');
    } else {
        var offset = {
            top: -9,
            left: this.outerWidth() - 5
        };
        $menu.css(offset);
    }
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContextMenuHtml5Builder = function () {
    function ContextMenuHtml5Builder() {
        _classCallCheck(this, ContextMenuHtml5Builder);
    }

    _createClass(ContextMenuHtml5Builder, [{
        key: 'inputLabel',
        value: function inputLabel(node) {
            return node.id && $('label[for="' + node.id + '"]').val() || node.name;
        }
    }, {
        key: 'fromMenu',
        value: function fromMenu(element) {
            var $this = $(element);
            var items = {};

            this.build(items, $this.children());

            return items;
        }
    }, {
        key: 'build',
        value: function build(items, $children, counter) {
            if (!counter) {
                counter = 0;
            }

            $children.each(function () {
                var $node = $(this);
                var node = this;
                var nodeName = this.nodeName.toLowerCase();
                var label = void 0;
                var item = void 0;

                if (nodeName === 'label' && $node.find('input, textarea, select').length) {
                    label = $node.text();
                    $node = $node.children().first();
                    node = $node.get(0);
                    nodeName = node.nodeName.toLowerCase();
                }

                switch (nodeName) {
                    case 'menu':
                        item = { name: $node.attr('label'), items: {} };
                        counter = this.html5builder(item.items, $node.children(), counter);
                        break;

                    case 'a':
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
                                    name: label || this.inputLabel(node),
                                    disabled: !!$node.attr('disabled'),
                                    value: $node.val()
                                };
                                break;

                            case 'checkbox':
                                item = {
                                    type: 'checkbox',
                                    name: label || this.inputLabel(node),
                                    disabled: !!$node.attr('disabled'),
                                    selected: !!$node.attr('checked')
                                };
                                break;

                            case 'radio':
                                item = {
                                    type: 'radio',
                                    name: label || this.inputLabel(node),
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
                            name: label || this.inputLabel(node),
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
                            name: label || this.inputLabel(node),
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
    }]);

    return ContextMenuHtml5Builder;
}();

exports.default = ContextMenuHtml5Builder;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _defaults = __webpack_require__(0);

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContextMenuEventHandler = function () {
    function ContextMenuEventHandler() {
        _classCallCheck(this, ContextMenuEventHandler);

        this.$currentTrigger = null;
        this.hoveract = {};
    }

    _createClass(ContextMenuEventHandler, [{
        key: 'abortevent',
        value: function abortevent(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, {
        key: 'contextmenu',
        value: function contextmenu(e) {
            var $this = $(e.currentTarget);

            if (e.data.trigger === 'right') {
                e.preventDefault();
                e.stopImmediatePropagation();
            }

            if (e.data.trigger !== 'right' && e.data.trigger !== 'demand' && e.originalEvent) {
                return;
            }

            if (typeof e.mouseButton !== 'undefined' && e.data) {
                if (!(e.data.trigger === 'left' && e.mouseButton === 0) && !(e.data.trigger === 'right' && e.mouseButton === 2)) {
                    return;
                }
            }

            if ($this.hasClass('context-menu-active')) {
                return;
            }

            if (!$this.hasClass('context-menu-disabled')) {

                e.data.manager.handler.$currentTrigger = $this;
                if (e.data.build) {
                    var built = e.data.build(e, $this);

                    if (built === false) {
                        return;
                    }

                    e.data = $.extend(true, {}, _defaults2.default, e.data, built || {});

                    if (!e.data.items || $.isEmptyObject(e.data.items)) {
                        if (window.console) {
                            (console.error || console.log).call(console, 'No items specified to show in contextMenu');
                        }

                        throw new Error('No Items specified');
                    }

                    e.data.$trigger = e.data.manager.handler.$currentTrigger;

                    e.data.manager.operations.create(e, e.data);
                }
                var showMenu = false;
                for (var item in e.data.items) {
                    if (e.data.items.hasOwnProperty(item)) {
                        var visible = void 0;
                        if ($.isFunction(e.data.items[item].visible)) {
                            visible = e.data.items[item].visible.call($this, e, item, e.data, e.data);
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
                    e.data.manager.operations.show.call($this, e, e.data, e.pageX, e.pageY);
                }
            }
        }
    }, {
        key: 'click',
        value: function click(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $(this).trigger($.Event('contextmenu', { data: e.data, pageX: e.pageX, pageY: e.pageY, originalEvent: e }));
        }
    }, {
        key: 'mousedown',
        value: function mousedown(e) {
            var $this = $(this);

            if (e.data.manager.handler.$currentTrigger && e.data.manager.handler.$currentTrigger.length && !e.data.manager.handler.$currentTrigger.is($this)) {
                e.data.manager.handler.$currentTrigger.data('contextMenu').$menu.trigger($.Event('contextmenu', { originalEvent: e }));
            }

            if (e.button === 2) {
                e.data.manager.handler.$currentTrigger = $this.data('contextMenuActive', true);
            }
        }
    }, {
        key: 'mouseup',
        value: function mouseup(e) {
            var $this = $(this);
            if ($this.data('contextMenuActive') && e.data.manager.handler.$currentTrigger && e.data.manager.handler.$currentTrigger.length && e.data.manager.handler.$currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.data.manager.handler.$currentTrigger = $this;
                $this.trigger($.Event('contextmenu', { data: e.data, pageX: e.pageX, pageY: e.pageY, originalEvent: e }));
            }

            $this.removeData('contextMenuActive');
        }
    }, {
        key: 'mouseenter',
        value: function mouseenter(e) {
            var $this = $(this);
            var $related = $(e.relatedTarget);
            var $document = $(document);

            if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                return;
            }

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
    }, {
        key: 'mousemove',
        value: function mousemove(e) {
            e.data.manager.handler.hoveract.pageX = e.pageX;
            e.data.manager.handler.hoveract.pageY = e.pageY;
        }
    }, {
        key: 'mouseleave',
        value: function mouseleave(e) {
            var $related = $(e.relatedTarget);
            if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                return;
            }

            try {
                clearTimeout(e.data.manager.handler.hoveract.timer);
            } catch (e) {}

            e.data.manager.handler.hoveract.timer = null;
        }
    }, {
        key: 'layerClick',
        value: function layerClick(e) {
            var $this = $(this);
            var root = $this.data('contextMenuRoot');
            var button = e.button;
            var x = e.pageX;
            var y = e.pageY;
            var target = void 0;
            var offset = void 0;

            e.preventDefault();

            setTimeout(function () {
                var $window = $(window);
                var triggerAction = root.trigger === 'left' && button === 0 || root.trigger === 'right' && button === 2;

                if (document.elementFromPoint && root.$layer) {
                    root.$layer.hide();
                    target = document.elementFromPoint(x - $window.scrollLeft(), y - $window.scrollTop());

                    if (target.isContentEditable) {
                        var range = document.createRange();
                        var sel = window.getSelection();
                        range.selectNode(target);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    $(target).trigger(e);
                    root.$layer.show();
                }

                if (root.hideOnSecondTrigger && triggerAction && root.$menu !== null && typeof root.$menu !== 'undefined') {
                    root.$menu.trigger('contextmenu:hide', { originalEvent: e });
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
                        var _$window = $(window);

                        offset.top += _$window.scrollTop();
                        if (offset.top <= e.pageY) {
                            offset.left += _$window.scrollLeft();
                            if (offset.left <= e.pageX) {
                                offset.bottom = offset.top + root.$trigger.outerHeight();
                                if (offset.bottom >= e.pageY) {
                                    offset.right = offset.left + root.$trigger.outerWidth();
                                    if (offset.right >= e.pageX) {
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
                        $(target).contextMenu({ x: x, y: y, button: button, originalEvent: e });
                    });
                }

                if (root !== null && typeof root !== 'undefined' && root.$menu !== null && typeof root.$menu !== 'undefined') {
                    root.$menu.trigger('contextmenu:hide', { originalEvent: e });
                }
            }, 50);
        }
    }, {
        key: 'keyStop',
        value: function keyStop(e, opt) {
            if (!opt.isInput) {
                e.preventDefault();
            }

            e.stopPropagation();
        }
    }, {
        key: 'key',
        value: function key(e) {
            var opt = {};

            if (e.data.manager.handler.$currentTrigger) {
                opt = e.data.manager.handler.$currentTrigger.data('contextMenu') || {};
            }

            if (typeof opt.zIndex === 'undefined') {
                opt.zIndex = 0;
            }
            var getZIndexOfTriggerTarget = function getZIndexOfTriggerTarget(target) {
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
            var targetZIndex = getZIndexOfTriggerTarget(e.target);

            if (opt.$menu && parseInt(targetZIndex, 10) > parseInt(opt.$menu.css('zIndex'), 10)) {
                return;
            }
            switch (e.keyCode) {
                case 9:
                case 38:
                    e.data.manager.handler.keyStop(e, opt);

                    if (opt.isInput) {
                        if (e.keyCode === 9 && e.shiftKey) {
                            e.preventDefault();
                            if (opt.$selected) {
                                opt.$selected.find('input, textarea, select').blur();
                            }
                            if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                                opt.$menu.trigger('prevcommand', { originalEvent: e });
                            }
                            return;
                        } else if (e.keyCode === 38 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                            e.preventDefault();
                            return;
                        }
                    } else if (e.keyCode !== 9 || e.shiftKey) {
                        if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                            opt.$menu.trigger('prevcommand', { originalEvent: e });
                        }
                        return;
                    }
                    break;

                case 40:
                    e.data.manager.handler.keyStop(e, opt);
                    if (opt.isInput) {
                        if (e.keyCode === 9) {
                            e.preventDefault();
                            if (opt.$selected) {
                                opt.$selected.find('input, textarea, select').blur();
                            }
                            if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                                opt.$menu.trigger('nextcommand', { originalEvent: e });
                            }
                            return;
                        } else if (e.keyCode === 40 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                            e.preventDefault();
                            return;
                        }
                    } else {
                        if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                            opt.$menu.trigger('nextcommand', { originalEvent: e });
                        }
                        return;
                    }
                    break;

                case 37:
                    e.data.manager.handler.keyStop(e, opt);
                    if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                        break;
                    }

                    if (!opt.$selected.parent().hasClass('context-menu-root')) {
                        var $parent = opt.$selected.parent().parent();
                        opt.$selected.trigger('contextmenu:blur', { originalEvent: e });
                        opt.$selected = $parent;
                        return;
                    }
                    break;

                case 39:
                    e.data.manager.handler.keyStop(e, opt);
                    if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                        break;
                    }

                    var itemdata = opt.$selected.data('contextMenu') || {};
                    if (itemdata.$menu && opt.$selected.hasClass('context-menu-submenu')) {
                        opt.$selected = null;
                        itemdata.$selected = null;
                        itemdata.$menu.trigger('nextcommand', { originalEvent: e });
                        return;
                    }
                    break;

                case 35:
                case 36:
                    if (opt.$selected && opt.$selected.find('input, textarea, select').length) {
                        break;
                    } else {
                        (opt.$selected && opt.$selected.parent() || opt.$menu).children(':not(.' + opt.classNames.disabled + ', .' + opt.classNames.notSelectable + ')')[e.keyCode === 36 ? 'first' : 'last']().trigger('contextmenu:focus', { originalEvent: e });
                        e.preventDefault();
                        break;
                    }
                case 13:
                    e.data.manager.handler.keyStop(e, opt);
                    if (opt.isInput) {
                        if (opt.$selected && !opt.$selected.is('textarea, select')) {
                            e.preventDefault();
                            return;
                        }
                        break;
                    }
                    if (typeof opt.$selected !== 'undefined' && opt.$selected !== null) {
                        opt.$selected.trigger('mouseup', { originalEvent: e });
                    }
                    return;
                case 32:
                case 33:
                case 34:
                    e.data.manager.handler.keyStop(e, opt);
                    return;

                case 27:
                    e.data.manager.handler.keyStop(e, opt);
                    if (opt.$menu !== null && typeof opt.$menu !== 'undefined') {
                        opt.$menu.trigger('contextmenu:hide', { originalEvent: e });
                    }
                    return;

                default:
                    var k = String.fromCharCode(e.keyCode).toUpperCase();
                    if (opt.accesskeys && opt.accesskeys[k]) {
                        opt.accesskeys[k].$node.trigger(opt.accesskeys[k].$menu ? 'contextmenu:focus' : 'mouseup', { originalEvent: e });
                        return;
                    }
                    break;
            }

            e.stopPropagation();
            if (typeof opt.$selected !== 'undefined' && opt.$selected !== null) {
                opt.$selected.trigger(e);
            }
        }
    }, {
        key: 'prevItem',
        value: function prevItem(e) {
            e.stopPropagation();
            var opt = $(this).data('contextMenu') || {};
            var root = $(this).data('contextMenuRoot') || {};

            if (opt.$selected) {
                var $s = opt.$selected;
                opt = opt.$selected.parent().data('contextMenu') || {};
                opt.$selected = $s;
            }

            var $children = opt.$menu.children();
            var $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev();
            var $round = $prev;

            while ($prev.hasClass(root.classNames.disabled) || $prev.hasClass(root.classNames.notSelectable) || $prev.is(':hidden')) {
                if ($prev.prev().length) {
                    $prev = $prev.prev();
                } else {
                    $prev = $children.last();
                }

                if ($prev.is($round)) {
                    return;
                }
            }

            if (opt.$selected) {
                root.manager.handler.itemMouseleave.call(opt.$selected.get(0), e);
            }

            root.manager.handler.itemMouseenter.call($prev.get(0), e);

            var $input = $prev.find('input, textarea, select');
            if ($input.length) {
                $input.focus();
            }
        }
    }, {
        key: 'nextItem',
        value: function nextItem(e) {
            e.stopPropagation();
            var opt = $(this).data('contextMenu') || {};
            var root = $(this).data('contextMenuRoot') || {};

            if (opt.$selected) {
                var $s = opt.$selected;
                opt = opt.$selected.parent().data('contextMenu') || {};
                opt.$selected = $s;
            }

            var $children = opt.$menu.children();
            var $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next();
            var $round = $next;

            while ($next.hasClass(root.classNames.disabled) || $next.hasClass(root.classNames.notSelectable) || $next.is(':hidden')) {
                if ($next.next().length) {
                    $next = $next.next();
                } else {
                    $next = $children.first();
                }
                if ($next.is($round)) {
                    return;
                }
            }

            if (opt.$selected) {
                root.manager.handler.itemMouseleave.call(opt.$selected.get(0), e);
            }

            root.manager.handler.itemMouseenter.call($next.get(0), e);

            var $input = $next.find('input, textarea, select');
            if ($input.length) {
                $input.focus();
            }
        }
    }, {
        key: 'focusInput',
        value: function focusInput(e) {
            var $this = $(this).closest('.context-menu-item');
            var data = $this.data();
            var opt = data.contextMenu;
            var root = data.contextMenuRoot;

            root.$selected = opt.$selected = $this;
            root.isInput = opt.isInput = true;
        }
    }, {
        key: 'blurInput',
        value: function blurInput(e) {
            var $this = $(this).closest('.context-menu-item');
            var data = $this.data();
            var opt = data.contextMenu;
            var root = data.contextMenuRoot;

            root.isInput = opt.isInput = false;
        }
    }, {
        key: 'menuMouseenter',
        value: function menuMouseenter(e) {
            var root = $(this).data().contextMenuRoot;
            root.hovering = true;
        }
    }, {
        key: 'menuMouseleave',
        value: function menuMouseleave(e) {
            var root = $(this).data().contextMenuRoot;
            if (root.$layer && root.$layer.is(e.relatedTarget)) {
                root.hovering = false;
            }
        }
    }, {
        key: 'itemMouseenter',
        value: function itemMouseenter(e) {
            var $this = $(this);
            var data = $this.data();
            var opt = data.contextMenu;
            var root = data.contextMenuRoot;

            root.hovering = true;

            if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }

            (opt.$menu ? opt : root).$menu.children('.' + root.classNames.hover).trigger('contextmenu:blur').children('.hover').trigger('contextmenu:blur', { originalEvent: e });

            if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
                opt.$selected = null;
                return;
            }

            $this.trigger('contextmenu:focus', { originalEvent: e });
        }
    }, {
        key: 'itemMouseleave',
        value: function itemMouseleave(e) {
            var $this = $(this);
            var data = $this.data();
            var opt = data.contextMenu;
            var root = data.contextMenuRoot;

            if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
                if (typeof root.$selected !== 'undefined' && root.$selected !== null) {
                    root.$selected.trigger('contextmenu:blur', { originalEvent: e });
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
    }, {
        key: 'itemClick',
        value: function itemClick(e) {
            var $this = $(this);
            var data = $this.data();
            var opt = data.contextMenu;
            var root = data.contextMenuRoot;
            var key = data.contextMenuKey;
            var callback = void 0;

            if (!opt.items[key] || $this.is('.' + root.classNames.disabled + ', .context-menu-separator, .' + root.classNames.notSelectable) || $this.is('.context-menu-submenu') && root.selectableSubMenu === false) {
                return;
            }

            e.preventDefault();
            e.stopImmediatePropagation();

            if ($.isFunction(opt.callbacks[key]) && Object.prototype.hasOwnProperty.call(opt.callbacks, key)) {
                callback = opt.callbacks[key];
            } else if ($.isFunction(root.callback)) {
                callback = root.callback;
            } else {
                return;
            }

            if (callback.call(root.$trigger, e, key, opt, root) !== false) {
                root.$menu.trigger('contextmenu:hide');
            } else if (root.$menu.parent().length) {
                root.manager.operations.update.call(root.$trigger, e, root);
            }
        }
    }, {
        key: 'inputClick',
        value: function inputClick(e) {
            e.stopImmediatePropagation();
        }
    }, {
        key: 'hideMenu',
        value: function hideMenu(e, data) {
            var root = $(this).data('contextMenuRoot');
            root.manager.operations.hide.call(root.$trigger, e, root, data && data.force);
        }
    }, {
        key: 'focusItem',
        value: function focusItem(e) {
            e.stopPropagation();
            var $this = $(this);
            var data = $this.data();
            var opt = data.contextMenu;
            var root = data.contextMenuRoot;

            if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
                return;
            }

            $this.addClass([root.classNames.hover, root.classNames.visible].join(' ')).parent().find('.context-menu-item').not($this).removeClass(root.classNames.visible).filter('.' + root.classNames.hover).trigger('contextmenu:blur');

            opt.$selected = root.$selected = $this;

            if (opt && opt.$node && opt.$node.hasClass('context-menu-submenu')) {
                opt.$node.addClass(root.classNames.hover);
            }

            if (opt.$node) {
                root.positionSubmenu.call(opt.$node, e, opt.$menu);
            }
        }
    }, {
        key: 'blurItem',
        value: function blurItem(e) {
            e.stopPropagation();
            var $this = $(this);
            var data = $this.data();
            var opt = data.contextMenu;
            var root = data.contextMenuRoot;

            if (root.autoHide) {
                $this.removeClass(root.classNames.visible);
            }
            $this.removeClass(root.classNames.hover);
            opt.$selected = null;
        }
    }]);

    return ContextMenuEventHandler;
}();

exports.default = ContextMenuEventHandler;
;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (operation) {
    var $t = this;
    var $o = operation;
    if ($t.length > 0) {
        if (typeof operation === 'undefined') {
            $t.first().trigger('contextmenu');
        } else if (typeof operation.x !== 'undefined' && typeof operation.y !== 'undefined') {
            $t.first().trigger($.Event('contextmenu', {
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
            $.contextMenu('destroy', { context: this });
        } else if ($.isPlainObject(operation)) {
            operation.context = this;
            $.contextMenu('create', operation);
        } else if (operation) {
            $t.removeClass('context-menu-disabled');
        } else if (!operation) {
            $t.addClass('context-menu-disabled');
        }
    } else {
        $.each($.contextMenu.menus, function () {
            if (this.selector === $t.selector) {
                $o.data = this;

                $.extend($o.data, { trigger: 'demand' });
            }
        });

        $.contextMenu.handle.contextmenu.call($o.target, $o);
    }

    return this;
};

/***/ })
/******/ ]);
});