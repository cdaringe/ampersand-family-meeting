# ampersand-family-meeting

gather round, all.  we must be on our best behavior.

## what

applies batch updates to _all_ `ampersand-*` by means of PRs.

## how

configurably.

1. `npm search`es for all &-js packages
1. clones them, or pulls the latest (against master) // @TODO `checkout master` post clone, JIC
1. modifies the repo.  adds files, adds deps. pushes a PR back up.

## usage

1. some &-js packages really are _dead_.  most are alive.  see `ignore.js`, make sure you're down with it.
1. check out the cli options.  see `src/cli-args` so you know what you have available.  After my first search and pull, I toggle on `--use-cache`, `--no-clone`, and `--no-pull` for obvious reasons
1. decide how we need to update everyone.  see `src/apply-ampersand-family-agenda`.  hack it.
1. run it.  `node src/index.js -t GH_API_TOKEN --log-level=debug --use-cache --no-clone --no-pull`
    1. if you're installing `npm` deps in a gazillion packages, woof.  that can be slow.  i use nolan lawson's [local-npm](https://github.com/nolanlawson/local-npm) because it's dope!
