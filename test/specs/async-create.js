const { test, expect } = require('@playwright/test');
const { fixture } = require('../support/helpers');

// Records whether the browser's own context menu would have been shown, and how
// often the demo's jQuery 'contextmenu' handler ran. $.fn.contextMenu() opens the
// menu by triggering a jQuery 'contextmenu' event, which is not dispatched to
// native listeners, so the two counters deliberately use different bindings.
async function instrument(page) {
  await page.evaluate(() => {
    window.__nativePrevented = null;
    window.__nativeEvents = 0;
    window.__jqueryEvents = 0;
    document.querySelector('.context-menu-one').addEventListener('contextmenu', function (e) {
      window.__nativeEvents++;
      window.__nativePrevented = e.defaultPrevented;
    });
    window.jQuery('.context-menu-one').on('contextmenu', function () {
      window.__jqueryEvents++;
    });
  });
}

test.describe('Test async create', () => {
  test('should only render the context menu once the items have been fetched', async ({ page }) => {
    await page.goto(fixture('async-create.html'));

    const start = Date.now();
    await page.click('.context-menu-one', { button: 'right' });
    await page.waitForSelector('#context-menu-layer');

    // the demo waits ~1s for a (simulated) server round trip, so the menu cannot
    // have been built synchronously off the right click. Only bounded from below,
    // a slow machine may take longer.
    expect(Date.now() - start).toBeGreaterThanOrEqual(500);

    await expect(page.locator('.context-menu-root')).toBeVisible();
    await expect(page.locator('.context-menu-root li')).toHaveCount(3);
  });

  test('should suppress the browser context menu on right click', async ({ page }) => {
    await page.goto(fixture('async-create.html'));
    await instrument(page);

    await page.click('.context-menu-one', { button: 'right' });
    await page.waitForSelector('#context-menu-layer');

    expect(await page.evaluate(() => window.__nativeEvents)).toBe(1);
    expect(await page.evaluate(() => window.__nativePrevented)).toBe(true);
  });

  test('should open from a contextmenu event alone, without a mouseup', async ({ page }) => {
    await page.goto(fixture('async-create.html'));

    // Chromium keeps its own context menu open over the page and never delivers
    // the mouseup, so the demo must key off contextmenu instead.
    // See https://github.com/swisnl/jQuery-contextMenu/issues/735
    await page.evaluate(() => {
      const trigger = document.querySelector('.context-menu-one');
      const rect = trigger.getBoundingClientRect();
      trigger.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2,
        clientX: Math.round(rect.left + 5),
        clientY: Math.round(rect.top + 5),
      }));
    });

    await page.waitForSelector('#context-menu-layer');
    await expect(page.locator('.context-menu-root li')).toHaveCount(3);
  });

  test('should guard the re-entrant contextmenu event raised by $.fn.contextMenu()', async ({ page }) => {
    await page.goto(fixture('async-create.html'));
    await instrument(page);

    await page.click('.context-menu-one', { button: 'right' });
    await page.waitForSelector('#context-menu-layer');

    // one genuine right click plus the one raised by $.fn.contextMenu(); without
    // the guard in the demo this would recurse instead of settling on two
    expect(await page.evaluate(() => window.__jqueryEvents)).toBe(2);
    await expect(page.locator('.context-menu-root')).toHaveCount(1);
  });

  test('should open again on a second right click', async ({ page }) => {
    await page.goto(fixture('async-create.html'));

    await page.click('.context-menu-one', { button: 'right' });
    await page.waitForSelector('#context-menu-layer');
    await expect(page.locator('.context-menu-root')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.context-menu-root')).toBeHidden();

    await page.click('.context-menu-one', { button: 'right' });
    await page.waitForSelector('#context-menu-layer');
    await expect(page.locator('.context-menu-root')).toBeVisible();
    await expect(page.locator('.context-menu-root li')).toHaveCount(3);
  });
});
