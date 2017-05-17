import React from 'react'
import { connect } from 'react-redux'
import {Button, Spin, Alert} from 'antd'
import * as actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import * as Utils from '../utils/utils'




class ChatRoom extends React.Component {
  constructor(args) {
    super(args);
    this.send = this.send.bind(this);
    let loading = false;
    if(this.props.type === 'room' || this.props.type === 'user'){
      loading = true;
    }
    this.state = {
      loading
    }
  }
  componentWillMount() {
    const type = this.props.type;
    const self = this;
    if(type === 'room'){
      this.props.getRoom(this.props.params.id).then((room) => {
        const target = [room.owner._id].concat(room.members.map( v => v._id)).concat(room.administrators.map( v => v._id));
        self.setState({
          loading : false,
          target,
          room
        })
      });
    }else if(type === 'user'){
      this.props.getUser(this.props.params.id).then((target) => {
        self.setState({
          loading : false,
          target
        })
      });
    }
  }
  componentDidMount() {
    console.log('mount..');
  }
  send() {
    const msg = this.target.value;
    if(msg.length === 0){
      Utils.sendMessage('error','请填写要发送的内容!')
      return;
    }
    let target = null;
    if(this.props.type !== 'public'){
      target = this.state.target;
    }
    actions.emitMsg(this.props.socket, msg, this.props.user, target);
    this.target.value = '';
  }
  render() {
    const { msgs, user, onlines, type, userMsgs } = this.props;
    const room = this.state.room;
    
    let msgArr = [];
    let title = '欢迎来到公告聊天室~~';
    if(type === 'user' && this.state.target){
      title = this.state.target.nickname;
      msgArr = userMsgs[this.props.params.id] || [];
    }else if(type === 'room'){
      
    }else{
      msgArr = msgs;
    }
    return (
      <div className="wrap bg" style={{ overflow:'hidden'}}>
        {
          (this.state.loading && user)?(
            <Spin tip="Loading...">
              <Alert
                message="Alert message title"
                description="Further details about the context of this alert."
                type="info"
              />
            </Spin>
          ):(
            <div className="wrap" >
              <div className="main">
                <div className="title">{title}</div>
                <div className="message-area">
                  {
                    Utils.renderMsgs(msgArr)
                  }
                </div>
                <div className="send-area">
                  <textarea className="input-area" ref={(t) => { this.target = t }}></textarea>
                  <Button className="send-btn" type="primary" onClick={this.send}>SEND</Button>
                </div>
              </div>
              {
                type !== 'user' ? (
                  <div className="sider-bar">
                    <div className="top-area">
                      <div className="top-area-column">聊天室公告</div>
                      <div className="top-area-content"></div>
                    </div>
                    {
                      type === 'room' ? (
                        <div className="bottom-area">
                          <div className="bottom-area-column">群组成员</div>
                          <div className="bottom-area-content">{Utils.renderOnlines(onlines)}</div>
                        </div>
                      ) : (
                        <div className="bottom-area">
                          <div className="bottom-area-column">在线人数({onlines.length})</div>
                          <div className="bottom-area-content">{Utils.renderOnlines(onlines)}</div>
                        </div>
                      )
                    }
                  </div>
                ) : ''
              }
            </div>
          )
        }
        
      </div>
    )
  }
}
const mapStateToProp = (state) => {
  const { chatReducer: { msgs, user, socket, onlines, userMsgs, roomMsgs } } = state;
  return {
    msgs, user, socket, onlines, userMsgs, roomMsgs
  }
}
const mapDispatchToProp = (dispatch) => {
  return {
    init: () => { dispatch(actions.connectInit()) },
    getRoom: (id) => dispatch(actions.getRoom(id)),
    getUser: (id) => dispatch(actions.getUser(id)),
  }
}
export default withRouter(connect(mapStateToProp, mapDispatchToProp)(ChatRoom));