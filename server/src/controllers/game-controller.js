const error = require('./common').error
const Game = require('../models/game')
// const UsersController = require('./user-controller')
const User = require('../models/user')

_get_rand_user = () => {
  return User.aggregate([
      { $match: { 'status': 'online' } }
    ]).sample(1)
    .then(user => {
      if (user.length === 1) {
        return user[0]
      }
    })
    .catch(err => console.log(err))
}

_get_one_user = (id) => {
  return User.findById(id)
    .exec()
    .then(user => user)
    .catch(err => error(res, err))
}

_get_one_game = (id) => {
  return Game.findById(id)
    .exec()
    .then(game => game)
    .catch(err => error(res, err))
}

exports.find = async(req, res) => {
  const rnd = await _get_rand_user()
  const user = await _get_one_user(req.params.userId)

  req.body.forEach(ship => {
    ship.status = 'intact'
    ship.coords.forEach(coord => {
      coord.status = 'intact'
    })
  })
  
  const newgame = new Game({
    player1: user._id,
    player2: rnd._id,
    player1_ships: req.body,
    player2_ships: req.body
  })

  newgame.save()
    .then(resault => {
      const resp = {
        gameID: resault._id, 
        turn: resault.turn
      }
      res.status(201).json(resp)
    })
    .catch(err => error(res, err))
}

exports.shot = async(req, res) => { 
  const point = req.body
  const game = await _get_one_game(req.params.gameId)
  
  let ships
  if (req.userData.userId == game.player1) {
    ships = game.player2_ships
  } else if (req.userData.userId == game.player2) {
    ships = game.player1_ships
  }

  let msg = 'error'
  let killed = false
  let hit = false
  ships.map(ship => {
    if (hit) return

    ship.coords.forEach(coord => {
      if (coord.x === point.x && coord.y === point.y) {
        coord.status = 'hit'
        hit = true
      }
    })

    if (hit) {
      if (ship.coords.every(coord => coord.status === 'hit')) {
        ship.status = 'killed'
        msg = 'killed'
        killed = true
      } else {
        ship.status = 'wounded'
        msg = 'wounded'
      }
    }
  })

  if (!hit) {
    msg = 'miss'
  }

  if (killed) {
    if (ships.every(ship => ship.status === 'killed')) {
      msg = 'win'
    } 
  }

  let data
  if (req.userData.userId == game.player1) {
    data = { player2_ships: ships }
  } else if (req.userData.userId == game.player2) {
    data = { player1_ships: ships }
  } 

  Game.findByIdAndUpdate(req.params.gameId, data)
    .exec()
    .then(resault => {
      console.log(msg)
      console.log(resault)
      res.status(200).json(msg)
    })
    .catch(err => error(res, err))
}
