import { message } from 'antd'

export function sendMessage(type, msg, dur, cb) {
  message[type](msg, dur, cb);
}
