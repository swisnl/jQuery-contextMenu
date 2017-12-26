function testQUnit(name, itemClickEvent, triggerEvent) {
    QUnit.module(name, {
        afterEach: function () {
            destroyContextMenuAndCleanup();
        }
    });
    // before each test
    function createContextMenu(items, classname) {
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
        var spies = {
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
            itemClickEvent: itemClickEvent
        });

        return spies;
    }

    // after each test
    function destroyContextMenuAndCleanup() {
        $.contextMenu('destroy');

        // clean up `#qunit-fixture` when testing in karma runner
        var $fixture = $('#qunit-fixture');
        if ($fixture.length) {
            $fixture.html('');
        }
    }

    QUnit.test('$.contextMenu object exists', function (assert) {
        assert.ok($.contextMenu, '$.contextMenu plugin is loaded');
        assert.notEqual($.contextMenu, undefined, '$.contextMenu is not undefined');
    });

    QUnit.test('open contextMenu', function (assert) {
        var spies = createContextMenu();
        $('.context-menu').contextMenu();
        assert.equal(spies.show.callCount, 1, 'contextMenu was opened once');
    });

    QUnit.test('open contextMenu at 0,0', function (assert) {
        var spies = createContextMenu();
        $('.context-menu').contextMenu({x: 0, y: 0});
        assert.equal(spies.show.callCount, 1, 'contextMenu was opened once');
    });

    QUnit.test('close contextMenu', function (assert) {
        var spies = createContextMenu();
        $('.context-menu').contextMenu();
        $('.context-menu').contextMenu('hide');
        assert.equal(spies.hide.callCount, 1, 'contextMenu was closed once');
    });

    QUnit.test('navigate contextMenu items', function (assert) {
        var spies = createContextMenu();
        var itemWasFocused = 0;
        var itemWasBlurred = 0;

        // listen to focus and blur events
        $(document.body)
            .on('contextmenu:focus', '.context-menu-item', function (e) {
                itemWasFocused = itemWasFocused + 1;
            })
            .on('contextmenu:blur', '.context-menu-item', function (e) {
                itemWasBlurred = itemWasBlurred + 1;
            });


        $('.context-menu').contextMenu();

        var contextmenuData = spies.show.args[0][1];
        contextmenuData.$menu.trigger('nextcommand'); // triggers contextmenu:focus
        assert.equal(itemWasFocused, 1, 'first menu item was focused once');
        itemWasFocused = 0;

        contextmenuData.$menu.trigger('nextcommand'); // triggers contextmenu:blur & contextmenu:focus
        assert.equal(itemWasFocused, 1, 'first menu item was blurred');
        assert.equal(itemWasBlurred, 1, 'second menu item was focused');
    });

    QUnit.test('activate contextMenu item', function (assert) {
        var spies = createContextMenu();
        $('.context-menu').contextMenu();

        var contextmenuData = spies.show.args[0][1];
        contextmenuData.$menu.trigger('nextcommand');
        contextmenuData.$selected.trigger(triggerEvent);

        assert.equal(spies.callback.callCount, 1, 'selected menu item was clicked once');
    });

    QUnit.test('do not open context menu with no visible items', function (assert) {
        var spiesOne = createContextMenu({
            copy: {name: 'Copy', icon: 'copy'},
            paste: {name: 'Paste', icon: 'paste'}
        });
        var spiesTwo = createContextMenu({
            copy: {name: 'Copy', icon: 'copy'},
            paste: {name: 'Paste', icon: 'paste'}
        }, 'context-menu-two');

        $('.context-menu').contextMenu();
        $('.context-menu').contextMenu('hide');
        $('.context-menu-two').contextMenu();
        $('.context-menu-two').contextMenu('hide');

        assert.equal(spiesOne.show.callCount + spiesTwo.show.callCount, 2, 'contextMenu was opened twice');

        $('.context-menu-two').contextMenu('destroy');

        $('.context-menu').contextMenu();
        $('.context-menu').contextMenu('hide');
        $('.context-menu-two').contextMenu();
        $('.context-menu-two').contextMenu('hide');

        assert.equal(spiesOne.show.callCount + spiesTwo.show.callCount, 3, 'destroyed contextMenu was not opened');
    });

    QUnit.test('do not open context menu with no visible items', function (assert) {
        var spies = createContextMenu({
            copy: {name: 'Copy', icon: 'copy', visible: function () { return false; }},
            paste: {name: 'Paste', icon: 'paste', visible: function () { return false; }}
        });
        $('.context-menu').contextMenu();

        assert.equal(spies.show.callCount, 0, 'selected menu wat not opened');
    });

    QUnit.test('can create a menu async', function(assert){
        $('#qunit-fixture').append("<div class='context-menu-one'>right click me!</div>");


        var spies = {
            show: sinon.spy(),
            hide: sinon.spy(),
            callback: sinon.spy()
        };


        // some build handler to call asynchronously
        function createSomeMenu() {
            return {
                callback: spies.callback,
                items: {
                    "edit": {name: "Edit", icon: "edit"},
                    "cut": {name: "Cut", icon: "cut"},
                    "copy": {name: "Copy", icon: "copy"}
                }
            };
        }

        // some asynchronous click handler
        $('.context-menu-one').on('mouseup click', function(e){
            var $this = $(this);
            // store a callback on the trigger
            $this.data('runCallbackThingie', createSomeMenu);
            var _offset = $this.offset(),
                position = {
                    x: _offset.left + 10,
                    y: _offset.top + 10
                };
            // open the contextMenu asynchronously
            setTimeout(function(){ $this.contextMenu(position); }, 100);
        });


        // setup context menu
        $.contextMenu({
            selector: '.context-menu-one',
            trigger: 'none',
            build: function(e, $trigger) {
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

        var done = assert.async();
        $('.context-menu-one').trigger('click');

        setTimeout(function(){
            assert.equal(spies.show.calledOnce, true);
            var contextmenuData = spies.show.args[0][1];
            assert.equal(contextmenuData.$menu.find('li').length, 3);
            done();
        }, 1000)

    });

    QUnit.test('items in seconds submenu to not override callbacks', function (assert) {
        var firstCallback = false, firstSubCallback = false, secondSubCallback = false;
        createContextMenu({
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
