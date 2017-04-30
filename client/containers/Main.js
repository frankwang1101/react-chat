import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Dropdown, Menu, Icon, Layout } from 'antd'
import { Link } from 'react-router'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions/actions'

require('../style/index.less')

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class App extends Component {
  constructor(args) {
    super(args)
    this.menuClick = this.menuClick.bind(this)
  }
  componentWillMount() {
    if(!this.props.user){
      this.props.checkJwt().then(() => {
         this.props.socket || this.props.init();  
      },() => {
        this.props.history.replace('/login')
      });
    }
  }
  componentDidMount() {
    
  }
  menuClick(item) {
    if (item) {
      switch (item.key) {
        case 'logout':
          this.props.logout();
          break;
        default:
          break;
      }
    }
  }
  render() {
    const { user } = this.props
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
              defaultSelectedKeys={['8']}
            >
              <SubMenu key="sub1" title={<span><Icon type="user" />好友</span>}>
                
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />群组</span>}>
                
              </SubMenu>
              <SubMenu key="sub3" title={<span><Icon type="notification" />个人中心</span>}>
                <Menu.Item key="9">搜索好友</Menu.Item>
                <Menu.Item key="10">创建群组</Menu.Item>
                <Menu.Item key="11">退出</Menu.Item>
              </SubMenu>
              <Menu.Item key="8">公共聊天室</Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content className="content">
              {this.props.children}
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
  const { user, socket } = state.chatReducer
  return { user, socket }
}

const mapActionToDispatch = (dispatch) => ({
  logout: () => dispatch(Actions.logout()),
  updateInfo: (info) => dispatch(Actions.updateInfo(info)),
  checkJwt: () => dispatch(Actions.checkJwt()),
  init: () => { dispatch(Actions.connectInit()) },
})

export default withRouter(connect(mapStateToProp, mapActionToDispatch)(App));
