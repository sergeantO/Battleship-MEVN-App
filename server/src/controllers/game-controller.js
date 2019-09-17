const sender = require('../helpers/sender')
const Game = require('../models/game')
const UsersController = require('./user-controller')

_get_one_game = (id) => {
  return Game.findById(id)
    .exec()
    .then(game => game)
    .catch(err => sender(res).error(err))
}

exports.find = async(req, res) => {
  // player ship list validation
  const playerShips = req.body
  if (!playerShips || 
    !Array.isArray(playerShips) || 
    playerShips.length !== 10) 
  { 
    return sender(res).badRequest('Ship list expected')
  } else {
    try {
      // player ship list processing
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

  // add player 2 to game
  const userId = req.userData.userId
  const data = {
    player2: userId,
    player2_ships: playerShips
  }
 
  Game.findOneAndUpdate({ 
    $and: [
      {player1: { $nin: userId }},
      {player2: { $exists: false }}
    ]
     
    }, data)
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
        turn: turn
      })

      newgame.save()
        .then(game => {
          let resp = {
            gameID: game._id
          }
          return sender(res).created('The game is created. Wait second player', resp)
        })
        .catch(err => sender(res).error(err))
    }) 
}

exports.waitEnemy = async(req, res) => { 
  const gameId = req.params.gameId
  const game = await _get_one_game(gameId)
  if (game.player2) {
    let resp = { 
      gameID: game._id, 
      turn: game.turn == 1
    }
    return sender(res).created('The game is ready', resp)
  } else {
    return sender(res).ok('wait')
  }
}

exports.shot = async(req, res) => { 
  const shotCoords = req.body
  const gameId = req.params.gameId
  const game = await _get_one_game(gameId)
  const userId = req.userData.userId

  let playerNumber
  let enemyShips
  let playerShots
  let turn = game.turn
  if (userId == game.player1) {
    playerNumber = 1
    enemyShips = game.player2_ships
    playerShots = game.player1_shots
  } else if (userId == game.player2) {
    playerNumber = 2
    enemyShips = game.player1_ships
    playerShots = game.player2_shots
  } 

  if (turn != playerNumber)
  {
    return sender(res).ok('Not your turn', {turn: false})
  } 

  // 
  let shotResault = ''
  let hit = false
  enemyShips.map(ship => {
    if (hit) return

    ship.coords.forEach(coord => {
      if (coord.x === shotCoords.x && coord.y === shotCoords.y) {
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

  let newShot = {...shotCoords, status: shotResault}
  playerShots.push(newShot)

  let updateData
  if (playerNumber === 1) {
    updateData = {
      player1_shots: playerShots,
      player2_ships: enemyShips,
      turn: turn
    }
  } else if (playerNumber === 2) {
    updateData = {
      player1_ships: enemyShips,
      player2_shots: playerShots,
      turn: turn
    }
  } 
  
  if (shotResault === 'killed') {
    if (enemyShips.every(ship => ship.status == 'killed')) {
      message = 'you win'
      updateData.winner = userId
    } 
  }

  Game.findByIdAndUpdate(gameId, updateData)
    .exec()
    .then(() => {
      const resp = { 
        point: newShot, 
        turn: turn == playerNumber 
      }
      return sender(res).ok(message, resp)
    })
    .catch(err => sender(res).error(err))
}

exports.waitTurn = async(req, res) => { 
  
  const gameId = req.params.gameId
  const game = await _get_one_game(gameId)
  

  if (game.winner) {
    sender(res).ok('you lose')
    Game.findByIdAndDelete(gameId)
      .exec()
      .catch(err => sender(res).error(err))
  }

  const userId = req.userData.userId
  let playerNumber
  let playerShots
  if (userId == game.player1) {
    playerNumber = 1
    playerShots = game.player2_shots
  } else if (userId == game.player2) {
    playerNumber = 2
    playerShots = game.player1_shots
  }

  Game.findById(gameId)
    .exec()
    .then(() => {
      const resp = { 
        playerShots,
        turn: game.turn == playerNumber
      }
      let message = ''
      if (game.turn != playerNumber) {
        message = 'wait'
      }
      console.log('ghjdfk')
      return sender(res).ok(message, resp)
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
