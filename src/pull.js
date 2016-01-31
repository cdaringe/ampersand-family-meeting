var fs = require('fs');
var cp = require('child_process');
var path = require('path');
var args = require('./cli-args.js');
var async = require('async');
var getGitUrl = require('./get-git-url.js');

module.exports = function(opts, cb) {
    if (!opts || !opts.dir || !opts.packages) {
        throw new ReferenceError('pull `dir` and `package` required');
    }
    if (!opts.packages.length || !args.pull) return cb();
    var pull = function(pkg, cb) {
        getGitUrl(pkg, function(err, url) {
            cp.exec(
                'git pull',
                { cwd: path.resolve(opts.dir, pkg) },
                cb
            );
        })
    };
    async.eachLimit(opts.packages, 3, pull, cb);
};
