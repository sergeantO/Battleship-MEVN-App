const mongoose = require('mongoose')

const waitingPlayerSchema = mongoose.Schema({
  player: { type: mongoose.SchemaTypes.ObjectId, required: true },
  player_ships: { type: Array, required: true },
}, 
{ versionKey: false })

module.exports = mongoose.model('waitingPlayer',  waitingPlayerSchema)