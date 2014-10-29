var menuOpenCounter = 0;
var menuCloseCounter = 0;
var itemSelectedCounter = 0;
var menuRuntime = null;

module('contextMenu events');

// before each test
QUnit.testStart(function createContextMenu() {
  var $fixture = $("#qunit-fixture");

  // ensure `#qunit-fixture` exists when testing with karma runner
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo("body");
    $fixture = $("#qunit-fixture");
  }

  $fixture.append("<div class='context-menu'>right click me!</div>");

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
    items: {
      "copy": {name: "Copy", icon: "copy"},
      "paste": {name: "Paste", icon: "paste"}
    }
  });
});

// after each test
QUnit.testDone(function destroyContextMenuAndCleanup() {
  $.contextMenu( 'destroy' );

  // clean up `#qunit-fixture` when testing in karma runner
  var $fixture = $("#qunit-fixture");
  if ($fixture.length) {
    $fixture.html('');
  }

  // reset vars
  menuOpenCounter = 0;
  menuCloseCounter = 0;
  itemSelectedCounter = 0;
  menuRuntime = null;
});



test('$.contextMenu object exists', function() {
  ok($.contextMenu, '$.contextMenu plugin is loaded');
  notEqual($.contextMenu, undefined, '$.contextMenu is not undefined');
});


test('open contextMenu', function() {
  $(".context-menu").contextMenu();
  equal(menuOpenCounter, 1, 'contextMenu was opened once');
});


test('close contextMenu', function() {
  $(".context-menu").contextMenu();
  $(".context-menu").contextMenu("hide");
  equal(menuCloseCounter, 1, 'contextMenu was closed once');
});


test('navigate contextMenu items', function() {
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
  menuRuntime.$menu.trigger("nextcommand"); // triggers contextmenu:focus
  equal(itemWasFocused, 1, 'first menu item was focused once');
  itemWasFocused = 0;

  menuRuntime.$menu.trigger("nextcommand"); // triggers contextmenu:blur & contextmenu:focus
  equal(itemWasFocused, 1, 'first menu item was blurred');
  equal(itemWasBlurred, 1, 'second menu item was focused');
});


test('activate contextMenu item', function() {
  $(".context-menu").contextMenu();
  menuRuntime.$menu.trigger("nextcommand");
  menuRuntime.$selected.trigger('mouseup');

  equal(itemSelectedCounter, 1, 'selected menu item was clicked once');
});
