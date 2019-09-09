const router = require('express').Router()
const GameController = require('../controllers/game-controller')
const checkAuth = require('../middleware/check-auth')

router.post('/find/:userId', checkAuth, GameController.find)
router.post('/shot/:gameId', checkAuth, GameController.shot)

module.exports = router