---
currentMenu: items
---

# Items

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [options.items](#optionsitems)
  - [name](#name)
  - [callback](#callback)
  - [className](#classname)
  - [icon](#icon)
  - [disabled](#disabled)
  - [visible](#visible)
  - [type](#type)
  - [events](#events)
  - [value](#value)
  - [selected](#selected)
  - [radio](#radio)
  - [options](#options)
  - [height](#height)
  - [items](#items)
  - [accesskey](#accesskey)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



The items map contains the commands to list in the menu. Each command has a unique key identifying an item object. The value may either be an item (properties explained below), or a string (which will insert a separator, disregarding the string's content). It is also possible to define a seperator the same as an item, and use the `type`:`cm_separator` to define it. 

```javascript
var items = {
  firstCommand: itemOptions,
  separator1: "-----",
  separator2: { "type": "cm_separator" },
  command2: itemOptions
}
```

Since 2.3 it is also possible to use a promise as item, so you can build submenu's based on a snynchronous promis.

Check out the [demo using a promise](demo/async-promise.md) for an example how to use this. The example uses jQuery deferred, but any promise should do. Promised can only be used in combination with the [build option](docs#build).

## options.items

### name 

Specify the human readable name of the command in the menu. This is used as the label for the option.

`name`: `string`

#### Example

```javascript
var items = {
    firstCommand: {
        name: "Copy"
    }
}
```


### isHtmlName

When truthy, the defined `name` value is HTML.

The value will be rendered using `$.html()` instead of `$.text()`.

__Note: Cannot be used with the [accesskey](#accesskey) option in the same item.__

`isHtmlName`: `boolean`

#### Example

```javascript
var items = {
    firstCommand: {
        name: "Copy <span style='font-weight: bold'>Text</span>",
        isHtmlName: true
    }
}
```


### callback 

Specifies the callback to execute if clicked on

The Callback is executed in the context of the triggering object. The first argument is the key of the command. The second argument is the options object. The Callback may return false to prevent the menu from being hidden.

If no callback and no default callback is specified, the item will not have an action

`callback`: `function(itemKey, opt)`

#### Example

```javascript
var items = {
    firstCommand: {
        name: "Copy",
        callback: function(itemKey, opt){
            // Alert the key of the item and the trigger element's id.
            alert("Clicked on " + itemKey + " on element " + opt.$trigger.id);
             
            // Do not close the menu after clicking an item
            return false;             
        }       
    }
}
```




### className 

Specifies additional classNames to add to the menu item. Seperate multiple classes by using spaces.

`className`: `string`

#### Example

```javascript
var items = {
    firstCommand: {
        name: "Copy",
        className: 'contextmenu-item-custom contextmenu-item-custom__highlight'
    }
}
```

### icon 

Specifies the icon class to set for the item.

When using a string icons must be defined in CSS with selectors like `.context-menu-item.context-menu-icon-edit`, where `edit` is the icon class specified.

When using a callback you can return a class string to use that as the class on the item. You can also modify the element by using the `$itemElement` argument. 
 
`icon`: `string` or `function(opt, $itemElement, itemKey, item)`

#### Example

```javascript
var items = {
    firstCommand: {
        name: "Copy",
        icon: function(opt, $itemElement, itemKey, item){
            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
            $itemElement.html('<span class="glyphicon glyphicon-star" aria-hidden="true"></span> ' + opt.selector);
            
            // Add the context-menu-icon-updated class to the item
            return 'context-menu-icon-updated';
        }
    },
    secondCommand: {
        name: "Paste",
        icon: "paste" // Class context-menu-icon-paste is used on the menu item.
    }
}
```


### disabled 
<!--  @todo options object -->
Specifies if the command is disabled (`true`) or enabled (`false`).

May be a callback returning a `boolean`. The callback is executed in the context of the triggering object (so this inside the function refers to the element the context menu was shown for). The first argument is the `key` of the command. The second argument is the `options object`.

`disabled`: `boolean` or `function(itemKey, opt)`

#### Example

```javascript
var items = {
    firstCommand: {
        name: "Copy",
        disabled: function(key, opt){        
            // Disable this item if the menu was triggered on a div
            if(opt.$trigger.nodeName === 'div'){
                return true;
            }            
        }
    }
}
```




### visible 
<!--  @todo options object -->
Specifies if the command is visible (`true`) or not (`false`).

May be a callback returning a boolean. The callback is executed in the context of the triggering object (so this inside the function refers to the element the context menu was shown for). The first argument is the key of the command. The second argument is the `options object`.

`visible`: `boolean` or `function(itemKey, opt)`

#### Example

```javascript
var items = {
    firstCommand: {
        name: "Copy",
        visible: function(key, opt){        
            // Hide this item if the menu was triggered on a div
            if(opt.$trigger.nodeName === 'div'){
                return false;
            }            
        }
    }
}
```


### type

Specifies the type of the command.

`type`: `null`, `undefined`, `text`, `textarea`, `checkbox`, `radio`, `select`, `html` default: `null` 

Value | Description
---- | ---- 
`null`, `undefined` , `""` | The command is a simple clickable item.
`"text"` | Makes the command an `<input>` of type `text`.<br>The name followed by the `<input>` are encapsulated in a `<label>`.
`"textarea"` | Makes the command a `<textarea>`. <br>The name followed by the `<input>` are encapsulated in a `<label>`.
`"checkbox"` | Makes the command an `<input>` of type checkbox. <br>The name preceeded by the `<input>` are encapsulated in a `<label>`. <br>The checkbox-element is moved to the icon space
`"radio"` | Makes the command an `<input>` of type radio. <br>The name preceeded by the `<input>` are encapsulated in a `<label>`. <br>The radio-element is moved to the icon space
`"select"` | Makes the command a `<select>`. <br>The name followed by the `<select>` are encapsulated in a `<label>`.
`"html"` | Makes an non-command element. When you select `type: 'html'` add the html to the `html` property. So: `{ item: { type: 'html', html: '<span>html!</span>' } }`. You can also just use the item name with the [`isHtmlName`](isHtmlName) property.


#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
        items: {
            name: {
                name: "Text", 
                type: 'text', 
                value: "Hello World", 
                events: {
                    keyup: function(e) {
                        // add some fancy key handling here?
                        window.console && console.log('key: '+ e.keyCode); 
                    }
                }
            },
            sep1: "---------",
            // <input type="checkbox">
            yesno: {
                name: "Boolean", 
                type: 'checkbox', 
                selected: true
            },
            sep2: "---------",
            // <input type="radio">
            radio1: {
                name: "Radio1", 
                type: 'radio', 
                radio: 'radio', 
                value: '1'
            },
            radio2: {
                name: "Radio2", 
                type: 'radio', 
                radio: 'radio', 
                value: '2', 
                selected: true
            },
            sep3: "---------",
            // <select>
            select: {
                name: "Select", 
                type: 'select', 
                options: {1: 'one', 2: 'two', 3: 'three'}, 
                selected: 2
            },
            // <textarea>
            area1: {
                name: "Textarea with height", 
                type: 'textarea', 
                value: "Hello World", 
                height: 40
            },
            area2: {
                name: "Textarea", 
                type: 'textarea', 
                value: "Hello World"
            },
            sep4: "---------",
            key: {
                name: "Something Clickable", 
                callback: $.noop
            }
        }
});
```

### events

Events to register on `<input>` elements. The contents of the options object are passed to jQuery event.data.

__Only used with [types](#type) `text`, `textarea`, `radio`, `checkbox` and `select`.__

`events`: `object`


#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    events: {
        command1: {
            name: "Foobar", 
            type: "text", 
            events: {
                keyup: function(e){
                    alert(e.keyCode);
                    alert(e.data.$trigger.attr("id"));
                }
            } 
        }
    }
});
```


### value

The value of the `<input>` element.

__Only used with [types](#type) `text`, `textarea`, `radio`.__

`value`: `string`


#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    command1: {
        name: "Foobar", 
        type: "text",
        value: "default value"
    }
});
```

### selected

The selected option of a `select` element and the checked property for `checkbox` and `radio` types.

__Only used with [types](#type) `select`, `checkbox`, `radio`.__


`selected`: `string` or `boolean` 

Value | Description
---- | ---- 
`boolean` | Use with `checkbox` and `radio` to check. 
`string` |  Use with `select` to select that option.

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    items: {
        // <select>
        select: {
            name: "Select", 
            type: 'select', 
            options: {1: 'one', 2: 'two', 3: 'three'}, 
            selected: "2"
        }
    }
});
```

### radio

Specifies the group of the radio elements.

__Only used with [type](#type) `radio`.__

`radio`: `string` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    items: {
        // <input type="radio">
        radio1: {
            name: "Radio1", 
            type: 'radio', 
            radio: 'radio', 
            value: '1'
        },
        radio2: {
            name: "Radio2", 
            type: 'radio', 
            radio: 'radio', 
            value: '2', 
            selected: true
        }
    }    
});
```


### options

Specifies the `<option>` elements for the `<select>` element.

__Only used with [type](#type) `select`.__

`options`: `object` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    items: {
       // <select>
       select: {
           name: "Select", 
           type: 'select', 
           options: {1: 'one', 2: 'two', 3: 'three'}, 
           selected: "2"
       }
    }    
});
```



### height

The height in pixel `<textarea>` element. If not specified, the height is defined by CSS.

__Only used with [type](#type) `textarea`.__

`height`: `int` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    items: {
       // <select>
       myTextarea: {
           name: "Textarea", 
           type: 'textarea', 
           height: 200
       }
    }    
});
```



### items

Commands to show in a sub-menu. You can nest as many as you like.

`items`: `object` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    items: {
       // <select>
       myItemWithSubmenu: {
           name: "Textarea", 
           {
                items {
                    mySubmenu {
                        name: "Command 1"
                        callback: function(key, opt){ 
                            alert("Clicked on " + key); 
                        }
                    }
                }
           }
       }
    }    
});
```


### accesskey

Character(s) to be used as accesskey. 

Considering `a b c` $.contextMenu will first try to use »a« as the accesskey, if already taken, it'll fall through to »b«. Words are reduced to the first character, so »hello world« is treated as »h w«.

Note: Accesskeys are treated unique throughout one menu. This means an item in a sub-menu can't occupy the same accesskey as an item in the main menu.

`accesskey`: `string` 

#### Example
```javascript
$.contextMenu({
    selector: 'span.context-menu',
    accesskey: 'a'
    callback: function(itemKey, opt){ 
        alert('I pressed a!');
    }
});
```
