var logger = require('./logger')

const logError = function (err) {
  logger.error(err)
  logger.error(err.stack)
}

process.on('uncaughtException', logError)
process.on('unhandledRejection', logError)
