# auto-async

Auto magically resolves async dependencies on the fly. In addition to what `async.auto` and `autorun` does, auto-async does resolve all the possible async tasks by not stopping on the first error.

## Usage

```javascript
var autoAsync = require('auto-async');
autoAsync(asyncDef, callback, continueOnError);
```

## Code

```javascript
var autoAsync = require('auto-async');

var asyncDef = {
  a: function a(cb, results) {
    console.log('a');
    cb(null, {key: 'a'});
  },
  b: ['a', function b(cb, results) {
    console.log('b');
    cb(null, {key: 'b'});
  }],
  c: ['b', function c(cb, results) {
    console.log('c');
    cb(null, {key: 'c'});
  }]
};

autoAsync(asyncDef, function onResponse(err, results, state) {
    // err - first error encountered
    // results - all resolved nodes
    // state - status of each node err/response
});
```

### continueOnError

continueOnError flag controls if the async resolution should stop on the first error or continue to resolve as many async tasks as possible.

```
autoAsync(asyncDef, function onResponse(err, results, state) {
    // err - in case graph fails
    // results - all possible resolved nodes
    // state - status of each node err/response
}, true);
```