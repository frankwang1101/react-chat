import React from 'react'
import { connect } from 'react-redux'
import {Button, Spin, Alert, Icon, Select} from 'antd'
import * as actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import * as Utils from '../utils/utils'
import FontChange from '../components/FontChange'
import EmojiPick from '../components/EmojiPick'

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
    this.fontChange = this.fontChange.bind(this);
    this.getEmoji = this.getEmoji.bind(this);
  }
  componentWillMount() {
    console.log('will mount');
    const type = this.props.type;
    const self = this;
    if(type === 'room'){
      this.props.getRoom(this.props.params.id).then((room) => {
        if(room){
          const target = [room.owner._id].concat(room.members.map( v => v._id)).concat(room.administrators.map( v => v._id));
          self.setState({
            loading : false,
            target,
            room
          })
        }else{
          Utils.sendMessage('error','获取群组信息出错!',1,() =>{
            this.props.history.push('/');
          })
        }
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
  componentWillReceiveProps(nextProps){
    if(this.props.type === 'room'){
      if(this.state.room._id !== nextProps.params.id){
        this.setState({
          loading: true
        })
        this.props.getRoom(nextProps.params.id).then((room) => {
          if(room){
            const target = [room.owner._id].concat(room.members.map( v => v._id)).concat(room.administrators.map( v => v._id));
            this.setState({
              loading : false,
              target,
              room
            })
          }else{
            Utils.sendMessage('error','获取群组信息出错!',1,() =>{
              this.props.history.push('/');
            })
          }
        });
      }
    }
  }
  shouldComponentUpdate(nextProps,nextState){
    return true;
  }
  componentDidMount() {
    const target = document.querySelector('.message-area');
    target.scrollTop = target.scrollHeight;
  }
  componentDidUpdate(){
    const target = document.querySelector('.message-area');
    target.scrollTop = target.scrollHeight;
  }
  send() {
    const msg = this.target.innerHTML;
    if(msg.length === 0){
      Utils.sendMessage('error','请填写要发送的内容!')
      return;
    }
    let target = null;
    if(this.props.type !== 'public'){
      target = this.state.target;
    }
    actions.emitMsg(this.props.socket, {msg, font:this.props.font}, this.props.user, target, this.props.type, this.state.room);
    this.target.innerHTML = '';
    this.target.focus();
  }
  fontChange(font){
    this.props.fontChange(font);
  }
  getEmoji(code){
    this.target.innerHTML += code.replace(/^\[emoji-(\w+)\]$/,'<i class="icon icon-$1 icon-inline" contenteditable="false" />');
  }
  render() {
    const { msgs, user, onlines, type, userMsgs, roomMsgs } = this.props;
    const room = this.state.room;
    let msgArr = [];
    let title = '欢迎来到公告聊天室~~';
    let memberRender = {
      arr:[],
      count: '',
    };
    if(type === 'user' && this.state.target){
      title = this.state.target.nickname;
      msgArr = userMsgs[this.props.params.id] || [];
    }else if(type === 'room' && this.state.room){
      title = this.state.room.roomname;
      msgArr = roomMsgs[this.props.params.id] || [];
      memberRender = Utils.renderRoomMembers(room);
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
                <div className="operate-area">
                  <EmojiPick onClick={this.getEmoji}/>
                  <Button icon="plus-square-o" className="operate-button operate-button-open"/>
                  <FontChange onChange={this.fontChange} />
                </div>
                <div className="send-area">
                  <div className="input-area" ref={(t) => { this.target = t }} contentEditable></div>
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
                          <div className="bottom-area-column">{`群组成员${memberRender.count}`}</div>
                          <div className="bottom-area-content">{memberRender.arr}</div>
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
  const { chatReducer: { msgs, user, socket, onlines, userMsgs, roomMsgs, font } } = state;
  return {
    msgs, user, socket, onlines, userMsgs, roomMsgs, font
  }
}
const mapDispatchToProp = (dispatch) => {
  return {
    init: () => { dispatch(actions.connectInit()) },
    getRoom: (id) => dispatch(actions.getRoom(id)),
    getUser: (id) => dispatch(actions.getUser(id)),
    fontChange: (font) => dispatch(actions.fontChange(font))
  }
}
export default withRouter(connect(mapStateToProp, mapDispatchToProp)(ChatRoom));