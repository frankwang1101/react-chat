import {UserModel} from './db'
module.exports = {
    create: (user) => {
        return UserModel(user).save();
    },
    getUserById: id => {
        return UserModel
            .findOne({_id:id})
            .select('-password')
            .exec();
    },
    check: info => {
        return UserModel
            .findOne({username:info.username,password:info.password})
            .select('-password')
            .exec();
    },
    checkjwt: info => {
        return UserModel
            .findOne({username:info.username,_id:info._id})
            .select('-password')
            .exec();
    },
    delById: id => {
        return UserModel.remove({_id:id}).exec();
    },
    update: data => {
        return UserModel
            .update({_id:id},{$set:data})
            .select('-password')
            .exec();
    },
    findUser: keyword => {
        const query = new RegExp(keyword);
        return UserModel
            .find({
                $or: [
                    {nickname: query},
                    {username: query}
                ]
            }).select('-password').exec();
    }
}