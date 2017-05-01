import io from 'socket.io-client'
import {notification, Button, message} from 'antd'
import config from '../config/config'

const openNotification = (id, from, dispatch) => {
  const key = `open${Date.now()}`;
  const btnClick = function (flag) {
    if (flag) {
      dispatch(addApply(id, from._id)).then( res => {
        if(res === true){
          message.success('添加好友成功', 1);
        }else{
          message.error('添加好友失败', 1);
        }
      })
    }
    notification.close(key);
  };
  const btn = (
    <div>
      <Button type="primary" size="small" onClick={ () => btnClick(true) }>
        Confirm
      </Button>
      <Button type="primary" size="small" onClick={ () => btnClick(false) }>
        Refuse
      </Button>
    </div>
  );
  notification.open({
    message: 'Friend Apply',
    description: `${from.nickname} want to become ur friend`,
    btn,
    key,
  });
};

export function connectInit(dispatch) {
  return (dispatch) => {
    const socket = io.connect();
    console.log('开始设置socket');
    dispatch({ type: 'SETSOCKET', socket: socket });
    console.log('设置socket结束');
    socket.on('broadcast', (res) => {
      const json = JSON.parse(res);
      dispatch({ type: 'ADDMSG', msg: json });
    });
    socket.on('login', (res) => {
      const json = JSON.parse(res);
      if (json.type === 'exist') {
        alert('用户名已存在!');
      } else {
        socket.uid = json.user._id;
        dispatch({ type: 'SETUSER', user: json.user });
      }
    });
    socket.on('statistic', (users) => {
      const res = JSON.parse(users);
      dispatch({ type: 'UPDATEONLINES', onlines: res.users });
    });
    socket.on('notification', (result) => {
      const res = JSON.stringify(result);
      if (res.type === 'apply') {
        openNotification(dispatch);
      } else {
        dispatch({ type: 'PRIVATEMSG', msg:{ user: res.from,token: res.token, msg: res.msg}});
      }
    })
  }
}

export function emitMsg(socket, msg, user, target) {
  if (!target) {
    socket.emit('msg', JSON.stringify({
      user,
      msg,
    }));
  } else {
    socket.emit('targetMsg', JSON.stringify({
      user,
      msg,
      id: target._id
    }));
  }
}

export function getRoom(id) {
  return async dispatch => {
    const k = await new Promise((r) => {
      console.log('lg4j');
      r('asslk');
    }, 3000)
    console.log(k);
    return 'false';
  }
}

export function getUser(id) {
  return async dispatch => {
    const json = await fetch(`${config.url}${config.search}/${id}`);
    const result = await json.json();
    if (result.success === true) {
      return result.user;
    } else {
      return false;
    }
  }
}

export function search(keyword) {
  return async dispatch => {
    const json = await fetch(`${config.url}${config.search}`, {
      method: 'post',
      body: keyword,
    });
    const result = await json.json();
    if (result.success === true) {
      return result.userResult;
    } else {
      return false;
    }
  }
}

export function addApply(id, fid) {
  return async dispatch => {
    const token = localStorage.getItem('chat-token');
    if (!token) {
      return false;
    } else {
      const headers = new Headers({ Authrorization: token });
      const json = await fetch(`${config.url}${config.addFriend}`, {
        method: 'post',
        body: JSON.stringify({ tid: id, fid: fid }),
        headers,
      });
      const result = await json.json();
      if (result.success === true) {
        const user = await getUser(fid)(dispatch);
        if (user !== false) {
          dispatch({ type: 'UPDATELOGININFO', info: user })
        }
        return true;
      } else {
        return false;
      }
    }
  }
}

export function checkJwt() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('chat-token');
      if (!token) {
        reject();
      } else {
        const headers = new Headers({ Authrorization: token });
        fetch(`${config.url}${config.jwt}`, {
          method: 'get',
          headers,
        })
          .then(res => res.json()).then(result => {
            if (result.success === true) {
              localStorage.setItem('token', result.token);
              console.log('开始分发info');
              dispatch({ type: 'UPDATELOGININFO', info: result.info })
              console.log('分发info结束');
              resolve();
            } else {
              localStorage.removeItem('token');
              reject();
            }
          })
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
