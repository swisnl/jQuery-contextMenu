const { test, expect } = require('@playwright/test');
const { fixture } = require('../support/helpers');

// Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/738
//
// The documented way to give a menu a title is a `:before` pseudo element on
// the menu plus a top margin on its first child, to make room for that title.
// A Font Awesome icon is rendered as an <i> element inside the menu item, so
// it is the first child of its own <li>. A descendant `:first-child` selector
// therefore matched every icon as well and pushed them all down by the title's
// height, leaving the icons hanging below their label.
//
// The plugin now pins the icon element's own box (including its margin), so
// the icon stays vertically centered in its item regardless of what the page
// does to first children.

// The icon and its item may legitimately differ by a sub-pixel amount because
// of fractional em based paddings.
const TOLERANCE = 1.5;

// Reads the vertical center of every Font Awesome icon and of the menu item it
// belongs to, from the menu that is currently visible.
function readIconOffsets(page) {
  return page.evaluate(() => {
    const menu = Array.from(document.querySelectorAll('.context-menu-list'))
      .find((el) => window.getComputedStyle(el).display !== 'none');

    return Array.from(menu.children)
      .filter((item) => item.querySelector('i'))
      .map((item) => {
        const itemBox = item.getBoundingClientRect();
        const iconBox = item.querySelector('i').getBoundingClientRect();

        return {
          label: item.textContent.trim(),
          offset: (iconBox.top + iconBox.height / 2) - (itemBox.top + itemBox.height / 2),
        };
      });
  });
}

// The built-in icon font is drawn in a `::before` pseudo element, which has no
// box to measure directly. It is centered with `top: 50%` plus a translate of
// half its own height, so its center sits exactly at the used value of `top`,
// which must be half the item's height.
function readBuiltInIconOffsets(page) {
  return page.evaluate(() => {
    const menu = Array.from(document.querySelectorAll('.context-menu-list'))
      .find((el) => window.getComputedStyle(el).display !== 'none');

    return Array.from(menu.children)
      .filter((item) => item.classList.contains('context-menu-icon'))
      .map((item) => ({
        label: item.textContent.trim(),
        offset: parseFloat(window.getComputedStyle(item, '::before').top) -
          item.getBoundingClientRect().height / 2,
      }));
  });
}

function expectCentered(offsets) {
  expect(offsets.length).toBeGreaterThan(0);
  for (const { label, offset } of offsets) {
    expect(Math.abs(offset), 'icon of item "' + label + '" is off center by ' + offset + 'px')
      .toBeLessThanOrEqual(TOLERANCE);
  }
}

test.describe('Test icon alignment in a menu with a title (#738)', () => {
  test('Font Awesome icons are centered in a menu with a title', async ({ page }) => {
    await page.goto(fixture('menu-title-fontawesome.html'));
    await page.click('.context-menu-fa-title', { button: 'right' });

    const menu = page.locator('.context-menu-list.menu-title-fa');
    await expect(menu).toBeVisible();

    expectCentered(await readIconOffsets(page));
  });

  test('Font Awesome icons are centered in a menu without a title', async ({ page }) => {
    await page.goto(fixture('menu-title-fontawesome.html'));
    await page.click('.context-menu-fa-plain', { button: 'right' });

    await expect(page.locator('.context-menu-list:visible')).toBeVisible();

    expectCentered(await readIconOffsets(page));
  });

  test('Font Awesome icons survive a descendant :first-child title rule', async ({ page }) => {
    await page.goto(fixture('menu-title-fontawesome.html'));

    // The title recipe as it was documented before #738: a descendant
    // selector rather than a child combinator. Plenty of pages in the wild
    // still use it, so the plugin's own icon styling has to win.
    await page.addStyleTag({ content: '.menu-title-fa :first-child { margin-top: 20px; }' });

    await page.click('.context-menu-fa-title', { button: 'right' });

    const menu = page.locator('.context-menu-list.menu-title-fa');
    await expect(menu).toBeVisible();
    // sanity check: the rule under test really is applied to the menu's first
    // item, so the title still has its room
    await expect(menu.locator('li').first()).toHaveCSS('margin-top', '20px');

    expectCentered(await readIconOffsets(page));
  });

  test('built-in icon font is centered in a menu with a title', async ({ page }) => {
    await page.goto(fixture('menu-title.html'));
    await page.click('.context-menu-two', { button: 'right' });

    const menu = page.locator('.context-menu-list.css-title');
    await expect(menu).toBeVisible();

    expectCentered(await readBuiltInIconOffsets(page));
  });

  test('built-in icon font is centered in a menu without a title', async ({ page }) => {
    await page.goto(fixture('menu-title.html'));
    await page.click('.context-menu-one', { button: 'right' });

    await expect(page.locator('.context-menu-list:visible')).toBeVisible();

    expectCentered(await readBuiltInIconOffsets(page));
  });
});
