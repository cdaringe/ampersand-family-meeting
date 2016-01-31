var _ = require('lodash')
var logger = require('./logger')
module.exports = function (packages) {
  try {
    var filtered
    var oldLen = packages.length
    var ignored = require('../ignored.js')
    filtered = _.partial(_.without, packages).apply(packages, ignored)
    var newLen = filtered.length
    var diff = oldLen - newLen
    if (diff) {
      logger.verbose(`${diff} packages have been ignored`)
    }
    return filtered
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err
    }
  }
}
