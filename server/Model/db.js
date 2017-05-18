import mongoose from 'mongoose'
import moment from 'moment'
import objectIdToTimestamp from 'objectid-to-timestamp'
import {DBCONFIG} from '../config/config'

const ObjectId = mongoose.Schema.Types.ObjectId;

var db = mongoose.createConnection(DBCONFIG.HOST, DBCONFIG.DATABASE, DBCONFIG.PORT);
db.on('error', console.error.bind(console, 'connection error:'))
const createAt = (schema, object) => {
    schema.add({ create_at: String });
    schema.post('init', (doc) => {
        doc.create_at = moment(objectIdToTimestamp(doc._id)).format('YYYY-MM-DD HH:mm');
        // console.log(doc)
    })
}
const User = mongoose.Schema({
    nickname: String,
    username: String,
    password: String,
    gender: String,
    avatar: String,
    online: Boolean,
})
User.add({
    friends: [{ type:  ObjectId, ref: 'User' }]
})
User.plugin(createAt);
User.index({ username: 1, unique: true });

exports.UserModel = db.model('User', User);

const Room = mongoose.Schema({
    roomname: String,
    roomdesc: String,
    needCheck: Boolean,
    administrators: [{ type:  ObjectId, ref: 'User' }],
    members: [{ type:  ObjectId, ref: 'User' }],
    owner: { type:  ObjectId, ref: 'User' }
})

Room.plugin(createAt);

exports.RoomModel = db.model('Room',Room);

const Message = mongoose.Schema({
    title: String,
    content: String,
    type: String,
    isDeal: Boolean,
    data: String,
    result: Boolean,
    toUser: { type: ObjectId, ref: 'User'},
})

Message.plugin(createAt);

exports.MessageModel = db.model('Message',Message);