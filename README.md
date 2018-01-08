# ampersand-family-meeting

[![Greenkeeper badge](https://badges.greenkeeper.io/cdaringe/ampersand-family-meeting.svg)](https://greenkeeper.io/)

gather round, all.  we must be on our best behavior.

<img src="https://raw.githubusercontent.com/cdaringe/ampersand-family-meeting/master/img/hold-hands.png" height="100px" />

## what

applies batch updates to _all_ `ampersand-*` by means of PRs.

## how

configurably.

1. `npm search`es for all &-js packages
1. forks them, clones them, pulls the latest on the default branch
1. modifies the repo based on &-js team wishes
2. commit changes
3. issues a PR

## usage

1. some &-js packages really are _dead_.  most are alive.  see `ignore.js`, make sure you're down with it.
1. check out the cli options.  see `src/cli-args` so you know what you have available.  After my first search and pull, I toggle on `--use-cache`, `--no-clone`, and `--no-pull` for obvious reasons
1. decide how we need to update everyone.  see `src/apply-ampersand-family-agenda`.  hack it.
1. run it.  `node src/index.js -t GH_API_TOKEN -u cdaringe --use-cache --no-clone --no-pull --log-level=debug`
    1. if you're installing `npm` deps in a gazillion packages, woof.  that can be slow.  i use nolan lawson's [local-npm](https://github.com/nolanlawson/local-npm) because it's dope!

# TODO
- --no-fork has no means of passing up the forked url.  cache fork urls
