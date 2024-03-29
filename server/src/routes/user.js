const router = require('express').Router()
const UsersController = require('../controllers/user-controller')
const checkAuth = require('../middleware/check-auth')

router.post('/signup', UsersController.signup)
router.get('/login', checkAuth, UsersController.login)
router.get('/', UsersController.get_all)

module.exports = router