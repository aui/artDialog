var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        test: './test/angular/js/test.js'
    },
    output: {
        path: 'dist/angular',
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js'),
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