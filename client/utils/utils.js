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

export function renderRoomMembers(room){
  let online = room.owner.online?1:0;
  const owner = <li key={`userkey${room.owner._id}`} className={`user-item ${room.owner.online?'user-item-online':''}`} data-username={`${room.owner.username}`} title={room.owner.nickname} >{`群主--${room.owner.nickname}(${room.owner.username})`}</li>;
  const admins = room.administrators.map( v => {
    v.online && (online++);
    return <li key={`userkey${v._id}`} className={`user-item ${v.online?'user-item-online':''}`} data-username={`${v.username}`} title={v.nickname} >{`管理员--${v.nickname}(${v.username})`}</li>
  })
  const members = room.members.map( v => {
    v.online && (online++);
    return <li key={`userkey${v._id}`} className={`user-item ${v.online?'user-item-online':''}`} data-username={`${v.username}`} title={v.nickname} >{`${v.nickname}(${v.username})`}</li>;
  })
  const arr = [owner].concat(admins).concat(members);
  return {
    arr: ( <ul>{arr}</ul> ),
    count: `(${online}/${arr.length})`,
  };
}

export function renderMsgs(array) {
  return array.map((v, i) => {
    let res = '';
    const key = `${v.user._id}${v.date}`;
    switch (v.type) {
      case 'login': {
        res = <div className="msg-row" key={key}><span className="sys-msg"><span className="name">{v.user.nickname}</span>{`进入了聊天室...`}</span></div>
        break;
      }
      case 'logout': {
        res = <div className="msg-row" key={key}><span className="sys-msg"><span className="name">{v.user.nickname}</span>{`退出了聊天室...`}</span></div>
        break;
      }
      case 'sys':{
        res = <div className="msg-row" key={key}><span className="sys-msg">{v.msg}</span></div>
        break;
      }
      case 'msg': {
        res = <div className="msg-row" key={key}>
          <dt><span className="name">{`${v.user.nickname}`}</span><span className="time">{`  ${moment(v.date).format('YYYY-MM-DD HH:mm:ss')}`}</span></dt>
          <dd dangerouslySetInnerHTML={{__html:v.msg.msg}} style={v.msg.font}></dd>
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

export function openNotification(newMessage,  history) {
  const key = `open${Date.now()}`;
  let messageStr = '';  
  const btnClick = function () {
    notification.close(key);
    if(newMessage.type === 'user'){
      history.push(`/${newMessage.type}/${newMessage.token}`);
    }else if(newMessage.type === 'room'){
      history.push(`/${newMessage.type}/${newMessage._id}`);
    }
  };
  const btn = (
    <Button type="primary" size="small" onClick={() => btnClick()}>
      OK
    </Button>
  );
  if(newMessage.type === 'user'){
    messageStr = `来自好友${newMessage.user.nickname}`;
  }else if(newMessage.type === 'room'){
    messageStr = `来自群组${newMessage.roomname}`;
  }else {
    messageStr = newMessage.title
  }
  notification.open({
    message: messageStr,
    description: newMessage.msg,
    btn,
    key,
  });
};

export function openAddNotification(id, from, dispatch) {
  const key = `open${Date.now()}`;
  const btnClick = function (flag) {
    if (flag) {
      dispatch(addApply(id, from._id)).then(res => {
        if (res === true) {
          message.success('添加好友成功', 1);
        } else {
          message.error('添加好友失败', 1);
        }
      })
    }
    notification.close(key);
  };
  const btn = (
    <div>
      <Button type="primary" size="small" onClick={() => btnClick(true)}>
        Confirm
      </Button>
      <Button type="primary" size="small" onClick={() => btnClick(false)}>
        Refuse
      </Button>
    </div>
  );
  notification.open({
    message: 'Friend Apply',
    description: `${from.nickname} want to become ur friend`,
    btn,
    key,
  });
};

export function renderRecord(records, deal) {
  return records.map(v => {
    const data = v.data ? JSON.parse(v.data) : null;
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
          <div className={`operate ${v.isDeal ? 'disabled' : ''}`}>
            <Button onClick={() => deal(v, true)}>回复</Button>
            <Button onClick={() => deal(v, false)}>已读</Button>
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
          <div className={`operate ${v.isDeal ? 'disabled' : ''}`}>
            <Button onClick={() => deal(v, true)}>同意</Button>
            <Button onClick={() => deal(v, false)}>拒绝</Button>
          </div>
        </div>
      )
    } else if (v.type === 'becomeMember') {
      return (
        <div className="rec rec-apply">
          <div className="user-head">
            
          </div>
          <div className="user-content">
            <div className="user-msg">{v.content}</div>
          </div>
          <div className={`operate ${v.isDeal ? 'disabled' : ''}`}>
            <Button onClick={() => deal(v, true)}>已读</Button>
          </div>
        </div>
      )
    } else if(v.type === 'roomMsg'){
      <div className="rec rec-msg">
        <div className="user-head">
          <img src={user.avatar} alt={user.nickname} />
          <span>{user.nickname}</span>
        </div>
        <div className="content">
          {`${v.content}  ${moment(data.date).format('YYYY-MM-DD HH:mm:ss')}`}
        </div>
        <div className={`operate ${v.isDeal ? 'disabled' : ''}`}>
          <Button onClick={() => deal(v, true)}>回复</Button>
            <Button onClick={() => deal(v, false)}>已读</Button>
        </div>
      </div>
    }
  })
}

export function renderRoomInfo(room){
  const members = [{name:`群主--${room.owner.nickname}(${room.owner.username})`,id:room.owner._id}]
  .concat(room.administrators.map(v => ({name:`管理员--${v.nickname}(${v.username})`})))
  .concat(room.member.map(v => ({name:`${v.nickname}(${v.username})`})));
  const membersItem = members.map(v => (<li className="room-member-item" key={v.id}>{v.name}</li>));
  return (<div className="room-info-panel">
            <div className="row-inline">
              <lable>群组名称:</lable>
              <span>{room.roomname}</span>
            </div>
            <div className="row-inline">
              <lable>群组简介:</lable>
              <span>{room.description}</span>
            </div>
            <div className="row-inline">
              <lable>群组名称:</lable>
              <ul className="room-member-list">
              {
                membersItem
              }
              </ul>
            </div>
          </div>)
}
