const router = require('express').Router()

router.get('/', (req, res) => {
  const endpoints = [
    '/user/signup', 
    '/game/find/:userId',
    '/game/shot/:userId',
  ]
  
  res.status(200).json(endpoints)
})

module.exports = router
