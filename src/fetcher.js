const fs = require('fs')
const ytdl = require('youtube-dl')

module.exports = async ({
  name,
  links
}, event) => {
  fs.stat(`./${name}/`, err => {
    if (err) {
      fs.mkdir(`./${name}/`, err => {
        if (err) throw err;
        event.emit('folderCreated')
      })
    }
  })

  const download = async link => {
    if (!link) {
      return
    }
    let downloaded = 0
    let info

    let downloader = ytdl(link)

    event.emit('fetching', link)

    downloader.on('data', chunk => {
      downloaded += chunk.length
      event.emit('downloading', link, `${Math.round((downloaded / info.size) * 100 * 100)/ 100} %`)
    })

    return downloader.on('info', data => {
      event.emit('info', link, data)
      info = data
      downloader.pipe(fs.createWriteStream(`./${name}/${data._filename}`))
    })
  }


  let promises = []

  for (const link of links) {
    promises.push(download(link))
  }

  return Promise.all(promises)

}