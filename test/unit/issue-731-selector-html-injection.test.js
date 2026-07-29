// Regression tests for https://github.com/swisnl/jQuery-contextMenu/issues/731
//
// jQuery evaluates a string that looks like markup as HTML to build instead of
// running it as a CSS selector, so any caller-supplied string that is meant to
// be a selector must never reach `$(...)` directly.
//
// The payload below is an <img> with an invalid data URI, so the browser fires
// its `error` handler without needing a network round trip. The handler sets a
// flag, which is what the assertions check. Feeding the payload to a hardened
// call site is expected to either do nothing or make jQuery throw its usual
// "unrecognized expression" selector error - both are fine, as long as no
// element is built and no script runs.
var XSS_PAYLOAD = '<img data-xss-731="1" src="data:image/png;base64,not-an-image" ' +
    'onerror="window.__contextMenuXss731 = true;">';

function xssRan() {
  return window.__contextMenuXss731 === true;
}

function imageCount() {
  return document.querySelectorAll('img').length;
}

function assertNotEvaluatedAsHtml(assert, imagesBefore, fn) {
  var done = assert.async();

  try {
    fn();
  } catch (e) {
    assert.ok(
      /unrecognized expression|Syntax error/i.test(e.message || ''),
      'the payload was rejected as an invalid selector, not built as HTML'
    );
  }

  assert.equal(imageCount(), imagesBefore, 'no <img> was added to the document');

  setTimeout(function() {
    assert.notOk(xssRan(), 'the onerror payload never ran');
    done();
  }, 250);
}

QUnit.module('issue 731 - selector strings are never parsed as HTML', {
  beforeEach: function() {
    window.__contextMenuXss731 = false;
    this.imagesBefore = imageCount();
  },
  afterEach: function() {
    $.contextMenu('destroy');
    try {
      delete window.__contextMenuXss731;
    } catch (e) {
      window.__contextMenuXss731 = false;
    }
    $('img[data-xss-731]').remove();
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

QUnit.test('$.contextMenu("destroy", {context: html}) does not evaluate the string as HTML', function(assert) {
  assertNotEvaluatedAsHtml(assert, this.imagesBefore, function() {
    $.contextMenu('destroy', {context: XSS_PAYLOAD});
  });
});

QUnit.test('$.contextMenu("update", {context: html}) does not evaluate the string as HTML', function(assert) {
  assertNotEvaluatedAsHtml(assert, this.imagesBefore, function() {
    $.contextMenu('update', {context: XSS_PAYLOAD});
  });
});

QUnit.test('$.contextMenu("create", {context: html}) does not evaluate the string as HTML', function(assert) {
  assertNotEvaluatedAsHtml(assert, this.imagesBefore, function() {
    $.contextMenu({
      selector: '.issue-731-trigger',
      context: XSS_PAYLOAD,
      items: {copy: {name: 'Copy'}}
    });
  });
});

QUnit.test('appendTo does not evaluate the string as HTML', function(assert) {
  assertNotEvaluatedAsHtml(assert, this.imagesBefore, function() {
    $.contextMenu({
      selector: '.issue-731-trigger',
      appendTo: XSS_PAYLOAD,
      items: {copy: {name: 'Copy'}}
    });
  });
});

QUnit.test('$.contextMenu.fromMenu does not evaluate the string as HTML', function(assert) {
  assertNotEvaluatedAsHtml(assert, this.imagesBefore, function() {
    $.contextMenu.fromMenu(XSS_PAYLOAD);
  });
});

QUnit.module('issue 731 - supported selector inputs keep working', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
    $('#issue-731-container').remove();
  }
});

// Build a container with one trigger inside it and an identical trigger
// outside it. A `context` that was resolved as a selector scopes the
// registration to the container, so only the inner trigger opens a menu. A
// `context` that got parsed as HTML instead resolves to a detached node, and
// then neither trigger would.
function setupScopedFixture() {
  var $fixture = $('#qunit-fixture');
  var fixture = {
    $container: $('<div id="issue-731-container"></div>').appendTo($fixture)
  };

  fixture.$inside = $('<span class="issue-731-trigger">inside</span>').appendTo(fixture.$container);
  fixture.$outside = $('<span class="issue-731-trigger">outside</span>').appendTo($fixture);

  return fixture;
}

function registerScopedMenu(context, counter) {
  $.contextMenu({
    context: context,
    selector: '.issue-731-trigger',
    events: {
      show: function() {
        counter.shown++;
      }
    },
    items: {copy: {name: 'Copy'}}
  });
}

QUnit.test('context may be a selector string', function(assert) {
  var fixture = setupScopedFixture();
  var counter = {shown: 0};

  registerScopedMenu('#issue-731-container', counter);

  fixture.$outside.trigger($.Event('contextmenu'));
  assert.equal(counter.shown, 0, 'a trigger outside the string context is not handled');

  fixture.$inside.trigger($.Event('contextmenu'));
  assert.equal(counter.shown, 1, 'a trigger inside the string context opens the menu');
});

// A raw Element has no `length`, so `!o.context.length` sends it down the "no
// context" branch and it silently becomes `document` - the registration is not
// scoped to the element at all. That is pre-existing behaviour, unrelated to
// this change; all that is asserted here is that an Element context still
// yields a working menu.
QUnit.test('context may be an Element', function(assert) {
  var fixture = setupScopedFixture();
  var counter = {shown: 0};

  registerScopedMenu(fixture.$container.get(0), counter);

  fixture.$inside.trigger($.Event('contextmenu'));
  assert.equal(counter.shown, 1, 'a trigger inside the Element context opens the menu');
});

QUnit.test('context may be a jQuery object', function(assert) {
  var fixture = setupScopedFixture();
  var counter = {shown: 0};

  registerScopedMenu(fixture.$container, counter);

  fixture.$outside.trigger($.Event('contextmenu'));
  assert.equal(counter.shown, 0, 'a trigger outside the jQuery object context is not handled');

  fixture.$inside.trigger($.Event('contextmenu'));
  assert.equal(counter.shown, 1, 'a trigger inside the jQuery object context opens the menu');
});

// `destroy` treats `context` as the trigger element - that is what
// `$.fn.contextMenu('destroy')` passes - so a context only tears anything down
// when it resolves to an element matching the menu's own selector. The menu is
// deliberately never opened first: an already open menu is repositioned rather
// than re-shown on a second trigger, which would mask a destroy that silently
// did nothing.
QUnit.test('destroy resolves a string context to the trigger element', function(assert) {
  var $trigger = $('<span class="issue-731-trigger">trigger</span>').appendTo($('#qunit-fixture'));

  var shown = 0;
  $.contextMenu({
    selector: '.issue-731-trigger',
    events: {
      show: function() {
        shown++;
      }
    },
    items: {copy: {name: 'Copy'}}
  });

  $.contextMenu('destroy', {context: '.issue-731-trigger'});

  $trigger.trigger($.Event('contextmenu'));
  assert.equal(shown, 0, 'the registration was torn down through a string context');
});

QUnit.test('destroy resolves a jQuery object context to the trigger element', function(assert) {
  var $trigger = $('<span class="issue-731-trigger">trigger</span>').appendTo($('#qunit-fixture'));

  var shown = 0;
  $.contextMenu({
    selector: '.issue-731-trigger',
    events: {
      show: function() {
        shown++;
      }
    },
    items: {copy: {name: 'Copy'}}
  });

  $.contextMenu('destroy', {context: $trigger});

  $trigger.trigger($.Event('contextmenu'));
  assert.equal(shown, 0, 'the registration was torn down through a jQuery object context');
});

QUnit.test('appendTo may be a selector string or an Element', function(assert) {
  var $fixture = $('#qunit-fixture');
  var $container = $('<div id="issue-731-container"></div>').appendTo($fixture);

  $.contextMenu({
    selector: '.issue-731-trigger',
    appendTo: '#issue-731-container',
    items: {copy: {name: 'Copy'}}
  });

  assert.equal($container.children('ul.context-menu-list').length, 1, 'menu appended to the string selector target');

  $.contextMenu('destroy');

  $.contextMenu({
    selector: '.issue-731-trigger',
    appendTo: $container.get(0),
    items: {copy: {name: 'Copy'}}
  });

  assert.equal($container.children('ul.context-menu-list').length, 1, 'menu appended to the Element target');
});
