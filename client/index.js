import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from './reducers/reducers'
import Router from './route/route'
import './style/index.less'

let store = createStore(combineReducers(reducers), applyMiddleware(thunk));

render(<Provider store={store}><Router /></Provider>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
