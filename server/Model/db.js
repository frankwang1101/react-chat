import mongoose from 'mongoose'
import moment from 'moment'
import objectIdToTimestamp from 'objectid-to-timestamp'
import {DBCONFIG} from '../config/config'

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
    avatar: String
})
User.plugin(createAt);
User.index({ username: 1, unique: true });

exports.UserModel = db.model('User', User);