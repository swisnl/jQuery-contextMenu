var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

// this test uses custom HTML because PhantomJS
// has problems showing alert modal dialogs.
// We are testing callbacks against simple DOM
// manipulations instead.
module.exports = {
  'Clicking on disabled item has no effect': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/disabled-changing_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.numberOfElements('.context-menu-root li')
        .is(3, '3 context menu items are shown')
      .click('.context-menu-root li:nth-child(2)')
      .assert.text('#msg', '', 'Disabled menu item didnt set text')
      .done();
  },

  'Toggle disabled item status': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/disabled-changing_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .click('.context-menu-root li:nth-child(3)')
      .assert.doesntExist('.context-menu-root .disabled', 'All menu items are enabled')
      .click('.context-menu-root li:nth-child(2)')
      .assert.text('#msg', 'clicked: cut', 'Enabled menu item sets text')
      .done();
  },

  'Toggled status is saved after menu is closed': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/disabled-changing_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .click('.context-menu-root li:nth-child(3)')
      .assert.doesntExist('.context-menu-root .disabled', 'All menu items are enabled')
      .execute(helper.closeMenu, '.context-menu-one')
      .wait(100)
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.doesntExist('.context-menu-root .disabled', 'All menu items are still enabled')
      .done();
  }
};
