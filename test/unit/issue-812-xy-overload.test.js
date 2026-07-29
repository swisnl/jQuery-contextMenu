QUnit.module('issue 812 - $.fn.contextMenu({x, y}) overload', {
  beforeEach: function() {
    var $fixture = $('#qunit-fixture');
    if ($fixture.length === 0) {
      $('<div id="qunit-fixture">').appendTo('body');
      $fixture = $('#qunit-fixture');
    }
    $fixture.html('<button class="issue-812-trigger">Trigger</button>');
  },
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

// Registers a menu on .issue-812-trigger and records how it gets positioned.
// Returns the recorder so a test can inspect what reached `position` /
// `determinePosition`.
function registerIssue812Menu(extraOptions) {
  var recorder = {
    positionArgs: [],
    determinePositionCalls: 0,
    showCalls: 0
  };

  $.contextMenu($.extend({
    selector: '.issue-812-trigger',
    determinePosition: function($menu) {
      recorder.determinePositionCalls++;
      $menu.css({top: 0, left: 0});
    },
    events: {
      show: function() {
        recorder.showCalls++;
      }
    },
    items: {
      copy: {name: 'Copy'}
    }
  }, extraOptions || {}));

  return {recorder: recorder};
}

QUnit.test('{x: undefined, y: undefined} does not throw "No selector specified"', function(assert) {
  // Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/812
  // pageX/pageY are undefined for keyboard-originated or synthetic events, so
  // {x: e.pageX, y: e.pageY} legitimately ends up with undefined values. That
  // used to fall through to the plain-object branch and be treated as a menu
  // definition, throwing "No selector specified".
  var menu = registerIssue812Menu();

  var thrown = null;
  try {
    $('.issue-812-trigger').contextMenu({x: undefined, y: undefined});
  } catch (e) {
    thrown = e;
  }

  assert.equal(thrown, null, 'showing with undefined coordinates did not throw' + (thrown ? ' (got: ' + thrown.message + ')' : ''));
  assert.equal(menu.recorder.showCalls, 1, 'the menu was shown');
  assert.equal(menu.recorder.determinePositionCalls, 1, 'it fell back to the element-relative default position');
});

QUnit.test('finite coordinates are forwarded as page coordinates', function(assert) {
  var recorded = [];
  var menu = registerIssue812Menu({
    position: function(opt, x, y) {
      recorded.push([x, y]);
      opt.$menu.css({top: 0, left: 0});
    }
  });

  $('.issue-812-trigger').contextMenu({x: 123, y: 456});

  assert.equal(menu.recorder.showCalls, 1, 'the menu was shown');
  assert.deepEqual(recorded, [[123, 456]], 'x and y reached position() unchanged');
});

QUnit.test('numeric strings keep working and arrive as numbers', function(assert) {
  // The positioning arithmetic has always coped with numeric strings, e.g.
  // coordinates read straight off a data attribute, so they must not start
  // silently falling back.
  var recorded = [];
  var menu = registerIssue812Menu({
    position: function(opt, x, y) {
      recorded.push([x, y]);
      opt.$menu.css({top: 0, left: 0});
    }
  });

  $('.issue-812-trigger').contextMenu({x: '123', y: '456'});

  assert.equal(menu.recorder.determinePositionCalls, 0, 'numeric strings did not fall back');
  assert.deepEqual(recorded, [[123, 456]], 'numeric strings reached position() as numbers');
});

QUnit.test('zero is a valid coordinate and is not treated as "no coordinates"', function(assert) {
  var recorded = [];
  var menu = registerIssue812Menu({
    position: function(opt, x, y) {
      recorded.push([x, y]);
      opt.$menu.css({top: 0, left: 0});
    }
  });

  $('.issue-812-trigger').contextMenu({x: 0, y: 0});

  assert.equal(menu.recorder.showCalls, 1, 'the menu was shown');
  assert.deepEqual(recorded, [[0, 0]], '0/0 reached position() as real coordinates');
});

QUnit.test('the default position() places a menu at 0/0 instead of falling back', function(assert) {
  // The default position() used to bail out to determinePosition() on
  // `!x && !y`, which also caught the perfectly valid page origin.
  var menu = registerIssue812Menu();

  $('.issue-812-trigger').contextMenu({x: 0, y: 0});

  assert.equal(menu.recorder.determinePositionCalls, 0, 'determinePosition() was not used for an explicit 0/0');
});

QUnit.test('a half-filled coordinate pair falls back instead of positioning at NaN', function(assert) {
  var menu = registerIssue812Menu();

  var thrown = null;
  try {
    $('.issue-812-trigger').contextMenu({x: 123, y: undefined});
  } catch (e) {
    thrown = e;
  }

  assert.equal(thrown, null, 'showing with only one coordinate did not throw');
  assert.equal(menu.recorder.determinePositionCalls, 1, 'it fell back to the element-relative default position');

  var $menu = $('.issue-812-trigger').data('contextMenu').$menu;
  assert.notOk(isNaN(parseFloat($menu.css('top'))), 'the menu top is a real number');
  assert.notOk(isNaN(parseFloat($menu.css('left'))), 'the menu left is a real number');
});

QUnit.test('non-numeric coordinates fall back to the element-relative position', function(assert) {
  var menu = registerIssue812Menu();

  var thrown = null;
  try {
    $('.issue-812-trigger').contextMenu({x: 'nope', y: null});
  } catch (e) {
    thrown = e;
  }

  assert.equal(thrown, null, 'showing with non-numeric coordinates did not throw');
  assert.equal(menu.recorder.showCalls, 1, 'the menu was shown');
  assert.equal(menu.recorder.determinePositionCalls, 1, 'it fell back to the element-relative default position');
});

QUnit.test('an omitted coordinate key falls back as well', function(assert) {
  // Raised in review: {x: 123} - the key genuinely missing rather than
  // undefined - must behave the same as {x: 123, y: undefined}.
  var menu = registerIssue812Menu();

  var thrown = null;
  try {
    $('.issue-812-trigger').contextMenu({x: 123});
  } catch (e) {
    thrown = e;
  }

  assert.equal(thrown, null, 'showing with only an x key did not throw');
  assert.equal(menu.recorder.determinePositionCalls, 1, 'it fell back to the element-relative default position');

  $('.issue-812-trigger').contextMenu('hide');
  $('.issue-812-trigger').contextMenu({y: 123});
  assert.equal(menu.recorder.determinePositionCalls, 2, 'the same goes for only a y key');
});

QUnit.test('negative coordinates are real coordinates', function(assert) {
  var recorded = [];
  var menu = registerIssue812Menu({
    position: function(opt, x, y) {
      recorded.push([x, y]);
      opt.$menu.css({top: 0, left: 0});
    }
  });

  $('.issue-812-trigger').contextMenu({x: -5, y: -10});

  assert.equal(menu.recorder.determinePositionCalls, 0, 'negative coordinates did not fall back');
  assert.deepEqual(recorded, [[-5, -10]], 'negative coordinates reached position() unchanged');
});

QUnit.test('a menu definition carrying x/y keys is still a menu definition', function(assert) {
  // The overload is detected by key presence, so a definition object that
  // happens to have x/y properties of its own must not be hijacked into the
  // positioning branch.
  var shown = 0;

  $('#qunit-fixture').contextMenu({
    selector: '.issue-812-trigger',
    x: 10,
    y: 20,
    events: {
      show: function() {
        shown++;
      }
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  $('.issue-812-trigger').trigger($.Event('contextmenu'));

  assert.equal(shown, 1, 'the definition was registered as a menu, not treated as coordinates');
});

QUnit.test('a plain object without x/y keys is still treated as a menu definition', function(assert) {
  var shown = 0;

  $('#qunit-fixture').contextMenu({
    selector: '.issue-812-trigger',
    events: {
      show: function() {
        shown++;
      }
    },
    items: {
      copy: {name: 'Copy'}
    }
  });

  $('.issue-812-trigger').trigger($.Event('contextmenu'));

  assert.equal(shown, 1, 'the jQuery-fn create shorthand still registers a menu');
});

QUnit.test('every other $.fn.contextMenu() call shape is unchanged', function(assert) {
  // Pins the operations that share the same dispatch chain as the {x, y}
  // overload, so widening the coordinate detection cannot break them.
  var menu = registerIssue812Menu();
  var $trigger = $('.issue-812-trigger');

  // no argument at all: show, positioned relative to the element
  $trigger.contextMenu();
  assert.equal(menu.recorder.showCalls, 1, 'no-argument form shows the menu');
  assert.equal(menu.recorder.determinePositionCalls, 1, 'no-argument form positions relative to the element');

  // 'hide'
  $trigger.contextMenu('hide');
  assert.notOk($trigger.hasClass('context-menu-active'), '"hide" closed the menu');

  // false / true: disable and re-enable the trigger
  $trigger.contextMenu(false);
  assert.ok($trigger.hasClass('context-menu-disabled'), 'false disables the trigger');
  $trigger.trigger($.Event('contextmenu'));
  assert.equal(menu.recorder.showCalls, 1, 'a disabled trigger does not show the menu');

  $trigger.contextMenu(true);
  assert.notOk($trigger.hasClass('context-menu-disabled'), 'true re-enables the trigger');
  $trigger.trigger($.Event('contextmenu'));
  assert.equal(menu.recorder.showCalls, 2, 'a re-enabled trigger shows the menu again');
  $trigger.contextMenu('hide');

  // 'destroy'
  $trigger.contextMenu('destroy');
  $trigger.trigger($.Event('contextmenu'));
  assert.equal(menu.recorder.showCalls, 2, '"destroy" unregistered the menu');
});
