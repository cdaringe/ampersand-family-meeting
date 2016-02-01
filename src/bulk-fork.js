var _ = require('lodash')
var app = require('./app')
var args = require('./cli-args.js')
var fork = require('./fork.js')
var zipPackageNamesWithRepoUrls = require('./zip-packages-with-repo-urls.js')
var async = require('async')
module.exports = function (opts, cb) {
  if (!opts || !opts.dir || !opts.packages) {
    throw new ReferenceError('fork `dir` and `package` required')
  }
  if (!opts.packages.length || args.fork === false) return cb(null, { forked: [] })
  var toFork = _.partial(_.without, opts.packages).apply(null, app.ignore)
  zipPackageNamesWithRepoUrls(toFork, (err, pkgsWithUrl) => {
    if (err) return cb(err)
    async.eachSeries(
      pkgsWithUrl,
      (pkg, cb) => fork(pkg.package, pkg.url, cb),
      (err, rslt) => {
        if (err) return cb(err)
        var forked = pkgsWithUrl.map(p => p.package)
        cb(null, { forked: forked })
      }
    )
  })
}
