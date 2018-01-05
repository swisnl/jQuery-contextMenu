/**
 * Specifies the icon class to set for the item.
 *
 * When using a string icons must be defined in CSS with selectors like `.context-menu-item.context-menu-icon-edit`, where edit is the icon class specified.
 *
 * When using a callback you can return a class string to use that as the class on the item. You can also modify the element by using the $itemElement argument.
 *
 * @example
 * var items = {
    firstCommand: {
        name: "Copy",
        icon: function(e, $itemElement, itemKey, item, currentMenuData, rootMenuData){
            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
            $itemElement.html('<span class="glyphicon glyphicon-star" aria-hidden="true"></span> ' + currentMenuData.selector);

            // Add the context-menu-icon-updated class to the item
            return 'context-menu-icon-updated';
        }
    },
    secondCommand: {
        name: "Paste",
        icon: "paste" // Class context-menu-icon-paste is used on the menu item.
    }
}
 *
 * @callback ContextMenuIconCallback
 * @param {ContextMenuEvent|JQuery.Event} e
 * @param {JQuery} $item - Item element
 * @param {string} key - Item key
 * @param {ContextMenuItem} item
 * @param {ContextMenuData} currentMenuData
 * @param {ContextMenuData} rootMenuData
 */

/**
 * The Callback is executed in the context of the triggering object.
 *
 * @callback ContextMenuItemCallback
 * @param {JQuery.Event} e - Event that trigged the menu.
 * @param {string} key - Key of the menu item.
 * @param {ContextMenuData} currentMenuData - Data of the (sub)menu in which the item resides.
 * @param {ContextMenuData} rootMenuData - Data of the root menu in which the item resides. Might be the same as `currentMenuData` if triggered in the menu root.
 * @return {boolean}
 */

/**
 * @callback ContextMenuBuildCallback
 * @param {JQuery.Event} e - Event that trigged the menu.
 * @param {JQuery} $currentTrigger - Element that trigged the menu.
 * @return {ContextMenuOptions}
 */

/**
 * Runs in the scope of the `<li>` of the contextmenu.
 * @callback ContextMenuItemTypeCallback
 * @param {JQuery.Event} e - Event that trigged the menu.
 * @param {ContextMenuItem} item - Menu item
 * @param {ContextMenuData} currentMenuData - Data of the (sub)menu in which the item resides.
 * @param {ContextMenuData} rootMenuData - Data of the root menu in which the item resides. Might be the same as `currentMenuData` if triggered in the menu root.
 */
