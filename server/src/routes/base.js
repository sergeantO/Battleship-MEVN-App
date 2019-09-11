const router = require('express').Router()

router.get('/', (req, res) => {
  const endpoints = [
    {
      path: '/user/signup',
      method: 'GET',
      tokenRequire: false,
      data: 'username',
    }, 
    {
      path: '/user/login',
      method: 'GET',
      tokenRequire: true
    },
    {
      path: '/user/logout',
      method: 'POST',
      tokenRequire: true
    },
    {
      path: '/game/find',
      method: 'POST',
      tokenRequire: true,
      data: '[playerShips]'
    },
    {
      path: '/game/shot/:gameId',
      method: 'POST',
      tokenRequire: true,
      data: '{point}'
    },
    {
      path: '/game/wait/:gameId',
      method: 'GET',
      tokenRequire: true
    },
    {
      path: '/game/reconnect/:gameId',
      method: 'GET',
      tokenRequire: true
    }
  ]
  
  res.status(200).json(endpoints)
})

module.exports = router
