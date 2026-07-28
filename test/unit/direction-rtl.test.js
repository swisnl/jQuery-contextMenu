// Karma's test page only loads the plugin's JS (see karma.conf.js), not its
// compiled CSS, so `.context-menu-list` never gets `position: absolute` from
// jquery.contextMenu.scss. Without that, the inline top/left the plugin sets
// via JS have no visual effect (a statically positioned element ignores
// top/left), which would make the positioning assertions below meaningless.
// Add just enough CSS ourselves to make position math observable.
$('<style>.context-menu-list { position: absolute; }</style>').appendTo('head');

QUnit.module('direction (rtl support)', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

function ensureFixture() {
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  return $fixture;
}

QUnit.test('default (ltr) menu does not get the context-menu-rtl class', function(assert) {
  var $fixture = ensureFixture();
  $fixture.append('<span class="context-menu-ltr-default">right click me</span>');

  $.contextMenu({
    selector: '.context-menu-ltr-default',
    items: {
      copy: {name: 'Copy'}
    }
  });

  $('.context-menu-ltr-default').contextMenu();

  var $menu = $('.context-menu-ltr-default').data('contextMenu').$menu;
  assert.notOk($menu.hasClass('context-menu-rtl'), 'root menu should not have the rtl class by default');
});

QUnit.test('direction: "rtl" adds the context-menu-rtl class to the root menu and to sub-menus', function(assert) {
  var $fixture = ensureFixture();
  $fixture.append('<span class="context-menu-rtl-trigger">right click me</span>');

  $.contextMenu({
    selector: '.context-menu-rtl-trigger',
    direction: 'rtl',
    items: {
      copy: {name: 'Copy'},
      more: {
        name: 'More',
        items: {
          sub1: {name: 'Sub item'}
        }
      }
    }
  });

  $('.context-menu-rtl-trigger').contextMenu();

  var $rootMenu = $('.context-menu-rtl-trigger').data('contextMenu').$menu;
  assert.ok($rootMenu.hasClass('context-menu-rtl'), 'root menu should have the context-menu-rtl class');

  var $subMenu = $rootMenu.find('.context-menu-submenu').first().children('.context-menu-list');
  assert.equal($subMenu.length, 1, 'sanity check: sub-menu was found');
  assert.ok($subMenu.hasClass('context-menu-rtl'), 'sub-menu should also have the context-menu-rtl class');
});

QUnit.test('direction: "rtl" opens sub-menus to the left of their parent item instead of the right', function(assert) {
  // Show the root menu at an explicit, comfortably-inset position (well away
  // from the viewport edges) so the jQuery UI position "flipfit" collision
  // handling doesn't override the intended open side just because one side
  // happens to be short on space - that would defeat the point of this
  // assertion.
  var $fixtureLtr = ensureFixture();
  $fixtureLtr.append('<span class="context-menu-ltr-sub">right click me (ltr)</span>');

  $.contextMenu({
    selector: '.context-menu-ltr-sub',
    items: {
      more: {
        name: 'More',
        items: {
          sub1: {name: 'Sub item'}
        }
      }
    }
  });

  $('.context-menu-ltr-sub').contextMenu({x: 300, y: 100});
  var $ltrItem = $('.context-menu-ltr-sub').data('contextMenu').$menu.find('.context-menu-submenu').first();
  $ltrItem.trigger('contextmenu:focus');

  var $ltrSubMenu = $ltrItem.children('.context-menu-list');
  var ltrItemOffset = $ltrItem.offset().left;
  var ltrSubMenuOffset = $ltrSubMenu.offset().left;

  assert.ok(
    ltrSubMenuOffset >= ltrItemOffset,
    'ltr: sub-menu should open at/after the parent item\'s left edge (opens to the right). item=' + ltrItemOffset + ' sub=' + ltrSubMenuOffset
  );

  $.contextMenu('destroy');
  $fixtureLtr.html('');

  var $fixtureRtl = ensureFixture();
  $fixtureRtl.append('<span class="context-menu-rtl-sub">right click me (rtl)</span>');

  $.contextMenu({
    selector: '.context-menu-rtl-sub',
    direction: 'rtl',
    items: {
      more: {
        name: 'More',
        items: {
          sub1: {name: 'Sub item'}
        }
      }
    }
  });

  $('.context-menu-rtl-sub').contextMenu({x: 300, y: 100});
  var $rtlItem = $('.context-menu-rtl-sub').data('contextMenu').$menu.find('.context-menu-submenu').first();
  $rtlItem.trigger('contextmenu:focus');

  var $rtlSubMenu = $rtlItem.children('.context-menu-list');
  var rtlItemOffset = $rtlItem.offset().left;
  var rtlSubMenuOffset = $rtlSubMenu.offset().left;

  assert.ok(
    rtlSubMenuOffset <= rtlItemOffset,
    'rtl: sub-menu should open before the parent item\'s left edge (opens to the left). item=' + rtlItemOffset + ' sub=' + rtlSubMenuOffset
  );
});
