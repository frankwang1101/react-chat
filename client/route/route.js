import React from 'react'
import { HashRouter as Router, hashHistory, Route, IndexRoute, Switch } from 'react-router-dom'
import Main from '../containers/Main'
import Login from '../containers/Login'
import Signup from '../containers/Signup'



export default function () {
  return (
    <Router>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup} />
        <Route path='/' component={Main} />
      </Switch>
    </Router>
  )
}