const waterfall = require('async').waterfall

const downloader = require('./src/downloader')
const ilgeniodellostreaming = require('./src/ilgeniodellostreaming')

module.exports = (url, times) => {
  if (/^(http:\/\/ilgeniodellostreaming.org)/.test(url)) {
    waterfall([
      ilgeniodellostreaming.bind(null, url, times),
      downloader
    ], (err, result) => {
      if (err) {
        throw new Error(err)
      }
    })
  }
}
