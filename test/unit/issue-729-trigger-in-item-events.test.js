QUnit.module('issue 729 - trigger reachable from item events handlers', {
  beforeEach: function() {
    var $fixture = $('#qunit-fixture');
    if ($fixture.length === 0) {
      $fixture = $('<div id="qunit-fixture"></div>').appendTo('body');
    }
    $fixture.html(
      '<button class="trigger729" id="trigger-a">A</button>' +
      '<button class="trigger729" id="trigger-b">B</button>'
    );
  },
  afterEach: function() {
    $.contextMenu('destroy');
    $(document).trigger('contextmenu:hide');
    $('#qunit-fixture').html('');
  }
});

// Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/729
// An item-level `events` handler is bound with its menu's options object as
// jQuery event data, so `e.data.$trigger` must point at the element that opened
// the menu - also when several elements share one menu definition.
QUnit.test('e.data.$trigger identifies the element that opened the menu', function(assert) {
  var seen = [];

  $.contextMenu({
    selector: '.trigger729',
    items: {
      label: {
        name: 'Label',
        type: 'text',
        events: {
          focusout: function(e) {
            seen.push(e.data.$trigger);
          }
        }
      }
    }
  });

  $('#trigger-a').trigger($.Event('contextmenu', {pageX: 10, pageY: 10}));
  $('.context-menu-root').find('input[type=text]').trigger('focusout');

  assert.equal(seen.length, 1, 'the focusout handler ran');
  assert.ok(seen[0] instanceof $, 'e.data.$trigger is a jQuery object');
  assert.equal(seen[0][0], $('#trigger-a')[0], 'e.data.$trigger is the first trigger');

  $(document).trigger('contextmenu:hide');
  $('#trigger-b').trigger($.Event('contextmenu', {pageX: 10, pageY: 10}));
  $('.context-menu-root').find('input[type=text]').trigger('focusout');

  assert.equal(seen.length, 2, 'the focusout handler ran again');
  assert.equal(seen[1][0], $('#trigger-b')[0], 'e.data.$trigger is the second trigger');
});

QUnit.test('e.data.$trigger is available on sub-menu items too', function(assert) {
  var seen = [];

  $.contextMenu({
    selector: '.trigger729',
    items: {
      sub: {
        name: 'Sub',
        items: {
          label: {
            name: 'Nested label',
            type: 'text',
            events: {
              focusout: function(e) {
                seen.push(e.data.$trigger);
              }
            }
          }
        }
      }
    }
  });

  $('#trigger-a').trigger($.Event('contextmenu', {pageX: 10, pageY: 10}));
  $('input[type=text]').trigger('focusout');

  assert.equal(seen.length, 1, 'the nested focusout handler ran');
  assert.ok(seen[0] && seen[0].length, 'e.data.$trigger is set for a sub-menu item');
  assert.equal(seen[0][0], $('#trigger-a')[0], 'e.data.$trigger is the trigger, not the sub-menu opener');

  $(document).trigger('contextmenu:hide');
  $('#trigger-b').trigger($.Event('contextmenu', {pageX: 10, pageY: 10}));
  $('input[type=text]').trigger('focusout');

  assert.equal(seen.length, 2, 'the nested focusout handler ran again');
  assert.equal(seen[1][0], $('#trigger-b')[0], 'e.data.$trigger follows the second trigger');
});

QUnit.test('e.data.$trigger is available on a promise-built sub-menu', function(assert) {
  var done = assert.async();
  var deferred = $.Deferred();
  var seen = null;

  $.contextMenu({
    selector: '.trigger729',
    items: {
      sub: {
        name: 'Sub',
        items: deferred.promise()
      }
    }
  });

  $('#trigger-a').trigger($.Event('contextmenu', {pageX: 10, pageY: 10}));

  deferred.resolve({
    label: {
      name: 'Nested label',
      type: 'text',
      events: {
        focusout: function(e) {
          seen = e.data.$trigger;
        }
      }
    }
  });

  setTimeout(function() {
    $('input[type=text]').trigger('focusout');
    assert.ok(seen && seen.length, 'e.data.$trigger is set on a lazily created sub-menu');
    assert.equal(seen[0], $('#trigger-a')[0], 'e.data.$trigger is the trigger');
    done();
  }, 0);
});

// The reporter's scenario: a text input in the menu writes its value back onto
// the button that opened the menu when the input loses focus.
QUnit.test('reporter scenario - focusout writes the input value back to the trigger', function(assert) {
  $.contextMenu({
    selector: '.trigger729',
    items: {
      label: {
        name: 'Label',
        type: 'text',
        events: {
          focusout: function(e) {
            e.data.$trigger.text($(this).val());
          }
        }
      }
    }
  });

  $('#trigger-b').trigger($.Event('contextmenu', {pageX: 10, pageY: 10}));
  $('.context-menu-root').find('input[type=text]').val('Renamed').trigger('focusout');

  assert.equal($('#trigger-b').text(), 'Renamed', 'the trigger label was updated');
  assert.equal($('#trigger-a').text(), 'A', 'the other trigger was left alone');
});
