import parser from 'body-parser'
import User from '../Model/User'
import Room from '../Model/Room'
import Message from '../Model/Message'
import * as JwtUtil from '../utils/jwtUtil'
import multer from 'multer'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './server/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + (Math.random() * 100).toFixed(0) + file.originalname.substring(file.originalname.lastIndexOf('.')))
  }
})
const upload = multer({ storage });

var par = parser.text();
module.exports = (app) => {
  app.post('/upload/avatar', upload.single('avatar'), (req, res, next) => {
    res.send(req.file)
  })
  app.post('/signup', par, (req, res) => {
    console.log('sign..');
    let param = JSON.parse(req.body);
    User.create(param).then(result => {
      res.send({ msg: 'create User success!', success: true })
    })
  })
  app.post('/login', par, async (req, res) => {
    try {
      const info = JSON.parse(req.body);
      const result = await User.check(info);
      if (result) {
        const info = result.toObject();
        const token = JwtUtil.addToken(info, req);
        info.token = token;
        const unread = await Message.getUndealCount(info._id);
        const rooms = await Room.getUserRoom(info._id)
        info.unread = unread;
        info.rooms = rooms;
        res.send({ success: true, info: info });
      } else {
        res.send({ success: false, msg: "wrong username or password!" });
      }
    } catch (err) {
      res.send({ success: false, msg: err });
      console.log(err)
    }
  })
  app.get('/checkjwt', (req, res) => {
    let token = req.headers['authrorization'];
    JwtUtil.serverJwtValid(token).then((resolve) => {
      resolve = resolve.toObject();
      token = JwtUtil.updateToken(resolve, token);
      Promise.all([
        Message.getUndealCount(resolve._id),
        Room.getUserRoom(resolve._id)
      ]).then(resArr => {
        resolve.unread = resArr[0];
        resolve.rooms = resArr[1];
        res.send({ success: true, info: resolve, token: token });
      });
    }, reject => {
      res.send({ success: false, msg: reject || '' });
    }).catch(e => {
      console.log(e);
    })
  })
  app.post('/search', par, (req, res) => {
    const keyword = req.body;
    User.findUser(keyword).then((result) => {
      res.send({ success: true, userResult: result });
    }, reject => {
      res.send({ success: false, msg: reject || '' });
    }).catch(e => {
      console.log(e);
      res.send({ success: false, msg: e || '' });
    })
  })
  app.get('/search/:id', (req, res) => {
    const id = req.params.id;
    User.getUserById(id).then((result) => {
      res.send({ success: true, user: result });
    }, reject => {
      res.send({ success: false, msg: reject || '' });
    }).catch(e => {
      console.log(e);
      res.send({ success: false, msg: e || '' });
    })
  })
  app.post('/addfriend', par, (req, res) => {
    const param = JSON.parse(req.body);
    let token = req.headers['authrorization'];
    JwtUtil.serverJwtValid(token).then((resolve) => {
      token = JwtUtil.updateToken(resolve, token);
      User.addFriend(param).then((result) => {
        if (result.ok === 1 && result.n === 1) {
          res.send({ success: true, msg: '' });
        }
      }, (reject) => {
        console.log('inner reject');
        res.send({ success: false, msg: reject || '' });
      }).catch(e => {
        console.log(e);
        res.send({ success: false, msg: e || '' });
      })
    }, reject => {
      console.log('outer reject');
      res.send({ success: false, msg: reject || '' });
    }).catch(e => {
      console.log(e);
      res.send({ success: false, msg: e || '' });
    });
  })
  app.get('/messages/:id', async (req, res) => {
    const id = req.params.id;
    let token = req.headers['authrorization'];
    const resolve = await JwtUtil.serverJwtValid(token);
    if (resolve) {
      token = JwtUtil.updateToken(resolve, token);
      const messages = await Message.getMessagesByUserId(id);
      res.send({ success: true, messages });
    } else {
      res.send({ success: false, msg: '获取消息列表失败!' });
    }
  });
  app.get('/dealmessages/:id', async (req, res) => {
    try {
      const id = req.params.id;
      let token = req.headers['authrorization'];
      const resolve = await JwtUtil.serverJwtValid(token);
      if (resolve) {
        token = JwtUtil.updateToken(resolve, token);
        await Message.setDeal(id);
        res.send({ success: true });
      } else {
        res.send({ success: false, msg: '更新消息状态失败!' });
      }
    } catch (e) {
      console.log(e);
      res.send({ success: false, msg: e  });
    }
  })
  app.post('/create_room', par, async (req, res) => {
    try {
      const params = JSON.parse(req.body);
      let token = req.headers['authrorization'];
      const resolve = await JwtUtil.serverJwtValid(token);
      if (resolve) {
        const { roomInfo, userInfo } = params;
        const room = await Room.create({
          roomname: roomInfo.roomname,
          roomdesc: roomInfo.roomdesc,
          members: roomInfo.members,
          owner: userInfo._id,
        });
        res.send({ success: true, room });
      } else {
        res.send({ success: false, msg: '更新消息状态失败!' });
      }
    } catch (e) {
      console.log(e);
      res.send({ success: false, msg: e });
    }
  })
  app.get('/get_room/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const room = await Room.getRoomById(id);
      if (!!room) {
        res.send({ success: true, room: room.toObject() });
      } else {
        res.send({ success: false });
      }
    } catch (e) {
      console.log(e);
      res.send({ success: false, msg: e  });
    }
  });
  //给群组添加成员
  app.post('/add_member', par, async (req, res) => {
    try {
      let token = req.headers['authrorization'];
      const resolve = await JwtUtil.serverJwtValid(token);
      if (resolve) {
        const params = JSON.parse(req.body);
        const checkRes = await Room.checkAddAuth(resolve._id);
        if (!!checkRes) {
          await Room.addMember({ roomId: params.roomId, userId: params.ids });
          res.send({ success: true });
        } else {
          res.send({ success: false });
        }
      } else {
        throw new SyntaxError('User valid error');
      }
    } catch (e) {
      console.log(e);
      res.send({ success: false, msg: e  });
    }
  });
  //任免管理员
  app.post('/auth_manage', par, async (req, res) => {
    try {
      let token = req.headers['authrorization'];
      const resolve = await JwtUtil.serverJwtValid(token);
      if (resolve) {
        const params = JSON.parse(req.body);
        const checkRes = await Room.checkOwner(params.roomId, resolve._id);
        if (!!checkRes) {
          await Room.authManage({ roomId: params.roomId, userId: params.ids });
          res.send({ success: true });
        } else {
          res.send({ success: false });
        }
      } else {
        throw new SyntaxError('User valid error');
      }
    } catch (e) {
      console.log(e);
      res.send({ success: false, msg: e  });
    }
  })
  //删除群组
  app.get('/remove_room/:id', async (req, res) => {
    try {
      let token = req.headers['authrorization'];
      const resolve = await JwtUtil.serverJwtValid(token);
      if (resolve) {
        const checkRes = await Room.checkOwner(req.params.id, resolve._id);
        if (!!checkRes) {
          await Room.remove(req.params.id);
          res.send({ success: true });
        } else {
          res.send({ success: false });
        }
      }
    } catch (e) {
      console.log(e);
      res.send({ success: false, msg: e  });
    }
  });
  //退出群组
  app.get('/quit_room/:id', async (req, res) => {
    try {
      let token = req.headers['authrorization'];
      const resolve = await JwtUtil.serverJwtValid(token);
      if (resolve) {
        await Room.quit(req.params.id, resolve._id);
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    } catch (e) {
      console.log(e);
      res.send({ success: false, msg: e  });
    }
  })
}
