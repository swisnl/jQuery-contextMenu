// A function-based `item.icon` is invoked on every show/update, not only on
// create, so that the icon can track current state. op.update() removes the
// previous class before re-invoking it, but it used to remove `item._icon` --
// the *creation-time* result -- without ever storing the new one. A callback
// returning a different class as state changed therefore left every class it
// had ever returned on the item.
//
// See https://github.com/swisnl/jQuery-contextMenu/pull/794#pullrequestreview-4816334449

QUnit.module('issue 794 - callback icon classes across updates', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

function fixture794() {
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  return $fixture;
}

function firstItem794() {
  return $('.context-menu-list').first().find('li.context-menu-item').first();
}

QUnit.test('a callback returning a changing class leaves only the current one on the item', function(assert) {
  var $fixture = fixture794();
  $fixture.append('<div class="t794a">right click me</div>');

  var state = 'one';
  $.contextMenu({
    selector: '.t794a',
    items: {
      first: {
        name: 'First',
        icon: function() {
          return 'state-' + state;
        }
      }
    }
  });

  $('.t794a').contextMenu();
  var $item = firstItem794();
  assert.ok($item.hasClass('state-one'), 'the first state\'s class is applied');

  state = 'two';
  $.contextMenu('update');
  $item = firstItem794();
  assert.ok($item.hasClass('state-two'), 'the new state\'s class is applied');
  assert.notOk($item.hasClass('state-one'), 'the previous state\'s class is removed');

  state = 'three';
  $.contextMenu('update');
  $item = firstItem794();
  assert.ok($item.hasClass('state-three'), 'the third state\'s class is applied');
  assert.notOk($item.hasClass('state-two'), 'the second state\'s class is removed');
  assert.notOk($item.hasClass('state-one'), 'the first state\'s class is still gone');

  var stateClasses = ($item.attr('class') || '').split(/\s+/).filter(function(cls) {
    return cls.indexOf('state-') === 0;
  });
  assert.deepEqual(stateClasses, ['state-three'], 'exactly one state class remains after three updates');
});

// The overwhelmingly common case: a callback that always returns the same
// class. This behaved correctly before and must keep behaving identically, so
// it is pinned here rather than left to inference.
QUnit.test('a callback returning a constant class keeps that class across updates', function(assert) {
  var $fixture = fixture794();
  $fixture.append('<div class="t794b">right click me</div>');

  var calls = 0;
  $.contextMenu({
    selector: '.t794b',
    items: {
      first: {
        name: 'First',
        icon: function() {
          calls++;
          return 'constant-icon';
        }
      }
    }
  });

  $('.t794b').contextMenu();
  assert.ok(firstItem794().hasClass('constant-icon'), 'the class is applied on show');

  $.contextMenu('update');
  $.contextMenu('update');

  var $item = firstItem794();
  assert.ok($item.hasClass('constant-icon'), 'the class survives repeated updates');
  assert.ok(calls >= 2, 'the callback really was re-invoked (' + calls + ' calls)');

  var iconClasses = ($item.attr('class') || '').split(/\s+/).filter(function(cls) {
    return cls === 'constant-icon';
  });
  assert.deepEqual(iconClasses, ['constant-icon'], 'the class is not duplicated');
});
