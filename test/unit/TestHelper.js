
export default class TestHelper {
    constructor(itemClickEvent) {
        this.itemClickEvent = itemClickEvent;
    }

    createContextMenu(items, classname = 'context-menu') {
        if (typeof (classname) === 'undefined') {
            classname = 'context-menu';
        }
        var $fixture = $('#qunit-fixture');

        // ensure `#qunit-fixture` exists when testing with karma runner
        if ($fixture.length === 0) {
            $('<div id="qunit-fixture">').appendTo('body');
            $fixture = $('#qunit-fixture');
        }

        $fixture.append("<div class='" + classname + "'>right click me!</div>");

        if (!items) {
            items = {
                copy: {name: 'Copy', icon: 'copy'},
                paste: {name: 'Paste', icon: 'paste'}
            };
        }

        /**
         *
         * @type {{show: sinon.spy, hide: sinon.spy, callback: sinon.spy}}
         */
        const spies = {
            show: sinon.spy(),
            hide: sinon.spy(),
            callback: sinon.spy()
        };

        $.contextMenu({
            selector: '.' + classname,
            events: {
                show: spies.show,
                hide: spies.hide
            },
            callback: spies.callback,
            items: items,
            itemClickEvent: this.itemClickEvent
        });

        return spies;
    }

    // after each test
    destroyContextMenuAndCleanup() {
        $.contextMenu('destroy');

        // clean up `#qunit-fixture` when testing in karma runner
        const $fixture = $('#qunit-fixture');
        if ($fixture.length) {
            $fixture.html('');
        }
    }
}
