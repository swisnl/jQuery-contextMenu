import {determinePosition, positionSubmenu, position} from './position';

/**
 * Default options for the context menu
 *
 * @type {{selector: null|string, appendTo: null|string, trigger: string, autoHide: boolean, delay: number, reposition: boolean, hideOnSecondTrigger: boolean, selectableSubMenu: boolean, classNames: {hover: string, disabled: string, visible: string, notSelectable: string, icon: string, iconEdit: string, iconCut: string, iconCopy: string, iconPaste: string, iconDelete: string, iconAdd: string, iconQuit: string, iconLoadingClass: string}, determinePosition: defaults.determinePosition, position: defaults.position, positionSubmenu: defaults.positionSubmenu, zIndex: number, animation: {duration: number, show: string, hide: string}, events: {show: _.noop|noop|*, hide: _.noop|noop|*, activated: _.noop|noop|*}, callback: null|function, items: {}, types: {}}}
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

    types: {},

    // determine position to show menu at
    determinePosition,

    // position menu
    position,

    // position the sub-menu
    positionSubmenu
};
