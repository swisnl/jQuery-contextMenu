var assert = require('assert');
var pwd = process.cwd();

describe('Test callback', function() {
  function openCallbackMenu() {
    browser.url('file://' + pwd + '/test/integration/html/callback.html');
    browser.rightClick('.context-menu-one');
    browser.waitForExist('#context-menu-layer');
    assert.equal(true, browser.isVisible('.context-menu-root'), 'menu is visible');
  }

  it('Ensure edit menu item triggers callback', function () {
    openCallbackMenu();

    browser.leftClick('.context-menu-root li:nth-child(1)');
    assert.equal('edit was clicked', browser.alertText());
    browser.alertAccept();
    assert.equal(false, browser.isVisible('£context-menu-layer'), 'menu is hidden');
  });
  it('Ensure cut menu item triggers global callback', function () {
    openCallbackMenu();

    browser.leftClick('.context-menu-root li:nth-child(2)');
    assert.equal('global: cut', browser.alertText());
    browser.alertAccept();
    assert.equal(false, browser.isVisible('£context-menu-layer'), 'menu is hidden');
  });
});