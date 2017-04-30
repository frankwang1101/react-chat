const socketIo = require('socket.io');

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
  })
}