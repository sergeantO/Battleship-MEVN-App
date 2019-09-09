const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String }, // Offline, findGame, inGame
  games: { type: Number, default: 0 },
  wins: { type: Number, default: 0 }
}, 
{ versionKey: false })

module.exports = mongoose.model('User',  userSchema)