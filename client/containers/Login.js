import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { login } from '../actions/actions'
import * as utils from '../utils/utils'


const FormItem = Form.Item;

class RegistrationForm extends React.Component {

  constructor(args) {
    super(args);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.checkConfirm = this.checkConfirm.bind(this)
    this.redirectToReg = this.redirectToReg.bind(this)
  }

  componentWillMount() {

  }

  handleSubmit(e) {
    e.preventDefault();
    const history = this.props.history;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.login(values).then(() => {
          console.log(this);
          history.push('/');
        }, (msg) => {
          utils.sendMessage('error', msg, 1.5);
        });
      }
    });
  }
  redirectToReg(){
    this.props.history.push('/signup');
  }
  handleConfirmBlur(e) {
    const value = e.target.value;
    console.log(value);
  }
  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  render() {
    const { hasResult, resultMsg } = this.props;
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
    return (
      <div style={{ "marginTop": "20px" }}>
        {hasResult ?
          <Alert
            message={resultMsg}
            type="success"
            showIcon
          /> : ''}
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout}
            label="Username"
            hasFeedback
          >
            {getFieldDecorator('username', {
              rules: [{
                required: true, message: 'Please enter username',
              }],
            })(
              <Input placeholder="enter username~" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Password"
            hasFeedback
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please enter password!',
              }],
            })(
              <Input type="password" rows={4} />
              )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" size="large">登录</Button>
            <Button htmlType="button" size="large" style={{marginLeft:'20px'}} onClick={this.redirectToReg} >注册</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

const mapStateToProp = (state) => {
  const { hasResult, resultMsg } = state.chatReducer;
  return {
    hasResult, resultMsg
  }
}

const mapActionToDispatch = (dispatch) => ({
  login: (data) => { return dispatch(login(data)) }
})

export default withRouter(connect(mapStateToProp, mapActionToDispatch)(WrappedRegistrationForm));
