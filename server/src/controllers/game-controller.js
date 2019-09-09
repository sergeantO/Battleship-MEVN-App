const error = require('./common').error
const Game = require('../models/game')
// const waitingPlayer = require('../models/waitingPlayer')
// const UsersController = require('./user-controller')
const User = require('../models/user')

_get_rand_user = () => {
  return User.aggregate([
      { $match: { 'status': 'online' } }
    ]).sample(1)
    .then(user => {
      if (user.length === 1) {
        return user[0]
      }
    })
    .catch(err => console.log(err))
}

_get_one_user = (id) => {
  return User.findById(id)
    .exec()
    .then(user => user)
    .catch(err => error(res, err))
}

exports.find = async(req, res) => {
  const rnd = await _get_rand_user()
  const user = await _get_one_user(req.params.userId)

  const newgame = new Game({
    player1: user._id,
    player2: rnd._id,
    player1_ships: req.body,
    player2_ships: req.body
  })

  newgame.save()
    .then(resault => res.status(201).json(resault._id))
    .catch(err => error(res, err))

  

  // let rndUser = await UsersController.get_rand()
  
  // if (rndUser === null) {
  //   res.status(201).json(rndUser)
  // } else {
    // const wPlayer = new waitingPlayer({
    //   player: req.params.id,
    //   player_ships: req.body
    // })
    // console.log(wPlayer)
  //   wPlayer.save()
  //     .than(resault => res.status(201).json(resault))
  //     
  // }

  
}

// Post.findById(req.params.id)
// .select("title description _id")
// .exec()
// .then(post => {
//   console.log(post)
//   if (post) {
//     res.status(200).json({
//       post: post,
//       request: {
//         type: 'GET',
//         url: 'http://localhost:8081/posts/' + post._id
//       }
//     })
//   } else {
//     res.status(404).json({message: 'No value entry found for provided ID'})
//   }
 
// })
// .catch(err => common.error(res, err))


