---
currentMenu: runtime-options
---

# Runtime options (opt)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [$node](#node)
- [$input](#input)
- [$label](#label)
- [$menu](#menu)
- [$trigger](#trigger)
- [callbacks](#callbacks)
- [commands](#commands)
- [inputs](#inputs)
- [hasTypes](#hastypes)
- [ns](#ns)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
The runtime options are passed to most callbacks on registration. This gives you the ability to access DOM elemnts and configuration dynamicly.

One way of using these in in the general [callback](#callback) when an item is clicked.

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    items : {
        name: "textfield",
        type: "text",
        value: "welcome!"
    },    
    callback: function(itemKey, opt){
        // Alert the classes on the item that was clicked. 
        alert(opt.$node.attr('class'));
        
        // Alert "welcome!"
        alert(opt.inputs[itemsKey].$input.val());
    }
});
```

### $selected

Reference to the `<li>` command element. 

`$selected`: `jQuery element`  

### $input

Reference to the `<input>` or `<select>` of the command element.

__Only available with [type](#type) "text", "textarea", "checkbox", "radio" and "select".__

`$input`: `jQuery element`  


### $label

Reference to the `<label>` of the command element.

__Only available with [type](#type) "text", "textarea", "checkbox", "radio" and "select".__

`$label`: `jQuery element`  


### $menu

Or the menu element of the contextmenu or the `<ul>` sub-menu element when called inside a submenu.  

`$node`: `jQuery element`  


### $trigger

The element triggering the menu.

`$trigger`: `jQuery element`  


### callbacks

Registered [callbacks](#callback) of all commands (including those of sub-menus). 

Warning: If you use the same keys for an item in any place, it will overwrite that callback here.

`callbacks`: `array`  


### commands

Registered commands (including those of sub-menus).

Warning: If you use the same keys for an item in any place, it will overwrite that command here.

`commands`: `array`  

### inputs

Registered commands of input-type (including those of sub-menus).

Warning: If you use the same keys for an item in any place, it will overwrite that command here.

Access a specific `<input>`: `opt.inputs[key].$input`

`inputs`: `jQuery element`  


### hasTypes

flag denoting if the menu contains input elements.

`hasTypes`: `jQuery element`  


### ns

The namespace (including leading dot) all events for this contextMenu instance were registered under.

`ns`: `string`  

