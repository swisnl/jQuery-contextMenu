// Karma configuration
// Generated on Wed Oct 29 2014 01:56:16 GMT+0100 (CET)
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
    config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['qunit', 'sinon'],

        // list of files / patterns to load in the browser
        files: [
            { pattern: 'node_modules/jquery/dist/jquery.js', watched: false, served: true, included: true },
            { pattern: 'dist/jquery.ui.position.js', watched: false, served: true, included: true },

            { pattern: 'src/js/classes/*.js', watched: true, served: false, included: false },
            { pattern: 'src/js/defaults/*.js', watched: true, served: false, included: false },
            { pattern: 'src/js/jquery/*.js', watched: true, served: false, included: false },
            { pattern: 'test/unit/Test*.js', watched: true, served: false, included: false },

            { pattern: 'src/js/contextmenu.js', watched: true, served: true, included: true },

            // test modules
            { pattern: 'test/unit/contextmenu.test.js', watched: true, served: true, included: true }
        ],

        webpack: require('./webpack.test.config'),

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './src/js/contextmenu.js': ['webpack', 'sourcemap'],
            './test/unit/contextmenu.test.js': ['webpack', 'sourcemap']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots', 'coverage-istanbul'],

        coverageIstanbulReporter: {
            reports: ['text-summary', 'lcov'],
            fixWebpackSourcePaths: true,
            subDir: '.'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadless'],

        plugins: [
            'karma-chrome-launcher',
            'karma-qunit',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-coverage',
            'karma-coverage-istanbul-reporter',
            'karma-sinon'
        ],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
