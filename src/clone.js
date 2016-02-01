var cp = require('child_process')
var path = require('path')
var logger = require('./logger')
module.exports = function (pkg, dir, url, cb) {
  logger.debug('preping to clone', pkg)
  cp.exec(
    [ 'git', 'clone', url, pkg ].join(' '),
    {
      cwd: path.resolve(dir)
    },
    function (err) {
      if (err) {
        if (err.message.match(/Repository not found/)) {
          debugger
          console.warn(`${pkg} repo not found. check pkg url or if pkg has been scrapped`)
          return cb()
        }
        return cb(err)
      }
      cb()
    }
  )
}
