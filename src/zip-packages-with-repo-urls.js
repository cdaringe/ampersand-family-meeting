var gitUrl = require('./get-git-url')
var async = require('async')
module.exports = function (pkgs, cb) {
  if (!pkgs) return cb(new ReferenceError('expected pkgs'))
  if (typeof pkgs === 'string') pkgs = [ pkgs ]
  if (!pkgs.length) return cb(null, [])
  var urls = []
  var aggregateUrls = (pkg, cb) => {
    gitUrl(pkg, (err, url) => {
      if (err) return cb(err)
      urls.push(url)
      cb()
    })
  }
  async.eachSeries(pkgs, aggregateUrls, (err) => {
    if (err) return cb(err)
    var zipped = []
    urls.forEach((url, ndx) => {
      zipped.push({ package: pkgs[ndx], url: url })
    })
    cb(null, zipped)
  })
}
