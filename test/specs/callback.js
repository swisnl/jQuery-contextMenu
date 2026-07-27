const path = require('path');
const { test, expect } = require('@playwright/test');

const JQUERY_VERSION = process.env.JQUERY_VERSION || '4.0.0';
const fixture = (name) => 'file://' + path.join(process.cwd(), 'test/integration/html', 'jquery-' + JQUERY_VERSION, name);

async function openCallbackMenu(page) {
  await page.goto(fixture('callback.html'));
  await page.click('.context-menu-one', { button: 'right' });
  await page.waitForSelector('#context-menu-layer');
  await expect(page.locator('.context-menu-root')).toBeVisible();
}

async function expectAlert(page, action, message) {
  let dialogMessage = null;
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await action();
  expect(dialogMessage).toBe(message);
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
