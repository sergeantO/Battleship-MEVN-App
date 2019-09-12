const jwt = require("jsonwebtoken")
const JWT_KEY = require('config').JWT_KEY
const send = require('../helpers/sender')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, JWT_KEY)
    req.userData = decoded
    next()
  } catch(error) {
    return send(res).unauthorized()
  }
}