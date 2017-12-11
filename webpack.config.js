const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    entry: './src-module/jquery.contextMenu.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jquery.contextMenu.js'
    },
    module: {
        rules: [
            {test: /\.(js|jsx)$/, use: 'babel-loader'}
        ]
    },
    plugins: [
        // new UglifyJsPlugin(),
    ],
    externals: {
        "jquery": "jQuery"
    }
};