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
        console.log(values);
        // const history = this.props.history;
        // this.props.register(values).then(() => {
        //   utils.sendMessage('success','注册成功!', 1.5, () => {
        //     history.push('/login');
        //   });
        // }, () => {
        //   utils.sendMessage('error','注册失败!',1.5);
        // })
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
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: false,
      };
      
      mockData.push(data);
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
              {getFieldDecorator('description', {
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
                  dataSource={mockData}
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
  }
}

const WrappedRegistrationForm = Form.create()(Messages);

export default withRouter(connect(mapStateToProp, mapDispatchToProp)(WrappedRegistrationForm));
