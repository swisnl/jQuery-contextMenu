import {determinePosition, positionSubmenu, position} from './position';

/**
 * @class ContextMenuData
 * @augments ContextMenuOptions
 * @instance
 * @interface
 *
 * @property {JQuery} $menu - The menu element for this menu part. Eg. the root menu, or a single submenu.
 * @property {JQuery} $layer - The opened layer when the menu is opened.
 * @property {JQuery} $node - The menu node.
 * @property {JQuery} $trigger - The element that triggered opening the menu.
 * @property {JQuery} $selected - Reference to the `<li>` command element.
 * @property {JQuery} $input - Reference to the `<input>` or `<select>` of the command element.
 * @property {JQuery} $label - Reference to the `<input>` or `<select>` of the command element.
 * @property {string} ns - The namespace (including leading dot) all events for this contextMenu instance were registered under.
 * @property {ContextMenu} manager - The contextmenu manager instance.
 * @property {JQuery|jQuery|null} $selected - Currently selected menu item, or input inside menu item.
 * @property {?boolean} hasTypes - The menu has ContextMenuItem which are of a selectable type.
 * @property {?boolean} isInput - We are currently originating events from an input.
 * @property {Object<string, ContextMenuItem>} inputs - Inputs defined in the menu.
 * @property {Object<string, ContextMenuItemTypeCallback>} types - Custom ContextMenuItemTypes, key is the {@link ContextMenuItem} type property, value is a {@link ContextMenuItemTypeCallback} callback.
 *
 * @property {boolean} hovering Currently hovering, root menu only.
 */

/**
 * @class ContextMenuOptions
 * @instance
 * @interface
 * @classdesc
 ## Register new contextMenu

 To register a new contextMenu:

 ```javascript
 $.contextMenu( contextMenuOptions );
 ```

 ## Update contextMenu state

 It is possible to refresh the state of the contextmenu [disabled](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#disabled), [visibility](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#visible), [icons](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#icon) and [input values](https://swisnl.github.io/jQuery-contextMenu/docs/items.html#type) through the `update` command. This will reevaluate any custom callbacks.

 ```javascript
 $('.context-menu-one').contextMenu('update'); // update single menu
 $.contextMenu('update') // update all open menus
 ```

 * @property {null|string} selector - Selector on which the contextMenu triggers.
 * @property {Object.<string, ContextMenuItem>} items - Object with items to be listed in contextMenu. See {@link ContextMenuItem} for a full documentation on how to build your menu items.
 * @property {JQuery.Selector|DOMElement} [appendTo=document.body] - Specifies the selector `string` or `DOMElement` the generated menu is to be appended to.
 * @property {('right'|'left'|'hover'|'touchstart'|'none')} trigger=left - Method to trigger context menu ["right", "left", "hover", "touchstart", "none"].
 * @property {?string} itemClickEvent - Allows the selection of the click event instead of the mouseup event to handle the user mouse interaction with the contexMenu. The default event is `mouseup`. Set the option to `"click"` to change to the `click` event.

 This option is global: the first contexMenu registered sets it. To change it afterwards all the contextMenu have to be unregistered with `$.contextMenu( 'destroy' );` before the change has effect again.

 * @property {boolean} hideOnSecondTrigger=false - Flag denoting if a second trigger should close the menu, as long as the trigger happened on one of the trigger-element's child nodes. This overrides the reposition option.
 * @property {boolean} selectableSubMenu=false - Ability to select ContextMenuItem containing a submenu.
 * @property {boolean} reposition=true - flag denoting if a second trigger should simply move (`true`) or rebuild (`false`) an open menu as long as the trigger happened on one of the trigger-element's child nodes
 * @property {number} delay=200 - ms to wait before showing a hover-triggered context menu.
 * @property {boolean} autoHide=true - Hide menu when mouse leaves trigger / menu elements.
 * @property {number|Function} zIndex=1 - offset to add to zIndex
 * @property {string} className - Class to be appended to the root menu.
 * @property {Object} classNames - Default classname configuration to be able avoid conflicts in frameworks.
 * @property {string} classNames.hover=context-menu-hover
 * @property {string} classNames.disabled=context-menu-disabled
 * @property {string} classNames.visible=context-menu-visible
 * @property {string} classNames.notSelectable=context-menu-not-selectable
 * @property {string} classNames.icon=context-menu-icon
 * @property {string} classNames.iconEdit=context-menu-icon-edit
 * @property {string} classNames.iconCut=context-menu-icon-cut
 * @property {string} classNames.iconCopy=context-menu-icon-copy
 * @property {string} classNames.iconPaste=context-menu-icon-paste
 * @property {string} classNames.iconDelete=context-menu-icon-delete
 * @property {string} classNames.iconAdd=context-menu-icon-add
 * @property {string} classNames.iconQuit=context-menu-icon-quit
 * @property {string} classNames.iconLoadingClass=context-menu-icon-loading
 * @property {Object} animation - Animation settings
 * @property {number} animation.duration=50
 * @property {string} animation.show='slideDown'
 * @property {string} animation.hide='slideUp'
 * @property {Object} events - Event callbacks. This is the trigger element, first argument is the event, and the second argumant {@link ContextMenuData}.
 * @property {Function} events.show - Called when contextmenu is shown.
 * @property {Function} events.hide - Called when contextmenu is hidden.
 * @property {Function} events.activated - Called when contextmenu is activated.
 * @property {ContextMenuItemCallback} callback - Global callback called then a {@link ContextMenuItem} is clicked.
 * @property {ContextMenuBuildCallback} build=false
 * @property {(position)} position - Callback to override the position of the context menu. The function is executed in the context of the trigger object.

 The first argument is a jQuery.Event. The second argument is the {@link ContextMenuData} object, which has a `$menu` property with the menu that needs to be positioned. The third and fourth arguments are `x` and `y` coordinates provided by the show event.

 The `x` and `y` may either be integers denoting the offset from the top left corner, undefined, or the string "maintain". If the string "maintain" is provided, the current position of the `$menu` must be used. If the coordinates are `undefined`, appropriate coordinates must be determined. An example of how this can be achieved is provided with {@link determinePosition}.

 * @property {(determinePosition)} determinePosition
 * @property {(positionSubmenu)} positionSubmenu - Callback tha positions a submenu
 * @property {boolean} _hasContext - Set to true if the call was done from an element.
 */
export default {
    selector: null,

    // where to append the menu to
    appendTo: null,

    // method to trigger context menu ["right", "left", "hover"]
    trigger: 'right',

    // hide menu when mouse leaves trigger / menu elements
    autoHide: false,

    // ms to wait before showing a hover-triggered context menu
    delay: 200,

    // flag denoting if a second trigger should simply move (true) or rebuild (false) an open menu
    // as long as the trigger happened on one of the trigger-element's child nodes
    reposition: true,

    // Flag denoting if a second trigger should close the menu, as long as
    // the trigger happened on one of the trigger-element's child nodes.
    // This overrides the reposition option.
    hideOnSecondTrigger: false,

    // ability to select submenu
    selectableSubMenu: false,

    className: '',

    // Default classname configuration to be able avoid conflicts in frameworks
    classNames: {
        hover: 'context-menu-hover', // Item hover
        disabled: 'context-menu-disabled', // Item disabled
        visible: 'context-menu-visible', // Item visible
        notSelectable: 'context-menu-not-selectable', // Item not selectable

        icon: 'context-menu-icon',
        iconEdit: 'context-menu-icon-edit',
        iconCut: 'context-menu-icon-cut',
        iconCopy: 'context-menu-icon-copy',
        iconPaste: 'context-menu-icon-paste',
        iconDelete: 'context-menu-icon-delete',
        iconAdd: 'context-menu-icon-add',
        iconQuit: 'context-menu-icon-quit',
        iconLoadingClass: 'context-menu-icon-loading'
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
        hide: $.noop,
        activated: $.noop
    },

    // default callback
    callback: null,

    // list of contextMenu items
    items: {},

    // Build callback for creating a menu dynamicly
    build: false,

    types: {},

    // determine position to show menu at
    determinePosition,

    // position menu
    position,

    // position the sub-menu
    positionSubmenu
};
