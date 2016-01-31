var path = require('path');
var repositoryDir = require('./config').repositoryDir;
var exec = require('child_process').exec;
var logger = require('./logger.js');
var async = require('async');

var branchName = 'feature/unify-the-family';
var retiredFiles = [
    '.testem.json',
    '.jshint',
    '.jshintrc'
];

var savePkgs = [
];

var saveDevPkgs = [
    'standard'
];

module.exports = function(pkg, cb) {
    logger.verbose('execing amp family agenda in', pkg);
    var pkgDir = path.resolve(repositoryDir, pkg);

    var reset = (cb) => {
        logger.verbose('reset', pkg);
        exec('git reset --hard', { cwd: pkgDir }, cb);
    }
    var clean = (cb) => {
        logger.verbose('clean', pkg);
        exec('git clean -f', { cwd: pkgDir }, cb);
    }

    var branch = (cb) => {
        logger.verbose('branch', pkg);
        if (!branchName) return cb(new ReferenceError('missing `branchName`'));
        exec('git checkout -b ' + branchName, { cwd: pkgDir }, (err) => {
            if (err) {
                if (err.message.match(/already exists/)) {
                    exec('git checkout ' + branchName, { cwd: pkgDir }, cb);
                    return;
                }
                return cb(err);
            }
            cb();
        });
    }

    var purge = (cb) => {
        exec('rm -f ' + retiredFiles.join(' '), { cwd: pkgDir }, cb);
    }


    var npmSave = (cb) => {
        logger.verbose('saving npm packages', savePkgs.join(' '), pkg);
        if (!savePkgs || !savePkgs.length) return cb();
        exec('npm i --save' + npmSave.join(' '), { cwd: pkgDir }, cb);
    }

    var npmSaveDev = (cb) => {
        logger.verbose('saving npm dev packages', saveDevPkgs.join(' '), pkg);
        if (!saveDevPkgs || !saveDevPkgs.length) return cb();
        exec('npm i --save-dev ' + saveDevPkgs.join(' '), { cwd: pkgDir }, cb);
    }

    var add = (cb) => {
        exec('git add .', { cwd: pkgDir }, cb);
    }

    var commit = (cb) => {
        if (!branchName) return cb(new ReferenceError('missing `branchName`'));
        exec(`git commit -m "deploy ${branchName}"`, { cwd: pkgDir }, cb);
    }

    async.series(
        [ reset, clean, branch, purge, npmSave, npmSaveDev, add, commit ],
        cb
    );
};
