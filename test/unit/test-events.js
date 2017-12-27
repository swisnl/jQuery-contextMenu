/* eslint-disable no-undef */
import TestHelper from './TestHelper';

function testQUnit(name, itemClickEvent, triggerEvent) {
    const testHelper = new TestHelper(itemClickEvent);

    QUnit.module(name, {
        afterEach: function () {
            testHelper.destroyContextMenuAndCleanup();
        }
    });

    QUnit.test('$.contextMenu object exists', function (assert) {
        assert.ok($.contextMenu, '$.contextMenu plugin is loaded');
        assert.notEqual($.contextMenu, undefined, '$.contextMenu is not undefined');
    });

    QUnit.test('open contextMenu', function (assert) {
        const spies = testHelper.createContextMenu();
        $('.context-menu').contextMenu();
        assert.equal(spies.show.callCount, 1, 'contextMenu was opened once');
    });

    QUnit.test('open contextMenu at 0,0', function (assert) {
        const spies = testHelper.createContextMenu();
        $('.context-menu').contextMenu({x: 0, y: 0});
        assert.equal(spies.show.callCount, 1, 'contextMenu was opened once');
    });

    QUnit.test('close contextMenu', function (assert) {
        const spies = testHelper.createContextMenu();
        let $context = $('.context-menu');
        $context.contextMenu();
        $context.contextMenu('hide');
        assert.equal(spies.hide.callCount, 1, 'contextMenu was closed once');
    });

    QUnit.test('navigate contextMenu items', function (assert) {
        const spies = testHelper.createContextMenu();
        let itemWasFocused = 0;
        let itemWasBlurred = 0;

        // listen to focus and blur events
        $(document.body)
            .on('contextmenu:focus', '.context-menu-item', function () {
                itemWasFocused++;
            })
            .on('contextmenu:blur', '.context-menu-item', function () {
                itemWasBlurred++;
            });

        $('.context-menu').contextMenu();

        const contextmenuData = spies.show.args[0][1];
        contextmenuData.$menu.trigger('nextcommand'); // triggers contextmenu:focus
        assert.equal(itemWasFocused, 1, 'first menu item was focused once');
        itemWasFocused = 0;

        contextmenuData.$menu.trigger('nextcommand'); // triggers contextmenu:blur & contextmenu:focus
        assert.equal(itemWasFocused, 1, 'first menu item was blurred');
        assert.equal(itemWasBlurred, 1, 'second menu item was focused');
    });

    QUnit.test('activate contextMenu item', function (assert) {
        const spies = testHelper.createContextMenu();
        $('.context-menu').contextMenu();

        const contextmenuData = spies.show.args[0][1];
        contextmenuData.$menu.trigger('nextcommand');
        contextmenuData.$selected.trigger(triggerEvent);

        assert.equal(spies.callback.callCount, 1, 'selected menu item was clicked once');
    });

    QUnit.test('do not open context menu with no visible items', function (assert) {
        const spiesOne = testHelper.createContextMenu({
            copy: {name: 'Copy', icon: 'copy'},
            paste: {name: 'Paste', icon: 'paste'}
        });
        const spiesTwo = testHelper.createContextMenu({
            copy: {name: 'Copy', icon: 'copy'},
            paste: {name: 'Paste', icon: 'paste'}
        }, 'context-menu-two');

        let $contextMenuOne = $('.context-menu');
        let $contextMenuTwo = $('.context-menu-two');

        $contextMenuOne.contextMenu();
        $contextMenuOne.contextMenu('hide');
        $contextMenuTwo.contextMenu();
        $contextMenuTwo.contextMenu('hide');

        assert.equal(spiesOne.show.callCount + spiesTwo.show.callCount, 2, 'contextMenu was opened twice');

        $contextMenuTwo.contextMenu('destroy');

        $contextMenuOne.contextMenu();
        $contextMenuOne.contextMenu('hide');
        $contextMenuTwo.contextMenu();
        $contextMenuTwo.contextMenu('hide');

        assert.equal(spiesOne.show.callCount + spiesTwo.show.callCount, 3, 'destroyed contextMenu was not opened');
    });

    QUnit.test('do not open context menu with no visible items', function (assert) {
        const spies = testHelper.createContextMenu({
            copy: {name: 'Copy', icon: 'copy', visible: function () { return false; }},
            paste: {name: 'Paste', icon: 'paste', visible: function () { return false; }}
        });
        $('.context-menu').contextMenu();

        assert.equal(spies.show.callCount, 0, 'selected menu wat not opened');
    });

    QUnit.test('can create a menu async', function (assert) {
        $('#qunit-fixture').append("<div class='context-menu-one'>right click me!</div>");

        const spies = {
            show: sinon.spy(),
            hide: sinon.spy(),
            callback: sinon.spy()
        };

        // some build handler to call asynchronously
        function createSomeMenu() {
            return {
                callback: spies.callback,
                items: {
                    'edit': {name: 'Edit', icon: 'edit'},
                    'cut': {name: 'Cut', icon: 'cut'},
                    'copy': {name: 'Copy', icon: 'copy'}
                }
            };
        }

        // some asynchronous click handler
        let $contextmenu = $('.context-menu-one');
        $contextmenu.on('mouseup click', function () {
            const $this = $(this);
            // store a callback on the trigger
            $this.data('runCallbackThingie', createSomeMenu);
            const _offset = $this.offset();
            const position = {
                x: _offset.left + 10,
                y: _offset.top + 10
            };

            // open the contextMenu asynchronously
            setTimeout(function () { $this.contextMenu(position); }, 100);
        });

        // setup context menu
        $.contextMenu({
            selector: '.context-menu-one',
            trigger: 'none',
            build: function (e, $trigger) {
                e.preventDefault();

                // pull a callback from the trigger
                return $trigger.data('runCallbackThingie')();
            },
            events: {
                show: spies.show,
                hide: spies.hide
            },
            callback: spies.callback
        });

        let done = assert.async();
        $contextmenu.trigger('click');

        setTimeout(function () {
            assert.equal(spies.show.calledOnce, true);

            const contextmenuData = spies.show.args[0][1];
            assert.equal(contextmenuData.$menu.find('li').length, 3);
            done();
        }, 1000)
    });

    QUnit.test('items in seconds submenu to not override callbacks', function (assert) {
        let firstCallback = false;
        let firstSubCallback = false;
        let secondSubCallback = false;

        testHelper.createContextMenu({
            firstitem: {
                name: 'firstitem',
                icon: 'copy',
                callback: function () {
                    firstCallback = true;
                }
            },
            firstsubmenu: {
                name: 'Copy',
                icon: 'copy',
                items: {
                    firstitem: {
                        name: 'firstitem',
                        icon: 'copy',
                        callback: function () {
                            firstSubCallback = true;
                        }
                    }
                }
            },
            secondsubmenu: {
                name: 'Copy',
                icon: 'copy',
                items: {
                    firstitem: {
                        name: 'firstitem',
                        icon: 'copy',
                        callback: function () {
                            secondSubCallback = true;
                        }
                    }
                }
            }
        });
        $('.context-menu-item').first().trigger(triggerEvent);
        $('.context-menu-submenu .context-menu-item').each(function (i, e) {
            $(e).trigger(triggerEvent)
        });

        assert.equal(firstCallback, 1);
        assert.equal(firstSubCallback, 1);
        assert.equal(secondSubCallback, 1);
    });
}

testQUnit('contextMenu events', '', 'mouseup');
testQUnit('contextMenu events - click handler', 'click', 'click');
