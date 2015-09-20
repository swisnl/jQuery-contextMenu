var menuOpenCounter = 0;
var menuCloseCounter = 0;
var itemSelectedCounter = 0;
var menuRuntime = null;

module('contextMenu events');

// before each test
function createContextMenu(items) {
  var $fixture = $('#qunit-fixture');

  // ensure `#qunit-fixture` exists when testing with karma runner
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo("body");
    $fixture = $('#qunit-fixture');
  }

  $fixture.append("<div class='context-menu'>right click me!</div>");

  if(!items){
    items = {
      copy: {name: 'Copy', icon: 'copy'},
      paste: {name: 'Paste', icon: 'paste'}
    };
  }

  $.contextMenu({
    selector: '.context-menu',
    events: {
      show: function(opt) {
        menuRuntime = opt;
        menuOpenCounter = menuOpenCounter + 1;
      },
      hide: function() {
        menuCloseCounter = menuCloseCounter + 1;
      }
    },
    callback: function(key, options) {
      itemSelectedCounter = itemSelectedCounter + 1;
    },
    items: items
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
  menuRuntime = null;
}



test('$.contextMenu object exists', function() {
  ok($.contextMenu, '$.contextMenu plugin is loaded');
  notEqual($.contextMenu, undefined, '$.contextMenu is not undefined');
});


test('open contextMenu', function() {
  createContextMenu();
  $(".context-menu").contextMenu();
  equal(menuOpenCounter, 1, 'contextMenu was opened once');
  destroyContextMenuAndCleanup();
});


test('open contextMenu at 0,0', function() {
  createContextMenu();
  $(".context-menu").contextMenu({x: 0, y: 0});
  equal(menuOpenCounter, 1, 'contextMenu was opened once');
  destroyContextMenuAndCleanup();
});


test('close contextMenu', function() {
  createContextMenu();
  $(".context-menu").contextMenu();
  $(".context-menu").contextMenu('hide');
  equal(menuCloseCounter, 1, 'contextMenu was closed once');
  destroyContextMenuAndCleanup();
});


test('navigate contextMenu items', function() {
  createContextMenu();
  var itemWasFocused = 0;
  var itemWasBlurred = 0;

  // listen to focus and blur events
  $(document.body)
    .on("contextmenu:focus", ".context-menu-item", function(e) {
      itemWasFocused = itemWasFocused + 1;
    })
    .on("contextmenu:blur", ".context-menu-item", function(e) {
      itemWasBlurred = itemWasBlurred + 1;
    });

  $(".context-menu").contextMenu();
  menuRuntime.$menu.trigger('nextcommand'); // triggers contextmenu:focus
  equal(itemWasFocused, 1, 'first menu item was focused once');
  itemWasFocused = 0;

  menuRuntime.$menu.trigger('nextcommand'); // triggers contextmenu:blur & contextmenu:focus
  equal(itemWasFocused, 1, 'first menu item was blurred');
  equal(itemWasBlurred, 1, 'second menu item was focused');
  destroyContextMenuAndCleanup();
});


test('activate contextMenu item', function() {
  createContextMenu();
  $(".context-menu").contextMenu();
  menuRuntime.$menu.trigger('nextcommand');
  menuRuntime.$selected.trigger('mouseup');

  equal(itemSelectedCounter, 1, 'selected menu item was clicked once');
  destroyContextMenuAndCleanup();
});



test('do not open context menu with no visible items', function() {
  createContextMenu({
    copy: {name: 'Copy', icon: 'copy', visible: function(){return false;}},
    paste: {name: 'Paste', icon: 'paste', visible: function(){return false;}}
  });
  $(".context-menu").contextMenu();

  equal(menuOpenCounter, 0, 'selected menu wat not opened');
  destroyContextMenuAndCleanup();
});

