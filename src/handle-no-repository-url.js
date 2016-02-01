// returns an obj { ignore: pkgName } (as the callers do) with value `ignored` or process exits on user request
var prompt = require('prompt')
module.exports = function (pkg, errMsg, cb) {
  console.log(
    'Unable to find URL for package',
    pkg + '.',
    'Would you like to proceed anyway? (y/n)'
  )
  prompt.start()
  prompt.get(
    {
      properties: {
        proceed: {
          pattern: /^[yYnN]$/,
          message: 'please enter `y` or `n`',
          required: true
        }
      }
    },
    function (err, result) {
      if (err) return cb(err)
      if (result.proceed.toLowerCase() === 'n') {
        process.exit(1)
      }
      // otherwise, yea, proceed
      cb(null, { ignore: true, package: pkg })
    }
  )
}
