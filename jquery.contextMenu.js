/*
 * jQuery contextMenu - Plugin for simple contextMenu handling
 * 
 * Authors: Rodney Rehm
 * Web: http://medialize.github.com/jQuery-contextMenu/
 * 
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 */

/**********************************************************************************
 * INITIALIZE EXAMPLES:
 **********************************************************************************
 * 	$.contextMenu({ selector: ".element-to-add-contextMenu-to", items: { … } })
 **********************************************************************************
 */

(function($, undefined){
	
	// TODO
		// checkbox-style items
		// fold-out (sub-) menus
		// custom trigger event ("delayed hover", "left click", …)

var // currently active contextMenu trigger
	$currentTrigger = null,
	// is contextMenuFoo initialized with at least one menu?
	initialized = false,
	// number of registered menus
	counter = 0,
	// mapping selector to namespace
	namespaces = {},
	// mapping namespace to options
	menus = {},
	// default values
	defaults = {
		// selector of contextMenu trigger
		selector: null,
		// show hide animation settings
		animation: {
			duration: 50,
			show: 'slideDown',
			hide: 'slideUp'
		},
		// events
		events: {
			show: $.noop,
			hide: $.noop
		},
		// list of contextMenu items
		items: {}
	},
	// escape special html characters
	htmlspecialchars = function(str) {
		return (str + "")
			.replace('"', '&quot;')
			.replace('<', '&lt;')
			.replace('>', '&gt;')
			.replace('&', '&amp;');
	},
	// event handlers
	handle = {
		// abort anything
		abortevent: function(e){ return false; },
		// disable native contextmenu
		contextmenu: function(e) {
			// disable actual context-menu
			var $this = $(this);
			if (!$this.hasClass('context-menu-disabled')) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		},
		// contextMenu mousedown
		mousedown: function(e) {
			// register mouse down
			var $this = $(this);
			
			// hide any previous menus
			if ($currentTrigger && $currentTrigger.length && !$currentTrigger.is($this)) {
				op.hide.call($currentTrigger, undefined);
				$currentTrigger = null;
			}
			
			// activate on right click
			if (e.button == 2) {
				$currentTrigger = $this.data('contextMenuActive', true);
			}
		},
		// contextMenu mouseup
		mouseup: function(e) {
			// show menu
			var $this = $(this);
			if ($this.data('contextMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
				e.stopPropagation();
				e.stopImmediatePropagation();
				e.preventDefault();
				$currentTrigger = $this;
				op.show.call($this, e.data, e.pageX, e.pageY);
			}
			
			$this.removeData('contextMenuActive');
		},
		// document.body mouseup
		mouseupKill: function(e) {
			// hide current menu
			if ($(e.target).is('.context-menu-item') || $(e.currentTarget).is('.context-menu-item')) {
				return;
			}
			if ($currentTrigger) {
				op.hide.call($currentTrigger, undefined);
				$currentTrigger = null;
			}
		},
		// :hover done manually so key handling is possible
		mouseenter: function(e) {
			var $this = $(this),
				opt = $this.closest('.context-menu-list').data('contextMenuFoo') || {};

			opt.$selected = $this;
			$this.addClass('hover');
		},
		// :hover done manually so key handling is possible
		mouseleave: function(e) {
			var $this = $(this),
				opt = $this.closest('.context-menu-list').data('contextMenuFoo') || {};

			opt.$selected = null;
			$this.removeClass('hover');
		},
		// key handled :hover
		key: function(e) {
			var opt = $currentTrigger.data('contextMenuFoo') || {},
				$children = opt.$menu.children(),
				$round;
			
			// disable key listener for menus with input elements
			if (opt.hasTypes) {
				return;
			}
			
			e.preventDefault();
			e.stopPropagation();

			switch( e.keyCode ) {
				case 38: // up
					var $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev();
					$round = $prev;
					
					// skip disabled
					while ($prev.hasClass('disabled')) {
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
						handle.mouseleave.call(opt.$selected.get(0), e);
					}
					
					// activate next
					handle.mouseenter.call($prev.get(0), e);
					break;
					
				case 40: // down
					var $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next();
					$round = $next;
					
					// skip disabled
					while ($next.hasClass('disabled')) {
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
						handle.mouseleave.call(opt.$selected.get(0), e);
					}
					
					// activate next
					handle.mouseenter.call($next.get(0), e);
					break;

				case 13: // enter
					opt.$selected && opt.$selected.trigger('click');
					break;
				
				case 27: // esc
					op.hide.call($currentTrigger, undefined);
					$currentTrigger = null;
					break;
			}
		},
		// contextMenu item click
		click: function(e) {
			var $this = $(this),
				opt = $this.closest('.context-menu-list').data('contextMenuFoo') || {},
				key = $this.data('context-menu-key');

			// abort if the key is unknown or disabled
			if (!opt.items[key] || opt.items[key].disabled) {
				return;
			}
			
			// abort if the item has a type
			if (opt.items[key].type) {
				return;
			}

			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			
			// hide menu if callback doesn't stop that
			if (opt.items[key].callback.call(opt.$trigger, key, opt) !== false) {
				op.hide.call(opt.$trigger, opt);
				$currentTrigger = null;
			} else {
				op.show.call(opt.$trigger, opt, null, null);
			}
		},
		// ignore click events on input elements
		inputClick: function(e) {
			e.stopImmediatePropagation();
			//e.stopPropagation();
		}
	},
	// operations
	op = {
		show: function(opt, x, y) {
			var $this = $(this),
				offset;
			
			// show event
			if (opt.events.show.call($this, opt) === false) {
				return;
			}
			
			// determine contextMenu position
			if (x === undefined || y === undefined) {
				// x and y are unknown, position to the lower middle of the trigger element
				offset = $this.offset();
				offset.top += $this.height();
				offset.left += $this.width() / 2;
				offset.display = 'none';
			} else if (x === null && y === null && opt.$menu) {
				// x and y must not be changed
				offset = opt.$menu.position();
			} else {
				// x and y are given (by mouse event)
				offset = {top: y, left: x, display: 'none'};
			}
			
			// TODO: correct offset if viewport demands it?
			
			// create or update context menu
			op.updateMenu.call($this, opt);
			
			// backreference for kill
			opt.$trigger = $this;
			// position and show context menu
			opt.$menu.css( offset )[opt.animation.show](opt.animation.duration);
			// make options available
			$this.data('contextMenuFoo', opt);
			opt.$menu.data('contextMenuFoo', opt);
			// register key handler
			$(document).unbind('keypress.contextMenuFoo').bind('keypress.contextMenuFoo', handle.key);
		},
		hide: function(opt) {
			var $this = $(this);
			if (!opt) {
				opt = $this.data('contextMenuFoo') || {};
			}
			
			// hide event
			if (opt.events && opt.events.hide.call($this, opt) === false) {
				return;
			}
			
			// unregister key handler
			$(document).unbind('keypress.contextMenuFoo');
			// hide menu
			opt.$menu && opt.$menu[opt.animation.hide](opt.animation.duration);
		},
		updateMenu: function(opt) {
			var $this = this;
			// manage contextMenu
			if (!opt.$menu) {
				// create contextMenu
				opt.$menu = $('<ul class="context-menu-list ' + (this.className || "") + '"></ul>');
				// create contextMenu items
				$.each(opt.items, function(key, item){
					var $t = item.$node = $('<li class="context-menu-item ' + (item.className || "") +'"></li>'),
						$label, $input;
					
					// add label for input
					if (item.type) {
						$label = $('<label></label>').appendTo($t);
						$('<span></span>').appendTo($label).text(item.name);
						$t.addClass('context-menu-input');
						opt.hasTypes = true;
					}
					
					switch (item.type) {
						case 'text':
							$input = $('<input type="text" value="1" name="context-menu-input-'+ key +'" value="">')
								.val(item.value || "").appendTo($label);
							break;

						case 'checkbox':
							$input = $('<input type="checkbox" value="1" name="context-menu-input-'+ key +'" value="">')
								.val(item.value || "").prop("checked", !!item.selected).prependTo($label);
							break;

						case 'radio':
							$input = $('<input type="radio" value="1" name="context-menu-input-'+ item.radio +'" value="">')
								.val(item.value || "").prop("checked", !!item.selected).prependTo($label);
							break;
						
						case 'select':
							$input = $('<select name="context-menu-input-'+ key +'">').appendTo($label);
							if (item.options) {
								$.each(item.options, function(value, text) {
									$('<option></option>').val(value).text(text).appendTo($input);
								});
								$input.val(item.selected);
							}
							break;
							
						default:
							$t.text(item.name);
							break;
					}
					
					// add icons
					if (item.icon) {
						$t.addClass("icon icon-" + item.icon);
					}
					
					// make disabled
					if (($.isFunction(item.disabled) && item.disabled.call($this, key, opt)) || item.disabled === true) {
						// disable item
						$t.addClass("disabled");
						// disable input elements
						if (item.type) {
							$t.find('input, select, textarea').prop('disabled', true);
						}
					}

					item.$input = $input;
					item.$label = $label;

					// attach and remember key
					$t.appendTo(opt.$menu).data('contextMenuKey', key);
					
					// Disable text selection
					if (!opt.hasTypes) {
						if($.browser.msie) {
							$t.bind('selectstart.disableTextSelect', handle.abortevent);
						} else if(!$.browser.mozilla) {
							$t.bind('mousedown.disableTextSelect', handle.abortevent);
						}
					}
				});
				
				// attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
				opt.$menu.appendTo(document.body);
			} else {
				// re-check disabled for each item
				opt.$menu.children().each(function(){
					var $item = $(this),
						key = $item.data('contextMenuKey'),
						item = opt.items[key],
						disabled = ($.isFunction(item.disabled) && item.disabled.call($this, key, opt)) || item.disabled === true;
					
					// dis- / enable item
					$item[disabled ? 'addClass' : 'removeClass']('disabled');
					
					if (item.type) {
						// dis- / enable input elements
						$item.find('input, select, textarea').prop('disabled', disabled);
						
						// update input states
						switch (item.type) {
							case 'text':
								item.$input.val(item.value || "");
								break;
								
							case 'checkbox':
							case 'radio':
								item.$input.val(item.value || "").prop('checked', !!item.selected);
								break;
								
							case 'select':
								item.$input.val(item.selected || "");
								break;
						}
					}
				});
			}
		},

		// TODO: $.fn handlers
		enable: function(opt) {
			$(this).removeClass('context-menu-disabled');
		},
		disable: function(opt) {
			$(this).addClass('context-menu-disabled');			
		}
	};

$.contextMenuFoo = function(operation, options) {
	if (typeof operation != 'string') {
		options = operation;
		operation = 'create';
	}
	
	if (typeof options == 'string') {
		options = {selector: options};
	}
	
	// merge with default options
	var o = $.extend(true, {}, defaults, options || {}),
		$body = $body = $(document);
		
	// make sure internal classes are not bound to
	if (o.selector.match(/.context-menu-(list|item|input)($|\s)/)) {
		throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
	}
	
	switch (operation) {
		case 'create':
			if (!o.selector) {
				throw new Error('No selector specified');
			}
			counter ++;
			o.ns = '.contextMenuFoo' + counter;
			namespaces[o.selector] = o.ns;
			menus[o.ns] = o;
			
			if (!initialized) {
				// make sure item click is registered first
				$body
					.delegate('.context-menu-input', 'mouseup.contextMenuFoo', handle.inputClick)
					.delegate('.context-menu-item', 'mouseup.contextMenuFoo', handle.click)
					.delegate('.context-menu-item', 'mouseenter.contextMenuFoo', handle.mouseenter)
					.delegate('.context-menu-item', 'contextmenu.contextMenuFoo', handle.contextmenu)
					.delegate('.context-menu-item', 'mouseleave.contextMenuFoo', handle.mouseleave);
			}
			
			$body.delegate(o.selector, 'mousedown' + o.ns, o, handle.mousedown)
				.delegate(o.selector, 'mouseup' + o.ns, o, handle.mouseup)
				.delegate(o.selector, 'contextmenu' + o.ns, o, handle.contextmenu);
				
			if (!initialized) {
				// make sure default click is registered last
				$body.unbind('mouseup.contextMenuFoo')
					.bind('mouseup.contextMenuFoo', handle.mouseupKill);
					
				initialized = true;
			}
			break;
		
		case 'destroy':
			if (!o.selector) {
				$body.undelegate('.contextMenuFoo').unbind('.contextMenuFoo');
				$.each(namespaces, function(key, value) {
					$body.undelegate(value);
				});
				
				namespaces = {};
				menus = {};
				counter = 0;
				
				$('.context-menu-list').remove();
			} else if (namespaces[o.selector]) {
				try {
					if (menus[namespaces[o.selector]].$menu) {
						menus[namespaces[o.selector]].$menu.remove();
					}
					
					delete menus[namespaces[o.selector]];
				} catch(e) {
					menus[namespaces[o.selector]] = null;
				}
				
				$body.undelegate(namespaces[o.selector]);
			}
			break;
		
		default:
			throw new Error('Unknown operation "' + operation + '"');
	}
	
	return this;
};

})(jQuery);