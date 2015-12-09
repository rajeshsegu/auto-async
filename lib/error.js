'use strict';

var TypedError = require('error/typed');

var DependencyError = TypedError({
  name: 'DependencyFailed',
  type: 'error',
  message: 'Failed to resolve task {key}',
  dependencies: null,
  failedDependencies: null
});

var CyclicDependencyError = TypedError({
  name: 'CyclicDependency',
  type: 'error',
  message: 'Cyclic dependency encountered for \'{key}\''
});

var MissingDependencyError = TypedError({
  name: 'MissingDependency',
  type: 'error',
  message: 'Missing dependency for \'{key}\''
});

module.exports = {
  DependencyError: DependencyError,
  CyclicDependencyError: CyclicDependencyError,
  MissingDependencyError: MissingDependencyError
};
