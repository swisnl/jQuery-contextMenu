var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

// this test uses custom HTML because PhantomJS
// has problems showing alert modal dialogs.
// We are testing callbacks against simple DOM
// manipulations instead.
module.exports = {
  'Click custom comand menu item triggers menu callback': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/custom-command_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .assert.numberOfElements('.context-menu-root>li')
        .is(3, '3 context menu items are shown')
      .click('.context-menu-root li.labels')
      .assert.text('#msg').to.contain('clicked: label', 'contextMenu callback was triggered')
      .done();
  },

  'Click custom comand menu item label triggers custom action - red': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/custom-command_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .click('.context-menu-root li.labels .label1')
      .assert.text('#msg', 'clicked: label | text: label 1', 'custom action was triggered')
      .done();
  },

  'Click custom comand menu item label triggers custom action - blue': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/custom-command_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .click('.context-menu-root li.labels .label3')
      .assert.text('#msg', 'clicked: label | text: label 3', 'custom action was triggered')
      .done();
  }
};
