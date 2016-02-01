var cp = require('child_process')
module.exports = function (dir, cb) {
  cp.exec(
    'git pull',
    { cwd: dir },
    cb
  )
}
