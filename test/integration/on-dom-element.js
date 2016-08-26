var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

module.exports = {
  'Right-click on multiple DOM elements': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/on-dom-element.html')
      .execute(helper.rightClick, '#the-node li:first-child')
      .waitForElement('#context-menu-layer')
      .assert.exists('.context-menu-root', 'It opens context menu')
      .assert.numberOfElements('.context-menu-root li')
        .is(7, '7 context menu items are shown')
      .assert.numberOfElements('.context-menu-active')
        .is(1, 'ensure one context menu is open')

      // right click on the other DOM element
      .execute(helper.rightClick, '#the-node li:nth-child(3)')
      .wait(100) // wait for the old menu to close and new to reopen
      .waitForElement('#context-menu-layer')
      .assert.exists('.context-menu-root', 'It re-opens the same context menu')
      .assert.numberOfElements('.context-menu-active')
        .is(1, 'ensure still only one context menu is open')
      .done();
  }
};
