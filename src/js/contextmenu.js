'use strict';
import '../sass/jquery.contextMenu.scss';
import ContextMenu from './classes/ContextMenu';
import ContextMenuItemTypes from './classes/ContextMenuItemTypes';
import elementFunction from './jquery/contextMenuFunction';

/**
 * The jQuery namespace.
 * @external "jQuery"
 * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
 */

/**
 * @class jQuery.contextMenu
 * @function external:jQuery.contextMenu
 * @instance
 *
 * @param {string} operation
 * @param {ContextMenuOptions} options
 *
 * @property {ContextMenu} manager
 * @property {getInputValues} getInputValues
 * @property {setInputValues} setInputValues
 * @property {fromMenu} ContextMenuHtml5Builder#fromMenu
 * @property {ContextMenuOptions} defaults
 * @property {ContextMenuEventHandler} handle
 * @property {ContextMenuOperations} operations
 * @property {Object<string, ContextMenuData>} menus
 */
const manager = new ContextMenu();

// manage contextMenu instances
let contextMenu = function (operation, options) {
    manager.execute(operation, options);
};

contextMenu.getInputValues = function (currentMenuData, data) {
    return manager.getInputValues(currentMenuData, data);
};
contextMenu.setInputValues = function (currentMenuData, data) {
    return manager.getInputValues(currentMenuData, data);
};
contextMenu.fromMenu = function (element) {
    return manager.html5builder.fromMenu(element);
};

// make defaults accessible
contextMenu.defaults = manager.defaults;
contextMenu.types = manager.defaults.types;
contextMenu.manager = manager;

// export internal functions - undocumented, for hacking only!
contextMenu.handle = manager.handler;
contextMenu.operations = manager.operations;
contextMenu.menus = manager.menus;
contextMenu.namespaces = manager.namespaces;

$.fn.contextMenu = elementFunction;
$.contextMenu = contextMenu;

module.exports = {ContextMenu, ContextMenuItemTypes};
