var webpack = require('webpack');
var version = require('./package.json').version;

module.exports = {
    entry: {
        'dialog': './src/dialog.js',
        'dialog-plus': './src/dialog-plus.js'
    },
    output: {
        path: 'dist',
        filename: '[name].js',
        library: `dialog`,
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.BannerPlugin('art.dialog@' + version + ' | https://github.com/aui/artDialog')
    ],
    externals: {
        jquery: 'jQuery'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    }
};