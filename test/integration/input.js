var pwd = process.cwd();
var helper = require('../integration_test_helper.js');
var text1 = '.context-menu-root input[name="context-menu-input-name"]';
var textArea1 = '.context-menu-root textarea[name="context-menu-input-area1"]';
var textArea2 = '.context-menu-root textarea[name="context-menu-input-area2"]';

module.exports = {
  'HTML5 input-based menu is shown correctly': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/input.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .assert.visible('.context-menu-root', 'Menu is present')
      .assert.exists('.context-menu-root', 'It opens context menu')
      .assert.numberOfElements('.context-menu-root li')
        .is(14, '14 context menu items are shown')
      .assert.numberOfElements('.context-menu-root input')
        .is(6, '6 HTML input items are shown')
      .assert.width('.context-menu-root').is.gt(100)
      .done();
  },

  'HTML5 input-based menu stores state when closed': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/input.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .type(text1, 'lorem ipsum')
      .type(textArea1, 'test area with height')
      .type(textArea2, 'shots go off')
      .execute(helper.closeMenu, '.context-menu-one')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .assert.val(text1, 'lorem ipsum', 'Input text should contain entered text')
      .assert.val(textArea1, 'test area with height', 'Text area 1 should contain entered text')
      .assert.val(textArea2, 'shots go off', 'Text area 2 should contain entered text')
      .done();
  }
};
