var program = require('commander')
var path = require('path')
var app = require('./app')
program
  .option('--no-fork', 'skip forking any new repos')
  .option('--no-clone', 'do not clone any new repos')
  .option('--no-pull', 'do not pull the latest in each repo')
  .option('--use-cache', 'use cached versions of ampersand-* packages (cached on every search)')
  .option('--log-level [level]', '`winston` log levels')
  .option('-t --github-token [token]', 'github token, used for submitting prs')
  .option('-u --github-user [user]', 'github user, used for forking repos')
  .option('-i --ignore-file [path]', "file exporting array of modules to ignore (e.g. module.exports = ['ampersand-silly'])")
  .parse(process.argv)

if (!program.githubToken) {
  throw new ReferenceError('no github token provided.  PR submission will fail')
}
if (!program.githubUser) {
  throw new ReferenceError('no github user provided.  PR submission will fail')
}
if (program.ignoreFile) {
  app.ignore = app.ignore.concat(require(path.resolve(program.ignoreFile)))
}
module.exports = program
