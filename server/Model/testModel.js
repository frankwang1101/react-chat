import User from './User'
import Message from './Message'
import Room from './Room'

//添加好友测试
// User.addFriend({fid:'5900a306c8aa1d235097a85b',tid:'5900a39dc8aa1d235097a85d'})
// .then( res => {
//   console.log(res);
// })

//获取未读消息数量设置
// Message.getUndealCount('5900a373c8aa1d235097a85c').then(res => console.log(res));
//获取消息设置
// Message.getMessagesByUserId('5900a373c8aa1d235097a85c').then(res => console.log(res));

//获取用户相关群组
// Room.getUserRoom('5900a306c8aa1d235097a85b').then(res => {
//   console.log(res);
//   return;
// })
//获取群组信息
Room.getRoomById('591c47348ef1b958400c40fd').then( res => console.log(res.toObject()));
