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

QUnit.test('context may be a selector string', function(assert) {
  var $fixture = $('#qunit-fixture');
  var $container = $('<div id="issue-731-container"></div>').appendTo($fixture);
  $('<span class="issue-731-trigger">trigger</span>').appendTo($container);

  var shown = 0;
  $.contextMenu({
    context: '#issue-731-container',
    selector: '.issue-731-trigger',
    events: {
      show: function() {
        shown++;
      }
    },
    items: {copy: {name: 'Copy'}}
  });

  $container.find('.issue-731-trigger').trigger($.Event('contextmenu'));
  assert.equal(shown, 1, 'menu opened for a string context');

  $.contextMenu('destroy', {context: '#issue-731-container'});
  $container.find('.issue-731-trigger').trigger($.Event('contextmenu'));
  assert.equal(shown, 1, 'menu was destroyed through a string context');
});

QUnit.test('context may be an Element or a jQuery object', function(assert) {
  var $fixture = $('#qunit-fixture');
  var $container = $('<div id="issue-731-container"></div>').appendTo($fixture);
  $('<span class="issue-731-trigger">trigger</span>').appendTo($container);

  var shown = 0;
  $.contextMenu({
    context: $container.get(0),
    selector: '.issue-731-trigger',
    events: {
      show: function() {
        shown++;
      }
    },
    items: {copy: {name: 'Copy'}}
  });

  $container.find('.issue-731-trigger').trigger($.Event('contextmenu'));
  assert.equal(shown, 1, 'menu opened for an Element context');

  $.contextMenu('destroy', {context: $container});
  $container.find('.issue-731-trigger').trigger($.Event('contextmenu'));
  assert.equal(shown, 1, 'menu was destroyed through a jQuery object context');
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
