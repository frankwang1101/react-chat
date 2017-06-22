import React from 'react'
import { connect } from 'redux'
import { withRouter } from 'react-router-dom'
import { Button, Icon, Transfer } from 'antd'

export default class AssignWin extends React.Component {
  constructor(...args) {
    super(...args);
    this.closeWin = this.closeWin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      datas: [],
      targets: [],
    }
  }
  componentDidMount() {
    this.props.config.getData().then((data) => {
      if(data){
        const {datas, targets} = data;
        this.setState({datas, targets});
      }
    })
  }
  getMock() {
    const targets = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targets.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ datas:[], targets });
  }
  handleChange(targets) {
    this.setState({ targets });
  }
  closeWin() {
    const ele = document.body.querySelector('[name=reactDialog] .win-wrap');
    ele.parentNode.removeChild(ele);
  }
  render() {
    let winStyle = {};
    let shadeStyle = {};
    let zIndex = parseInt(200000 - Math.random() * 1000 - 1000);
    shadeStyle.zIndex = zIndex;
    winStyle.zIndex = zIndex + 1;
    winStyle.width = this.props.config.width;
    winStyle.height = this.props.config.height;
    winStyle.top = (parseInt(document.documentElement.offsetHeight) - parseInt(winStyle.height)) / 2;
    winStyle.left = (parseInt(document.documentElement.offsetWidth) - parseInt(winStyle.width)) / 2;
    return (
      <div className="win-wrap">
        <div className="win-shade" style={shadeStyle} onClick={this.closeWin}></div>
        <div className="win-content" style={winStyle}>
          <div className="content-header">
            <span className="title-area">
              {this.props.config.title}
            </span>
            <span className="operate-area">
              <Icon type="close" className="btn-close" onClick={this.closeWin} />
            </span>
          </div>
          <div className="content-body">
            <Transfer
              dataSource={this.state.datas}
              showSearch
              targetKeys={this.state.targets}
              onChange={this.handleChange}
              render={item => item.name}
            />
          </div>
          <div className="content-operate">
            <Button type="primary" onClick={() => {this.props.config.cb(this.state.targets,this.props.config.type,this.props.config.roomId,this.state.datas)}}>确定</Button>
            <Button style={{ marginLeft: '10px' }} onClick={this.closeWin}>取消</Button>
          </div>
        </div>
      </div>
    )
  }
}

