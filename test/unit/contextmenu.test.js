/* eslint-disable no-undef */
import TestHelper from './TestHelper';

function testQUnit(name, itemClickEvent, triggerEvent) {
    function createMenu(items = false, extraOptions = {}, classname = 'context-menu') {
        let helper = new TestHelper(items, extraOptions, classname);
        helper.setClickEvent(itemClickEvent);
        helper.createContextMenu();
        return helper;
    }

    QUnit.module(name, {
        afterEach: function () {
            $.contextMenu('destroy');

            // clean up `#qunit-fixture` when testing in karma runner
            const $fixture = $('#qunit-fixture');
            if ($fixture.length) {
                $fixture.html('');
            }
        }
    });

    QUnit.test('$.contextMenu object exists', function (assert) {
        assert.ok($.contextMenu, '$.contextMenu plugin is loaded');
        assert.notEqual($.contextMenu, undefined, '$.contextMenu is not undefined');
    });

    QUnit.test('open contextMenu', function (assert) {
        let helper = createMenu();
        $('.context-menu').contextMenu();
        assert.equal(helper.spies.events.show.callCount, 1, 'contextMenu was opened once');
    });

    QUnit.test('open contextMenu at 0,0', function (assert) {
        let helper = createMenu();
        $('.context-menu').contextMenu({x: 0, y: 0});
        assert.equal(helper.spies.events.show.callCount, 1, 'contextMenu was opened once');
    });

    QUnit.test('close contextMenu', function (assert) {
        let helper = createMenu();
        let $context = $('.context-menu');
        $context.contextMenu();
        $context.contextMenu('hide');
        assert.equal(helper.spies.events.hide.callCount, 1, 'contextMenu was closed once');
    });

    QUnit.test('navigate contextMenu items', function (assert) {
        let helper = createMenu();
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

        const contextmenuData = helper.getContextMenuDataFromShow();
        contextmenuData.$menu.trigger('nextcommand'); // triggers contextmenu:focus
        assert.equal(itemWasFocused, 1, 'first menu item was focused once');
        itemWasFocused = 0;

        contextmenuData.$menu.trigger('nextcommand'); // triggers contextmenu:blur & contextmenu:focus
        assert.equal(itemWasFocused, 1, 'first menu item was blurred');
        assert.equal(itemWasBlurred, 1, 'second menu item was focused');
    });

    QUnit.test('activate contextMenu item', function (assert) {
        let helper = createMenu();
        $('.context-menu').contextMenu();

        const contextmenuData = helper.getContextMenuDataFromShow();
        contextmenuData.$menu.trigger('nextcommand');
        contextmenuData.$selected.trigger(triggerEvent);

        assert.equal(helper.spies.callback.callCount, 1, 'selected menu item was clicked once');
    });

    QUnit.test('do not open destroyed contextmenu', function (assert) {
        const menuOne = createMenu({
            copy: {name: 'Copy', icon: 'copy'},
            paste: {name: 'Paste', icon: 'paste'}
        });
        const menuTwo = createMenu({
            copy: {name: 'Copy', icon: 'copy'},
            paste: {name: 'Paste', icon: 'paste'}
        }, {}, 'context-menu-two');

        let $contextMenuOne = $('.context-menu');
        let $contextMenuTwo = $('.context-menu-two');

        $contextMenuOne.contextMenu();
        $contextMenuOne.contextMenu('hide');
        $contextMenuTwo.contextMenu();
        $contextMenuTwo.contextMenu('hide');

        assert.equal(menuOne.spies.events.show.callCount + menuTwo.spies.events.show.callCount, 2, 'contextMenu was opened twice');

        $contextMenuTwo.contextMenu('destroy');

        $contextMenuOne.contextMenu();
        $contextMenuOne.contextMenu('hide');
        $contextMenuTwo.contextMenu();
        $contextMenuTwo.contextMenu('hide');

        assert.equal(menuOne.spies.events.show.callCount + menuTwo.spies.events.show.callCount, 3, 'destroyed contextMenu was not opened');
    });

    QUnit.test('do not open disabled contextmenu', function (assert) {
        const menuOne = createMenu({
            copy: {name: 'Copy', icon: 'copy'},
            paste: {name: 'Paste', icon: 'paste'}
        });
        const menuTwo = createMenu({
            copy: {name: 'Copy', icon: 'copy'},
            paste: {name: 'Paste', icon: 'paste'}
        }, {}, 'context-menu-two');

        let $contextMenuOne = $('.context-menu');
        let $contextMenuTwo = $('.context-menu-two');

        $contextMenuOne.contextMenu();
        $contextMenuOne.contextMenu('hide');
        $contextMenuTwo.contextMenu();
        $contextMenuTwo.contextMenu('hide');

        assert.equal(menuOne.spies.events.show.callCount + menuTwo.spies.events.show.callCount, 2, 'contextMenu was opened twice');

        $contextMenuTwo.contextMenu(false);

        $contextMenuOne.contextMenu();
        $contextMenuOne.contextMenu('hide');
        $contextMenuTwo.contextMenu();
        $contextMenuTwo.contextMenu('hide');

        assert.equal(menuOne.spies.events.show.callCount + menuTwo.spies.events.show.callCount, 3, 'disabled contextMenu was not opened');
    });

    QUnit.test('do not open context menu with no visible items', function (assert) {
        const menu = createMenu({
            copy: {name: 'Copy', icon: 'copy', visible: function () { return false; }},
            paste: {name: 'Paste', icon: 'paste', visible: function () { return false; }}
        });
        $('.context-menu').contextMenu();
        assert.equal($('.context-menu-item').is(':visible'), false, 'no menu items visible');
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
            setTimeout(function () { $this.contextMenu(position); }, 5);
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
        }, 50)
    });

    QUnit.test('items in seconds submenu to not override callbacks', function (assert) {
        let firstCallback = sinon.spy();
        let firstSubCallback = sinon.spy();
        let secondSubCallback = sinon.spy();

        let items = {
            firstitem: {
                name: 'firstitem',
                icon: 'copy',
                callback: firstCallback
            },
            firstsubmenu: {
                name: 'Copy',
                icon: 'copy',
                items: {
                    firstitem: {
                        name: 'firstitem',
                        icon: 'copy',
                        callback: firstSubCallback
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
                        callback: secondSubCallback
                    }
                }
            }
        };

        let menu = createMenu(items);
        $('.context-menu').contextMenu();
        const contextmenuData = menu.getContextMenuDataFromShow();
        contextmenuData.$menu.trigger('nextcommand');
        contextmenuData.$menu.trigger('nextcommand');
        contextmenuData.$menu.trigger('nextcommand');
        contextmenuData.$menu.trigger('nextcommand');

        $('.context-menu-item').first().trigger(triggerEvent);
        $('.context-menu-submenu .context-menu-item').each(function (i, e) {
            $(e).trigger(triggerEvent)
        });

        assert.equal(firstCallback.callCount, 1);
        assert.equal(firstSubCallback.callCount, 1);
        assert.equal(secondSubCallback.callCount, 1);
    });

    QUnit.test('show returning false does not open the contextmenu', function (assert) {
        let helper = createMenu(false, {
            events: {
                show: function () {
                    return false;
                }
            }
        });
        helper.$contextmenu.contextmenu();
        assert.equal($('.context-menu-item').is(':visible'), false);
    });
    QUnit.test('hide returning false does not hide the contextmenu', function (assert) {
        let helper = createMenu(false, {
            events: {
                hide: function () {
                    return false;
                }
            }
        });
        helper.$contextmenu.contextMenu();
        helper.$contextmenu.contextMenu('hide');

        assert.equal($('.context-menu-item').is(':visible'), true);
    });

    QUnit.test('contextmenu is shown on hover', function (assert) {
        let helper = createMenu(false, {trigger: 'hover', delay: 1});
        let done = assert.async();

        $('.context-menu').mouseenter();

        setTimeout(function () {
            assert.equal(helper.spies.events.show.callCount, 1);
            done();
        }, 50);
    });
    QUnit.test('contextmenu with only invisible items is not shown', function (assert) {
        let helper = createMenu({test: {name: 'my item', visible: false}});
        helper.$contextmenu.contextMenu();

        assert.equal($('.context-menu-item').is(':visible'), false);
    });

    QUnit.test('contextmenu visible function is called once', function (assert) {
        console.log('contextmenu visible function is called once started')
        let visibleCount = 0;
        let helper = createMenu({test: {name: 'my item',
            visible: function () {
                visibleCount++;
                return true;
            }}});
        console.log('contextmenu created, opening');
        helper.$contextmenu.contextMenu();
        console.log('contextmenu visible function is called once ended');
        assert.equal(visibleCount, 1);
    });

    QUnit.test('contextmenu is not shown on hover if we leave the element fast enough', function (assert) {
        let helper = createMenu(false, {trigger: 'hover', delay: 500});
        let done = assert.async();

        $('.context-menu').mouseenter();

        setTimeout(function () {
            $('.context-menu').mouseleave();

            setTimeout(function () {
                assert.equal(helper.spies.events.show.callCount, 0);
                done();
            }, 50);
        }, 50);
    });

    QUnit.test('you cannot create a menu without a selector', function (assert) {
        assert.throws(function () {
            createMenu(false, {selector: ''});
        }, Error);
    });

    QUnit.test('you cannot create a menu with reserved classes', function (assert) {
        const reserved = [
            '.context-menu-list',
            '.context-menu-item',
            '.context-menu-input'
        ];
        reserved.forEach((selector) => {
            assert.throws(function () {
                createMenu(false, {selector: selector});
            }, Error);
        });
    });

    QUnit.test('update updates disabled', function (assert) {
        let disabled = false;

        let items = {
            baseline: {name: 'baseline', icon: 'copy'},
            disabledCheck: {
                name: 'Paste',
                icon: 'paste',
                disabled: function () {
                    return disabled;
                }
            }
        };
        createMenu(items);

        $('.context-menu').contextMenu();

        assert.equal($('.context-menu-item').length, 2);
        assert.equal($('.context-menu-disabled').length, 0);

        disabled = true;

        $.contextMenu('update');

        assert.equal($('.context-menu-item').length, 2);
        assert.equal($('.context-menu-disabled').length, 1);

        disabled = false;
        $('.context-menu').contextMenu('update');
        assert.equal($('.context-menu-item').length, 2);
        assert.equal($('.context-menu-disabled').length, 0);
    });

    // QUnit.test('html5 polyfill creates the menu', function (assert) {
    //     $('#qunit-fixture').html(`
    //         <menu id="html5polyfill" type="context" style="display:none">
    //             <command label="rotate" onclick="spyrotate()" icon="images/cut.png">
    //             <command label="resize" onclick="console.log('resize')" icon="images/door.png">
    //             <menu label="share">
    //                 <command label="twitter" onclick="console.log('twitter')" icon="images/page_white_copy.png">
    //                 <hr>
    //                 <command label="facebook" onclick="console.log('facebook')" icon="images/page_white_edit.png">
    //                 <hr>
    //                 <label>foo bar<input type="text" name="foo"></label>
    //             </menu>
    //         </menu>
    //     `);
    //
    //     $.contextMenu('html5');
    //     assert.equal($('.context-menu-item').length, 8);
    // });
}

testQUnit('contextMenu events - mouseup handler', 'mouseup', 'mouseup');
testQUnit('contextMenu events - click handler', 'click', 'click');
