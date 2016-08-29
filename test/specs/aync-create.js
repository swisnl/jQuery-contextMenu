var assert = require('assert');
var pwd = process.cwd();
describe('Test async create', function() {
    it('should render async created context menu', function () {
        browser.url('file://' + pwd + '/test/integration/html/async-create.html');
        browser.rightClick('.context-menu-one');
        browser.waitForExist('#context-menu-layer');
        assert.equal(3, browser.elements('.context-menu-root li').value.length);
    });
});
