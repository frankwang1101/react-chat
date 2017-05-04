import React from 'react'
import { connect } from 'react-redux'
import {Button, Spin, Alert} from 'antd'
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
    this.props.getMessages(this.props.user._id).then((res) => {
      if(res.success){
        this.setState({
          loading: false,
          messages: res.messages,
        })
      }
    })
  }
  deal(){

  }
  render() {
    const { msgs, user, onlines, type, userMsgs } = this.props;
    return (
      <div>
        {
          (this.state.loading && user)?(
            <Spin tip="Loading...">
              <Alert
                message="正在加载"
                description="正在加载消息中，请稍后。"
                type="info"
              />
            </Spin>
          ):(
            <div className="wrap" >
              
            </div>
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
    getMessages: id => dispatch(actions.getMessages(id))
  }
}
export default withRouter(connect(mapStateToProp, mapDispatchToProp)(Messages));