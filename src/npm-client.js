var RegClient = require('npm-registry-client')
module.exports = {
  client: new RegClient(),
  uriRoot: 'http://registry.npmjs.org/',
}
