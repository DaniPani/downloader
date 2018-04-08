const program = require('commander')
const downloader = require('../')

program
  .command('download <url>')
  .description('Download all video in series')
  .action(url => downloader(url))

program.parse(process.argv)
