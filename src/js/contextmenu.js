'use strict';
import '../sass/jquery.contextMenu.scss';

import Manager from './modules/manager';
import defaults from './defaults';
import handler from './modules/handler';
import operations from './modules/operations';

import {setInputValues, getInputValues} from './modules/helper-functions';
import fromMenu from './modules/html5builder';
import elementFunction from './modules/element';

const menus = {};
const namespaces = {};
const manager = new Manager(defaults, handler, operations, menus, namespaces);

// manage contextMenu instances
let contextMenu = function (arg) {
    manager.manage(arg);
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
