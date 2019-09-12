module.exports = () => { 
  return log = (str) => {
    if(config.util.getEnv('NODE_ENV') === 'test') {
      console.log('============================')
      console.log(str)
      console.log('============================')
    }
  }
}