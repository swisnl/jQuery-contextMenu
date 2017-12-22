'use strict';
import '../sass/jquery.contextMenu.scss';

import ContextMenuManager from './classes/ContextMenuManager';
import defaults from './defaults';
import ContextMenuEventHandler from './classes/ContextMenuEventHandler';
import ContextMenuOperations from './classes/ContextMenuOperations';
import ContextMenuHtml5Builder from './classes/ContextMenuHtml5Builder';
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
 * @param {ContextMenuSettings} options
 *
 * @property {ContextMenuManager} manager
 * @property {getInputValues} getInputValues
 * @property {setInputValues} setInputValues
 * @property {fromMenu} ContextMenuHtml5Builder#fromMenu
 * @property {ContextMenuSettings} defaults
 * @property {ContextMenuEventHandler} handle
 * @property {ContextMenuOperations} operations
 * @property {Object<string, ContextMenuData>} menus
 */
const menus = {};
const namespaces = {};
const operations = new ContextMenuOperations();
const handler = new ContextMenuEventHandler();
const html5builder = new ContextMenuHtml5Builder();
const manager = new ContextMenuManager(defaults, handler, operations, menus, namespaces);

// manage contextMenu instances
let contextMenu = function (operation, options) {
    manager.create(operation, options);
};

contextMenu.getInputValues = function (opt, data) {
    return manager.getInputValues(opt, data);
};
contextMenu.setInputValues = function (opt, data) {
    return manager.getInputValues(opt, data);
};
contextMenu.fromMenu = function (element) {
    return html5builder.build(element);
};

// make defaults accessible
contextMenu.defaults = defaults;
contextMenu.types = defaults.types;
contextMenu.manager = manager;

// export internal functions - undocumented, for hacking only!
contextMenu.handle = handler;
contextMenu.operations = operations;
contextMenu.menus = menus;
contextMenu.namespaces = namespaces;

$.fn.contextMenu = elementFunction;
$.contextMenu = contextMenu;
