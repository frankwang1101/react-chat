import {RoomModel} from './db'
module.exports = {
      
      create: room => {
        return RoomModel(room).save();
      },
      getRoomById: id => {
        return RoomModel
              .findOne({ _id:id})
              .populate({ path: 'members', select: '-password'})
              .populate({ path: 'administrators', select: '-password'})
              .populate({ path: 'owner', select: '-password'})
              .exec();
      },
      addMember: ({ roomId, userId}) => {
        return RoomModel
              .update({_id:roomId},{$pushAll:{members:userId}})
              .exec();
      },
      addAdmin: ({ roomId, userId}) => {
        return RoomModel
              .update({_id:roomId},{$push:{administrators:userId}})
              .exec();
      },
      quit: uid => {
        return RoomModel
              .update({_id:roomId},{$pop:{members:userId,administrators:userId}})
              .exec();
      },
      cancelAdmin: uid => {
        return RoomModel
              .update({_id:roomId},{$pop:{administrators:userId}})
              .exec();
      },
      getUserRoom: uid => {
        return RoomModel
              .find({"$or":[{administrators:uid},{owner:uid},{members:uid}]})
              .exec();
      },
      checkAddAuth: uid => {
        return RoomModel
              .find({"or":[{administrators:uid},{owner:uid}]})
              .exec();
      },
      checkOwner: (roomId, uid) => {
        return RoomModel
              .find({_id:roomId,owner:uid})
              .exec();
      },
      authManage: (id, adminIds) => {
        return RoomModel
              .update({_id:id},{$pop:{members:adminIds},$push:{administrators:adminIds}})
              .exec();
      },
      remove: (id) => {
        return RoomModel
              .remove({_id:id})
              .exec();
      }
}
