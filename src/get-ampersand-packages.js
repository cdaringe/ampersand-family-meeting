const search = require('./search-npm.js')
const args = require('./cli-args.js')
const logger = require('./logger.js')
const PACKAGES = 'PACKAGES'
const _ = require('lodash')
var cache = require('./cache.js')

module.exports = function (cb) {
  if (args.useCache) {
    return cb(null, cache.get(PACKAGES))
  }
  logger.debug('searching for ampersand packages....')
  search({ search: 'ampersand-' }, function (err, rslt) {
    if (err) return cb(err)
    var pkgs = _.uniq(rslt.split(/\n/)
      .filter(line => line.match(/^ampersand-/))
      .map(line => line.match(/^ampersand-[a-zA-Z0-9-]+/)[0]))
    logger.debug(pkgs)
    cache.set(PACKAGES, pkgs)
    return cb(err, pkgs)
  })
}
