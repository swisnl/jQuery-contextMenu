---
currentMenu: input-helpers
---

# Helpers

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Import values for `<input>`](#import-values-for-input)
- [Export values from `<input>`](#export-values-from-input)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Import values for `<input>`

To fill input commands with values from a map:

```
{events: {
    hide: function(opt){ 
      $.contextMenu.getInputValues(opt, {command1: "foo", command2: "bar"}); 
    }
  }
}
```

To fill input commands with values from data-attributes:

```
{events: {
  hide: function(opt){ 
    $.contextMenu.getInputValues(opt, this.data());
    }
  }
}
```

## Export values from `<input>`

To fetch values from input commands:

```
{events: {
  hide: function(opt){ 
    var values = $.contextMenu.setInputValues(opt}
  }
}
```

To save values from input commands to data-attributes:

```
{events: {
  hide: function(opt){ 
    $.contextMenu.setInputValues(opt, this.data()); }
  }
}
```

