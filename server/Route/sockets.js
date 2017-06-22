const socketIo = require('socket.io');
const Message = require('../Model/Message')
const User = require('../Model/User')

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
      User.setOnline(user._id, true);
      io.sockets.emit('broadcast', JSON.stringify({
        user: user,
        date: new Date(),
        type
      }))
      const usersArr = [...users].map((v, i) => {
        return v[1].user;
      })
      io.sockets.emit('statistic', JSON.stringify({
        users: usersArr,
        keys: users.keys(),
      }))
    });
    socket.on('disconnect', () => {
      if (socket.user) {
        User.setOnline(socket.user._id, false);
        users.delete(socket.user._id);
        socket.broadcast.emit('broadcast', JSON.stringify({
          user: socket.user,
          type: 'logout'
        }));
      }
      const usersArr = [...users].map((v, i) => {
        return v[1].user;
      })
      socket.broadcast.emit('statistic', JSON.stringify({
        users: usersArr,
      }))
    })
    socket.on('groupMsg', (obj) => {
      try {
        const params = JSON.parse(obj);
        let msOption = {};
        let emitData = {};
        switch (params.type) {
          case 'becomeMember': {
            emitData = {
              type: 'becomeMember',
              _id: params._id,
              roomname: params.roomname,
            };
            msOption = {
              title: '加入群组',
              content: `您已经成为群组 ${params.roomname} 的成员`,
              type: 'becomeMember',
            };
            break;
          }
          case 'dismiss': {
            emitData = {
              type: params.type,
              data:params.room,
              msg:params.msg
            }
            msOption = {
              title: '群组解散',
              content: params.msg,
              type: 'dismiss',
              data: params.room,
            }
            break;
          }
          case 'person_change': {
            emitData = {
              type: params.type,
              data:params.room
            }

            break;
          }
          case 'msg':
          default: {
            emitData = {
              type: 'roomMsg',
              msg: params.msg,
              from: params.from,
              room: params.room,
            };
            msOption = {
              title: '',
              content: params.msg,
              type: 'roomMsg',
              data: JSON.stringify({
                user: {
                  _id: params.from._id,
                  username: params.from.username,
                  nickname: params.from.nickname,
                  avatar: params.from.avatar,
                },
                room: {
                  _id: params.room._id,
                  roomname: params.room.roomname,
                }, date: Date.now()
              }),
            };
            break;
          }
        }
        params.ids.forEach((v) => {
          let isDeal = false;
          if (users.has(v)) {
            isDeal = true;
            users.get(v).emit('notification', JSON.stringify(emitData));
          }
          Object.assign(msOption, { isDeal, toUser: v });
          if (!isDeal || params.type === 'becomeMember' || params.type === 'dismiss'){
            Message.create(msOption);
          }
        })
      } catch (e) {
        console.log(e);
      }
    })
    socket.on('targetMsg', (obj) => {
      try {
        const param = JSON.parse(obj);
        console.log(param);
        let sendData = {};
        switch (param.type) {
          case 'apply':
            sendData = { type: param.type, from: param.user };
            break;
          case 'msg':
          default:
            sendData = { type: param.type, from: param.user, msg: param.msg };
            break;
        }
        let isDeal = false;
        if (users.has(param.id)) {
          //在线，则发送即时消息
          const t_socket = users.get(param.id);
          if (param.type === 'msg') {
            socket.emit('notification', JSON.stringify(Object.assign({}, sendData, { token: param.id })));
          }
          t_socket.emit('notification', JSON.stringify(Object.assign({}, sendData, { token: socket.user._id })));
          isDeal = true;
        }
        //保存message
        if (param.type === 'apply') {
          Message.create({
            title: '好友申请',
            content: `${param.user.nickname}想要添加你为好友`,
            type: 'friendApply',
            isDeal,
            data: JSON.stringify(param.user),
            toUser: param.id,
          })
        } else if (param.type === 'msg') {
          Message.create({
            title: '',
            content: param.msg,
            type: 'msg',
            data: JSON.stringify({ user: param.user, date: Date.now() }),
            toUser: param.id,
            isDeal,
          })
        }
      } catch (e) {
        console.log(e);
      }
    })
  })
}