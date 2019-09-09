exports.error = (res, err) => {
  console.log("\x1b[31m%s\x1b[0m", `=======================\nError: ${ err }`)
  res.status(500).json({ Error: err })
}