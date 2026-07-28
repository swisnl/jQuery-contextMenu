const { test, expect } = require('@playwright/test');
const { fixture, expectAlert } = require('../support/helpers');

async function openCallbackMenu(page) {
  await page.goto(fixture('callback.html'));
  await page.click('.context-menu-one', { button: 'right' });
  await page.waitForSelector('#context-menu-layer');
  await expect(page.locator('.context-menu-root')).toBeVisible();
}

test.describe('Test callback', () => {
  test('Ensure edit menu item triggers callback', async ({ page }) => {
    await openCallbackMenu(page);

    await expectAlert(
      page,
      () => page.click('.context-menu-root li:nth-child(1)'),
      'edit was clicked'
    );
    await expect(page.locator('#context-menu-layer')).toBeHidden();
  });

  test('Ensure cut menu item triggers global callback', async ({ page }) => {
    await openCallbackMenu(page);

    await expectAlert(
      page,
      () => page.click('.context-menu-root li:nth-child(2)'),
      'global: cut'
    );
    await expect(page.locator('#context-menu-layer')).toBeHidden();
  });
});
