const router = require('express').Router()
const GameController = require('../controllers/game-controller')
const checkAuth = require('../middleware/check-auth')

router.post('/find', checkAuth, GameController.find)

module.exports = router