// Font Awesome names a style differently in every major version, and v7 keeps
// adding packs with their own short prefixes. These tests pin the emitted
// markup for each syntax, so the two things that matter stay true:
//
//   * a class list that already names a family/style is passed through
//     untouched (v5, v6, v7), and
//   * one that does not still gets v4's base `fa` class supplied (the
//     `icon: "fa-user"` shorthand and its modifier form).
//
// See https://github.com/swisnl/jQuery-contextMenu/pull/776

QUnit.module('Font Awesome icon syntax across versions', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixtureEl = $('#qunit-fixture');
    if ($fixtureEl.length) {
      $fixtureEl.html('');
    }
  }
});

function fixtureFa() {
  var $fixtureEl = $('#qunit-fixture');
  if ($fixtureEl.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixtureEl = $('#qunit-fixture');
  }
  return $fixtureEl;
}

var faTriggerSeq = 0;

// Build a one-item menu with the given `icon`, open it, and report what was
// rendered: the classes on the child <i> (if any) and on the item itself.
function renderIconFa(icon) {
  var cls = 'fa-trigger-' + (faTriggerSeq++);
  fixtureFa().append('<div class="' + cls + '">right click me</div>');

  $.contextMenu({
    selector: '.' + cls,
    items: {
      only: {name: 'Only', icon: icon}
    }
  });

  $('.' + cls).contextMenu();

  var $item = $('.context-menu-list').filter(':visible').last().find('li.context-menu-item').first();
  var $i = $item.children('i');

  function sortedClasses($el) {
    var raw = ($el.attr('class') || '').split(/\s+/).filter(function(one) {
      return one !== '';
    });
    return raw.sort();
  }

  return {
    hasChildIcon: $i.length === 1,
    iconClasses: $i.length === 1 ? sortedClasses($i) : null,
    itemClasses: sortedClasses($item)
  };
}

function assertChildIcon(assert, icon, expectedClasses, label) {
  var rendered = renderIconFa(icon);
  assert.ok(rendered.hasChildIcon, label + ': renders a child <i>');
  assert.deepEqual(
    rendered.iconClasses,
    expectedClasses.slice().sort(),
    label + ': child <i> classes'
  );
  assert.ok(
    rendered.itemClasses.indexOf('context-menu-icon--fa5') !== -1,
    label + ': item keeps the positioning hook'
  );
}

// ---------------------------------------------------------------- v4

QUnit.test('v4 shorthand "fa-user" gets the base fa class supplied', function(assert) {
  assertChildIcon(assert, 'fa-user', ['fa', 'fa-user'], 'v4 shorthand');
});

QUnit.test('v4 shorthand with a modifier keeps the base fa class', function(assert) {
  // This already worked and must keep working: nothing in the list names a
  // family, so `fa` is still required for the icon to render at all.
  assertChildIcon(assert, 'fa-user fa-lg', ['fa', 'fa-user', 'fa-lg'], 'v4 + modifier');
});

QUnit.test('v4 full syntax "fa fa-user" is passed through untouched', function(assert) {
  // Previously fell through to the built-in icon-font branch and emitted
  // "context-menu-icon-fa fa-user" onto the item, rendering nothing.
  assertChildIcon(assert, 'fa fa-user', ['fa', 'fa-user'], 'v4 full');
});

// ---------------------------------------------------------------- v5

QUnit.test('v5 short prefixes are passed through untouched', function(assert) {
  assertChildIcon(assert, 'fas fa-user', ['fas', 'fa-user'], 'v5 solid');
  assertChildIcon(assert, 'far fa-user', ['far', 'fa-user'], 'v5 regular');
  assertChildIcon(assert, 'fal fa-user', ['fal', 'fa-user'], 'v5 light');
  assertChildIcon(assert, 'fad fa-user', ['fad', 'fa-user'], 'v5 duotone');
  assertChildIcon(assert, 'fab fa-github', ['fab', 'fa-github'], 'v5 brands');
});

// ---------------------------------------------------------------- v6 / v7

QUnit.test('v6/v7 long-form styles no longer get a spurious fa class', function(assert) {
  // The bug in #776: these hit the v4 shorthand branch and came out as
  // "fa fa-solid fa-user". That stray `fa` fights fa-regular for font-weight
  // and fa-brands for font-family.
  assertChildIcon(assert, 'fa-solid fa-user', ['fa-solid', 'fa-user'], 'v6 solid');
  assertChildIcon(assert, 'fa-regular fa-user', ['fa-regular', 'fa-user'], 'v6 regular');
  assertChildIcon(assert, 'fa-light fa-user', ['fa-light', 'fa-user'], 'v6 light');
  assertChildIcon(assert, 'fa-thin fa-user', ['fa-thin', 'fa-user'], 'v6 thin');
  assertChildIcon(assert, 'fa-brands fa-github', ['fa-brands', 'fa-github'], 'v6 brands');
});

QUnit.test('v6/v7 family plus style combinations are passed through untouched', function(assert) {
  assertChildIcon(assert, 'fa-classic fa-solid fa-user', ['fa-classic', 'fa-solid', 'fa-user'], 'classic');
  assertChildIcon(assert, 'fa-sharp fa-solid fa-user', ['fa-sharp', 'fa-solid', 'fa-user'], 'sharp');
  assertChildIcon(assert, 'fa-duotone fa-solid fa-user', ['fa-duotone', 'fa-solid', 'fa-user'], 'duotone');
  assertChildIcon(assert, 'fa-sharp-duotone fa-solid fa-user', ['fa-sharp-duotone', 'fa-solid', 'fa-user'], 'sharp-duotone');
});

QUnit.test('v7 per-pack short prefixes are passed through untouched', function(assert) {
  // Matched by shape rather than from a list, so a pack added in a later
  // release needs no change here.
  assertChildIcon(assert, 'fasds fa-user', ['fasds', 'fa-user'], 'sharp-duotone solid');
  assertChildIcon(assert, 'fasr fa-user', ['fasr', 'fa-user'], 'sharp regular');
  assertChildIcon(assert, 'fat fa-user', ['fat', 'fa-user'], 'thin');
  assertChildIcon(assert, 'fands fa-user', ['fands', 'fa-user'], 'notdog-duo solid');
});

// ------------------------------------------------- built-in icons, unchanged

QUnit.test('built-in icon names still style the item itself', function(assert) {
  var rendered = renderIconFa('edit');
  assert.notOk(rendered.hasChildIcon, 'no child <i> is created');
  assert.ok(rendered.itemClasses.indexOf('context-menu-icon') !== -1, 'item keeps context-menu-icon');
  assert.ok(rendered.itemClasses.indexOf('context-menu-icon-edit') !== -1, 'item gets context-menu-icon-edit');
  assert.notOk(rendered.itemClasses.indexOf('context-menu-icon--fa5') !== -1, 'item is not treated as Font Awesome');
});

QUnit.test('a short built-in icon name beginning with fa is not mistaken for Font Awesome', function(assert) {
  // Detection keys off an `fa-` token precisely so a name like this, which a
  // caller may well have defined in their own CSS, keeps its old meaning.
  var rendered = renderIconFa('fav');
  assert.notOk(rendered.hasChildIcon, 'no child <i> is created');
  assert.ok(rendered.itemClasses.indexOf('context-menu-icon-fav') !== -1, 'item gets context-menu-icon-fav');
  assert.notOk(rendered.itemClasses.indexOf('context-menu-icon--fa5') !== -1, 'item is not treated as Font Awesome');
});

QUnit.test('a function icon is untouched by any of this', function(assert) {
  var rendered = renderIconFa(function() {
    return 'from-a-callback';
  });
  assert.notOk(rendered.hasChildIcon, 'no child <i> is created');
  assert.ok(rendered.itemClasses.indexOf('from-a-callback') !== -1, 'the returned class is applied to the item');
});
