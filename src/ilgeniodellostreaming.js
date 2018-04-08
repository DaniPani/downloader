const puppeteer = require('puppeteer')
module.exports = async function (url) {
  let links = []
  let info = url.replace(/http:\/\/ilgeniodellostreaming\.org\/episodi\//g, '').replace(/\//g, '').split(/-/g)
  let [season,, episode] = info.pop()
  season = parseInt(season)
  episode = parseInt(episode)

  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
      request.abort()
    } else {
      request.continue()
    }
  })
  await page.goto(url)
  console.log('Loading:')
  while (!await page.$('.error404')) {
    console.log(`Season: ${season} Episode: ${episode}`)
    await page.waitFor('.metaframe.rptss')
    let src = await page.$eval('.metaframe.rptss', el => el.src)
    links.push(src.replace('embed', 'f'))
    episode = episode + 1
    await page.goto(`http://ilgeniodellostreaming.org/episodi/${info.join('-')}-${season}x${episode}/`, {waitUntil: 'domcontentloaded'})
  }
  await browser.close()

  let name = info.join(' ')
  return {name, links}
}
