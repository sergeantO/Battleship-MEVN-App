const router = require('express').Router()
const GameController = require('../controllers/game-controller')
const checkAuth = require('../middleware/check-auth')

router.post('/find', checkAuth, GameController.find)
router.get('/waitEnemy/:gameId', checkAuth, GameController.waitEnemy)
router.post('/shot/:gameId', checkAuth, GameController.shot)
router.get('/waitTurn/:gameId', checkAuth, GameController.waitTurn)
router.get('/reconnect/:gameId', checkAuth, GameController.reconnect)

module.exports = router