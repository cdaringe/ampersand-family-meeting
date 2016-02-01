var github = require('./github.js')
var logger = require('./logger')
module.exports = function (pkg, url, cb) {
  logger.debug('preping to fork', pkg)
  var forkFromUser
  try {
    forkFromUser = url.match('([^/]*)\/' + pkg + '(.git)?$')[1]
  } catch (err) {
    logger.error([
      'unable to extract user from git url', pkg + '.',
      'improve the regex, or see why', url, 'is wonky.',
      'does the git url not have pkg name in it?'
    ].join(' '))
    return cb(err)
  }
  github.repos.fork({
    user: forkFromUser,
    repo: pkg
  }, (err, rslt) => {
    if (err) return cb(err)
    cb(err, rslt.html_url)
  })
}
