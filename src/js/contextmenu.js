'use strict';
import '../sass/jquery.contextMenu.scss';

import ContextMenuManager from './modules/ContextMenuManager';
import defaults from './defaults';
import ContextMenuEventHandler from './modules/ContextMenuEventHandler';
import ContextMenuOperations from './modules/ContextMenuOperations';

import {setInputValues, getInputValues} from './helpers';
import fromMenu from './modules/html5builder';
import elementFunction from './modules/jqueryContextMenuFunction';

const menus = {};
const namespaces = {};
const handler = new ContextMenuEventHandler();
const operations = new ContextMenuOperations(handler);
handler.operations = operations;

const manager = new ContextMenuManager(defaults, handler, operations, menus, namespaces);

// manage contextMenu instances
let contextMenu = function (operation, options) {
    manager.execute(operation, options);
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
contextMenu.op = operations;
contextMenu.menus = menus;
contextMenu.namespaces = namespaces;

$.fn.contextMenu = elementFunction;
$.contextMenu = contextMenu;
