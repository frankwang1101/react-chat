import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import ChatRoom from './containers/ChatRoom'
import * as reducers from './reducers/reducers'

let store = createStore(combineReducers(reducers), applyMiddleware(thunk));

render(<Provider store={store}><ChatRoom /></Provider>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
