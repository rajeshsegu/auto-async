'use strict';

var autoAsync = require('../');
var scotchTape = require('scotch-tape');

var test = scotchTape();

test('auto-async', function run(it) {
  it('should export correctly', function should(t) {
    t.ok(typeof autoAsync === 'function', 'auto-async exported correctly');
    t.end();
  });
});
