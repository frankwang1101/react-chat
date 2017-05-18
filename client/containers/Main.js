import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Dropdown, Menu, Icon, Layout, Spin } from 'antd'
import {  BrowserRouter as Router, Route, withRouter, Link } from 'react-router-dom'
import * as Actions from '../actions/actions'
import * as Utils from '../utils/utils'

require('../style/index.less')

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

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
    switch (/^\/([^\/]+)\/\w+$/.exec(this.match.path)[0]) {
      default:
        break;
    }
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
