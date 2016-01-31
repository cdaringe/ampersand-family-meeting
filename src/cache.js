var path = require('path');
var config = require('./config.js');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage(path.join(config.cacheDir));

module.exports = {
    get: function(key) {
        return JSON.parse(localStorage.getItem(key));
    },
    set: function(key, val) {
        return localStorage.setItem(key, JSON.stringify(val));
    }
}
