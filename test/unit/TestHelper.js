/** @global sinon **/
export default class TestHelper {
    classname;
    spies;
    items;
    $contextmenu;
    options;

    constructor(items = false, extraOptions = {}, classname = 'context-menu') {

        this.spies = {
            events: {
                show: sinon.spy(),
                hide: sinon.spy()
            },
            callback: sinon.spy()
        };

        if (!items) {
            items = TestHelper.simpleMenuItems();
        }
        this.items = items;
        this.$contextmenu = null;

        this.classname = classname;
        let options = this.defaultOptions(this.classname, items);
        this.options = $.extend(true, options, this.spies, extraOptions);
    }

    /**
     * @returns {ContextMenuData}
     */
    getContextMenuDataFromShow() {
        return this.spies.events.show.args[0][1];
    }

    setClickEvent(itemClickEvent) {
        this.options.itemClickEvent = itemClickEvent;
    }

    /**
     * @returns {{copy: {name: string, icon: string}, paste: {name: string, icon: string}}}
     */
    static simpleMenuItems() {
        return {
            copy: {name: 'Copy', icon: 'copy'},
            paste: {name: 'Paste', icon: 'paste'}
        };
    }

    createContextMenu() {
        let $fixture = $('#qunit-fixture');
        // ensure `#qunit-fixture` exists when testing with karma runner
        if ($fixture.length === 0) {
            $('<div id="qunit-fixture">').appendTo('body');
            $fixture = $('#qunit-fixture');
        }

        $fixture.append("<div class='" + this.classname + "'>right click me!</div>");

        this.$contextmenu = $fixture.find('.' + this.classname);

        $.contextMenu(this.options);
    }

    defaultOptions(classname, items) {
        return {
            selector: '.' + classname,
            events: {
                show: this.spies.show,
                hide: this.spies.hide
            },
            callback: this.spies.callback,
            items: items
        };
    }
}
