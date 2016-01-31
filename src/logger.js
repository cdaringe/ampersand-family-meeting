var winston = require('winston'); // may use other transports later...
var args = require('./cli-args.js');
if (args.logLevel) {
    winston.level = args.logLevel;
}
module.exports = winston;
