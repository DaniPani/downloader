const fs = require('fs')
const ytdl = require('youtube-dl')
const ora = require('ora')
const concat = require('async').concat

module.exports = (result, callback) => {
  concat(result.links, (link, callback) => {
    let name
    let spinner = ora()
    if (link === ``) {
      return callback(null)
    }
    spinner.start('Fetching')
    const video = ytdl(link)
    let size
    let downloaded = 0

    video.on('info', info => {
      name = info._filename
      size = info.size
      video.pipe(fs.createWriteStream(`./files/${info._filename}`))
    })

    video.on('data', chunk => {
      downloaded += chunk.length
      spinner.text = `${name}
      Downloaded: ${(downloaded / size * 100).toFixed(2)}%, ${(downloaded / 1000000).toFixed(1)} of ${(size / 1000000).toFixed(0)}MB`
    })

    video.on('end', () => {
      spinner.succeed()
      callback(null)
    })
  })
  callback(null)
}
