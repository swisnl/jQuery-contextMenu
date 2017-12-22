'use strict';
import '../sass/jquery.contextMenu.scss';

import ContextMenuManager from './modules/ContextMenuManager';
import defaults from './defaults';
import ContextMenuEventHandler from './modules/ContextMenuEventHandler';
import ContextMenuOperations from './modules/ContextMenuOperations';

import {setInputValues, getInputValues} from './helpers';
import fromMenu from './modules/html5builder';
import elementFunction from './modules/jqueryContextMenuFunction';
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
 * @property {fromMenu} fromMenu
 * @property {ContextMenuSettings} defaults
 * @property {ContextMenuEventHandler} handle
 * @property {ContextMenuOperations} operations
 * @property {Object<string, ContextMenuData>} menus
 */
const menus = {};
const namespaces = {};
const operations = new ContextMenuOperations();
const handler = new ContextMenuEventHandler();
const manager = new ContextMenuManager(defaults, handler, operations, menus, namespaces);


// manage contextMenu instances
let contextMenu = function (operation, options) {
    manager.create(operation, options);
};

contextMenu.manager = manager;
contextMenu.setInputValues = setInputValues;
contextMenu.getInputValues = getInputValues;
contextMenu.fromMenu = fromMenu;

// make defaults accessible
contextMenu.defaults = defaults;
contextMenu.types = defaults.types;

// export internal functions - undocumented, for hacking only!
contextMenu.handle = handler;
contextMenu.operations = operations;
contextMenu.menus = menus;
contextMenu.namespaces = namespaces;

$.fn.contextMenu = elementFunction;
$.contextMenu = contextMenu;
