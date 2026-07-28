const { test, expect } = require('@playwright/test');
const { fixture } = require('../support/helpers');

// Regression tests for https://github.com/swisnl/jQuery-contextMenu/issues/744
// ("Bug option-select in submenu in firefox"): choosing an option from a
// `type: 'select'` item nested inside a sub-sub-menu closed the whole menu
// in Firefox (Edge/Chrome were unaffected).
//
// Firefox's native <select> options popup isn't part of the page's DOM/layout
// (see also issue #114, where the plugin's original author documented Firefox
// firing extra mouse events around a <select>'s native popup that don't
// correspond to any real page interaction). Playwright cannot drive that
// native, OS-rendered popup directly in any browser - `selectOption()`
// intentionally bypasses it - so the tests below reproduce the mechanism
// directly: handle.layerClick's outside-click detection uses
// document.elementFromPoint(x, y) at the raw event coordinates, and a
// <select>'s native popup can extend past root.$menu's own (possibly
// clipped) bounding box, making a click that is, from the user's
// perspective, entirely "inside" the menu look like an outside click.
//
// The fix (isNearRecentSelectChange() in src/jquery.contextMenu.js) only
// withholds the "hide the menu" step - the click is always passed through to
// whatever's really under the cursor either way - and only when the
// coordinates plausibly belong to a <select>'s own native popup (its
// horizontal span) shortly after it last changed, so a real, unrelated
// outside click is unaffected even moments after some select on the menu
// changed.
test.describe('Test type: "select" item nested in a sub-sub-menu (#744)', () => {
  test('choosing an option keeps the menu (and its sub-menus) open', async ({ page }) => {
    await page.goto(fixture('sub-menu-select.html'));
    await page.click('.context-menu-one', { button: 'right' });

    const root = page.locator('.context-menu-root');
    await expect(root).toBeVisible();

    await page.hover('span:text-is("Sub group")');
    await page.hover('span:text-is("Sub group 2")');

    const select = page.locator('select[name="context-menu-input-my-select"]');
    await expect(select).toBeVisible();

    await select.selectOption('opt3');

    await expect(root).toBeVisible();
    await expect(select).toBeVisible();
    await expect(select).toHaveValue('opt3');
  });

  test('a mousedown outside the menu shortly after a select change is not treated as an outside click', async ({ page }) => {
    await page.goto(fixture('sub-menu-select.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await page.hover('span:text-is("Sub group")');
    await page.hover('span:text-is("Sub group 2")');

    const select = page.locator('select[name="context-menu-input-my-select"]');
    await expect(select).toBeVisible();

    const selectBox = await select.boundingBox();

    // Fire the select's 'change' event (as choosing an option would), then a
    // synthetic mousedown directly on the transparent #context-menu-layer -
    // handle.layerClick is bound straight to that element - at coordinates
    // below the select itself, approximating the spurious event Firefox is
    // documented to fire around a <select>'s native popup (which renders
    // below/above the select, overlapping its own horizontal span, but isn't
    // constrained by the menu's own bounding box).
    await page.evaluate((box) => {
      var el = document.querySelector('select[name="context-menu-input-my-select"]');
      el.dispatchEvent(new Event('change', { bubbles: true }));

      var $ = window.jQuery;
      $('#context-menu-layer').trigger($.Event('mousedown', {
        pageX: box.x + box.width / 2,
        pageY: box.y + box.height + 100,
        button: 0
      }));
    }, selectBox);

    await page.waitForTimeout(150);

    await expect(page.locator('.context-menu-root')).toBeVisible();
    await expect(select).toBeVisible();
  });

  test('a genuine outside click (no recent select change) still closes the menu', async ({ page }) => {
    await page.goto(fixture('sub-menu-select.html'));
    await page.click('.context-menu-one', { button: 'right' });

    const root = page.locator('.context-menu-root');
    await expect(root).toBeVisible();

    const menuBox = await root.boundingBox();

    // Same out-of-bounds mousedown as above, but with no preceding 'change'
    // on any select - this must still be treated as a real outside click.
    await page.evaluate((box) => {
      var $ = window.jQuery;
      $('#context-menu-layer').trigger($.Event('mousedown', {
        pageX: box.x + box.width / 2,
        pageY: box.y + box.height + 50,
        button: 0
      }));
    }, menuBox);

    await expect(root).toBeHidden();
  });

  test('a genuine outside click elsewhere shortly after a select change still closes the menu', async ({ page }) => {
    await page.goto(fixture('sub-menu-select.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await page.hover('span:text-is("Sub group")');
    await page.hover('span:text-is("Sub group 2")');

    const root = page.locator('.context-menu-root');
    const select = page.locator('select[name="context-menu-input-my-select"]');
    await expect(select).toBeVisible();

    const menuBox = await root.boundingBox();

    // Fire the select's 'change' event, but this time dispatch the outside
    // mousedown well clear of the select's own horizontal span (below the
    // root menu, off to its left) - a real click on unrelated page content
    // moments after picking a select option must still close the menu; only
    // a click plausibly within the select's own native popup should be
    // withheld.
    await page.evaluate((box) => {
      var el = document.querySelector('select[name="context-menu-input-my-select"]');
      el.dispatchEvent(new Event('change', { bubbles: true }));

      var $ = window.jQuery;
      $('#context-menu-layer').trigger($.Event('mousedown', {
        pageX: box.x - 100,
        pageY: box.y + box.height + 50,
        button: 0
      }));
    }, menuBox);

    await expect(root).toBeHidden();
  });
});
