/**
 * @class ContextMenuItem
 * @instance
 * @interface
 * @classdesc The items map contains the commands to list in the menu. Each command has a unique key identifying an item object. The value may either be an item (properties explained below), or a string (which will insert a separator, disregarding the string's content). It is also possible to define a seperator the same as an item, and use the `type`:`cm_separator` to define it.

 ```javascript
 var items = {
  firstCommand: itemOptions,
  separator1: "-----",
  separator2: { "type": "cm_separator" },
  command2: itemOptions,
  submenu: {
    type: "submenu"
    submenuItem1: itemOptions,
    submenuItem2: itemOptions,
  }
}
 ```

 Since 2.3 it is also possible to use a promise as item, so you can build submenu's based on a snynchronous promis.

 Check out the [demo using a promise](demo/async-promise.md) for an example how to use this. The example uses jQuery deferred, but any promise should do. Promised can only be used in combination with the [build option](docs#build).

 *
 * @property {ContextMenuItemTypes|string} type - Specifies the type of the command. See {@link ContextMenuItemTypes}.
 * @property {string} name - Specify the human readable name of the command in the menu. This is used as the label for the option.
 * @property {boolean} isHtmlName - Should this item be called with .html() instead of .text(). Cannot be used with the accesskey option in the same item.
 * @property {Object.<string,ContextMenuItem>} items Object containing the menu items for creating a submenu.
 * @property {string} className - Specifies additional classNames to add to the menu item. Seperate multiple classes by using spaces.
 * @property {ContextMenuItemCallback} callback - Specifies the callback to execute if the item is clicked.
 * @property {ContextMenuIconCallback|string} icon - Specifies the icon class to set for the item. When using a string icons must be defined in CSS with selectors like `.context-menu-item.context-menu-icon-edit`, where edit is the icon class specified. When using a callback you can return a class string to use that as the class on the item. You can also modify the element by using the $itemElement argument.
 * @property {ContextMenuItemCallback|boolean} disabled - Specifies if the command is disabled (`true`) or enabled (`false`). May be a callback returning a `boolean`.
 * @property {ContextMenuItemCallback|boolean} visible - Specifies if the command is visible (`true`) or hidden (`false`). May be a callback returning a `boolean`.
 * @property {string} accesskey - Character(s) to be used as accesskey.

 Considering `a b c` $.contextMenu will first try to use »a« as the accesskey, if already taken, it'll fall through to `b`. Words are reduced to the first character, so `hello world` is treated as `h w`.

 Note: Accesskeys are treated unique throughout one menu. This means an item in a sub-menu can't occupy the same accesskey as an item in the main menu.
 *
 * @property {?JQuery} $input - The input element if it was build for this item.
 * @property {Object<string, Function>} events - Events to register on a {@link ContextMenuItem}. The contents of the options object are passed as jQuery `e.data`.
 * @property {string} value - The value of the `<input>` element.
 * @property {boolean|string} selected - The selected option of a `select` element and the checked property for `checkbox` and `radio` {@link ContextMenuItemTypes}.
 * @property {string} radio - Specifies the group of the `radio` element.
 * @property {string} options - Specifies the options of the `select` element.
 * @property {Number} height - The height in pixels `<textarea>` element. If not specified, the height is defined by CSS.
 */

/**
 * Possible ContextMenuItem types
 * @enum string
 */
const ContextMenuItemTypes = {
    /**
     * The command is a simple clickable item.
     */
    simple: '',

    /**
     * Makes the command an &lt;input&gt; of type text. The name followed by the &lt;input&gt; are encapsulated in a &lt;label&gt;.
     */
    text: 'text',

    /**
     * Makes the command a &lt;textarea&gt;. The name followed by the &lt;textarea&gt; are encapsulated in a &lt;label&gt;.
     */
    textarea: 'textarea',

    /**
     * Makes the command an &lt;input&gt; of type checkbox. The name followed by the &lt;input&gt; are encapsulated in a &lt;label&gt;.
     */
    checkbox: 'checkbox',

    /**
     * Makes the command an &lt;input&gt; of type radio. The name followed by the &lt;input&gt; are encapsulated in a &lt;label&gt;.
     */
    radio: 'radio',

    /**
     * Makes the command aa &lt;select&gt;. The name followed by the &lt;select&gt; are encapsulated in a &lt;label&gt;.
     */
    select: 'select',

    /**
     * Makes an non-command element. When you select `type: 'html'` add the html to the html property. So: `{ item: { type: 'html', html: '<span>html!</span>' } }`. You can also just use the item name with the `isHtmlName` property.
     */
    html: 'html',

    /**
     * Internal property, used internally when the type is set to a string.
     */
    separator: 'cm_separator',

    /**
     * Internal property for a {@link ContextMenuItem} that has an `items` property with other {@link ContextMenuItem} items.
     */
    submenu: 'sub'
};

export default ContextMenuItemTypes;
