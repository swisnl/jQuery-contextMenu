var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

// this test uses custom HTML because PhantomJS
// has problems showing alert modal dialogs.
// We are testing callbacks against simple DOM
// manipulations instead.
module.exports = {
  'Clicking on disabled item has no effect': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/disabled_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .assert.numberOfElements('.context-menu-root li')
        .is(2, '2 context menu items are shown')
      .click('.context-menu-root li:last-child')
      .assert.text('#msg', '', 'Disabled menu item didnt set text')
      .done();
  },

  'Clicking on enabled item works': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/disabled_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .click('.context-menu-root li:first-child')
      .assert.text('#msg', 'clicked: edit', 'Enabled menu item sets text')
      .done();
  }
};
