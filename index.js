const waterfall = require('async').waterfall

const Downloader = require('./src/downloader')
const Ilgeniodellostreaming = require('./src/ilgeniodellostreaming')
/**
 * @param  {string} url The url of the page
 * @param  {number} times The number of episodes to download
 */
export default async (url, times) => {
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
