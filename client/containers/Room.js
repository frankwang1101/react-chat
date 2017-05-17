import React from 'react'
import { connect } from 'react-redux'
import { Button, Spin, Alert, Form, Transfer, Input } from 'antd'
import * as actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import * as Utils from '../utils/utils'

const FormItem = Form.Item;

class Messages extends React.Component {
  constructor(args) {
    super(args);
    this.membersChange = this.membersChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      loading: true,
      targetKeys: [],
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
    if(this.props.user){
      this.setState({
        loading: false
      })
    }
  }
  componentWillReceiveProps(next){
    if(!this.props.user && next.user){
      this.setState({
        loading: false
      })
    }
  }
  membersChange(v){
    console.log(v);
    this.setState({
      targetKeys: v
    })
    return v;
  }
  handleSubmit(e){
    if(!this.props.user){
      return;
    }
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const roomInfo = values;
        const userInfo = this.props.user;
        this.props.addRoom({ roomInfo, userInfo})
          .then((res) => {
            if(res){
              actions.notificateMember(this.props.socket, res, res.ids);
              Utils.sendMessage('success','创建成功!',1);
            }else{
              Utils.sendMessage('success','创建失败!',1);
            }
          })
        
      }
    });
  }
  render() {
    const { user } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    let userData = [];
    if(user && user.friends.length){    
      userData = user.friends.map((v) => (
        {
          key: v._id,
          title: `${v.nickname}(${v.username})`,
          description: `${v.nickname}`,
          chosen: false,
        }
      ))
    }
    return (
      <div className="bg" style={{ minHeight: 'calc(100vh - 64px - 66px)' }}>
        <div className="room-create-panel">
    
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout}
              label="群组名称"
              hasFeedback
            >
              {getFieldDecorator('roomname', {
                rules: [{
                  required: true, message: '请输入群组名',
                },{
                  max: 30, message: '请不要输入超过30个字',
                },
                ],
              })(
                <Input placeholder="enter roomname~" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="群组描述"
              hasFeedback
            >
              {getFieldDecorator('roomdesc', {
                rules: [{
                  max: 200, message: '请限制在200个字以内',
                }],
              })(
                <Input type="textarea" rows={4} />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="群组成员"
              hasFeedback
            >
            {getFieldDecorator('members', {
                valuePropName: 'members',
                getValueFromEvent: this.membersChange,
              })(
                <Transfer
                  className="room-member-transfer"
                  dataSource={userData}
                  showSearch
                  render={item => item.title}
                  targetKeys={this.state.targetKeys}
                  titles={['好友列表', '群组成员']}
                />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" size="large">创建</Button>
            </FormItem>
          </Form>
        </div>
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
    addRoom: data => dispatch(actions.addRoom(data)),
    notificateMember: (...args) => actions.notificateMember(args),
  }
}

const WrappedRegistrationForm = Form.create()(Messages);

export default withRouter(connect(mapStateToProp, mapDispatchToProp)(WrappedRegistrationForm));
