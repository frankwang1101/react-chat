import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Dropdown, Menu, Icon, Layout, Spin } from 'antd'
import {  BrowserRouter as Router, Route, withRouter, Link } from 'react-router-dom'
import * as Actions from '../actions/actions'
import * as Utils from '../utils/utils'
import ChatRoom from '../containers/ChatRoom'
import LoadSearch from 'bundle-loader?lazy&name=chat-search!../containers/Search'
import LoadMessages from 'bundle-loader?lazy&name=chat-messages!../containers/Messages'
import LoadRoom from 'bundle-loader?lazy&name=chat-room!../containers/Room'
import Bundle from '../components/Bundle'

require('../style/index.less')

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Search = () => (
  <Bundle load={LoadSearch}>
    {(Search) => <Search></Search>}
  </Bundle>
)

const Messages = () => (
  <Bundle load={LoadMessages}>
    {(Messages) => <Messages></Messages>}
  </Bundle>
)

const Room = () => (
  <Bundle load={LoadRoom}>
    {(Room) => <Room></Room>}
  </Bundle>
)

const otherMatch = ({ match }) => {
  if (match.path === '/search') {
    return <Search />
  } else if (match.path === '/messages') {
    return <Messages />
  } else if (match.path === '/create_room') {
    return <Room />
  }
}

const chatRoomMatch = ({ match }) => {
  let type = "public";
  if (match.path === '/room/:id') {
    type = 'room';
  } else if (match.path === '/user/:id') {
    type = 'user';
  }
  return <ChatRoom params={match.params} type={type} />;
}

const routes = [
      {
        path:'/',
        exact:true,
        component:chatRoomMatch
      },{
        path:'/user/:id',
        exact:false,
        component:chatRoomMatch
      },{
        path:'/room/:id',
        exact:false,
        component:chatRoomMatch
      },{
        path:'/search',
        exact:false,
        component:otherMatch
      },{
        path:'/messages',
        exact:false,
        component:otherMatch
      },{
        path:'/create_room',
        exact:false,
        component:otherMatch
      }
    ];

class App extends Component {
  constructor(args) {
    super(args)
    this.menuClick = this.menuClick.bind(this)
  }
  componentWillMount() {
    console.log('will');
    if (!this.props.user) {
      this.props.checkJwt().then(() => {
        this.props.socket || this.props.init();
      }, () => {
        this.props.history.replace('/login')
      });
    }
  }
  componentDidMount() {
  }
  componentWillReceiveProps(next) {
    if (!this.props.user && next.user) {
      if (next.user.unread > 0) {
        Notification.requestPermission(function (status) {
          var n = new Notification('未读消息', { body: `您有${next.user.unread}条消息未读!` });
        });
      }
    }
    if (next.newMessage) {
      if (next.newMessage.type === 'user') {
        if (next.newMessage.user._id === this.props.user._id) {
          next.newMessage.show = true;
        }
        if (!~this.props.location.pathname.indexOf(`/${next.newMessage.type}/`) && !next.newMessage.show) {
          next.newMessage.show = true;
          Utils.openNotification(next.newMessage, this.props.history);
        }
      } else if (next.newMessage.type === 'room') {
        if (!~this.props.location.pathname.indexOf(`/${next.newMessage.type}/${next.newMessage._id}`) && !next.newMessage.show) {
          next.newMessage.show = true;
          Utils.openNotification(next.newMessage, this.props.history);
        } else {
          next.newMessage.show = true;
        }
      }
    }
  }
  menuClick(item) {
    if (item) {
      switch (item.key) {
        case 'logout':
          this.props.logout().then(() => {
            this.props.history.push('/login');
          });
          break;
        default:
          break;
      }
    }
  }
  render() {
    const { user } = this.props
    let friends = null;
    if (user && user.friends) {
      friends = user.friends.map(v => <Menu.Item key={`menu_user_${v._id}`} ><Link to={`/user/${v._id}`}>{v.nickname}</Link></Menu.Item>);
    }
    let rooms = null;
    if (user && user.rooms) {
      rooms = user.rooms.map(v => <Menu.Item key={`menu_room_${v._id}`} ><Link to={`/room/${v._id}`}>{v.roomname}</Link></Menu.Item>);
    }
    let defaultSelectedKeys = ['public'];
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              style={{ height: '100%' }}
              theme={'dark'}
              defaultSelectedKeys={defaultSelectedKeys}
              onClick={this.menuClick}
            >
              <SubMenu key="user" title={<span><Icon type="user" />好友</span>}>
                {
                  friends
                }
              </SubMenu>
              <SubMenu key="room" title={<span><Icon type="laptop" />群组</span>}>
                {
                  rooms
                }
              </SubMenu>
              <SubMenu key="center" title={<span><Icon type="notification" />个人中心</span>}>
                <Menu.Item key="search"><Link to="/search" >搜索好友</Link></Menu.Item>
                <Menu.Item key="create_room"><Link to="/create_room" >创建群组</Link></Menu.Item>
                <Menu.Item key="message"><Link to="/messages">消息中心({user ? user.unread : 0})</Link></Menu.Item>
                <Menu.Item key="logout">退出</Menu.Item>
              </SubMenu>
              <Menu.Item key="public"><Link to="/" >公共聊天室</Link></Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content className="content">
              {<Spin spinning={this.props.user ? false : true}>
                {
                  routes.map( (route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      exact={route.exact}
                      component={route.component}
                    />
                  ))
                }
              </Spin>}
            </Content>
          </Layout>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>
          Created by FrankWang
        </Footer>
      </Layout>

    );
  }
}

const mapStateToProp = (state) => {
  const { user, socket, newMessage } = state.chatReducer
  return { user, socket, newMessage }
}

const mapActionToDispatch = (dispatch) => ({
  logout: () => dispatch(Actions.logout()),
  updateInfo: (info) => dispatch(Actions.updateInfo(info)),
  checkJwt: () => dispatch(Actions.checkJwt()),
  init: () => { dispatch(Actions.connectInit()) },
})

export default withRouter(connect(mapStateToProp, mapActionToDispatch)(App));
