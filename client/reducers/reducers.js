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
    case 'SETUSER': {
      return Object.assign({}, state, { user: action.user });
    }
    case 'SETSOCKET': {
      return Object.assign({}, state, { socket: action.socket });
    }
    default:
      return state;
  }
}
