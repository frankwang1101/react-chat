import React from 'react'
import { Button, Alert, Icon } from 'antd'
import '../style/emoji.less'

class FontChange extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      open: false,
      value: 0
    }
    this.getEmoji = this.getEmoji.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
  }
  componentDidMount() {
    document.body.addEventListener('click', () => {
      if (this.state.open) {
        this.setState({
          open: false
        })
      }
    });
  }
  getEmoji(code) {
    this.props.onClick && this.props.onClick(`[emoji-${code}]`);
  }
  togglePanel() {
    this.setState({
      open: !this.state.open
    })
  }
  componentWillUnMount() {
    document.body.removeEventListener('click');
  }
  render() {
    return (
      <div className="emoji-picker">
        <Button icon="smile-o" className="operate-button operate-button-smile" onClick={this.togglePanel} />
        <div className={`emoji-board ${this.state.open ? 'show' : ''}`}>
          <i className="icon icon-1f44c" onClick={() => this.getEmoji('1f44c')} />
          <i className="icon icon-1f44d" onClick={() => this.getEmoji('1f44d')} />
          <i className="icon icon-1f44f" onClick={() => this.getEmoji('1f44f')} />
          <i className="icon icon-1f4aa" onClick={() => this.getEmoji('1f4aa')} />
          <i className="icon icon-1f52b" onClick={() => this.getEmoji('1f52b')} />
          <i className="icon icon-1f600" onClick={() => this.getEmoji('1f600')} />
          <i className="icon icon-1f601" onClick={() => this.getEmoji('1f601')} />
          <i className="icon icon-1f602" onClick={() => this.getEmoji('1f602')} />
          <i className="icon icon-1f603" onClick={() => this.getEmoji('1f603')} />
          <i className="icon icon-1f604" onClick={() => this.getEmoji('1f604')} />
          <i className="icon icon-1f605" onClick={() => this.getEmoji('1f605')} />
          <i className="icon icon-1f606" onClick={() => this.getEmoji('1f606')} />
          <i className="icon icon-1f607" onClick={() => this.getEmoji('1f607')} />
          <i className="icon icon-1f609" onClick={() => this.getEmoji('1f609')} />
          <i className="icon icon-1f610" onClick={() => this.getEmoji('1f610')} />
          <i className="icon icon-1f611" onClick={() => this.getEmoji('1f611')} />
          <i className="icon icon-1f612" onClick={() => this.getEmoji('1f612')} />
          <i className="icon icon-1f613" onClick={() => this.getEmoji('1f613')} />
          <i className="icon icon-1f614" onClick={() => this.getEmoji('1f614')} />
          <i className="icon icon-1f615" onClick={() => this.getEmoji('1f615')} />
          <i className="icon icon-1f616" onClick={() => this.getEmoji('1f616')} />
          <i className="icon icon-1f617" onClick={() => this.getEmoji('1f617')} />
          <i className="icon icon-1f618" onClick={() => this.getEmoji('1f618')} />
          <i className="icon icon-1f619" onClick={() => this.getEmoji('1f619')} />
          <i className="icon icon-1f620" onClick={() => this.getEmoji('1f620')} />
          <i className="icon icon-1f621" onClick={() => this.getEmoji('1f621')} />
          <i className="icon icon-1f622" onClick={() => this.getEmoji('1f622')} />
          <i className="icon icon-1f623" onClick={() => this.getEmoji('1f623')} />
          <i className="icon icon-1f624" onClick={() => this.getEmoji('1f624')} />
          <i className="icon icon-1f625" onClick={() => this.getEmoji('1f625')} />
          <i className="icon icon-1f626" onClick={() => this.getEmoji('1f626')} />
          <i className="icon icon-1f627" onClick={() => this.getEmoji('1f627')} />
          <i className="icon icon-1f628" onClick={() => this.getEmoji('1f628')} />
          <i className="icon icon-1f629" onClick={() => this.getEmoji('1f629')} />
          <i className="icon icon-1f630" onClick={() => this.getEmoji('1f630')} />
          <i className="icon icon-1f631" onClick={() => this.getEmoji('1f631')} />
          <i className="icon icon-1f632" onClick={() => this.getEmoji('1f632')} />
          <i className="icon icon-1f633" onClick={() => this.getEmoji('1f633')} />
          <i className="icon icon-1f634" onClick={() => this.getEmoji('1f634')} />
          <i className="icon icon-1f635" onClick={() => this.getEmoji('1f635')} />
          <i className="icon icon-1f636" onClick={() => this.getEmoji('1f636')} />
          <i className="icon icon-1f637" onClick={() => this.getEmoji('1f637')} />
          <i className="icon icon-1f638" onClick={() => this.getEmoji('1f638')} />
          <i className="icon icon-1f639" onClick={() => this.getEmoji('1f639')} />
          <i className="icon icon-1f640" onClick={() => this.getEmoji('1f640')} />
          <i className="icon icon-1f641" onClick={() => this.getEmoji('1f641')} />
          <i className="icon icon-1f642" onClick={() => this.getEmoji('1f642')} />
          <i className="icon icon-1f643" onClick={() => this.getEmoji('1f643')} />
          <i className="icon icon-1f644" onClick={() => this.getEmoji('1f644')} />
          <i className="icon icon-1f64f" onClick={() => this.getEmoji('1f64f')} />
          <i className="icon icon-1f91a" onClick={() => this.getEmoji('1f91a')} />
          <i className="icon icon-1f91b" onClick={() => this.getEmoji('1f91b')} />
          <i className="icon icon-1f91c" onClick={() => this.getEmoji('1f91c')} />
          <i className="icon icon-1f91d" onClick={() => this.getEmoji('1f91d')} />
          <i className="icon icon-2639 " onClick={() => this.getEmoji('2639 ')} />
          <i className="icon icon-270c " onClick={() => this.getEmoji('270c ')} />
        </div>
      </div>
    )
  }
}

export default FontChange;