var GitHubApi = require("github")
var github = new GitHubApi({
  version: "3.0.0"
})
var prompt = require('prompt')
var args = require('./cli-args')

module.exports = {
    github: github,
}
github.authenticate({
  type: 'oauth',
  token: args.token
})
