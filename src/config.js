var os = require('os');
var path = require('path');
var appDir = path.join(os.tmpdir(), 'ampersand-family-meeting');
var cacheDir = path.join(appDir, 'cache');
var repositoryDir = path.join(appDir, 'repositories');
var logger = require('./logger');
require('mkdirp').sync(appDir);
require('mkdirp').sync(repositoryDir);
logger.debug('application dir:', appDir);
module.exports = {
    appDir: appDir,
    cacheDir: cacheDir,
    repositoryDir: repositoryDir,
};
