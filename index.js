const waterfall = require('async').waterfall

const Downloader = require('./src/downloader')
const Ilgeniodellostreaming = require('./src/ilgeniodellostreaming')

module.exports = async (url, times) => {
  if (/^(http:\/\/ilgeniodellostreaming.org)/.test(url)) {
    waterfall([
      Ilgeniodellostreaming.bind(null, url, times),
      Downloader
    ], (err, result) => {
      if (err) {
        throw new Error(err)
      }
      process.emit('downloader', {type: 6})
    })
  }
}
