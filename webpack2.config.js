const  webpack = require('webpack');
const path = require('path')

module.exports = {
    // entry:{
    //     bundle:'./index.jsx',
    // },
    entry:['./client/index.js'],
    output:{
        path: path.join(__dirname,'dist'),
        filename: 'bundle.js',
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    watch:true,
    module: {
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
//     plugins: [
//         new webpack.optimize.UglifyJsPlugin({
//             compress: {
//                 warnings: false
//             }
//         }),
//         //new webpack.optimize.DedupePlugin(),
//         new webpack.optimize.OccurenceOrderPlugin(),
//         new webpack.DefinePlugin({
//             'process.env.NODE_ENV': JSON.stringify('production')
//         })
//   ]
}
