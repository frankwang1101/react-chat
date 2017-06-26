const initState = {
  msgs: [],
  user: null,
  socket: null,
  room: {},
  onlines: [],
  userMsgs: {},
  roomMsgs: {},
  keys: [],
  socketNotice: { unique: parseInt(Math.random() * 10000) }
}
export function chatReducer(state = initState, action) {
  switch (action.type) {
    case 'ADDMSG': {
      const msgs = [...state.msgs, action.msg];
      return Object.assign({}, state, { msgs });
    }
    case 'SETSOCKET': {
      if (state.user) {
        action.socket.emit('login', state.user);
      }
      return Object.assign({}, state, { socket: action.socket });
    }
    case 'UPDATELOGININFO': {
      if (state.user && state.user.unread !== undefined) {
        action.info.unread = state.user.unread;
      }
      return Object.assign({}, state, { user: action.info });
    }
    case 'UPDATEONLINES': {
      return Object.assign({}, state, { onlines: action.onlines, keys: action.keys });
    }
    case 'PRIVATEMSG': {
      const user = action.msg.user;
      let obj = {};
      if (!state.userMsgs[action.msg.token]) {
        obj[action.msg.token] = [{ msg: action.msg.msg, type: 'msg', user, date: new Date() }]
      } else {
        state.userMsgs[action.msg.token].push({ msg: action.msg.msg, type: 'msg', user, date: new Date() });
        obj[action.msg.token] = state.userMsgs[action.msg.token]
      }
      return Object.assign({}, state, { userMsgs: obj, newMessage: { type: 'user', ...action.msg, show: false } });
    }
    case 'ROOMMSG': {
      const user = action.msg.from || {};
      let obj = {};
      if (!state.roomMsgs[action.msg.room._id]) {
        obj[action.msg.room._id] = [{ msg: action.msg.msg, type:action.msg.type || 'msg', user, date: new Date() }]
      } else {
        state.roomMsgs[action.msg.room._id].push({ msg: action.msg.msg, type:action.msg.type || 'msg', user, date: new Date() });
        obj[action.msg.room._id] = state.roomMsgs[action.msg.room._id]
      }
      const newMessage = action.notNeedNotice?state.newMessage:{ type: 'room', msg: action.msg.msg, _id: action.msg.room._id, roomname: action.msg.room.roomname, show: false };
      return Object.assign({}, state, { roomMsgs: obj, newMessage });
    }
    case 'UNREADREDUCE': {
      const unread = state.user.unread - 1;
      const user = Object.assign({}, state.user, { unread });
      return Object.assign({}, state, { user });
    }
    case 'UPDATEROOMLIST': {
      const rooms = state.user.rooms || [];
      rooms.push(action.room);
      const user = Object.assign({}, state.user, { rooms });
      return Object.assign({}, state, { user });
    }
    case 'FONTCHANGE': {
      return Object.assign({}, state, { font: action.font });
    }
    case 'ROOMAUTHCHANGE': {
      const { rid, mid, aid } = action;
      const rooms = state.user.rooms;
      const newRooms = rooms.map(v => {
        if (v._id === rid) {
          v.members = mid;
          v.administrators = aid;
        }
        return v;
      })
      const user = Object.assign({}, state.user, { rooms: newRooms });
      return Object.assign({}, state, { user });
    }
    case 'SOCKETNOTICE': {
      const data = action.data;
      data.unique = parseInt(Math.random() * 100000);
      data.roomId = data.data;
      let user = state.user;
      if (data.type === 'dismiss') {
        let rooms = state.user.rooms;
        let temp = [];
        rooms.forEach(v => {
          if (v._id !== action.id) {
            temp.push(v);
          }
        })
        user = Object.assign({}, state.user, { rooms: temp });
      }
      return Object.assign({}, state, { socketNotice: data, user });
    }
    case 'DISMISSROOM': {
      let rooms = state.user.rooms;
      let temp = [];
      rooms.forEach(v => {
        if (v._id !== action.id) {
          temp.push(v);
        }
      })
      const user = Object.assign({}, state.user, { rooms: temp });
      return Object.assign({}, state, { user });
    }
    case 'QUITGROUP': {
      let user = state.user;
      let rooms = state.user.rooms;
      let temp = [];
      rooms.forEach(v => {
        if (v._id !== action.rid) {
          temp.push(v);
        }
      })
      user = Object.assign({}, state.user, { rooms: temp });
      return Object.assign({}, state, { user });
    }
    default:
      return state;
  }
}
