var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

module.exports = {
  'Mouse hover opens context menu': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/trigger-custom.html')
      .click('#activate-menu')
      .waitForElement('#context-menu-layer')
      .assert.visible('.context-menu-root', 'Menu is present')
      .assert.exists('.context-menu-root', 'It opens context menu')
      .assert.numberOfElements('.context-menu-root li')
        .is(7, '7 context menu items are shown')
      .click('#context-menu-layer')
      .wait(100)
      .assert.doesntExist('#context-menu-layer', 'Click outside closes context menu')
      .done();
  }
};
