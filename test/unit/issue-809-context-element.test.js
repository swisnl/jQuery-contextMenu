// Regression tests for https://github.com/swisnl/jQuery-contextMenu/issues/809
//
// `context` was normalized with `if (!o.context || !o.context.length)`, a test
// only jQuery objects and strings answer meaningfully. A raw DOM Element has no
// `length` at all, so it was dropped and the registration silently fell back to
// `document`: the menu worked, but page-wide instead of scoped to the element
// that was passed.
//
// Registering with an Element context is fixed here. The other shapes that
// check misjudges are deliberately left as they are, because newly honouring a
// context that is ignored today would silently un-scope menus that work today.
// Those cases are pinned below as "legacy behaviour, deliberately unchanged" so
// the compromise is visible rather than accidental.

// Wrapped in an IIFE: Karma loads every test file as a plain script into the
// same global scope, so top-level helpers would collide across files.
(function() {
  'use strict';

  function fixture() {
    var $fixture = $('#qunit-fixture');
    if ($fixture.length === 0) {
      $fixture = $('<div id="qunit-fixture">').appendTo('body');
    }
    return $fixture;
  }

  QUnit.module('issue 809 - Element as the context option', {
    afterEach: function() {
      $.contextMenu('destroy');
      fixture().html('');
    }
  });

  // Registers a menu for '.ctx-item' scoped to `context` and returns a counter
  // object tracking how many times the menu was shown.
  function registerScopedMenu(context) {
    var counter = {shown: 0};

    $.contextMenu({
      selector: '.ctx-item',
      context: context,
      events: {
        show: function() {
          counter.shown++;
        }
      },
      items: {
        copy: {name: 'Copy'}
      }
    });

    return counter;
  }

  // One trigger inside a container, one identical trigger outside it.
  function setupScopedFixture(containerHtml) {
    fixture().html(
      containerHtml.replace('{{trigger}}', '<span class="ctx-item" id="inside">inside</span>') +
      '<span class="ctx-item" id="outside">outside</span>'
    );

    return document.getElementById('in-context');
  }

  QUnit.test('a raw Element passed as context scopes the registration', function(assert) {
    var container = setupScopedFixture('<div id="in-context">{{trigger}}</div>');

    var counter = registerScopedMenu(container);

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'a trigger outside the context element does not open the menu');

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'a trigger inside the context element opens the menu');
  });

  QUnit.test('a menu registered with an Element context can still be destroyed by selector', function(assert) {
    // An ignored Element context meant the menu was registered globally, and
    // global registrations are the ones `$.contextMenu('destroy', selector)`
    // can find. Honouring the context must not take that away.
    var container = setupScopedFixture('<div id="in-context">{{trigger}}</div>');

    var counter = registerScopedMenu(container);

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'sanity check: the menu opens before being destroyed');

    $.contextMenu('destroy', '.ctx-item');

    counter.shown = 0;
    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'the menu no longer opens after destroy-by-selector');
  });

  QUnit.test('a jQuery object passed as context still scopes the registration', function(assert) {
    setupScopedFixture('<div id="in-context">{{trigger}}</div>');

    var counter = registerScopedMenu($('#in-context'));

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'a trigger outside the context element does not open the menu');

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'a trigger inside the context element opens the menu');
  });

  QUnit.test('a selector string passed as context still scopes the registration', function(assert) {
    setupScopedFixture('<div id="in-context">{{trigger}}</div>');

    var counter = registerScopedMenu('#in-context');

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'a trigger outside the context element does not open the menu');

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'a trigger inside the context element opens the menu');
  });

  QUnit.test('omitting context still registers against the whole document', function(assert) {
    fixture().html('<span class="ctx-item" id="anywhere">anywhere</span>');

    var counter = registerScopedMenu(undefined);

    $('#anywhere').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'without a context the menu is registered document-wide');
  });

  QUnit.test('a non-empty <form> passed as context still scopes the registration', function(assert) {
    // A <form> carries a `length` of its own (its control count), so a
    // non-empty one has always been accepted as a context.
    var form = setupScopedFixture('<form id="in-context"><input name="a">{{trigger}}</form>');
    assert.ok(form.length > 0, 'sanity check: the form reports a non-zero length');

    var counter = registerScopedMenu(form);

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'a trigger outside the form does not open the menu');

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'a trigger inside the form opens the menu');
  });

  // --- legacy behaviour, deliberately unchanged -----------------------------
  //
  // Everything below pins down a context that is *ignored* today. Honouring it
  // would scope menus that are registered page-wide today, which stops them
  // firing outside the context element with no error to explain why. That is a
  // breaking change for working integrations, so it is out of scope for a
  // patch release. See the pull request for #809.

  QUnit.test('an empty <form> passed as context is still ignored (legacy)', function(assert) {
    // An empty <form> reports `length === 0`, which the length test reads as
    // "no context given".
    var form = setupScopedFixture('<form id="in-context">{{trigger}}</form>');
    assert.equal(form.length, 0, 'sanity check: the form reports length 0');

    var counter = registerScopedMenu(form);

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'a trigger inside the empty form opens the menu');

    counter.shown = 0;
    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'the registration is still document-wide, as it is today');
  });

  QUnit.test('an empty <select> passed as context is still ignored (legacy)', function(assert) {
    fixture().html(
      '<select id="in-context"></select>' +
      '<span class="ctx-item" id="outside">outside</span>'
    );

    var counter = registerScopedMenu(document.getElementById('in-context'));

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'the registration is still document-wide, as it is today');
  });

  QUnit.test('a context selector matching nothing still registers nothing (legacy)', function(assert) {
    fixture().html('<span class="ctx-item" id="anywhere">anywhere</span>');

    var counter = registerScopedMenu('#does-not-exist');

    $('#anywhere').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'the menu is bound to nothing at all, as it is today');
  });

  QUnit.test('destroy with an Element context still tears everything down (legacy)', function(assert) {
    // For 'destroy', `context` means the trigger element rather than a
    // container - that is what $.fn.contextMenu('destroy') passes - and a raw
    // Element has never been accepted there: it falls through to the "no
    // context, no selector" branch, which destroys every registered menu.
    // Scoping it would silently turn this call into a no-op.
    fixture().html(
      '<div id="in-context"><span class="ctx-item" id="inside">inside</span></div>' +
      '<span class="other-item" id="other">other</span>'
    );

    var counter = registerScopedMenu(document.getElementById('in-context'));
    var otherShown = 0;
    $.contextMenu({
      selector: '.other-item',
      events: {show: function() { otherShown++; }},
      items: {copy: {name: 'Copy'}}
    });

    $.contextMenu('destroy', {context: document.getElementById('in-context')});

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'the Element-scoped menu was destroyed');

    $('#other').trigger($.Event('contextmenu'));
    assert.equal(otherShown, 0, 'the unrelated menu was destroyed as well, as it is today');
  });
})();
