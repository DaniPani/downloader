const ilgeniodellostreaming = require('./src/ilgeniodellostreaming')
const fs = require('fs')
const request = require('request')
const concat = require('async').concat
const waterfall = require('async').waterfall

const key = '5GQvmmnvbqFr1kUoWjG4jt5l4dlPW16YwA3Ww8x'

module.exports = url => {
  if (/^(http:\/\/ilgeniodellostreaming.org)/.test(url)) {
    waterfall([
      ilgeniodellostreaming.bind(null, url),
      (result, callback) => {
        console.log('Fetching...')
        concat(result.links, (val, callback) => {
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
            console.log(JSON.parse(body).formats[0].url)
            callback(null, {url: JSON.parse(body).formats[0].url, name: JSON.parse(body).filename})
          })
        }, (err, result) => {
          if (err) {}
          callback(null, result)
        })
      },
      (result, callback) => {
        concat(result, (val, callback) => {
          request(val.url).pipe(fs.createWriteStream(`./files/${val.name}`))
          callback(null, undefined)
        })
      }], (err, result) => {
      if (err) {
        throw new Error(err)
      }
      console.log('Finished')
    })
  }
}
