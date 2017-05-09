import React from 'react'
import { message, Row, Col, Button, Icon, notification } from 'antd'
import moment from 'moment'
import * as actions from '../actions/actions'

export function sendMessage(type, msg, dur, cb) {
  message[type](msg, dur, cb);
}
export function renderOnlines(array) {
  const list = array.map((v) => {
    return <li key={`userkey${v._id}`} className="user-item" data-username={`${v.username}`} title={v.nickname} >{`${v.nickname}(${v.username})`}</li>
  });
  return (
    <ul>{list}</ul>
  )
}

export function renderMsgs(array) {
  return array.map((v, i) => {
    let res = '';
    const key = `${v.user}${v.date}${i}`;
    switch (v.type) {
      case 'login': {
        res = <div className="msg-row" key={key}><span className="sys-msg"><span className="name">{v.user}</span>{`进入了聊天室...`}</span></div>
        break;
      }
      case 'logout': {
        res = <div className="msg-row" key={key}><span className="sys-msg"><span className="name">{v.user}</span>{`退出了聊天室...`}</span></div>
        break;
      }
      case 'msg': {
        res = <div className="msg-row" key={key}>
          <div><span className="name">{`${v.user}`}</span><span className="time">{`  ${moment(v.date).format('YYYY-MM-DD HH:mm:ss')}`}</span></div>
          <pre>{v.msg}</pre>
        </div>
        break;
      }
      default:
        break;
    }
    return res;
  })
}

export function renderSearchRes(arr, add, from) {
  const res = arr.map(function (v) {
    return (
      <Col lg={4} md={6} sm={8} xs={12} key={`user_res_${v._id}`}>
        <div className="user-panel">
          <Row gutter={8}>
            <Col span={8}>
              <div className="user-avatar">
                <img src={v.avatar} width={'100%'} alt={v.nickname} />
              </div>
            </Col>
            <Col span={16}>
              <div className="user-info">
                <div className="user-name">昵称: {v.nickname}</div>
                <div className="user-id">用户名: {v.username}</div>
                <div className="user-gen">性别: {v.gender} {from._id !== v._id ? <Button type="primary" size="small" onClick={() => add(v._id)}><Icon type="user-add" />添加</Button> : ''}</div>

              </div>
            </Col>
          </Row>
        </div>
      </Col>
    )
  })
  return (
    <Row gutter={16}>
      {res}
    </Row>
  )
}

export function openNotification(newMessage, history) {
  const key = `open${Date.now()}`;
  const btnClick = function () {
    notification.close(key);
    history.push(`/${newMessage.type}/${newMessage.token}`);
  };
  const btn = (
    <Button type="primary" size="small" onClick={() => btnClick()}>
      Check
    </Button>
  );
  notification.open({
    message: `${newMessage.user}`,
    description: newMessage.msg,
    btn,
    key,
  });
};

export function renderRecord(records,  deal) {
  return records.map(v => {
    const data = JSON.parse(v.data);
    if (v.type === 'msg') {
      const user = data.user;
      return (
        <div className="rec rec-msg">
          <div className="user-head">
            <img src={user.avatar} alt={user.nickname} />
            <span>{user.nickname}</span>
          </div>
          <div className="content">
            {`${v.content}  ${moment(data.date).format('YYYY-MM-DD HH:mm:ss')}`}
          </div>
          <div className={`operate ${v.isDeal?'disabled':''}`}>
            <Button>回复</Button>
            <Button>已读</Button>
          </div>
        </div>
      )
    } else if (v.type === 'friendApply') {
      return (
        <div className="rec rec-apply">
          <div className="user-head">
            <img src={data.avatar} alt={data.nickname} />
          </div>
          <div className="user-content">
            <div className="user-name">{data.nickname}</div>
            <div className="user-msg">{v.content}</div>
          </div>
          <div className={`operate ${v.isDeal?'disabled':''}`}>
            <Button onClick={() => deal(v,true)}>同意</Button>
            <Button onClick={() => deal(v,false)}>拒绝</Button>
          </div>
        </div>
      )
    }
  })
}