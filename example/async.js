'use strict';

var autoAsync = require('../lib/auto-async');
var asyncDef = require('./defs/tasks');
var continueOnError = true;

autoAsync(asyncDef, function onResponse(err, results, state) {
  console.log('onResponse =>');
  console.log(results);

  console.log('state =>');
  console.log(state);

  console.log('error =>');
  console.log(err);

  //console.log(JSON.stringify(state, null, 2));
}, continueOnError);


