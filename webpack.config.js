const path = require("path");
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ["./src/index.js", "./src/index.scss"],
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
				exclude: /node_modules/,
                loader: "babel-loader",
				options: {
				  presets: ['latest'],
				  plugins: ['transform-runtime']
			    }
            },
			{
			    test: /\.scss$/,
                use: [
                    'style-loader', 
                    'css-loader',
                    'sass-loader'
                ],
		    }
        ]
    },
	plugins: [
       new htmlWebpackPlugin({
         template: './src/index.html',
         filename: '../index.html',
         hash: true
       })
  ]
};
