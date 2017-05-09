const initState = {
  msgs: [],
  user: null,
  socket: null,
  room: {},
  onlines: [],
  userMsgs: {},
  roomMsgs: {},
}
export function chatReducer(state = initState, action) {
  switch (action.type) {
    case 'ADDMSG': {
      const msgs = [...state.msgs, action.msg];
      return Object.assign({}, state, { msgs });
    }
    case 'SETSOCKET': {
      if(state.user){
        action.socket.emit('login',state.user);
      }
      return Object.assign({}, state, { socket: action.socket });
    }
    case 'UPDATELOGININFO': {
      if(state.user && state.user.unread){
        action.info.unread = state.user.unread - 1;
      }
      return Object.assign({}, state, { user: action.info });
    }
    case 'UPDATEONLINES': {
      return Object.assign({}, state, { onlines: action.onlines });
    }
    case 'PRIVATEMSG': {
      const user = action.msg.user;
      let obj = {};
      if(!state.userMsgs[action.msg.token]){
        obj[action.msg.token] = [{msg: action.msg.msg, type:'msg' ,user ,date:new Date()}]
      }else{
        state.userMsgs[action.msg.token].push({msg: action.msg.msg, type:'msg' ,user ,date:new Date()});
        obj[action.msg.token] = state.userMsgs[action.msg.token]
      } 
      return Object.assign({}, state, {userMsgs: obj, newMessage:{type:'user', ...action.msg}});
    }
    case 'UNREADREDUCE':{
      const unread = state.user.unread - 1;
      const user = Object.assign({},state.user,{unread});
      return Object.assign({},state,{user});
    }
    default:
      return state;
  }
}
