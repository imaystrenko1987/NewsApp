const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const env = process.env.NODE_ENV || 'development';

const commonConfig = {
    mode: "development",
    
    entry: {
        index: './src/index.js',
        style: './src/index.scss'
      },
    output: {
        publicPath: '/',
        chunkFilename: '[name].[chunkhash].js',
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
			{
			    test: /\.scss$/,
                use: [
                    'style-loader', 
                    'css-loader',
                    'sass-loader',
                    './src/modules/my-css-loader'
                ],
            }
        ]
    },
	plugins: [
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
             template: './src/index.html',
            filename: './index.html',
            hash: true
        })
  ]
};

if (env === 'development') {
    module.exports = merge(commonConfig, {
      devtool: 'source-map',
      devServer: {
        contentBase: './src',
        publicPath: '/',
        historyApiFallback: true,
        port: 3000
      },      
    });
}

if (env === 'production') {
    module.exports = merge(commonConfig, {});
}