'use strict';

var error = require('./error');
var dezalgo = require('dezalgo');
var objectMap = require('object.map');
var setImmediate = require('./immediate');
var taskQueue = require('./queue');
var xtend = require('xtend');

module.exports = autoAsync;

function autoAsync(tasksDef, cb, continueOnError) {
  if (cb) {
    cb = dezalgo(cb);
  }

  var results = {};
  var state = {};
  var exited = false;

  var tasks = processTasks(tasksDef);
  var taskKeys = Object.keys(tasks);

  var remaining = taskKeys.length;
  if (!remaining) {
    return cb(null, results, state);
  }

  var tasksQ = taskQueue();

  tasksQ.add(function whenDone() {
    if (!remaining && cb) {
      var _cb = cb;
      // prevent final cb from calling itself if it errors
      cb = null;
      _cb(null, results, state);
    }
  });

  function completeTask() {
    remaining -= 1;
    tasksQ.all().forEach(function execute(fn) {
      fn();
    });
  }

  taskKeys.forEach(function process(key) {
    var task = tasks[key];
    var requires = task.requires;
    var taskFn = task.action;

    function taskCallback(err) {
      var args = Array.prototype.slice.call(arguments, 1);
      if (args.length <= 1) {
        args = args[0];
      }

      if (err) {
        setState(err, null);
        if (continueOnError) {
          results[key] = null;
          setImmediate(completeTask);
        } else {
          exited = true;
          if (cb) {
            var safeResults = xtend(results);
            safeResults[key] = args;
            cb(err, safeResults, state);
          }
          // stop subsequent errors hitting cb multiple times
          cb = null;
        }
      } else {
        setState(null, args);
        results[key] = args;
        setImmediate(completeTask);
      }
    }

    function setState(err, resp) {
      state[key] = {
        error: err,
        response: resp
      };
    }

    function ready() {
      var taskReady = requires.reduce(function (a, x) {
        return a && results.hasOwnProperty(x);
      }, true);

      return taskReady && !results.hasOwnProperty(key);
    }

    function canResolve() {
      var taskReady = requires.reduce(function (a, x) {
        return a
          && state.hasOwnProperty(x)
          && !state[x].error;
      }, true);

      return taskReady
        && !results.hasOwnProperty(key)
        && !exited;
    }

    function resolveError() {
      var failedRequires = requires.filter(function (x) {
        return !!state[x].error;
      });
      return error.DependencyError({
        key: key,
        dependencies: requires,
        failedDependencies: failedRequires
      });
    }

    function resolve() {
      if (canResolve()) {
        taskFn(taskCallback, results, state);
      } else {
        if (!exited) {
          taskCallback(resolveError());
        }
      }
    }

    if (ready()) {
      resolve();
    } else {
      var listener = function () {
        if (ready()) {
          tasksQ.remove(listener);
          resolve();
        }
      };
      tasksQ.add(listener);
    }
  });
}

function processTasks(tasks) {
  return objectMap(tasks, function process(task, key) {
    var requires = Array.isArray(task)
      ? task.slice(0, task.length - 1)
      : [];

    var taskFn = Array.isArray(task)
      ? task[task.length - 1]
      : task;

    function checkMissingDependency() {
      var len = requires.length;
      while (len--) {
        if (!tasks[requires[len]]) {
          throw new error.MissingDependencyError({
            key: key
          });
        }
      }
    }

    function checkCyclicDependency() {
      var len = requires.length;
      var dep;
      while (len--) {
        dep = tasks[requires[len]];
        if (Array.isArray(dep) && dep.indexOf(key) >= 0) {
          throw new error.CyclicDependencyError({
            key: key
          });
        }
      }
    }

    checkMissingDependency();
    checkCyclicDependency();

    return {
      requires: requires,
      action: taskFn
    };
  });
}

