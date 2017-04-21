var path = require('path');
var webpack = require('webpack');
var version = require('./package.json').version;

module.exports = {
    entry: {
        'dialog': './src/dialog.js',
        'dialog-plus': './src/dialog-plus.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: `dialog`,
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.BannerPlugin('art.dialog@' + version + ' | https://github.com/aui/artDialog')
    ],
    externals: {
        jquery: 'jquery'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    }
};