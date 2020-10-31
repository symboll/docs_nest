const redis = require('redis')
const { redisConfig } = require('../config/db')

const redisClient = redis.createClient(redisConfig.port, redisConfig.host)
redisClient.on('error', err=> {
  console.log(err)
})

function set(key, val) {
  if(typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key,val, redis.print)
}

function get(key) {
  return new Promise((resolve, reject)=> {
    redisClient.get(key, (err,val) => {
      if(err) {
        reject(err)
        return
      }
      if(val === null) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(val))
      }catch (e) {
        resolve(val)
      }
    })
  })
}

module.exports ={
  set,
  get
}