const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackCfg = require('../webpack.config');
const routes = require('./Route/route')
const socket = require('./Route/sockets')

const app = express();

routes(app);

app.use('/server/uploads',express.static(path.join(__dirname, './uploads')));

const env = process.env.NODE_ENV || 'development';

if(env === 'development'){
  const compiler = webpack(webpackCfg)
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackCfg.output.publicPath,
    contentBase : path.join(__dirname,'../client'),
    hot         : true,
    quiet       : false,
    noInfo      : false,
    lazy        : false,
    stats       : {
                    chunks : false,
                    chunkModules : false,
                    colors : true
                  }
  }))
  app.use(require('webpack-hot-middleware')(compiler));
  app.use(express.static(path.join(__dirname,'../client')));
  app.use('*', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  })
}

const server = app.listen(3000);
socket(server);