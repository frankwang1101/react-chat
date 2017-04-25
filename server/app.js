const express = require('express');
const app = express();
const path = require('path');
const webpack = require('webpack');
const webpackCfg = require('../webpack.config');
const socketIo = require('socket.io');

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
const io = socketIo.listen(server);

const users = new Set();

io.on('connection',(socket)=>{
  socket.on('msg',(data)=>{
    const json = JSON.parse(data);
    io.sockets.emit('broadcast',JSON.stringify({
      user:json.user,
      msg:json.msg,
      date:new Date(),
      type:'msg'
    }))
  });
  socket.on('login',(name) => {
    let type = '';
    if(users.has(name)){
      type = 'exist';
      socket.emit('login',JSON.stringify({
        user:name,
        date:new Date(),
        type
      }))
    }else{
      type = 'login';
      socket.user = name;
      users.add(name);
      io.sockets.emit('broadcast',JSON.stringify({
        user:name,
        date:new Date(),
        type
      }))
      socket.emit('login',JSON.stringify({
        user:name,
        date:new Date(),
        type
      }))
    }
    
  });
  socket.on('disconnect',() => {
    users.delete(socket.user);
    socket.broadcast.emit('broadcast',JSON.stringify({
      user:socket.user,
      type:'logout'
    }));
  })
})