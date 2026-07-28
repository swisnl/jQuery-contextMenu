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

QUnit.test('hover trigger should not dispatch against a trigger removed from the document during its delay', function(assert) {
  var done = assert.async();
  var $fixture = $('#qunit-fixture');
  if ($fixture.length === 0) {
    $('<div id="qunit-fixture">').appendTo('body');
    $fixture = $('#qunit-fixture');
  }

  $fixture.append('<span class="hover-trigger">hover me</span>');
  var $trigger = $('.hover-trigger');

  var menuOpenCount = 0;
  $.contextMenu({
    selector: '.hover-trigger',
    trigger: 'hover',
    delay: 10,
    events: {
      show: function() { menuOpenCount++; }
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  $trigger.trigger($.Event('mouseenter', {pageX: 0, pageY: 0}));
  // remove the trigger from the document before the hover delay elapses
  $trigger.remove();

  setTimeout(function() {
    assert.equal(menuOpenCount, 0, 'menu should not open for a trigger that was removed before the delay elapsed');
    done();
  }, 30);
});
