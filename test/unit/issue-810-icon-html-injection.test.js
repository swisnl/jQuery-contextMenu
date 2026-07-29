// Regression tests for https://github.com/swisnl/jQuery-contextMenu/issues/810
//
// The Font Awesome icon branches used to build their <i> element by string
// concatenation, so an `item.icon` value containing a quote or an angle bracket
// broke out of the class attribute and injected arbitrary markup. That matters
// for any menu whose icon names come from stored or otherwise non-literal data.
//
// The payload below is an <img> with an invalid data URI, so the browser fires
// its `error` handler without needing a network round trip. The handler sets a
// flag, which is what the assertions check.
var ICON_XSS_TAIL = ' "><img data-xss-810="1" src="data:image/png;base64,not-an-image" ' +
    'onerror="window.__contextMenuXss810 = true;">';

function xssRan810() {
  return window.__contextMenuXss810 === true;
}

function imageCount810() {
  return document.querySelectorAll('img').length;
}

function fixture810() {
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  return $fixture;
}

// Registering a menu builds its <ul> straight away, so the item markup can be
// inspected without ever opening the menu.
function buildMenuWithIcon(icon) {
  fixture810().append('<div class="t810">right click me</div>');

  $.contextMenu({
    selector: '.t810',
    items: {
      first: {name: 'First', icon: icon}
    }
  });

  return $('ul.context-menu-list').find('li.context-menu-item').first();
}

function assertIconNotParsedAsHtml(assert, imagesBefore, $item) {
  var done = assert.async();

  assert.equal(imageCount810(), imagesBefore, 'no <img> was added to the document');
  assert.equal($item.find('img').length, 0, 'no <img> was injected into the menu item');

  setTimeout(function() {
    assert.notOk(xssRan810(), 'the onerror payload never ran');
    done();
  }, 250);
}

QUnit.module('issue 810 - item.icon is never parsed as HTML', {
  beforeEach: function() {
    window.__contextMenuXss810 = false;
    this.imagesBefore = imageCount810();
  },
  afterEach: function() {
    $.contextMenu('destroy');
    try {
      delete window.__contextMenuXss810;
    } catch (e) {
      window.__contextMenuXss810 = false;
    }
    $('img[data-xss-810]').remove();
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

QUnit.test('a Font Awesome 5 style icon cannot break out of the class attribute', function(assert) {
  var $item = buildMenuWithIcon('fas fa-trash' + ICON_XSS_TAIL);

  assertIconNotParsedAsHtml(assert, this.imagesBefore, $item);
});

QUnit.test('a legacy fa- style icon cannot break out of the class attribute', function(assert) {
  var $item = buildMenuWithIcon('fa-trash' + ICON_XSS_TAIL);

  assertIconNotParsedAsHtml(assert, this.imagesBefore, $item);
});

QUnit.test('the whole payload ends up as class names on the <i>, markup and all', function(assert) {
  var $item = buildMenuWithIcon('fas fa-trash' + ICON_XSS_TAIL);
  var $icon = $item.children('i');

  assert.equal($icon.length, 1, 'exactly one <i> was created');
  assert.equal($icon.children().length, 0, 'the <i> has no child elements');
  assert.ok($icon.hasClass('fas'), 'the leading legitimate class survives');
  assert.ok($icon.hasClass('fa-trash'), 'the icon class survives');
});

QUnit.module('issue 810 - supported icon inputs keep working', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

QUnit.test('a Font Awesome 5 style icon becomes an <i> with those classes', function(assert) {
  var $item = buildMenuWithIcon('fas fa-trash');
  var $icon = $item.children('i');

  assert.equal($icon.length, 1, 'an <i> was prepended to the item');
  assert.ok($icon.hasClass('fas'), 'the style class is applied');
  assert.ok($icon.hasClass('fa-trash'), 'the icon class is applied');
  assert.ok($item.hasClass('context-menu-icon'), 'the item is flagged as having an icon');
  assert.ok($item.hasClass('context-menu-icon--fa5'), 'the item gets the Font Awesome modifier');
});

QUnit.test('a legacy fa- icon becomes an <i> with the fa base class', function(assert) {
  var $item = buildMenuWithIcon('fa-trash');
  var $icon = $item.children('i');

  assert.equal($icon.length, 1, 'an <i> was prepended to the item');
  assert.ok($icon.hasClass('fa'), 'the fa base class is applied');
  assert.ok($icon.hasClass('fa-trash'), 'the icon class is applied');
  assert.ok($item.hasClass('context-menu-icon--fa5'), 'the item gets the Font Awesome modifier');
});

QUnit.test('a built-in icon name stays a class on the item itself', function(assert) {
  var $item = buildMenuWithIcon('copy');

  assert.equal($item.children('i').length, 0, 'no <i> is created for the built-in icon font');
  assert.ok($item.hasClass('context-menu-icon'), 'the base icon class is applied to the item');
  assert.ok($item.hasClass('context-menu-icon-copy'), 'the icon name class is applied to the item');
});

QUnit.test('an icon function returning a class string is applied to the item', function(assert) {
  var $item = buildMenuWithIcon(function() {
    return 'my-icon-class';
  });

  assert.ok($item.hasClass('my-icon-class'), 'the returned class string is applied to the item');
});

QUnit.test('an icon function returning an element prepends that element', function(assert) {
  var $item = buildMenuWithIcon(function() {
    return $('<em class="custom-icon"></em>');
  });

  assert.equal($item.children('em.custom-icon').length, 1, 'the returned element was prepended');
});
