const path = require('path');
const { expect } = require('@playwright/test');

const JQUERY_VERSION = process.env.JQUERY_VERSION || '4.0.0';

function fixture(name) {
  return 'file://' + path.join(process.cwd(), 'test/integration/html', 'jquery-' + JQUERY_VERSION, name);
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

module.exports = { fixture, expectAlert };
