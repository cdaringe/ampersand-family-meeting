var _ = require('lodash')
var app = require('./app')
var args = require('./cli-args.js')
var async = require('async')
var clone = require('./clone.js')
var zipPackageNamesWithRepoUrls = require('./zip-packages-with-repo-urls.js')

module.exports = function (opts, cb) {
  if (!opts || !opts.dir || !opts.packages) {
    throw new ReferenceError('clone `dir` and `package` required')
  }
  if (!opts.packages.length || !args.clone) return cb()
  var toClone = _.partial(_.without, opts.packages).apply(null, app.ignore)
  zipPackageNamesWithRepoUrls(toClone, (err, pkgsWithUrl) => {
    if (err) return cb(err)
    async.eachSeries(
      pkgsWithUrl,
      (pkg, _cb) => clone(pkg.package, opts.dir, pkg.url, _cb),
      cb
    )
  })
}
