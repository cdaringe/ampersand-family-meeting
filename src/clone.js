var cp = require('child_process')
var path = require('path')
var args = require('./cli-args.js')
var async = require('async')
var getGitUrl = require('./get-git-url.js')
var logger = require('./logger.js')
var prompt = require('prompt')
var possibleProblemPackages = []

var cloneSingle = function (pkg, dir, cb) {
  logger.debug('preping to clone', pkg)
  getGitUrl(pkg, function (err, url) {
    if (err) {
      if (err.message.match(/404/)) {
        possibleProblemPackages.push({
          package: pkg,
          message: `${pkg} deprecated? 404s generally mean bad juju for that pkg`
        })
        return cb()
      } else if (err.message.match(/no git url/)) {
        possibleProblemPackages.push({
          package: pkg,
          message: 'no git url'
        })
        return cb()
      } else {
        return cb(err)
      }
    }
    if (url.match(/git\+/)) {
      url = url.replace(/git\+/, '')
    }
    cp.exec(
      [ 'git', 'clone', url, pkg ].join(' '),
      {
        cwd: path.resolve(dir)
      },
      function (err) {
        if (err) {
          if (err.message.match(/Repository not found/)) {
            possibleProblemPackages.push({
              package: pkg,
              message: `${pkg} repo not found.  check pkg url or if pkg has been scrapped`
            })
            return cb()
          }
          return cb(err)
        }
        cb()
      }
    )
  })
}

const handlePossibleProblemPackages = function (cb) {
  console.log('The following packages may have issues and will be otherwise disregarded:')
  possibleProblemPackages.forEach(ppp => {
    console.log(ppp.package + ': ' + ppp.message)
  })
  console.log('Would you like to proceed anyway? (y/n)')
  prompt.start()
  prompt.get(
    {
      properties: {
        proceed: {
          pattern: /^[yYnN]$/,
          message: 'please enter `y` or `n`',
          required: true
        }
      }
    },
    function (err, result) {
      if (err) cb(err)
      if (result.proceed.toLowerCase() === 'n') {
        process.exit(1)
      }
      cb({
        ignored: possibleProblemPackages.map(ppp => ppp.package)
      })
    }
  )
}

module.exports = function (opts, cb) {
  if (!opts || !opts.dir || !opts.packages) {
    throw new ReferenceError('clone `dir` and `package` required')
  }
  if (!opts.packages.length || !args.clone) return cb()
  async.eachSeries(
    opts.packages,
    function (pkg, _cb) {
      cloneSingle(pkg, opts.dir, _cb)
    },
    function (err) {
      if (possibleProblemPackages.length) {
        return handlePossibleProblemPackages(cb)
      }
      if (err) return cb(err)
      cb()
    }
  )
}
