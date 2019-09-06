const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  games: { type: Number, default: 0 },
  wins: { type: Number, default: 0 }
}, 
{ versionKey: false })

module.exports = mongoose.model('User',  userSchema)