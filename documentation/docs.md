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

The selector matching the elements to trigger on. This option is mandatory.

`selector`: `string` jQuery selector

#### Example
```javascript
$.contextMenu({
   selector: '.context-menu'
});
```

### items

Items to be listed in contextMenu. See [items](#items) for a full explanation.

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
