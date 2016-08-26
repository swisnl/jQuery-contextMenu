var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

var menuItem4 = '.context-menu-root li:nth-child(6)';
var submenu1 = '.context-menu-root li.context-menu-item:nth-child(6) > ul:nth-child(2)';
var submenu1Foobar = '.context-menu-root li.context-menu-item:nth-child(6) > ul:nth-child(2) > li:nth-child(1)';
var submenu1Item2 = '.context-menu-root li.context-menu-submenu:nth-child(2)';
var submenu1Subgroup2 = '.context-menu-root li.context-menu-item:nth-child(6) > ul:nth-child(2) > li:nth-child(2)';
var submenu1Subgroup2Charlie = '.context-menu-root li.context-menu-submenu:nth-child(2) > ul:nth-child(2) > li:nth-child(3)';

var returnKey = "\uE006\uE007"; // send <enter> key as well for phantomJS
var rightArrowKey = "\uE014";
var downArrowKey = "\uE015";

var selectFourthMenuItem = downArrowKey + downArrowKey + downArrowKey + downArrowKey;
var selectFirstSubmenuItem = selectFourthMenuItem + rightArrowKey;
var selectSecondSubmenuItem = selectFourthMenuItem + rightArrowKey + downArrowKey;
var selectThirdSubSubMenuItem = selectSecondSubmenuItem + rightArrowKey + downArrowKey + downArrowKey;

// this test uses custom HTML because PhantomJS
// has problems showing alert modal dialogs.
// We are testing callbacks against simple DOM
// manipulations instead.
module.exports = {
  'Sub-menu is visible when parent menu item is highlighted': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/sub-menus_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .sendKeys('body', selectFourthMenuItem)
      .assert.attr(menuItem4, 'class').to.contain('hover')
      .assert.visible(submenu1, 'First sub-menu is visible')
      .done();
  },

  'Sub-menu item triggers callback when clicked': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/sub-menus_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .sendKeys('body', selectFirstSubmenuItem)
      .sendKeys('body', returnKey)
      .assert.text('#msg', 'clicked: fold1-key1', '"Foo bar" sub-menu item triggers callback')
      .done();
  },

  'Sub-sub-menu is visible when parent menu item is highlighted': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/sub-menus_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')
      .sendKeys('body', selectSecondSubmenuItem)
      .assert.attr(submenu1Item2, 'class').to.contain('hover')
      .assert.visible(submenu1Subgroup2, 'Sub-sub-menu should be open and visible')
      .done();
  },

  'Sub-sub-menu item callback is triggered': function (test) {
    test
      .open('file://' + pwd + '/test/integration/html/sub-menus_test.html')
      .execute(helper.rightClick, '.context-menu-one')
      .waitForElement('#context-menu-layer')  
      .sendKeys('body', selectThirdSubSubMenuItem)
      .sendKeys('body', returnKey)
      .assert.text('#msg', 'clicked: fold2-key3', '"charlie" Sub-sub-menu item triggers callback')
      .done();
  }
};
