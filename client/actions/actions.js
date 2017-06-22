import io from 'socket.io-client'
import { notification, Button, message } from 'antd'
import config from '../config/config'
import * as utils from '../utils/utils'


export function connectInit(dispatch) {
  return (dispatch, getState) => {
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
      dispatch({ type: 'UPDATEONLINES', onlines: res.users, keys: res.keys });
    });
    socket.on('notification', (result) => {
      const res = JSON.parse(result);
      if (res.type === 'apply') {
        utils.openAddNotification(res.token, res.from, dispatch);
      } else if (res.type === 'msg') {
        dispatch({ type: 'PRIVATEMSG', msg: { user: res.from, token: res.token, msg: res.msg } });
      } else if (res.type === 'accept') {
        let option = {};
        if (res.msg) {
          option = {
            message: '返回信息',
            description: `${res.from.nickname}同意添加你为好友!`,
          }
        } else {
          option = {
            message: '返回信息',
            description: `${res.from.nickname}拒绝添加你为好友!`,
          }
        }
        notification.open(option);
      } else if (res.type === 'becomeMember') {
        const option = {
          message: '群组信息',
          description: `您已成为群组${res.roomname}的一员`,
        }
        notification.open(option);
        dispatch({ type: 'UPDATEROOMLIST', room: { _id: res._id, roomname: res.roomname } });
      } else if (res.type === 'roomMsg') {
        dispatch({ type: 'ROOMMSG', msg: { msg: res.msg, room: res.room, from: res.from } });
      }else if (res.type === 'dismiss' || res.type === 'person_change') {
        dispatch({type:'SOCKETNOTICE',data:res});
      }
    });
  }
}

export function emitMsg(socket, msg, user, target, type, room, font) {
  if (type === 'public') {
    socket.emit('msg', JSON.stringify({
      user,
      msg,
    }));
  } else if (type === 'user') {
    socket.emit('targetMsg', JSON.stringify({
      user,
      msg,
      id: target._id,
      type: 'msg',
    }));
  } else if (type === 'room') {
    socket.emit('groupMsg', JSON.stringify({
      ids: target,
      msg,
      type: 'msg',
      from: user,
      room,
    }));
  }else if(type === 'room_dismiss'){
    socket.emit('groupMsg', JSON.stringify({
      ids: target,
      msg,
      type: 'dismiss',
      from: user,
      room,
    }));
  }else if(type === 'person_change'){
    socket.emit('groupMsg', JSON.stringify({
      ids: target,
      msg,
      type: 'person_change',
      from: user,
      room,
    }));
  }
}

export function getRoom(id) {
  return async dispatch => {
    try {
      const json = await fetch(`${config.url}${config.getRoom}/${id}`);
      const result = await json.json();
      if (result.success === true) {
        return result.room;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export function logout() {
  return async dispatch => {
    localStorage.removeItem('chat-token');
    dispatch({ type: 'UPDATELOGININFO', info: {} });
    return true;
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
              let font = localStorage.getItem('reactChatFont');
              if (!font) {
                font = null;
              }
              result.info.font = JSON.parse(font);
              dispatch({ type: 'UPDATELOGININFO', info: result.info })
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
          dispatch({ type: 'UPDATELOGININFO', info: result.info });
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

export function getMessages(id) {
  return async dispatch => {
    const token = localStorage.getItem('chat-token');
    if (!token) {
      return false;
    } else {
      const headers = new Headers({ Authrorization: token });
      const json = await fetch(`${config.url}${config.getMessages}/${id}`, {
        headers
      });
      const result = await json.json();
      if (result.success === true) {
        return result;
      } else {
        return { success: false };
      }
    }
  }
}

export function dealMessage(id) {
  return async dispatch => {
    const token = localStorage.getItem('chat-token');
    if (!token) {
      return false;
    } else {
      const headers = new Headers({ Authrorization: token });
      const json = await fetch(`${config.url}${config.dealMessages}/${id}`, {
        headers
      });
      const result = await json.json();
      if (result.success === true) {
        dispatch({ type: 'UNREADREDUCE' });
        return result;
      } else {
        return { success: false };
      }
    }
  }
}

export function addRoom(data) {
  return async dispatch => {
    const token = localStorage.getItem('chat-token');
    if (!token) {
      return false;
    } else {
      const headers = new Headers({ Authrorization: token });
      const json = await fetch(`${config.url}${config.create_room}`, {
        method: 'post',
        headers,
        body: JSON.stringify(data),
      });
      const result = await json.json();
      if (result.success === true) {
        const room = result.room;
        dispatch({ type: 'UPDATEROOMLIST', room });
        room.ids = data.roomInfo.members;
        return room;
      } else {
        return false;
      }
    }
  }
}
export function notificateMember(socket, room, ids) {
  socket.emit('groupMsg', JSON.stringify(
    {
      ids,
      _id: room._id,
      roomname: room.roomname,
      type: 'becomeMember',
    }
  ))
}
export function removeRoomMember(data) {
  return async dispatch => {
    const token = localStorage.getItem('chat-token');
    if (!token) {
      return false;
    } else {
      const headers = new Headers({ Authrorization: token });
      const json = await fetch(`${config.url}${config.remove_member}`, {
        headers,
        body: JSON.stringify(data),
      });
      const result = await json.json();
      if (result.success === true) {
        //todo
        return true;
      } else {
        return false;
      }
    }
  }
}

export function fontChange(font) {
  return dispatch => {
    localStorage.removeItem('reactChatFont');
    localStorage.setItem('reactChatFont', JSON.stringify(font));
    dispatch({ type: 'FONTCHANGE', font: font });
  }
}

export function addMembers(roomId, ids) {
  return async dispatch => {
    const token = localStorage.getItem('chat-token');
    if (!token) {
      return false;
    } else {
      const data = { roomId, ids };
      const headers = new Headers({ Authrorization: token });
      const json = await fetch(`${config.url}${config.add_member}`, {
        headers,
        method:'post',
        body: JSON.stringify(data),
      });
      const result = await json.json();
      if (result.success === true) {
        //todo
        return true;
      } else {
        return false;
      }
    }
  }
}

export function authManage(roomId, ids, adminIds) {
  return async dispatch => {
    const token = localStorage.getItem('chat-token');
    if (!token) {
      return false;
    } else {
      const data = { roomId, ids, adminIds };
      const headers = new Headers({ Authrorization: token });
      const json = await fetch(`${config.url}${config.auth_manage}`, {
        headers,
        method:'post',
        body: JSON.stringify(data),
      });
      const result = await json.json();
      if (result.success === true) {
        dispatch({type:'ROOMAUTHCHANGE', rid:roomId, mid:ids, aid:adminIds});
        return true;
      } else {
        return false;
      }
    }
  }
}

export function dismissRoom(rid) {
  return async dispatch => {
    const token = localStorage.getItem('chat-token');
    if (!token) {
      return false;
    } else {
      const headers = new Headers({ Authrorization: token });
      const json = await fetch(`${config.url}${config.dismissRoom}/${rid}`, {
        headers,
      });
      const result = await json.json();
      if (result.success === true) {
        dispatch({type:'DISMISSROOM',id:rid});
        return rid;
      } else {
        return false;
      }
    }
  }
}

export function quitRoom(rid) {
  return async dispatch => {
    const token = localStorage.getItem('chat-token');
    if (!token) {
      return false;
    } else {
      const headers = new Headers({ Authrorization: token });
      const json = await fetch(`${config.url}${config.quitRoom}/${rid}`, {
        headers,
      });
      const result = await json.json();
      if (result.success === true) {
        //todo
        return rid;
      } else {
        return false;
      }
    }
  }
}
