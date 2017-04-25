import {Router, hashHistory, Route} from 'react-router'
import { HashRouter } from 'react-router-dom'
import Main from '../containers/Main'
import ChatRoom from '../containers/ChatRoom'

export default (
  <HashRouter>
    <Route path="/" component={Main}>
      <IndexRoute component={ChatRoom} />
    </Route>
    {/*<Route path="/login" component={Login} />*/}
    {/*<Route path="/signup" component={Login} />*/}
  </HashRouter>
)
