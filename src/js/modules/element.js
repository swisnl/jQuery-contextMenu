import handler from './event-handler';

/**
 * Function that is called when calling contextmenu on an element (eg. $('.contextmenu').contextMenu())
 * @param {(string|Object)} operation
 */
export default function (operation) {
    const $t = this;
    const $o = operation;
    if (this.length > 0) { // this is not a build on demand menu
        if (typeof operation === 'undefined') {
            this.first().trigger('contextmenu');
        } else if (typeof operation.x !== 'undefined' && typeof operation.y !== 'undefined') {
            this.first().trigger($.Event('contextmenu', {
                pageX: operation.x,
                pageY: operation.y,
                mouseButton: operation.button
            }));
        } else if (operation === 'hide') {
            const $menu = this.first().data('contextMenu') ? this.first().data('contextMenu').$menu : null;
            if ($menu) {
                $menu.trigger('contextmenu:hide');
            }
        } else if (operation === 'destroy') {
            $.contextMenu('destroy', {context: this});
        } else if ($.isPlainObject(operation)) {
            operation.context = this;
            $.contextMenu('create', operation);
        } else if (operation) {
            this.removeClass('context-menu-disabled');
        } else if (!operation) {
            this.addClass('context-menu-disabled');
        }
    } else {
        // eslint-disable-next-line no-undef
        $.each(menus, function () {
            if (this.selector === $t.selector) {
                $o.data = this;

                $.extend($o.data, {trigger: 'demand'});
            }
        });

        handler.contextmenu.call($o.target, $o);
    }

    return this;
}
