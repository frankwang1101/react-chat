import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import '../style/index.less'

function renderMsgs(array) {
  return array.map((v, i) => {
    let res = '';
    const key = `${v.user}${v.date}${i}`;
    switch (v.type) {
      case 'login': {
        res = <div key={key}><span className="msg">{`${v.user}进入了聊天室...`}</span><span className="time">{v.date}</span></div>
        break;
      }
      case 'logout': {
        res = <div key={key}><span className="msg">{`${v.user}退出了聊天室...`}</span><span className="time">{v.date}</span></div>
        break;
      }
      case 'msg': {
        res = <div key={key}><span className="msg">{`${v.user}：${v.msg}`}</span><span className="time">{v.date}</span></div>
        break;
      }
      default:
        break;
    }
    return res;
  })
}

class ChatRoom extends React.Component {
  constructor(args) {
    super(args);
    this.send = this.send.bind(this);
    this.chooseName = this.chooseName.bind(this);
  }
  componentDidMount() {
    this.props.socket || this.props.init();
  }
  send() {
    const msg = this.target.value;
    actions.emitMsg(this.props.socket, msg, this.props.user);
    this.target.value = '';
  }
  chooseName() {
    this.props.socket.user = this.input.value;
    this.props.socket.emit('login', this.input.value);
  }
  render() {
    const { msgs, user } = this.props
    return (
      <div style={{ "position": "relative" }}>
        <div className="main">
          <div className="title">Welcome to ChatRoom~</div>
          <div className="message-area">
            {
              renderMsgs(msgs)
            }
          </div>
          <div className="send-area">
            <textarea className="input-area" ref={(t) => { this.target = t }}></textarea>
            <button className="send-btn" onClick={this.send}>SEND</button>
          </div>
        </div>
        {user ? '' :
          <div className="mask">
            <div>
              <h3>enter user nickname~</h3>
              <input type="text" ref={(t) => { this.input = t }} />
              <button className="name-btn" onClick={this.chooseName}>this</button>
            </div>
          </div>
        }
      </div>
    )
  }
}
const mapStateToProp = (state) => {
  const { chatReducer: { msgs, user, socket } } = state;
  return {
    msgs, user, socket
  }
}
const mapDispatchToProp = (dispatch) => {
  return {
    init: () => { dispatch(actions.connectInit()) },
  }
}
export default withRouter(connect(mapStateToProp, mapDispatchToProp)(ChatRoom));