const common = require('./common').error
const Game = require('../models/game')
const jwt = require("jsonwebtoken")
const JWT_KEY = require('../config').JWT_KEY

exports.find = (req, res) => {
  console.log(req.body)
  res.status(201).json({
    message: 'No more players'
  })
}
