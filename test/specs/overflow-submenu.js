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

  // Regression test for PR #787 review comment 1: with the default
  // autoHide:false, a detached sub-menu's own "context-menu-visible" class
  // (which drives its display, since it's no longer a DOM descendant of its
  // opener) was only ever cleared inside blurItem()'s `if (opt.autoHide)`
  // branch. Moving focus to a sibling root item removed the opener's own
  // highlight, but left the detached <ul> itself visible and clickable.
  test('moving focus to a sibling item hides a still-open detached sub-menu (autoHide:false)', async ({ page }) => {
    await page.goto(fixture('long-menu-submenu.html'));
    await page.click('.context-menu-one', { button: 'right' });

    await page.hover('span:text-is("Sub group")');
    const submenu = page.locator('.context-menu-list.context-menu-detached');
    await expect(submenu).toBeVisible();

    // move focus to an unrelated sibling item in the root menu, without
    // closing the context menu
    await page.hover('span:text-is("Item 1")');

    await expect(submenu).toBeHidden();
  });

  // Regression test for PR #787 review comment 3: a detached sub-menu is
  // positioned in page coordinates relative to its opener at the moment
  // it's shown. If the user then scrolls the (scrollable) root menu
  // internally without moving the pointer, nothing repositioned or closed
  // the now-stale, floating sub-menu.
  test('scrolling the root menu closes a still-open detached sub-menu', async ({ page }) => {
    await page.goto(fixture('long-menu-submenu.html'));
    await page.click('.context-menu-one', { button: 'right' });

    const menu = page.locator('.context-menu-root');
    await expect(menu).toHaveCSS('overflow-y', 'auto');

    await page.hover('span:text-is("Sub group")');
    const submenu = page.locator('.context-menu-list.context-menu-detached');
    await expect(submenu).toBeVisible();

    // scroll the root menu itself (the pointer is still over the "Sub
    // group" opener, which sits inside the scrollable root list) without
    // moving it to a different element
    await page.mouse.wheel(0, 200);

    await expect(submenu).toBeHidden();
  });
});

// Regression test for PR #787 review comment 2: op.activated() detaches a
// scrollable root menu's direct sub-menus to <body> right after it's shown,
// but a sub-menu whose items are still a pending promise at that point
// hasn't been created yet, so it's skipped. When the promise later resolves,
// finishPromiseProcess() used to create the sub-menu without ever detaching
// it, leaving it nested inside (and clipped by) the scrollable root - the
// exact behavior #775 was meant to fix, just reached via a promise instead
// of a synchronous sub-menu.
test.describe('Test overflow / scrollable menu with a promise-based sub-menu (#775 review comment 2)', () => {
  test.use({ viewport: { width: 1000, height: 500 } });

  test('sub-menu created from a promise that resolves after activation is still detached and not clipped', async ({ page }) => {
    await page.goto(fixture('long-menu-submenu-promise.html'));
    await page.click('.context-menu-one', { button: 'right' });

    const menu = page.locator('.context-menu-root');
    await expect(menu).toBeVisible();
    // sanity check: the menu is indeed in the scrollable/overflow state
    // this test is meant to exercise, and it's reached well before the
    // sub-menu's items promise (300ms) resolves
    await expect(menu).toHaveCSS('overflow-y', 'auto');

    // hover the opener before its sub-menu even exists yet (the promise is
    // still pending) - positionSubmenu() is expected to pick this up once
    // the promise resolves and the sub-menu is actually created
    await page.hover('span:text-is("Sub group")');

    const submenu = page.locator('.context-menu-list.context-menu-detached');
    await expect(submenu).toBeVisible();

    const [menuBox, submenuBox] = await Promise.all([
      menu.boundingBox(),
      submenu.boundingBox(),
    ]);

    // the sub-menu must extend past the right edge of the scrollable root
    // menu rather than being clipped within its bounds
    expect(submenuBox.x + submenuBox.width).toBeGreaterThan(menuBox.x + menuBox.width);

    await expectAlert(
      page,
      () => page.click('span:text-is("charlie")'),
      'clicked: fold1-key3'
    );
  });
});
