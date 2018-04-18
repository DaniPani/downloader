const puppeteer = require('puppeteer')

module.exports = async function (url, times) {
  let first = ''
  let info = url.replace(/http:\/\/ilgeniodellostreaming\.org\/episodi\//g, '').replace(/\//g, '').split(/-/g)
  let [season,, episode] = info.pop()
  season = parseInt(season)
  episode = parseInt(episode)
  let promises = []

  const browser = await puppeteer.launch()

  const escapeAntiBot = async () => {
    await browser.newPage().then(async page => {
      await page.goto('http://ilgeniodellostreaming.org')
      await page.waitFor('.hbox')
      process.emit('downloader', {type: 0})
      await page.close()
    })
  }

  await escapeAntiBot()

  const search = async (ep) => {
    return browser.newPage().then(async page => {
      process.emit('downloader', {type: 1, name: `${info.join(' ')}`, season, ep})
      await page.setRequestInterception(true)
      page.on('request', request => {
        if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
          request.abort()
        } else {
          request.continue()
        }
      })
      await page.goto(`http://ilgeniodellostreaming.org/episodi/${info.join('-')}-${season}x${ep}/`, {waitUntil: 'domcontentloaded'})
      await page.waitFor('.metaframe.rptss')
      const src = await page.$eval('.metaframe.rptss', el => el.src)
      await page.close()
      return src.replace('embed', 'f')
    })
  }
  for (let index = 0; index < times; index++) {
    promises.push(search(episode))
    episode += 1
  }

  return Promise.all(promises).then(result => {
    process.emit('downloader', {type: 2, result})
    browser.close()
    let name = info.join(' ')
    return {name, 'links': [first, ...result]}
  })
}
