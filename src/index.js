var _ = require('lodash');
var async = require('async');
var path = require('path');
var args = require('./cli-args.js');
var config = require('./config.js');
require('./uncaught-unhandled.js');
var logger = require('./logger');
var clone = require('./clone.js');
var pull = require('./pull.js');
var getAmpersandPackages = require('./get-ampersand-packages.js');
var getRepoDirState = require('./get-repo-dir-state.js');
var applyAmpersandFamilyAgenda = require('./apply-ampersand-family-agenda.js');

getAmpersandPackages(function(err, packages) {
    if (err) throw err;
    packages = require('./apply-ignored')(packages);
    getRepoDirState({ dir: config.repositoryDir, packages: packages }, function(err, state) {
        if (err) throw err;
        var toClone = state.toClone;
        var toPull = state.toPull;
        clone({ dir: config.repositoryDir, packages: toClone }, function(err, rslt) {
            if (err) throw err;
            if (rslt && rslt.ignored && rslt.ignored.length) {
                packages = _.partial(_.without, packages).apply(packages, rslt.ignored);
            }
            pull({ dir: config.repositoryDir, packages: toPull }, function(err, rslt) {
                if (err) throw err;
                async.eachSeries(packages, applyAmpersandFamilyAgenda, function(err, cb) {
                    if (err) throw err;
                    logger.info('bananas times')
                });
            });
        });
    });
});
