const puppeteer = require('puppeteer')

/**
 * Web Crawler for ilgeniodellostreaming
 * @param  {string} url The url of the page
 * @param  {number} times The number of episodes to download
 */

module.exports = async function (url, times, event) {
  let season = parseInt(url.match(/(\d+)(?=x)/gi)[0])
  let episode = parseInt(/(?:x)(\d+)/gi.exec(url)[1])

  let promises = []

  const browser = await puppeteer.launch()

  const escapeAntiBot = async () => {
    event.emit('escapingAntiBot')
    let page = await browser.newPage()
    await page.goto('http://ilgeniodellostreaming.in')
    await page.waitFor('.hbox')
    await page.close()
  }

  await escapeAntiBot()

  event.emit('escapedAntiBot')

  const search = async ep => {
    let page = await browser.newPage()

    await page.setRequestInterception(true)
    page.on('request', request => {
      if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
        request.abort()
      } else {
        request.continue()
      }
    })

    let link = url.replace(/(?:x)(\d+)/gi, `x${ep}`).replace(/(\d+)(?=x)/gi, season)

    await page.goto(link, {
      waitUntil: 'domcontentloaded'
    })

    if (await page.$('.no-result') !== null) {
      event.emit('error', 'Video not found')
      return null
    }
    await page.waitFor('.metaframe.rptss')
    let src = await page.$eval('.metaframe.rptss', el => el.src)
    await page.close()
    event.emit('extracted', ep)
    return src.replace('embed', 'f')
  }

  for (let index = 0; index < times; index++) {
    promises.push(search(episode))
    episode += 1
  }

  let links = await Promise.all(promises)

  await browser.close()

  event.emit('extractedAll')

  return {
    'name': /(?:htt(p|ps):\/\/ilgeniodellostreaming\.in\/episodi\/)(.+[A-Z0-9](?=-\dx))/gi.exec(url)[2].replace(/-/g, ' '),
    links
  }
}