var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

// this test uses custom HTML because PhantomJS
// has problems showing alert modal dialogs.
// We are testing callbacks against simple DOM
// manipulations instead.
module.exports = {
  'Ensure edit menu item triggers callback': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/callback_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.visible('.context-menu-root', 'Menu is present')
      .click('.context-menu-root li:nth-child(1)') // edit
      .assert.text('#msg', 'edit was clicked', 'Edit item triggers callback')
      .assert.doesntExist('#context-menu-layer', 'It closes context menu')
      .done();
  },

  'Ensure cut menu item triggers global callback': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/callback_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.visible('.context-menu-root', 'Menu is present')
      .click('.context-menu-root li:nth-child(2)') // cut
      .assert.text('#msg', 'global: cut', 'Cut item triggers callback')
      .assert.doesntExist('#context-menu-layer', 'It closes context menu')
      .done();
  },

  'Ensure delete menu item triggers global callback': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/callback_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.visible('.context-menu-root', 'Menu is present')
      .click('.context-menu-root li:nth-child(5)') // delete
      .assert.text('#msg', 'global: delete', 'delete item triggers callback')
      .assert.doesntExist('#context-menu-layer', 'It closes context menu')
      .done();
  },

  'Ensure quit menu item triggers global callback': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/callback_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.visible('.context-menu-root', 'Menu is present')
      .click('.context-menu-root li:nth-child(7)') // quit
      .assert.text('#msg', 'global: quit', 'quit item triggers callback')
      .assert.doesntExist('#context-menu-layer', 'It closes context menu')
      .done();
  }
};
