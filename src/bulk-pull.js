var _ = require('lodash')
var app = require('./app')
var path = require('path')
var args = require('./cli-args.js')
var async = require('async')
var pull = require('./pull.js')

module.exports = function (opts, cb) {
  if (!opts || !opts.dir || !opts.packages) {
    throw new ReferenceError('pull `dir` and `package` required')
  }
  if (!opts.packages.length || !args.pull) return cb()
  var toPull = _.partial(_.without, opts.packages).apply(null, app.ignore)
  async.eachLimit(
    toPull,
    3, // pull 3 dirs simultaneously
    (pkg, cb) => pull(path.resolve(opts.dir, pkg), cb),
    cb
  )
}
