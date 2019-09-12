const config = require('config')
const log = require('./loger')

let sender = (res) => {
  let send = (status, resp) => {
    log(`=========== ${status} ============`)
    log(resp)
    log(`============================`)

    res.status(status).json(resp)
  }
  
  let unauthorized = () => {
    send(401, { message: 'Access denied' })
  }

  let error = (msg, err) => {
    send(500, { message: msg, ...err })
  }

  let badRequest = (msg, data = null) => {
    send(400, { message: msg, ...data })
  }

  let notFound = (msg, data = null) => {
    send(404, { message: msg, ...data })
  }
  
  let ok = (msg, data) => {
    send(200, { message: msg, ...data })
  }
  
  let created = (msg, data) => {
    send(201, { message: msg, ...data })
  }

  return {
    error, 
    ok, 
    created, 
    badRequest, 
    notFound,
    unauthorized
  }
}

module.exports = sender;

