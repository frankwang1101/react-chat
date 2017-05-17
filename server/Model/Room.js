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
              .update({_id:roomId},{$push:{members:userId}})
              .exec();
      },
      addAdmin: ({ roomId, userId}) => {
        return RoomModel
              .update({_id:roomId},{$push:{administrators:userId}})
              .exec();
      },
      quit: uid => {
        return RoomModel
              .update({_id:roomId},{$pop:{members:userId}})
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
      }
}