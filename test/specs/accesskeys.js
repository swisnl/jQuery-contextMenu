var assert = require('assert');
var pwd = process.cwd();
describe('Test accesskeys', function() {
    it('should navigate to submenu 2 levels deep and see correct alert for charlie', function () {
        browser.url('file://' + pwd + '/test/integration/html/sub-menus.html');
        browser.rightClick('.context-menu-one');
        browser.moveToObject('span=Sub group')
        browser.moveToObject('span=Sub group 2')
        browser.click('span=charlie')
        assert.equal(browser.alertText(), 'clicked: fold2-key3');
        browser.alertAccept();
    });
    it('Typing <e> on keyboard triggers "edit" menu item callback', function () {
        browser.url('file://' + pwd + '/test/integration/html/accesskeys.html');
        browser.rightClick('.context-menu-one');
        browser.keys('e');
        assert.equal(browser.alertText(), 'clicked: edit');
        browser.alertAccept();
    });

    it('Typing <c> on keyboard triggers "cut" menu item callback', function () {
        browser.url('file://' + pwd + '/test/integration/html/accesskeys.html');
        browser.rightClick('.context-menu-one');
        browser.keys('c');
        assert.equal(browser.alertText(), 'clicked: cut');
        browser.alertAccept();
    });

    it('Typing <o> on keyboard triggers "copy" menu item callback', function () {
        browser.url('file://' + pwd + '/test/integration/html/accesskeys.html');
        browser.rightClick('.context-menu-one');
        browser.keys('o');
        assert.equal(browser.alertText(), 'clicked: copy');
        browser.alertAccept();
    });

    it('Typing <p> on keyboard triggers "paste" menu item callback', function () {
        browser.url('file://' + pwd + '/test/integration/html/accesskeys.html');
        browser.rightClick('.context-menu-one');
        browser.keys('p');
        assert.equal(browser.alertText(), 'clicked: paste');
        browser.alertAccept();
    });

});
