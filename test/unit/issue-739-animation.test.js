// Tests for https://github.com/swisnl/jQuery-contextMenu/issues/739
// 1. the show animation should not be replayed when the menu that is being
//    opened is already visible (animation.animateOnReopen)
// 2. show and hide should be able to use separate durations
//    (animation.showDuration / animation.hideDuration)

(function () {
  var showCalls = [];
  var hideCalls = [];
  var originalSlideDown;
  var originalSlideUp;

  function fixture() {
    var $fixture = $('#qunit-fixture');

    // ensure `#qunit-fixture` exists when testing with karma runner
    if ($fixture.length === 0) {
      $('<div id="qunit-fixture">').appendTo('body');
      $fixture = $('#qunit-fixture');
    }

    return $fixture;
  }

  // register a menu shared by every `.trigger739` element, so re-opening it on
  // another trigger re-uses the very same menu element
  function createContextMenu(animation) {
    var options = {
      selector: '.trigger739',
      items: {
        copy: {name: 'Copy'},
        paste: {name: 'Paste'}
      }
    };

    if (animation) {
      options.animation = animation;
    }

    fixture().append('<div class="trigger739">one</div><div class="trigger739">two</div>');
    $.contextMenu(options);
  }

  function openOn(index) {
    $('.trigger739').eq(index).contextMenu({x: 10, y: 10});
  }

  QUnit.module('issue 739 animation options', {
    beforeEach: function () {
      showCalls = [];
      hideCalls = [];

      // spy on the default show/hide effects, so the assertions below cover
      // the actual default animation methods instead of stand-ins
      originalSlideDown = $.fn.slideDown;
      originalSlideUp = $.fn.slideUp;
      $.fn.slideDown = function (duration) {
        showCalls.push(duration);
        return originalSlideDown.apply(this, arguments);
      };
      $.fn.slideUp = function (duration) {
        hideCalls.push(duration);
        return originalSlideUp.apply(this, arguments);
      };
    },
    afterEach: function () {
      $.fn.slideDown = originalSlideDown;
      $.fn.slideUp = originalSlideUp;

      $.contextMenu('destroy');
      var $fixture = $('#qunit-fixture');
      if ($fixture.length) {
        $fixture.html('');
      }
    }
  });

  QUnit.test('without any animation options the default duration is used for both directions', function (assert) {
    createContextMenu();

    openOn(0);
    assert.deepEqual(showCalls, [50], 'show animation ran with the default duration of 50ms');

    $('.trigger739').eq(0).contextMenu('hide');
    assert.deepEqual(hideCalls, [50], 'hide animation ran with the default duration of 50ms');
  });

  QUnit.test('a plain `duration` keeps applying to both show and hide', function (assert) {
    createContextMenu({duration: 250});

    openOn(0);
    $('.trigger739').eq(0).contextMenu('hide');

    assert.deepEqual(showCalls, [250], 'show animation used animation.duration');
    assert.deepEqual(hideCalls, [250], 'hide animation used animation.duration');
  });

  QUnit.test('showDuration and hideDuration override animation.duration per direction', function (assert) {
    createContextMenu({duration: 250, showDuration: 120, hideDuration: 30});

    openOn(0);
    $('.trigger739').eq(0).contextMenu('hide');

    assert.deepEqual(showCalls, [120], 'show animation used animation.showDuration');
    assert.deepEqual(hideCalls, [30], 'hide animation used animation.hideDuration');
  });

  QUnit.test('an unset per-direction duration falls back to animation.duration', function (assert) {
    createContextMenu({duration: 250, showDuration: 0});

    openOn(0);
    $('.trigger739').eq(0).contextMenu('hide');

    assert.deepEqual(showCalls, [0], 'showDuration: 0 is honoured instead of falling back');
    assert.deepEqual(hideCalls, [250], 'hide animation fell back to animation.duration');
  });

  QUnit.test('by default re-opening an already visible menu replays the show animation', function (assert) {
    createContextMenu();

    openOn(0);
    assert.deepEqual(showCalls, [50], 'sanity check: menu was shown with an animation');

    // right-clicking another trigger of the same menu first hides the menu
    // (from the document mousedown handler) and then shows it again, which is
    // what makes the animation replay
    $('.context-menu-list').trigger('contextmenu:hide');
    openOn(1);

    assert.deepEqual(showCalls, [50, 50], 'show animation was replayed with the configured duration');
  });

  QUnit.test('animation.animateOnReopen: false does not replay the show animation for a visible menu', function (assert) {
    var done = assert.async();
    createContextMenu({animateOnReopen: false});

    // wait for the first show animation to complete, so the menu is fully
    // expanded before it gets re-opened
    $(document).one('contextmenu:visible', function () {
      assert.deepEqual(showCalls, [50], 'sanity check: the first show is animated as usual');

      var $menu = $('.context-menu-list');
      var height = $menu.height();
      assert.ok(height > 0, 'sanity check: the menu has a height while visible');

      $menu.trigger('contextmenu:hide');
      openOn(1);

      assert.deepEqual(showCalls, [50, 0], 'the show animation ran with a zero duration on re-open');
      assert.ok($menu.is(':visible'), 'the menu stayed visible while being re-opened');

      // in the middle of what would have been the hide + show animations the
      // menu is still fully expanded instead of sliding
      setTimeout(function () {
        assert.ok($menu.is(':visible'), 'the menu is still visible after the animations would have run');
        assert.equal($menu.height(), height, 'the menu was never collapsed or re-expanded');
        done();
      }, 40);
    });

    openOn(0);
  });

  QUnit.test('animation.animateOnReopen: false still animates a menu that is not visible', function (assert) {
    var done = assert.async();
    createContextMenu({animateOnReopen: false});

    openOn(0);

    // wait until the menu is really gone (the hide animation is queued behind
    // the show animation, so this takes both durations plus a little)
    $(document).one('contextmenu:hidden', function () {
      assert.notOk($('.context-menu-list').is(':visible'), 'sanity check: the menu is hidden again');

      openOn(1);
      assert.deepEqual(showCalls, [50, 50], 'showing a hidden menu is animated as usual');
      done();
    });

    $('.trigger739').eq(0).contextMenu('hide');
  });
})();
