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
        cb(null, file.fieldname + '-' + Date.now() + (Math.random()*100).toFixed(0) + file.originalname.substring(file.originalname.lastIndexOf('.')))
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
    app.post('/login', par, (req, res) => {
        const info = JSON.parse(req.body);
        User.check(info).then(result => {
            try {
                if (result) {
                    const info = result.toObject();
                    delete info.password;
                    const token = JwtUtil.addToken(info, req);
                    info.token = token;
                    Message.getUndealCount(info._id).then(unread => {
                        info.unread = unread;
                        res.send({ success: true, info: info });
                    });
                } else {
                    res.send({ success: false, msg: "wrong username or password!" });
                }
            } catch (err) {
                console.log(err)
            }
        }).catch(err => {
            res.send({ success: false, msg: err });
        })
    })
    app.get('/checkjwt', (req, res) => {
        let token = req.headers['authrorization'];
        JwtUtil.serverJwtValid(token).then((resolve) => {
            resolve = resolve.toObject();
            token = JwtUtil.updateToken(resolve, token);
            Message.getUndealCount(resolve._id).then(unread => {
                resolve.unread = unread;
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
            res.send({success: true, userResult: result});
        }, reject => {
            res.send({ success: false, msg: reject || '' });
        }).catch(e => {
            console.log(e);
            res.send({ success: false, msg: e || '' });
        })
    })
    app.post('/search', par, (req, res) => {
        const keyword = req.body;
        User.findUser(keyword).then((result) => {
            res.send({success: true, userResult: result});
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
            res.send({success: true, user: result});
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
                if(result.ok === 1 && result.n === 1){
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
    app.get('/messages/:id',async (req, res) => {
        const id = req.params.id;
        let token = req.headers['authrorization'];
        const resolve = await JwtUtil.serverJwtValid(token);
        if(resolve){
           token = JwtUtil.updateToken(resolve, token);
           const messages = await Message.getMessagesByUserId(id);
           res.send({success: true, messages });
        }else{
            res.send({ success: false, msg: '获取消息列表失败!' });
        }
    });
    app.get('/dealmessages/:id', async (req, res) => {
        const id = req.params.id;
        let token = req.headers['authrorization'];
        const resolve = await JwtUtil.serverJwtValid(token);
        if(resolve){
           token = JwtUtil.updateToken(resolve, token);
           await Message.setDeal(id);
           res.send({success: true});
        }else{
            res.send({ success: false, msg: '更新消息状态失败!' });
        }
    })
}
