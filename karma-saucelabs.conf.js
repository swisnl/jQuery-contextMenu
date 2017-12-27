
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
            { pattern: 'node_modules/jquery/dist/jquery.js', watched: false, served: true, included: true },
            { pattern: 'dist/jquery.ui.position.js', watched: false, served: true, included: true },
            { pattern: 'src/js/contextmenu.js', watched: true, served: true, included: true },
            { pattern: 'node_modules/sinon/pkg/sinon.js', watched: false, served: true, included: true },

            // test modules
            'test/unit/test-events.js'
        ],

        webpack: require('./webpack.test.config'),

        reporters: ['dots', 'saucelabs', 'coverage-istanbul'],

        coverageIstanbulReporter: {
            reports: ['lcovonly'],
            fixWebpackSourcePaths: true,
            subDir: '.'
        },

        port: 9876,
        colors: true,
        sauceLabs: {
            testName: 'jQuery contextMenu saucelabs',
            recordScreenshots: false,
            public: 'public'
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './src/js/contextmenu.js': ['webpack', 'sourcemap'],
            './test/unit/test-events.js': ['webpack', 'sourcemap']
        },

        // Increase timeout in case connection in CI is slow
        captureTimeout: 600000,
        customLaunchers: testedCapabilities,
        browsers: Object.keys(testedCapabilities),
        singleRun: true,

        plugins: [
            'karma-chrome-launcher',
            'karma-qunit',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-coverage',
            'karma-coverage-istanbul-reporter',
            'karma-sauce-launcher'
        ]
    })
};
