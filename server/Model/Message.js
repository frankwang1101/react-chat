import { MessageModel } from './db'

module.exports = {
  
  create: message => {
    return MessageModel(message).save();
  },
  del: id => {
    return MessageModel
          .remove({_id:id})
          .exec();
  },
  getMessagesByUserId: uid => {
    return MessageModel
        .find({toUser:uid})
        .select('-toUser')
        .exec();
  },
  getUndealCount: uid => {
    return MessageModel
          .where({toUser:uid,isDeal:false})
          .count()
          .exec();
  },
  setDeal: id => {
    return MessageModel
          .update({_id:id},{$set:{isDeal:true}});
  }

}
