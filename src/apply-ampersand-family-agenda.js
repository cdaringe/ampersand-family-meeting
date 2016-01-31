var path = require('path')
var repositoryDir = require('./config').repositoryDir
var exec = require('child_process').exec
var logger = require('./logger.js')
var github = require('github');
var async = require('async')

var branchName = 'feature/unify-the-family'
var retiredFiles = [
  '.testem.json',
  '.jshint',
  '.jshintrc'
]

var savePkgs = []

var saveDevPkgs = [
  'standard@5.4.1'
]

module.exports = function (pkg, cb) {
  logger.verbose('execing amp family agenda in', `(${pkg})`)
  var pkgDir = path.resolve(repositoryDir, pkg)

  var reset = (cb) => {
    logger.verbose('reset', `(${pkg})`)
    exec('git reset --hard', { cwd: pkgDir }, cb)
  }
  var clean = (cb) => {
    logger.verbose('clean', `(${pkg})`)
    exec('git clean -f', { cwd: pkgDir }, cb)
  }

  var branch = (cb) => {
    logger.verbose('branch', `(${pkg})`)
    if (!branchName) return cb(new ReferenceError('missing `branchName`'))
    exec('git checkout -b ' + branchName, { cwd: pkgDir }, (err) => {
      if (err) {
        if (err.message.match(/already exists/)) {
          exec('git checkout ' + branchName, { cwd: pkgDir }, cb)
          return
        }
        return cb(err)
      }
      cb()
    })
  }

  var purge = (cb) => {
    logger.verbose('purge', `(${pkg})`)
    exec('rm -f ' + retiredFiles.join(' '), { cwd: pkgDir }, cb)
  }

  var npmSave = (cb) => {
    // @TODO test more intelligently if package already installed to prevent npm call
    logger.verbose('saving npm packages', savePkgs.join(' '), `(${pkg})`)
    if (!savePkgs || !savePkgs.length) return cb()
    exec('npm i --save' + npmSave.join(' '), { cwd: pkgDir }, cb)
  }

  var npmSaveDev = (cb) => {
    // @TODO test more intelligently if package already installed to prevent npm call
    logger.verbose('saving npm dev packages', saveDevPkgs.join(' '), `(${pkg})`)
    if (!saveDevPkgs || !saveDevPkgs.length) return cb()
    exec('npm i --save-dev ' + saveDevPkgs.join(' '), { cwd: pkgDir }, cb)
  }

  var add = (cb) => {
    exec('git add .', { cwd: pkgDir }, cb)
  }

  var commit = (cb) => {
    if (!branchName) return cb(new ReferenceError('missing `branchName`'))
    exec('git commit -m "deploy ' + branchName + '"', { cwd: pkgDir }, (err, stdout) => {
        if (err) {
            if (stdout.match(/directory clean/)) {
                return cb();
            }
            return cb(err);
        }
        cb();
    })
  }

  var pr = (cb) => {
    if (!branchName) return cb(new ReferenceError('missing `branchName`'))
    // http://mikedeboer.github.io/node-github/#pullRequests.prototype.create
    // pullRequests#create(msg, callback)null
    // msgObjectObject that contains the parameters and their values to be sent to the server.
    // callbackFunctionfunction to call when the request is finished with an error as first argument and result data as second argument.
    // Params on the msg object:
    // headers (Object): Optional. Key/ value pair of request headers to pass along with the HTTP request. Valid headers are: 'If-Modified-Since', 'If-None-Match', 'Cookie', 'User-Agent', 'Accept', 'X-GitHub-OTP'.
    // user (String): Required.
    // repo (String): Required.
    // title (String): Required.
    // body (String): Optional.
    // base (String): Required. The branch (or git ref) you want your changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repo that requests a merge to a base of another repo.
    // head (String): Required. The branch (or git ref) where your changes are implemented.

  }

  async.series(
    [ reset, clean, branch, purge, npmSave, npmSaveDev, add, commit, pr ],
    cb
  )
}
