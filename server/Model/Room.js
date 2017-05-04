import {RoomModel} from './db'
module.exports = {
      
      create: room => {
        return RoomModel(room).save();
      },
      getRoomById: id => {
        return RoomModel
              .findOne({ _id:id})
              .populate({ path: 'administrators', select: '-password'})
              .populate({ path: 'owner', select: '-password'})
              .exec();
      },
      addMember: ({ roomId, userId}) => {
        return RoomModel
              .update({_id:roomId},{$push:{members:{_id:userId}}})
              .exec();
      },
      addAdmin: ({ roomId, userId}) => {
        return RoomModel
              .update({_id:roomId},{$push:{administrators:{_id:userId}}})
              .exec();
      },
      quit: uid => {
        return RoomModel
              .update({_id:roomId},{$pop:{members:{_id:userId}}})
              .exec();
      },
      cancelAdmin: uid => {
        return RoomModel
              .update({_id:roomId},{$pop:{administrators:{_id:userId}}})
              .exec();
      },
      getUserRoom: uid => {
        return RoomModel
              .getUserRoom(uid);
      }
}