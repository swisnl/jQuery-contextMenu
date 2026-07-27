const path = require('path');
const { test, expect } = require('@playwright/test');

const JQUERY_VERSION = process.env.JQUERY_VERSION || '4.0.0';
const fixture = (name) => 'file://' + path.join(process.cwd(), 'test/integration/html', 'jquery-' + JQUERY_VERSION, name);

async function expectAlert(page, action, message) {
  let dialogMessage = null;
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await action();
  expect(dialogMessage).toBe(message);
}

test.describe('Test submenus', () => {
  test('should navigate to submenu 2 levels deep and see correct alert for charlie', async ({ page }) => {
    await page.goto(fixture('sub-menus.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await page.hover('span:text-is("Sub group")');
    await page.hover('span:text-is("Sub group 2")');
    await expectAlert(
      page,
      () => page.click('span:text-is("charlie")'),
      'clicked: fold2-key3'
    );
  });

  test('should navigate to submenu 2 levels deep and see first menu highlighted', async ({ page }) => {
    await page.goto(fixture('sub-menus.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await page.hover('span:text-is("Sub group")');
    await page.hover('span:text-is("Sub group 2")');
    await expect(page.locator('.context-menu-hover')).toHaveCount(2);
  });
});
