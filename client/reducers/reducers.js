const initState = {
  msgs: [],
  user: null,
  socket: null,
  room: {},
  onlines: [],
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
      return Object.assign({}, state, { user: action.info });
    }
    case 'UPDATEONLINES': {
      return Object.assign({}, state, { onlines: action.onlines });
    }
    case 'PRIVATEMSG': {
      const user = action.msg.user;
      let obj = {};
      if(!state[action.msg.token]){
        obj[action.msg.token] = [{msg: action.msg.msg, type:'msg' ,user ,date:new Date()}]
      }else{
        state[action.msg.token].push({msg: action.msg.msg, type:'msg' ,user ,date:new Date()});
        obj[action.msg.token] = state[action.msg.id]
      } 
      return Object.assign({}, state, obj);
    }
    default:
      return state;
  }
}
