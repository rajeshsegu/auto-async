# auto-async

Auto magically resolves async dependencies on the fly and also eagerly walks though the tree instead of failing on the first error.

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
  }],
  d: ['c', function d(cb, results) {
    console.log('d');
    cb(true, {key: 'd'});
  }],
  e: ['d', function e(cb, results) {
    console.log('e');
    cb(true, {key: 'e'});
  }],
  f: ['e', function f(cb, results) {
    console.log('f');
    cb(null, {key: 'f'});
  }],
  g: ['c', function g(cb, results) {
    console.log('g');
    cb(null, {key: 'g'});
  }]
};

autoAsync(asyncDef, function onResponse(err, results, state) {
    // err - in case graph fails
    // results - all resolved nodes
    // state - status of each node err/response
});
```

By default autoAsync() fails on the first error just like async.auto(), but you could enable `continueOnError` by passing an extra boolean.

```
autoAsync(asyncDef, function onResponse(err, results, state) {
    // err - in case graph fails
    // results - all resolved nodes
    // state - status of each node err/response
}, true);
```

