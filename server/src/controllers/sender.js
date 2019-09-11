let sender = (res) => {
  let send = (status, resp) => {
    console.log(`=========== ${status} ============`)
    console.log(resp)
    console.log('============================')

    res.status(status).json(resp)
  }
  
  let error = (err) => {
    send(500, { message: err })
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
    notFound
  }
}

module.exports = sender;

