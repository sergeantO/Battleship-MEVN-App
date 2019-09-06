const router = require('express').Router()
const UsersController = require('../controllers/user-controller')

router.get('/', UsersController.get_all)
router.post('/signup', UsersController.login)

module.exports = router