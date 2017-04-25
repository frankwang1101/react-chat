import io from 'socket.io-client'

export function connectInit(dispatch){
  return (dispatch) => {
    const socket = io.connect();
    dispatch({type: 'SETSOCKET', socket: socket});
    socket.on('broadcast',(res) => {
      const json = JSON.parse(res);
      dispatch({type: 'ADDMSG', msg: json});
    });
    socket.on('login',(res) => {
      const json = JSON.parse(res);
      if(json.type === 'exist'){
        alert('用户名已存在!');
      }else{
        dispatch({type: 'SETUSER', user: json.user});
      }
    })
  }
}

export function emitMsg(socket, msg, user){
  socket.emit('msg', JSON.stringify({
    user,
    msg,
  }));
}

export function checkJwt(){
  
}