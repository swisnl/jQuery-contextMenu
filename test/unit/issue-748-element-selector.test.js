QUnit.module('issue 748 - Element/jQuery object as selector', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

QUnit.test('selector can be a raw, not-yet-attached DOM Element', function(assert) {
  // Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/748
  // Mirrors the issue's example: create the element first, register the
  // contextMenu against the element itself (not a CSS selector), and only
  // then insert it into the document.
  var element = document.createElement('button');
  element.textContent = 'Click Me';

  var menuOpenCount = 0;
  $.contextMenu({
    selector: element,
    events: {
      show: function() { menuOpenCount++; }
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  $fixture.append(element);

  $(element).trigger($.Event('contextmenu'));

  assert.equal(menuOpenCount, 1, 'contextMenu opened for an Element-based selector');

  var didThrow = false;
  try {
    $.contextMenu('destroy', element);
  } catch (e) {
    didThrow = true;
  }
  assert.notOk(didThrow, 'destroying by Element did not throw');

  menuOpenCount = 0;
  $(element).trigger($.Event('contextmenu'));
  assert.equal(menuOpenCount, 0, 'contextMenu no longer opens after being destroyed');
});

QUnit.test('selector can be a jQuery-wrapped Element', function(assert) {
  var element = document.createElement('button');
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  $fixture.append(element);

  var menuOpenCount = 0;
  $.contextMenu({
    selector: $(element),
    events: {
      show: function() { menuOpenCount++; }
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  $(element).trigger($.Event('contextmenu'));
  assert.equal(menuOpenCount, 1, 'contextMenu opened for a jQuery-object selector');

  $.contextMenu('destroy', $(element));

  menuOpenCount = 0;
  $(element).trigger($.Event('contextmenu'));
  assert.equal(menuOpenCount, 0, 'contextMenu no longer opens after being destroyed via jQuery-object selector');
});

QUnit.test('destroy + re-registration on the same Element does not throw or double-bind', function(assert) {
  var element = document.createElement('button');
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  $fixture.append(element);

  var menuOpenCount = 0;
  var register = function() {
    $.contextMenu({
      selector: element,
      events: {
        show: function() { menuOpenCount++; }
      },
      items: {
        copy: {name: 'Copy'}
      }
    });
  };

  var didThrow = false;
  try {
    register();
    $.contextMenu('destroy', element);
    register();
    $.contextMenu('destroy', element);
    register();
  } catch (e) {
    didThrow = true;
  }

  assert.notOk(didThrow, 'repeated destroy/re-register cycles on the same Element did not throw');

  $(element).trigger($.Event('contextmenu'));
  assert.equal(menuOpenCount, 1, 'contextMenu opened exactly once (no leftover double-bound handlers from earlier registrations)');
});

QUnit.test('global destroy (no selector) also tears down Element-based registrations', function(assert) {
  var element = document.createElement('button');
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  $fixture.append(element);

  var menuOpenCount = 0;
  $.contextMenu({
    selector: element,
    events: {
      show: function() { menuOpenCount++; }
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  $.contextMenu('destroy');

  var didThrow = false;
  try {
    $(element).trigger($.Event('contextmenu'));
  } catch (e) {
    didThrow = true;
  }

  assert.notOk(didThrow, 'triggering contextmenu after a global destroy did not throw');
  assert.equal(menuOpenCount, 0, 'contextMenu did not open after a global destroy');
});

QUnit.test('element selector combined with a custom context (via $(container).contextMenu()) is torn down by a global destroy', function(assert) {
  // Regression test for a gap flagged during PR review for
  // https://github.com/swisnl/jQuery-contextMenu/issues/748: when an
  // Element/jQuery-object selector is registered together with a
  // non-document `context` - as happens with the `$(container).contextMenu({...})`
  // jQuery-fn shorthand, which sets `context` to the container - the direct
  // binding on the element must still be tracked so a later destroy can find
  // and remove it. It must not become permanently unremovable.
  var container = document.createElement('div');
  var element = document.createElement('button');
  container.appendChild(element);

  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  $fixture.append(container);

  var menuOpenCount = 0;
  $(container).contextMenu({
    selector: element,
    events: {
      show: function() { menuOpenCount++; }
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  $(element).trigger($.Event('contextmenu'));
  assert.equal(menuOpenCount, 1, 'contextMenu opened for an Element selector registered with a custom context');

  // A subsequent *global* destroy (no selector, no context) must also tear
  // down this direct binding.
  $.contextMenu('destroy');

  menuOpenCount = 0;
  var didThrow = false;
  try {
    $(element).trigger($.Event('contextmenu'));
  } catch (e) {
    didThrow = true;
  }

  assert.notOk(didThrow, 'triggering contextmenu after a global destroy did not throw');
  assert.equal(menuOpenCount, 0, 'contextMenu no longer opens after a global destroy, even though it was registered with a custom context');
});

QUnit.test('element selector combined with a custom context can be destroyed directly by element', function(assert) {
  var container = document.createElement('div');
  var element = document.createElement('button');
  container.appendChild(element);

  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  $fixture.append(container);

  var menuOpenCount = 0;
  $(container).contextMenu({
    selector: element,
    events: {
      show: function() { menuOpenCount++; }
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  $(element).trigger($.Event('contextmenu'));
  assert.equal(menuOpenCount, 1, 'sanity check: contextMenu opened once before destroy');

  $.contextMenu('destroy', element);

  menuOpenCount = 0;
  $(element).trigger($.Event('contextmenu'));
  assert.equal(menuOpenCount, 0, 'contextMenu no longer opens after being destroyed directly by element, even though it was registered with a custom context');
});
