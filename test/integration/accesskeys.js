var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

// this test uses custom HTML because PhantomJS
// has problems showing alert modal dialogs.
// We are testing callbacks against simple DOM
// manipulations instead.
module.exports = {
  'Typing <e> on keyboard triggers "edit" menu item callback': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/accesskeys_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .sendKeys('body', 'e')
      .assert.text('#msg', 'clicked: edit', 'Edit menu item callback is triggered by accesskey')
      .done();
  },

  'Typing <c> on keyboard triggers "cut" menu item callback': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/accesskeys_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .sendKeys('body', 'c')
      .assert.text('#msg', 'clicked: cut', 'Cut menu item callback is triggered by accesskey')
      .done();
  },

  'Typing <o> on keyboard triggers "copy" menu item callback': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/accesskeys_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .sendKeys('body', 'o')
      .assert.text('#msg', 'clicked: copy', 'Copy menu item callback is triggered by accesskey')
      .done();
  },

  'Typing <p> on keyboard triggers "paste" menu item callback': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/accesskeys_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .sendKeys('body', 'p')
      .assert.text('#msg', 'clicked: paste', 'Paste menu item callback is triggered by accesskey')
      .done();
  }
};
