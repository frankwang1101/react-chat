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
    if(!this.props.userInfo){
      this.props.checkJwt().then(null,() => {
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
    const { userInfo } = this.props
    let menuList = [];
    if (userInfo) {
      menuList = [
        { path: "/", text: "Home Page" },
        { path: `/my/${userInfo._id}`, text: "My Page" },
        { path: "/post", text: "Add Post" },
        { text: "Logout", method: "logout" },
      ]
    } else {
      menuList = [
        { path: "/", text: "Home" },
        { path: "/add", text: "SignUp" },
        { path: "/login", text: "Login" },
      ]
    }
    const menu = (
      <Menu onClick={this.menuClick}>
        {
          menuList.map((v) => {
            let result;
            if (v.path) {
              result = <Menu.Item key={`header${v.text}`}>{v.text}</Menu.Item>
            } else {
              result = <Menu.Item key={v.method} >{v.text}</Menu.Item>
            }
            return result;
          })
        }
      </Menu>
    )

    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Dropdown overlay={menu} className="header-dropdown">
            <a className="ant-dropdown-link header-link" href="#">
              <Icon type="bars" />
            </a>
          </Dropdown>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
            >
              <SubMenu key="sub1" title={<span><Icon type="user" />好友</span>}>
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />群组</span>}>
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title={<span><Icon type="notification" />个人中心</span>}>
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
              </SubMenu>
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
  const { userInfo } = state.chatReducer
  return { userInfo }
}

const mapActionToDispatch = (dispatch) => ({
  logout: () => dispatch(Actions.logout()),
  updateInfo: (info) => dispatch(Actions.updateInfo(info)),
  checkJwt: () => dispatch(Actions.checkJwt())
})

export default withRouter(connect(mapStateToProp, mapActionToDispatch)(App));
