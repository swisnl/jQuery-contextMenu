var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

module.exports = {
  'Dynamically created <DIV> opens context menu': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/dynamic.html')
      .click('#add-trigger')
      .waitForElement('.menu-injected')
      .execute(helper.rightClick, '.menu-injected')
      .waitForElement('#context-menu-layer')
      .assert.exists('.context-menu-root', 'It opens context menu')
      .assert.numberOfElements('.context-menu-root li')
        .is(7, '7 context menu items are shown')
      .assert.numberOfElements('.context-menu-active')
        .is(1, 'ensure one context menu is open')
      .done();
  },

  '3rd dynamically created <DIV> also opens context menu': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/dynamic.html')
      .click('#add-trigger')
      .click('#add-trigger')
      .click('#add-trigger')
      .wait(200)
      //.waitForElement('.menu-injected')
      .assert.numberOfElements('.menu-injected')
        .is(3, '3 DIVs are added')
      .execute(helper.rightClick, '.menu-injected:last-of-type')
      .waitForElement('#context-menu-layer')
      .assert.exists('.context-menu-root', 'It opens context menu')
      .assert.numberOfElements('.context-menu-root li')
        .is(7, '7 context menu items are shown')
      .assert.numberOfElements('.context-menu-active')
        .is(1, 'ensure one context menu is open')
      .done();
  }
};
