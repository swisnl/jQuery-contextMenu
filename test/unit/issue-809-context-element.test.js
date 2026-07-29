// Regression tests for https://github.com/swisnl/jQuery-contextMenu/issues/809
//
// The `context` option used to be normalized with `if (!o.context || !o.context.length)`,
// which silently fell back to `document`:
//  - a raw DOM Element has no `length` at all, so it was always dropped;
//  - a <form>/<select> element does have a `length` (its control/option count),
//    so an empty one was dropped while a non-empty one was accepted.
// In every dropped case the registration ended up bound globally instead of
// being scoped to the element the caller passed.

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

  QUnit.test('a raw Element passed as context scopes the registration', function(assert) {
    var $fixture = fixture();
    $fixture.html(
      '<div id="in-context"><span class="ctx-item" id="inside">inside</span></div>' +
      '<span class="ctx-item" id="outside">outside</span>'
    );

    var counter = registerScopedMenu(document.getElementById('in-context'));

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'a trigger outside the context element does not open the menu');

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'a trigger inside the context element opens the menu');
  });

  QUnit.test('an empty <form> passed as context scopes the registration', function(assert) {
    // An empty <form> has `length === 0` (no form controls), which the old
    // truthiness check read as "no context given".
    var $fixture = fixture();
    $fixture.html(
      '<form id="in-context"><span class="ctx-item" id="inside">inside</span></form>' +
      '<span class="ctx-item" id="outside">outside</span>'
    );

    var form = document.getElementById('in-context');
    assert.equal(form.length, 0, 'sanity check: the form reports length 0');

    var counter = registerScopedMenu(form);

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'a trigger outside the empty form does not open the menu');

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'a trigger inside the empty form opens the menu');
  });

  QUnit.test('an empty <select> passed as context does not silently register globally', function(assert) {
    // A <select> without <option>s reports length 0 as well. Nothing can trigger
    // inside it, so the only thing that matters is that the registration is not
    // quietly promoted to a document-wide one.
    var $fixture = fixture();
    $fixture.html(
      '<select id="in-context"></select>' +
      '<span class="ctx-item" id="outside">outside</span>'
    );

    var counter = registerScopedMenu(document.getElementById('in-context'));

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'a trigger outside the empty select does not open the menu');
  });

  QUnit.test('a jQuery object passed as context still scopes the registration', function(assert) {
    var $fixture = fixture();
    $fixture.html(
      '<div id="in-context"><span class="ctx-item" id="inside">inside</span></div>' +
      '<span class="ctx-item" id="outside">outside</span>'
    );

    var counter = registerScopedMenu($('#in-context'));

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'a trigger outside the context element does not open the menu');

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'a trigger inside the context element opens the menu');
  });

  QUnit.test('a selector string passed as context still scopes the registration', function(assert) {
    var $fixture = fixture();
    $fixture.html(
      '<div id="in-context"><span class="ctx-item" id="inside">inside</span></div>' +
      '<span class="ctx-item" id="outside">outside</span>'
    );

    var counter = registerScopedMenu('#in-context');

    $('#outside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 0, 'a trigger outside the context element does not open the menu');

    $('#inside').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'a trigger inside the context element opens the menu');
  });

  QUnit.test('omitting context still registers against the whole document', function(assert) {
    var $fixture = fixture();
    $fixture.html('<span class="ctx-item" id="anywhere">anywhere</span>');

    var counter = registerScopedMenu(undefined);

    $('#anywhere').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'without a context the menu is registered document-wide');
  });

  QUnit.test('a context that resolves to nothing falls back to the document', function(assert) {
    var $fixture = fixture();
    $fixture.html('<span class="ctx-item" id="anywhere">anywhere</span>');

    var counter = registerScopedMenu('#does-not-exist');

    $('#anywhere').trigger($.Event('contextmenu'));
    assert.equal(counter.shown, 1, 'an unmatched context selector behaves as if no context was given');
  });

  QUnit.test('destroying by a raw Element context only removes the matching registration', function(assert) {
    var $fixture = fixture();
    $fixture.html(
      '<span class="ctx-item" id="one">one</span>' +
      '<span class="other-item" id="two">two</span>'
    );

    var shownOne = 0;
    var shownTwo = 0;

    $.contextMenu({
      selector: '.ctx-item',
      events: {show: function() { shownOne++; }},
      items: {copy: {name: 'Copy'}}
    });
    $.contextMenu({
      selector: '.other-item',
      events: {show: function() { shownTwo++; }},
      items: {copy: {name: 'Copy'}}
    });

    // Same thing as $('#one').contextMenu('destroy'), but with a raw Element.
    $.contextMenu('destroy', {context: document.getElementById('one')});

    $('#one').trigger($.Event('contextmenu'));
    assert.equal(shownOne, 0, 'the registration matching the context element was destroyed');

    $('#two').trigger($.Event('contextmenu'));
    assert.equal(shownTwo, 1, 'the unrelated registration survived');
  });
})();
