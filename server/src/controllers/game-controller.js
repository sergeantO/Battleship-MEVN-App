const sender = require('./common')
const Game = require('../models/game')
const UsersController = require('./user-controller')

_get_one_game = (id) => {
  return Game.findById(id)
    .exec()
    .then(game => game)
    .catch(err => sender(res).error(err))
}

exports.find = async(req, res) => {
  const playerShips = req.body
  if (!playerShips || 
    !Array.isArray(playerShips) || 
    playerShips.length !== 10) 
  { 
    return sender(res).badRequest('Ship list expected')
  } else {
    try {
      playerShips.forEach(ship => {
        ship.status = 'intact'
        ship.coords.forEach(coord => {
          coord.status = 'intact'
        })
      })
    } catch {
      return sender(res).badRequest('Ship list expected')
    }
  }

  const userId = req.userData.userId
  const user = await UsersController._get_one_user(userId)
  if (user.status == 'online') {
    const data = {
      player2: userId,
      player2_ships: playerShips
    }
    Game.findOneAndUpdate({ player1: { $exists: true, $nin: userId } }, data)
      .exec()
      .then(game => {
        console.log(game)
        let resp = { gameID: game._id }
        if (game.turn == 2) {
          resp.turn = true
        } else {
          resp.turn = false
        }
        UsersController._user_is_played(userId)
        return sender(res).created('The game is ready', resp)
      })
      .catch(err => sender(res).error(err))
  } else {
    const rnd = await UsersController._get_rand_user()
    if (!rnd || rnd._id.equals(userId)) { 
      UsersController._user_is_online(userId)
      return sender(res).notFound('No more players')
    } 

    // Create new game
    let turn = Math.round(Math.random()) + 1 
    const newgame = new Game({
      player1: userId,
      player1_ships: playerShips,
      last_points: [],
      turn: turn
    })

    newgame.save()
      .then(game => {
        let resp = { gameID: game._id }
        if (game.turn == 1) {
          resp.turn = true
        } else {
          resp.turn = false
        }
        UsersController._user_is_played(userId)
        return sender(res).created('The game is created. Wait second player', resp)
      })
      .catch(err => sender(res).error(err))
  }
}

exports.shot = async(req, res) => { 
  const point = req.body
  const gameId = req.params.gameId
  const game = await _get_one_game(gameId)
  const userId = req.userData.userId

  let playerNumber
  let playerShips
  let playerShots
  let turn = game.turn
  if (userId == game.player1) {
    playerNumber = 1
    playerShips = game.player2_ships
    playerShots = game.player1_shots
  } else if (userId == game.player2) {
    playerNumber = 2
    playerShips = game.player1_ships
    playerShots = game.player2_shots
  } else {
    return sender(res).badRequest('Not your game')
  }

  if (game.turn != playerNumber)
  {
    return sender(res).badRequest('Not your turn', {turn: false})
  } 

  let shotResault = 'error'
  let hit = false
  playerShips.map(ship => {
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
        shotResault = 'killed'
      } else {
        ship.status = 'wounded'
        shotResault = 'wounded'
      }
    }
  })

  let message = 'Nice shot'
  if (!hit) {
    shotResault = 'miss'
    message = 'Miss'
    if (turn == 1) {
      turn = 2
    } else {
      turn = 1
    }
  }

  playerShots.push({...point, ...shotResault})

  let updateData
  if (playerNumber === 1) {
    updateData = {
      player2_shots: playerShots,
      turn: turn
    }
  } else if (playerNumber === 2) {
    updateData = {
      player1_shots: playerShots,
      turn: turn
    }
  } 
  
  if (shotResault === 'killed') {
    if (playerShips.every(ship => ship.status == 'killed')) {
      message = 'You win'
      updateData.winner = userId
      UsersController._user_is_offline(game.player1)
      UsersController._user_is_offline(game.player2)
    } 
  }

  Game.findByIdAndUpdate(gameId, updateData)
    .exec()
    .then(resault => {
      return sender(res).ok(message, turn)
    })
    .catch(err => sender(res).error(err))
}

exports.wait = async(req, res) => { 
  const gameId = req.params.gameId
  const game = await _get_one_game(gameId)

  if (game.winner) {
    Game.findByIdAndDelete(gameId)
      .exec()
      .then(() => {
        return sender(res).ok('you lose')
      })
      .catch(err => sender(res).error(err))
  }

  const userId = req.userData.userId
  let playerNumber
  let playerShots
  if (userId == game.player1) {
    playerNumber = 1
    playerShots = game.player1_shots
  } else if (userId == game.player2) {
    playerNumber = 2
    playerShots = game.player2_shots
  } else {
    return sender(res).badRequest('Not your game')
  }

  let turn
  let message
  if (game.turn == playerNumber) {
    turn = true
    message = 'shoot now'
  } else {
    turn = false
    message = 'wait some more'
  }

  Game.findById(gameId)
    .exec()
    .then(() => {
      return sender(res).ok(message, { playerShots, turn })
    })
    .catch(err => sender(res).error(err))
      
}

exports.reconnect = async(req, res) => { 
  const gameId = req.params.gameId
  const game = await _get_one_game(gameId)
  const userId = req.userData.userId

  let playerNumber
  let playerShots
  let enemyShots
  if (userId == game.player1) {
    playerNumber = 1
    playerShips = game.player1_ships
    playerShots = game.player1_shots
    enemyShots = game.player2_shots
  } else if (userId == game.player2) {
    playerNumber = 2
    playerShots = game.player2_shots
    playerShots = game.player2_shots
    enemyShots = game.player1_shots
  } else {
    return sender(res).badRequest('Not your game')
  }

  if (game.turn == playerNumber) {
    turn = true
  } else {
    turn = false
  }

  return sender(res).ok('reconect is comleted', { playerShots, enemyShots })
}
