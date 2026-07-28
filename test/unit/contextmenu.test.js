var menuOpenCounter = 0;
var menuCloseCounter = 0;
var itemSelectedCounter = 0;
var itemSelectedStack = [];
var menuRuntime = null;

function testQUnit(name, itemClickEvent, triggerEvent) {
  QUnit.module(name, {
    afterEach: function(){
      destroyContextMenuAndCleanup();
    }
  });
  // before each test
  function createContextMenu(items, classname) {
    if(typeof(classname) == 'undefined'){
      classname = 'context-menu';
    }
    var $fixture = $('#qunit-fixture');

    // ensure `#qunit-fixture` exists when testing with karma runner
    if ($fixture.length === 0) {
      $('<div id="qunit-fixture">').appendTo("body");
      $fixture = $('#qunit-fixture');
    }

    $fixture.append("<div class='" + classname + "'>right click me!</div>");

    if(!items){
      items = {
        copy: {name: 'Copy', icon: 'copy'},
        paste: {name: 'Paste', icon: 'paste'}
      };
    }

    $.contextMenu({
      selector: '.' + classname,
      events: {
        show: function(opt) {
          menuRuntime = opt;
          menuOpenCounter = menuOpenCounter + 1;
        },
        hide: function() {
          menuCloseCounter = menuCloseCounter + 1;
        }
      },
      callback: function(key) {
        itemSelectedCounter = itemSelectedCounter + 1;
        itemSelectedStack.push(key);
      },
      items: items,
      itemClickEvent: itemClickEvent
    });
  }

  // after each test
  function destroyContextMenuAndCleanup() {
    $.contextMenu('destroy');

    // clean up `#qunit-fixture` when testing in karma runner
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }

    // reset vars
    menuOpenCounter = 0;
    menuCloseCounter = 0;
    itemSelectedCounter = 0;
    itemSelectedStack = [];
    menuRuntime = null;
  }



  QUnit.test('$.contextMenu object exists', function(assert) {
    assert.ok($.contextMenu, '$.contextMenu plugin is loaded');
    assert.notEqual($.contextMenu, undefined, '$.contextMenu is not undefined');
  });


  QUnit.test('open contextMenu', function(assert) {
    createContextMenu();
    $(".context-menu").contextMenu();
    assert.equal(menuOpenCounter, 1, 'contextMenu was opened once');
  });


  QUnit.test('open contextMenu at 0,0', function(assert) {
    createContextMenu();
    $(".context-menu").contextMenu({x: 0, y: 0});
    assert.equal(menuOpenCounter, 1, 'contextMenu was opened once');
  });


  QUnit.test('close contextMenu', function(assert) {
    createContextMenu();
    $(".context-menu").contextMenu();
    $(".context-menu").contextMenu('hide');
    assert.equal(menuCloseCounter, 1, 'contextMenu was closed once');
  });


  QUnit.test('navigate contextMenu items', function(assert) {
    createContextMenu();
    var itemWasFocused = 0;
    var itemWasBlurred = 0;

    // listen to focus and blur events
    $(document.body)
      .on("contextmenu:focus", ".context-menu-item", function() {
        itemWasFocused = itemWasFocused + 1;
      })
      .on("contextmenu:blur", ".context-menu-item", function() {
        itemWasBlurred = itemWasBlurred + 1;
      });

    $(".context-menu").contextMenu();
    menuRuntime.$menu.trigger('nextcommand'); // triggers contextmenu:focus
    assert.equal(itemWasFocused, 1, 'first menu item was focused once');
    itemWasFocused = 0;

    menuRuntime.$menu.trigger('nextcommand'); // triggers contextmenu:blur & contextmenu:focus
    assert.equal(itemWasFocused, 1, 'first menu item was blurred');
    assert.equal(itemWasBlurred, 1, 'second menu item was focused');
  });


  QUnit.test('activate contextMenu item', function(assert) {
    createContextMenu();
    $(".context-menu").contextMenu();
    menuRuntime.$menu.trigger('nextcommand');
    menuRuntime.$selected.trigger(triggerEvent);

    assert.equal(itemSelectedCounter, 1, 'selected menu item was clicked once');
  });

  QUnit.test('do not open destroyed context menu', function(assert) {
    createContextMenu({
      copy: {name: 'Copy', icon: 'copy'},
      paste: {name: 'Paste', icon: 'paste'}
    });
    createContextMenu({
      copy: {name: 'Copy', icon: 'copy'},
      paste: {name: 'Paste', icon: 'paste'}
    }, 'context-menu-two');

    $(".context-menu").contextMenu();
    $(".context-menu").contextMenu('hide');
    $(".context-menu-two").contextMenu();
    $(".context-menu-two").contextMenu('hide');

    assert.equal(menuOpenCounter, 2, 'contextMenu was opened twice');

    $(".context-menu-two").contextMenu('destroy');

    $(".context-menu").contextMenu();
    $(".context-menu").contextMenu('hide');
    $(".context-menu-two").contextMenu();
    $(".context-menu-two").contextMenu('hide');

    assert.equal(menuOpenCounter, 3, 'destroyed contextMenu was not opened');

  });

  QUnit.test('manually triggering contextMenu via a selector matching zero elements does not throw', function(assert) {
    // Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/777
    // "TypeError: Cannot read properties of undefined (reading 'events')"
    //
    // $.fn.contextMenu() has a "zero-length" code path (this.length === 0)
    // meant to look up a registered menu by matching jQuery's legacy
    // `.selector` property. That property was deprecated in jQuery 1.9 and
    // removed in jQuery 3.0, so on modern jQuery the lookup can never
    // succeed, yet the handler used to be invoked unconditionally with
    // whatever (missing) data resulted from the failed lookup.
    createContextMenu();

    // sanity check: the selector below must not match anything, mirroring
    // a trigger element that hasn't been inserted yet (or was removed).
    assert.equal($('.context-menu-does-not-exist').length, 0, 'sanity check: selector matches nothing');

    var didThrow = false;
    try {
      $('.context-menu-does-not-exist').contextMenu({x: 0, y: 0});
    } catch (e) {
      didThrow = true;
    }

    assert.notOk(didThrow, 'calling .contextMenu() on a non-matching selector did not throw');
    assert.equal(menuOpenCounter, 0, 'no contextMenu was opened for a non-matching selector');
  });

  QUnit.test('manually triggering contextMenu on a detached trigger element does not throw', function(assert) {
    // Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/777
    createContextMenu();

    var $trigger = $('.context-menu');
    $trigger.detach();

    assert.equal($('.context-menu').length, 0, 'sanity check: trigger element no longer in the DOM');

    var didThrow = false;
    try {
      $('.context-menu').contextMenu({x: 0, y: 0, target: $trigger[0]});
    } catch (e) {
      didThrow = true;
    }

    assert.notOk(didThrow, 'calling .contextMenu() on a detached trigger did not throw');

    // put it back so afterEach cleanup can find/destroy it normally
    $('#qunit-fixture').append($trigger);
  });

  QUnit.test('do not open context menu with no visible items', function(assert) {
    createContextMenu({
      copy: {name: 'Copy', icon: 'copy', visible: function(){return false;}},
      paste: {name: 'Paste', icon: 'paste', visible: function(){return false;}}
    });
    $(".context-menu").contextMenu();

    assert.equal($('.context-menu-item').is(':visible'), false, 'no menu items visible');

  });

  QUnit.test('visible function should only trigger once', function(assert) {
    var visibleTriggered = 0;
    createContextMenu({
      copy: {name: 'Copy', icon: 'copy', visible: function(){visibleTriggered++; return true;}},
      paste: {name: 'Paste', icon: 'paste', visible: function(){return false;}}
    });
    $(".context-menu").contextMenu();

    assert.equal(visibleTriggered, 1, 'selected menu wat not opened');
  });

  QUnit.test('items in seconds submenu to not override callbacks', function (assert) {
    var firstCallback = false, firstSubCallback = false, secondSubCallback = false;
    createContextMenu({
      firstitem: {
        name: 'firstitem',
        icon: 'copy',
        callback : function(){
          firstCallback = true;
        }
      },
      firstsubmenu: {
        name: 'Copy',
        icon: 'copy',
        items: {
          firstitem : {
            name : "firstitem",
            icon : "copy",
            callback : function(){
              firstSubCallback = true;
            }
          }
        }
      },
      secondsubmenu: {
        name: 'Copy',
        icon: 'copy',
        items: {
          firstitem : {
            name : "firstitem",
            icon : "copy",
            callback : function(){
              secondSubCallback = true;
            }
          }
        }
      }
    });
    $('.context-menu-item').first().trigger(triggerEvent);
    $('.context-menu-submenu .context-menu-item').each(function(i,e){
      $(e).trigger(triggerEvent)
    });

    assert.equal(firstCallback, 1);
    assert.equal(firstSubCallback, 1);
    assert.equal(secondSubCallback, 1);

  });


    QUnit.test('font-awesome creates icon elements', function(assert) {
        createContextMenu({
            copy: {name: 'Copy', icon: 'fas fa-beer'}
        });

        $(".context-menu").contextMenu();

        assert.equal($('i.fas.fa-beer').length, 1, 'FontAwesome <i> tag was not created');
    });

    QUnit.test('legacy fa-* icon shorthand creates its own icon element instead of tainting the item', function(assert) {
        createContextMenu({
            copy: {name: 'Copy', icon: 'fa-trash'}
        });

        $(".context-menu").contextMenu();

        var $item = $('.context-menu-item').first();

        assert.equal($item.find('i.fa.fa-trash').length, 1, 'FontAwesome <i> tag was not created for legacy "fa-*" icon shorthand');
        assert.notOk($item.hasClass('fa') || $item.hasClass('fa-trash'), 'FontAwesome classes should not be applied to the menu item itself, as that bleeds the icon font (and its font-weight) into the item label text');
    });

    QUnit.test('name as a function renders a dynamic label and re-evaluates on update, like icon/disabled', function(assert) {
        // Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/743
        // "How to change the label at runtime?" - item.icon and item.disabled
        // already support being a function that's re-invoked whenever the menu
        // is updated, but item.name did not: it was always rendered as static
        // content, with no way for a menu item's label to reflect changing
        // external state.
        var state = 'Enable feature';

        createContextMenu({
            toggle: {
                name: function() {
                    return state;
                },
                icon: 'copy'
            }
        });

        $(".context-menu").contextMenu();

        var $item = $('.context-menu-item').first();

        assert.equal($item.text().trim(), 'Enable feature', 'label reflects the function\'s return value on initial render');

        // mutate the external state the function reads from, then ask the
        // plugin to refresh - the same mechanism icon/disabled rely on to
        // pick up new values (see the "visible function should only trigger
        // once" test above for the same update path).
        state = 'Disable feature';
        $.contextMenu('update');

        assert.equal($item.text().trim(), 'Disable feature', 'label updates to reflect the function\'s new return value after update');
    });
}

testQUnit('contextMenu events', '', 'mouseup');
testQUnit('contextMenu events - click handler', 'click', 'click');
