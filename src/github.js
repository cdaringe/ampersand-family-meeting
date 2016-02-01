var GitHubApi = require('github')
var github = new GitHubApi({
  version: '3.0.0'
})
var args = require('./cli-args')

github.authenticate({
  type: 'oauth',
  token: args.githubToken
})

module.exports = github
