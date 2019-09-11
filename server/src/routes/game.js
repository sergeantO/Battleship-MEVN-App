const router = require('express').Router()
const GameController = require('../controllers/game-controller')
const checkAuth = require('../middleware/check-auth')

router.post('/find', checkAuth, GameController.find)
router.post('/shot/:gameId', checkAuth, GameController.shot)
router.get('/wait/:gameId', checkAuth, GameController.wait)
router.get('/reconnect/:gameId', checkAuth, GameController.reconnect)

module.exports = router