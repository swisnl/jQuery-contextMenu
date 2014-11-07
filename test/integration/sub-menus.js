var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

var menu_item4 = '.context-menu-root li:nth-child(6)';
var submenu1 = '.context-menu-root li.context-menu-item:nth-child(6) > ul:nth-child(2)';
var submenu1_foobar = '.context-menu-root li.context-menu-item:nth-child(6) > ul:nth-child(2) > li:nth-child(1)';
var submenu1_item2 = '.context-menu-root li.context-menu-submenu:nth-child(2)';
var submenu1_subgroup2 = '.context-menu-root li.context-menu-item:nth-child(6) > ul:nth-child(2) > li:nth-child(2)';
var submenu1_subgroup2_charlie = '.context-menu-root li.context-menu-submenu:nth-child(2) > ul:nth-child(2) > li:nth-child(3)';

var return_key = "\uE006\uE007"; // send <enter> key as well for phantomJS
var right_arrow_key = "\uE014";
var down_arrow_key = "\uE015";

var select_fourth_menu_item = down_arrow_key + down_arrow_key + down_arrow_key + down_arrow_key;
var select_first_submenu_item = select_fourth_menu_item + right_arrow_key;
var select_second_submenu_item = select_fourth_menu_item + right_arrow_key + down_arrow_key;
var select_third_sub_sub_menu_item = select_second_submenu_item + right_arrow_key + down_arrow_key + down_arrow_key;

// this test uses custom HTML because PhantomJS
// has problems showing alert modal dialogs.
// We are testing callbacks against simple DOM
// manipulations instead.
module.exports = {
  'Sub-menu is visible when parent menu item is highlighted': function (test) {
    test
      .open('file://' + pwd + '/demo/sub-menus_test.html')
      .execute(helper.rightClick, '.context-menu-sub')
      .waitForElement('#context-menu-layer')
      .sendKeys("body", select_fourth_menu_item)
      .assert.attr(menu_item4, 'class').to.contain('hover')
      .assert.visible(submenu1, 'First sub-menu is visible')
      .done();
  },

  'Sub-menu item triggers callback when clicked': function (test) {
    test
      .open('file://' + pwd + '/demo/sub-menus_test.html')
      .execute(helper.rightClick, '.context-menu-sub')
      .waitForElement('#context-menu-layer')
      .sendKeys("body", select_first_submenu_item)
      .sendKeys("body", return_key)
      .assert.text('#msg', 'clicked: fold1-key1', '"Foo bar" sub-menu item triggers callback')
      .done();
  },

  'Sub-sub-menu is visible when parent menu item is highlighted': function (test) {
    test
      .open('file://' + pwd + '/demo/sub-menus_test.html')
      .execute(helper.rightClick, '.context-menu-sub')
      .waitForElement('#context-menu-layer')
      .sendKeys("body", select_second_submenu_item)
      .assert.attr(submenu1_item2, 'class').to.contain('hover')
      .assert.visible(submenu1_subgroup2, 'Sub-sub-menu should be open and visible')
      .done();
  },

  'Sub-sub-menu item callback is triggered': function (test) {
    test
      .open('file://' + pwd + '/demo/sub-menus_test.html')
      .execute(helper.rightClick, '.context-menu-sub')
      .waitForElement('#context-menu-layer')  
      .sendKeys("body", select_third_sub_sub_menu_item)
      .sendKeys("body", return_key)
      .assert.text('#msg', 'clicked: fold2-key3', '"charlie" Sub-sub-menu item triggers callback')
      .done();
  }
};
