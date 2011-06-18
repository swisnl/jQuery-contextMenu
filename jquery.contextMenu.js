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
		// fold-out (sub-) menus
		// custom trigger event ("delayed hover", "left click", …)

var // currently active contextMenu trigger
	$currentTrigger = null,
	// is contextMenu initialized with at least one menu?
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
	// mouse position for hover activation
	hoveract = {
		timer: null,
		pageX: null,
		pageY: null
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
		// hover activation
		mouseenter: function(e) {
			var $this = $(this),
				$related = $(e.relatedTarget);
			
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
			$(document).bind('mousemove.contextMenu', handle.mousemove);
			setTimeout(function() {
				hoveract.timer = null;
				$(document).unbind('mousemove.contextMenu');
				$currentTrigger = $this;
				op.show.call($this, e.data, hoveract.pageX, hoveract.pageY);
			}, 200 );
		},
		// track mouse pointer for activation
		mousemove: function(e) {
			hoveract.pageX = e.pageX;
			hoveract.pageY = e.pageY;
		},
		// abort hover activation
		mouseleave: function(e) {
			// abort if we're leaving for a menu
			var $related = $(e.relatedTarget);
			if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
				return;
			}
			
			try {
				clearTimeout(hoveract.timer);
			} catch(e) {}
			
			hoveract.timer = null;
		},
		// :hover done manually so key handling is possible
		itemMouseenter: function(e) {
			var $this = $(this),
				opt = $this.closest('.context-menu-list').data('contextMenu') || {};

			opt.$selected = $this;
			$this.addClass('hover');
		},
		// :hover done manually so key handling is possible
		itemMouseleave: function(e) {
			var $this = $(this),
				opt = $this.closest('.context-menu-list').data('contextMenu') || {};

			opt.$selected = null;
			$this.removeClass('hover');
		},
		// key handled :hover
		key: function(e) {
			var opt = $currentTrigger.data('contextMenu') || {},
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
						handle.itemMouseleave.call(opt.$selected.get(0), e);
					}
					
					// activate next
					handle.itemMouseenter.call($prev.get(0), e);
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
						handle.itemMouseleave.call(opt.$selected.get(0), e);
					}
					
					// activate next
					handle.itemMouseenter.call($next.get(0), e);
					break;

				case 13: // enter
					opt.$selected && opt.$selected.trigger('mouseup');
					break;
				
				case 27: // esc
					op.hide.call($currentTrigger, undefined);
					$currentTrigger = null;
					break;
			}
		},
		// contextMenu item click
		itemClick: function(e) {
			var $this = $(this),
				opt = $this.closest('.context-menu-list').data('contextMenu') || {},
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
			$this.data('contextMenu', opt);
			opt.$menu.data('contextMenu', opt);
			// register key handler
			$(document).unbind('keypress.contextMenu').bind('keypress.contextMenu', handle.key);
		},
		hide: function(opt) {
			var $this = $(this);
			if (!opt) {
				opt = $this.data('contextMenu') || {};
			}
			
			// hide event
			if (opt.events && opt.events.hide.call($this, opt) === false) {
				return;
			}
			
			// unregister key handler
			$(document).unbind('keypress.contextMenu');
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


$.contextMenu = function(operation, options) {
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
			o.ns = '.contextMenu' + counter;
			namespaces[o.selector] = o.ns;
			menus[o.ns] = o;
			
			if (!initialized) {
				// make sure item click is registered first
				$body
					.delegate('.context-menu-input', 'mouseup.contextMenu', handle.inputClick)
					.delegate('.context-menu-item', 'mouseup.contextMenu', handle.itemClick)
					.delegate('.context-menu-item', 'mouseenter.contextMenu', handle.itemMouseenter)
					.delegate('.context-menu-item', 'contextmenu.contextMenu', handle.contextmenu)
					.delegate('.context-menu-item', 'mouseleave.contextMenu', handle.itemMouseleave);
			}
			
			switch (o.trigger) {
				case 'hover':
					// do something funny here…
						$body
							.delegate(o.selector, 'mouseenter' + o.ns, o, handle.mouseenter)
							.delegate(o.selector, 'mouseleave' + o.ns, o, handle.mouseleave);					
					break;
					
				default:
					$body
						.delegate(o.selector, 'mousedown' + o.ns, o, handle.mousedown)
						.delegate(o.selector, 'mouseup' + o.ns, o, handle.mouseup);
					break;
			}
			
			// disable native context menu
			$body.delegate(o.selector, 'contextmenu' + o.ns, o, handle.contextmenu);
			
			if (!initialized) {
				// make sure default click is registered last
				$body.unbind('mouseup.contextMenu')
					.bind('mouseup.contextMenu', handle.mouseupKill);
					
				initialized = true;
			}
			break;
		
		case 'destroy':
			if (!o.selector) {
				$body.undelegate('.contextMenu').unbind('.contextMenu');
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

$.contextMenu.setInputValues = function(opt, data) {
	if (data === undefined) {
		data = {};
	}
	
	$.each(opt.items, function(key, item) {
		switch (item.type) {
			case 'text':
				item.value = data[key];
				break;

			case 'checkbox':
				item.selected = data[key] ? true : false;
				break;
				
			case 'radio':
				item.selected = data[item.radio] == item.value ? true : false;
				break;
			
			case 'select':
				item.selected = data[key];
				break;
		}
	});
};

$.contextMenu.getInputValues = function(opt, data) {
	if (data === undefined) {
		data = {};
	}
	
	$.each(opt.items, function(key, item) {
		switch (item.type) {
			case 'text':
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



})(jQuery);