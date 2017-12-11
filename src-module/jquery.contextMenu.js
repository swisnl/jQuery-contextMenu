(function(global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            return factory($, global, global.document);
        });
    } else if (typeof exports === "object" && exports) {
        module.exports = factory(require('jquery'), global, global.document);
    } else {
        factory(jQuery, global, global.document);
    }
})(typeof window !== 'undefined' ? window : this, function($, window, document, undefined) {
    'use strict';

    let Manager = require('./modules/managerclass').default;
    let manager = new Manager();

    // manage contextMenu instances
    let contextMenu = function(arg) {
        manager.manager(arg);
    };

    contextMenu.setInputValues = require('./modules/inputvalues').setInputValues;
    contextMenu.getInputValues = require('./modules/inputvalues').getInputValues;

    contextMenu.fromMenu = require('./modules/html5').default;


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
    window.$.contextMenu = contextMenu;

});