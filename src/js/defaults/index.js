import {determinePosition, positionSubmenu, position} from './position';

/**
 * @typedef {ContextMenuSettings} ContextMenuData
 *
 * @property {JQuery} $menu - The menu element for this menu part. Eg. the root menu, or a single submenu
 * @property {JQuery|jQuery} $layer - The opened layer when the menu is opened
 * @property {JQuery} $node - The menu item node
 * @property {JQuery} $trigger - The element that triggered opening the menu
 * @property {JQuery|null} $selected - Currently selected menu item, or input inside menu item
 * @property {?boolean} hasTypes - The menu has ContextMenuItem which are of a selectable type
 *
 * @property {boolean} hovering Currently hovering, root menu only.
 */

/**
 * @typedef {Object} ContextMenuItem
 *
 * @property {string} type
 * @property {string|Function} icon
 * @property {boolean} isHtmlName - Should this item be called with .html() instead of .text()
 *
 * @property {Object.<string,ContextMenuItem>} items
 */

/**
 * @callback ContextMenuBuildCallback
 * @param {jQuery.Event} e - Event that trigged the menu
 * @param {jQuery] $currentTrigger - Element that trigged the menu
 * @return {Object.<string,ContextMenuItem>}
 */

/**
 * @typedef {Object} ContextMenuSettings
 * @property {null|string} selector - selector of contextMenu trigger
 * @property {null|string} appendTo - where to append the menu to
 * @property {"right", "left", "hover"} trigger - method to trigger context menu ["right", "left", "hover"]
 * @property {boolean} autoHide - hide menu when mouse leaves trigger / menu elements
 * @property {Number} delay - ms to wait before showing a hover-triggered context menu
 * @property {boolean} reposition - flag denoting if a second trigger should simply move (true) or rebuild (false) an open menu as long as the trigger happened on one of the trigger-element's child nodes
 * @property {boolean} hideOnSecondTrigger - Flag denoting if a second trigger should close the menu, as long as the trigger happened on one of the trigger-element's child nodes. This overrides the reposition option.
 * @property {boolean} selectableSubMenu - ability to select submenu
 * @property {string} className - Class to be appended to the root menu.
 * @property {Object} classNames - Default classname configuration to be able avoid conflicts in frameworks
 * @property {string} classNames.hover - 'context-menu-hover'
 * @property {string} classNames.disabled - 'context-menu-disabled'
 * @property {string} classNames.visible - 'context-menu-visible'
 * @property {string} classNames.notSelectable - 'context-menu-not-selectable'
 * @property {string} classNames.icon - 'context-menu-icon',
 * @property {string} classNames.iconEdit - 'context-menu-icon-edit',
 * @property {string} classNames.iconCut - 'context-menu-icon-cut',
 * @property {string} classNames.iconCopy - 'context-menu-icon-copy',
 * @property {string} classNames.iconPaste - 'context-menu-icon-paste',
 * @property {string} classNames.iconDelete - 'context-menu-icon-delete',
 * @property {string} classNames.iconAdd - 'context-menu-icon-add',
 * @property {string} classNames.iconQuit - 'context-menu-icon-quit',
 * @property {string} classNames.iconLoadingClass - 'context-menu-icon-loading'
 * @property {Number} zIndex - offset to add to zIndex
 * @property {Object} animation - Animation settings
 * @property {Number} animation.duration - 50,
 * @property {string} animation.show - 'slideDown'
 * @property {string} animation.hide - 'slideUp'
 * @property {Object} events - Event callbacks
 * @property {Function} events.show
 * @property {Function} events.hide
 * @property {Function} events.activated
 * @property {Function} callback
 * @property {determinePosition|Function} determinePosition
 * @property {position|Function} position
 * @property {positionSubmenu|Function} positionSubmenu
 * @property {Object.<string, ContextMenuItem>} items
 * @property {ContextMenuBuildCallback} build
 */
export default {
    // selector of contextMenu trigger
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
