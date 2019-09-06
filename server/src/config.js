module.exports = {
  'server': {
    port: 8081,
    dbURL: 'mongodb://localhost/buttleship',
    dbOptions: { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
  },
  JWT_KEY: "secret"
}