import io from 'socket.io-client'
import config from '../config/config'

export function connectInit(dispatch) {
  return (dispatch) => {
    const socket = io.connect();
    dispatch({ type: 'SETSOCKET', socket: socket });
    socket.on('broadcast', (res) => {
      const json = JSON.parse(res);
      dispatch({ type: 'ADDMSG', msg: json });
    });
    socket.on('login', (res) => {
      const json = JSON.parse(res);
      if (json.type === 'exist') {
        alert('用户名已存在!');
      } else {
        dispatch({ type: 'SETUSER', user: json.user });
      }
    })
  }
}

export function emitMsg(socket, msg, user) {
  socket.emit('msg', JSON.stringify({
    user,
    msg,
  }));
}

export function checkJwt() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('chat-token');
      if (!token) {
        reject();
      } else {
        const headers = new Headers({ Authrorization: token });
        fetch(`${config.url}${config.jwt}`,{
          method: 'get',
          headers,
        })
        .then(res => res.json()).then(result => {
          if (result.success === true) {
            localStorage.setItem('token', result.token);
            dispatch({ type: 'UPDATELOGININFO', info:result.info })
            resolve();
          } else {
            localStorage.removeItem('token');
            reject();
          }
        })
        resolve(token);
      }
    })
  }
}

export function login(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      fetch(`${config.url}${config.login}`, {
        method: 'post',
        body: JSON.stringify(data),
      }).then(res => res.json()).then(result => {
        if (result.success === true) {
          const token = result.info.token;
          localStorage.setItem('chat-token', token);
          dispatch({ type: 'USERLOGIN', data: result.info });
          connectInit(dispatch);
          resolve();
        } else {
          reject(result.msg);
        }
      }).catch((e) => {
        reject(e);
      })
    })
  }
}

export function register(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      fetch(`${config.url}${config.signup}`, {
        method: 'post',
        body: JSON.stringify(data),
      }).then(res => res.json()).then(result => {
        if (result.success === true) {
          resolve();
        } else {
          reject();
        }
      }).catch(() => {
        reject();
      })
    });
  }
}
