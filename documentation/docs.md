---
currentMenu: options
layout: base.njk
title: jQuery contextMenu — Documentation
---
# Documentation

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Register new contextMenu](#register-new-contextmenu)
- [Update contextMenu state](#update-contextmenu-state)
- [Options (at registration)](#options-at-registration)
  - [selector](#selector)
  - [items](#items)
  - [appendTo](#appendto)
  - [trigger](#trigger)
  - [reposition](#reposition)
  - [delay](#delay)
  - [autoHide](#autohide)
  - [zIndex](#zindex)
  - [className](#classname)
  - [classNames](#classnames)
  - [direction](#direction)
  - [animation](#animation)
  - [events](#events)
  - [position](#position)
  - [determinePosition](#determineposition)
  - [callback](#callback)
  - [build](#build)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Register new contextMenu

To register a new contextMenu:

* Note: For SVG support use jQuery >= 1.12|2.2

```javascript
$.contextMenu( options );
```

## Update contextMenu state

It is possible to refresh the state of the contextmenu [disabled](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#disabled), [visibility](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#visible), [icons](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#icon) and [input values](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#type) through the `update` command. This will reevaluate any custom callbacks. 

```javascript
$('.context-menu-one').contextMenu('update'); // update single menu
$.contextMenu('update') // update all open menus
```

## Options (at registration)

### selector

The jQuery selector matching the elements to trigger on. This option is mandatory.

`selector`: `string` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu'
});
```

### items

Object with [items](docs/items.html) to be listed in contextMenu. See [items](docs/items.html) for a full documentation on how to build your menu items.

`items`: `object` Object containing [items](docs/items.html) objects.

#### Example
```javascript
$.contextMenu({
    selector: '.context-menu',
    items: {
        copy: {
            name: "Copy",
            callback: function(key, opt){
                alert("Clicked on " + key);
            }
        }
    }
});
```


### appendTo

Specifies the selector string or DOMElement the generated menu is to be appended to.

`appendTo`: `string` or `DOMElement` default: `document.body` 


#### Example
```javascript
// select the container with a selector
$.contextMenu({
    selector: 'span.context-menu',
    appendTo: 'div#context-menus-container'
});

// select the container with a dom element
var element = document.getElementById('context-menus-container');
$.contextMenu({
    selector: 'span.context-menu',
    appendTo: element
});
```


### trigger

Specifies what event on the element specified in the [selector](#selector) triggers the contextmenu. 

`trigger`: `string` default: `'right'` 


Value | Description
---- | ---- 
`right` | Right mouse button
`left` | Left mouse button
`hover` | Hover the element
`touchstart` | Touchstart only
`none` | No trigger

#### Example
```javascript
// trigger with left mouse button
$.contextMenu({
    selector: 'span.context-menu',
    trigger: 'left'
});

// trigger on hover
$.contextMenu({
    selector: 'span.context-menu',
    trigger: 'hover'
});
```

### hideOnSecondTrigger

Flag denoting if a second trigger should close the menu, as long as the trigger happened on one of the trigger-element's child nodes.  This overrides the reposition option.
            
`hideOnSecondTrigger`: `boolean` default: `false`

### selectableSubMenu
 
Specifies if menu items containing submenus should be clickable or not. 

`selectableSubMenu`: `boolean` default: `false` 

Value | Description
---- | ---- 
`true` | All Enabled menu items, even containing others are clickable
`false` | Items containing subitems are not clickable

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    selectableSubMenu: true
});
```

### reposition

Specifies if a menu should be repositioned (`true`) or rebuilt (`false`) if a second [trigger](#trigger) event (like a right click) is performed on the same element (or its children) while the menu is still visible.

`reposition`: `boolean` default: `true` 

Value | Description
---- | ---- 
`true` | Reposition menu when triggered
`false` | Rebuild menu when triggered

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    reposition: false
});
```


### delay

Specifies the time in milliseconds to wait before showing the menu. Only applies to [trigger](#trigger): "hover"

`delay`: `int` default: `200` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    delay: 500
});
```

### autoHide

Specifies if the menu must be hidden when the mouse pointer is moved out of the [trigger](#trigger) and [menu items](#items).

`autoHide`: `boolean` default: `false` 

Value | Description
---- | ---- 
`true` | Hide the menu on mouseout 
`false` | Do not hide the menu on mouseout 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    autoHide: true
});
```

### zIndex

Specifies the offset to add to the calculated zIndex of the [trigger](#trigger) element. Set to `0` to prevent zIndex manipulation. Can be a function that returns an int to calculate the zIndex on build.

`zIndex`: `int`|`function` default: `1` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    zIndex: 10
});

$.contextMenu({
    selector: 'span.context-menu',
    zIndex: function($trigger, opt){
        return 120;
});
```

### className

Specifies additional classNames to add to the menu element. Seperate multiple classes by using spaces.

`className`: `string`  

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    className: 'contextmenu-custom contextmenu-custom__highlight'
});
```


### classNames

Specifies the base class names of the contextmenu elements. This can be used to change the class names of some classes that might conflict with frameworks like Bootstrap.

`classNames`: `object`

```javascript
// Classname configuration to be able avoid conflicts in frameworks
var options = {
    classNames : {
    
        hover:            'hover',          // Item hover
        disabled:         'disabled',       // Item disabled
        visible:          'visible',        // Item visible
        notSelectable:    'not-selectable', // Item not selectable
    
        icon:             'context-menu-icon',           // Base icon class
        iconEdit:         'context-menu-icon-edit',
        iconCut:          'context-menu-icon-cut',
        iconCopy:         'context-menu-icon-copy',
        iconPaste:        'context-menu-icon-paste',
        iconDelete:       'context-menu-icon-delete',
        iconAdd:          'context-menu-icon-add',
        iconQuit:         'context-menu-icon-quit',
        iconLoadingClass: 'context-menu-icon-loading'
    
    }
}
```

### direction

Specifies the text direction of the menu. Set to `'rtl'` for right-to-left languages (e.g. Arabic, Hebrew). This adds a `context-menu-rtl` class to the menu and its sub-menus, which right-aligns text and mirrors icon and submenu-arrow placement, and flips the side sub-menus open on so they expand to the *left* of their parent item instead of the right.

`direction`: `string` default: `'ltr'`

Value | Description
---- | ----
`ltr` | Left-to-right (default)
`rtl` | Right-to-left

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    direction: 'rtl',
    items: {
        edit: {name: 'Edit'},
        more: {
            name: 'More',
            items: {
                foo: {name: 'Foo'}
            }
        }
    }
});
```


### animation

Animation properties take effect on showing and hiding the menu. Duration specifies the duration of the animation in milliseconds. `show` and `hide` specify [jQuery methods](http://api.jquery.com/category/effects/) to show and hide elements.

`animation`: `object` default: `{duration: 50, showDuration: null, hideDuration: null, animateOnReopen: true, show: 'slideDown', hide: 'slideUp'}`

Value | Description
---- | ----
`animation.duration` | Duration in milliseconds, used for both the show and the hide animation
`animation.showDuration` | Optional duration for the show animation only. Falls back to `animation.duration` when `null`
`animation.hideDuration` | Optional duration for the hide animation only. Falls back to `animation.duration` when `null`
`animation.animateOnReopen` | Whether the show animation is replayed when the menu that is opened is already visible. Set to `false` to only move it
`animation.show` | [jQuery method](http://api.jquery.com/category/effects/) used to show the menu
`animation.hide` | [jQuery method](http://api.jquery.com/category/effects/) used to hide the menu

`animateOnReopen` applies to that one menu only. Opening the same menu again, for example by right-clicking another element that shares it, moves the menu to the new position without replaying the show animation when it is set to `false`. A different menu opening while another one is closing is always animated.

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    animation: {duration: 250, show: 'fadeIn', hide: 'fadeOut'}
});
```

```javascript
$.contextMenu({
    selector: 'span.context-menu',
    animation: {
        // fade in slowly, but disappear quickly
        showDuration: 400,
        hideDuration: 100,
        show: 'fadeIn',
        hide: 'fadeOut',
        // don't animate again when the menu is already on screen
        animateOnReopen: false
    }
});
```

### events
<!--  @todo runtime options object -->
The `show` and `hide` events are triggered *before* the menu is shown or hidden. The event handlers are executed in the context of the triggering object. This will thus reference the jQuery handle of the [trigger](#trigger) object.

A reference to the current options object is passed, the options object is a collection of current options and references to the DOM nodes of the menu. The event handlers may return `false` to prevent the `show` or `hide` process.

`events`: `object` 

Value | Description
---- | ---- 
`events.preShow` | Called before show of the contextmenu, when returning false default browser context menu is shown
`events.show` | Called on show of the contextmenu 
`events.hide` | Called before hide of the contextmenu
`events.activated` | Called after activation of the contextmenu

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    events: {
       show : function(options){
            // Add class to the menu
            this.addClass('currently-showing-menu');
             
            // Show an alert with the selector of the menu
            if( confirm('Open menu with selector ' + options.selector + '?') === true ){
                return true;
            } else {
                // Prevent the menu to be shown.
                return false;
            }            
       },
       hide : function(options){
           if( confirm('Hide menu with selector ' + options.selector + '?') === true ){
               return true;
           } else {
               // Prevent the menu to be hidden.
               return false;
           }            
       },
       activated : function(options){
               if( confirm('Hide menu with selector ' + options.selector + '?') === true ){
               console.log('Menu Activated');
           }            
       }
});
```

### position

Callback to override the position of the context menu. The function is executed in the context of the trigger object. 

The first argument is the `$menu` jQuery object, which is the menu element. The second and third arguments are `x` and `y` coordinates provided by the `show` event.

The `x` and `y` may either be integers denoting the offset from the top left corner, `undefined`, or the string `"maintain"`. If the string `"maintain"` is provided, the current position of the `$menu` must be used. If the coordinates are `undefined`, appropriate coordinates must be determined. An example of how this can be achieved is provided with [determinePosition](#determinePosition).

`position`: `function(opt.$menu, x, y)`

Value `x` or `y` | Description
---- | ---- 
`int` | Offset in pixels from top-left of trigger element.
`"maintain"` | Maintain current `x` or `y` coordinate
`undefined` | Unknown, [determinePosition](#determinePosition) is called.

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    position: function(opt, x, y){
        opt.$menu.css({top: 123, left: 123});
    } 
});
```

### determinePosition

Determine the position of the menu in respect to the given [trigger](#trigger) object, this function is called when there is no `x` and `y` set on the [position](#position) call. 

`determinePosition`: `function(opt.$menu)`  

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    determinePosition: function($menu){
        // Position using jQuery.ui.position 
        // http://api.jqueryui.com/position/
        $menu.css('display', 'block')
            .position({ my: "center top", at: "center bottom", of: this, offset: "0 5"})
            .css('display', 'none');
    }
});
```


### callback
<!-- @todo link item.callback -->
Specifies the default callback to be used in case an [item](#items) does not expose its own callback. The default callback behaves just like item.callback.

`callback`: `function(itemKey, opt)` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    callback: function(itemKey, opt){ 
        // Alert the key of the item and the trigger element's id.
        alert("Clicked on " + itemKey + " on element " + opt.$trigger.attr("id"));
        
        // Do not close the menu after clicking an item
        return false;
    }
});
```

### build

The callback is executed with two arguments given: the jQuery reference to the triggering element and the original contextmenu event. It is executed without context (so this won't refer to anything useful).

If the build callback is found at registration, the menu is not built right away. The menu creation is delayed to the point where the menu is actually called to show. Dynamic menus don't stay in the DOM. After a menu created with build is hidden, its DOM-footprint is destroyed.

With build, only the options [selector](#selector) and [trigger](#trigger) may be specified in the [options](#options-at-registration) object. All other options need to be returned from the build callback.

the build callback may return a boolean false to signal contextMenu to not display a context menu

`build`: `function($triggerElement, event)` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    build: function($triggerElement, e){
        return {
            callback: function(){},
            items: {
                menuItem: {name: "My on demand menu item"}
            }
        };
    }
});
```

### itemClickEvent

Allows the selection of the `click` event instead of the `mouseup` event to handle the user mouse interaction with the contexMenu. The default event is `mouseup`. Set the option to `"click"` to change to the `click` event.

`itemClickEvent`: `"click"`

This option is global: the first contexMenu registered sets it. To change it afterwards all the contextMenu have to be unregistered  with `$.contextMenu( 'destroy' );` before the change has effect again.  

