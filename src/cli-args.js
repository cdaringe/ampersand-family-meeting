var program = require('commander')

program
  .option('--no-clone', 'do not clone any new repos')
  .option('--no-pull', 'do not pull the latest in each repo')
  .option('--use-cache', 'use cached versions of ampersand-* packages (cached on every search)')
  .option('--log-level [level]', '`winston` log levels')
  .parse(process.argv)
module.exports = program
