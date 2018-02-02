let projectname = 'jquery-contextmenu';
if (process.env.TRAVIS_PULL_REQUEST !== 'false' && process.env.TRAVIS_PULL_REQUEST !== false) {
    projectname += '-pr';
} else if (process.env.TRAVIS_BRANCH) {
    projectname += '-' + process.env.TRAVIS_BRANCH;
} else {
    projectname += '-develop';
}
console.log('Browserstack project name', projectname);

const browserslist = require('browserslist');
const pkg = require('./package');
const browsers = browserslist(pkg.browserslist);
const supportedBrowsers = {
    'IE': [],
    'Chrome': [],
    'Firefox': [],
    'Edge': []
};
for (let i in browsers) {
    for (let browser in supportedBrowsers) {
        if (browsers[i].indexOf(browser.toLowerCase() + ' ') === 0) {
            supportedBrowsers[browser].push(browsers[i].split(' ')[1]);
        }
    }
}
supportedBrowsers['Safari'] = ['latest'];

module.exports = function (config) {
    if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
        console.log('Make sure the BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables are set.')
        process.exit(1)
    }

    let testedCapabilities = {};

    let capabilities = {
        'Windows': {
            '7': [
                'IE'
            ],
            '10': [
                'Edge',
                'Firefox',
                'Chrome'
            ]
        },
        'OS X': {
            'High Sierra': [
                'Safari',
                'Firefox',
                'Chrome'
            ],
            'Sierra': [
                'Safari',
                'Firefox',
                'Chrome'
            ]
        }
    };

    let buildDate = new Date().toISOString();
    for (let os in capabilities) {
        if (!capabilities.hasOwnProperty(os)) {
            continue;
        }
        for (let osVersion in capabilities[os]) {
            if (!capabilities[os].hasOwnProperty(osVersion)) {
                continue;
            }
            for (let browserIndex in capabilities[os][osVersion]) {
                if (!capabilities[os][osVersion].hasOwnProperty(browserIndex)) {
                    continue;
                }
                let browserKey = capabilities[os][osVersion][browserIndex];

                for (let i = 0; i < supportedBrowsers[browserKey].length; i++) {
                    let browserVersion = supportedBrowsers[browserKey][i];
                    let uniqueName = os + ' ' + osVersion + ' ' + browserKey + ' ' + browserVersion;
                    testedCapabilities[uniqueName] = {
                        base: 'BrowserStack',
                        platform: osVersion,
                        browser: browserKey,
                        browser_version: browserVersion,
                        os: os,
                        os_version: osVersion,
                        name: uniqueName,
                        build: buildDate
                    };
                }
            }
        }
    }

    config.set({
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['qunit', 'sinon'],

        // list of files / patterns to load in the browser
        files: [
            {pattern: 'node_modules/jquery/dist/jquery.js', watched: false, served: true, included: true},
            {pattern: 'dist/jquery.ui.position.js', watched: false, served: true, included: true},
            {pattern: 'src/js/contextmenu.js', watched: true, served: true, included: true},

            // test modules
            'test/unit/contextmenu.test.js'
        ],

        webpack: require('./webpack.test.config'),

        reporters: ['dots', 'BrowserStack'],

        port: 9876,
        colors: true,

        // global config of your BrowserStack account
        browserStack: {
            project: projectname,
            username: process.env.BROWSERSTACK_USERNAME,
            accessKey: process.env.BROWSERSTACK_ACCESS_KEY
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './src/js/contextmenu.js': ['webpack', 'sourcemap'],
            './test/unit/test-events.js': ['webpack', 'sourcemap']
        },

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,

        customLaunchers: testedCapabilities,
        browsers: Object.keys(testedCapabilities),
        singleRun: true,
        concurrency: 5,
        captureTimeout: 100000,

        plugins: [
            'karma-chrome-launcher',
            'karma-qunit',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-browserstack-launcher',
            'karma-sinon'
        ]
    })
};
