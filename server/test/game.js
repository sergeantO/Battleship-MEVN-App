//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let Game = require('../src/models/game')
let User = require('../src/models/user')

//Подключаем dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../src/index')
let should = chai.should()

chai.use(chaiHttp);
// Main block
describe('Games', () => {
  let user1 = new User({ name: "Ivan" })
  let user2 = new User({ name: "Petr" })
  let token1
  let token2
  let shipList1 = [
    {"coords":[{"x":3,"y":9},{"x":4,"y":9},{"x":5,"y":9},{"x":6,"y":9}]},
    {"coords":[{"x":1,"y":0},{"x":2,"y":0},{"x":3,"y":0}]},
    {"coords":[{"x":1,"y":6},{"x":2,"y":6},{"x":3,"y":6}]},
    {"coords":[{"x":5,"y":4},{"x":5,"y":5}]},
    {"coords":[{"x":1,"y":3},{"x":2,"y":3}]},
    {"coords":[{"x":7,"y":7},{"x":8,"y":7}]},
    {"coords":[{"x":1,"y":9}]},
    {"coords":[{"x":9,"y":2}]},
    {"coords":[{"x":8,"y":5}]},
    {"coords":[{"x":4,"y":2}]}
  ]
  let shipList2 = [
    {"coords":[{"x":5,"y":6},{"x":5,"y":7},{"x":5,"y":8},{"x":5,"y":9}]},
    {"coords":[{"x":1,"y":4},{"x":1,"y":5},{"x":1,"y":6}]},
    {"coords":[{"x":6,"y":0},{"x":7,"y":0},{"x":8,"y":0}]},
    {"coords":[{"x":5,"y":3},{"x":6,"y":3}]},
    {"coords":[{"x":1,"y":9},{"x":2,"y":9}]},
    {"coords":[{"x":2,"y":2},{"x":3,"y":2}]},
    {"coords":[{"x":7,"y":5}]},
    {"coords":[{"x":9,"y":7}]},
    {"coords":[{"x":2,"y":0}]},
    {"coords":[{"x":4,"y":0}]}
  ]
  let gameID

  before((done) => { // Drop db before tests
    const jwt = require("jsonwebtoken")
    const JWT_KEY = require('config').JWT_KEY

    Game.remove({}, () => {
      User.remove({}, () => {
        user1.save((err, user) => { 
          token1 = jwt.sign({
            userId: user._id,
            name: user.name,
            }, 
            JWT_KEY,
            {
              expiresIn: "365d"
            })

          user2.save((err, user) => { 
            token2 = jwt.sign({
              userId: user._id,
              name: user.name,
              }, 
              JWT_KEY,
              {
                expiresIn: "365d"
              })
  
            done()
          })  
        })
      })
    })
  })

  it('it should POST new game for user1', (done) => {
    chai.request(server)
      .post('/game/find')
      .set('authorization', 'Bearer ' + token1)
      .send(shipList1)
      .end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.should.have.property('message').eql('The game is created. Wait second player')
        res.body.should.have.property('gameID')
        gameID = res.body.gameID
        done();
      })
  })

  it('it should not GET game data for user1', (done) => {
    chai.request(server)
      .get('/game/waitEnemy/' + gameID)
      .set('authorization', 'Bearer ' + token1)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('message').eql('wait')
        done();
      })
  })

  it('it should POST new game for user2', (done) => {
    chai.request(server)
      .post('/game/find')
      .set('authorization', 'Bearer ' + token2)
      .send(shipList2)
      .end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.should.have.property('message').eql('The game is ready')
        res.body.should.have.property('gameID')
        res.body.should.have.property('turn')
        done();
      })
  })

  it('it should GET game data for user1', (done) => {
    chai.request(server)
      .get('/game/waitEnemy/' + gameID)
      .set('authorization', 'Bearer ' + token1)
      .end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.should.have.property('message').eql('The game is ready')
        res.body.should.have.property('gameID')
        res.body.should.have.property('turn')
        done();
      })
  })

  it('it should POST shot for user1', (done) => {
    chai.request(server)
      .post('/game/shot/' + gameID)
      .set('authorization', 'Bearer ' + token1)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('message')
        res.body.should.have.property('turn')
        done();
      })
  })

  it('it should POST shot for user2', (done) => {
    chai.request(server)
      .post('/game/shot/' + gameID)
      .set('authorization', 'Bearer ' + token2)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('message')
        res.body.should.have.property('turn')
        done();
      })
  })

});