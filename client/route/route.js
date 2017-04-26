import React from 'react'
import { Router, hashHistory, Route, IndexRoute, Switch } from 'react-router'
import { HashRouter  } from 'react-router-dom'
import Main from '../containers/Main'
import ChatRoom from '../containers/ChatRoom'
import Login from '../containers/Login'
import Signup from '../containers/Signup'

const match = ({ match }) => {
  console.log(match);
  return <Main><ChatRoom /></Main>;
}

export default function () {
  return (
    <div>
    <HashRouter>
      <div>
        <Route exact path="/" component={match} />
        <Route path="/room/:id" component={match} />
        <Route exact path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </div>
    </HashRouter >
    </div>
  )
}