const sender = require('./sender')
const Game = require('../models/game')
// const UsersController = require('./user-controller')

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
  const data = {
    player2: userId,
    player2_ships: playerShips
  }
  Game.findOneAndUpdate({ player2: { $exists: false, $nin: userId } }, data)
    .exec()
    .then(game => {
      let resp = { 
        gameID: game._id, 
        turn: game.turn == 2 
      }
      return sender(res).created('The game is ready', resp)
    })
    .catch(() => {
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
          let resp = { 
            gameID: game._id, 
            turn: game.turn == 1 
          }
          return sender(res).created('The game is created. Wait second player', resp)
        })
        .catch(err => sender(res).error(err))
    }) 
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

  let newPoint = {...point, status: shotResault}
  playerShots.push(newPoint)

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
    } 
  }

  console.log(`Игрок ${playerNumber} (${userId}) ${shotResault} в точке ${point}`)
  console.log(`Ход игрока ${turn}`)
  console.log('Новые данные: '+updateData)
  Game.findByIdAndUpdate(gameId, updateData)
    .exec()
    .then(resault => {
      console.log('Изменения сохранены')
      const resp = { 
        point: newPoint, 
        turn: turn == playerNumber 
      }
      return sender(res).ok(message, resp)
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
  }

  Game.findById(gameId)
    .exec()
    .then(() => {
      const resp = { 
        playerShots,
        turn: game.turn == playerNumber
      }
      return sender(res).ok('', resp)
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

  const resp = {
    playerShots, 
    enemyShots,
    playerShips,
    turn: game.turn == playerNumber
  }
  return sender(res).ok('reconect is comleted', resp)
}
