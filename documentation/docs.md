# Documentation

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Register new contextMenu](#register-new-contextmenu)
- [Options (at registration)](#options-at-registration)
  - [selector](#selector)
  - [items](#items)
- [Items](#items)
  - [Item option definitions](#item-option-definitions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Register new contextMenu

To register a new contextMenu:

```javascript
$.contextMenu( options );
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

Object with [items](#items) to be listed in contextMenu. See [items](#items) for a full explanation.

`items`: `object` Object containing [item](#items) objects.

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

Specifies the selctor string or DOMElement the generated menu is to be appended to.

`appendTo`: `string` or `DOMElement` default: `document.body` 


#### Example
```javascript
// select the container with a selector
$.contextMenu({
   selector: 'span.context-menu',
   appendTo: 'div#context-menus-container'
});

// select the container with a dom element
var element = document.getElementById('#context-menus-container');
$.contextMenu({
   selector: 'span.context-menu',
   appendTo: element
});
```


### trigger

Specifies what event on the element specified in the [selector](#selector) triggers the contextmenu. 

`appendTo`: `string` default: `'right'` 


Value | Description
---- | ---- 
`right` | Right mouse button
`left` | Left mouse button
`hover` | Hover the element
`none` | No trigger

#### Example
```javascript
// trigger with left mouse button
$.contextMenu({
   selector: 'span.context-menu',
   trigger: 'left'
});

// trigger on hover
var element = document.getElementById('#context-menus-container');
$.contextMenu({
   selector: 'span.context-menu',
   trigger: 'hover'
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

Specifies the offset to add to the calculated zIndex of the [trigger](#trigger) element. Set to `0` to prevent zIndex manipulation

`zIndex`: `int` default: `1` 

#### Example
```javascript
$.contextMenu({
   selector: 'span.context-menu',
   zIndex: 10
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

### animation

Animation properties take effect on showing and hiding the menu. Duration specifies the duration of the animation in milliseconds. `show` and `hide` specify [jQuery methods](http://api.jquery.com/category/effects/) to show and hide elements.

`animation`: `object` default: `{duration: 500, show: 'slideDown', hide: 'slideUp'}` 

#### Example
```javascript
$.contextMenu({
   selector: 'span.context-menu',
   animation: `{duration: 250, show: 'fadeIn', hide: 'faseOut'}`
});
```






## Items

The items map contains the commands to list in the menu. Each command has a unique key identifying an item object. The value may either be an item (properties explained below), or a string (which will insert a separator, disregarding the string's content).

```javascript
var items = {
  firstCommand: itemOptions,
  separator1: "-----",
  command2: itemOptions
}
```

### Item object definitions

Specify the human readable name of the command in the menu. This is used as the label for the option.

`name`: `string` Label of item

```javascript
var items = {
    firstCommand: {
        name: "Copy"
    }
}
```
