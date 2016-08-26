var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

module.exports = {
  'Render async context menu': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/async-create.html')
      .execute(helper.rightClick, '.context-menu-one', 'mouseup')
      .waitForElement('#context-menu-layer')
      .assert.exists('.context-menu-root', 'It opens context menu')
      .assert.numberOfElements('.context-menu-root li')
        .is(3, '3 context menu items are shown')
      .done();
  }
};
