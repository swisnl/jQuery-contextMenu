var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

module.exports = {
  'Ensure context menu is shown': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/keeping-contextmenu-open.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.exists('.context-menu-root', 'It opens context menu')
      .assert.numberOfElements('.context-menu-root li')
        .is(2, '2 context menu items are shown')
      .done();
  },

  'Close context menu after first menu item is clicked': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/keeping-contextmenu-open.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.visible('.context-menu-root li:first-child', 'Menu item is present')
      .click('.context-menu-root li:first-child')
      .assert.doesntExist('#context-menu-layer', 'It closes context menu')
      .done();
  },

  'Keep context menu open after second menu item is clicked': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/keeping-contextmenu-open.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.visible('.context-menu-root', 'Menu is present')
      .click('.context-menu-root li:last-child')
      .assert.exists('#context-menu-layer', 'It closes context menu')
      .done();
  }
};
