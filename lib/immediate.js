'use strict';

// capture the global reference to guard against fakeTimer mocks
var _setImmediate = typeof setImmediate === 'function' && setImmediate;

var _delay = _setImmediate ? function immediate(fn) {
  // not a direct alias for IE10 compatibility
  _setImmediate(fn);
} : function timeout(fn) {
  setTimeout(fn, 0);
};

function nextTick() {
  if (typeof process === 'object' && typeof process.nextTick === 'function') {
    return process.nextTick;
  } else {
    return _delay;
  }
}

module.exports = _setImmediate ? _delay : nextTick();
