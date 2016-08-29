var assert = require('assert');
var pwd = process.cwd();
describe('Test submenus', function() {
    it('should navigate to submenu 2 levels deep and see correct alert for charlie', function () {
        browser.url('file://' + pwd + '/test/integration/html/sub-menus.html');
        browser.rightClick('.context-menu-one');
        browser.moveToObject('span=Sub group')
        browser.moveToObject('span=Sub group 2')
        browser.click('span=charlie')
        assert.equal(browser.alertText(), 'clicked: fold2-key3');
        browser.alertAccept();
    });

    it('should navigate to submenu 2 levels deep and see first menu highlighted', function () {
        browser.url('file://' + pwd + '/test/integration/html/sub-menus.html');
        browser.rightClick('.context-menu-one');
        browser.moveToObject('span=Sub group')
        browser.moveToObject('span=Sub group 2');
        var elements = browser.elements('.context-menu-hover');
        assert.equal(2, elements.value.length);
    });

});
