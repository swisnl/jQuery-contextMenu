const { test, expect } = require('@playwright/test');
const { fixture, expectAlert } = require('../support/helpers');

// Regression test for the combination of `direction: 'rtl'` (#742) and a
// sub-menu taller than the viewport (#752): these two features both modify
// positionSubmenu() in src/jquery.contextMenu.js (see the merge commit that
// combined them), so this exercises them together rather than trusting that
// each one working in isolation (covered separately by
// test/unit/direction-rtl.test.js and test/specs/overflow-submenu-only.js)
// means the combined logic is also correct.
test.describe('Test direction: "rtl" together with an overflowing sub-menu (#742 + #752)', () => {
  test.use({ viewport: { width: 1000, height: 500 } });

  test('an overflowing sub-menu still opens to the left in rtl mode, and is capped/scrollable', async ({ page }) => {
    await page.goto(fixture('rtl-long-submenu.html'));
    await page.click('.context-menu-one', { button: 'right' });

    const menu = page.locator('.context-menu-root');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveClass(/context-menu-rtl/);

    const opener = page.locator('span:text-is("Long sub group")');
    const openerBox = await opener.boundingBox();

    await opener.hover();

    const submenu = page.locator('.context-menu-list:not(.context-menu-root)');
    await expect(submenu).toBeVisible();
    await expect(submenu).toHaveClass(/context-menu-rtl/);

    const submenuBox = await submenu.boundingBox();

    // rtl: the sub-menu should open to the LEFT of its opener, not the right
    expect(submenuBox.x).toBeLessThanOrEqual(openerBox.x);

    // ...and, despite opening on a different side, it must still be capped
    // to the viewport height and made scrollable rather than clipped
    // (the same #752 behaviour as the plain ltr case)
    const viewportHeight = page.viewportSize().height;
    expect(submenuBox.y + submenuBox.height).toBeLessThanOrEqual(viewportHeight);

    // the last item must actually be reachable via the sub-menu's own
    // internal scroll container
    await submenu.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    const lastItem = page.locator('span:text-is("Sub item 40")');
    await expect(lastItem).toBeInViewport();
    await expectAlert(
      page,
      () => lastItem.click(),
      'clicked: sub-key40'
    );
  });
});
