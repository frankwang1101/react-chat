var path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app:['webpack-hot-middleware/client?path=/__webpack_hmr','./client/index.js'],
    vendor: ['react', 'react-dom', 'react-router-dom']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    chunkFilename: '[name]-[id].[chunkhash:8].bundle.js'
  },
  module:{
    loaders: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        },{
            test: /\.css$/,
            loader: "style!css"
        },{
            test: /\.less$/,
            loader: "style!css!less"
        },{
          test: /\.(png|jpg)$/,
          loader: 'url-loader?limit=8192&name=[name].[hash:8].[ext]'
        },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ],
};