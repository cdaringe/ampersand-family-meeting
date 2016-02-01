var uriRoot = require('./npm-client.js').uriRoot
var client = require('./npm-client.js').client
var args = require('./cli-args.js')
var cache = require('./cache.js')
var handleNoRepoUrl = require('./handle-no-repository-url')
var app = require('./app')
var memoizeCache = {}

module.exports = function (pkg, cb) {
  var pkgUrlKey = 'GIT-URL-' + pkg
  var cachedUrl
  const handleIgnored = (err, cmd) => {
    if (err) return cb(err)
    if (!cmd || !cmd.ignored) {
      return cb(
        new Error('invalid state. error should have been ignored or process exited')
      )
    }
    memoizeCache[cmd.package] = 'ignore'
    app.ignore.push(cmd.package)
    return cb(null, 'ignore')
  }
  // attempt to get url from caches (in mem cache OR fs cache)
  if (memoizeCache[pkg]) {
    if (memoizeCache[pkg].match(/ignore/)) {
      return cb(new ReferenceError([
        'package has already been ignored.',
        'should not have requested it again'
      ].join(' ')))
    }
    return cb(null, memoizeCache[pkg])
  }
  const url = uriRoot + pkg
  try {
    if (args.useCache) {
      cachedUrl = cache.get(pkgUrlKey)
      if (cachedUrl) {
        memoizeCache[pkg] = cachedUrl
        return cb(null, cachedUrl)
      }
    }
  } catch (err) {
    // TODO handle like a smart person.
  }
  // otherwise get from remote
  client.get(url, { timeout: 5000 }, function (err, data) {
    var url
    if (err) {
      return handleNoRepoUrl(pkg, err.message, handleIgnored)
    }
    if (!data) {
      return cb(new ReferenceError('npm returned no data regard pkg' + pkg))
    }
    if (!data.repository || (data.repository && !data.repository.url)) {
      return handleNoRepoUrl(pkg, 'no git url', handleIgnored)
    } else {
      url = data.repository.url
      if (url.match(/git\+/)) {
        url = url.replace(/git\+/, '')
      }
      if (url.match('git://')) {
        url = url.replace('git://', 'http://')
      }
    }
    cache.set(pkgUrlKey, url)
    memoizeCache[pkg] = url
    cb(null, url)
  })
}
