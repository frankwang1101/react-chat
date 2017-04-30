import React from 'react'
import { connect } from 'react-redux'
import { Input, Spin, Alert } from 'antd'
import * as actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import * as Utils from '../utils/utils'

const Search = Input.Search;

class SearchComponent extends React.Component {
  constructor(args) {
    super(args);
    this.add = this.add.bind(this);
    this.search = this.search.bind(this);
    this.state = {
      searchArr: [],
      searching: false,
      searched: false,
      error: false,
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  componentWillReceiveProps(np){
  }
  add(id) {
    const { user, socket } = this.props;
    const friends = user.friends?user.friends.map(v => v._id):[];
    if(friends.indexOf(id) > -1){
      Utils.sendMessage('error', '该用户已经是您的好友，请不要重复添加!', 1);
      return;
    }
    socket.emit('targetMsg', JSON.stringify({ id, user }));
    this.props.add(id, user._id).then(res => {
      if (res === true) {
        Utils.sendMessage('success', '添加好友成功', 1)
      } else {
        Utils.sendMessage('error', '添加好友失败', 1)
      }
    })
  }
  search(keyword) {
    this.setState({
      searching: true,
      searched: false,
      error: false,
    })
    this.props.search(keyword).then(res => {
      if (res === false) {
        this.setState({
          searching: false,
          searched: true,
          error: true,
        })
      } else {
        this.setState({
          searching: false,
          searched: true,
          error: false,
          searchArr: Array.from(res),
        })
      }
    })
  }
  render() {
    const { user } = this.props
    const sarr = Utils.renderSearchRes(this.state.searchArr, this.add, user);
    return (
      <div className="" style={{ minHeight: 800, overflow: 'hidden', padding: '0 20px' }} >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }} >
          <Search
            placeholder="input search text"
            style={{ width: '60%' }}
            onSearch={value => this.search(value)}
          />
        </div>
        {
          (this.state.searching) ? (
            <Spin tip="Loading...">
              <Alert
                message="Alert message title"
                description="Further details about the context of this alert."
                type="info"
              />
            </Spin>
          ) : (
              (this.state.searched) ?
                (<div className="search-wrap" >
                  {sarr}
                </div>) : (
                  <div className="wrap" >
                    请输入搜索内容
                  </div>
                )
            )
        }

      </div>
    )
  }
}
const mapStateToProp = (state) => {
  const { chatReducer: { user, socket } } = state;
  return {
    user, socket
  }
}
const mapDispatchToProp = (dispatch) => {
  return {
    search: (keyword) => dispatch(actions.search(keyword)),
    add: (id, fid) => dispatch(actions.addApply(id, fid)),
  }
}
export default withRouter(connect(mapStateToProp, mapDispatchToProp)(SearchComponent));