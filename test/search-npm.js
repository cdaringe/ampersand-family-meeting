var test = require('tape');
var search = require('../src/search-npm.js');

test('search npm', function(t) {
    t.plan(2);
    search({ search: 'ampersand-' }, function(err, rslt) {
        if (err) t.fail(err);
        t.ok(typeof rslt === 'string', 'npm search returns string');
        t.ok(rslt.match(/ampersand-/), 'ampersand packages indeed exist');
        t.end();
    });
})
