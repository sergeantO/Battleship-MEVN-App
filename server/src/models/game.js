const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
  player1: { type: mongoose.SchemaTypes.ObjectId, ref:'User', required: true },
  player1_ships: { type: Array, required: true },
  player1_shots: { type: Array },

  player2: { type: mongoose.SchemaTypes.ObjectId, ref:'User' },
  player2_ships: { type: Array },
  player2_shots: { type: Array },
  
  turn: { type: Number, default: 1 },
  winner: { type: String }
}, 
{ versionKey: false })

module.exports = mongoose.model('Game',  gameSchema)