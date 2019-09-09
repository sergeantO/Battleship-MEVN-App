const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
  player1: { type: mongoose.SchemaTypes.ObjectId, ref:'User', required: true },
  player2: { type: mongoose.SchemaTypes.ObjectId, ref:'User', required: true },
  player1_ships: { type: Array, required: true },
  player2_ships: { type: Array, required: true },
  turn: { type: Number, default: 1 }
}, 
{ versionKey: false })

module.exports = mongoose.model('Game',  gameSchema)