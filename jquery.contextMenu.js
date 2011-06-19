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

(function($, undefined){
	
	// TODO
		// fold-out (sub-) menus
		// show / hide events
		// import from DOM
		// html5 polyfill

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
		// method to trigger context menu ["right", "left", "hover"]
		trigger: "right",
		// ms to wait before showing a hover-triggered context menu
		delay: 200,
		// determine position to show menu at
		determinePosition: function($menu) {
			// position to the lower middle of the trigger element
			if ($.ui && $.ui.position) {
				// .position() is provided as a jQuery UI utility
				// …and it won't work on hidden elements
				$menu.css('display', 'block').position({
					my: "center top",
					at: "center bottom",
					of: this,
					offset: "0 5"
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
		position: function(opt, x, y) {
			var $this = this,
				offset;
			// determine contextMenu position
			if (!x && !y) {
				opt.determinePosition.call(this, opt.$menu);
				return;
			} else if (x === "maintain" && y === "maintain") {
				// x and y must not be changed (after re-show on command click)
				offset = opt.$menu.position();
			} else {
				// x and y are given (by mouse event)
				offset = {top: y, left: x};
			}
			
			// correct offset if viewport demands it
			var $win = $(window),
				bottom = $win.scrollTop() + $win.height(),
				right = $win.scrollLeft() + $win.width(),
				height = opt.$menu.height(),
				width = opt.$menu.width();
			
			if (offset.top + height > bottom) {
				offset.top -= height;
			}
			
			if (offset.left + width > right) {
				offset.left -= width;
			}
			
			opt.$menu.css(offset);
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
	// determine zIndex
	zindex = function($t)
	{
		var zin = 0,
			$tt = $t;

		while(true)
		{
			zin = Math.max( zin, parseInt( $tt.css('z-index'), 10 ) || 0 );
			$tt = $tt.parent();
			if( !$tt || !$tt.length || $tt.prop('nodeName').toLowerCase() == 'body' )
				break;
		}
		
		return zin;
	},
	// event handlers
	handle = {
		// abort anything
		abortevent: function(e){ 
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
		},
		
		// contextmenu show dispatcher
		contextmenu: function(e) {
			var $this = $(this);
			// disable actual context-menu
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			
			if (!$this.hasClass('context-menu-disabled')) {
				//var data = e.data;
				// http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#context-menus
				// var evt = jQuery.Event("show", { data: data, pageX: e.pageX, pageY: e.pageY, relatedTarget: this });
				// e.data.$menu.trigger(evt);
				$currentTrigger = $this;
				op.show.call($this, e.data, e.pageX, e.pageY);
			}
		},
		// contextMenu left-click trigger
		click: function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			$(this).trigger(jQuery.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
		},
		// contextMenu right-click trigger
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
		// contextMenu right-click trigger
		mouseup: function(e) {
			// show menu
			var $this = $(this);
			if ($this.data('contextMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
				e.stopPropagation();
				e.stopImmediatePropagation();
				e.preventDefault();
				$currentTrigger = $this;
				//op.show.call($this, e.data, e.pageX, e.pageY);
				$this.trigger(jQuery.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
			}
			
			$this.removeData('contextMenuActive');
		},
		// contextMenu hover trigger
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
			hoveract.data = e.data;
			$(document).bind('mousemove.contextMenu', handle.mousemove);
			hoveract.timer = setTimeout(function() {
				hoveract.timer = null;
				$(document).unbind('mousemove.contextMenu');
				$currentTrigger = $this;
				//op.show.call($this, hoveract.data, hoveract.pageX, hoveract.pageY);
				$this.trigger(jQuery.Event("contextmenu", { data: hoveract.data, pageX: hoveract.pageX, pageY: hoveract.pageY }));
			}, e.data.delay );
		},
		// contextMenu hover trigger
		mousemove: function(e) {
			hoveract.pageX = e.pageX;
			hoveract.pageY = e.pageY;
		},
		// contextMenu hover trigger
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

		// click on layer to hide contextMenu
		layerClick: function(e) {
			var $this = $(this),
				opt = $this.data('contextMenu');
				
			e.preventDefault(); 
			e.stopImmediatePropagation();
			e.stopPropagation();
			$this.remove();
			op.hide.call(opt.$trigger, opt);
		},
		// key handled :hover
		key: function(e) {
			var opt = $currentTrigger.data('contextMenu') || {},
				$children = opt.$menu.children(),
				$round;
			
			if (!opt.isInput) {
				e.preventDefault();
			}
			
			e.stopPropagation();
			
			switch( e.keyCode ) {
				case 9:
				case 38: // up
					// if keyCode is [38 (up)] or [9 (tab) with shift]
					if (opt.isInput) {
						if (e.keyCode == 9 && e.shiftKey) {
							e.preventDefault();
							opt.$selected.find('input, textarea, select').blur();
							opt.$menu.trigger('prevcommand');
							break;
						} else if (e.keyCode == 38 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
							// checkboxes don't capture this key
							e.preventDefault();
							break;
						}
					} else if (e.keyCode != 9 || e.shiftKey) {
						opt.$menu.trigger('prevcommand');
						break;
					}
					
				case 9: // tab
				case 40: // down
					if (opt.isInput) {
						if (e.keyCode == 9) {
							e.preventDefault();
							opt.$selected.find('input, textarea, select').blur();
							opt.$menu.trigger('nextcommand');
						} else if (e.keyCode == 40 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
							// checkboxes don't capture this key
							e.preventDefault();
						}
					} else {
						opt.$menu.trigger('nextcommand');
					}
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

		// select previous possible command in menu
		prevItem: function(e) {
			var opt = $(this).data('contextMenu') || {},
				$children = opt.$menu.children(),
				$prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev(),
				$round = $prev;
			
			// skip disabled
			while ($prev.hasClass('disabled') || $prev.hasClass('context-menu-separator')) {
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
		nextItem: function(e) {
			var opt = $(this).data('contextMenu') || {},
				$children = opt.$menu.children(),
				$next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next(),
				$round = $next;
			
			// skip disabled
			while ($next.hasClass('disabled') || $next.hasClass('context-menu-separator')) {
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
		focusInput: function(e) {
			var $item = $(this).closest('.context-menu-item'),
				opt = $item.parent().data('contextMenu');

			opt.$selected = $item;
			opt.isInput = true;
		},
		// flag that we're inside an input so the key handler can act accordingly
		blurInput: function(e) {
			var opt = $(this).closest('.context-menu-list').data('contextMenu');

			opt.isInput = false;
		},
		
		// :hover done manually so key handling is possible
		itemMouseenter: function(e) {
			var $this = $(this),
				opt = $this.closest('.context-menu-list').data('contextMenu') || {};
			
			// make sure only one item is selected
			opt.$menu.children().removeClass('hover');
			
			if ($this.hasClass('disabled') || $this.hasClass('context-menu-separator')) {
				opt.$selected = null;
				return;
			}
			
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
				op.show.call(opt.$trigger, opt, "maintain", "maintain");
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
				offset, 
				css = {};

			// hide any open menus
			$('#context-menu-layer').trigger('mousedown');

			// show event
			if (opt.events.show.call($this, opt) === false) {
				$currentTrigger = null;
				return;
			}
			
			// create or update context menu
			op.update.call($this, opt);
			
			// position menu
			opt.position.call($this, opt, x, y);

			// make sure we're in front
			if (opt.zIndex) {
				css.zIndex = zindex($this) + opt.zIndex;
			}
			
			// add layer
			op.layer.call(opt.$menu, opt, css.zIndex);
			
			// backreference for callbacks
			opt.$trigger = $this;
			// position and show context menu
			opt.$menu.css( css )[opt.animation.show](opt.animation.duration);
			// make options available
			$this.data('contextMenu', opt);
			opt.$menu.data('contextMenu', opt);
			// register key handler
			$(document).unbind('keydown.contextMenu').bind('keydown.contextMenu', handle.key);
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
			
			if (opt.$layer) {
				try {
					opt.$layer.remove();
					delete opt.$layer;
				} catch(e) {
					opt.$layer = null;
				}
			}
			
			$currentTrigger = null;
			
			// unregister key handler
			$(document).unbind('keydown.contextMenu');
			// hide menu
			opt.$menu && opt.$menu[opt.animation.hide](opt.animation.duration);
		},
		create: function(opt) {
			// create contextMenu
			opt.$menu = $('<ul class="context-menu-list ' + (this.className || "") + '"></ul>');
			// create contextMenu items
			$.each(opt.items, function(key, item){
				var $t = item.$node = $('<li class="context-menu-item ' + (item.className || "") +'"></li>'),
					$label = null, 
					$input = null;
				
				if (typeof item == "string") {
					$t.addClass('context-menu-separator');
				} else {
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
					
						case 'textarea':
							$input = $('<textarea name="context-menu-input-'+ key +'"></textarea>')
								.val(item.value || "").appendTo($label);

							if (item.height) {
								$input.height(item.height);
							}
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
					
					// disable key listener in <input>
					if (item.type) {
						$input
							.bind('focus', handle.focusInput)
							.bind('blur', handle.blurInput);
					}
				
					// add icons
					if (item.icon) {
						$t.addClass("icon icon-" + item.icon);
					}
				}
				
				// skip disabled

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
			opt.$menu.css('display', 'none').appendTo(document.body);
		},
		update: function(opt) {
			var $this = this;
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
						case 'textarea':
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
		},
		layer: function(opt, zIndex) {
			var $win = $(window);
			
			// add transparent layer for click area
			return $('<div id="context-menu-layer" style="position:fixed; z-index:' + zIndex + '; top:0; left:0; opacity: 0;"></div>')
				.css({height: $win.height(), width: $win.width(), display: 'block'})
				.data('contextMenu', opt)
				.insertBefore(this)
				.bind('mousedown', handle.layerClick);
		},
		
		// TODO: $.fn handlers
		enable: function(opt) {
			$(this).removeClass('context-menu-disabled');
		},
		disable: function(opt) {
			$(this).addClass('context-menu-disabled');			
		}
	};

// manage contextMenu instances
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
					//.delegate('.context-menu-list', 'show.contextMenu', handle.show)
					//.delegate('.context-menu-list', 'hide.contextMenu', handle.hide)
					.delegate('.context-menu-list', 'prevcommand.contextMenu', handle.prevItem)
					.delegate('.context-menu-list', 'nextcommand.contextMenu', handle.nextItem)
					.delegate('.context-menu-list', 'contextmenu.contextMenu', handle.abortevent)
					.delegate('.context-menu-input', 'mouseup.contextMenu', handle.inputClick)
					.delegate('.context-menu-item', 'mouseup.contextMenu', handle.itemClick)
					.delegate('.context-menu-item', 'contextmenu.contextMenu', handle.abortevent)
					.delegate('.context-menu-item', 'mouseenter.contextMenu', handle.itemMouseenter)
					.delegate('.context-menu-item', 'mouseleave.contextMenu', handle.itemMouseleave);
				
				initialized = true;
			}
			
			// engage native contextmenu event
			$body
				.delegate(o.selector, 'contextmenu' + o.ns, o, handle.contextmenu);
			
			switch (o.trigger) {
				case 'hover':
						$body
							.delegate(o.selector, 'mouseenter' + o.ns, o, handle.mouseenter)
							.delegate(o.selector, 'mouseleave' + o.ns, o, handle.mouseleave);					
					break;
					
				case 'left':
						$body
							.delegate(o.selector, 'click' + o.ns, o, handle.click);
					break;
				/*
				default:
					// TODO: check where contextmenu event won't fire naturally
					// http://www.quirksmode.org/dom/events/contextmenu.html
					$body
						.delegate(o.selector, 'mousedown' + o.ns, o, handle.mousedown)
						.delegate(o.selector, 'mouseup' + o.ns, o, handle.mouseup);
					break;
				*/
			}

			// create menu
			op.create.call({}, o);
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

// import values into <input> commands
$.contextMenu.setInputValues = function(opt, data) {
	if (data === undefined) {
		data = {};
	}
	
	$.each(opt.items, function(key, item) {
		switch (item.type) {
			case 'text':
			case 'textarea':
				item.value = data[key] || "";
				break;

			case 'checkbox':
				item.selected = data[key] ? true : false;
				break;
				
			case 'radio':
				item.selected = (data[item.radio] || "") == item.value ? true : false;
				break;
			
			case 'select':
				item.selected = data[key] || "";
				break;
		}
	});
};

// export values from <input> commands
$.contextMenu.getInputValues = function(opt, data) {
	if (data === undefined) {
		data = {};
	}
	
	$.each(opt.items, function(key, item) {
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

// make defaults accessible
$.contextMenu.defaults = defaults;

})(jQuery);