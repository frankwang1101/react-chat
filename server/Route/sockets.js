const socketIo = require('socket.io');

module.exports = function(server){
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
}