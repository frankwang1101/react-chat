var path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['webpack-hot-middleware/client?path=/__webpack_hmr','./client/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module:{
    loaders: [
        {
            test: /\.jsx?$/,
            exclunde: /node_modules/,
            loader: 'babel'
        },{
            test: /\.less$/,
            loader: "style!css!less"
        }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
  ],
};