const program = require('commander')
const downloader = require('../')

program
  .command('download <url> <times>')
  .description('Download all video in series')
  .action((url, times) => downloader(url, times))

program.parse(process.argv)
