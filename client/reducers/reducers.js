const initState = {
  msgs: [],
  user: null,
  socket: null,
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
      if(state.socket){
        state.socket.emit('login',action.info);
      }
      return Object.assign({}, state, { user: action.info });
    }
    default:
      return state;
  }
}
