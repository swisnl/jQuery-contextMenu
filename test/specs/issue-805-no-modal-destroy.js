const { test, expect } = require('@playwright/test');
const { fixture } = require('../support/helpers');

// Regression test for https://github.com/swisnl/jQuery-contextMenu/issues/805
//
// With `useModal: false` the menu is dismissed by a document-level mousedown
// listener instead of by the transparent layer. That listener outlives the menu
// it belongs to, so the next click has to cope with the menu already being
// gone - here because a `hide` handler destroys it. handle.layerClick() used to
// dereference the missing menu, which threw and, since the throw happened
// before the listener could unregister itself, left one more listener behind
// for every menu that had been opened.

// Count the dismiss listeners the plugin registers, before any page script runs.
async function countDismissListeners(page) {
  await page.addInitScript(() => {
    window.__dismissListeners = 0;
    const add = document.addEventListener;
    const remove = document.removeEventListener;
    document.addEventListener = function (type, fn, capture) {
      if (type === 'mousedown' && capture === true) {
        window.__dismissListeners++;
      }
      return add.apply(document, arguments);
    };
    document.removeEventListener = function (type, fn, capture) {
      if (type === 'mousedown' && capture === true) {
        window.__dismissListeners--;
      }
      return remove.apply(document, arguments);
    };
  });
}

// Replace the demo's own menu with one that is dismissed without the modal
// layer and that destroys itself from its `hide` handler.
async function setUpMenu(page) {
  await page.evaluate(() => {
    const $ = window.jQuery;
    $.contextMenu('destroy');
    $.contextMenu({
      selector: '.context-menu-one',
      useModal: false,
      build: function () {
        return {
          items: {
            edit: {name: 'Edit', callback: function () {}},
            copy: {name: 'Copy', callback: function () {}}
          }
        };
      },
      events: {
        hide: function () {
          $('.context-menu-one').contextMenu('destroy');
        }
      }
    });
  });
}

test.describe('Issue 805: clicking on after the menu destroyed itself', () => {
  test('does not throw and does not leak the dismiss listener', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await countDismissListeners(page);
    await page.goto(fixture('callback.html'));
    await setUpMenu(page);

    await page.click('.context-menu-one', { button: 'right' });
    await expect(page.locator('.context-menu-root')).toBeVisible();
    expect(await page.evaluate(() => window.__dismissListeners)).toBe(1);

    // pick an option, which hides the menu and lets the hide handler destroy it
    await page.locator('.context-menu-root li').first().click();
    await expect(page.locator('.context-menu-root')).toHaveCount(0);

    // now click somewhere else entirely, with either button
    await page.mouse.click(5, 5);
    await page.mouse.click(5, 5, { button: 'right' });

    expect(pageErrors).toEqual([]);
    expect(await page.evaluate(() => window.__dismissListeners)).toBe(0);
  });

  test('leaves the dismiss listeners bounded over repeated open/destroy cycles', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await countDismissListeners(page);
    await page.goto(fixture('callback.html'));

    for (let i = 0; i < 3; i++) {
      await setUpMenu(page);

      await page.click('.context-menu-one', { button: 'right' });
      await expect(page.locator('.context-menu-root')).toBeVisible();

      await page.locator('.context-menu-root li').first().click();
      await expect(page.locator('.context-menu-root')).toHaveCount(0);

      await page.mouse.click(5, 5);

      expect(await page.evaluate(() => window.__dismissListeners)).toBe(0);
    }

    expect(pageErrors).toEqual([]);
  });
});
