var winston = require('winston')
var args = require('./cli-args.js')
if (args.logLevel) {
  winston.level = args.logLevel
}
module.exports = winston
