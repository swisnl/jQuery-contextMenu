const path = require('path');
const { test, expect } = require('@playwright/test');

const fixture = (name) => 'file://' + path.join(process.cwd(), 'test/integration/html', name);

async function expectAlert(page, action, message) {
  let dialogMessage = null;
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await action();
  expect(dialogMessage).toBe(message);
}

test.describe('Test accesskeys', () => {
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

  test('Typing <e> on keyboard triggers "edit" menu item callback', async ({ page }) => {
    await page.goto(fixture('accesskeys.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await expectAlert(page, () => page.keyboard.press('e'), 'clicked: edit');
  });

  test('Typing <c> on keyboard triggers "cut" menu item callback', async ({ page }) => {
    await page.goto(fixture('accesskeys.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await expectAlert(page, () => page.keyboard.press('c'), 'clicked: cut');
  });

  test('Typing <o> on keyboard triggers "copy" menu item callback', async ({ page }) => {
    await page.goto(fixture('accesskeys.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await expectAlert(page, () => page.keyboard.press('o'), 'clicked: copy');
  });

  test('Typing <p> on keyboard triggers "paste" menu item callback', async ({ page }) => {
    await page.goto(fixture('accesskeys.html'));
    await page.click('.context-menu-one', { button: 'right' });
    await expectAlert(page, () => page.keyboard.press('p'), 'clicked: paste');
  });
});
