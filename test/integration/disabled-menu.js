var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

module.exports = {
  'Disabled trigger doesnt open context menu': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/disabled-menu.html')
      .assert.numberOfElements('.context-menu-one')
        .is(1, 'Context menu trigger is disabled')
      .execute(helper.rightClick, '.context-menu-one')
      .wait(100)
      .assert.notVisible('.context-menu-root', 'Menu is not present')
      .assert.doesntExist('#context-menu-layer', 'Context menu is not shown')
      .done();
  },

  'Enabled trigger opens context menu': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/disabled-menu.html')
      .click('#toggle-disabled')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .wait(100)
      .$('.context-menu-root')
        .assert.visible('Menu is present')
        .assert.exists('It opens context menu')
      .end()
      .assert.numberOfElements('.context-menu-root li')
        .is(7, '7 context menu items are shown')
      .assert.width('.context-menu-root').is.gt(100)
      .done();
  },

  'Repeatedly disabled trigger doesnt open context menu': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/disabled-menu.html')
      .assert.numberOfElements('.context-menu-one')
        .is(1, 'Context menu trigger is disabled')
      .execute(helper.rightClick, '.context-menu-one')
      .wait(100)
      .assert.notVisible('.context-menu-root', 'Menu is not present')
      .assert.doesntExist('#context-menu-layer', 'Context menu is not shown')
      .click('#toggle-disabled')
      .assert.doesntExist('.context-menu-disabled', 'Context menu trigger is enambled')
      .click('#toggle-disabled')
      .assert.numberOfElements('.context-menu-one')
        .is(1, 'Context menu trigger is disabled again')
      .execute(helper.rightClick, '.context-menu-one')
      .wait(100)
      .assert.notVisible('.context-menu-root', 'Menu is not present')
      .assert.doesntExist('#context-menu-layer', 'Context menu is not shown')
      .done();
  }
};
