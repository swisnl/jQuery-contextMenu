
module.exports = function (config) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
        process.exit(1)
    }

    var testedCapabilities = {};
    var browsers = [];

    var capabilities = {
        'Windows 7': {
            'internet explorer': ['11', '10', '9'],
        },
        'Windows 10': {
            'firefox': ['latest', 'latest-1'],
            'chrome': ['latest', 'latest-1'],
            'MicrosoftEdge': ['latest']
        },
        'macOS 10.12': {
            'firefox': ['latest'],
            'chrome': ['latest'],
            'safari': ['latest']
        }
    };

    var buildDate = new Date().toISOString();
    for (var osVersion in capabilities) {
        for (var browserKey in capabilities[osVersion]) {
            for(var i=0; i< capabilities[osVersion][browserKey].length; i++){
                var browserVersion = capabilities[osVersion][browserKey][i];
                testedCapabilities[osVersion + ' ' + browserKey + ' ' + browserVersion] = {
                    base: 'SauceLabs',
                    platform: osVersion,
                    browserName: browserKey,
                    version: browserVersion,
                    name: osVersion + ' ' + browserKey + ' ' + browserVersion,
                    build: buildDate
                };
            }


            if(browsers.indexOf(browserKey) == -1){
                browsers.push(browsers);
            }
        }
    }

    config.set({
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['qunit'],


        // list of files / patterns to load in the browser
        files: [

            // dependencies
            { pattern: 'node_modules/jquery/dist/jquery.js', watched: false, served: true, included: true },
            { pattern: 'src/jquery.ui.position.js', watched: false, served: true, included: true },
            { pattern: 'src/jquery.contextMenu.js', watched: false, served: true, included: true },

            // test modules
            'test/unit/*.js'
        ],


        reporters: ['dots', 'saucelabs'],
        port: 9876,
        colors: true,
        sauceLabs: {
            testName: 'jQuery contextMenu saucelabs',
            recordScreenshots: false,
            public: 'public'

        },
        // Increase timeout in case connection in CI is slow
        captureTimeout: 600000,
        customLaunchers: testedCapabilities,
        browsers: Object.keys(testedCapabilities),
        singleRun: true
    })
}
