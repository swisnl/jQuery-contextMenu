var pwd = process.cwd();
var helper = require('../integration_test_helper.js');

module.exports = {
    'Click in outside the menu on the body closes the menu': function (test) {
        test
            .open('file://' + pwd + '/demo/iframe.html')
            .execute(helper.rightClick, '#activate-menu')
            .assert.exists('.context-menu-root', 'It opens context menu')
            .assert.visible('.context-menu-root', 'It opens context menu')
            .assert.numberOfElements('.context-menu-root li')
            .is(4, '4 context menu items are shown')
            .click('body')
            .wait(100)
            .assert.notVisible('.context-menu-root', 'Click outside closes context menu')
            .done();
    },
    'Click in another iframe on the body closes the menu': function (test) {
        test
            .open('file://' + pwd + '/demo/iframe.html')
            .execute(helper.rightClick, '#activate-menu')
            .assert.exists('.context-menu-root', 'The context menu exists')
            .assert.visible('.context-menu-root', 'It opens context menu')
            .assert.numberOfElements('.context-menu-root li')
            .is(4, '4 context menu items are shown')
            .toFrame('#frame1')
                .click('body')
            .toParent()
            .wait(100)
            .assert.notVisible('.context-menu-root', 'Click in the iframe closes the menu')
            .done();
    },
    'Right click in another iframe on the body closes the top menu and shows the menu in the iframe': function (test) {
        test
            .open('file://' + pwd + '/demo/iframe.html')
            .execute(helper.rightClick, '#activate-menu')
            .assert.exists('.context-menu-root', 'It opens context menu')
            .assert.visible('.context-menu-root', 'It opens context menu')
            .assert.numberOfElements('.context-menu-root li')
            .is(4, '4 context menu items are shown')
            .toFrame('#frame1')
                .execute(helper.rightClick, '.context-menu-iframe1', 'mousedown')  //Mouse down should happen first
                .execute(helper.rightClick, '.context-menu-iframe1') //Then context menu
                .assert.exists('.context-menu-root', 'The context menu in the iframe exists')
                .assert.visible('.context-menu-root', 'The context menu in the iframe is visible')
            .toParent()
            .wait(100)
            .assert.notVisible('.context-menu-root', 'Right click in the iframe closes the menu')
            .done();
    }
};