const sender = require('./common')
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const JWT_KEY = require('../config').JWT_KEY

exports._get_rand_user = () => {
  return User.aggregate([
      { $match: { 'status': 'online' } }
    ]).sample(1)
    .then(user => {
      if (user.length === 1) {
        return user[0]
      }
    })
    .catch(err => sender(res).error(err))
}

exports._get_one_user = (userId) => {
  return User.findById(userId)
    .exec()
    .then(user => user)
    .catch(err => sender(res).error(err))
}

exports._user_is_online = (userId) => {
  return User.findByIdAndUpdate(userId, { status: 'online'})
    .exec()
    .then(user => user)
    .catch(err => sender(res).error(err))
}

exports._user_is_offline = (userId) => {
  return User.findByIdAndUpdate(userId, { status: 'offline'})
    .exec()
    .then(user => user)
    .catch(err => sender(res).error(err))
}

exports._user_is_played = (userId) => {
  return User.findByIdAndUpdate(userId, { status: 'played'})
    .exec()
    .then(user => user)
    .catch(err => sender(res).error(err))
}

exports.signup = (req, res) => {
  const userName = req.body.name
  User.find({ name : userName })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return sender(res).badRequest('User name is already exist') 
      } 

      if (userName == '') {
        return sender(res).badRequest('User name can\'t empty')
      }

      const newUser = new User({
        name: userName
      })
      newUser.save()
        .then(result => {
          const token = jwt.sign({
            userId:result._id,
            name: result.name,
          }, 
          JWT_KEY,
          {
            expiresIn: "365d"
          })
          const response = {
            id: result._id,
            name: result.name,
            winrate: Math.round(result.wins * 100 / result.games) 
          }

          return sender(res).created('User is created', {user: response, token: token})
        })
        .catch(err => sender(res).error(err))
      
    })
}

exports.login = async(req, res) => {
  const userId = req.userData.userId
  const user = await UsersController._get_one_user(userId)
  const response = {
    id: user._id,
    name: user.name,
    winrate: Math.round(user.wins * 100 / user.games) 
  }
  return sender(res).created('User data', response)
}

exports.logout = async(req, res) => {
  const userId = req.userData.userId
  return _user_is_offline(userId)
}

exports.get_all = (req, res) => {
  User.find({ name : req.body.name })
  .exec()
  .then(user => {
      sender(res).ok('User list', { user: user })
    })
    .catch(err => sender(res).error(err))
}