// Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/771
//
// When the transparent layer behind an open context menu is clicked, the
// plugin figures out which element is really "under" the click (using
// document.elementFromPoint) and re-dispatches the original event on that
// element, so that clicking outside the menu also lets the click "pass
// through" to whatever was underneath it.
//
// The event object that gets re-dispatched is the very same jQuery.Event
// instance that was dispatched for the click on the layer itself. jQuery's
// trigger() only ever assigns `event.target` when it isn't already set, so
// re-triggering that same event object on a different element does NOT
// update `event.target` - it keeps pointing at the layer. Handlers bound to
// the "real" target therefore see the wrong `event.target`.

QUnit.module('layerClick target retargeting', {
  afterEach: function () {
    $.contextMenu('destroy');

    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }

    $('#layerclick-other-target').remove();
    $('#context-menu-layer').remove();
  }
});

QUnit.test('clicking outside the menu dispatches the event with the actual clicked element as event.target', function (assert) {
  var done = assert.async();

  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }
  $fixture.append('<div class="layerclick-trigger">right click me!</div>');

  $.contextMenu({
    selector: '.layerclick-trigger',
    items: {
      copy: {name: 'Copy'}
    }
  });

  // #qunit-fixture is positioned off-screen (top:-10000px) by qunit.css, so
  // document.elementFromPoint() would never find anything inside it. Render
  // the "other" element directly on body, on-screen, instead.
  var $other = $('<div id="layerclick-other-target" style="position:fixed;top:10px;left:10px;width:40px;height:40px;"></div>')
    .appendTo(document.body);

  var seenTarget = null;
  $other.on('mousedown', function (e) {
    seenTarget = e.target;
  });

  // open the menu far away from $other so the menu itself doesn't overlap it
  $('.layerclick-trigger').contextMenu({x: 400, y: 400});

  var $layer = $('#context-menu-layer');
  assert.equal($layer.length, 1, 'context menu layer was created');

  var rect = $other[0].getBoundingClientRect();
  var x = rect.left + rect.width / 2;
  var y = rect.top + rect.height / 2;

  // simulate a left mousedown on the layer, positioned right over $other
  $layer.trigger($.Event('mousedown', {pageX: x, pageY: y, which: 1, button: 0}));

  setTimeout(function () {
    assert.ok(seenTarget, 'mousedown handler on the underlying element fired');
    assert.equal(seenTarget, $other[0], 'event.target seen by the handler is the clicked element, not the layer');
    done();
  }, 100);
});
