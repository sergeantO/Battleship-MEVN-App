const router = require('express').Router()
const UsersController = require('../controllers/user-controller')

router.post('/signup', UsersController.login)

module.exports = router