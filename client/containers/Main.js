import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Dropdown, Menu, Icon, Layout, Spin } from 'antd'
import { BrowserRouter as Router, Route, withRouter, Link } from 'react-router-dom'
import * as Actions from '../actions/actions'
import * as Utils from '../utils/utils'
import ChatRoom from '../containers/ChatRoom'
import LoadSearch from 'bundle-loader?lazy&name=chat-search!../containers/Search'
import LoadMessages from 'bundle-loader?lazy&name=chat-messages!../containers/Messages'
import LoadRoom from 'bundle-loader?lazy&name=chat-room!../containers/Room'
import Bundle from '../components/Bundle'
import * as DialogUtil from '../components/Dialog'
import AssignWin from '../containers/Assign'

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
    path: '/',
    exact: true,
    component: chatRoomMatch
  }, {
    path: '/user/:id',
    exact: false,
    component: chatRoomMatch
  }, {
    path: '/room/:id',
    exact: false,
    component: chatRoomMatch
  }, {
    path: '/search',
    exact: false,
    component: otherMatch
  }, {
    path: '/messages',
    exact: false,
    component: otherMatch
  }, {
    path: '/create_room',
    exact: false,
    component: otherMatch
  }
];

class App extends Component {
  constructor(args) {
    super(args)
    this.menuClick = this.menuClick.bind(this);
    this.menuRightClick = this.menuRightClick.bind(this);
    this.roomOperate = this.roomOperate.bind(this);
    this.openAssignWin = this.openAssignWin.bind(this);
    this.dealUserChange = this.dealUserChange.bind(this);
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
  openAssignWin(config) {
    DialogUtil.open(<AssignWin config={config} />);
  }
  dealUserChange(user,type,roomId,...args) {
    let ids = [];
    this.props.user.rooms.forEach(v => {
      if(v._id === roomId){
        ids = v.members.concat(v.administrators);
      }
    });
    if(type === 'auth'){
      const members = args[0].filter(v => {
        return !~user.indexOf(v.id)
      }).map(v => {
        return v.id
      });
      this.props.authManage(roomId,members,user).then(res => {
        if(!!res){
          DialogUtil.closeWin('[name=reactDialog]');
          Utils.sendMessage('success','管理权限成功!',1);
          Actions.emitMsg(this.props.socket, '权限修改','',members.concat(user),'person_change',roomId);
        }else{
          Utils.sendMessage('error','管理权限失败!',1);
        }
      });
    }else if(type === 'person'){
      Actions.addMembers(roomId,user)().then(res => {
        if(!!res){
          DialogUtil.closeWin('[name=reactDialog]');
          Utils.sendMessage('success','添加成员成功!',1);
          Actions.emitMsg(this.props.socket, '添加成员','',ids.concat(user),'person_change',roomId);
        }else{
          Utils.sendMessage('error','添加成员失败!',1);
        }
      });
    }
  }
  getUserData(type,...args){
    const room = args[0];
    if(type === 'person'){
      let ids = [room.owner].concat(room.members).concat(room.administrators);
      let arr =  this.props.user.friends.map(v => ({id:v._id,name:v.nickname,username:v.username,key:v._id}));
      arr = arr.filter(v => {
        return !!!~ids.indexOf(v.id);
      })
      return arr;
    }
  }
  roomOperate(type, room) {
    switch (type) {
      case 'person':{
        const config = {
          width: '500px',
          height: '300px',
          title: '成员添加',
          roomId:room._id,
          type,
          cb: this.dealUserChange,
          getData: () => {
            return new Promise((res) => {
              const datas = this.getUserData(type, room);
              res({datas:datas,targets:[]});
            })
          }
        }
        this.openAssignWin(config);
        break;
      }
      case 'auth': {
        const config = {
          width: '500px',
          height: '300px',
          title: '群组权限管理',
          roomId:room._id,
          type,
          cb: this.dealUserChange,
          getData: () => {
            return new Promise((res, rej) => {
              this.props.getRoom(room._id)
                .then(room => {
                  if(room){
                    const members = room.members.map(v => ({id:v._id,name:v.nickname,username:v.username,key:v._id}));
                    const admins = room.administrators.map(v => ({id:v._id,name:v.nickname,username:v.username,key:v._id}));
                    res({datas:members.concat(admins),targets:admins.map(v => v.id)});
                  }else{
                    rej(false);
                  }
                })
            });
          },
        }
        this.openAssignWin(config);
        break;
      }
      case 'dismiss': {
        const ids = room.members.concat(room.administrators);
        this.props.dismissRoom(room._id).then(res => {
          if(res){
            Utils.sendMessage('success','解散群组成功',1,() => {
              Actions.emitMsg(this.props.socket, `群${room.roomname}已被群主解散`,'',ids,'room_dismiss',room._id);
            });
          }else{
            Utils.sendMessage('success','解散群组失败',1);
          }
        });
        break;
      }
      case 'view': {
          
      }
      case 'exit': {
        const ids = [room.owner].concat(room.member.filter(v => v !== this.props.user._id)).concat(room.administrators.filter(v => v !== this.props.user._id));
        this.props.quitRoom(room._id).then(rid => {
          Actions.emitMsg(this.props.socket, `${this.props.user.nickname}退出了聊天室`,'',ids,'person_quit',roomId);
        });
      }
    }
  }
  menuRightClick(...args) {
    const event = args[0];
    const flag = args[1];
    const room = args[2];
    event.preventDefault();
    event.stopPropagation();
    const itemArr = [
      <li onClick={() => this.roomOperate('person', room)} key={'right_menu_person'} className="context-menu-item">人员管理</li>,
      <li onClick={() => this.roomOperate('auth', room)} key={'right_menu_auth'} className="context-menu-item">权限管理</li>,
      <li onClick={() => this.roomOperate('dismiss', room)} key={'right_menu_dismiss'} className="context-menu-item">解散该群</li>,
      <li onClick={() => this.roomOperate('view', room)} key={'right_menu_view'} className="context-menu-item">查看资料</li>,
      <li onClick={() => this.roomOperate('exit', room)} key={'right_menu_exit'} className="context-menu-item">退出该群</li>,
    ];
    let pos = {
      top: event.clientY,
      left: event.clientX,
      position: 'absolute'
    };
    const closeWinFunc = (event) => {
      event.preventDefault();
      event.stopPropagation();
      DialogUtil.closeWin('.context-modal')
    };
    const bgProps = {
      onClick: closeWinFunc,
      onContextMenu: closeWinFunc,
    }
    const contextMenu = (
      <div className="context-background" {...bgProps}>
        <ul className="context-menu" style={pos}>
          {flag ? itemArr.slice(0, 4) : itemArr.slice(3)}
        </ul>
      </div>
    );
    DialogUtil.rightClickMenu(contextMenu);
  }
  render() {
    const { user } = this.props
    let friends = null;
    if (user && user.friends) {
      friends = user.friends.map(v => <Menu.Item key={`menu_user_${v._id}`} ><Link to={`/user/${v._id}`}>{v.nickname}</Link></Menu.Item>);
    }
    let rooms = null;
    if (user && user.rooms) {
      rooms = user.rooms.map(v => <Menu.Item key={`menu_room_${v._id}`} ><Link onContextMenu={(e) => { this.menuRightClick(e, (v.owner === user._id) ? true : false, v )}} to={`/room/${v._id}`}>{v.roomname}</Link></Menu.Item>);
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
                  routes.map((route, index) => (
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
  getRoom: (id) => dispatch(Actions.getRoom(id)),
  dismissRoom: (roomId) => dispatch(Actions.dismissRoom(roomId)),
  quitRoom: (roomId) => dispatch(Actions.quitRoom(roomId)),
  authManage: (rid, uids, adminids) => dispatch(Actions.authManage(rid, uids, adminids)),
})

export default withRouter(connect(mapStateToProp, mapActionToDispatch)(App));
