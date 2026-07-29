// Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/805
//
// With `useModal: false` the menu isn't dismissed by a transparent layer but
// by a document-level mousedown listener (see op.layer()) that calls
// handle.layerClick() and unregisters itself again through the `onhide`
// callback it hands in.
//
// That listener outlives the menu it was registered for, so by the time the
// next click arrives there may be no menu left at all: a `build` menu empties
// its own options object once it has finished hiding, and a `hide` handler
// calling $(selector).contextMenu('destroy') tears the menu down outright.
// handle.layerClick() guarded that with
//
//     if (root.$menu === null || typeof root.$menu === 'undefined' || !root.$menu[0].contains(target))
//
// and then called root.$menu.trigger('contextmenu:hide') inside the block, so
// the very case the first two clauses detect was the one that threw
// "Cannot read properties of undefined (reading 'trigger')". Because the throw
// happened before `onhide` ran, the listener was never removed either and one
// more accumulated for every menu that had been opened.

(function () {
  var origAddEventListener = document.addEventListener;
  var origRemoveEventListener = document.removeEventListener;
  var liveListeners = [];

  function trackDismissListeners() {
    liveListeners = [];
    document.addEventListener = function (type, fn, capture) {
      if (type === 'mousedown' && capture === true) {
        liveListeners.push(fn);
      }
      return origAddEventListener.apply(document, arguments);
    };
    document.removeEventListener = function (type, fn, capture) {
      if (type === 'mousedown' && capture === true) {
        var i = liveListeners.indexOf(fn);
        if (i > -1) {
          liveListeners.splice(i, 1);
        }
      }
      return origRemoveEventListener.apply(document, arguments);
    };
  }

  function stopTrackingDismissListeners() {
    document.addEventListener = origAddEventListener;
    document.removeEventListener = origRemoveEventListener;
    // don't leave the plugin's listeners behind for the next test
    while (liveListeners.length) {
      origRemoveEventListener.call(document, 'mousedown', liveListeners.pop(), true);
    }
  }

  // Invoke the registered listeners the way the browser would for a click
  // somewhere outside the menu. Calling them directly (rather than dispatching
  // the event) keeps a throw inside handle.layerClick() reportable here: a
  // listener that throws during a real dispatch only reaches window.onerror.
  function clickOutside(x, y) {
    var ev = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      button: 0
    });
    var error = null;

    $.each(liveListeners.slice(), function (i, listener) {
      try {
        listener.call(document, ev);
      } catch (e) {
        error = e;
      }
    });

    return error;
  }

  function menuOptions(extra) {
    return $.extend({
      selector: '#issue805-trigger',
      useModal: false
    }, extra);
  }

  function openAndPickAnItem() {
    $('#issue805-trigger').contextMenu({x: 210, y: 210});
    $('.context-menu-list').filter(':visible').find('li').first().trigger('mouseup');
  }

  QUnit.module('issue 805: outside click after the menu is gone', {
    beforeEach: function () {
      trackDismissListeners();
      // #qunit-fixture is rendered off-screen, where document.elementFromPoint()
      // would never find anything, so put the trigger on the body instead.
      $('<div id="issue805-trigger" style="position:fixed;top:200px;left:200px;width:80px;height:40px;"></div>')
        .appendTo(document.body);
    },
    afterEach: function () {
      stopTrackingDismissListeners();
      $.contextMenu('destroy');
      $('#issue805-trigger').remove();
      $('#context-menu-layer').remove();
      $('.context-menu-list').remove();
    }
  });

  QUnit.test('clicking outside after a build menu tore itself down does not throw', function (assert) {
    var done = assert.async();

    $.contextMenu(menuOptions({
      build: function () {
        return {items: {copy: {name: 'Copy', callback: function () {}}}};
      }
    }));

    openAndPickAnItem();
    assert.equal(liveListeners.length, 1, 'the dismiss listener was registered');

    // wait for the hide animation to complete: that is when a built menu
    // empties its options object, taking $menu with it
    setTimeout(function () {
      var error = clickOutside(10, 10);

      assert.equal(error, null, 'clicking outside did not throw' + (error ? ' (' + error.message + ')' : ''));
      assert.equal(liveListeners.length, 0, 'the dismiss listener unregistered itself');
      done();
    }, 200);
  });

  QUnit.test('clicking outside after a hide handler destroyed the menu does not throw', function (assert) {
    var done = assert.async();

    $.contextMenu(menuOptions({
      build: function () {
        return {items: {copy: {name: 'Copy', callback: function () {}}}};
      },
      events: {
        hide: function () {
          $('#issue805-trigger').contextMenu('destroy');
        }
      }
    }));

    openAndPickAnItem();

    setTimeout(function () {
      var error = clickOutside(10, 10);

      assert.equal(error, null, 'clicking outside did not throw' + (error ? ' (' + error.message + ')' : ''));
      assert.equal(liveListeners.length, 0, 'the dismiss listener unregistered itself');
      done();
    }, 200);
  });

  QUnit.test('clicking outside with an emptied $menu does not throw either', function (assert) {
    var done = assert.async();
    var root = null;

    $.contextMenu(menuOptions({
      items: {copy: {name: 'Copy', callback: function () {}}},
      events: {
        hide: function (opt) {
          root = opt;
        }
      }
    }));

    openAndPickAnItem();

    setTimeout(function () {
      assert.ok(root, 'the hide handler ran');
      // $menu can be left as an empty jQuery object rather than dropped
      // altogether, which the old guard did not cover at all
      root.$menu = $();

      var error = clickOutside(10, 10);

      assert.equal(error, null, 'clicking outside did not throw' + (error ? ' (' + error.message + ')' : ''));
      assert.equal(liveListeners.length, 0, 'the dismiss listener unregistered itself');
      done();
    }, 200);
  });

  QUnit.test('the dismiss listeners do not accumulate over repeated open/hide cycles', function (assert) {
    var done = assert.async();
    var cycles = 3;

    function cycle(remaining) {
      if (remaining === 0) {
        assert.equal(liveListeners.length, 0, 'no dismiss listeners are left behind');
        return done();
      }

      // the hide handler destroys the registration, so set it up every round
      $.contextMenu(menuOptions({
        build: function () {
          return {items: {copy: {name: 'Copy', callback: function () {}}}};
        },
        events: {
          hide: function () {
            $('#issue805-trigger').contextMenu('destroy');
          }
        }
      }));

      openAndPickAnItem();

      setTimeout(function () {
        var error = clickOutside(10, 10);

        assert.equal(error, null, 'cycle ' + (cycles - remaining + 1) + ' did not throw');
        assert.equal(liveListeners.length, 0, 'cycle ' + (cycles - remaining + 1) + ' left no dismiss listener behind');
        cycle(remaining - 1);
      }, 200);
    }

    cycle(cycles);
  });
})();
