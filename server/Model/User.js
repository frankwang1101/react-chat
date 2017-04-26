import {UserModel} from './db'
module.exports = {
    create: (user) => {
        return UserModel(user).save();
    },
    getUserById: id => {
        return UserModel
            .findOne({_id:id})
            .exec();
    },
    check: info => {
        return UserModel
            .findOne({username:info.username,password:info.password})
            .exec();
    },
    checkjwt: info => {
        return UserModel
            .findOne({username:info.username,_id:info._id})
            .exec();
    },
    delById: id => {
        return UserModel.remove({_id:id}).exec();
    },
    update: data => {
        return UserModel
            .update({_id:id},{$set:data})
            .exec();
    }
}