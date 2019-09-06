const router = require('express').Router()

router.get('/', (req, res) => {
  const endpoints = {

  }
  
  res.status(200).json(endpoints)
})

module.exports = router
