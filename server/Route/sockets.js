const socketIo = require('socket.io');
const Message = require('../Model/Message')

module.exports = function (server) {
  const io = socketIo.listen(server);
  const users = new Map();
  io.on('connection', (socket) => {
    socket.on('msg', (data) => {
      const json = JSON.parse(data);
      io.sockets.emit('broadcast', JSON.stringify({
        user: json.user,
        msg: json.msg,
        date: new Date(),
        type: 'msg'
      }))
    });
    socket.on('login', (user) => {
      const type = 'login';
      socket.user = user;
      users.set(user._id, socket);
      io.sockets.emit('broadcast', JSON.stringify({
        user: user.nickname,
        date: new Date(),
        type
      }))
      const usersArr = [...users].map((v,i) => {
        return v[1].user;
      })
      io.sockets.emit('statistic',JSON.stringify({
        users: usersArr,
      }))
    });
    socket.on('disconnect', () => {
      if(socket.user){
        users.delete(socket.user._id);
        socket.broadcast.emit('broadcast', JSON.stringify({
          user: socket.user.nickname,
          type: 'logout'
        }));
      }
      const usersArr = [...users].map((v,i) => {
        return v[1].user;
      })
      socket.broadcast.emit('statistic',JSON.stringify({
        users: usersArr,
      }))
    })
    socket.on('targetMsg', (obj) => {
      try{
        const param = JSON.parse(obj);
        console.log(param);
        let sendData = {};
        switch(param.type){
          case 'apply':
            sendData = { type: param.type, from: param.user};
            break;
          case 'msg':
          default:
            sendData = { type: param.type, from: param.user, msg: param.msg};
            break;
        }
        if(users.has(param.id)){
          //在线，则发送即时消息
          const t_socket = users.get(param.id);
          if(param.type === 'msg'){
            socket.emit('notification', JSON.stringify(Object.assign({}, sendData, { token:param.id })));
          }
          t_socket.emit('notification', JSON.stringify(Object.assign({}, sendData, { token:socket.user._id })));
        }else{
          //离线，保存一下message
          if(param.type === 'apply'){
            Message.create({
              title: '好友申请',
              content: `${param.user.nickname}想要添加你为好友`,
              type: 'friendApply',
              isDeal: false,
              data: JSON.stringify(param.user),
              toUser: param.id,
            })
          }else{
            Message.create({
              title: '',
              content: param.msg,
              type: 'msg',
              data: new Date().toString(),
              toUser: param.id,
              isDeal: false,
            })
          }
        }
      }catch(e){
        console.log(e);
      }
    })
  })
}