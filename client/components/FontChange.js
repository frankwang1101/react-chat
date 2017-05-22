import React from 'react'
import { Button, Spin, Alert, Icon, Select } from 'antd'

class FontChange extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      bold: this.props.bold || false,
      italic: this.props.italic || false,
      underline: this.props.underline || false,
      fontFamily: this.props.fontFamily || 'Microsoft YaHei',
      fontColor: this.props.fontColor || '#fff',
    }
    this.fontChange = this.fontChange.bind(this);
  }
  fontChange(type, ...args) {
    console.log('emtttt');
    let state = this.state;
    let tempState = {};
    switch (type) {
      case 'bold':
        tempState.bold = !state.bold;
        break;
      case 'italic':
        tempState.italic = !state.italic;
        break;
      case 'underline':
        tempState.underline = !state.underline;
        break;
      case 'fontFamily':
        tempState.fontFamily = args[0];
        break;
      case 'fontColor':
        tempState.fontColor = args[0];
        break;
    }
    state = Object.assign(state,tempState);
    this.setState(state);
    this.props.onChange && this.props.onChange(state);
  }
  render() {
    return (
      <div className="font-change">
        <Button onClick={() => this.fontChange('bold')} className={`operate-button operate-button-smile ${this.state.bold?'font-select':''}`}>B</Button>
        <Button onClick={() => this.fontChange('italic')} className={`operate-button operate-button-smile ${this.state.italic?'font-select':''}`}>I</Button>
        <Button onClick={() => this.fontChange('underline')} className={`operate-button operate-button-smile ${this.state.underline?'font-select':''}`}>U</Button>
        <Select
          size={'small'}
          defaultValue="雅黑"
          style={{ width: 100 }}
          onChange={(...args) => this.fontChange('fontFamily', ...args)}
        >
          <Select.Option key="yahei" value="Microsoft YaHei">雅黑</Select.Option>
          <Select.Option key="songti" value="宋体">宋体</Select.Option>
          <Select.Option key="heiti" value="黑体" >黑体</Select.Option>
          <Select.Option key="youyuan" value="幼圆">幼圆</Select.Option>
        </Select>
        <div className="color-pick">
          <div className="color-block color-block-now" style={{'background':this.state.fontColor}}></div>
          <div onClick={() => this.fontChange('fontColor','#fff')} className="color-block color-block-white"></div>
          <div onClick={() => this.fontChange('fontColor','#25c6b7')} className="color-block color-block-green"></div>
          <div onClick={() => this.fontChange('fontColor','#000')} className="color-block color-block-black"></div>
          <div onClick={() => this.fontChange('fontColor','#655')} className="color-block color-block-brown"></div>
          <div onClick={() => this.fontChange('fontColor','#58a')} className="color-block color-block-blue"></div>
        </div>
      </div>
    )
  }
}

export default FontChange;