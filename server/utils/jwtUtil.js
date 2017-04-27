import jwt from 'jwt-simple'
import fetch from 'isomorphic-fetch'
import moment from 'moment'
import User from '../Model/User'

//验证token
export function checkJwt(token) {
  return new Promise((resolve, reject) => {
    try {
      const decode = jwt.decode(token, 'jwtSecret');
      if (decode.exp > Date.now()) {
        const id = decode.info._id;
        const username = decode.info.username;
        const url = 'http://localhost:3000/checkjwt';
        fetch(url, {
          method: 'post',
          body: JSON.stringify({ _id: id, username: username })
        }).then(res => res.json()).then(result => {
          //存在用户数据，则存入state，否则去掉本地储存的token
          if (result && Object.keys(result).length > 0) {
            resolve(result);
          } else {
            reject();
          }
        })

      }
    } catch (e) {
      console.log(e)
    }
  })

}

export function serverJwtValid(token, cb) {
  return new Promise((resolve, reject) => {
    try {
      const decode = jwt.decode(token, 'jwtSecret');
      if (decode.exp > Date.now()) {
        const _id = decode.info._id;
        const username = decode.info.username;
        User.checkjwt({ _id, username }).then(result => {
          if(result && Object.keys(result).length > 0){
            resolve(result)
          }else{
            reject();
          }
        }).catch(err => {
          throw new Error(err);
        })

      } else {
        reject('登录验证已过期，请重新登录!')
      }
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  })
}

export function addToken(info, req) {
  try {
    const expire = moment().add(7, 'days').valueOf();
    const token = jwt.encode({ exp: expire, info: { username: info.username, _id: info._id }, iss: 'admin' }, 'jwtSecret');
    return token;
  } catch (err) {
    console.log(err)
  }
  return null;
}

export function updateToken(info, token) {
  try {
    let decode = jwt.decode(token, 'jwtSecret');
    decode = Object.assign({}, decode, { info: { username: info.username, _id: info._id } });
    token = jwt.encode(decode, 'jwtSecret');
    return token;
  } catch (err) {
    console.log(err)
  }
  return null;
}