const concat = require('async').concat
const request = require('request')

const key = '5GQvmmnvbqFr1kUoWjG4jt5l4dlPW16YwA3Ww8x'

module.exports = (result, callback) => concat(result.links, (val, callback) => {
  if (val === ``) {
    return callback(null)
  }
  console.log(`Fetching: ${val}`)
  request({
    method: 'POST',
    url: 'https://loadercdn.io/api/v1/create',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({key, 'link': val, 'format': 'mp4', 'direct': false})
  }, (error, response, body) => {
    if (error) {
      throw new Error(error)
    }
    if (typeof JSON.parse(body).url === 'undefined') {
      throw new Error('Opss.. Something went wrong')
    }
    callback(null, {url: JSON.parse(body).url, name: JSON.parse(body).filename})
  })
}, (error, result) => {
  if (error) {
    throw new Error(error)
  }
  callback(null, result)
})
