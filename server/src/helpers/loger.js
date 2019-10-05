let config = require('config')

module.exports = (str) => {
  if(config.util.getEnv('NODE_ENV') !== 'test') {
    console.log('============================')
    console.log(str)
  }
} 