import React from 'react'
import { Router, hashHistory, Route, IndexRoute, Switch } from 'react-router'
import { HashRouter } from 'react-router-dom'
import Main from '../containers/Main'
import ChatRoom from '../containers/ChatRoom'
import Login from '../containers/Login'
import Signup from '../containers/Signup'
import Search from '../containers/Search'
import Create from '../containers/Create'

const match = ({ match }) => {
  let type = "public";
  if (match.path === '/room/:id') {
    type = 'room';
  } else if (match.path === '/user/:id') {
    type = 'user';
  }
  return <Main><ChatRoom params={match.params} type={type} /></Main>;
}

const find = ({ match }) => {
  if (match.path === '/search') {
    return <Main><Search /></Main>
  } else if (match.path === '/create') {
    return <Main><Create /></Main>
  }
}

export default function () {
  return (
    <div>
      <HashRouter>
        <div>
          <Route exact path="/" component={match} />
          <Route path="/room/:id" component={match} />
          <Route path="/user/:id" component={match} />
          <Route path="/search" component={find} />
          <Route path="/create" component={find} />
          <Route exact path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </div>
      </HashRouter >
    </div>
  )
}