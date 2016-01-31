var fs = require('fs');
var _ = require('lodash');

/**
 * provided a dir and a set of package names, determine which packages already
 * exist and should be pulled, and those that shall be cloned
 */
module.exports = function(opts, cb) {
    if (!opts || !opts.dir || !opts.packages) {
        throw new ReferenceError('`dir` required');
    }
    fs.readdir(opts.dir, function(err, files) {
        if (err) return cb(err);
        var ampersandDirs = _.filter(files, f => f.match(/^ampersand/));
        var toClone = _.partial(_.without, opts.packages).apply(null, ampersandDirs);
        cb(null, { toClone: toClone, toPull: ampersandDirs });
    });
};
