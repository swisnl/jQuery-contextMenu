'use strict';
import $ from "jquery";
import Manager from "./modules/manager";
import {setInputValues, getInputValues} from "./modules/inputvalues";
import fromMenu from "./modules/html5";

import '../src/sass/jquery.contextMenu.scss';

const manager = new Manager();
// manage contextMenu instances
let contextMenu = function (arg) {
    manager.manager(arg);
};

contextMenu.setInputValues = setInputValues;
contextMenu.getInputValues = getInputValues;
contextMenu.fromMenu = fromMenu;

//@todo deze zijn nu niet toegankelijk?
// make defaults accessible
contextMenu.defaults = manager.defaults;
contextMenu.types = manager.defaults.types;

// export internal functions - undocumented, for hacking only!
contextMenu.handle = manager.handle;
contextMenu.op = manager.op;
contextMenu.menus = manager.menus;

$.fn.contextMenu = contextMenu;
$.contextMenu = contextMenu;
