let sender = (res) => {
  let error = (err) => {
    console.log("\x1b[31m%s\x1b[0m", `=======================\nError: ${ err }`)
    res.status(500).json({ message: err })
  }

  let badRequest = (msg, data = null) => {
    res.status(400).json({ message: msg, ...data })
  }

  let notFound = (msg, data = null) => {
    res.status(404).json({ message: msg, ...data })
  }
  
  let ok = (msg, data) => {
    res.status(200).json({ message: msg, ...data })
  }
  
  let created = (msg, data) => {
    res.status(201).json({ message: msg, ...data })
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

