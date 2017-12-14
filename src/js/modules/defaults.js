let defaults = {
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

    // determine position to show menu at
    determinePosition: function ($menu) {
        // position to the lower middle of the trigger element
        if ($.ui && $.ui.position) {
            // .position() is provided as a jQuery UI utility
            // (...and it won't work on hidden elements)
            $menu.css('display', 'block').position({
                my: 'center top',
                at: 'center bottom',
                of: this,
                offset: '0 5',
                collision: 'fit'
            }).css('display', 'none');
        } else {
            // determine contextMenu position
            const offset = this.offset();
            offset.top += this.outerHeight();
            offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
            $menu.css(offset);
        }
    },
    // position menu
    position: function (opt, x, y) {
        const $window = $(window);
        let offset;
        // determine contextMenu position
        if (!x && !y) {
            opt.determinePosition.call(this, opt.$menu);
            return;
        } else if (x === 'maintain' && y === 'maintain') {
            // x and y must not be changed (after re-show on command click)
            offset = opt.$menu.position();
        } else {
            // x and y are given (by mouse event)
            const offsetParentOffset = opt.$menu.offsetParent().offset();
            offset = {top: y - offsetParentOffset.top, left: x - offsetParentOffset.left};
        }

        // correct offset if viewport demands it
        const bottom = $window.scrollTop() + $window.height();
        const right = $window.scrollLeft() + $window.width();
        const height = opt.$menu.outerHeight();
        const width = opt.$menu.outerWidth();

        if (offset.top + height > bottom) {
            offset.top -= height;
        }

        if (offset.top < 0) {
            offset.top = 0;
        }

        if (offset.left + width > right) {
            offset.left -= width;
        }

        if (offset.left < 0) {
            offset.left = 0;
        }

        opt.$menu.css(offset);
    },
    // position the sub-menu
    positionSubmenu: function ($menu) {
        if (typeof $menu === 'undefined') {
            // When user hovers over item (which has sub items) handle.focusItem will call this.
            // but the submenu does not exist yet if opt.items is a promise. just return, will
            // call positionSubmenu after promise is completed.
            return;
        }
        if ($.ui && $.ui.position) {
            // .position() is provided as a jQuery UI utility
            // (...and it won't work on hidden elements)
            $menu.css('display', 'block').position({
                my: 'left top-5',
                at: 'right top',
                of: this,
                collision: 'flipfit fit'
            }).css('display', '');
        } else {
            // determine contextMenu position
            const offset = {
                top: -9,
                left: this.outerWidth() - 5
            };
            $menu.css(offset);
        }
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
    types: {}
};

export default defaults;
