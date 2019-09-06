const common = require('./common').error
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const JWT_KEY = require('../config').JWT_KEY

exports.login = (req, res) => {
  console.log(req.body)
  User.find({ name : req.body.name })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(500).json({
          message: 'User is already exist'
        })
      } else {
        const user = new User({
          name: req.body.name
        })
        user.save()
          .then(result => {
            const token = jwt.sign({
              userId:result._id,
              name: result.name,
            }, 
            JWT_KEY,
            {
              expiresIn: "1h"
            })

            console.log(token)
            res.status(201).json({
              message: 'User is created',
              user: result,
              token: token
            })
          })
          .catch(err => res.error(err))
      }
    })
}

exports.get_all = (req, res) => {
  User.find({ name : req.body.name })
  .exec()
  .then(user => {
      console.log(user)
      res.status(200).json({ user: user })
    })
    .catch(err => res.error(err))
}