var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        popups: './src/angular/index.js'
    },
    output: {
        path: 'dist/angular',
        filename: '[name].js'
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ],
    externals: {
        jquery: 'jQuery',
        angular: 'angular'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')}
        ]
    }
};