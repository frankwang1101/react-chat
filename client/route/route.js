import React from 'react'
import { HashRouter as Router, hashHistory, Route, IndexRoute, Switch } from 'react-router-dom'
import Main from '../containers/Main'
import Bundle from '../components/Bundle'
import LoadLogin from 'bundle-loader?lazy&name=chat-login!../containers/Login'
import LoadSignup from 'bundle-loader?lazy&name=chat-signup!../containers/Signup'

const Login = () => (
  <Bundle load={LoadLogin}>
    {(Login) =>　<Login />}
  </Bundle>
)

const Signup = () => (
  <Bundle load={LoadSignup}>
    {(Signup) =>　<Signup />}
  </Bundle>
)

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