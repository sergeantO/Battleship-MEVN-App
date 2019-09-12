const log = require('./helpers/loger')
let express = require('express')
let bodyParser = require('body-parser')
let cors = require('cors')
let morgan = require('morgan')
let mongoose = require('mongoose')
let config = require('config')
mongoose.Promise = global.Promise

let app = express(config)

// hide logs in test enviroment
if(config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('combined')); 
}
app.use(bodyParser.json())
app.use(cors())

// Routes
app.get("/", require("./routes/endpoints"));
app.use("/user", require("./routes/user"))
app.use("/game", require("./routes/game"))

// Erorrs
app.use((req, res, next) => {
  const error = new Error('Path not found');
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

// Start Server
mongoose.connect(config.server.dbURL, config.server.dbOptions)
let db = mongoose.connection
  .once('open', () => {
    log(`Mongoose - successful connection ...`)
    const port = process.env.PORT || config.server.port
    app.listen(port,
      () => log(`Server start on adress http://localhost:${port} ...`))
  })
  .on('error', (err) => { log('connection error:' + err)} )

  module.exports = app; // for testing