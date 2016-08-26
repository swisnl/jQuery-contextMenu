var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

module.exports = {
  'Dynamically created context menu is shown': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/dynamic-create.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .assert.visible('.context-menu-root', 'Menu is present')
      .assert.exists('.context-menu-root', 'It opens context menu')
      .assert.numberOfElements('.context-menu-root li')
        .is(7, '7 context menu items are shown')
      .done();
  }
};
