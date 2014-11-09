var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

module.exports = {
  'Right-click opens context menu': function (test) {
    test
      .open('file://' + pwd + '/demo.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .assert.visible('.context-menu-root', 'Menu is present')
      .assert.exists('.context-menu-root', 'It opens context menu')
      .assert.numberOfElements('.context-menu-root li')
        .is(7, '7 context menu items are shown')
      .assert.width('.context-menu-root').is.gt(100)
      .done();
  }
};
