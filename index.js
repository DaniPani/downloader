const fetcher = require('./src/fetcher')
const ilgeniodellostreaming = require('./src/ilgeniodellostreaming')
const EventEmitter = require('events')
const event = new EventEmitter()

module.exports = {
  /**
   * @param  {string} url The url of the page
   * @param  {number} times The number of episodes to download
   */
  'download': async function (url, times) {
    if (/^(htt(p|ps):\/\/ilgeniodellostreaming)/.test(url)) {
      let result = await ilgeniodellostreaming(url, times, event)
      return fetcher(result, event)
    }
  },
  event
}