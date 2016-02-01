var _ = require('lodash')
var app = require('./app')
var args = require('./cli-args') // eslint-disable-line
var async = require('async')
var config = require('./config.js')
require('./uncaught-unhandled.js')
var logger = require('./logger')
var clone = require('./bulk-clone.js')
var pull = require('./bulk-pull.js')
var fork = require('./bulk-fork.js')
var getAmpersandPackages = require('./get-ampersand-packages.js')
var getRepoDirState = require('./get-repo-dir-state.js')
var applyAmpersandFamilyAgenda = require('./apply-ampersand-family-agenda.js')

getAmpersandPackages(function (err, packages) {
  if (err) throw err
  packages = _.partial(_.without, packages).apply(null, app.ignore)
  getRepoDirState({ dir: config.repositoryDir, packages: packages }, function (err, repoDirState) {
    if (err) throw err
    var nonExistant = repoDirState.nonExistant
    var existantRepos = repoDirState.existant
    fork({ dir: config.repositoryDir, packages: nonExistant }, function (err, rslt) {
      if (err) throw err
      clone({ dir: config.repositoryDir, packages: rslt.forked }, function (err, rslt) {
        if (err) throw err
        pull({ dir: config.repositoryDir, packages: existantRepos }, function (err, rslt) {
          if (err) throw err
          async.eachSeries(packages, applyAmpersandFamilyAgenda, function (err) {
            if (err) throw err
            logger.info('bananas times')
          })
        })
      })
    })
  })
})
