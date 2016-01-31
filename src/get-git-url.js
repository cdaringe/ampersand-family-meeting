var uriRoot = require('./npm-client.js').uriRoot;
var client = require('./npm-client.js').client;
var logger = require('./logger.js');
var args = require('./cli-args.js');
var cache = require('./cache.js');
module.exports = function(pkg, cb) {
    var pkgUrlKey = 'GIT-URL-' + pkg;
    var cachedUrl;
    const url = uriRoot + pkg;
    try {
        if (args.useCache) {
            cachedUrl = cache.get(pkgUrlKey);
            if (cachedUrl) {
                return cb(null, cachedUrl);
            }
        }
    } catch(err) {
        // TODO handle like a smart person.
    }
    client.get(url, { timeout: 5000 }, function(err, data) {
        if (err) return cb(err);
        if (!data) {
            cb(new ReferenceError('npm returned no data regard pkg' + pkg));
        }
        if (!data.repository || (data.repository && !data.repository.url)) {
            return cb(new Error('no git url'));
        }
        cache.set(pkgUrlKey, data.repository.url);
        cb(null, data.repository.url);
    });
};
