const cp = require('child_process');

module.exports = function(opts, cb) {
    cp.exec('npm search ' + opts.search, { stdio: 'inherit' }, function(err, stdout) {
        if (err) return cb(err);
        cb(err, stdout.toString());
    });
};
