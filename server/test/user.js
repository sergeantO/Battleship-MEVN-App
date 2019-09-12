//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let User = require('../src/models/user')

//Подключаем dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../src/index')
let should = chai.should()

chai.use(chaiHttp);
// Main block
describe('Users', () => {
  beforeEach((done) => { // Drop db before test
    User.remove({}, (err) => { 
      done();         
    })    
  })

  it('it should GET all users', (done) => {
    chai.request(server)
      .get('/user')
      .end((err, res) => {
        res.should.have.status(200);
        // res.should.have.property('message')
        res.body.users.should.be.a('array');
        res.body.users.length.should.be.eql(0);
        done();
      })
  })


  it('it should not POST a user without name field', (done) => {
    let user = {}
    chai.request(server)
      .post('/user/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('name');
        res.body.errors.name.should.have.property('kind').eql('required');
        done();
      })
  })

  it('it should POST a user ', (done) => {
    let user = { name: "Ivan"}
    chai.request(server)
      .post('/user/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User is created');
        res.body.should.have.property('token')
        res.body.should.have.property('user')
        res.body.user.should.have.property('id');
        res.body.user.should.have.property('name');
        res.body.user.should.have.property('winrate').eql(50);
        done();
      })
  })

  it('it should not GET a user without token', (done) => {
    chai.request(server)
      .get('/user/login')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Access denied')
        done();
      })
  })

  it('it should GET a user by the given token', (done) => {
    const jwt = require("jsonwebtoken")
    const JWT_KEY = require('config').JWT_KEY

    let user = new User({ name: "Ivan" })
    user.save((err, user) => { 
      let token = jwt.sign({
        userId: user._id,
        name: user.name,
        }, 
        JWT_KEY,
        {
          expiresIn: "365d"
        })

      chai.request(server)
        .get('/user/login')
        .set('authorization', 'Bearer ' + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User data')
          res.body.should.have.property('id')
          res.body.should.have.property('name')
          res.body.should.have.property('winrate')
          done();
        })
    })
  })
});