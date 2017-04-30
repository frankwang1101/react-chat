import User from './User'

User.findUser('a').then( res => {
  console.log(res)
})