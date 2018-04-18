const fs = require('fs')
const ytdl = require('youtube-dl')
const concat = require('async').concat

module.exports = (result, callback) => {
  concat(result.links, (link, callback) => {
    if (link === ``) {
      return callback(null)
    }
    const video = ytdl(link)
    let downloaded = 0
    let info

    video.on('info', data => {
      process.emit('downloader', {type: 3, data})
      info = data
      video.pipe(fs.createWriteStream(`./files/${data._filename}`))
    })

    video.on('data', chunk => {
      downloaded += chunk.length
      process.emit('downloader', {type: 4, info, downloaded})
    })

    video.on('end', () => {
      process.emit('downloader', {type: 5, info})
      callback(null)
    })
  })
  callback(null)
}
