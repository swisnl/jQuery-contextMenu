QUnit.module('issue 754 repro', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

QUnit.test('left-click trigger should not bubble a synthetic contextmenu event to unrelated ancestor handlers', function(assert) {
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }

  $fixture.append('<div class="outer-grid"><span class="left-trigger">left click me</span></div>');

  var outerContextMenuCount = 0;
  $('.outer-grid').on('contextmenu', function() {
    outerContextMenuCount++;
  });

  var menuOpenCount = 0;
  $.contextMenu({
    selector: '.left-trigger',
    trigger: 'left',
    events: {
      show: function() { menuOpenCount++; }
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  $('.left-trigger').trigger($.Event('click', {which: 1, button: 0}));

  assert.equal(menuOpenCount, 1, 'sanity check: our own contextMenu opened once');
  assert.equal(outerContextMenuCount, 0, 'unrelated ancestor contextmenu handler should NOT fire on left-click trigger');
});
