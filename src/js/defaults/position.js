/**
 * Determine the position for a root menu.
 * @memberOf ContextMenuOptions
 * @function ContextMenuOptions#determinePosition
 * @param {(JQuery)} $menu
 */
export function determinePosition($menu) {
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
}

/**
 * Position the root menu.
 * @memberOf ContextMenuOptions
 * @function ContextMenuOptions#position
 * @param {JQuery.Event} e
 * @param {ContextMenuData} currentMenuData
 * @param {(number|string)} x
 * @param {(number|string)} y
 */
export function position(e, currentMenuData, x, y) {
    const $window = $(window);
    let offset;
    // determine contextMenu position
    if (!x && !y) {
        currentMenuData.determinePosition.call(this, currentMenuData.$menu);
        return;
    } else if (x === 'maintain' && y === 'maintain') {
        // x and y must not be changed (after re-show on command click)
        offset = currentMenuData.$menu.position();
    } else {
        // x and y are given (by mouse event)
        const offsetParentOffset = currentMenuData.$menu.offsetParent().offset();
        offset = {top: y - offsetParentOffset.top, left: x - offsetParentOffset.left};
    }

    // correct offset if viewport demands it
    const bottom = $window.scrollTop() + $window.height();
    const right = $window.scrollLeft() + $window.width();
    const height = currentMenuData.$menu.outerHeight();
    const width = currentMenuData.$menu.outerWidth();

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

    currentMenuData.$menu.css(offset);
}

/**
 * Position a submenu.
 * @memberOf ContextMenuOptions
 * @function ContextMenuOptions#positionSubmenu
 * @param {JQuery.Event} e
 * @param {JQuery} $menu
 */
// position the sub-menu
export function positionSubmenu(e, $menu) {
    if (typeof $menu === 'undefined') {
        // When user hovers over item (which has sub items) handle.focusItem will call this.
        // but the submenu does not exist yet if ContextMenuData.items is a promise. just return, will
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
}
