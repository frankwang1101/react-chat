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
          .getMessagesByUserId(uid);
  },
  getUndealCount: uid => {
    return MessageModel
          .getUndealCount(uid);
  },
  setDeal: id => {
    return MessageModel
          .update({_id:id},{$set:{isDeal:true}});
  }

}
