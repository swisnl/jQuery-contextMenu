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
