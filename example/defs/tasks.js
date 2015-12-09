'use strict';

// Requirements

// 1. Leaf Nodes should arrest
// a->b -> c        -> g
//      -> d (fail) -> e
//                  -> f

module.exports = {
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
