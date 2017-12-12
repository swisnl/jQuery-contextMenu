const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const packageJson = require('./package.json');

module.exports = {
    entry: './src-module/contextmenu.js',
    devtool: "#source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jquery.contextMenu.min.js',
        library: "jquery.contextMenu",
        libraryTarget: "umd",
        auxiliaryComment: {
            root: `
 /**
 * jQuery contextMenu v${packageJson.version} - Plugin for simple contextMenu handling
 *
 * Version: v${packageJson.version}
 *
 * Authors: Björn Brala (SWIS.nl), Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://swisnl.github.io/jQuery-contextMenu/
 *
 * Copyright (c) 2011-2017 SWIS BV and contributors
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 * Date: ${(new Date()).toISOString()}
 */
 `
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, use: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                sourceMap: true
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        }, {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: 'style-loader'
                }),
                exclude: /node_modules/
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ExtractTextPlugin({
            filename: 'jquery.contextMenu.min.css'
        }),
        new OptimizeCssAssetsPlugin({
            //IMPORTANT: only minify asset ends with .min.css
            assetNameRegExp: /\.min\.css$/g
        }),
        new UglifyJsPlugin({
            sourceMap: true
        }),
        new UnminifiedWebpackPlugin(),
    ],
    externals: {
        "jquery": "jQuery"
    }
};