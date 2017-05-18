import React from 'react'
import { connect } from 'react-redux'
import { Button, Spin, Alert } from 'antd'
import * as actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import * as Utils from '../utils/utils'

class Messages extends React.Component {
  constructor(args) {
    super(args);
    this.deal = this.deal.bind(this);
    this.state = {
      loading: true,
      fail: false,
      messages: [],
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
    if (this.props.user) {
      this.props.getMessages(this.props.user._id).then((res) => {
        if (res.success) {
          this.setState({
            loading: false,
            messages: res.messages,
          })
        } else {
          this.setState({
            loading: false,
            fail: true,
          })
        }
      })
    }
  }
  deal(v, flag) {
    v.isDeal = true;
    const messages = this.state.messages;
    this.setState({
      messages
    });
    const data = JSON.parse(v.data)
    this.props.dealMessage(v._id);
    if(v.type === 'msg'){
      if(flag){
        this.props.history.push(`/user/${data.user._id}`);
      }
    }else if(v.type === 'friendApply'){
      if(flag){
        this.props.applyFriend(data._id, this.props.user._id)
        .then( resArr => {
          if(resArr === true){
            Utils.sendMessage('success','添加好友成功!',1);
          }else{
            Utils.sendMessage('error','添加好友失败!',1);
          }
        })
        const user = this.props.user;
        this.props.socket && this.props.socket.emit('targetMsg', JSON.stringify({ id:data._id, user, type:'accept',msg:true }));
      }else{
        this.props.socket && this.props.socket.emit('targetMsg', JSON.stringify({ id:data._id, user, type:'accept',msg:false }));
      }
    } else if(v.type === 'roomMsg'){
      if(flag){
        this.props.history.push(`/room/${data.room._id}`);
      }
    }
  }
  render() {
    const { user } = this.props;
    return (
      <div className="bg" style={{ minHeight: 'calc(100vh - 64px - 66px)' }}>
        {
          (this.state.loading && user) ? (
            <Spin tip="Loading...">

            </Spin>
          ) : (
              this.state.fail ? <div className="wrap">fail...</div> : (
                <div className="wrap" style={{ overflow: 'hidden' }}>
                  <div className="message-panel">
                    {
                      Utils.renderRecord(this.state.messages, this.deal)
                    }
                  </div>
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
    getMessages: id => dispatch(actions.getMessages(id)),
    applyFriend: (id, fid) => dispatch(actions.addApply(id, fid)),
    dealMessage: id => dispatch(actions.dealMessage(id)),    
  }
}
export default withRouter(connect(mapStateToProp, mapDispatchToProp)(Messages));
