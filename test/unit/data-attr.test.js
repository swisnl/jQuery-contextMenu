QUnit.module('dataAttr', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

function dataAttrFixture() {
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  return $fixture;
}

// Build a menu on a freshly appended trigger and return its root <ul>.
function buildMenu(options) {
  var $fixture = dataAttrFixture();
  $fixture.append('<span class="context-menu-data-attr">right click me</span>');

  $.contextMenu($.extend({selector: '.context-menu-data-attr'}, options));

  var $trigger = $('.context-menu-data-attr');
  $trigger.contextMenu();

  return $trigger.data('contextMenu').$menu;
}

QUnit.test('a single item dataAttr key is applied to the item as a data-* attribute', function(assert) {
  var $menu = buildMenu({
    items: {
      copy: {
        name: 'Copy',
        dataAttr: {
          menuTitle: 'My custom title'
        }
      }
    }
  });

  var $item = $menu.children('li').first();
  assert.equal($item.attr('data-menu-title'), 'My custom title', 'camelCase key is written as a kebab-case data attribute');
});

QUnit.test('every key of the dataAttr object is applied, not just the first', function(assert) {
  var $menu = buildMenu({
    items: {
      copy: {
        name: 'Copy',
        dataAttr: {
          menuTitle: 'My custom title',
          role: 'copy-command',
          testId: 'copy-item'
        }
      }
    }
  });

  var $item = $menu.children('li').first();
  assert.equal($item.attr('data-menu-title'), 'My custom title', 'first key applied');
  assert.equal($item.attr('data-role'), 'copy-command', 'second key applied');
  assert.equal($item.attr('data-test-id'), 'copy-item', 'third key applied');
  assert.notOk($item.attr('data-undefined'), 'no data-undefined attribute is written');
});

QUnit.test('dataAttr values round trip through .data()', function(assert) {
  var $menu = buildMenu({
    items: {
      copy: {
        name: 'Copy',
        dataAttr: {
          menuTitle: 'My custom title',
          'already-kebab': 'kebab value'
        }
      }
    }
  });

  var $item = $menu.children('li').first();
  assert.equal($item.data('menuTitle'), 'My custom title', 'readable via the camelCase name');
  assert.equal($item.data('menu-title'), 'My custom title', 'readable via the kebab-case name');
  assert.equal($item.data('alreadyKebab'), 'kebab value', 'keys already in kebab-case are left alone');
});

QUnit.test('non-string dataAttr values are stringified and null/undefined are skipped', function(assert) {
  var $menu = buildMenu({
    items: {
      copy: {
        name: 'Copy',
        dataAttr: {
          count: 42,
          enabled: true,
          disabled: false,
          zero: 0,
          empty: '',
          nothing: null,
          missing: undefined
        }
      }
    }
  });

  var $item = $menu.children('li').first();
  assert.equal($item.attr('data-count'), '42', 'numbers are stringified');
  assert.equal($item.attr('data-enabled'), 'true', 'true is stringified');
  assert.equal($item.attr('data-disabled'), 'false', 'false is stringified');
  assert.equal($item.attr('data-zero'), '0', 'zero is stringified, not treated as empty');
  assert.equal($item.attr('data-empty'), '', 'empty strings are kept');
  assert.strictEqual($item.attr('data-nothing'), undefined, 'null values are skipped');
  assert.strictEqual($item.attr('data-missing'), undefined, 'undefined values are skipped');

  assert.strictEqual($item.data('count'), 42, 'a numeric value reads back as a number');
  assert.strictEqual($item.data('enabled'), true, 'a boolean value reads back as a boolean');
});

QUnit.test('a dataAttr value containing HTML is not interpreted as markup', function(assert) {
  var payload = '<img src="x" onerror="window.__contextMenuDataAttrXss = true;">';
  var $menu = buildMenu({
    items: {
      copy: {
        name: 'Copy',
        dataAttr: {
          menuTitle: payload
        }
      }
    }
  });

  var $item = $menu.children('li').first();
  assert.equal($item.attr('data-menu-title'), payload, 'the value is stored verbatim');
  assert.equal($item.find('img').length, 0, 'no element was created from the value');
  assert.notOk(window.__contextMenuDataAttrXss, 'no inline handler ran');
});

QUnit.test('dataAttr works for sub-menu items too', function(assert) {
  var $menu = buildMenu({
    items: {
      more: {
        name: 'More',
        items: {
          sub: {
            name: 'Sub item',
            dataAttr: {
              menuTitle: 'Sub title'
            }
          }
        }
      }
    }
  });

  var $subItem = $menu.find('.context-menu-submenu > .context-menu-list > li').first();
  assert.equal($subItem.length, 1, 'sanity check: sub-menu item was found');
  assert.equal($subItem.attr('data-menu-title'), 'Sub title', 'sub-menu items get their data attributes');
});

QUnit.test('menu level dataAttr is applied to the menu itself with the right attribute names', function(assert) {
  var $menu = buildMenu({
    dataAttr: {
      menuTitle: 'Root menu',
      role: 'menu-root'
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  assert.equal($menu.attr('data-menu-title'), 'Root menu', 'camelCase key is written as a kebab-case data attribute');
  assert.equal($menu.attr('data-role'), 'menu-root', 'every key is applied');
  assert.notOk($menu.attr('data-undefined'), 'no data-undefined attribute is written (issue #712)');
  assert.equal($menu.data('menuTitle'), 'Root menu', 'readable via .data()');
});
