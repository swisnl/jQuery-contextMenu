const { test, expect } = require('@playwright/test');
const { fixture, expectAlert } = require('../support/helpers');

// Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/775
// A menu taller than the viewport gets `overflow-y: auto` (scrollable) so it
// doesn't run off screen. Sub-menus are, by default, DOM descendants of the
// scrollable list, so they were getting clipped by that same overflow and
// were effectively unusable. Fixed sub-menus should now render outside the
// scroll container and remain fully clickable.
test.describe('Test overflow / scrollable menu with a sub-menu (#775)', () => {
  test.use({ viewport: { width: 1000, height: 500 } });

  test('sub-menu of a scrollable (overflow) menu is not clipped and is clickable', async ({ page }) => {
    await page.goto(fixture('long-menu-submenu.html'));
    await page.click('.context-menu-one', { button: 'right' });

    const menu = page.locator('.context-menu-root');
    await expect(menu).toBeVisible();
    // sanity check: the menu is indeed in the scrollable/overflow state this
    // test is meant to exercise
    await expect(menu).toHaveCSS('overflow-y', 'auto');

    await page.hover('span:text-is("Sub group")');

    // the sub-menu is moved out to <body> when its parent menu is scrollable
    // (see op.detachSubmenus), so it's no longer a DOM child of the
    // '.context-menu-submenu' <li> - select it by its own detached class.
    const submenu = page.locator('.context-menu-list.context-menu-detached');
    await expect(submenu).toBeVisible();

    const [menuBox, submenuBox] = await Promise.all([
      menu.boundingBox(),
      submenu.boundingBox(),
    ]);

    // the sub-menu must extend past the right edge of the scrollable root
    // menu (with some overlap by design, mirroring the non-scrollable case)
    // rather than being clipped within its bounds
    expect(submenuBox.x + submenuBox.width).toBeGreaterThan(menuBox.x + menuBox.width);

    await expectAlert(
      page,
      () => page.click('span:text-is("charlie")'),
      'clicked: fold1-key3'
    );
  });

  test('sub-menu keeps working the same way across repeated opens', async ({ page }) => {
    await page.goto(fixture('long-menu-submenu.html'));

    for (let i = 0; i < 2; i++) {
      await page.click('.context-menu-one', { button: 'right' });
      await page.hover('span:text-is("Sub group")');
      await expect(page.locator('.context-menu-list.context-menu-detached')).toBeVisible();
      await expectAlert(
        page,
        () => page.click('span:text-is("alpha")'),
        'clicked: fold1-key1'
      );
    }
  });
});
