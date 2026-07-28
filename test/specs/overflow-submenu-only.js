const { test, expect } = require('@playwright/test');
const { fixture, expectAlert } = require('../support/helpers');

// Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/752
// Unlike #775 (a root menu taller than the viewport clipping its sub-menus),
// here the ROOT menu is short and fits the viewport just fine, but the
// SUB-MENU itself has enough items to be taller than the viewport. Nothing
// caps its height or makes it scrollable, so items past the bottom edge of
// the viewport are unreachable - there's no scrollbar and no way to get to
// them with the mouse.
test.describe('Test overflow / scrollable sub-menu whose root menu fits the viewport (#752)', () => {
  test.use({ viewport: { width: 1000, height: 500 } });

  test('long sub-menu of a short root menu is capped to the viewport and scrollable', async ({ page }) => {
    await page.goto(fixture('long-submenu-short-root.html'));
    await page.click('.context-menu-one', { button: 'right' });

    const menu = page.locator('.context-menu-root');
    await expect(menu).toBeVisible();
    // sanity check: the root menu itself fits comfortably and is NOT
    // scrollable - this test is about the sub-menu overflowing, not the root
    await expect(menu).not.toHaveCSS('overflow-y', 'auto');

    await page.hover('span:text-is("Long sub group")');

    const submenu = page.locator('.context-menu-list:not(.context-menu-root)');
    await expect(submenu).toBeVisible();

    const viewportHeight = page.viewportSize().height;
    const submenuBox = await submenu.boundingBox();

    // the sub-menu must not extend past the bottom of the viewport - if it
    // does, it needs to be capped in height and made scrollable instead
    expect(submenuBox.y + submenuBox.height).toBeLessThanOrEqual(viewportHeight);

    // the last item must actually be reachable: scroll the sub-menu's own
    // internal overflow container (rather than the page) all the way down,
    // then click the now fully-in-view last item
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

  // Regression test for a bug caught while fixing #752: handle.focusItem()
  // calls positionSubmenu() again for every sibling item hovered inside an
  // already-open sub-menu (they all share the same opener/menu pair, see
  // op.create). An earlier version of the #752 fix re-measured and
  // re-capped the sub-menu's height/overflow on every single one of those
  // calls, which reset its scrollTop back to 0 each time - so simply
  // hovering another item after scrolling silently snapped the sub-menu
  // back to the top.
  test('hovering a sibling item does not reset an already-scrolled sub-menu', async ({ page }) => {
    await page.goto(fixture('long-submenu-short-root.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await page.hover('span:text-is("Long sub group")');

    const submenu = page.locator('.context-menu-list:not(.context-menu-root)');
    await expect(submenu).toBeVisible();

    await submenu.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    const scrollTopAfterScroll = await submenu.evaluate((el) => el.scrollTop);
    expect(scrollTopAfterScroll).toBeGreaterThan(0);

    // hover a plain sibling item within the same (already scrolled)
    // sub-menu - this re-triggers positionSubmenu() on the sub-menu
    await page.hover('span:text-is("Sub item 40")');

    const scrollTopAfterHover = await submenu.evaluate((el) => el.scrollTop);
    expect(scrollTopAfterHover).toBe(scrollTopAfterScroll);
  });
});
