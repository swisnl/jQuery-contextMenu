QUnit.module('issue 740 - $.contextMenu("update")', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

function fixture740() {
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  return $fixture;
}

function firstItemDisabled(selector) {
  return $(selector).find('li').first().hasClass('context-menu-disabled');
}

QUnit.test('update() called from events.show does not throw and applies the disabled function', function(assert) {
  var $fixture = fixture740();
  $fixture.append('<div class="t740a">right click me</div>');

  var isDisabled = true;
  $.contextMenu({
    selector: '.t740a',
    events: {
      show: function() {
        $.contextMenu('update');
        return true;
      }
    },
    items: {
      edit: {name: 'Edit', disabled: function() { return isDisabled; }},
      copy: {name: 'Copy'}
    }
  });

  var err = null;
  try {
    $('.t740a').trigger('contextmenu');
  } catch (e) {
    err = e;
  }
  assert.equal(err, null, 'no exception was thrown');
  assert.ok(firstItemDisabled('.context-menu-list'), 'item is disabled while the function returns true');
});

QUnit.test('update() does not throw when a build menu has never been shown', function(assert) {
  var $fixture = fixture740();
  $fixture.append('<div class="t740b">right click me</div><div class="t740b-build">other trigger</div>');

  // a `build` menu only gets its $menu the first time it is shown - until then
  // its registration has no menu element for update() to walk.
  $.contextMenu({
    selector: '.t740b-build',
    build: function() {
      return {items: {foo: {name: 'Foo'}}};
    }
  });

  $.contextMenu({
    selector: '.t740b',
    events: {
      show: function() {
        $.contextMenu('update');
        return true;
      }
    },
    items: {
      edit: {name: 'Edit', disabled: function() { return true; }}
    }
  });

  var err = null;
  try {
    $('.t740b').trigger('contextmenu');
  } catch (e) {
    err = e;
  }
  assert.equal(err, null, 'no exception was thrown');
  assert.ok(firstItemDisabled('.context-menu-list'), 'the static menu was still updated');
});

QUnit.test('update() from the events.show of a build menu does not throw', function(assert) {
  var $fixture = fixture740();
  $fixture.append('<div class="t740c">right click me</div>');

  $.contextMenu({
    selector: '.t740c',
    events: {
      show: function() {
        $.contextMenu('update');
        return true;
      }
    },
    build: function() {
      return {
        items: {
          edit: {name: 'Edit', disabled: function() { return true; }}
        }
      };
    }
  });

  var err = null;
  try {
    $('.t740c').trigger('contextmenu');
  } catch (e) {
    err = e;
  }
  assert.equal(err, null, 'no exception was thrown');
});

QUnit.test('update() refreshes an open build menu, not just static ones', function(assert) {
  var $fixture = fixture740();
  $fixture.append('<div class="t740f">right click me</div>');

  var isDisabled = false;
  $.contextMenu({
    selector: '.t740f',
    build: function() {
      return {
        items: {
          edit: {name: 'Edit', disabled: function() { return isDisabled; }}
        }
      };
    }
  });

  $('.t740f').trigger('contextmenu');
  assert.notOk(firstItemDisabled('.context-menu-list'), 'item starts out enabled');

  isDisabled = true;
  $.contextMenu('update');
  assert.ok(firstItemDisabled('.context-menu-list'), 'the on-screen build menu was refreshed');
});

QUnit.test('update() runs function-based options against the trigger element', function(assert) {
  var $fixture = fixture740();
  $fixture.append('<div class="t740g">right click me</div>');

  var seenThis = null;
  $.contextMenu({
    selector: '.t740g',
    items: {
      edit: {
        name: 'Edit',
        disabled: function() {
          seenThis = this;
          return !!(this && this.hasClass && this.hasClass('lock-it'));
        }
      }
    }
  });

  $('.t740g').trigger('contextmenu');
  assert.notOk(firstItemDisabled('.context-menu-list'), 'item starts out enabled');

  $('.t740g').addClass('lock-it');
  $.contextMenu('update');

  assert.ok(seenThis && seenThis.jquery, '`this` is a jQuery object, not the internal op object');
  assert.ok(seenThis && seenThis.is('.t740g'), '`this` is the trigger element');
  assert.ok(firstItemDisabled('.context-menu-list'), 'the trigger-dependent disabled state was applied');
});

QUnit.test('update() scoped to a context updates that context\'s menu', function(assert) {
  var $fixture = fixture740();
  $fixture.append('<div class="t740e-ctx"><div class="t740e">right click me</div></div>');

  var isDisabled = false;
  $('.t740e-ctx').contextMenu({
    selector: '.t740e',
    items: {
      edit: {name: 'Edit', disabled: function() { return isDisabled; }}
    }
  });

  $('.t740e').trigger('contextmenu');
  assert.notOk(firstItemDisabled('.context-menu-list'), 'item starts out enabled');

  isDisabled = true;
  var err = null;
  try {
    $.contextMenu('update', {context: '.t740e-ctx'});
  } catch (e) {
    err = e;
  }
  assert.equal(err, null, 'no exception was thrown');
  assert.ok(firstItemDisabled('.context-menu-list'), 'item became disabled after the scoped update');
});

QUnit.test('a disabled function is re-evaluated on every open without calling update()', function(assert) {
  var $fixture = fixture740();
  $fixture.append('<div class="t740d">right click me</div>');

  var isDisabled = true;
  $.contextMenu({
    selector: '.t740d',
    items: {
      edit: {name: 'Edit', disabled: function() { return isDisabled; }}
    }
  });

  $('.t740d').trigger('contextmenu');
  assert.ok(firstItemDisabled('.context-menu-list'), 'disabled on the first open');

  $('.context-menu-list').trigger('contextmenu:hide', {force: true});

  isDisabled = false;
  $('.t740d').trigger('contextmenu');
  assert.notOk(firstItemDisabled('.context-menu-list'), 'enabled on the second open');
});
